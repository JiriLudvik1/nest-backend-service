import { Controller } from "@nestjs/common";
import { RMQRoute } from "nestjs-rmq";
import { ImageCleanupRequest } from "../models/session-cleanup.request";
import * as console from "node:console";

@Controller()
export class ManagementController {
  @RMQRoute("image-cleanup")
  async handleImageCleanupMessage(cleanupRequest: ImageCleanupRequest){
    console.log(cleanupRequest);
  }
}