import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SessionSchema } from "./models/session.schema";
import { SessionsService } from "./sessions.service";
import { Person, PersonSchema } from "../person/person.schema";
import { PersonService } from "../person/person.service";
import { SessionsController } from "./sessions.controller";
import { SessionImageService } from "./session-image.service";
import { ManagementController } from "./management/rmq-management.controller";
import { RMQModule } from "nestjs-rmq";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Session", schema: SessionSchema }]),
    MongooseModule.forFeature([{ name: Person.name, schema: PersonSchema }]),
    RMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          exchangeName: configService.get<string>("RABBITMQ_CLEANUP_EXCHANGE"),
          queueName: configService.get<string>("RABBITMQ_CLEANUP_QUEUE"),
          prefetchCount: 1,
          isGlobalPrefetchCount: false,
          connections: [
            {
              login: configService.get<string>("RABBITMQ_LOGIN"),
              password: configService.get<string>("RABBITMQ_PASSWORD"),
              host: configService.get<string>("RABBITMQ_HOST")
            }
          ]
        };
      }
    })
  ],
  controllers: [SessionsController, ManagementController],
  providers: [
    SessionsService,
    PersonService,
    SessionImageService]
})
export class SessionModule {
}
