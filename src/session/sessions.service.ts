import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Session, SessionDocument } from "./session.schema";
import { Model } from "mongoose";
import { UpsertSessionDto } from "./upsert-session.dto";

@Injectable()
export class SessionsService {
  constructor(@InjectModel(Session.name) private sessionModel: Model<SessionDocument>) {}

  async upsertSession(upsertDto: UpsertSessionDto): Promise<Session>{
    const existingSession = await this.findByBrowserId(upsertDto.browserId);
    if (existingSession !== null){
      const updatedUserIds = existingSession.ratedUsers.concat(upsertDto.ratedUsers);
      return this.sessionModel.findOneAndUpdate(existingSession, { ratedUsers: updatedUserIds });
    }

    const newSessionModel: Session ={
      ratedUsers: upsertDto.ratedUsers,
      browserId: upsertDto.browserId,
      createdAt: new Date()
    }
    const newSession = new this.sessionModel(newSessionModel);
    return await newSession.save();
  }

  async findByBrowserId(browserId: string): Promise<Session | null> {
    return await this.sessionModel.findOne({browserId}).exec()
  }
}