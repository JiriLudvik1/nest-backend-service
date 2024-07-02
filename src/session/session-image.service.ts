import { Injectable } from "@nestjs/common";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";
import * as console from "node:console";

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
    console.log(this.configService.get<string>("MINIO_ENDPOINT"));
    console.log(this.configService.get<string>("MINIO_REGION"));

    const uploadParams = {
      Bucket: this.configService.get<string>("MINIO_SESSION_IMAGE_BUCKET"),
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype
    }

    const command = new PutObjectCommand(uploadParams);
    const uploadResult = await this.s3Client.send(command);
    return uploadResult.ETag;
  }
}