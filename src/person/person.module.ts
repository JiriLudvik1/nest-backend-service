import { Module } from "@nestjs/common";
import { PersonController } from "./person.controller";
import { PersonService } from "./person.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Person, PersonSchema } from "./person.schema";
import { SessionModule } from "../session/session.module";
import { SessionsService } from "../session/sessions.service";
import { SessionSchema } from "../session/models/session.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Person.name, schema: PersonSchema }]),
    MongooseModule.forFeature([{ name: "Session", schema: SessionSchema }]),
    SessionModule
  ],
  controllers: [PersonController],
  providers: [PersonService, SessionsService],
})

export class PersonModule {}