import { RMQRoute } from "nestjs-rmq";
import * as console from "node:console";
import { Controller } from "@nestjs/common";

@Controller()
export class RmqManagementController {
  @RMQRoute("management")
  handleManagementMessage(data: any): any {
    console.log(data)
  }
}