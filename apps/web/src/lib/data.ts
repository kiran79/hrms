import { calculateIndianPayroll } from "@bharat-hrms/domain";

export const dashboardStats = [
  { label: "Employees", value: "1,248", delta: "+42 this month" },
  { label: "New Joinees", value: "37", delta: "18 joining next cycle" },
  { label: "Attrition", value: "2.8%", delta: "-0.6% vs last quarter" },
  { label: "Payroll Net Pay", value: "INR 8.42 Cr", delta: "May payroll locked" }
];

export const moduleHealth = [
  ["Recruitment", "68 open requisitions", "Screening automation active"],
  ["Attendance", "94.7% present today", "12 late marks need review"],
  ["Leave", "231 balances updated", "46 pending approvals"],
  ["Compliance", "7 alerts", "PT rule review due for 2 states"],
  ["Assets", "1,109 allocated", "23 pending returns"],
  ["Performance", "Q1 OKRs", "82% manager reviews done"]
];

export const samplePayroll = calculateIndianPayroll({
  tenantId: "tenant-demo",
  employeeId: "EMP-1082",
  state: "Maharashtra",
  taxRegime: "NEW",
  basic: 50000,
  hra: 25000,
  specialAllowance: 22000,
  conveyance: 1600,
  medicalAllowance: 1250,
  lta: 4000,
  bonus: 10000,
  incentives: 15000,
  overtime: 2500,
  reimbursements: 6000,
  otherDeductions: 0,
  lopDays: 0,
  paidDays: 31,
  monthDays: 31
});

export const roles = [
  "Super Admin",
  "Organization Admin",
  "HR Manager",
  "Payroll Manager",
  "Department Head",
  "Reporting Manager",
  "Employee",
  "Recruiter",
  "Interview Panel",
  "Finance Manager",
  "Auditor"
];

export const userTypes = [
  {
    role: "Super Admin",
    scope: "Owns the SaaS platform, tenants, plans, billing, rule packs, and white-label partner controls.",
    permissions: ["Tenant management", "Subscription plans", "Compliance rule versions"]
  },
  {
    role: "Organization Admin",
    scope: "Controls one company workspace, branches, departments, policies, branding, and user access.",
    permissions: ["Company setup", "Role assignment", "Tenant settings"]
  },
  {
    role: "HR Manager",
    scope: "Manages employee lifecycle from onboarding to exit, documents, policies, and HR workflows.",
    permissions: ["Employee master", "Onboarding", "Letters"]
  },
  {
    role: "Payroll Manager",
    scope: "Processes monthly payroll, statutory deductions, payslips, bank files, and payroll locks.",
    permissions: ["Payroll run", "Payslips", "PF/ESI/PT/TDS"]
  },
  {
    role: "Department Head",
    scope: "Approves manpower requests, budgets, department transfers, and performance cycles.",
    permissions: ["Requisitions", "Budget approvals", "Team analytics"]
  },
  {
    role: "Reporting Manager",
    scope: "Handles team attendance, leave, expenses, performance reviews, and daily approvals.",
    permissions: ["Leave approvals", "Team attendance", "Reviews"]
  },
  {
    role: "Employee",
    scope: "Uses self-service for attendance, leave, payslips, tax documents, expenses, and profile updates.",
    permissions: ["ESS", "Payslips", "Expenses"]
  },
  {
    role: "Recruiter",
    scope: "Runs hiring pipelines, job postings, resume screening, interviews, and offer workflows.",
    permissions: ["ATS", "Candidate pipeline", "Offer drafts"]
  },
  {
    role: "Interview Panel",
    scope: "Reviews candidates, adds interview feedback, scores skills, and recommends hiring decisions.",
    permissions: ["Interview schedule", "Feedback", "Candidate rating"]
  },
  {
    role: "Finance Manager",
    scope: "Reviews payroll cost, reimbursement payouts, invoices, tax reports, and bank transfer files.",
    permissions: ["Payroll approval", "Invoices", "Bank files"]
  },
  {
    role: "Auditor",
    scope: "Gets read-only access to audit trails, statutory reports, payroll locks, and compliance evidence.",
    permissions: ["Audit logs", "Compliance reports", "Read-only access"]
  }
];

