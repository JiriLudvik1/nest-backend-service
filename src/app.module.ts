import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonModule } from "./person/person.module";
import { MongooseModule } from "@nestjs/mongoose";
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    PersonModule,
    MongooseModule.forRoot('mongodb://localhost:27017/nest'),
    SessionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
