import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Session, SessionDocument } from "../models/session.schema";
import { Model } from "mongoose";
import { SessionImageService } from "../session-image.service";
import { DeleteImageFilesResponse } from "../models/delete-image-files.response";
import { ImageCleanupRequest } from "../models/session-cleanup.request";

@Injectable()
export class SessionImageCleanupService {
  constructor(@InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
              private sessionImageService: SessionImageService) {
  }

  async performCleanup(imageCleanupRequest: ImageCleanupRequest): Promise<DeleteImageFilesResponse>{
    const allStorageFilesPromise = this.sessionImageService.listAllImageFileNames();
    const allUsedImageFileNamesPromise = this.getAllUsedImageFileNames();

    const [allStorageFileNames, allUsedImageFileNames] = await Promise.all([allStorageFilesPromise, allUsedImageFileNamesPromise]);
    const unusedFiles = allStorageFileNames.filter(file => !allUsedImageFileNames.includes(file));
    if (unusedFiles.length === 0){
      return {
        deletedFilesCount: 0,
        deletedTimestamp: new Date()
      }
    }

    return await this.sessionImageService.deleteImageFiles(unusedFiles);
  }

  async getAllUsedImageFileNames(): Promise<string[]> {
    const allSessions = await this.sessionModel.find();
    return allSessions.map(s => s.imageStorageFileName);
  }
}