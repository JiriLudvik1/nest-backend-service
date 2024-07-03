import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PersonModule } from "./person/person.module";
import { MongooseModule } from "@nestjs/mongoose";
import { SessionModule } from "./session/session.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    PersonModule,
    MongooseModule.forRoot("mongodb://localhost:27017/nest"),
    SessionModule,
    ConfigModule.forRoot({ isGlobal: true })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
