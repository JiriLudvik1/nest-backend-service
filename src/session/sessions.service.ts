import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Session, SessionDocument } from "./models/session.schema";
import { Model } from "mongoose";
import { UpsertSessionDto } from "./models/upsert-session.dto";
import { PersonService } from "../person/person.service";
import { calculateSessionStatistics, SessionsStatisticsResult } from "./session-statistics-calculator";

@Injectable()
export class SessionsService {
  constructor(@InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
              @Inject(forwardRef(() => PersonService))
              private personService: PersonService) {
  }

  async upsertSession(upsertDto: UpsertSessionDto): Promise<Session> {
    const existingSession = await this.findByBrowserId(upsertDto.browserId);
    if (existingSession !== null) {
      const updatedUserIds = existingSession.ratedUsers.concat(upsertDto.ratedUsers);
      return this.sessionModel.findOneAndUpdate(existingSession, { ratedUsers: updatedUserIds });
    }

    const newSessionModel: Session = {
      ratedUsers: upsertDto.ratedUsers,
      browserId: upsertDto.browserId,
      createdAt: new Date()
    };
    const newSession = new this.sessionModel(newSessionModel);
    return await newSession.save();
  }

  async getSessionStatistics(browserId: string): Promise<SessionsStatisticsResult> {
    const session = await this.findByBrowserId(browserId);
    if (session === null){
      throw new NotFoundException(null, "Session was not found by browserId");
    }

    const ratedUsers = await this.personService.findMany(session.ratedUsers);
    return calculateSessionStatistics(session, ratedUsers);
  }

  async addSessionImage(session: Session, imageStorageFileName: string): Promise<void> {
    return this.sessionModel.findOneAndUpdate(session, { imageStorageFileName: imageStorageFileName })
  }

  async findByBrowserId(browserId: string): Promise<Session | null> {
    return await this.sessionModel.findOne({ browserId }).exec();
  }
}