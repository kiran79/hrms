export type UserRole =
  | "SUPER_ADMIN"
  | "ORG_ADMIN"
  | "HR_MANAGER"
  | "PAYROLL_MANAGER"
  | "DEPARTMENT_HEAD"
  | "REPORTING_MANAGER"
  | "EMPLOYEE"
  | "RECRUITER"
  | "INTERVIEW_PANEL"
  | "FINANCE_MANAGER"
  | "AUDITOR";

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "CONSULTANT"
  | "INTERN"
  | "STAFFING_DEPLOYMENT";

export type LeaveType =
  | "CASUAL"
  | "SICK"
  | "EARNED"
  | "MATERNITY"
  | "PATERNITY"
  | "COMP_OFF"
  | "LOSS_OF_PAY";

export type PayrollRegime = "OLD" | "NEW";

export interface TenantBranding {
  logoUrl?: string;
  primaryColor: string;
  customDomain?: string;
  smtpConfigured: boolean;
  whatsappConfigured: boolean;
}

export interface EmployeeProfile {
  id: string;
  tenantId: string;
  employeeCode: string;
  fullName: string;
  email: string;
  mobile: string;
  pan?: string;
  aadhaarLast4?: string;
  uan?: string;
  esicNumber?: string;
  department: string;
  designation: string;
  branch: string;
  location: string;
  reportingManagerId?: string;
  dateOfJoining: string;
  employmentType: EmploymentType;
  probationDays: number;
}

export interface SalaryInput {
  tenantId: string;
  employeeId: string;
  state: string;
  taxRegime: PayrollRegime;
  basic: number;
  hra: number;
  specialAllowance: number;
  conveyance: number;
  medicalAllowance: number;
  lta: number;
  bonus: number;
  incentives: number;
  overtime: number;
  reimbursements: number;
  otherDeductions: number;
  lopDays: number;
  paidDays: number;
  monthDays: number;
  customEarnings?: { id: string; name: string; amount: number }[];
  customDeductions?: { id: string; name: string; amount: number }[];
}

export interface PayrollBreakup {
  grossEarnings: number;
  employeePf: number;
  employerPf: number;
  employerEps: number;
  employeeEsi: number;
  employerEsi: number;
  professionalTax: number;
  labourWelfareFund: number;
  estimatedTds: number;
  totalDeductions: number;
  netPay: number;
  ctcCost: number;
}

export const defaultStatutoryConfig = {
  epf: {
    employeeRate: 0.12,
    employerRate: 0.12,
    epsRateFromEmployerShare: 0.0833,
    wageCeiling: 15000
  },
  esic: {
    employeeRate: 0.0075,
    employerRate: 0.0325,
    wageCeiling: 21000
  },
  tds: {
    cessRate: 0.04,
    standardDeduction: 50000
  }
} as const;

const professionalTaxByState: Record<string, (monthlyGross: number) => number> = {
  MAHARASHTRA: (gross) => (gross > 10000 ? 200 : gross > 7500 ? 175 : 0),
  KARNATAKA: (gross) => (gross >= 25000 ? 200 : 0),
  TAMIL_NADU: (gross) => (gross > 12500 ? 208 : gross > 10000 ? 171 : gross > 7500 ? 115 : gross > 5000 ? 53 : 0),
  TELANGANA: (gross) => (gross > 20000 ? 200 : gross > 15000 ? 150 : 0),
  ANDHRA_PRADESH: (gross) => (gross > 20000 ? 200 : gross > 15000 ? 150 : 0),
  GUJARAT: (gross) => (gross >= 12000 ? 200 : 0),
  WEST_BENGAL: (gross) => (gross > 40000 ? 200 : gross > 25000 ? 150 : gross > 15000 ? 130 : gross > 10000 ? 110 : 0)
};

export function calculateIndianPayroll(input: SalaryInput): PayrollBreakup {
  const monthlyFixed =
    input.basic +
    input.hra +
    input.specialAllowance +
    input.conveyance +
    input.medicalAllowance +
    input.lta;
  const payableRatio = input.monthDays > 0 ? input.paidDays / input.monthDays : 1;
  const earnedFixed = round(monthlyFixed * payableRatio);
  
  const customEarningsSum = input.customEarnings?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
  const customDeductionsSum = input.customDeductions?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;

  const grossEarnings = round(earnedFixed + input.bonus + input.incentives + input.overtime + input.reimbursements + customEarningsSum);
  const pfWage = Math.min(input.basic * payableRatio, defaultStatutoryConfig.epf.wageCeiling);
  const employeePf = round(pfWage * defaultStatutoryConfig.epf.employeeRate);
  const employerTotalPf = round(pfWage * defaultStatutoryConfig.epf.employerRate);
  const employerEps = round(pfWage * defaultStatutoryConfig.epf.epsRateFromEmployerShare);
  const employerPf = round(Math.max(0, employerTotalPf - employerEps));
  const esiApplicable = grossEarnings <= defaultStatutoryConfig.esic.wageCeiling;
  const employeeEsi = esiApplicable ? Math.ceil(grossEarnings * defaultStatutoryConfig.esic.employeeRate) : 0;
  const employerEsi = esiApplicable ? Math.ceil(grossEarnings * defaultStatutoryConfig.esic.employerRate) : 0;
  const professionalTax = professionalTaxByState[normalizeState(input.state)]?.(grossEarnings) ?? 0;
  const labourWelfareFund = estimateLabourWelfareFund(input.state, grossEarnings);
  const estimatedTds = estimateMonthlyTds(input.taxRegime, grossEarnings * 12);
  const totalDeductions = round(employeePf + employeeEsi + professionalTax + labourWelfareFund + estimatedTds + input.otherDeductions + customDeductionsSum);
  const netPay = round(grossEarnings - totalDeductions);
  const ctcCost = round(grossEarnings + employerPf + employerEps + employerEsi);

  return {
    grossEarnings,
    employeePf,
    employerPf,
    employerEps,
    employeeEsi,
    employerEsi,
    professionalTax,
    labourWelfareFund,
    estimatedTds,
    totalDeductions,
    netPay,
    ctcCost
  };
}

function estimateLabourWelfareFund(state: string, gross: number): number {
  const normalized = normalizeState(state);
  if (["KARNATAKA", "MAHARASHTRA", "GUJARAT", "TAMIL_NADU"].includes(normalized) && gross > 0) return 20;
  return 0;
}

function estimateMonthlyTds(regime: PayrollRegime, annualTaxableIncome: number): number {
  const taxable = Math.max(0, annualTaxableIncome - defaultStatutoryConfig.tds.standardDeduction);
  const slabs =
    regime === "NEW"
      ? [
          [300000, 0],
          [700000, 0.05],
          [1000000, 0.1],
          [1200000, 0.15],
          [1500000, 0.2],
          [Number.POSITIVE_INFINITY, 0.3]
        ]
      : [
          [250000, 0],
          [500000, 0.05],
          [1000000, 0.2],
          [Number.POSITIVE_INFINITY, 0.3]
        ];
  let previous = 0;
  let tax = 0;
  for (const [limit, rate] of slabs) {
    if (taxable <= previous) break;
    const slabAmount = Math.min(taxable, limit) - previous;
    tax += slabAmount * rate;
    previous = limit;
  }
  return round((tax + tax * defaultStatutoryConfig.tds.cessRate) / 12);
}

function normalizeState(state: string): string {
  return state.trim().toUpperCase().replace(/[^A-Z]+/g, "_");
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
