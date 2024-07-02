import { BadRequestException, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
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

  @Post("/image/:browserId")
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Param('browserId') browserId: string): Promise<void> {
    const session= await this.sessionService.findByBrowserId(browserId)
    if (session === null){
      throw new BadRequestException("Session was not found by browserId")
    }

    const uploadedImageEtag = await this.sessionImageService.uploadImage(file)
    return await this.sessionService.addSessionImage(session, uploadedImageEtag)
  }
}