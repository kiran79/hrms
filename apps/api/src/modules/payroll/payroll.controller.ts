import { Body, Controller, Get, Post } from "@nestjs/common";
import { Roles } from "../auth/roles.decorator";
import { PayrollService } from "./payroll.service";

@Controller("payroll")
export class PayrollController {
  constructor(private readonly payroll: PayrollService) {}

  @Post("preview")
  @Roles("PAYROLL_MANAGER", "FINANCE_MANAGER", "ORG_ADMIN")
  preview(@Body() body: Parameters<PayrollService["previewSalary"]>[0]) {
    return this.payroll.previewSalary(body);
  }

  @Get("compliance")
  @Roles("PAYROLL_MANAGER", "FINANCE_MANAGER", "AUDITOR")
  compliance() {
    return this.payroll.complianceChecklist();
  }
}
