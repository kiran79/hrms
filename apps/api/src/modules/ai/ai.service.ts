import { Injectable } from "@nestjs/common";

@Injectable()
export class AiService {
  answerEmployeeQuery(query: string) {
    return {
      query,
      answer:
        "I can answer leave balance, salary, attendance, payslip, tax document, policy, and expense questions once connected to tenant data and an AI provider.",
      providers: ["OpenAI", "Gemini", "Claude"]
    };
  }
}
