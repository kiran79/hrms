import { Injectable } from "@nestjs/common";
import type { EmployeeProfile } from "@bharat-hrms/domain";

@Injectable()
export class EmployeesService {
  private readonly employees: EmployeeProfile[] = [
    {
      id: "emp-1082",
      tenantId: "demo-tenant",
      employeeCode: "EMP-1082",
      fullName: "Ananya Sharma",
      email: "ananya.sharma@example.com",
      mobile: "+919999000111",
      pan: "ABCDE1234F",
      aadhaarLast4: "1234",
      uan: "100200300400",
      esicNumber: "31-00-123456-000-0001",
      department: "Engineering",
      designation: "Senior Software Engineer",
      branch: "Mumbai",
      location: "Andheri East",
      reportingManagerId: "emp-1001",
      dateOfJoining: "2023-07-10",
      employmentType: "FULL_TIME",
      probationDays: 90
    }
  ];

  findAll(tenantId: string) {
    return this.employees.filter((employee) => employee.tenantId === tenantId);
  }
}
