import { Controller, Get } from "@nestjs/common";
import { Roles } from "../auth/roles.decorator";
import { TenantContext } from "../tenant/tenant-context";
import { EmployeesService } from "./employees.service";

@Controller("employees")
export class EmployeesController {
  constructor(
    private readonly employees: EmployeesService,
    private readonly tenant: TenantContext
  ) {}

  @Get()
  @Roles("ORG_ADMIN", "HR_MANAGER", "PAYROLL_MANAGER", "AUDITOR")
  listEmployees() {
    return this.employees.findAll(this.tenant.value.tenantId);
  }
}
