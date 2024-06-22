import { Module, Session } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SessionSchema } from "./session.schema";
import { SessionsService } from "./sessions.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Session", schema: SessionSchema }]),
  ],
  providers:[SessionsService]
})
export class SessionModule {}