export const saasPlans = [
  {
    name: "Starter",
    price: 99,
    audience: "SMEs and early-stage teams",
    limits: "Up to 100 employees",
    features: ["Core HR", "Leave", "Attendance", "Payslips"]
  },
  {
    name: "Growth",
    price: 149,
    audience: "Growing companies",
    limits: "Up to 1,000 employees",
    features: ["Payroll", "Compliance", "Recruitment", "Expenses"]
  },
  {
    name: "Enterprise",
    price: 199,
    audience: "Multi-location organizations",
    limits: "Unlimited employees",
    features: ["Advanced workflows", "Audit", "Custom reports", "API access"]
  },
  {
    name: "White Label Partner",
    price: 499,
    audience: "Resellers and HR firms",
    limits: "Partner tenant console",
    features: ["Custom domain", "Branding", "SMTP", "WhatsApp"]
  }
];

export const tenantAccounts = [
  {
    name: "Acme India Pvt Ltd",
    plan: "Growth",
    employees: 1248,
    mrr: "INR 1,85,952",
    status: "Active",
    domain: "hr.acmeindia.in"
  },
  {
    name: "MetroCare Hospitals",
    plan: "Enterprise",
    employees: 3420,
    mrr: "INR 6,80,580",
    status: "Active",
    domain: "people.metrocare.in"
  },
  {
    name: "SkillBridge Staffing",
    plan: "White Label Partner",
    employees: 9820,
    mrr: "INR 49,00,180",
    status: "Trial ends soon",
    domain: "portal.skillbridge.in"
  },
  {
    name: "Westfield Manufacturing",
    plan: "Growth",
    employees: 780,
    mrr: "INR 1,16,220",
    status: "Payment due",
    domain: "hrms.westfield.co.in"
  }
];

export const saasMetrics = [
  { label: "Tenants", value: "126", note: "+18 this quarter" },
  { label: "Active employees", value: "84,620", note: "Billable users" },
  { label: "MRR", value: "INR 1.42 Cr", note: "+11.8% MoM" },
  { label: "Trial pipeline", value: "34", note: "12 conversion-ready" }
];

export const defaultDepartments = [
  { id: 1, name: "Administration" },
  { id: 2, name: "Operations" },
  { id: 3, name: "Sales & Marketing" },
  { id: 4, name: "Research & Development" },
  { id: 5, name: "Finance" },
  { id: 6, name: "Customer Support" }
];

export const defaultDesignations = [
  { id: 1, name: "CEO" },
  { id: 2, name: "Contracts Manager" },
  { id: 3, name: "Sales Director" },
  { id: 4, name: "Lead Architect" },
  { id: 5, name: "Office Assistant" },
  { id: 6, name: "Corporate Lawyer" },
  { id: 7, name: "HR Manager" },
  { id: 8, name: "Finance Manager" }
];

export const defaultShifts = [
  { id: 1, name: "General Shift", clockInTime: "09:00", clockOutTime: "18:00", lateMarkAfter: 10, selfClocking: true },
  { id: 2, name: "Morning Shift", clockInTime: "06:00", clockOutTime: "15:00", lateMarkAfter: 10, selfClocking: true },
  { id: 3, name: "Night Shift", clockInTime: "22:00", clockOutTime: "07:00", lateMarkAfter: 15, selfClocking: true }
];

export const defaultAssetTypes = [
  { id: 1, name: "Laptops & Desktops" },
  { id: 2, name: "Mobile Devices" },
  { id: 3, name: "Office Furniture" }
];

