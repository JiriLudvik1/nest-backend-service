import { Injectable } from "@nestjs/common";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";
import { Readable } from "stream";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SessionImageService {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      endpoint: this.configService.get<string>("MINIO_ENDPOINT"),
      region: this.configService.get<string>("MINIO_REGION"),
      credentials: {
        accessKeyId: this.configService.get<string>("MINIO_ACCESS_KEY"),
        secretAccessKey: this.configService.get<string>("MINIO_SECRET_KEY"),
      },
      forcePathStyle: true
    })
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const fileName = this.createFileName();
    const uploadParams = {
      Bucket: this.configService.get<string>("MINIO_SESSION_IMAGE_BUCKET"),
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype
    }

    const command = new PutObjectCommand(uploadParams);
    await this.s3Client.send(command);
    return fileName;
  }

  async getImageFile(fileName: string): Promise<Readable>{
    const downloadParams ={
      Bucket: this.configService.get<string>("MINIO_SESSION_IMAGE_BUCKET"),
      Key: fileName,
    }

    const downloadCommand = new GetObjectCommand(downloadParams);
    const data = await this.s3Client.send(downloadCommand);
    return data.Body as Readable
  }

  private createFileName(): string{
    const timestamp = Date.now().toString();
    const uuid = uuidv4()
    return `${timestamp}-${uuid}`;
  }
}