import { Controller, Get } from "@nestjs/common";

@Controller("leave")
export class LeaveController {
  @Get("policy")
  policy() {
    return {
      approvals: ["Reporting Manager", "Department Head", "HR Manager"],
      types: ["CASUAL", "SICK", "EARNED", "MATERNITY", "PATERNITY", "COMP_OFF", "LOSS_OF_PAY"],
      encashment: true,
      holidayCalendars: ["National", "State", "Branch"]
    };
  }
}
