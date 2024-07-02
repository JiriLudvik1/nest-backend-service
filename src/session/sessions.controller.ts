import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { SessionsStatisticsResult } from "./session-statistics-calculator";
import { FileInterceptor } from "@nestjs/platform-express";
import { SessionImageService } from "./session-image.service";

@Controller("session")
export class SessionsController {
  constructor(private sessionService: SessionsService, private sessionImageService: SessionImageService) {
  }

  @Get(":browserId")
  async getSessionStatistics(@Param("browserId") browserId: string): Promise<SessionsStatisticsResult> {
    return await this.sessionService.getSessionStatistics(browserId);
  }

  @Post("/image")
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<void> {
    return await this.sessionImageService.uploadImage(file)
  }
}