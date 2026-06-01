import { Body, Controller, Post } from "@nestjs/common";
import { AiService } from "./ai.service";

@Controller("ai")
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post("employee-assistant")
  employeeAssistant(@Body() body: { query: string }) {
    return this.ai.answerEmployeeQuery(body.query);
  }
}