export const defaultAssets = [
  { id: 1, name: "MacBook Pro M3", assetTypeId: 1, serialNumber: "MBP-9821-M3", description: "16-inch Space Black, 36GB RAM, 1TB SSD", status: "Allocated", userId: "EMP-004", purchaseDate: "2024-01-15", price: 249999 },
  { id: 2, name: "iPhone 15 Pro", assetTypeId: 2, serialNumber: "IPH-15P-9912", description: "128GB Natural Titanium, Company SIM active", status: "Allocated", userId: "EMP-001", purchaseDate: "2024-02-10", price: 129999 },
  { id: 3, name: "Ergonomic Desk Chair", assetTypeId: 3, serialNumber: "CH-ERG-8812", description: "Mesh back high support executive chair", status: "Available", userId: null, purchaseDate: "2023-11-20", price: 18500 },
  { id: 4, name: "Dell 27-inch Monitor", assetTypeId: 1, serialNumber: "MON-DELL-27", description: "4K USB-C hub monitor", status: "Allocated", userId: "EMP-002", purchaseDate: "2024-01-18", price: 34999 }
];

export const defaultHolidays = [
  { id: 1, name: "New Year's Day", date: "2026-01-01", isWeekend: false, isHalfDay: false },
  { id: 2, name: "Republic Day", date: "2026-01-26", isWeekend: false, isHalfDay: false },
  { id: 3, name: "Independence Day", date: "2026-08-15", isWeekend: false, isHalfDay: false },
  { id: 4, name: "Gandhi Jayanti", date: "2026-10-02", isWeekend: false, isHalfDay: false },
  { id: 5, name: "Diwali Festival", date: "2026-11-08", isWeekend: false, isHalfDay: false }
];

export const defaultAwards = [
  { id: 1, name: "Employee of the Month", awardPrice: 5000, description: "Monthly recognition for outstanding achievements" },
  { id: 2, name: "Team Player Award", awardPrice: 2500, description: "Exceptional collaboration across departments" },
  { id: 3, name: "Innovation Milestone Award", awardPrice: 10000, description: "For breaking limits and designing next-gen features" }
];

export const defaultAppreciations = [
  { id: 1, userId: "EMP-001", awardId: 1, date: "2026-05-15", priceAmount: 5000, description: "Demonstrated exemplary leadership during the critical Q1 release cycle." },
  { id: 2, userId: "EMP-002", awardId: 2, date: "2026-05-20", priceAmount: 2500, description: "Helped onboard the Operations module ahead of schedule." }
];

export const defaultLeaveTypes = [
  { id: 1, name: "Casual Leave", totalLeaves: 12, isPaid: true },
  { id: 2, name: "Sick Leave", totalLeaves: 10, isPaid: true },
  { id: 3, name: "Earned Leave", totalLeaves: 15, isPaid: true },
  { id: 4, name: "Loss of Pay Leave", totalLeaves: 0, isPaid: false }
];

export const defaultLeaves = [
  { id: 1, userId: "EMP-001", leaveTypeId: 1, startDate: "2026-06-05", endDate: "2026-06-06", totalDays: 2, isHalfDay: false, reason: "Family event in hometown", isPaid: true, status: "Pending" },
  { id: 2, userId: "EMP-002", leaveTypeId: 2, startDate: "2026-05-28", endDate: "2026-05-28", totalDays: 1, isHalfDay: false, reason: "Dental treatment", isPaid: true, status: "Approved" }
];

export const defaultAttendances = [
  { id: 1, userId: "EMP-001", date: "2026-05-30", clockInDateTime: "2026-05-30T09:02:00", clockOutDateTime: "2026-05-30T18:05:00", clockInIpAddress: "192.168.1.15", clockInLatitude: 19.0760, clockInLongitude: 72.8777, clockInLocationName: "Mumbai Corporate Office", status: "Present", isHalfDay: false, isLate: false },
  { id: 2, userId: "EMP-002", date: "2026-05-30", clockInDateTime: "2026-05-30T09:18:00", clockOutDateTime: "2026-05-30T18:00:00", clockInIpAddress: "192.168.1.18", clockInLatitude: 18.5204, clockInLongitude: 73.8567, clockInLocationName: "Pune Branch", status: "Late", isHalfDay: false, isLate: true }
];

