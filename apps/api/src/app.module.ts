import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, Reflector } from "@nestjs/core";
import { AiModule } from "./modules/ai/ai.module";
import { AttendanceModule } from "./modules/attendance/attendance.module";
import { AuthModule } from "./modules/auth/auth.module";
import { RolesGuard } from "./modules/auth/roles.guard";
import { EmployeesModule } from "./modules/employees/employees.module";
import { LeaveModule } from "./modules/leave/leave.module";
import { PayrollModule } from "./modules/payroll/payroll.module";
import { RecruitmentModule } from "./modules/recruitment/recruitment.module";
import { TenantModule } from "./modules/tenant/tenant.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TenantModule,
    AuthModule,
    EmployeesModule,
    PayrollModule,
    AttendanceModule,
    LeaveModule,
    RecruitmentModule,
    AiModule
  ],
  providers: [
    Reflector,
    RolesGuard,
    {
      provide: APP_GUARD,
      useExisting: RolesGuard
    }
  ]
})
export class AppModule {}
