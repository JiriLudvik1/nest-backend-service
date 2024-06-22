import {  Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SessionSchema } from "./session.schema";
import { SessionsService } from "./sessions.service";
import { Person, PersonSchema } from "../person/person.schema";
import { PersonService } from "../person/person.service";
import { SessionsController } from "./sessions.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Session", schema: SessionSchema }]),
    MongooseModule.forFeature([{ name: Person.name, schema: PersonSchema }]),
  ],
  controllers: [SessionsController],
  providers:[SessionsService, PersonService]
})
export class SessionModule {}
