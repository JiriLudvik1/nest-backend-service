import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Session, SessionDocument } from "../models/session.schema";
import { Model } from "mongoose";
import { SessionImageService } from "../session-image.service";
import { DeleteImageFilesResponse } from "../models/delete-image-files.response";
import { ImageCleanupRequest } from "../models/session-cleanup.request";
import { ImageCleanup, ImageCleanupDocument } from "../models/image-cleanup.schema";

@Injectable()
export class SessionImageCleanupService {
  constructor(@InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
              @InjectModel(ImageCleanup.name) private imageCleanupModel: Model<ImageCleanupDocument>,
              private sessionImageService: SessionImageService) {
  }

  async performCleanup(imageCleanupRequest: ImageCleanupRequest): Promise<DeleteImageFilesResponse>{
    if (await this.requestAlreadyProcessed(imageCleanupRequest)){
      return {
        deletedFilesCount: 0,
        deletedTimestamp: new Date()
      }
    }

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

    const deleteImagesResult = await this.sessionImageService.deleteImageFiles(unusedFiles);
    const newImageCleanupModel: ImageCleanup ={
      requestId: imageCleanupRequest.requestId,
      manualRequest: imageCleanupRequest.manualRequest,
      filesDeleted: deleteImagesResult.deletedFilesCount,
      requestedBy: imageCleanupRequest.requestedBy,
      requestTimestamp: new Date(imageCleanupRequest.timestamp), // Pičovina jak zvon, oprav to
      requestFinished: deleteImagesResult.deletedTimestamp
    }

    const newImageCleanup = new this.imageCleanupModel(newImageCleanupModel);
    await newImageCleanup.save();

    return {
      deletedFilesCount: deleteImagesResult.deletedFilesCount,
      deletedTimestamp: new Date()
    }
  }

  async getAllUsedImageFileNames(): Promise<string[]> {
    const allSessions = await this.sessionModel.find();
    return allSessions.map(s => s.imageStorageFileName);
  }

  private async requestAlreadyProcessed(imageCleanupRequest: ImageCleanupRequest): Promise<boolean> {
    const imageCleanup = await this.imageCleanupModel.find({requestId: imageCleanupRequest.requestId}).exec();
    return imageCleanup.length > 0;
  }
}