export const defaultOffboardings = [
  { id: 1, userId: "EMP-005", managerId: "EMP-001", title: "Career Opportunity Abroad", description: "Resigning to pursue higher studies in Germany.", submitDate: "2026-05-20", startDate: "2026-05-20", endDate: "2026-06-30", type: "Resignation", status: "Pending" }
];

export const defaultAccounts = [
  { id: 1, name: "HDFC Primary Corporate", accountNumber: "502000987654", branchCode: "HDFC0000104", branchAddress: "Nariman Point, Mumbai", initialBalance: 1500000, balance: 1425000 },
  { id: 2, name: "ICICI Salary Account", accountNumber: "000405123456", branchCode: "ICIC0000004", branchAddress: "MG Road, Bengaluru", initialBalance: 500000, balance: 500000 },
  { id: 3, name: "Office Petty Cash", accountNumber: "CASH-MUMBAI", branchCode: "N/A", branchAddress: "Mumbai Head Office Cash Vault", initialBalance: 25000, balance: 22500 }
];

export const defaultDeposits = [
  { id: 1, accountId: 1, depositCategoryId: 1, amount: 150000, dateTime: "2026-05-28T14:30:00", payerId: 1, referenceNumber: "TXN-DEP-1092", notes: "SaaS growth package subscription payout from Stripe" }
];

export const defaultExpenses = [
  { id: 1, accountId: 1, expenseCategoryId: 1, amount: 225000, dateTime: "2026-05-29T11:00:00", payeeId: 1, referenceNumber: "TXN-EXP-5591", notes: "AWS cloud server hosting fees for May 2026", status: "Approved" }
];

export const defaultLetterheadTemplates = [
  { 
    id: 1, 
    title: "Offer Letter Template", 
    description: "Standard offer letter containing salary structure and joining guidelines.",
    body: "Dear {Employee Name},\n\nWe are pleased to offer you the position of {Designation} in the {Department} department at {Company Name}.\n\nYour monthly basic salary will be {Basic Salary} and your net monthly salary will be {Net Salary} (Gross CTC: {CTC}).\nYour joining date will be {Joining Date}.\n\nPlease sign and return a copy of this document as acceptance of this offer.\n\nSincerely,\nHR Department\n{Company Name}"
  },
  { 
    id: 2, 
    title: "Relieving Letter Template", 
    description: "Relieving certificate for outgoing employees with active work verification.",
    body: "TO WHOMSOEVER IT MAY CONCERN\n\nThis is to certify that {Employee Name} (Employee ID: {Employee ID}) was employed with {Company Name} as {Designation} in the {Department} department.\n\nTheir employment commenced on {Joining Date} and they were relieved from their duties on {Exit Date} following their resignation.\n\nDuring their tenure, we found them to be highly professional, diligent, and honest. Their monthly net salary at the time of leaving was {Net Salary}.\n\nWe wish them all the success in their future endeavors.\n\nSincerely,\nHR Manager\n{Company Name}"
  },
  { 
    id: 3, 
    title: "Appraisal Template", 
    description: "Appraisal revision template showing components increment percentages.",
    body: "Dear {Employee Name},\n\nConsequent to your performance review, we are pleased to revise your salary structure.\n\nEffective from {Effective Date}, your monthly net salary will be revised to {New Salary}, reflecting a hike of {Hike Percentage}%.\nYour designation will continue to be {Designation}.\n\nWe appreciate your hard work and commitment towards {Company Name}.\n\nSincerely,\nCEO\n{Company Name}"
  },
  { 
    id: 4, 
    title: "Experience Letter Template", 
    description: "Experience certificate for former employees proving work credentials.",
    body: "TO WHOMSOEVER IT MAY CONCERN\n\nThis is to certify that {Employee Name} (Employee ID: {Employee ID}) has worked with {Company Name} as {Designation} in the {Department} department.\n\nTheir employment started on {Joining Date} and ended on {Exit Date}.\n\nDuring their tenure with us, they demonstrated exceptional skills and contributed significantly to the success of our projects. Their last drawn monthly net salary was {Net Salary}.\n\nWe bear no outstanding claims and wish them the very best in their career ahead.\n\nSincerely,\nHR Manager\n{Company Name}"
  }
];

