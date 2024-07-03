import { Injectable } from "@nestjs/common";
import {
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client
} from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";
import { Readable } from "stream";
import { v4 as uuidv4 } from "uuid";
import { DeleteImageFilesResponse } from "./models/delete-image-files.response";

@Injectable()
export class SessionImageService {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      endpoint: this.configService.get<string>("MINIO_ENDPOINT"),
      region: this.configService.get<string>("MINIO_REGION"),
      credentials: {
        accessKeyId: this.configService.get<string>("MINIO_ACCESS_KEY"),
        secretAccessKey: this.configService.get<string>("MINIO_SECRET_KEY")
      },
      forcePathStyle: true
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const fileName = this.createFileName();
    const uploadParams = {
      Bucket: this.configService.get<string>("MINIO_SESSION_IMAGE_BUCKET"),
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    const command = new PutObjectCommand(uploadParams);
    await this.s3Client.send(command);
    return fileName;
  }

  async getImageFile(fileName: string): Promise<Readable> {
    const downloadParams = {
      Bucket: this.configService.get<string>("MINIO_SESSION_IMAGE_BUCKET"),
      Key: fileName
    };

    const downloadCommand = new GetObjectCommand(downloadParams);
    const data = await this.s3Client.send(downloadCommand);
    return data.Body as Readable;
  }

  async listAllImageFileNames(): Promise<string[]> {
    const listParams = {
      Bucket: this.configService.get<string>("MINIO_SESSION_IMAGE_BUCKET")
    };
    const listCommand = new ListObjectsV2Command(listParams);
    let isTruncated = true;
    let contents = [];

    while (isTruncated) {
      const response = await this.s3Client.send(listCommand);

      if (response.Contents) {
        contents.push(...response.Contents);
      }

      isTruncated = response.IsTruncated;
      if (isTruncated) {
        listCommand.input.ContinuationToken = response.NextContinuationToken;
      }
    }

    return contents.map(s => s.Key);
  }

  async deleteImageFiles(keys: string[]): Promise<DeleteImageFilesResponse> {
    const objects = keys.map(key => ({ Key: key }));

    const deleteObjectsParams = {
      Bucket: this.configService.get<string>("MINIO_SESSION_IMAGE_BUCKET"),
      Delete: {
        Objects: objects,
        Quiet: false
      }
    };

    const deleteCommand = new DeleteObjectsCommand(deleteObjectsParams);
    const response = await this.s3Client.send(deleteCommand);

    if (response.Errors && response.Errors.length > 0){
      throw new Error(response.Errors.map(e => e.Message).join(";\n"))
    }

    return {
      deletedFilesCount: response.Deleted.length,
      deletedTimestamp: new Date()
    }
  }

  private createFileName(): string {
    const timestamp = Date.now().toString();
    const uuid = uuidv4();
    return `${timestamp}-${uuid}`;
  }
}