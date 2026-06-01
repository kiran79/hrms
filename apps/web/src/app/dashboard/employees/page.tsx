"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SaasSidebar } from "@/components/app/saas-sidebar";
import { Badge, Card } from "@/components/ui";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  FileText,
  User,
  Mail,
  Phone,
  Calendar,
  Building,
  MapPin,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  Upload,
  Clock,
  Briefcase
} from "lucide-react";

// Pre-populated default employees matching dashboard
const defaultEmployees = [
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

function calculateSingleDuration(fromStr: string, toStr: string): { years: number; months: number } {
  if (!fromStr || !toStr) return { years: 0, months: 0 };
  const fromDate = new Date(fromStr);
  const toDate = new Date(toStr);
  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) return { years: 0, months: 0 };
  if (toDate < fromDate) return { years: 0, months: 0 };

  let years = toDate.getFullYear() - fromDate.getFullYear();
  let months = toDate.getMonth() - fromDate.getMonth();
  let days = toDate.getDate() - fromDate.getDate();

  if (days < 0) {
    months -= 1;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  
  return { years: Math.max(0, years), months: Math.max(0, months) };
}

function getSingleDurationText(fromStr: string, toStr: string): string {
  const { years, months } = calculateSingleDuration(fromStr, toStr);
  return `${years} years ${months} months`;
}

function calculateTotalExperience(experiences: any[]): string {
  if (!experiences || experiences.length === 0) return "0 Years 0 Months";
  let totalMonths = 0;
  experiences.forEach(exp => {
    if (exp.fromDate && exp.toDate) {
      const { years, months } = calculateSingleDuration(exp.fromDate, exp.toDate);
      totalMonths += (years * 12) + months;
    }
  });
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return `${years} Years ${months} Months`;
}

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"self" | "manager">("manager");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [essTab, setEssTab] = useState<"kyc_salary" | "bank" | "education" | "experience">("kyc_salary");
  
  // Drawer visibility and tabs
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<"personal" | "statutory" | "bank" | "education" | "experience" | "documents">("personal");
  const [editingEmployee, setEditingEmployee] = useState<any | null>(null);

  // Helper for 3 months payslips validation (preceding 3 consecutive months ending in To Date)
  const getPayslipValidation = (
    cName: string,
    toDateStr: string | null,
    f1: string | null, m1: string, y1: string,
    f2: string | null, m2: string, y2: string,
    f3: string | null, m3: string, y3: string
  ) => {
    if (!cName) return { status: "empty", message: "Company name not set" };
    if (!f1 || !f2 || !f3) {
      return { status: "missing_files", message: "Pending upload of all 3 payslips." };
    }
    
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const reqList = [];
    
    if (toDateStr) {
      const targetDate = new Date(toDateStr);
      // Include the month of To Date (since it is the final month of employment) and the 2 months preceding it
      for (let i = 0; i < 3; i++) {
        const d = new Date(targetDate.getFullYear(), targetDate.getMonth() - i, 1);
        reqList.push({ month: months[d.getMonth()], year: String(d.getFullYear()) });
      }
    } else {
      // Fallback relative to current date (excluding current month as it's not finished)
      const now = new Date();
      for (let i = 1; i <= 3; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        reqList.push({ month: months[d.getMonth()], year: String(d.getFullYear()) });
      }
    }

    const selected = [
      { month: m1, year: y1 },
      { month: m2, year: y2 },
      { month: m3, year: y3 }
    ];

    const isValid = reqList.every(req =>
      selected.some(sel => sel.month === req.month && sel.year === req.year)
    );

    if (isValid) {
      return { status: "valid", message: "Verified: Payslips correspond to the preceding 3 consecutive months!" };
    } else {
      const reqStr = reqList.map(r => `${r.month} ${r.year}`).join(", ");
      return { 
        status: "invalid", 
        message: `Verification Failed: Must upload payslips for the 3 preceding months: ${reqStr}` 
      };
    }
  };

  // Form states
  const [empId, setEmpId] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [pan, setPan] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [uan, setUan] = useState("");
  const [esicNumber, setEsicNumber] = useState("");
  const [department, setDepartment] = useState("IT Department");
  const [designation, setDesignation] = useState("");
  const [branch, setBranch] = useState("Mumbai Head Office");
  const [location, setLocation] = useState("Maharashtra");
  const [dateOfJoining, setDateOfJoining] = useState("");
  const [employmentType, setEmploymentType] = useState("FULL_TIME");
  const [probationDays, setProbationDays] = useState(90);

  // Contract specific fields
  const [clientName, setClientName] = useState("");
  const [workLocation, setWorkLocation] = useState("");
  const [officeLocationsList, setOfficeLocationsList] = useState<any[]>([]);

  // Bank details form state
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [branchName, setBranchName] = useState("");
  const [accountType, setAccountType] = useState("SAVINGS");

  // Educational documents form state
  const [tenthMarksSheet, setTenthMarksSheet] = useState<string | null>(null);
  const [tenthCertificate, setTenthCertificate] = useState<string | null>(null);
  const [twelfthMarksSheet, setTwelfthMarksSheet] = useState<string | null>(null);
  const [twelfthCertificate, setTwelfthCertificate] = useState<string | null>(null);
  const [graduationMarksSheet, setGraduationMarksSheet] = useState<string | null>(null);
  const [graduationCertificate, setGraduationCertificate] = useState<string | null>(null);
  const [pgMarksSheet, setPgMarksSheet] = useState<string | null>(null);
  const [pgCertificate, setPgCertificate] = useState<string | null>(null);
  const [doctoralMarksSheet, setDoctoralMarksSheet] = useState<string | null>(null);
  const [doctoralCertificate, setDoctoralCertificate] = useState<string | null>(null);

  // Experience documents form state (3 companies)
  const [exp1Company, setExp1Company] = useState("");
  const [exp1FromDate, setExp1FromDate] = useState("");
  const [exp1ToDate, setExp1ToDate] = useState("");
  const [exp1Offer, setExp1Offer] = useState<string | null>(null);
  const [exp1Hike, setExp1Hike] = useState<string | null>(null);
  const [exp1Relieving, setExp1Relieving] = useState<string | null>(null);
  const [exp1Pay1File, setExp1Pay1File] = useState<string | null>(null);
  const [exp1Pay1Month, setExp1Pay1Month] = useState("Apr");
  const [exp1Pay1Year, setExp1Pay1Year] = useState("2026");
  const [exp1Pay2File, setExp1Pay2File] = useState<string | null>(null);
  const [exp1Pay2Month, setExp1Pay2Month] = useState("Mar");
  const [exp1Pay2Year, setExp1Pay2Year] = useState("2026");
  const [exp1Pay3File, setExp1Pay3File] = useState<string | null>(null);
  const [exp1Pay3Month, setExp1Pay3Month] = useState("Feb");
  const [exp1Pay3Year, setExp1Pay3Year] = useState("2026");

  const [exp2Company, setExp2Company] = useState("");
  const [exp2FromDate, setExp2FromDate] = useState("");
  const [exp2ToDate, setExp2ToDate] = useState("");
  const [exp2Offer, setExp2Offer] = useState<string | null>(null);
  const [exp2Hike, setExp2Hike] = useState<string | null>(null);
  const [exp2Relieving, setExp2Relieving] = useState<string | null>(null);
  const [exp2Pay1File, setExp2Pay1File] = useState<string | null>(null);
  const [exp2Pay1Month, setExp2Pay1Month] = useState("Jan");
  const [exp2Pay1Year, setExp2Pay1Year] = useState("2026");
  const [exp2Pay2File, setExp2Pay2File] = useState<string | null>(null);
  const [exp2Pay2Month, setExp2Pay2Month] = useState("Dec");
  const [exp2Pay2Year, setExp2Pay2Year] = useState("2025");
  const [exp2Pay3File, setExp2Pay3File] = useState<string | null>(null);
  const [exp2Pay3Month, setExp2Pay3Month] = useState("Nov");
  const [exp2Pay3Year, setExp2Pay3Year] = useState("2025");

  const [exp3Company, setExp3Company] = useState("");
  const [exp3FromDate, setExp3FromDate] = useState("");
  const [exp3ToDate, setExp3ToDate] = useState("");
  const [exp3Offer, setExp3Offer] = useState<string | null>(null);
  const [exp3Hike, setExp3Hike] = useState<string | null>(null);
  const [exp3Relieving, setExp3Relieving] = useState<string | null>(null);
  const [exp3Pay1File, setExp3Pay1File] = useState<string | null>(null);
  const [exp3Pay1Month, setExp3Pay1Month] = useState("Oct");
  const [exp3Pay1Year, setExp3Pay1Year] = useState("2025");
  const [exp3Pay2File, setExp3Pay2File] = useState<string | null>(null);
  const [exp3Pay2Month, setExp3Pay2Month] = useState("Sep");
  const [exp3Pay2Year, setExp3Pay2Year] = useState("2025");
  const [exp3Pay3File, setExp3Pay3File] = useState<string | null>(null);
  const [exp3Pay3Month, setExp3Pay3Month] = useState("Aug");
  const [exp3Pay3Year, setExp3Pay3Year] = useState("2025");

  // Base salary component states
  const [basic, setBasic] = useState(50000);
  const [hra, setHra] = useState(25000);
  const [specialAllowance, setSpecialAllowance] = useState(15000);
  const [conveyance, setConveyance] = useState(1600);
  const [medicalAllowance, setMedicalAllowance] = useState(1250);
  const [lta, setLta] = useState(4000);

  // Mock Upload states
  const [aadhaarFile, setAadhaarFile] = useState<string | null>(null);
  const [panFile, setPanFile] = useState<string | null>(null);
  const [offerFile, setOfferFile] = useState<string | null>(null);

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userType = localStorage.getItem("session_user_type");
      if (userType !== "company") {
        router.push("/login?tab=company");
        return;
      }

      const stored = localStorage.getItem("employees");
      if (stored) {
        let parsed = JSON.parse(stored);
        
        // Force upgrade EMP-001 default experience dates if missing or empty
        const emp1 = parsed.find((e: any) => e.id === "EMP-001");
        if (emp1) {
          const needsUpgrade = !emp1.experience || 
                               emp1.experience.length === 0 || 
                               !emp1.experience.some((exp: any) => exp.fromDate) ||
                               (emp1.experience[1] && emp1.experience[1].payslip1?.year === "2026");
          if (needsUpgrade) {
            emp1.experience = defaultEmployees[0].experience;
            localStorage.setItem("employees", JSON.stringify(parsed));
          }
        }

        // Force upgrade EMP-007 contract details if missing
        const emp7 = parsed.find((e: any) => e.id === "EMP-007");
        if (emp7 && emp7.employmentType === "CONTRACT" && !emp7.clientName) {
          emp7.clientName = "Google India Pvt Ltd";
          emp7.workLocation = "Google Signature Towers, Gurugram";
          localStorage.setItem("employees", JSON.stringify(parsed));
        }

        setEmployees(parsed);
      } else {
        localStorage.setItem("employees", JSON.stringify(defaultEmployees));
        setEmployees(defaultEmployees);
      }

      // Load locations
      const storedLoc = localStorage.getItem("hrms_locations");
      if (storedLoc) {
        setOfficeLocationsList(JSON.parse(storedLoc));
      } else {
        const defaultLocs = [
          { id: 1, name: "Mumbai Corporate Office", region: "West India", officeType: "Corporate Office", city: "Mumbai", address: "Maker Chambers, Nariman Point, Mumbai, Maharashtra 400021" },
          { id: 2, name: "Bengaluru Branch Office", region: "South India", officeType: "Branch Office", city: "Bengaluru", address: "Prestige Tech Park, Outer Ring Road, Bengaluru, Karnataka 560103" },
          { id: 3, name: "Pune Support Office", region: "West India", officeType: "Support", city: "Pune", address: "Viman Nagar, Pune, Maharashtra 411014" }
        ];
        localStorage.setItem("hrms_locations", JSON.stringify(defaultLocs));
        setOfficeLocationsList(defaultLocs);
      }

      setViewMode((localStorage.getItem("session_view_mode") as any) || "manager");
      setCurrentUserEmail(localStorage.getItem("session_company_email") || "admin@example.com");

      const listener = () => {
        setViewMode((localStorage.getItem("session_view_mode") as any) || "manager");
        setCurrentUserEmail(localStorage.getItem("session_company_email") || "admin@example.com");
      };
      window.addEventListener("viewModeChanged", listener);
      return () => window.removeEventListener("viewModeChanged", listener);
    }
  }, [router]);

  const openAddDrawer = () => {
    setEditingEmployee(null);
    setFormError(null);
    setFormSuccess(null);
    setDrawerTab("personal");

    // Load ID generator config
    let nextId = `EMP-${String(employees.length + 1).padStart(3, "0")}`;
    const storedIdConfig = localStorage.getItem("hrms_id_config");
    if (storedIdConfig) {
      const config = JSON.parse(storedIdConfig);
      const prefix = config.prefix || "EMP-";
      const nextNum = Number(config.nextNumber) || 9;
      const type = config.idType || "Numeric";
      const padding = Number(config.paddingLength) || 3;
      
      if (type === "Numeric") {
        nextId = `${prefix}${String(nextNum).padStart(padding, "0")}`;
      } else {
        const alphanumericChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let alphaStr = "";
        let temp = nextNum;
        while (temp > 0) {
          alphaStr = alphanumericChars[temp % 36] + alphaStr;
          temp = Math.floor(temp / 36);
        }
        alphaStr = alphaStr.padStart(padding, "0");
        nextId = `${prefix}${alphaStr}`;
      }
    }
    setEmpId(nextId);
    setFullName("");
    setEmail("");
    setMobile("");
    setPan("");
    setAadhaar("");
    setUan("");
    setEsicNumber("");
    setDepartment("IT Department");
    setDesignation("");
    setBranch(officeLocationsList[0]?.city || "Mumbai");
    setLocation("Maharashtra");
    setDateOfJoining(new Date().toISOString().split("T")[0]);
    setEmploymentType("FULL_TIME");
    setProbationDays(90);

    setClientName("");
    setWorkLocation("");

    setBankName("");
    setAccountNumber("");
    setIfscCode("");
    setBranchName("");
    setAccountType("SAVINGS");

    setTenthMarksSheet(null);
    setTenthCertificate(null);
    setTwelfthMarksSheet(null);
    setTwelfthCertificate(null);
    setGraduationMarksSheet(null);
    setGraduationCertificate(null);
    setPgMarksSheet(null);
    setPgCertificate(null);
    setDoctoralMarksSheet(null);
    setDoctoralCertificate(null);

    setExp1Company("");
    setExp1FromDate("");
    setExp1ToDate("");
    setExp1Offer(null);
    setExp1Hike(null);
    setExp1Relieving(null);
    setExp1Pay1File(null);
    setExp1Pay1Month("Apr");
    setExp1Pay1Year("2026");
    setExp1Pay2File(null);
    setExp1Pay2Month("Mar");
    setExp1Pay2Year("2026");
    setExp1Pay3File(null);
    setExp1Pay3Month("Feb");
    setExp1Pay3Year("2026");

    setExp2Company("");
    setExp2FromDate("");
    setExp2ToDate("");
    setExp2Offer(null);
    setExp2Hike(null);
    setExp2Relieving(null);
    setExp2Pay1File(null);
    setExp2Pay1Month("Jan");
    setExp2Pay1Year("2026");
    setExp2Pay2File(null);
    setExp2Pay2Month("Dec");
    setExp2Pay2Year("2025");
    setExp2Pay3File(null);
    setExp2Pay3Month("Nov");
    setExp2Pay3Year("2025");

    setExp3Company("");
    setExp3FromDate("");
    setExp3ToDate("");
    setExp3Offer(null);
    setExp3Hike(null);
    setExp3Relieving(null);
    setExp3Pay1File(null);
    setExp3Pay1Month("Oct");
    setExp3Pay1Year("2025");
    setExp3Pay2File(null);
    setExp3Pay2Month("Sep");
    setExp3Pay2Year("2025");
    setExp3Pay3File(null);
    setExp3Pay3Month("Aug");
    setExp3Pay3Year("2025");

    setBasic(30000);
    setHra(15000);
    setSpecialAllowance(10000);
    setConveyance(1600);
    setMedicalAllowance(1250);
    setLta(2000);

    setAadhaarFile(null);
    setPanFile(null);
    setOfferFile(null);

    setDrawerOpen(true);
  };

  const openEditDrawer = (employee: any) => {
    setEditingEmployee(employee);
    setFormError(null);
    setFormSuccess(null);
    setDrawerTab("personal");

    // Populate fields
    setEmpId(employee.id);
    setFullName(employee.fullName);
    setEmail(employee.email);
    setMobile(employee.mobile);
    setPan(employee.pan || "");
    setAadhaar(employee.aadhaar || "");
    setUan(employee.uan || "");
    setEsicNumber(employee.esicNumber || "");
    setDepartment(employee.department);
    setDesignation(employee.designation);
    setBranch(employee.branch || "Mumbai Head Office");
    setLocation(employee.location || "Maharashtra");
    setDateOfJoining(employee.dateOfJoining || "");
    setEmploymentType(employee.employmentType || "FULL_TIME");
    setProbationDays(employee.probationDays ?? 90);

    setClientName(employee.clientName || "");
    setWorkLocation(employee.workLocation || "");

    const bank = employee.bankDetails || {};
    setBankName(bank.bankName || "");
    setAccountNumber(bank.accountNumber || "");
    setIfscCode(bank.ifscCode || "");
    setBranchName(bank.branchName || "");
    setAccountType(bank.accountType || "SAVINGS");

    const edu = employee.education || {};
    setTenthMarksSheet(edu.tenthMarksSheet || null);
    setTenthCertificate(edu.tenthCertificate || null);
    setTwelfthMarksSheet(edu.twelfthMarksSheet || null);
    setTwelfthCertificate(edu.twelfthCertificate || null);
    setGraduationMarksSheet(edu.graduationMarksSheet || null);
    setGraduationCertificate(edu.graduationCertificate || null);
    setPgMarksSheet(edu.pgMarksSheet || null);
    setPgCertificate(edu.pgCertificate || null);
    setDoctoralMarksSheet(edu.doctoralMarksSheet || null);
    setDoctoralCertificate(edu.doctoralCertificate || null);

    const expList = employee.experience || [];
    const exp1 = expList[0] || {};
    setExp1Company(exp1.companyName || "");
    setExp1FromDate(exp1.fromDate || "");
    setExp1ToDate(exp1.toDate || "");
    setExp1Offer(exp1.offerLetter || null);
    setExp1Hike(exp1.hikeLetter || null);
    setExp1Relieving(exp1.relievingLetter || null);
    setExp1Pay1File(exp1.payslip1?.file || null);
    setExp1Pay1Month(exp1.payslip1?.month || "Apr");
    setExp1Pay1Year(exp1.payslip1?.year || "2026");
    setExp1Pay2File(exp1.payslip2?.file || null);
    setExp1Pay2Month(exp1.payslip2?.month || "Mar");
    setExp1Pay2Year(exp1.payslip2?.year || "2026");
    setExp1Pay3File(exp1.payslip3?.file || null);
    setExp1Pay3Month(exp1.payslip3?.month || "Feb");
    setExp1Pay3Year(exp1.payslip3?.year || "2026");

    const exp2 = expList[1] || {};
    setExp2Company(exp2.companyName || "");
    setExp2FromDate(exp2.fromDate || "");
    setExp2ToDate(exp2.toDate || "");
    setExp2Offer(exp2.offerLetter || null);
    setExp2Hike(exp2.hikeLetter || null);
    setExp2Relieving(exp2.relievingLetter || null);
    setExp2Pay1File(exp2.payslip1?.file || null);
    setExp2Pay1Month(exp2.payslip1?.month || "Jan");
    setExp2Pay1Year(exp2.payslip1?.year || "2026");
    setExp2Pay2File(exp2.payslip2?.file || null);
    setExp2Pay2Month(exp2.payslip2?.month || "Dec");
    setExp2Pay2Year(exp2.payslip2?.year || "2025");
    setExp2Pay3File(exp2.payslip3?.file || null);
    setExp2Pay3Month(exp2.payslip3?.month || "Nov");
    setExp2Pay3Year(exp2.payslip3?.year || "2025");

    const exp3 = expList[2] || {};
    setExp3Company(exp3.companyName || "");
    setExp3FromDate(exp3.fromDate || "");
    setExp3ToDate(exp3.toDate || "");
    setExp3Offer(exp3.offerLetter || null);
    setExp3Hike(exp3.hikeLetter || null);
    setExp3Relieving(exp3.relievingLetter || null);
    setExp3Pay1File(exp3.payslip1?.file || null);
    setExp3Pay1Month(exp3.payslip1?.month || "Oct");
    setExp3Pay1Year(exp3.payslip1?.year || "2025");
    setExp3Pay2File(exp3.payslip2?.file || null);
    setExp3Pay2Month(exp3.payslip2?.month || "Sep");
    setExp3Pay2Year(exp3.payslip2?.year || "2025");
    setExp3Pay3File(exp3.payslip3?.file || null);
    setExp3Pay3Month(exp3.payslip3?.month || "Aug");
    setExp3Pay3Year(exp3.payslip3?.year || "2025");

    const sal = employee.salary || {};
    setBasic(sal.basic || 0);
    setHra(sal.hra || 0);
    setSpecialAllowance(sal.specialAllowance || 0);
    setConveyance(sal.conveyance || 0);
    setMedicalAllowance(sal.medicalAllowance || 0);
    setLta(sal.lta || 0);

    const docs = employee.documents || {};
    setAadhaarFile(docs.aadhaar || null);
    setPanFile(docs.pan || null);
    setOfferFile(docs.offerLetter || null);

    setDrawerOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm(`Are you sure you want to delete employee ${id}?`)) {
      const updated = employees.filter((e) => e.id !== id);
      setEmployees(updated);
      localStorage.setItem("employees", JSON.stringify(updated));
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    // Validation checks
    if (!fullName || !email || !mobile || !designation) {
      setFormError("Please fill out all mandatory fields.");
      return;
    }

    if (aadhaar && (aadhaar.length !== 12 || isNaN(Number(aadhaar)))) {
      setFormError("Aadhaar Card number must be exactly 12 digits.");
      return;
    }

    if (pan && pan.length !== 10) {
      setFormError("PAN Card number must be exactly 10 characters.");
      return;
    }

    if (uan && uan.length !== 12) {
      setFormError("Universal Account Number (UAN) must be exactly 12 digits.");
      return;
    }

    const payload = {
      id: empId,
      fullName,
      email,
      mobile,
      pan: pan.toUpperCase(),
      aadhaar,
      uan,
      esicNumber,
      department,
      designation,
      branch,
      location,
      dateOfJoining,
      employmentType,
      probationDays: Number(probationDays),
      clientName: employmentType === "CONTRACT" ? clientName : "",
      workLocation: workLocation,
      bankDetails: {
        bankName,
        accountNumber,
        ifscCode: ifscCode.toUpperCase(),
        branchName,
        accountType
      },
      education: {
        tenthMarksSheet,
        tenthCertificate,
        twelfthMarksSheet,
        twelfthCertificate,
        graduationMarksSheet,
        graduationCertificate,
        pgMarksSheet,
        pgCertificate,
        doctoralMarksSheet,
        doctoralCertificate
      },
      experience: [
        {
          companyName: exp1Company,
          fromDate: exp1FromDate,
          toDate: exp1ToDate,
          offerLetter: exp1Offer,
          hikeLetter: exp1Hike,
          relievingLetter: exp1Relieving,
          payslip1: { file: exp1Pay1File, month: exp1Pay1Month, year: exp1Pay1Year },
          payslip2: { file: exp1Pay2File, month: exp1Pay2Month, year: exp1Pay2Year },
          payslip3: { file: exp1Pay3File, month: exp1Pay3Month, year: exp1Pay3Year }
        },
        {
          companyName: exp2Company,
          fromDate: exp2FromDate,
          toDate: exp2ToDate,
          offerLetter: exp2Offer,
          hikeLetter: exp2Hike,
          relievingLetter: exp2Relieving,
          payslip1: { file: exp2Pay1File, month: exp2Pay1Month, year: exp2Pay1Year },
          payslip2: { file: exp2Pay2File, month: exp2Pay2Month, year: exp2Pay2Year },
          payslip3: { file: exp2Pay3File, month: exp2Pay3Month, year: exp2Pay3Year }
        },
        {
          companyName: exp3Company,
          fromDate: exp3FromDate,
          toDate: exp3ToDate,
          offerLetter: exp3Offer,
          hikeLetter: exp3Hike,
          relievingLetter: exp3Relieving,
          payslip1: { file: exp3Pay1File, month: exp3Pay1Month, year: exp3Pay1Year },
          payslip2: { file: exp3Pay2File, month: exp3Pay2Month, year: exp3Pay2Year },
          payslip3: { file: exp3Pay3File, month: exp3Pay3Month, year: exp3Pay3Year }
        }
      ],
      salary: {
        basic: Number(basic),
        hra: Number(hra),
        specialAllowance: Number(specialAllowance),
        conveyance: Number(conveyance),
        medicalAllowance: Number(medicalAllowance),
        lta: Number(lta)
      },
      documents: {
        aadhaar: aadhaarFile,
        pan: panFile,
        offerLetter: offerFile
      }
    };

    let updatedEmployees;
    if (editingEmployee) {
      // Update
      updatedEmployees = employees.map((emp) => (emp.id === editingEmployee.id ? payload : emp));
      setFormSuccess("Employee record updated successfully!");
    } else {
      // Add
      if (employees.some((emp) => emp.id === empId)) {
        setFormError("An employee with this ID already exists.");
        return;
      }
      updatedEmployees = [...employees, payload];
      setFormSuccess("New employee added successfully!");

      // Increment ID Config nextNumber
      const storedIdConfig = localStorage.getItem("hrms_id_config");
      if (storedIdConfig) {
        const config = JSON.parse(storedIdConfig);
        config.nextNumber = (Number(config.nextNumber) || 9) + 1;
        localStorage.setItem("hrms_id_config", JSON.stringify(config));
      }

      // Automatically create IT asset request for onboarding employee
      const storedRequests = localStorage.getItem("hrms_asset_requests");
      const assetRequests = storedRequests ? JSON.parse(storedRequests) : [];
      const newReqId = assetRequests.length > 0 ? Math.max(...assetRequests.map((r: any) => r.id)) + 1 : 1;
      const newRequest = {
        id: newReqId,
        employeeId: empId,
        employeeName: fullName,
        status: "Pending",
        date: new Date().toISOString().split("T")[0],
        comments: `Allot necessary IT assets for onboarded employee ${fullName} (${empId}).`
      };
      localStorage.setItem("hrms_asset_requests", JSON.stringify([newRequest, ...assetRequests]));

      // Send Mock Notification
      try {
        const storedLogs = localStorage.getItem("hrms_email_notifications_log") || "[]";
        const emailLogs = JSON.parse(storedLogs);
        const emailConfig = localStorage.getItem("hrms_email_config");
        if (emailConfig) {
          const cfg = JSON.parse(emailConfig);
          if (cfg.toggles?.offerLetter?.employee) {
            emailLogs.push({
              id: emailLogs.length + 1,
              event: "Offer Letter Sent",
              recipient: email,
              recipientType: "Employee",
              subject: `Welcome to the Team, ${fullName}!`,
              body: `Dear ${fullName},\n\nWelcome aboard! Your employee profile has been created with ID: ${empId}. Our IT department has been notified to allot your necessary equipment.\n\nBest regards,\nHR Team`,
              sentAt: new Date().toISOString()
            });
          }
          if (cfg.toggles?.offerLetter?.manager) {
            emailLogs.push({
              id: emailLogs.length + 1,
              event: "Offer Letter Sent",
              recipient: cfg.fromEmail || "hr@company.com",
              recipientType: "Manager",
              subject: `[Notification] Onboarding Complete: ${fullName}`,
              body: `New employee ${fullName} (${empId}) has onboarded successfully. IT asset allocation request was submitted automatically.`,
              sentAt: new Date().toISOString()
            });
          }
          localStorage.setItem("hrms_email_notifications_log", JSON.stringify(emailLogs));
        }
      } catch (e) {
        console.error("Failed to send onboarding notifications:", e);
      }
    }

    setEmployees(updatedEmployees);
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));

    setTimeout(() => {
      setDrawerOpen(false);
    }, 800);
  };

  const filteredEmployees = employees.filter((e) => {
    const matchesSearch =
      e.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === "All" || e.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const departments = [
    "IT Department",
    "Customer Support",
    "Administration",
    "Research & Development",
    "Human Resources",
    "Production",
    "Operations",
    "Finance",
    "Sales & Marketing"
  ];

  const selfEmployee = employees.find(e => e.email.toLowerCase() === currentUserEmail.toLowerCase()) || employees[0];

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[280px_1fr]">
      <SaasSidebar active="Employees" />

      <section className="p-6 lg:p-8 overflow-y-auto">
        {viewMode === "self" ? (
          <div>
            {/* Header Section */}
            <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white -mx-6 -mt-6 p-6 lg:-mx-8 lg:-mt-8 shadow-sm">
              <div>
                <h2 className="text-2xl font-black text-slate-900">My Employee Profile</h2>
                <p className="mt-1 text-sm text-slate-500">View and update your personal files, statutory KYC data, and salary components.</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={"/dashboard/reports?tab=my_profile" as any}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 shadow hover:bg-slate-50 transition"
                >
                  <FileText className="size-4 text-indigo-500" /> View Profile Audit
                </Link>
                {selfEmployee && (
                  <button
                    onClick={() => openEditDrawer(selfEmployee)}
                    className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-xs font-black text-white shadow hover:bg-indigo-700 transition"
                  >
                    <Edit className="size-4" /> Edit My Profile
                  </button>
                )}
              </div>
            </header>

            {/* Profile Detail Cards */}
            {selfEmployee && (
              <div className="grid gap-6 md:grid-cols-3">
                {/* Basic Card (Left Column) */}
                <Card className="col-span-1 border-slate-200 p-6 flex flex-col items-center text-center shadow-sm">
                  <div className="size-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-extrabold text-3xl mb-4">
                    {selfEmployee.fullName.split(" ").map((n: string) => n[0]).join("")}
                  </div>
                  <h3 className="text-lg font-black text-slate-900">{selfEmployee.fullName}</h3>
                  <span className="rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-xs font-semibold mt-1 inline-block">{selfEmployee.designation}</span>
                  <p className="text-xs text-slate-400 mt-1.5">{selfEmployee.department}</p>
                  
                  <div className="w-full border-t border-slate-100 mt-6 pt-4 text-left space-y-2.5 text-xs">
                    <div className="flex justify-between"><span className="text-slate-400 font-semibold">Employee ID:</span><span className="font-bold text-slate-800">{selfEmployee.id}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400 font-semibold">Joining Date:</span><span className="font-bold text-slate-800">{selfEmployee.dateOfJoining}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400 font-semibold">Branch:</span><span className="font-bold text-slate-800">{selfEmployee.branch}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400 font-semibold">Employment:</span><span className="font-bold text-slate-800">{selfEmployee.employmentType}</span></div>
                    {selfEmployee.employmentType === "CONTRACT" && (
                      <div className="flex justify-between border-t border-slate-100 pt-2"><span className="text-indigo-600 font-semibold">Client Name:</span><span className="font-bold text-slate-800">{selfEmployee.clientName || "Not configured"}</span></div>
                    )}
                    {(selfEmployee.employmentType === "CONTRACT" || selfEmployee.employmentType === "FULL_TIME" || selfEmployee.employmentType === "PART_TIME" || selfEmployee.employmentType === "INTERN") && (
                      <div className="flex justify-between border-t border-slate-100 pt-2"><span className="text-indigo-600 font-semibold">Work Location:</span><span className="font-bold text-slate-800">{selfEmployee.workLocation || "Not configured"}</span></div>
                    )}
                  </div>
                </Card>

                {/* Tabbed Card (Right Column) */}
                <Card className="col-span-1 md:col-span-2 border-slate-200 shadow-sm p-0 flex flex-col overflow-hidden bg-white">
                  {/* Tabs Selector */}
                  <div className="flex flex-wrap border-b border-slate-150 bg-slate-50 text-xs font-bold text-slate-500">
                    <button
                      onClick={() => setEssTab("kyc_salary")}
                      className={`flex-1 py-3 text-center border-b-2 transition ${essTab === "kyc_salary" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent hover:bg-slate-100"}`}
                    >
                      KYC & Salary
                    </button>
                    <button
                      onClick={() => setEssTab("bank")}
                      className={`flex-1 py-3 text-center border-b-2 transition ${essTab === "bank" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent hover:bg-slate-100"}`}
                    >
                      Bank Details
                    </button>
                    <button
                      onClick={() => setEssTab("education")}
                      className={`flex-1 py-3 text-center border-b-2 transition ${essTab === "education" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent hover:bg-slate-100"}`}
                    >
                      Education Certs
                    </button>
                    <button
                      onClick={() => setEssTab("experience")}
                      className={`flex-1 py-3 text-center border-b-2 transition ${essTab === "experience" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent hover:bg-slate-100"}`}
                    >
                      Work Experience Portfolio - {calculateTotalExperience(selfEmployee.experience)}
                    </button>
                  </div>

                  {/* Tab Body */}
                  <div className="p-6 overflow-y-auto max-h-[600px]">
                    {/* TAB: KYC & Salary */}
                    {essTab === "kyc_salary" && (
                      <div className="grid gap-6 md:grid-cols-2 text-xs">
                        {/* Contact & KYC */}
                        <div className="space-y-4">
                          <h4 className="font-black text-sm text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                            <ShieldCheck className="size-4 text-indigo-500" /> Contact & KYC Details
                          </h4>
                          <div>
                            <span className="text-slate-400 block font-semibold mb-0.5">Email Address</span>
                            <span className="font-bold text-slate-800 flex items-center gap-1.5"><Mail className="size-3.5 text-slate-400" /> {selfEmployee.email}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-semibold mb-0.5">Mobile Phone</span>
                            <span className="font-bold text-slate-800 flex items-center gap-1.5"><Phone className="size-3.5 text-slate-400" /> {selfEmployee.mobile}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-semibold mb-0.5">PAN Card Number</span>
                            <span className="font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded font-mono text-[10px] w-fit block">{selfEmployee.pan || "Not provided"}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-semibold mb-0.5">Aadhaar Card (Last 4 digits)</span>
                            <span className="font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded font-mono text-[10px] w-fit block">
                              {selfEmployee.aadhaar ? `xxxx-xxxx-${selfEmployee.aadhaar.slice(-4)}` : "Not provided"}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-semibold mb-0.5">UAN / Provident Fund</span>
                            <span className="font-bold text-slate-800 font-mono">{selfEmployee.uan || "Not provided"}</span>
                          </div>
                        </div>

                        {/* Salary breakdown */}
                        <div className="space-y-3">
                          <h4 className="font-black text-sm text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                            <CreditCard className="size-4 text-indigo-500" /> Baseline Salary (Monthly)
                          </h4>
                          <div className="flex justify-between border-b border-slate-100 pb-2">
                            <span className="text-slate-500 font-semibold">Basic Pay</span>
                            <span className="font-bold text-slate-800">₹{selfEmployee.salary?.basic?.toLocaleString() || 0}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-2">
                            <span className="text-slate-500 font-semibold">House Rent Allowance (HRA)</span>
                            <span className="font-bold text-slate-800">₹{selfEmployee.salary?.hra?.toLocaleString() || 0}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-2">
                            <span className="text-slate-500 font-semibold">Special Allowance</span>
                            <span className="font-bold text-slate-800">₹{selfEmployee.salary?.specialAllowance?.toLocaleString() || 0}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-2">
                            <span className="text-slate-500 font-semibold">Conveyance Allowance</span>
                            <span className="font-bold text-slate-800">₹{selfEmployee.salary?.conveyance?.toLocaleString() || 0}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-2">
                            <span className="text-slate-500 font-semibold">Medical Allowance</span>
                            <span className="font-bold text-slate-800">₹{selfEmployee.salary?.medicalAllowance?.toLocaleString() || 0}</span>
                          </div>
                          <div className="flex justify-between pt-1">
                            <span className="text-indigo-600 font-bold">Total Gross Base Salary</span>
                            <span className="font-black text-indigo-600 font-black">
                              ₹{
                                (
                                  (selfEmployee.salary?.basic || 0) +
                                  (selfEmployee.salary?.hra || 0) +
                                  (selfEmployee.salary?.specialAllowance || 0) +
                                  (selfEmployee.salary?.conveyance || 0) +
                                  (selfEmployee.salary?.medicalAllowance || 0) +
                                  (selfEmployee.salary?.lta || 0)
                                ).toLocaleString()
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB: Bank Account Details */}
                    {essTab === "bank" && (
                      <div className="space-y-4 text-xs">
                        <h4 className="font-black text-sm text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                          <Building className="size-4 text-indigo-500" /> Saved Bank Credentials
                        </h4>
                        {selfEmployee.bankDetails?.bankName ? (
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <span className="text-slate-400 block font-semibold mb-0.5">Bank Name</span>
                              <span className="font-bold text-slate-800 text-sm">{selfEmployee.bankDetails.bankName}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-semibold mb-0.5">Account Type</span>
                              <span className="font-bold text-slate-800 text-sm">{selfEmployee.bankDetails.accountType}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-semibold mb-0.5">Account Number</span>
                              <span className="font-bold text-slate-800 text-sm font-mono">{selfEmployee.bankDetails.accountNumber}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-semibold mb-0.5">IFSC Code</span>
                              <span className="font-bold text-slate-800 text-sm font-mono">{selfEmployee.bankDetails.ifscCode}</span>
                            </div>
                            <div className="sm:col-span-2">
                              <span className="text-slate-400 block font-semibold mb-0.5">Branch Name</span>
                              <span className="font-bold text-slate-800">{selfEmployee.bankDetails.branchName}</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-slate-400 italic">No bank credentials configured yet.</p>
                        )}
                      </div>
                    )}

                    {/* TAB: Educational Certificates */}
                    {essTab === "education" && (
                      <div className="space-y-4 text-xs">
                        <h4 className="font-black text-sm text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                          <FileText className="size-4 text-indigo-500" /> Educational Certifications
                        </h4>
                        
                        <div className="divide-y divide-slate-100">
                          {[
                            { name: "X (Tenth / SSC)", marks: selfEmployee.education?.tenthMarksSheet, cert: selfEmployee.education?.tenthCertificate },
                            { name: "XII or Intermediate", marks: selfEmployee.education?.twelfthMarksSheet, cert: selfEmployee.education?.twelfthCertificate },
                            { name: "Graduation (Bachelor's)", marks: selfEmployee.education?.graduationMarksSheet, cert: selfEmployee.education?.graduationCertificate },
                            { name: "Post Graduation (Master's)", marks: selfEmployee.education?.pgMarksSheet, cert: selfEmployee.education?.pgCertificate },
                            { name: "Doctoral Degree (Ph.D.)", marks: selfEmployee.education?.doctoralMarksSheet, cert: selfEmployee.education?.doctoralCertificate }
                          ].map((edu, idx) => (
                            <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div>
                                <span className="font-bold text-slate-800 block">{edu.name}</span>
                                <span className="text-[10px] text-slate-400">
                                  {edu.marks || edu.cert ? "Verified Records Found" : "Not Provided"}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                {edu.marks && (
                                  <a href="#" onClick={(e) => {e.preventDefault(); alert(`Viewing Marks Sheet: ${edu.marks}`)}} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded flex items-center gap-1 transition">
                                    <FileText className="size-3" /> Marks Sheet
                                  </a>
                                )}
                                {edu.cert && (
                                  <a href="#" onClick={(e) => {e.preventDefault(); alert(`Viewing Convocation Certificate: ${edu.cert}`)}} className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded flex items-center gap-1 transition">
                                    <FileText className="size-3" /> Certificate
                                  </a>
                                )}
                                {!edu.marks && !edu.cert && (
                                  <span className="text-slate-300 italic text-[10px]">No documents uploaded</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TAB: Experience Portfolio */}
                    {essTab === "experience" && (
                      <div className="space-y-6 text-xs">
                        <h4 className="font-black text-sm text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                          <Briefcase className="size-4 text-indigo-500" /> Work Experience Portfolio - {calculateTotalExperience(selfEmployee.experience)}
                        </h4>
                        
                        {selfEmployee.experience && selfEmployee.experience.length > 0 ? (
                          <div className="space-y-4">
                            {selfEmployee.experience.map((exp: any, idx: number) => {
                              if (!exp.companyName) return null;
                              const val = getPayslipValidation(
                                exp.companyName,
                                exp.toDate || null,
                                exp.payslip1?.file, exp.payslip1?.month, exp.payslip1?.year,
                                exp.payslip2?.file, exp.payslip2?.month, exp.payslip2?.year,
                                exp.payslip3?.file, exp.payslip3?.month, exp.payslip3?.year
                              );
                              return (
                                <div key={idx} className="border border-slate-150 rounded-lg p-4 bg-slate-50/50">
                                  <div className="flex justify-between items-start gap-2 border-b border-slate-200 pb-2 mb-3">
                                    <div>
                                      <h5 className="font-bold text-slate-800 text-sm">{exp.companyName}</h5>
                                      {exp.fromDate && exp.toDate && (
                                        <div className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md font-bold mt-1 mb-1.5 flex items-center gap-1 w-fit">
                                          <Clock className="size-3" /> {exp.fromDate} to {exp.toDate} ({getSingleDurationText(exp.fromDate, exp.toDate)})
                                        </div>
                                      )}
                                      <span className="text-[10px] text-slate-400">Previous Employer #{idx + 1}</span>
                                    </div>
                                    {val.status === "valid" ? (
                                      <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-black">Payslips Verified</span>
                                    ) : (
                                      <span className="bg-rose-100 text-rose-800 text-[10px] px-2 py-0.5 rounded font-black">Verification Failed</span>
                                    )}
                                  </div>

                                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 mb-3">
                                    {exp.offerLetter && (
                                      <a href="#" onClick={(e) => {e.preventDefault(); alert(`Viewing Offer Letter: ${exp.offerLetter}`)}} className="p-2 bg-white rounded border border-slate-200 hover:bg-slate-50 transition text-slate-700 flex items-center gap-1.5">
                                        <FileText className="size-3.5 text-indigo-500" /> Offer Letter
                                      </a>
                                    )}
                                    {exp.hikeLetter && (
                                      <a href="#" onClick={(e) => {e.preventDefault(); alert(`Viewing Hike Letter: ${exp.hikeLetter}`)}} className="p-2 bg-white rounded border border-slate-200 hover:bg-slate-50 transition text-slate-700 flex items-center gap-1.5">
                                        <FileText className="size-3.5 text-indigo-500" /> Increment Letter
                                      </a>
                                    )}
                                    {exp.relievingLetter && (
                                      <a href="#" onClick={(e) => {e.preventDefault(); alert(`Viewing Relieving Letter: ${exp.relievingLetter}`)}} className="p-2 bg-white rounded border border-slate-200 hover:bg-slate-50 transition text-slate-700 flex items-center gap-1.5">
                                        <FileText className="size-3.5 text-indigo-500" /> Relieving Letter
                                      </a>
                                    )}
                                  </div>

                                  <div className="border-t border-slate-200 pt-2.5">
                                    <span className="text-[10px] font-bold text-slate-400 block mb-1">Submitted Payslips:</span>
                                    <div className="flex flex-wrap gap-2">
                                      {exp.payslip1?.file && <span className="bg-white border border-slate-200 px-2 py-1 rounded text-[10px] text-slate-600">{exp.payslip1.month} {exp.payslip1.year} ({exp.payslip1.file})</span>}
                                      {exp.payslip2?.file && <span className="bg-white border border-slate-200 px-2 py-1 rounded text-[10px] text-slate-600">{exp.payslip2.month} {exp.payslip2.year} ({exp.payslip2.file})</span>}
                                      {exp.payslip3?.file && <span className="bg-white border border-slate-200 px-2 py-1 rounded text-[10px] text-slate-600">{exp.payslip3.month} {exp.payslip3.year} ({exp.payslip3.file})</span>}
                                    </div>
                                    <p className={`text-[10px] mt-2 font-bold ${val.status === "valid" ? "text-emerald-600" : "text-rose-600"}`}>
                                      {val.message}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-slate-400 italic">No previous work experience records added yet.</p>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Header Section */}
            <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white -mx-6 -mt-6 p-6 lg:-mx-8 lg:-mt-8 shadow-sm">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Employee Master Directory</h2>
                <p className="mt-1 text-sm text-slate-500">Manage employee files, statutory KYC data, configurations, and baseline compensation.</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={"/dashboard/reports?tab=employees" as any}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 shadow hover:bg-slate-50 transition"
                >
                  <FileText className="size-4 text-indigo-500" /> View Directory Reports
                </Link>
                <button
                  onClick={openAddDrawer}
                  className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-xs font-black text-white shadow hover:bg-indigo-700 transition"
                >
                  <Plus className="size-4" /> Add New Employee
                </button>
              </div>
            </header>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
              <Search className="size-4" />
            </span>
            <input
              type="text"
              placeholder="Search by ID, name, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-md border border-slate-200 pl-9 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">Department</span>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="h-10 rounded-md border border-slate-200 px-3 text-sm bg-white outline-none focus:border-indigo-500"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Employees Table Card */}
        <Card className="border-slate-200 shadow-sm overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Employee ID</th>
                  <th className="p-4">Full Name</th>
                  <th className="p-4">Designation & Dept</th>
                  <th className="p-4">Email & Phone</th>
                  <th className="p-4">Statutory KYC Verification</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp) => {
                    const hasKyc = emp.pan && emp.aadhaar && emp.uan;
                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-mono font-bold text-indigo-600">{emp.id}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="grid size-9 place-items-center rounded-full bg-indigo-50 font-bold text-indigo-600 text-sm">
                              {emp.fullName.slice(0, 1).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{emp.fullName}</p>
                              <span className="text-[10px] text-slate-400 font-bold uppercase">{emp.employmentType}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-slate-800">{emp.designation}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{emp.department}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-slate-800 flex items-center gap-1.5"><Mail className="size-3 text-slate-400" /> {emp.email}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1.5"><Phone className="size-3 text-slate-400" /> {emp.mobile}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${emp.pan ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"}`}>
                              PAN: {emp.pan ? "Verified" : "Missing"}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${emp.aadhaar ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"}`}>
                              Aadhaar: {emp.aadhaar ? "Verified" : "Missing"}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${emp.uan ? "bg-indigo-50 text-indigo-700 border border-indigo-100" : "bg-slate-100 text-slate-500 border border-slate-200"}`}>
                              UAN: {emp.uan ? "Active" : "None"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEditDrawer(emp)}
                              className="p-2 rounded bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 transition text-slate-500"
                              title="Edit Profile"
                            >
                              <Edit className="size-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(emp.id)}
                              className="p-2 rounded bg-slate-50 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition text-slate-500"
                              title="Delete Record"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold">
                      No employees match the filters. Click "Add New Employee" to register one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
          </div>
        )}

        {/* Add/Edit Drawer - Slide-over backdrop */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end">
            {/* Slide Drawer Content */}
            <div className="w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full animate-slide-in-right">
              {/* Header */}
              <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black">{editingEmployee ? "Edit Employee Profile" : "Register New Employee"}</h3>
                  <p className="text-xs text-slate-400 mt-1">Configure structural compliance, salary breakdown, and credentials.</p>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="rounded bg-slate-800 hover:bg-slate-700 p-1.5 transition text-slate-400 hover:text-white"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Drawer Tabs */}
              <div className="flex flex-wrap border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500">
                <button
                  type="button"
                  className={`flex-1 min-w-[120px] py-3 text-center border-b-2 transition ${drawerTab === "personal" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent hover:bg-slate-100"}`}
                  onClick={() => setDrawerTab("personal")}
                >
                  1. Personal & Job
                </button>
                <button
                  type="button"
                  className={`flex-1 min-w-[120px] py-3 text-center border-b-2 transition ${drawerTab === "statutory" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent hover:bg-slate-100"}`}
                  onClick={() => setDrawerTab("statutory")}
                >
                  2. KYC & Salary
                </button>
                <button
                  type="button"
                  className={`flex-1 min-w-[120px] py-3 text-center border-b-2 transition ${drawerTab === "bank" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent hover:bg-slate-100"}`}
                  onClick={() => setDrawerTab("bank")}
                >
                  3. Bank Account
                </button>
                <button
                  type="button"
                  className={`flex-1 min-w-[120px] py-3 text-center border-b-2 transition ${drawerTab === "education" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent hover:bg-slate-100"}`}
                  onClick={() => setDrawerTab("education")}
                >
                  4. Education Docs
                </button>
                <button
                  type="button"
                  className={`flex-1 min-w-[120px] py-3 text-center border-b-2 transition ${drawerTab === "experience" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent hover:bg-slate-100"}`}
                  onClick={() => setDrawerTab("experience")}
                >
                  5. Experience Docs
                </button>
                <button
                  type="button"
                  className={`flex-1 min-w-[120px] py-3 text-center border-b-2 transition ${drawerTab === "documents" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent hover:bg-slate-100"}`}
                  onClick={() => setDrawerTab("documents")}
                >
                  6. KYC Files
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-700">
                {formError && (
                  <div className="flex items-center gap-2 rounded-md bg-rose-50 border border-rose-200 p-3 text-xs font-bold text-rose-800">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}
                
                {formSuccess && (
                  <div className="flex items-center gap-2 rounded-md bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800">
                    <ShieldCheck className="size-4 shrink-0" />
                    <span>{formSuccess}</span>
                  </div>
                )}

                {/* TAB 1: Personal & Job */}
                {drawerTab === "personal" && (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                        Employee ID
                        <input
                          type="text"
                          value={empId}
                          onChange={(e) => setEmpId(e.target.value)}
                          className="h-10 rounded border border-slate-200 px-3 font-mono font-bold outline-none focus:border-indigo-500 bg-slate-50 text-slate-600"
                          disabled={!!editingEmployee}
                          required
                        />
                      </label>
                      <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                        Full Name *
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500"
                          required
                        />
                      </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                        Official Email *
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="rahul@company.in"
                          className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500"
                          required
                        />
                      </label>
                      <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                        Mobile Phone *
                        <input
                          type="tel"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          placeholder="98765 43210"
                          className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500"
                          required
                        />
                      </label>
                    </div>

                    <div className="border-t border-slate-100 pt-4 grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                        Department
                        <select
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="h-10 rounded border border-slate-200 px-3 outline-none focus:border-indigo-500 bg-white font-normal"
                        >
                          {departments.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                        Designation *
                        <input
                          type="text"
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          placeholder="e.g. Software Engineer"
                          className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500"
                          required
                        />
                      </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                        State (For PT Slab)
                        <select
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="h-10 rounded border border-slate-200 px-3 outline-none focus:border-indigo-500 bg-white font-normal"
                        >
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Telangana">Telangana</option>
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                          <option value="Gujarat">Gujarat</option>
                          <option value="West Bengal">West Bengal</option>
                        </select>
                      </label>
                      <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                        Date of Joining
                        <input
                          type="date"
                          value={dateOfJoining}
                          onChange={(e) => setDateOfJoining(e.target.value)}
                          className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500"
                        />
                      </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                        Employment Type
                        <select
                          value={employmentType}
                          onChange={(e) => setEmploymentType(e.target.value)}
                          className="h-10 rounded border border-slate-200 px-3 outline-none focus:border-indigo-500 bg-white font-normal"
                        >
                          <option value="FULL_TIME">Full Time (Regular)</option>
                          <option value="PART_TIME">Part Time</option>
                          <option value="CONTRACT">Contract Basis</option>
                          <option value="INTERN">Internship</option>
                        </select>
                      </label>
                      <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                        Probation Period (Days)
                        <input
                          type="number"
                          value={probationDays}
                          onChange={(e) => setProbationDays(Number(e.target.value))}
                          className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-550"
                        />
                      </label>
                    </div>

                    {(employmentType === "FULL_TIME" || employmentType === "PART_TIME" || employmentType === "INTERN") && (
                      <div className="grid gap-4 sm:grid-cols-2 border border-indigo-100 bg-indigo-50/30 p-4 rounded-md mt-4 animate-fade-in">
                        <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                          Location (Office City) *
                          <select
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            className="h-10 rounded border border-slate-200 px-3 bg-white outline-none focus:border-indigo-500 text-xs font-normal"
                            required
                          >
                            <option value="">Select Office City...</option>
                            {officeLocationsList.map((loc: any) => (
                              <option key={loc.id} value={loc.city || loc.name}>
                                {loc.city || loc.name} ({loc.officeType || "Office"})
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                          Work Location
                          <input
                            type="text"
                            value={workLocation}
                            onChange={(e) => setWorkLocation(e.target.value)}
                            placeholder="e.g. Corporate Campus, Ground Floor"
                            className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-white"
                          />
                        </label>
                      </div>
                    )}

                    {employmentType === "CONTRACT" && (
                      <div className="grid gap-4 sm:grid-cols-2 border border-indigo-100 bg-indigo-50/30 p-4 rounded-md mt-4 animate-fade-in">
                        <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                          Client Name
                          <input
                            type="text"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            placeholder="e.g. Google India Pvt Ltd"
                            className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-555 bg-white"
                          />
                        </label>
                        <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                          Work Location (Client Site)
                          <input
                            type="text"
                            value={workLocation}
                            onChange={(e) => setWorkLocation(e.target.value)}
                            placeholder="e.g. Signature Towers, Gurugram"
                            className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-white"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: KYC & Base Salary Structure */}
                {drawerTab === "statutory" && (
                  <div className="space-y-6">
                    {/* Compliance Numbers */}
                    <div>
                      <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-3">Compliance Registration Codes</h4>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                          Permanent Account Number (PAN)
                          <input
                            type="text"
                            value={pan}
                            onChange={(e) => setPan(e.target.value)}
                            placeholder="e.g. ABCDE1234F"
                            maxLength={10}
                            className="h-10 rounded border border-slate-200 px-3 font-mono outline-none focus:border-indigo-500 uppercase"
                          />
                        </label>
                        <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                          Aadhaar Number (UIDAI)
                          <input
                            type="text"
                            value={aadhaar}
                            onChange={(e) => setAadhaar(e.target.value)}
                            placeholder="12-digit Aadhaar Number"
                            maxLength={12}
                            className="h-10 rounded border border-slate-200 px-3 font-mono outline-none focus:border-indigo-500"
                          />
                        </label>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 mt-4">
                        <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                          Provident Fund UAN
                          <input
                            type="text"
                            value={uan}
                            onChange={(e) => setUan(e.target.value)}
                            placeholder="12-digit UAN"
                            maxLength={12}
                            className="h-10 rounded border border-slate-200 px-3 font-mono outline-none focus:border-indigo-500"
                          />
                        </label>
                        <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                          ESIC Insurance Number
                          <input
                            type="text"
                            value={esicNumber}
                            onChange={(e) => setEsicNumber(e.target.value)}
                            placeholder="17-digit IP code"
                            maxLength={17}
                            className="h-10 rounded border border-slate-200 px-3 font-mono outline-none focus:border-indigo-500"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Salary Parameters */}
                    <div className="border-t border-slate-100 pt-6">
                      <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-3">Base Compensation Structure (Monthly)</h4>
                      <p className="text-[10px] text-slate-400 mb-4 font-semibold italic">These form the baseline earnings for calculating statutory EPF/ESIC/PT compliance deductions.</p>
                      
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                          Basic Salary (INR) *
                          <input
                            type="number"
                            value={basic}
                            onChange={(e) => setBasic(Number(e.target.value))}
                            className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500"
                            required
                          />
                        </label>
                        <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                          House Rent Allowance (HRA) (INR)
                          <input
                            type="number"
                            value={hra}
                            onChange={(e) => setHra(Number(e.target.value))}
                            className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500"
                          />
                        </label>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 mt-4">
                        <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                          Special Allowance (INR)
                          <input
                            type="number"
                            value={specialAllowance}
                            onChange={(e) => setSpecialAllowance(Number(e.target.value))}
                            className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500"
                          />
                        </label>
                        <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                          Conveyance Allowance (INR)
                          <input
                            type="number"
                            value={conveyance}
                            onChange={(e) => setConveyance(Number(e.target.value))}
                            className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500"
                          />
                        </label>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 mt-4">
                        <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                          Medical Allowance (INR)
                          <input
                            type="number"
                            value={medicalAllowance}
                            onChange={(e) => setMedicalAllowance(Number(e.target.value))}
                            className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500"
                          />
                        </label>
                        <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                          Leave Travel Allowance (LTA) (INR)
                          <input
                            type="number"
                            value={lta}
                            onChange={(e) => setLta(Number(e.target.value))}
                            className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank Details Tab */}
                {drawerTab === "bank" && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Bank Account Details</h4>
                    <p className="text-[11px] text-slate-500 -mt-2">Capture bank details for direct payroll salary disbursement.</p>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                        Bank Name
                        <select
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="h-10 rounded border border-slate-200 px-3 outline-none focus:border-indigo-500 bg-white font-normal"
                        >
                          <option value="">Select Bank</option>
                          <option value="HDFC Bank">HDFC Bank</option>
                          <option value="ICICI Bank">ICICI Bank</option>
                          <option value="State Bank of India">State Bank of India</option>
                          <option value="Axis Bank">Axis Bank</option>
                          <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                          <option value="Yes Bank">Yes Bank</option>
                          <option value="Federal Bank">Federal Bank</option>
                        </select>
                      </label>
                      <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                        Account Type
                        <select
                          value={accountType}
                          onChange={(e) => setAccountType(e.target.value)}
                          className="h-10 rounded border border-slate-200 px-3 outline-none focus:border-indigo-500 bg-white font-normal"
                        >
                          <option value="SAVINGS">Savings Account</option>
                          <option value="CURRENT">Current Account</option>
                          <option value="SALARY">Salary Account</option>
                        </select>
                      </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                        Account Number
                        <input
                          type="text"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          placeholder="e.g. 50100087654321"
                          className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 text-slate-800"
                        />
                      </label>
                      <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                        IFSC Code
                        <input
                          type="text"
                          value={ifscCode}
                          onChange={(e) => setIfscCode(e.target.value)}
                          placeholder="e.g. HDFC0000104"
                          maxLength={11}
                          className="h-10 rounded border border-slate-200 px-3 font-mono outline-none focus:border-indigo-500 uppercase text-slate-800"
                        />
                      </label>
                    </div>

                    <div className="grid gap-4">
                      <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                        Branch Name
                        <input
                          type="text"
                          value={branchName}
                          onChange={(e) => setBranchName(e.target.value)}
                          placeholder="e.g. Nariman Point, Mumbai"
                          className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 text-slate-800"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* Educational Documents Tab */}
                {drawerTab === "education" && (
                  <div className="space-y-6">
                    <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Educational Certificates</h4>
                    <p className="text-[11px] text-slate-500 -mt-2">Simulate uploads for Marks Sheets and Convocation Certificates/Degrees.</p>
                    
                    <div className="space-y-4">
                      {/* Tenth 10th */}
                      <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50">
                        <h5 className="text-xs font-bold text-slate-700 mb-3 border-b border-slate-200 pb-1.5 uppercase font-black">X (Tenth / Secondary School Certificate)</h5>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                            <span className="text-xs font-semibold text-slate-600">Marks Sheet</span>
                            <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">{tenthMarksSheet || "No file"}</span>
                            <label className="rounded border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-600 transition px-2 py-1 text-[10px] font-bold flex items-center gap-1 cursor-pointer">
                              <Upload className="size-3" />
                              Upload
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setTenthMarksSheet(e.target.files?.[0]?.name || "10th_marksheet.pdf")}
                              />
                            </label>
                          </div>
                          <div className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                            <span className="text-xs font-semibold text-slate-600">Convocation Certificate</span>
                            <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">{tenthCertificate || "No file"}</span>
                            <label className="rounded border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-600 transition px-2 py-1 text-[10px] font-bold flex items-center gap-1 cursor-pointer">
                              <Upload className="size-3" />
                              Upload
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setTenthCertificate(e.target.files?.[0]?.name || "10th_certificate.pdf")}
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Twelfth 12th */}
                      <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50">
                        <h5 className="text-xs font-bold text-slate-700 mb-3 border-b border-slate-200 pb-1.5 uppercase font-black">XII or Intermediate (Higher Secondary School Certificate)</h5>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                            <span className="text-xs font-semibold text-slate-600">Marks Sheet</span>
                            <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">{twelfthMarksSheet || "No file"}</span>
                            <label className="rounded border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-600 transition px-2 py-1 text-[10px] font-bold flex items-center gap-1 cursor-pointer">
                              <Upload className="size-3" />
                              Upload
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setTwelfthMarksSheet(e.target.files?.[0]?.name || "12th_marksheet.pdf")}
                              />
                            </label>
                          </div>
                          <div className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                            <span className="text-xs font-semibold text-slate-600">Convocation Certificate</span>
                            <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">{twelfthCertificate || "No file"}</span>
                            <label className="rounded border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-600 transition px-2 py-1 text-[10px] font-bold flex items-center gap-1 cursor-pointer">
                              <Upload className="size-3" />
                              Upload
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setTwelfthCertificate(e.target.files?.[0]?.name || "12th_certificate.pdf")}
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Graduation */}
                      <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50">
                        <h5 className="text-xs font-bold text-slate-700 mb-3 border-b border-slate-200 pb-1.5 uppercase font-black">Graduation / Bachelor's Degree</h5>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                            <span className="text-xs font-semibold text-slate-600">Marks Sheet</span>
                            <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">{graduationMarksSheet || "No file"}</span>
                            <label className="rounded border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-600 transition px-2 py-1 text-[10px] font-bold flex items-center gap-1 cursor-pointer">
                              <Upload className="size-3" />
                              Upload
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setGraduationMarksSheet(e.target.files?.[0]?.name || "grad_marksheet.pdf")}
                              />
                            </label>
                          </div>
                          <div className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                            <span className="text-xs font-semibold text-slate-600">Convocation Certificate</span>
                            <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">{graduationCertificate || "No file"}</span>
                            <label className="rounded border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-600 transition px-2 py-1 text-[10px] font-bold flex items-center gap-1 cursor-pointer">
                              <Upload className="size-3" />
                              Upload
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setGraduationCertificate(e.target.files?.[0]?.name || "grad_certificate.pdf")}
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Post Graduation */}
                      <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50">
                        <h5 className="text-xs font-bold text-slate-700 mb-3 border-b border-slate-200 pb-1.5 uppercase font-black">Post Graduation / Master's Degree</h5>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                            <span className="text-xs font-semibold text-slate-600">Marks Sheet</span>
                            <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">{pgMarksSheet || "No file"}</span>
                            <label className="rounded border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-600 transition px-2 py-1 text-[10px] font-bold flex items-center gap-1 cursor-pointer">
                              <Upload className="size-3" />
                              Upload
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setPgMarksSheet(e.target.files?.[0]?.name || "pg_marksheet.pdf")}
                              />
                            </label>
                          </div>
                          <div className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                            <span className="text-xs font-semibold text-slate-600">Convocation Certificate</span>
                            <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">{pgCertificate || "No file"}</span>
                            <label className="rounded border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-600 transition px-2 py-1 text-[10px] font-bold flex items-center gap-1 cursor-pointer">
                              <Upload className="size-3" />
                              Upload
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setPgCertificate(e.target.files?.[0]?.name || "pg_certificate.pdf")}
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Doctoral Degree */}
                      <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50">
                        <h5 className="text-xs font-bold text-slate-700 mb-3 border-b border-slate-200 pb-1.5 uppercase font-black">Doctoral Degree (Ph.D. / Equivalent)</h5>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                            <span className="text-xs font-semibold text-slate-600">Marks Sheet</span>
                            <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">{doctoralMarksSheet || "No file"}</span>
                            <label className="rounded border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-600 transition px-2 py-1 text-[10px] font-bold flex items-center gap-1 cursor-pointer">
                              <Upload className="size-3" />
                              Upload
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setDoctoralMarksSheet(e.target.files?.[0]?.name || "doctoral_marksheet.pdf")}
                              />
                            </label>
                          </div>
                          <div className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                            <span className="text-xs font-semibold text-slate-600">Convocation Certificate</span>
                            <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">{doctoralCertificate || "No file"}</span>
                            <label className="rounded border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-600 transition px-2 py-1 text-[10px] font-bold flex items-center gap-1 cursor-pointer">
                              <Upload className="size-3" />
                              Upload
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setDoctoralCertificate(e.target.files?.[0]?.name || "doctoral_certificate.pdf")}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Experience Documents Tab */}
                {drawerTab === "experience" && (
                  <div className="space-y-6">
                    <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                      Work Experience Portfolio - {calculateTotalExperience([
                         { fromDate: exp1FromDate, toDate: exp1ToDate },
                         { fromDate: exp2FromDate, toDate: exp2ToDate },
                         { fromDate: exp3FromDate, toDate: exp3ToDate }
                       ])}
                    </h4>
                    <p className="text-[11px] text-slate-500 -mt-2">Provide verification documents for your last three companies. Include Offer, Hike, Relieving letters and last 3 months payslips.</p>
                    
                    <div className="space-y-6">
                      {/* COMPANY 1 */}
                      <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50">
                        <h5 className="text-xs font-bold text-indigo-700 mb-3 border-b border-slate-200 pb-1.5 uppercase flex justify-between items-center font-black">
                          <span>Company 1 (Most Recent)</span>
                          {exp1Company && (() => {
                            const val = getPayslipValidation(exp1Company, exp1ToDate, exp1Pay1File, exp1Pay1Month, exp1Pay1Year, exp1Pay2File, exp1Pay2Month, exp1Pay2Year, exp1Pay3File, exp1Pay3Month, exp1Pay3Year);
                            if (val.status === "valid") {
                              return <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-black">Payslips Verified</span>;
                            } else if (val.status === "invalid") {
                              return <span className="bg-rose-100 text-rose-800 text-[10px] px-2 py-0.5 rounded font-black">Verification Failed</span>;
                            } else {
                              return <span className="bg-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded font-black">Pending Payslips</span>;
                            }
                          })()}
                        </h5>
                        
                        <div className="grid gap-4 sm:grid-cols-2 mb-4">
                           <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase col-span-2">
                             Company Name
                             <input
                               type="text"
                               value={exp1Company}
                               onChange={(e) => setExp1Company(e.target.value)}
                               placeholder="e.g. Infosys Technologies Ltd"
                               className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-white text-slate-800"
                             />
                           </label>
                           <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                             From Date
                             <input
                               type="date"
                               value={exp1FromDate}
                               onChange={(e) => setExp1FromDate(e.target.value)}
                               className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-white text-slate-800"
                             />
                           </label>
                           <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                             To Date
                             <input
                               type="date"
                               value={exp1ToDate}
                               onChange={(e) => setExp1ToDate(e.target.value)}
                               className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-white text-slate-800"
                             />
                           </label>
                         </div>
                         {exp1FromDate && exp1ToDate && (
                           <div className="mb-4 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-md flex items-center gap-1.5 w-fit">
                             <Clock className="size-3.5" /> Work Duration: {getSingleDurationText(exp1FromDate, exp1ToDate)}
                           </div>
                         )}

                        <div className="space-y-4">
                            {/* Letters */}
                            <div className="grid gap-3 sm:grid-cols-3">
                              <div className="bg-white p-2.5 rounded border border-slate-200 flex flex-col justify-between gap-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Offer Letter</span>
                                <span className="text-[10px] text-slate-400 truncate">{exp1Offer || "No file"}</span>
                                <label className="rounded border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-600 transition py-1 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer">
                                  <Upload className="size-3" />
                                  Upload
                                  <input type="file" className="hidden" onChange={(e) => setExp1Offer(e.target.files?.[0]?.name || "offer_letter.pdf")} />
                                </label>
                              </div>

                              <div className="bg-white p-2.5 rounded border border-slate-200 flex flex-col justify-between gap-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase font-black">Hike Letter</span>
                                <span className="text-[10px] text-slate-400 truncate">{exp1Hike || "No file"}</span>
                                <label className="rounded border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-600 transition py-1 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer">
                                  <Upload className="size-3" />
                                  Upload
                                  <input type="file" className="hidden" onChange={(e) => setExp1Hike(e.target.files?.[0]?.name || "hike_letter.pdf")} />
                                </label>
                              </div>

                              <div className="bg-white p-2.5 rounded border border-slate-200 flex flex-col justify-between gap-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Relieving Letter</span>
                                <span className="text-[10px] text-slate-400 truncate">{exp1Relieving || "No file"}</span>
                                <label className="rounded border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-600 transition py-1 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer">
                                  <Upload className="size-3" />
                                  Upload
                                  <input type="file" className="hidden" onChange={(e) => setExp1Relieving(e.target.files?.[0]?.name || "relieving_letter.pdf")} />
                                </label>
                              </div>
                            </div>

                            {/* Payslips */}
                            <div className="mt-4 border-t border-slate-200 pt-3">
                              <span className="text-[11px] font-black text-slate-600 uppercase block mb-2">3 Months Payslips (Select Month, Year, and Upload)</span>
                              <div className="grid gap-3 md:grid-cols-3">
                                {/* Payslip 1 */}
                                <div className="bg-white p-2.5 rounded border border-slate-200 space-y-2">
                                  <span className="text-[10px] font-bold text-slate-400">Payslip 1</span>
                                  <div className="grid grid-cols-2 gap-1.5">
                                    <select value={exp1Pay1Month} onChange={(e) => setExp1Pay1Month(e.target.value)} className="text-[10px] border border-slate-200 rounded p-1 bg-white">
                                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <select value={exp1Pay1Year} onChange={(e) => setExp1Pay1Year(e.target.value)} className="text-[10px] border border-slate-200 rounded p-1 bg-white">
                                      {["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017"].map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                  </div>
                                  <span className="text-[9px] text-slate-400 block truncate">{exp1Pay1File || "No file"}</span>
                                  <label className="rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition py-1 text-[9px] font-bold flex items-center justify-center gap-1 cursor-pointer">
                                    <Upload className="size-2.5" /> File
                                    <input type="file" className="hidden" onChange={(e) => setExp1Pay1File(e.target.files?.[0]?.name || "payslip1.pdf")} />
                                  </label>
                                </div>

                                {/* Payslip 2 */}
                                <div className="bg-white p-2.5 rounded border border-slate-200 space-y-2">
                                  <span className="text-[10px] font-bold text-slate-400">Payslip 2</span>
                                  <div className="grid grid-cols-2 gap-1.5">
                                    <select value={exp1Pay2Month} onChange={(e) => setExp1Pay2Month(e.target.value)} className="text-[10px] border border-slate-200 rounded p-1 bg-white">
                                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <select value={exp1Pay2Year} onChange={(e) => setExp1Pay2Year(e.target.value)} className="text-[10px] border border-slate-200 rounded p-1 bg-white">
                                      {["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017"].map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                  </div>
                                  <span className="text-[9px] text-slate-400 block truncate">{exp1Pay2File || "No file"}</span>
                                  <label className="rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition py-1 text-[9px] font-bold flex items-center justify-center gap-1 cursor-pointer">
                                    <Upload className="size-2.5" /> File
                                    <input type="file" className="hidden" onChange={(e) => setExp1Pay2File(e.target.files?.[0]?.name || "payslip2.pdf")} />
                                  </label>
                                </div>

                                {/* Payslip 3 */}
                                <div className="bg-white p-2.5 rounded border border-slate-200 space-y-2">
                                  <span className="text-[10px] font-bold text-slate-400">Payslip 3</span>
                                  <div className="grid grid-cols-2 gap-1.5">
                                    <select value={exp1Pay3Month} onChange={(e) => setExp1Pay3Month(e.target.value)} className="text-[10px] border border-slate-200 rounded p-1 bg-white">
                                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <select value={exp1Pay3Year} onChange={(e) => setExp1Pay3Year(e.target.value)} className="text-[10px] border border-slate-200 rounded p-1 bg-white">
                                      {["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017"].map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                  </div>
                                  <span className="text-[9px] text-slate-400 block truncate">{exp1Pay3File || "No file"}</span>
                                  <label className="rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition py-1 text-[9px] font-bold flex items-center justify-center gap-1 cursor-pointer">
                                    <Upload className="size-2.5" /> File
                                    <input type="file" className="hidden" onChange={(e) => setExp1Pay3File(e.target.files?.[0]?.name || "payslip3.pdf")} />
                                  </label>
                                </div>
                              </div>

                              {/* Reactive validation */}
                              {(() => {
                                const val = getPayslipValidation(exp1Company, exp1ToDate, exp1Pay1File, exp1Pay1Month, exp1Pay1Year, exp1Pay2File, exp1Pay2Month, exp1Pay2Year, exp1Pay3File, exp1Pay3Month, exp1Pay3Year);
                                if (val.status === "valid") {
                                  return <p className="text-[10px] font-bold text-emerald-600 mt-2">✓ {val.message}</p>;
                                } else if (val.status === "invalid") {
                                  return <p className="text-[10px] font-bold text-rose-600 mt-2">✗ {val.message}</p>;
                                } else {
                                  return <p className="text-[10px] font-bold text-slate-500 mt-2 italic">{val.message}</p>;
                                }
                              })()}
                            </div>
                          </div>
                      </div>

                      {/* COMPANY 2 */}
                      <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50">
                        <h5 className="text-xs font-bold text-indigo-700 mb-3 border-b border-slate-200 pb-1.5 uppercase flex justify-between items-center font-black">
                          <span>Company 2</span>
                          {exp2Company && (() => {
                            const val = getPayslipValidation(exp2Company, exp2ToDate, exp2Pay1File, exp2Pay1Month, exp2Pay1Year, exp2Pay2File, exp2Pay2Month, exp2Pay2Year, exp2Pay3File, exp2Pay3Month, exp2Pay3Year);
                            if (val.status === "valid") {
                              return <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-black">Payslips Verified</span>;
                            } else if (val.status === "invalid") {
                              return <span className="bg-rose-100 text-rose-800 text-[10px] px-2 py-0.5 rounded font-black">Verification Failed</span>;
                            } else {
                              return <span className="bg-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded font-black">Pending Payslips</span>;
                            }
                          })()}
                        </h5>
                        
                        <div className="grid gap-4 sm:grid-cols-2 mb-4">
                          <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase col-span-2">
                            Company Name
                            <input
                              type="text"
                              value={exp2Company}
                              onChange={(e) => setExp2Company(e.target.value)}
                              placeholder="e.g. Tata Consultancy Services Ltd"
                              className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-white text-slate-800"
                            />
                          </label>
                          <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                            From Date
                            <input
                              type="date"
                              value={exp2FromDate}
                              onChange={(e) => setExp2FromDate(e.target.value)}
                              className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-white text-slate-800"
                            />
                          </label>
                          <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                            To Date
                            <input
                              type="date"
                              value={exp2ToDate}
                              onChange={(e) => setExp2ToDate(e.target.value)}
                              className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-white text-slate-800"
                            />
                          </label>
                        </div>
                        {exp2FromDate && exp2ToDate && (
                          <div className="mb-4 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-md flex items-center gap-1.5 w-fit">
                            <Clock className="size-3.5" /> Work Duration: {getSingleDurationText(exp2FromDate, exp2ToDate)}
                          </div>
                        )}

                        <div className="space-y-4">
                            {/* Letters */}
                            <div className="grid gap-3 sm:grid-cols-3">
                              <div className="bg-white p-2.5 rounded border border-slate-200 flex flex-col justify-between gap-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Offer Letter</span>
                                <span className="text-[10px] text-slate-400 truncate">{exp2Offer || "No file"}</span>
                                <label className="rounded border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-600 transition py-1 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer">
                                  <Upload className="size-3" />
                                  Upload
                                  <input type="file" className="hidden" onChange={(e) => setExp2Offer(e.target.files?.[0]?.name || "offer_letter.pdf")} />
                                </label>
                              </div>

                              <div className="bg-white p-2.5 rounded border border-slate-200 flex flex-col justify-between gap-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase font-black">Hike Letter</span>
                                <span className="text-[10px] text-slate-400 truncate">{exp2Hike || "No file"}</span>
                                <label className="rounded border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-600 transition py-1 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer">
                                  <Upload className="size-3" />
                                  Upload
                                  <input type="file" className="hidden" onChange={(e) => setExp2Hike(e.target.files?.[0]?.name || "hike_letter.pdf")} />
                                </label>
                              </div>

                              <div className="bg-white p-2.5 rounded border border-slate-200 flex flex-col justify-between gap-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Relieving Letter</span>
                                <span className="text-[10px] text-slate-400 truncate">{exp2Relieving || "No file"}</span>
                                <label className="rounded border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-600 transition py-1 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer">
                                  <Upload className="size-3" />
                                  Upload
                                  <input type="file" className="hidden" onChange={(e) => setExp2Relieving(e.target.files?.[0]?.name || "relieving_letter.pdf")} />
                                </label>
                              </div>
                            </div>

                            {/* Payslips */}
                            <div className="mt-4 border-t border-slate-200 pt-3">
                              <span className="text-[11px] font-black text-slate-600 uppercase block mb-2">3 Months Payslips (Select Month, Year, and Upload)</span>
                              <div className="grid gap-3 md:grid-cols-3">
                                {/* Payslip 1 */}
                                <div className="bg-white p-2.5 rounded border border-slate-200 space-y-2">
                                  <span className="text-[10px] font-bold text-slate-400">Payslip 1</span>
                                  <div className="grid grid-cols-2 gap-1.5">
                                    <select value={exp2Pay1Month} onChange={(e) => setExp2Pay1Month(e.target.value)} className="text-[10px] border border-slate-200 rounded p-1 bg-white">
                                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <select value={exp2Pay1Year} onChange={(e) => setExp2Pay1Year(e.target.value)} className="text-[10px] border border-slate-200 rounded p-1 bg-white">
                                      {["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017"].map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                  </div>
                                  <span className="text-[9px] text-slate-400 block truncate">{exp2Pay1File || "No file"}</span>
                                  <label className="rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition py-1 text-[9px] font-bold flex items-center justify-center gap-1 cursor-pointer">
                                    <Upload className="size-2.5" /> File
                                    <input type="file" className="hidden" onChange={(e) => setExp2Pay1File(e.target.files?.[0]?.name || "payslip1.pdf")} />
                                  </label>
                                </div>

                                {/* Payslip 2 */}
                                <div className="bg-white p-2.5 rounded border border-slate-200 space-y-2">
                                  <span className="text-[10px] font-bold text-slate-400">Payslip 2</span>
                                  <div className="grid grid-cols-2 gap-1.5">
                                    <select value={exp2Pay2Month} onChange={(e) => setExp2Pay2Month(e.target.value)} className="text-[10px] border border-slate-200 rounded p-1 bg-white">
                                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <select value={exp2Pay2Year} onChange={(e) => setExp2Pay2Year(e.target.value)} className="text-[10px] border border-slate-200 rounded p-1 bg-white">
                                      {["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017"].map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                  </div>
                                  <span className="text-[9px] text-slate-400 block truncate">{exp2Pay2File || "No file"}</span>
                                  <label className="rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition py-1 text-[9px] font-bold flex items-center justify-center gap-1 cursor-pointer">
                                    <Upload className="size-2.5" /> File
                                    <input type="file" className="hidden" onChange={(e) => setExp2Pay2File(e.target.files?.[0]?.name || "payslip2.pdf")} />
                                  </label>
                                </div>

                                {/* Payslip 3 */}
                                <div className="bg-white p-2.5 rounded border border-slate-200 space-y-2">
                                  <span className="text-[10px] font-bold text-slate-400">Payslip 3</span>
                                  <div className="grid grid-cols-2 gap-1.5">
                                    <select value={exp2Pay3Month} onChange={(e) => setExp2Pay3Month(e.target.value)} className="text-[10px] border border-slate-200 rounded p-1 bg-white">
                                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <select value={exp2Pay3Year} onChange={(e) => setExp2Pay3Year(e.target.value)} className="text-[10px] border border-slate-200 rounded p-1 bg-white">
                                      {["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017"].map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                  </div>
                                  <span className="text-[9px] text-slate-400 block truncate">{exp2Pay3File || "No file"}</span>
                                  <label className="rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition py-1 text-[9px] font-bold flex items-center justify-center gap-1 cursor-pointer">
                                    <Upload className="size-2.5" /> File
                                    <input type="file" className="hidden" onChange={(e) => setExp2Pay3File(e.target.files?.[0]?.name || "payslip3.pdf")} />
                                  </label>
                                </div>
                              </div>

                              {/* Reactive validation */}
                              {(() => {
                                const val = getPayslipValidation(exp2Company, exp2ToDate, exp2Pay1File, exp2Pay1Month, exp2Pay1Year, exp2Pay2File, exp2Pay2Month, exp2Pay2Year, exp2Pay3File, exp2Pay3Month, exp2Pay3Year);
                                if (val.status === "valid") {
                                  return <p className="text-[10px] font-bold text-emerald-600 mt-2">✓ {val.message}</p>;
                                } else if (val.status === "invalid") {
                                  return <p className="text-[10px] font-bold text-rose-600 mt-2">✗ {val.message}</p>;
                                } else {
                                  return <p className="text-[10px] font-bold text-slate-500 mt-2 italic">{val.message}</p>;
                                }
                              })()}
                            </div>
                          </div>
                      </div>

                      {/* COMPANY 3 */}
                      <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50">
                        <h5 className="text-xs font-bold text-indigo-700 mb-3 border-b border-slate-200 pb-1.5 uppercase flex justify-between items-center font-black">
                          <span>Company 3</span>
                          {exp3Company && (() => {
                            const val = getPayslipValidation(exp3Company, exp3ToDate, exp3Pay1File, exp3Pay1Month, exp3Pay1Year, exp3Pay2File, exp3Pay2Month, exp3Pay2Year, exp3Pay3File, exp3Pay3Month, exp3Pay3Year);
                            if (val.status === "valid") {
                              return <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-black">Payslips Verified</span>;
                            } else if (val.status === "invalid") {
                              return <span className="bg-rose-100 text-rose-800 text-[10px] px-2 py-0.5 rounded font-black">Verification Failed</span>;
                            } else {
                              return <span className="bg-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded font-black">Pending Payslips</span>;
                            }
                          })()}
                        </h5>
                        
                        <div className="grid gap-4 sm:grid-cols-2 mb-4">
                          <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase col-span-2">
                            Company Name
                            <input
                              type="text"
                              value={exp3Company}
                              onChange={(e) => setExp3Company(e.target.value)}
                              placeholder="e.g. Wipro Technologies Ltd"
                              className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-white text-slate-800"
                            />
                          </label>
                          <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                            From Date
                            <input
                              type="date"
                              value={exp3FromDate}
                              onChange={(e) => setExp3FromDate(e.target.value)}
                              className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-white text-slate-800"
                            />
                          </label>
                          <label className="grid gap-1 font-bold text-xs text-slate-500 uppercase">
                            To Date
                            <input
                              type="date"
                              value={exp3ToDate}
                              onChange={(e) => setExp3ToDate(e.target.value)}
                              className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-white text-slate-800"
                            />
                          </label>
                        </div>
                        {exp3FromDate && exp3ToDate && (
                          <div className="mb-4 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-md flex items-center gap-1.5 w-fit">
                            <Clock className="size-3.5" /> Work Duration: {getSingleDurationText(exp3FromDate, exp3ToDate)}
                          </div>
                        )}

                        <div className="space-y-4">
                            {/* Letters */}
                            <div className="grid gap-3 sm:grid-cols-3">
                              <div className="bg-white p-2.5 rounded border border-slate-200 flex flex-col justify-between gap-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Offer Letter</span>
                                <span className="text-[10px] text-slate-400 truncate">{exp3Offer || "No file"}</span>
                                <label className="rounded border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-600 transition py-1 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer">
                                  <Upload className="size-3" />
                                  Upload
                                  <input type="file" className="hidden" onChange={(e) => setExp3Offer(e.target.files?.[0]?.name || "offer_letter.pdf")} />
                                </label>
                              </div>

                              <div className="bg-white p-2.5 rounded border border-slate-200 flex flex-col justify-between gap-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase font-black">Hike Letter</span>
                                <span className="text-[10px] text-slate-400 truncate">{exp3Hike || "No file"}</span>
                                <label className="rounded border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-600 transition py-1 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer">
                                  <Upload className="size-3" />
                                  Upload
                                  <input type="file" className="hidden" onChange={(e) => setExp3Hike(e.target.files?.[0]?.name || "hike_letter.pdf")} />
                                </label>
                              </div>

                              <div className="bg-white p-2.5 rounded border border-slate-200 flex flex-col justify-between gap-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Relieving Letter</span>
                                <span className="text-[10px] text-slate-400 truncate">{exp3Relieving || "No file"}</span>
                                <label className="rounded border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-600 transition py-1 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer">
                                  <Upload className="size-3" />
                                  Upload
                                  <input type="file" className="hidden" onChange={(e) => setExp3Relieving(e.target.files?.[0]?.name || "relieving_letter.pdf")} />
                                </label>
                              </div>
                            </div>

                            {/* Payslips */}
                            <div className="mt-4 border-t border-slate-200 pt-3">
                              <span className="text-[11px] font-black text-slate-600 uppercase block mb-2">3 Months Payslips (Select Month, Year, and Upload)</span>
                              <div className="grid gap-3 md:grid-cols-3">
                                {/* Payslip 1 */}
                                <div className="bg-white p-2.5 rounded border border-slate-200 space-y-2">
                                  <span className="text-[10px] font-bold text-slate-400">Payslip 1</span>
                                  <div className="grid grid-cols-2 gap-1.5">
                                    <select value={exp3Pay1Month} onChange={(e) => setExp3Pay1Month(e.target.value)} className="text-[10px] border border-slate-200 rounded p-1 bg-white">
                                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <select value={exp3Pay1Year} onChange={(e) => setExp3Pay1Year(e.target.value)} className="text-[10px] border border-slate-200 rounded p-1 bg-white">
                                      {["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017"].map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                  </div>
                                  <span className="text-[9px] text-slate-400 block truncate">{exp3Pay1File || "No file"}</span>
                                  <label className="rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition py-1 text-[9px] font-bold flex items-center justify-center gap-1 cursor-pointer">
                                    <Upload className="size-2.5" /> File
                                    <input type="file" className="hidden" onChange={(e) => setExp3Pay1File(e.target.files?.[0]?.name || "payslip1.pdf")} />
                                  </label>
                                </div>

                                {/* Payslip 2 */}
                                <div className="bg-white p-2.5 rounded border border-slate-200 space-y-2">
                                  <span className="text-[10px] font-bold text-slate-400">Payslip 2</span>
                                  <div className="grid grid-cols-2 gap-1.5">
                                    <select value={exp3Pay2Month} onChange={(e) => setExp3Pay2Month(e.target.value)} className="text-[10px] border border-slate-200 rounded p-1 bg-white">
                                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <select value={exp3Pay2Year} onChange={(e) => setExp3Pay2Year(e.target.value)} className="text-[10px] border border-slate-200 rounded p-1 bg-white">
                                      {["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017"].map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                  </div>
                                  <span className="text-[9px] text-slate-400 block truncate">{exp3Pay2File || "No file"}</span>
                                  <label className="rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition py-1 text-[9px] font-bold flex items-center justify-center gap-1 cursor-pointer">
                                    <Upload className="size-2.5" /> File
                                    <input type="file" className="hidden" onChange={(e) => setExp3Pay2File(e.target.files?.[0]?.name || "payslip2.pdf")} />
                                  </label>
                                </div>

                                {/* Payslip 3 */}
                                <div className="bg-white p-2.5 rounded border border-slate-200 space-y-2">
                                  <span className="text-[10px] font-bold text-slate-400">Payslip 3</span>
                                  <div className="grid grid-cols-2 gap-1.5">
                                    <select value={exp3Pay3Month} onChange={(e) => setExp3Pay3Month(e.target.value)} className="text-[10px] border border-slate-200 rounded p-1 bg-white">
                                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <select value={exp3Pay3Year} onChange={(e) => setExp3Pay3Year(e.target.value)} className="text-[10px] border border-slate-200 rounded p-1 bg-white">
                                      {["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017"].map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                  </div>
                                  <span className="text-[9px] text-slate-400 block truncate">{exp3Pay3File || "No file"}</span>
                                  <label className="rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition py-1 text-[9px] font-bold flex items-center justify-center gap-1 cursor-pointer">
                                    <Upload className="size-2.5" /> File
                                    <input type="file" className="hidden" onChange={(e) => setExp3Pay3File(e.target.files?.[0]?.name || "payslip3.pdf")} />
                                  </label>
                                </div>
                              </div>

                              {/* Reactive validation */}
                              {(() => {
                                const val = getPayslipValidation(exp3Company, exp3ToDate, exp3Pay1File, exp3Pay1Month, exp3Pay1Year, exp3Pay2File, exp3Pay2Month, exp3Pay2Year, exp3Pay3File, exp3Pay3Month, exp3Pay3Year);
                                if (val.status === "valid") {
                                  return <p className="text-[10px] font-bold text-emerald-600 mt-2">✓ {val.message}</p>;
                                } else if (val.status === "invalid") {
                                  return <p className="text-[10px] font-bold text-rose-600 mt-2">✗ {val.message}</p>;
                                } else {
                                  return <p className="text-[10px] font-bold text-slate-500 mt-2 italic">{val.message}</p>;
                                }
                              })()}
                            </div>
                          </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 6: Documents Upload */}
                {drawerTab === "documents" && (
                  <div className="space-y-6">
                    <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">KYC Verification Files</h4>
                    <p className="text-[11px] text-slate-500 -mt-2">Simulate document uploads for background verification and audit compliance trails.</p>
                    
                    <div className="grid gap-4">
                      {/* Aadhaar File Card */}
                      <div className="border border-slate-200 rounded-md p-4 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded bg-indigo-50 text-indigo-600">
                            <FileText className="size-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">Aadhaar Card (PDF/Image)</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{aadhaarFile ? `File: ${aadhaarFile}` : "Not uploaded"}</p>
                          </div>
                        </div>
                        <label className="rounded border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-600 transition px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                          <Upload className="size-3.5" />
                          {aadhaarFile ? "Replace" : "Upload File"}
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => setAadhaarFile(e.target.files?.[0]?.name || "aadhaar_card.pdf")}
                          />
                        </label>
                      </div>

                      {/* PAN Card File Card */}
                      <div className="border border-slate-200 rounded-md p-4 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded bg-indigo-50 text-indigo-600">
                            <FileText className="size-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">PAN Card (PDF/Image)</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{panFile ? `File: ${panFile}` : "Not uploaded"}</p>
                          </div>
                        </div>
                        <label className="rounded border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-600 transition px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                          <Upload className="size-3.5" />
                          {panFile ? "Replace" : "Upload File"}
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => setPanFile(e.target.files?.[0]?.name || "pan_card.pdf")}
                          />
                        </label>
                      </div>

                      {/* Offer Letter File Card */}
                      <div className="border border-slate-200 rounded-md p-4 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded bg-indigo-50 text-indigo-600">
                            <FileText className="size-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">Signed Offer Letter</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{offerFile ? `File: ${offerFile}` : "Not uploaded"}</p>
                          </div>
                        </div>
                        <label className="rounded border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-600 transition px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                          <Upload className="size-3.5" />
                          {offerFile ? "Replace" : "Upload File"}
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => setOfferFile(e.target.files?.[0]?.name || "signed_offer_letter.pdf")}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </form>

              {/* Drawer Action Bar */}
              <div className="border-t border-slate-200 bg-slate-50 p-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-2">
                  {drawerTab !== "personal" && (
                    <button
                      type="button"
                      onClick={() => {
                        const tabsList: ("personal" | "statutory" | "bank" | "education" | "experience" | "documents")[] = ["personal", "statutory", "bank", "education", "experience", "documents"];
                        const idx = tabsList.indexOf(drawerTab);
                        if (idx > 0) setDrawerTab(tabsList[idx - 1]);
                      }}
                      className="rounded border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                    >
                      Previous
                    </button>
                  )}
                  {drawerTab !== "documents" ? (
                    <button
                      type="button"
                      onClick={() => {
                        const tabsList: ("personal" | "statutory" | "bank" | "education" | "experience" | "documents")[] = ["personal", "statutory", "bank", "education", "experience", "documents"];
                        const idx = tabsList.indexOf(drawerTab);
                        if (idx < tabsList.length - 1) setDrawerTab(tabsList[idx + 1]);
                      }}
                      className="rounded bg-indigo-600 hover:bg-indigo-700 transition px-4 py-2.5 text-xs font-bold text-white shadow"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleFormSubmit}
                      className="rounded bg-indigo-600 hover:bg-indigo-700 transition px-5 py-2.5 text-xs font-black text-white shadow flex items-center gap-1.5"
                    >
                      <ShieldCheck className="size-4" /> Save Employee Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
