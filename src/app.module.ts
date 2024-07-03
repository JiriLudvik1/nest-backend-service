import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonModule } from "./person/person.module";
import { MongooseModule } from "@nestjs/mongoose";
import { SessionModule } from './session/session.module';
import { ConfigModule } from '@nestjs/config';
import { RMQModule } from "nestjs-rmq";
import { RmqManagementController } from "./rmq-management.controller";

@Module({
  imports: [
    PersonModule,
    MongooseModule.forRoot('mongodb://localhost:27017/nest'),
    SessionModule,
    ConfigModule.forRoot({isGlobal: true}),
    RMQModule.forRoot({
      exchangeName: "management-exchange",
      connections:[
        {
          login: "guest",
          password: "guest",
          host: "localhost:5672"
        },
      ],
      queueName: "management",
      prefetchCount: 1,
      isGlobalPrefetchCount: false,
    })
  ],
  controllers: [AppController, RmqManagementController],
  providers: [AppService],
})
export class AppModule {}
