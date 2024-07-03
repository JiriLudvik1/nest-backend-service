import { Controller } from "@nestjs/common";
import { RMQRoute } from "nestjs-rmq";
import { ImageCleanupRequest } from "../models/session-cleanup.request";
import { SessionImageCleanupService } from "./session-image-cleanup.service";

@Controller()
export class ManagementController {
  constructor(private imageCleanupService: SessionImageCleanupService) {
  }

  @RMQRoute("image-cleanup")
  async handleImageCleanupMessage(cleanupRequest: ImageCleanupRequest){
    await this.imageCleanupService.performCleanup(cleanupRequest);
  }
}