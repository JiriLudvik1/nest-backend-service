import { Controller, Get, Param } from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { SessionsStatisticsResult } from "./session-statistics-calculator";

@Controller("session")
export class SessionsController {
  constructor(private sessionService: SessionsService) {
  }

  @Get(":browserId")
  async getSessionStatistics(@Param("browserId") browserId: string): Promise<SessionsStatisticsResult> {
    return await this.sessionService.getSessionStatistics(browserId);
  }
}