export const defaultLocations = [
  { id: 1, name: "Mumbai Corporate Office", region: "West India", officeType: "Corporate Office", city: "Mumbai", address: "Maker Chambers, Nariman Point, Mumbai, Maharashtra 400021" },
  { id: 2, name: "Bengaluru Branch Office", region: "South India", officeType: "Branch Office", city: "Bengaluru", address: "Prestige Tech Park, Outer Ring Road, Bengaluru, Karnataka 560103" },
  { id: 3, name: "Pune Support Office", region: "West India", officeType: "Support", city: "Pune", address: "Viman Nagar, Pune, Maharashtra 411014" }
];

export const defaultCurrencies = [
  { id: 1, name: "Indian Rupee", code: "INR", symbol: "₹", position: "left" },
  { id: 2, name: "US Dollar", code: "USD", symbol: "$", position: "left" }
];

export const defaultEmployees = [
  {
    id: "EMP-001",
    fullName: "Admin User",
    email: "admin@example.com",
    mobile: "9876543210",
    pan: "ABCDE1234F",
    aadhaar: "123456789012",
    uan: "100987654321",
    esicNumber: "31123456780010101",
    department: "Administration",
    designation: "CEO",
    branch: "Mumbai",
    location: "Maharashtra", // State matches PT rules
    dateOfJoining: "2020-01-15",
    employmentType: "FULL_TIME",
    probationDays: 0,
    salary: {
      basic: 120000,
      hra: 60000,
      specialAllowance: 50000,
      conveyance: 1600,
      medicalAllowance: 1250,
      lta: 5000
    },
    documents: {
      aadhaar: "aadhaar_card.pdf",
      pan: "pan_card.pdf",
      offerLetter: "offer_letter.pdf"
    },
    bankDetails: {
      bankName: "HDFC Bank",
      accountNumber: "50100087654321",
      ifscCode: "HDFC0000104",
      branchName: "Nariman Point",
      accountType: "SAVINGS"
    },
    education: {
      tenthMarksSheet: "10th_marksheet.pdf",
      tenthCertificate: "10th_cert.pdf",
      twelfthMarksSheet: "12th_marksheet.pdf",
      twelfthCertificate: "12th_cert.pdf",
      graduationMarksSheet: "grad_marksheet.pdf",
      graduationCertificate: "grad_degree.pdf",
      pgMarksSheet: null,
      pgCertificate: null,
      doctoralMarksSheet: null,
      doctoralCertificate: null
    },
    experience: [
      {
        companyName: "Infosys Ltd",
        fromDate: "2024-02-01",
        toDate: "2026-04-01",
        offerLetter: "infosys_offer.pdf",
        hikeLetter: "infosys_hike.pdf",
        relievingLetter: "infosys_relieving.pdf",
        payslip1: { file: "infosys_pay_apr.pdf", month: "Apr", year: "2026" },
        payslip2: { file: "infosys_pay_mar.pdf", month: "Mar", year: "2026" },
        payslip3: { file: "infosys_pay_feb.pdf", month: "Feb", year: "2026" }
      },
      {
        companyName: "TCS Ltd",
        fromDate: "2022-01-01",
        toDate: "2024-01-01",
        offerLetter: "tcs_offer.pdf",
        hikeLetter: "tcs_hike.pdf",
        relievingLetter: "tcs_relieving.pdf",
        payslip1: { file: "tcs_pay_jan.pdf", month: "Jan", year: "2024" },
        payslip2: { file: "tcs_pay_dec.pdf", month: "Dec", year: "2023" },
        payslip3: { file: "tcs_pay_nov.pdf", month: "Nov", year: "2023" }
      },
      {
        companyName: "Wipro Ltd",
        fromDate: "2020-01-01",
        toDate: "2022-01-01",
        offerLetter: "wipro_offer.pdf",
        hikeLetter: "wipro_hike.pdf",
        relievingLetter: "wipro_relieving.pdf",
        payslip1: { file: "wipro_pay_jan.pdf", month: "Jan", year: "2022" },
        payslip2: { file: "wipro_pay_dec.pdf", month: "Dec", year: "2021" },
        payslip3: { file: "wipro_pay_nov.pdf", month: "Nov", year: "2021" }
      }
    ]
  },
  {
    id: "EMP-002",
    fullName: "Levi O'Kon DVM",
    email: "levi@example.com",
    mobile: "9876543211",
    pan: "FGHIJ5678K",
    aadhaar: "234567890123",
    uan: "100987654322",
    esicNumber: "31123456780010102",
    department: "Operations",
    designation: "Contracts Manager",
    branch: "Pune",
    location: "Maharashtra",
    dateOfJoining: "2024-05-10",
    employmentType: "FULL_TIME",
    probationDays: 90,
    salary: {
      basic: 50000,
      hra: 25000,
      specialAllowance: 20000,
      conveyance: 1600,
      medicalAllowance: 1250,
      lta: 4000
    },
    documents: {
      aadhaar: "aadhaar_levi.pdf",
      pan: "pan_levi.pdf"
    },
    bankDetails: {
      bankName: "ICICI Bank",
      accountNumber: "00040187654322",
      ifscCode: "ICIC0000004",
      branchName: "MG Road, Bengaluru",
      accountType: "SAVINGS"
    },
    education: {
      tenthMarksSheet: "10th_marksheet.pdf",
      tenthCertificate: "10th_cert.pdf",
      twelfthMarksSheet: "12th_marksheet.pdf",
      twelfthCertificate: "12th_cert.pdf",
      graduationMarksSheet: "grad_marksheet.pdf",
      graduationCertificate: "grad_degree.pdf",
      pgMarksSheet: null,
      pgCertificate: null,
      doctoralMarksSheet: null,
      doctoralCertificate: null
    },
    experience: []
  },
  {
    id: "EMP-003",
    fullName: "Forrest Fadel",
    email: "forrest@example.com",
    mobile: "9876543212",
    pan: "LMNOP9012Q",
    aadhaar: "345678901234",
    uan: "100987654323",
    esicNumber: "31123456780010103",
    department: "Sales & Marketing",
    designation: "Sales Director",
    branch: "Mumbai",
    location: "Maharashtra",
    dateOfJoining: "2022-09-01",
    employmentType: "FULL_TIME",
    probationDays: 0,
    salary: {
      basic: 80000,
      hra: 40000,
      specialAllowance: 30000,
      conveyance: 1600,
      medicalAllowance: 1250,
      lta: 5000
    },
    documents: {},
    bankDetails: {
      bankName: "SBI Bank",
      accountNumber: "302918273645",
      ifscCode: "SBIN0000300",
      branchName: "Viman Nagar, Pune",
      accountType: "SAVINGS"
    },
    education: {
      tenthMarksSheet: "10th_marksheet.pdf",
      tenthCertificate: "10th_cert.pdf",
      twelfthMarksSheet: "12th_marksheet.pdf",
      twelfthCertificate: "12th_cert.pdf",
      graduationMarksSheet: "grad_marksheet.pdf",
      graduationCertificate: "grad_degree.pdf",
      pgMarksSheet: null,
      pgCertificate: null,
      doctoralMarksSheet: null,
      doctoralCertificate: null
    },
    experience: []
  },
  {
    id: "EMP-004",
    fullName: "Dr. Jonas Stiedemann",
    email: "jonas@example.com",
    mobile: "9876543213",
    pan: "RSTUV3456W",
    aadhaar: "456789012345",
    uan: "100987654324",
    esicNumber: "31123456780010104",
    department: "Research & Development",
    designation: "Lead Architect",
    branch: "Bengaluru",
    location: "Karnataka", // Karnataka state PT
    dateOfJoining: "2023-03-20",
    employmentType: "FULL_TIME",
    probationDays: 90,
    salary: {
      basic: 95000,
      hra: 47500,
      specialAllowance: 35000,
      conveyance: 1600,
      medicalAllowance: 1250,
      lta: 5000
    },
    documents: {},
    bankDetails: {
      bankName: "Axis Bank",
      accountNumber: "915010007654321",
      ifscCode: "UTIB0000010",
      branchName: "Indiranagar, Bengaluru",
      accountType: "SAVINGS"
    },
    education: {
      tenthMarksSheet: "10th_marksheet.pdf",
      tenthCertificate: "10th_cert.pdf",
      twelfthMarksSheet: "12th_marksheet.pdf",
      twelfthCertificate: "12th_cert.pdf",
      graduationMarksSheet: "grad_marksheet.pdf",
      graduationCertificate: "grad_degree.pdf",
      pgMarksSheet: "pg_marksheet.pdf",
      pgCertificate: "pg_degree.pdf",
      doctoralMarksSheet: "phd_marksheet.pdf",
      doctoralCertificate: "phd_degree.pdf"
    },
    experience: []
  },
  {
    id: "EMP-005",
    fullName: "Berry Little",
    email: "berry@example.com",
    mobile: "9876543214",
    pan: "XYZAB7890C",
    aadhaar: "567890123456",
    uan: "100987654325",
    esicNumber: "31123456780010105",
    department: "Administration",
    designation: "Office Assistant",
    branch: "Mumbai",
    location: "Maharashtra",
    dateOfJoining: "2025-01-10",
    employmentType: "FULL_TIME",
    probationDays: 180,
    salary: {
      basic: 18000,
      hra: 9000,
      specialAllowance: 5000,
      conveyance: 1600,
      medicalAllowance: 1250,
      lta: 0
    },
    documents: {},
    bankDetails: {
      bankName: "HDFC Bank",
      accountNumber: "50100087654329",
      ifscCode: "HDFC0000104",
      branchName: "Nariman Point",
      accountType: "SAVINGS"
    },
    education: {
      tenthMarksSheet: "10th_marksheet.pdf",
      tenthCertificate: "10th_cert.pdf",
      twelfthMarksSheet: "12th_marksheet.pdf",
      twelfthCertificate: "12th_cert.pdf",
      graduationMarksSheet: null,
      graduationCertificate: null,
      pgMarksSheet: null,
      pgCertificate: null,
      doctoralMarksSheet: null,
      doctoralCertificate: null
    },
    experience: []
  },
  {
    id: "EMP-006",
    fullName: "Dakota Heathcote",
    email: "dakota@example.com",
    mobile: "9876543215",
    pan: "DEFGH1234J",
    aadhaar: "678901234567",
    uan: "100987654326",
    esicNumber: "31123456780010106",
    department: "Finance",
    designation: "Corporate Lawyer",
    branch: "Mumbai",
    location: "Maharashtra",
    dateOfJoining: "2024-06-15",
    employmentType: "FULL_TIME",
    probationDays: 90,
    salary: {
      basic: 60000,
      hra: 30000,
      specialAllowance: 25000,
      conveyance: 1600,
      medicalAllowance: 1250,
      lta: 4000
    },
    documents: {},
    bankDetails: {
      bankName: "Kotak Mahindra Bank",
      accountNumber: "1029384756",
      ifscCode: "KKBK0000650",
      branchName: "Nariman Point",
      accountType: "SAVINGS"
    },
    education: {
      tenthMarksSheet: "10th_marksheet.pdf",
      tenthCertificate: "10th_cert.pdf",
      twelfthMarksSheet: "12th_marksheet.pdf",
      twelfthCertificate: "12th_cert.pdf",
      graduationMarksSheet: "grad_marksheet.pdf",
      graduationCertificate: "grad_degree.pdf",
      pgMarksSheet: null,
      pgCertificate: null,
      doctoralMarksSheet: null,
      doctoralCertificate: null
    },
    experience: []
  },
  {
    id: "EMP-007",
    fullName: "Ciara Glover",
    email: "ciara@example.com",
    mobile: "9876543216",
    pan: "KLMNO5678P",
    aadhaar: "789012345678",
    uan: "100987654327",
    esicNumber: "31123456780010107",
    department: "Production",
    designation: "Production Manager",
    branch: "Pune",
    location: "Maharashtra",
    dateOfJoining: "2025-02-01",
    employmentType: "CONTRACT",
    clientName: "Google India Pvt Ltd",
    workLocation: "Google Signature Towers, Gurugram",
    probationDays: 90,
    salary: {
      basic: 45000,
      hra: 22500,
      specialAllowance: 18000,
      conveyance: 1600,
      medicalAllowance: 1250,
      lta: 3000
    },
    documents: {},
    bankDetails: {
      bankName: "Yes Bank",
      accountNumber: "0012050012345",
      ifscCode: "YESB0000012",
      branchName: "MG Road, Pune",
      accountType: "SAVINGS"
    },
    education: {
      tenthMarksSheet: "10th_marksheet.pdf",
      tenthCertificate: "10th_cert.pdf",
      twelfthMarksSheet: "12th_marksheet.pdf",
      twelfthCertificate: "12th_cert.pdf",
      graduationMarksSheet: "grad_marksheet.pdf",
      graduationCertificate: "grad_degree.pdf",
      pgMarksSheet: null,
      pgCertificate: null,
      doctoralMarksSheet: null,
      doctoralCertificate: null
    },
    experience: []
  },
  {
    id: "EMP-008",
    fullName: "Pooja Hegde",
    email: "pooja.h@example.com",
    mobile: "9876543217",
    pan: "QRSTU9012V",
    aadhaar: "890123456789",
    uan: "100987654328",
    esicNumber: "31123456780010108",
    department: "Human Resources",
    designation: "HR Lead",
    branch: "Mumbai",
    location: "Maharashtra",
    dateOfJoining: "2021-08-01",
    employmentType: "FULL_TIME",
    probationDays: 0,
    salary: {
      basic: 55000,
      hra: 27500,
      specialAllowance: 22000,
      conveyance: 1600,
      medicalAllowance: 1250,
      lta: 4000
    },
    documents: {},
    bankDetails: {
      bankName: "Federal Bank",
      accountNumber: "2001928374",
      ifscCode: "FDRL0001204",
      branchName: "Nariman Point",
      accountType: "SAVINGS"
    },
    education: {
      tenthMarksSheet: "10th_marksheet.pdf",
      tenthCertificate: "10th_cert.pdf",
      twelfthMarksSheet: "12th_marksheet.pdf",
      twelfthCertificate: "12th_cert.pdf",
      graduationMarksSheet: "grad_marksheet.pdf",
      graduationCertificate: "grad_degree.pdf",
      pgMarksSheet: null,
      pgCertificate: null,
      doctoralMarksSheet: null,
      doctoralCertificate: null
    },
    experience: []
  }
];

