import { Injectable } from "@nestjs/common";
import { calculateIndianPayroll, type SalaryInput } from "@bharat-hrms/domain";

@Injectable()
export class PayrollService {
  previewSalary(input: SalaryInput) {
    return {
      input,
      breakup: calculateIndianPayroll(input),
      audit: {
        locked: false,
        statutoryRuleVersion: "IN_SAMPLE_2026_05",
        generatedAt: new Date().toISOString()
      }
    };
  }

  complianceChecklist() {
    return [
      "EPF employee and employer contribution split",
      "EPS from employer share with wage ceiling",
      "ESIC employee and employer contributions",
      "State-wise Professional Tax",
      "State-wise Labour Welfare Fund",
      "TDS with old and new regime support",
      "Form 16 and Form 24Q export queue",
      "Payroll lock and reprocess audit trail"
    ];
  }
}
