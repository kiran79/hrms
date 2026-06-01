"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SaasSidebar } from "@/components/app/saas-sidebar";
import { Card, Badge } from "@/components/ui";
import { calculateIndianPayroll } from "@bharat-hrms/domain";
import {
  Search,
  Printer,
  FileText,
  Users,
  MapPin,
  CalendarCheck,
  CreditCard,
  Briefcase,
  Layers3,
  Landmark,
  Coins,
  ChevronDown,
  Info,
  Eye,
  Download,
  Share2,
  X
} from "lucide-react";
import {
  defaultEmployees,
  defaultAttendances,
  defaultLeaves,
  defaultLeaveTypes,
  defaultAssets,
  defaultOffboardings,
  defaultExpenses,
  defaultDeposits
} from "@/lib/data";

function ReportsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load view modes and session details
  const [viewMode, setViewMode] = useState<"self" | "manager">("manager");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [currentUserEmpId, setCurrentUserEmpId] = useState("");
  const [companyName, setCompanyName] = useState("Acme India Pvt Ltd");

  // Sync tab with query params (?tab=employees/attendance/leaves/assets/offboarding/payroll/finance)
  const initialTab = searchParams.get("tab") || "employees";
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Raw Database states
  const [employees, setEmployees] = useState<any[]>([]);
  const [attendances, setAttendances] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [offboardings, setOffboardings] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  // Month & Year selection period states (defaults: wide range to encompass all mock data)
  const [fromMonth, setFromMonth] = useState(0); // January
  const [fromYear, setFromYear] = useState(2020);
  const [toMonth, setToMonth] = useState(5); // Default to June 2026 initially (will update on mount)
  const [toYear, setToYear] = useState(2026);
  const [currentMonthLimit, setCurrentMonthLimit] = useState(5); // June
  const [currentYearLimit, setCurrentYearLimit] = useState(2026);

  // Preview Modal & Row Printing states
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewRecord, setPreviewRecord] = useState<any>(null);
  const [previewType, setPreviewType] = useState<string>("");
  const [printRecord, setPrintRecord] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userType = localStorage.getItem("session_user_type");
      if (userType !== "company") {
        router.push("/login?tab=company");
        return;
      }

      // Load session mode
      const savedMode = (localStorage.getItem("session_view_mode") as any) || "manager";
      setViewMode(savedMode);
      const email = localStorage.getItem("session_company_email") || "admin@example.com";
      setCurrentUserEmail(email);

      // Initialize dynamic limits on client-side mount
      const d = new Date();
      setToMonth(d.getMonth());
      setToYear(d.getFullYear());
      setCurrentMonthLimit(d.getMonth());
      setCurrentYearLimit(d.getFullYear());

      const coStr = localStorage.getItem("session_company");
      if (coStr) {
        setCompanyName(JSON.parse(coStr).name || "Acme India Pvt Ltd");
      }

      // Load databases with fallback mock files
      const storedEmp = localStorage.getItem("employees");
      const parsedEmployees = storedEmp ? JSON.parse(storedEmp) : defaultEmployees;
      setEmployees(parsedEmployees);

      const current = parsedEmployees.find((e: any) => e.email.toLowerCase() === email.toLowerCase());
      setCurrentUserEmpId(current ? current.id : "EMP-001");

      const storedAtt = localStorage.getItem("hrms_attendances");
      setAttendances(storedAtt ? JSON.parse(storedAtt) : defaultAttendances);

      const storedLeaves = localStorage.getItem("hrms_leaves");
      setLeaves(storedLeaves ? JSON.parse(storedLeaves) : defaultLeaves);

      const storedTypes = localStorage.getItem("hrms_leave_types");
      setLeaveTypes(storedTypes ? JSON.parse(storedTypes) : defaultLeaveTypes);

      const storedAssets = localStorage.getItem("hrms_assets");
      setAssets(storedAssets ? JSON.parse(storedAssets) : defaultAssets);

      const storedOff = localStorage.getItem("hrms_offboardings");
      setOffboardings(storedOff ? JSON.parse(storedOff) : defaultOffboardings);

      const storedExp = localStorage.getItem("hrms_expenses");
      setExpenses(storedExp ? JSON.parse(storedExp) : defaultExpenses);

      const storedDep = localStorage.getItem("hrms_deposits");
      setDeposits(storedDep ? JSON.parse(storedDep) : defaultDeposits);

      // Listen for view changes
      const listener = () => {
        setViewMode((localStorage.getItem("session_view_mode") as any) || "manager");
      };
      window.addEventListener("viewModeChanged", listener);
      return () => window.removeEventListener("viewModeChanged", listener);
    }
  }, [router]);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchQuery("");
    setDeptFilter("All");
    setStatusFilter("All");
    setDateFilter("");
    router.push(`/dashboard/reports?tab=${tab}` as any);
  };

  // Resolve employee info helper
  const getEmpName = (empId: string) => {
    const e = employees.find(emp => emp.id === empId);
    return e ? e.fullName : "Unknown Employee";
  };

  // PRINT / EXPORT PDF
  const triggerPrint = () => {
    window.print();
  };

  // Indian statutory salary calculations resolver
  const resolvePayrollCalcs = (e: any) => {
    const basic = e.salary?.basic || 0;
    const hra = e.salary?.hra || 0;
    const specialAllowance = e.salary?.specialAllowance || 0;
    const conveyance = e.salary?.conveyance || 0;
    const medicalAllowance = e.salary?.medicalAllowance || 0;
    const lta = e.salary?.lta || 0;
    
    // Standard simulated earnings components
    const bonus = e.salary?.bonus || 0;
    const incentives = e.salary?.incentives || 0;
    const overtime = e.salary?.overtime || 0;
    const reimbursements = e.salary?.reimbursements || 0;

    try {
      const calc = calculateIndianPayroll({
        tenantId: "tenant-demo",
        employeeId: e.id,
        state: e.location || "Maharashtra",
        taxRegime: "NEW",
        basic,
        hra,
        specialAllowance,
        conveyance,
        medicalAllowance,
        lta,
        bonus,
        incentives,
        overtime,
        reimbursements,
        otherDeductions: 0,
        lopDays: 0,
        paidDays: 30,
        monthDays: 30
      });
      return {
        basic,
        hra,
        specialAllowance,
        conveyance,
        medicalAllowance,
        lta,
        bonus,
        incentives,
        overtime,
        reimbursements,
        gross: calc.grossEarnings,
        pf: calc.employeePf,
        esi: calc.employeeEsi,
        pt: calc.professionalTax,
        tds: calc.estimatedTds,
        net: calc.netPay
      };
    } catch (err) {
      const gross = basic + hra + specialAllowance + conveyance + medicalAllowance + lta + bonus + incentives + overtime + reimbursements;
      const pf = Math.round(basic * 0.12);
      const esi = Math.round(gross < 21000 ? gross * 0.0075 : 0);
      const pt = 200;
      const tds = Math.round(gross * 0.10);
      const net = gross - (pf + esi + pt + tds);
      return {
        basic,
        hra,
        specialAllowance,
        conveyance,
        medicalAllowance,
        lta,
        bonus,
        incentives,
        overtime,
        reimbursements,
        gross,
        pf,
        esi,
        pt,
        tds,
        net
      };
    }
  };

  const handleToYearChange = (year: number) => {
    setToYear(year);
    if (year === currentYearLimit && toMonth > currentMonthLimit) {
      setToMonth(currentMonthLimit);
    }
  };

  const handleToMonthChange = (month: number) => {
    if (toYear === currentYearLimit && month > currentMonthLimit) {
      setToMonth(currentMonthLimit);
    } else {
      setToMonth(month);
    }
  };

  // ==========================================
  // ROW ACTIONS HANDLERS
  // ==========================================
  const handlePreview = (record: any, type: string) => {
    setPreviewRecord(record);
    setPreviewType(type);
    setPreviewModalOpen(true);
  };

  const handleSingleRowPrint = (record: any, type: string) => {
    setPrintRecord({ record, type });
    document.body.classList.add("print-single-record");
    setTimeout(() => {
      window.print();
      document.body.classList.remove("print-single-record");
      setPrintRecord(null);
    }, 150);
  };

  const handleExportRowCSV = (record: any, type: string) => {
    let headers: string[] = [];
    let values: string[] = [];

    if (type === "employee" || type === "my_profile") {
      headers = ["Employee ID", "Full Name", "Email", "Mobile", "PAN", "Aadhaar", "UAN", "ESIC", "Department", "Designation", "Branch", "Joining Date", "Employment Type"];
      values = [
        record.id,
        record.fullName,
        record.email,
        record.mobile,
        record.pan || "",
        record.aadhaar || "",
        record.uan || "",
        record.esicNumber || "",
        record.department,
        record.designation,
        record.branch || "",
        record.dateOfJoining,
        record.employmentType
      ];
    } else if (type === "attendance" || type === "my_attendance") {
      headers = ["Employee ID", "Employee Name", "Date", "Clock In", "Clock Out", "IP Address", "Geofence Status", "Status"];
      const inTime = record.clockInDateTime ? new Date(record.clockInDateTime).toLocaleTimeString("en-IN") : "--";
      const outTime = record.clockOutDateTime ? new Date(record.clockOutDateTime).toLocaleTimeString("en-IN") : "--";
      values = [
        record.userId,
        getEmpName(record.userId),
        record.date,
        inTime,
        outTime,
        record.clockInIpAddress || "N/A",
        record.clockInLocationName ? "Verified" : "N/A",
        record.status
      ];
    } else if (type === "leave" || type === "my_leaves") {
      const typeObj = leaveTypes.find((t: any) => t.id === record.leaveTypeId);
      headers = ["Employee ID", "Employee Name", "Leave Type", "Start Date", "End Date", "Total Days", "Reason", "Status"];
      values = [
        record.userId,
        getEmpName(record.userId),
        typeObj ? typeObj.name : "Leave",
        record.startDate,
        record.endDate,
        String(record.totalDays),
        record.reason,
        record.status
      ];
    } else if (type === "asset" || type === "my_assets") {
      headers = ["Asset ID", "Asset Name", "Serial Number", "Price", "Status", "Allotted User", "Purchase Date"];
      values = [
        String(record.id),
        record.name,
        record.serialNumber,
        String(record.price || 0),
        record.status,
        record.userId ? getEmpName(record.userId) : "In Stock",
        record.purchaseDate || "2024-01-01"
      ];
    } else if (type === "offboarding" || type === "my_offboarding") {
      headers = ["Employee ID", "Employee Name", "Exit Type", "Submit Date", "LWD Date", "Status", "Clearance Status"];
      values = [
        record.userId,
        getEmpName(record.userId),
        record.type || "Resignation",
        record.submitDate || record.startDate,
        record.endDate,
        record.status,
        record.assetsReturned ? "Returned" : "Pending Return"
      ];
    } else if (type === "payroll" || type === "my_payroll") {
      headers = ["Employee ID", "Name", "Basic", "HRA", "Special Allowance", "Conveyance", "Medical Allowance", "LTA", "Bonus", "Incentives", "Overtime", "Reimbursements", "Gross Pay", "PF Deduction", "ESI Deduction", "PT Deduction", "TDS Deduction", "Net Pay", "Cycle Month"];
      const c = resolvePayrollCalcs(record);
      values = [
        record.id,
        record.fullName,
        String(c.basic),
        String(c.hra),
        String(c.specialAllowance),
        String(c.conveyance),
        String(c.medicalAllowance),
        String(c.lta),
        String(c.bonus),
        String(c.incentives),
        String(c.overtime),
        String(c.reimbursements),
        String(c.gross),
        String(c.pf),
        String(c.esi),
        String(c.pt),
        String(c.tds),
        String(c.net),
        record.month || "May 2026"
      ];
    } else if (type === "finance" || type === "my_expenses") {
      headers = ["Reference No", "Ledger Type", "Description", "Date Time", "Amount"];
      values = [
        record.referenceNumber || `DEP-${record.id}`,
        record.type || (record.payeeName ? "EXPENSE" : "DEPOSIT"),
        record.notes || "",
        record.dateTime || record.date || "Today",
        String(record.amount || 0)
      ];
    }

    const csvContent = [
      headers.map(h => `"${(h || "").replace(/"/g, '""')}"`).join(","),
      values.map(v => `"${(v || "").replace(/"/g, '""')}"`).join(",")
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `report_${type}_${record.id || record.userId || "row"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ==========================================
  // MANAGER VIEW REPORTS COMPILING DATA
  // ==========================================
  
  const monthsList = [
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "June" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" }
  ];
  const yearsList = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

  const fromLimit = fromYear * 12 + fromMonth;
  const toLimit = toYear * 12 + toMonth;

  const isDateInRange = (dateStr: string) => {
    if (!dateStr) return true;
    
    // If format is like "May 2026"
    if (dateStr.includes(" ")) {
      const parts = dateStr.split(" ");
      const mIdx = monthsList.findIndex(m => m.label.toLowerCase() === parts[0].toLowerCase());
      const yVal = parseInt(parts[1], 10);
      if (mIdx !== -1 && !isNaN(yVal)) {
        const val = yVal * 12 + mIdx;
        return val >= fromLimit && val <= toLimit;
      }
    }
    
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return true;
    
    const val = d.getFullYear() * 12 + d.getMonth();
    return val >= fromLimit && val <= toLimit;
  };

  const getMonthsInRange = () => {
    const list: { label: string; year: number; month: number }[] = [];
    let currentYear = fromYear;
    let currentMonth = fromMonth;
    
    const endVal = toYear * 12 + toMonth;
    while (currentYear * 12 + currentMonth <= endVal) {
      const label = `${monthsList[currentMonth].label} ${currentYear}`;
      list.push({ label, year: currentYear, month: currentMonth });
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
    }
    return list.reverse();
  };

  // 1. Employees Directory
  const reportEmployees = employees.filter(e => {
    const matchSearch = e.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || e.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = deptFilter === "All" || e.department === deptFilter;
    const matchPeriod = isDateInRange(e.dateOfJoining);
    return matchSearch && matchDept && matchPeriod;
  });

  // 2. Attendance Daily Logs
  const reportAttendances = attendances.filter(a => {
    const dateToMatch = dateFilter;
    const matchDate = dateToMatch ? a.date === dateToMatch : isDateInRange(a.date);
    const matchSearch = getEmpName(a.userId).toLowerCase().includes(searchQuery.toLowerCase()) || a.userId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    return matchDate && matchSearch && matchStatus;
  });

  // 3. Leaves Audit
  const reportLeaves = leaves.filter(l => {
    const matchSearch = getEmpName(l.userId).toLowerCase().includes(searchQuery.toLowerCase()) || l.userId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "All" || l.status === statusFilter;
    const matchPeriod = isDateInRange(l.startDate);
    return matchSearch && matchStatus && matchPeriod;
  });

  // 4. Assets Registry
  const reportAssets = assets.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    const matchPeriod = isDateInRange(a.purchaseDate);
    return matchSearch && matchStatus && matchPeriod;
  });

  // 5. Offboarding/Exits
  const reportOffboardings = offboardings.filter(o => {
    const matchSearch = getEmpName(o.userId).toLowerCase().includes(searchQuery.toLowerCase()) || o.userId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    const matchPeriod = isDateInRange(o.submitDate || o.startDate);
    return matchSearch && matchStatus && matchPeriod;
  });

  // 6. Payroll payouts (multi-month list of employee payroll runs)
  const selectedMonths = getMonthsInRange();
  const reportPayrolls: any[] = [];
  selectedMonths.forEach(m => {
    employees.forEach(e => {
      const matchSearch = e.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || e.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDept = deptFilter === "All" || e.department === deptFilter;
      if (matchSearch && matchDept) {
        const joinDate = new Date(e.dateOfJoining);
        const monthLastDay = new Date(m.year, m.month + 1, 0);
        if (joinDate <= monthLastDay) {
          reportPayrolls.push({
            ...e,
            month: m.label,
            monthVal: m.month,
            yearVal: m.year
          });
        }
      }
    });
  });

  // 7. Finance Statement Ledger
  const reportFinance = [
    ...deposits.map(d => ({ ...d, type: "DEPOSIT", label: "Inflow" })),
    ...expenses.map(e => ({ ...e, type: "EXPENSE", label: "Outflow", notes: e.notes || e.referenceNumber }))
  ].filter(f => {
    const notes = f.notes || f.payerName || f.referenceNumber || "";
    const matchSearch = notes.toLowerCase().includes(searchQuery.toLowerCase()) || (f.referenceNumber && f.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchStatus = statusFilter === "All" || f.type === statusFilter;
    const matchPeriod = isDateInRange(f.dateTime || f.date);
    return matchSearch && matchStatus && matchPeriod;
  }).sort((a, b) => new Date(b.dateTime || b.date || 0).getTime() - new Date(a.dateTime || a.date || 0).getTime());


  // ==========================================
  // SELF VIEW REPORTS COMPILING DATA
  // ==========================================
  const myProfile = employees.find(e => e.id === currentUserEmpId) || employees[0] || {};
  
  const myAttendances = attendances.filter(a => a.userId === currentUserEmpId && isDateInRange(a.date)).sort((a, b) => b.date.localeCompare(a.date));
  
  const myLeaves = leaves.filter(l => l.userId === currentUserEmpId && isDateInRange(l.startDate)).sort((a, b) => b.startDate.localeCompare(a.startDate));
  
  const myAssets = assets.filter(a => a.userId === currentUserEmpId && isDateInRange(a.purchaseDate));
  
  const myOffboardings = offboardings.filter(o => o.userId === currentUserEmpId && isDateInRange(o.submitDate || o.startDate));
  
  const myExpenses = expenses.filter(e => {
    const payee = (e.payeeName || "").toLowerCase();
    const myName = (myProfile.fullName || "").toLowerCase();
    const isMine = payee.includes(myName) || payee === myName;
    return isMine && isDateInRange(e.dateTime || e.date);
  });

  // Render detail components inside popover modals
  const renderPreviewContent = (rec: any, type: string) => {
    if (!rec) return null;

    const rowStyle = "grid grid-cols-2 gap-4 py-2 border-b border-slate-100 text-xs";
    const labelStyle = "font-bold text-slate-400 uppercase";
    const valStyle = "text-slate-800 font-medium";

    if (type === "employee" || type === "my_profile") {
      return (
        <div className="space-y-1">
          <div className={rowStyle}><span className={labelStyle}>Employee ID</span><span className="font-mono text-indigo-650 font-black">{rec.id}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Full Name</span><span className="font-black text-slate-900">{rec.fullName}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Email</span><span className={valStyle}>{rec.email}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Mobile</span><span className={valStyle}>{rec.mobile}</span></div>
          <div className={rowStyle}><span className={labelStyle}>PAN Card</span><span className="font-mono valStyle">{rec.pan || "N/A"}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Aadhaar Card</span><span className="font-mono valStyle">{rec.aadhaar || "N/A"}</span></div>
          <div className={rowStyle}><span className={labelStyle}>PF UAN</span><span className="font-mono valStyle">{rec.uan || "N/A"}</span></div>
          <div className={rowStyle}><span className={labelStyle}>ESIC Code</span><span className="font-mono valStyle">{rec.esicNumber || "N/A"}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Department</span><span className={valStyle}>{rec.department}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Designation</span><span className={valStyle}>{rec.designation}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Branch</span><span className={valStyle}>{rec.branch || "Mumbai"}</span></div>
          <div className={rowStyle}><span className={labelStyle}>State/Location</span><span className={valStyle}>{rec.location || "Maharashtra"}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Date of Joining</span><span className="font-mono valStyle">{rec.dateOfJoining}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Employment Type</span><span className={valStyle}>{rec.employmentType}</span></div>
        </div>
      );
    }

    if (type === "attendance" || type === "my_attendance") {
      const inTime = rec.clockInDateTime ? new Date(rec.clockInDateTime).toLocaleTimeString("en-IN") : "--";
      const outTime = rec.clockOutDateTime ? new Date(rec.clockOutDateTime).toLocaleTimeString("en-IN") : "--";
      return (
        <div className="space-y-1">
          <div className={rowStyle}><span className={labelStyle}>Employee Name</span><span className="font-black text-slate-900">{getEmpName(rec.userId)}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Employee ID</span><span className="font-mono valStyle">{rec.userId}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Date</span><span className="font-mono valStyle">{rec.date}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Clock In Time</span><span className="font-mono valStyle">{inTime}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Clock Out Time</span><span className="font-mono valStyle">{outTime}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Punch IP Address</span><span className="font-mono valStyle">{rec.clockInIpAddress || "N/A"}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Location Accuracy</span><span className={valStyle}>{rec.clockInLocationName ? `Mumbai Office (Geofenced)` : "Not verified"}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Status</span><span><Badge>{rec.status}</Badge></span></div>
        </div>
      );
    }

    if (type === "leave" || type === "my_leaves") {
      const typeObj = leaveTypes.find((t: any) => t.id === rec.leaveTypeId);
      return (
        <div className="space-y-1">
          <div className={rowStyle}><span className={labelStyle}>Employee Name</span><span className="font-black text-slate-900">{getEmpName(rec.userId)}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Employee ID</span><span className="font-mono valStyle">{rec.userId}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Leave Type</span><span className={valStyle}>{typeObj ? typeObj.name : "Leave"}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Duration Range</span><span className="font-mono valStyle">{rec.startDate} to {rec.endDate}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Days Count</span><span className={valStyle}>{rec.totalDays} Days</span></div>
          <div className={rowStyle}><span className={labelStyle}>Reason Description</span><span className="text-slate-650 font-normal">{rec.reason}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Approval Status</span><span><Badge>{rec.status}</Badge></span></div>
        </div>
      );
    }

    if (type === "asset" || type === "my_assets") {
      return (
        <div className="space-y-1">
          <div className={rowStyle}><span className={labelStyle}>Asset Name</span><span className="font-black text-slate-900">{rec.name}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Serial Number</span><span className="font-mono valStyle">{rec.serialNumber}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Valuation Cost</span><span className="font-mono font-bold text-slate-900">₹{(rec.price || 0).toLocaleString()}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Purchase Date</span><span className="font-mono valStyle">{rec.purchaseDate || "2024-01-01"}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Allotted To</span><span className={valStyle}>{rec.userId ? getEmpName(rec.userId) : "In Stock"}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Status</span><span><Badge>{rec.status}</Badge></span></div>
          <div className="py-2 text-xs"><span className={labelStyle + " block mb-1"}>Description details</span><p className="text-slate-500 font-normal">{rec.description || "N/A"}</p></div>
        </div>
      );
    }

    if (type === "offboarding" || type === "my_offboarding") {
      return (
        <div className="space-y-1">
          <div className={rowStyle}><span className={labelStyle}>Employee Name</span><span className="font-black text-slate-900">{getEmpName(rec.userId)}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Employee ID</span><span className="font-mono valStyle">{rec.userId}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Exit Type</span><span className={valStyle}>{rec.type || "Resignation"}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Submission Date</span><span className="font-mono valStyle">{rec.submitDate || rec.startDate}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Target Release Date</span><span className="font-mono valStyle">{rec.endDate}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Notice Reason</span><span className="text-slate-650 font-normal">{rec.description}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Clearance Parameters</span><span className="font-bold text-indigo-750">{rec.assetsReturned ? "Assets Returned ✓" : "Pending Assets return ✗"}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Approval Status</span><span><Badge>{rec.status}</Badge></span></div>
        </div>
      );
    }

    if (type === "payroll" || type === "my_payroll") {
      const c = resolvePayrollCalcs(rec);
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-3">
            <div>
              <p className={labelStyle}>Employee Name</p>
              <p className="text-sm font-black text-slate-900">{rec.fullName}</p>
            </div>
            <div className="text-right">
              <p className={labelStyle}>Salary Period</p>
              <p className="text-sm font-bold text-slate-800">{rec.month || "May 2026"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Earnings */}
            <div className="space-y-1 bg-slate-50 p-3 rounded border border-slate-100">
              <h4 className="font-black text-slate-900 border-b border-slate-200 pb-1 mb-2 text-[10px] tracking-wider uppercase">Earnings Structure</h4>
              <div className="flex justify-between py-1"><span className="text-slate-500">Basic Salary</span><span className="font-mono font-bold text-slate-800">₹{c.basic.toLocaleString()}</span></div>
              <div className="flex justify-between py-1"><span className="text-slate-500">House Rent Allowance (HRA)</span><span className="font-mono font-bold text-slate-800">₹{c.hra.toLocaleString()}</span></div>
              <div className="flex justify-between py-1"><span className="text-slate-500">Special Allowance</span><span className="font-mono font-bold text-slate-800">₹{c.specialAllowance.toLocaleString()}</span></div>
              <div className="flex justify-between py-1"><span className="text-slate-500">Conveyance</span><span className="font-mono font-bold text-slate-800">₹{c.conveyance.toLocaleString()}</span></div>
              <div className="flex justify-between py-1"><span className="text-slate-500">Medical Allowance</span><span className="font-mono font-bold text-slate-800">₹{c.medicalAllowance.toLocaleString()}</span></div>
              <div className="flex justify-between py-1"><span className="text-slate-500">Leave Travel Allow. (LTA)</span><span className="font-mono font-bold text-slate-800">₹{c.lta.toLocaleString()}</span></div>
              {c.bonus > 0 && <div className="flex justify-between py-1"><span className="text-indigo-650 font-bold">Bonus</span><span className="font-mono font-bold text-indigo-700">₹{c.bonus.toLocaleString()}</span></div>}
              {c.incentives > 0 && <div className="flex justify-between py-1"><span className="text-indigo-650 font-bold">Incentives</span><span className="font-mono font-bold text-indigo-700">₹{c.incentives.toLocaleString()}</span></div>}
              {c.overtime > 0 && <div className="flex justify-between py-1"><span className="text-slate-500">Overtime</span><span className="font-mono font-bold text-slate-800">₹{c.overtime.toLocaleString()}</span></div>}
              {c.reimbursements > 0 && <div className="flex justify-between py-1"><span className="text-slate-500">Reimbursements</span><span className="font-mono font-bold text-slate-800">₹{c.reimbursements.toLocaleString()}</span></div>}
            </div>

            {/* Deductions */}
            <div className="space-y-1 bg-slate-50 p-3 rounded border border-slate-100">
              <h4 className="font-black text-slate-900 border-b border-slate-200 pb-1 mb-2 text-[10px] tracking-wider uppercase">Deductions Ledger</h4>
              <div className="flex justify-between py-1"><span className="text-slate-500">Provident Fund (PF)</span><span className="font-mono font-bold text-rose-600">₹{c.pf.toLocaleString()}</span></div>
              <div className="flex justify-between py-1"><span className="text-slate-500">ESI Insurance</span><span className="font-mono font-bold text-rose-600">₹{c.esi.toLocaleString()}</span></div>
              <div className="flex justify-between py-1"><span className="text-slate-500">Professional Tax (PT)</span><span className="font-mono font-bold text-rose-600">₹{c.pt.toLocaleString()}</span></div>
              <div className="flex justify-between py-1"><span className="text-slate-500">TDS / Income Tax</span><span className="font-mono font-bold text-rose-600">₹{c.tds.toLocaleString()}</span></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-3 text-xs bg-indigo-50/30 p-3 rounded border border-indigo-100/50">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-black">Gross Pay</p>
              <p className="text-sm font-black text-slate-700">₹{c.gross.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-indigo-700 uppercase font-black">Net Salary Payout</p>
              <p className="text-lg font-black text-indigo-900">₹{c.net.toLocaleString()}</p>
            </div>
          </div>
        </div>
      );
    }

    if (type === "finance" || type === "my_expenses") {
      const isDeposit = rec.type === "DEPOSIT" || !rec.payeeName;
      return (
        <div className="space-y-1">
          <div className={rowStyle}><span className={labelStyle}>Reference Number</span><span className="font-mono valStyle">{rec.referenceNumber || `TXN-${rec.id}`}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Ledger Category</span><span><Badge className={isDeposit ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}>{isDeposit ? "Credit (Inflow)" : "Debit (Outflow)"}</Badge></span></div>
          <div className={rowStyle}><span className={labelStyle}>Date</span><span className="font-mono valStyle">{rec.dateTime ? new Date(rec.dateTime).toLocaleDateString("en-IN") : rec.date || "Today"}</span></div>
          <div className={rowStyle}><span className={labelStyle}>{isDeposit ? "Payer Client" : "Payee Vendor"}</span><span className={valStyle}>{rec.payerName || rec.payeeName || "System Vault"}</span></div>
          <div className={rowStyle}><span className={labelStyle}>Amount (INR)</span><span className={`font-mono font-black ${isDeposit ? "text-emerald-750" : "text-rose-750"}`}>₹{(rec.amount || 0).toLocaleString()}</span></div>
          <div className="py-2 text-xs"><span className={labelStyle + " block mb-1"}>Transaction Description</span><p className="text-slate-500 font-normal">{rec.notes}</p></div>
        </div>
      );
    }

    return null;
  };

  const actionCell = (rec: any, type: string) => {
    return (
      <td className="p-4 text-center no-print">
        <div className="inline-flex items-center gap-1.5">
          <button
            onClick={() => handlePreview(rec, type)}
            className="p-1.5 rounded bg-indigo-50 text-indigo-650 hover:bg-indigo-100 transition"
            title="Preview details modal"
          >
            <Eye className="size-3.5" />
          </button>
          <button
            onClick={() => handleExportRowCSV(rec, type)}
            className="p-1.5 rounded bg-emerald-50 text-emerald-650 hover:bg-emerald-100 transition"
            title="Export row as CSV"
          >
            <Share2 className="size-3.5" />
          </button>
          <button
            onClick={() => handleSingleRowPrint(rec, type)}
            className="p-1.5 rounded bg-blue-50 text-blue-650 hover:bg-blue-100 transition"
            title="Print / Download PDF"
          >
            <Download className="size-3.5" />
          </button>
        </div>
      </td>
    );
  };

  return (
    <>
      {/* Inject styling overrides for window.print() */}
      <style>{`
        @media print {
          @page {
            size: ${printRecord ? "portrait" : (activeTab === "payroll" || activeTab === "my_payroll" ? "landscape" : "portrait")};
            margin: 10mm;
          }
          body:not(.print-single-record) aside, 
          body:not(.print-single-record) header, 
          body:not(.print-single-record) nav, 
          body:not(.print-single-record) button, 
          body:not(.print-single-record) select, 
          body:not(.print-single-record) input, 
          body:not(.print-single-record) .no-print, 
          body:not(.print-single-record) .filter-block {
            display: none !important;
          }
          body:not(.print-single-record) main, 
          body:not(.print-single-record) section, 
          body:not(.print-single-record) div, 
          body:not(.print-single-record) .print-area {
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            width: 100% !important;
            max-width: 100% !important;
            background-color: white !important;
            color: black !important;
            overflow: visible !important;
          }
          body:not(.print-single-record) table {
            border-collapse: collapse !important;
            width: 100% !important;
            min-width: 0 !important;
          }
          body:not(.print-single-record) th, 
          body:not(.print-single-record) td {
            border: 1px solid #cbd5e1 !important;
            padding: 6px !important;
            color: black !important;
            font-size: 8px !important;
          }

          /* Tighter table styles for very wide payroll reports */
          ${(activeTab === "payroll" || activeTab === "my_payroll") ? `
            body:not(.print-single-record) th, 
            body:not(.print-single-record) td {
              font-size: 7px !important;
              padding: 3px 2px !important;
            }
          ` : ''}

          body:not(.print-single-record) .print-header {
            display: block !important;
            margin-bottom: 24px;
            border-bottom: 2px solid #1e293b;
            padding-bottom: 12px;
          }
          body:not(.print-single-record) .print-header-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          body:not(.print-single-record) .print-title {
            font-size: 20px;
            font-weight: 900;
            color: #0f172a;
            text-transform: uppercase;
          }
          body:not(.print-single-record) .print-meta {
            font-size: 10px;
            font-family: monospace;
            color: #64748b;
            margin-top: 4px;
          }

          /* SINGLE RECORD PRINT SELECTORS */
          body.print-single-record main,
          body.print-single-record section,
          body.print-single-record .print-area,
          body.print-single-record .print-header,
          body.print-single-record .no-print,
          body.print-single-record .filter-block {
            display: none !important;
          }
          body.print-single-record .print-single-only {
            display: block !important;
          }
          body:not(.print-single-record) .print-single-only {
            display: none !important;
          }
        }
        @media screen {
          .print-header {
            display: none !important;
          }
          .print-single-only {
            display: none !important;
          }
        }
      `}</style>

      <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[280px_1fr]">

      <SaasSidebar active="Reports" />

      <section className="p-6 lg:p-8 overflow-y-auto">
        {/* Central Header */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white -mx-6 -mt-6 p-6 lg:-mx-8 lg:-mt-8 shadow-sm no-print">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Reports & Analytics Center</h2>
            <p className="mt-1 text-sm text-slate-500">
              {viewMode === "manager"
                ? "Generate company-wide audits, attendance registries, and statutory deduction reports."
                : "View your personal attendance history logs, leaves summaries, payslip audits, and allotted inventory."}
            </p>
          </div>
          <button
            onClick={triggerPrint}
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-xs font-black text-white shadow hover:bg-slate-800 transition"
          >
            <Printer className="size-4" /> Export PDF / Print Page
          </button>
        </header>

        {/* Dynamic A4 Printable Header */}
        <div className="print-header">
          <div className="print-header-top">
            <div>
              <h1 className="print-title">{companyName} Report</h1>
              <p className="print-meta">Generated on: {new Date().toLocaleString()} | User: {currentUserEmail}</p>
            </div>
            <div className="text-right text-xs font-bold uppercase text-slate-500">
              Module: {activeTab.toUpperCase()} | Scope: {viewMode.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Tab Selector Links */}
        <div className="flex border-b border-slate-200 mb-6 text-xs font-bold text-slate-400 no-print overflow-x-auto whitespace-nowrap bg-white rounded-lg p-1.5 shadow-sm">
          {viewMode === "manager" ? (
            <>
              <button
                onClick={() => handleTabChange("employees")}
                className={`py-2 px-4 rounded transition flex items-center gap-2 ${activeTab === "employees" ? "bg-slate-900 text-white font-extrabold" : "hover:text-slate-700"}`}
              >
                <Users className="size-3.5" /> Staff Directory
              </button>
              <button
                onClick={() => handleTabChange("attendance")}
                className={`py-2 px-4 rounded transition flex items-center gap-2 ${activeTab === "attendance" ? "bg-slate-900 text-white font-extrabold" : "hover:text-slate-700"}`}
              >
                <MapPin className="size-3.5" /> Attendance Daily
              </button>
              <button
                onClick={() => handleTabChange("leaves")}
                className={`py-2 px-4 rounded transition flex items-center gap-2 ${activeTab === "leaves" ? "bg-slate-900 text-white font-extrabold" : "hover:text-slate-700"}`}
              >
                <CalendarCheck className="size-3.5" /> Leave Sheet
              </button>
              <button
                onClick={() => handleTabChange("assets")}
                className={`py-2 px-4 rounded transition flex items-center gap-2 ${activeTab === "assets" ? "bg-slate-900 text-white font-extrabold" : "hover:text-slate-700"}`}
              >
                <CreditCard className="size-3.5" /> Assets Valuation
              </button>
              <button
                onClick={() => handleTabChange("offboarding")}
                className={`py-2 px-4 rounded transition flex items-center gap-2 ${activeTab === "offboarding" ? "bg-slate-900 text-white font-extrabold" : "hover:text-slate-700"}`}
              >
                <Briefcase className="size-3.5" /> Exit clearances
              </button>
              <button
                onClick={() => handleTabChange("payroll")}
                className={`py-2 px-4 rounded transition flex items-center gap-2 ${activeTab === "payroll" ? "bg-slate-900 text-white font-extrabold" : "hover:text-slate-700"}`}
              >
                <Layers3 className="size-3.5" /> Payroll & Deductions
              </button>
              <button
                onClick={() => handleTabChange("finance")}
                className={`py-2 px-4 rounded transition flex items-center gap-2 ${activeTab === "finance" ? "bg-slate-900 text-white font-extrabold" : "hover:text-slate-700"}`}
              >
                <Landmark className="size-3.5" /> Finance statements
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleTabChange("my_profile")}
                className={`py-2 px-4 rounded transition flex items-center gap-2 ${activeTab === "my_profile" ? "bg-slate-900 text-white font-extrabold" : "hover:text-slate-700"}`}
              >
                <Users className="size-3.5" /> Profile Audit
              </button>
              <button
                onClick={() => handleTabChange("my_attendance")}
                className={`py-2 px-4 rounded transition flex items-center gap-2 ${activeTab === "my_attendance" ? "bg-slate-900 text-white font-extrabold" : "hover:text-slate-700"}`}
              >
                <MapPin className="size-3.5" /> Attendance Logs
              </button>
              <button
                onClick={() => handleTabChange("my_leaves")}
                className={`py-2 px-4 rounded transition flex items-center gap-2 ${activeTab === "my_leaves" ? "bg-slate-900 text-white font-extrabold" : "hover:text-slate-700"}`}
              >
                <CalendarCheck className="size-3.5" /> Leaves Ledger
              </button>
              <button
                onClick={() => handleTabChange("my_assets")}
                className={`py-2 px-4 rounded transition flex items-center gap-2 ${activeTab === "my_assets" ? "bg-slate-900 text-white font-extrabold" : "hover:text-slate-700"}`}
              >
                <CreditCard className="size-3.5" /> Allocated Assets
              </button>
              <button
                onClick={() => handleTabChange("my_offboarding")}
                className={`py-2 px-4 rounded transition flex items-center gap-2 ${activeTab === "my_offboarding" ? "bg-slate-900 text-white font-extrabold" : "hover:text-slate-700"}`}
              >
                <Briefcase className="size-3.5" /> Exits Status
              </button>
              <button
                onClick={() => handleTabChange("my_payroll")}
                className={`py-2 px-4 rounded transition flex items-center gap-2 ${activeTab === "my_payroll" ? "bg-slate-900 text-white font-extrabold" : "hover:text-slate-700"}`}
              >
                <Layers3 className="size-3.5" /> Payslip history
              </button>
              <button
                onClick={() => handleTabChange("my_expenses")}
                className={`py-2 px-4 rounded transition flex items-center gap-2 ${activeTab === "my_expenses" ? "bg-slate-900 text-white font-extrabold" : "hover:text-slate-700"}`}
              >
                <Coins className="size-3.5" /> Expense Claims
              </button>
            </>
          )}
        </div>

        {/* Dynamic Filters Form */}
        <div className="mb-6 bg-white p-4 rounded-lg border border-slate-200 shadow-sm filter-block no-print grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 text-xs animate-in fade-in duration-200">
          {/* General Search Input */}
          <label className="grid gap-1 font-bold text-slate-400 uppercase">
            Search keyword
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <Search className="size-3.5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search report entries..."
                className="h-10 w-full rounded border border-slate-200 pl-9 pr-3 outline-none focus:border-indigo-500 font-normal"
              />
            </div>
          </label>

          {/* From Period Selector */}
          <label className="grid gap-1 font-bold text-slate-400 uppercase">
            From Period
            <div className="grid grid-cols-2 gap-1">
              <select
                value={fromMonth}
                onChange={e => setFromMonth(parseInt(e.target.value, 10))}
                className="h-10 rounded border border-slate-200 px-2 bg-white outline-none focus:border-indigo-500 font-normal"
              >
                {monthsList.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <select
                value={fromYear}
                onChange={e => setFromYear(parseInt(e.target.value, 10))}
                className="h-10 rounded border border-slate-200 px-2 bg-white outline-none focus:border-indigo-500 font-normal"
              >
                {yearsList.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </label>

          {/* To Period Selector */}
          <label className="grid gap-1 font-bold text-slate-400 uppercase">
            To Period
            <div className="grid grid-cols-2 gap-1">
              <select
                value={toMonth}
                onChange={e => handleToMonthChange(parseInt(e.target.value, 10))}
                className="h-10 rounded border border-slate-200 px-2 bg-white outline-none focus:border-indigo-500 font-normal"
              >
                {monthsList
                  .filter(m => toYear < currentYearLimit || m.value <= currentMonthLimit)
                  .map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
              </select>
              <select
                value={toYear}
                onChange={e => handleToYearChange(parseInt(e.target.value, 10))}
                className="h-10 rounded border border-slate-200 px-2 bg-white outline-none focus:border-indigo-500 font-normal"
              >
                {yearsList.filter(y => y <= currentYearLimit).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </label>

          {/* Department Filter (For Employees/Payroll) */}
          {(activeTab === "employees" || activeTab === "payroll") && viewMode === "manager" && (
            <label className="grid gap-1 font-bold text-slate-400 uppercase">
              Filter Department
              <select
                value={deptFilter}
                onChange={e => setDeptFilter(e.target.value)}
                className="h-10 rounded border border-slate-200 px-3 bg-white outline-none focus:border-indigo-500 font-normal"
              >
                <option value="All">All Departments</option>
                <option value="Administration">Administration</option>
                <option value="Operations">Operations</option>
                <option value="Sales & Marketing">Sales & Marketing</option>
                <option value="Research & Development">Research & Development</option>
                <option value="Finance">Finance</option>
                <option value="Customer Support">Customer Support</option>
              </select>
            </label>
          )}

          {/* Date Filter (For Attendance Reports) */}
          {activeTab === "attendance" && viewMode === "manager" && (
            <label className="grid gap-1 font-bold text-slate-400 uppercase">
              Roster Date Select
              <input
                type="date"
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
                className="h-10 rounded border border-slate-200 px-3 outline-none focus:border-indigo-500 font-normal"
              />
            </label>
          )}

          {/* Status Filter (For Leaves, Assets, Offboarding, Finance) */}
          {["leaves", "assets", "offboarding", "finance"].includes(activeTab) && viewMode === "manager" && (
            <label className="grid gap-1 font-bold text-slate-400 uppercase">
              Status Category
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="h-10 rounded border border-slate-200 px-3 bg-white outline-none focus:border-indigo-500 font-normal"
              >
                <option value="All">All Statuses</option>
                {activeTab === "leaves" && (
                  <>
                    <option value="Pending">Pending Approvals</option>
                    <option value="Approved">Approved Log</option>
                    <option value="Rejected">Rejected Log</option>
                  </>
                )}
                {activeTab === "assets" && (
                  <>
                    <option value="Allocated">Allocated Items</option>
                    <option value="Available">Available Inventory</option>
                  </>
                )}
                {activeTab === "offboarding" && (
                  <>
                    <option value="Pending">Pending Notice</option>
                    <option value="Approved">Approved Exit</option>
                    <option value="Rejected">Rejected exit</option>
                  </>
                )}
                {activeTab === "finance" && (
                  <>
                    <option value="DEPOSIT">Inflow (Deposits)</option>
                    <option value="EXPENSE">Outflow (Expenses)</option>
                  </>
                )}
              </select>
            </label>
          )}
        </div>

        {/* PRINTABLE AREA */}
        <div className="print-area">
          
          {/* ========================================== */}
          {/* MANAGER PERSPECTIVE PAGES                  */}
          {/* ========================================== */}

          {/* TAB 1: Staff Directory Roster */}
          {activeTab === "employees" && viewMode === "manager" && (
            <div>
              {/* Stats Summary Cards */}
              <div className="grid gap-4 sm:grid-cols-3 mb-6 no-print">
                <Card className="p-4 bg-indigo-50/50 border-indigo-100 flex flex-col justify-between">
                  <span className="text-[10px] text-indigo-700 font-extrabold uppercase">Total Staff</span>
                  <span className="text-2xl font-black text-slate-900 mt-2">{employees.length}</span>
                </Card>
                <Card className="p-4 bg-emerald-50/50 border-emerald-100 flex flex-col justify-between">
                  <span className="text-[10px] text-emerald-700 font-extrabold uppercase">Full Time Records</span>
                  <span className="text-2xl font-black text-slate-900 mt-2">{employees.filter(e => e.employmentType === "FULL_TIME").length}</span>
                </Card>
                <Card className="p-4 bg-blue-50/50 border-blue-100 flex flex-col justify-between">
                  <span className="text-[10px] text-blue-700 font-extrabold uppercase">Contract / Interns</span>
                  <span className="text-2xl font-black text-slate-900 mt-2">{employees.filter(e => e.employmentType !== "FULL_TIME").length}</span>
                </Card>
              </div>

              <Card className="p-0 border-slate-200 overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4">Employee ID</th>
                      <th className="p-4">Full Name</th>
                      <th className="p-4">Department</th>
                      <th className="p-4">Designation</th>
                      <th className="p-4">Branch City</th>
                      <th className="p-4">Joining Date</th>
                      <th className="p-4 text-center">Type</th>
                      <th className="p-4 text-center no-print">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {reportEmployees.map(e => (
                      <tr key={e.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-mono text-indigo-600 font-black">{e.id}</td>
                        <td className="p-4 font-black text-slate-800">{e.fullName}</td>
                        <td className="p-4">{e.department}</td>
                        <td className="p-4">{e.designation}</td>
                        <td className="p-4 font-mono">{e.branch || "Mumbai"}</td>
                        <td className="p-4 font-mono text-slate-500">{e.dateOfJoining}</td>
                        <td className="p-4 text-center">
                          <Badge className="text-[9px] uppercase tracking-wider">{e.employmentType.replace("_", " ")}</Badge>
                        </td>
                        {actionCell(e, "employee")}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* TAB 2: Attendance Daily Roster */}
          {activeTab === "attendance" && viewMode === "manager" && (
            <div>
              <div className="mb-4 bg-indigo-50/40 border border-indigo-100/50 p-3.5 rounded text-xs text-indigo-950 font-bold flex items-center gap-2.5 no-print">
                <Info className="size-4 text-indigo-500 shrink-0" />
                <span>Showing attendance register logs for the selected date: <span className="font-black font-mono text-indigo-700 bg-white border border-indigo-100 px-2 py-0.5 rounded">{dateFilter || new Date().toISOString().split("T")[0]}</span>. Adjust utilizing filter settings.</span>
              </div>

              <Card className="p-0 border-slate-200 overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4">Employee</th>
                      <th className="p-4">Clock In Time</th>
                      <th className="p-4">Clock Out Time</th>
                      <th className="p-4">Punch IP</th>
                      <th className="p-4">Geofence accuracy</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center no-print">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {reportAttendances.length > 0 ? (
                      reportAttendances.map(a => {
                        const inTime = a.clockInDateTime ? new Date(a.clockInDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--";
                        const outTime = a.clockOutDateTime ? new Date(a.clockOutDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--";
                        return (
                          <tr key={a.id} className="hover:bg-slate-50/50 transition">
                            <td className="p-4">
                              <p className="font-black text-slate-800 text-sm">{getEmpName(a.userId)}</p>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{a.userId}</p>
                            </td>
                            <td className="p-4 font-mono font-bold text-slate-700">{inTime}</td>
                            <td className="p-4 font-mono text-slate-500">{outTime}</td>
                            <td className="p-4 font-mono text-slate-400">{a.clockInIpAddress || "N/A"}</td>
                            <td className="p-4 text-emerald-600 font-bold">{a.clockInLocationName ? `Mumbai (Geofenced)` : "Not verified"}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                                a.status === "Present" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                                a.status === "Late" ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                              }`}>
                                {a.status}
                              </span>
                            </td>
                            {actionCell(a, "attendance")}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400 font-semibold italic">No attendance records clocked on this date.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* TAB 3: Leaves audit reports */}
          {activeTab === "leaves" && viewMode === "manager" && (
            <Card className="p-0 border-slate-200 overflow-hidden bg-white shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Employee</th>
                    <th className="p-4">Leave type</th>
                    <th className="p-4">Duration Range</th>
                    <th className="p-4">Days count</th>
                    <th className="p-4">Reason description</th>
                    <th className="p-4 text-right">Status</th>
                    <th className="p-4 text-center no-print">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {reportLeaves.length > 0 ? (
                    reportLeaves.map(l => {
                      const typeObj = leaveTypes.find(t => t.id === l.leaveTypeId);
                      return (
                        <tr key={l.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-4">
                            <p className="font-black text-slate-800 text-sm">{getEmpName(l.userId)}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{l.userId}</p>
                          </td>
                          <td className="p-4 font-bold text-slate-700">{typeObj ? typeObj.name : "Leave"}</td>
                          <td className="p-4 font-mono text-slate-500">{l.startDate} to {l.endDate}</td>
                          <td className="p-4 text-slate-800">{l.totalDays} Days</td>
                          <td className="p-4 font-normal text-slate-450 max-w-xs truncate">{l.reason}</td>
                          <td className="p-4 text-right">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              l.status === "Approved" ? "bg-emerald-50 text-emerald-700" :
                              l.status === "Pending" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"
                            }`}>
                              {l.status}
                            </span>
                          </td>
                          {actionCell(l, "leave")}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 font-semibold italic">No leave applications match filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Card>
          )}

          {/* TAB 4: Assets Inventory valuation */}
          {activeTab === "assets" && viewMode === "manager" && (
            <div>
              {/* Assets Stats */}
              <div className="grid gap-4 sm:grid-cols-3 mb-6 no-print">
                <Card className="p-4 bg-indigo-50/50 border-indigo-100 flex flex-col justify-between">
                  <span className="text-[10px] text-indigo-700 font-extrabold uppercase">Total Inventory Items</span>
                  <span className="text-2xl font-black text-slate-900 mt-2">{assets.length} items</span>
                </Card>
                <Card className="p-4 bg-emerald-50/50 border-emerald-100 flex flex-col justify-between">
                  <span className="text-[10px] text-emerald-700 font-extrabold uppercase">Allotment Ratio</span>
                  <span className="text-2xl font-black text-slate-900 mt-2">
                    {Math.round((assets.filter(a => a.status === "Allocated").length / Math.max(1, assets.length)) * 100)}%
                  </span>
                </Card>
                <Card className="p-4 bg-blue-50/50 border-blue-100 flex flex-col justify-between">
                  <span className="text-[10px] text-blue-700 font-extrabold uppercase">Total valuation</span>
                  <span className="text-2xl font-black text-slate-900 mt-2">
                    ₹{assets.reduce((sum, curr) => sum + (Number(curr.price) || 0), 0).toLocaleString()}
                  </span>
                </Card>
              </div>

              <Card className="p-0 border-slate-200 overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4">Serial Number</th>
                      <th className="p-4">Asset Name</th>
                      <th className="p-4 font-right">Cost price</th>
                      <th className="p-4">Allotted User</th>
                      <th className="p-4">Purchase Date</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-center no-print">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {reportAssets.length > 0 ? (
                      reportAssets.map(a => (
                        <tr key={a.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-4 font-mono text-indigo-600 font-black">{a.serialNumber}</td>
                          <td className="p-4 font-black text-slate-800">{a.name}</td>
                          <td className="p-4 font-mono font-bold text-slate-800">₹{(a.price || 0).toLocaleString()}</td>
                          <td className="p-4">
                            {a.userId ? (
                              <div>
                                <p className="font-bold text-slate-850 text-xs">{getEmpName(a.userId)}</p>
                                <p className="text-[9px] font-mono text-slate-400 mt-0.5">{a.userId}</p>
                              </div>
                            ) : (
                              <span className="text-slate-450 italic font-normal">In Stock</span>
                            )}
                          </td>
                          <td className="p-4 font-mono text-slate-500">{a.purchaseDate || "2024-01-01"}</td>
                          <td className="p-4 text-center">
                            <Badge className={`text-[9px] uppercase tracking-wider ${a.status === "Allocated" ? "bg-indigo-50 text-indigo-700 border border-indigo-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}`}>
                              {a.status}
                            </Badge>
                          </td>
                          {actionCell(a, "asset")}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400 font-semibold italic">No assets matches query.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* TAB 5: Offboardings Exits clearances */}
          {activeTab === "offboarding" && viewMode === "manager" && (
            <Card className="p-0 border-slate-200 overflow-hidden bg-white shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Employee ID</th>
                    <th className="p-4">Full Name</th>
                    <th className="p-4">Exit Type</th>
                    <th className="p-4">Submission Date</th>
                    <th className="p-4">Target Release Date</th>
                    <th className="p-4 text-right">Status</th>
                    <th className="p-4 text-center no-print">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {reportOffboardings.length > 0 ? (
                    reportOffboardings.map(o => (
                      <tr key={o.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-mono text-slate-600 font-black">{o.userId}</td>
                        <td className="p-4 font-black text-slate-800">{getEmpName(o.userId)}</td>
                        <td className="p-4 font-bold text-indigo-700">{o.type || "Resignation"}</td>
                        <td className="p-4 font-mono text-slate-500">{o.submitDate || o.startDate}</td>
                        <td className="p-4 font-mono text-slate-700">{o.endDate}</td>
                        <td className="p-4 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            o.status === "Approved" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                            o.status === "Pending" ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        {actionCell(o, "offboarding")}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 font-semibold italic">No offboarding clearances records matches filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Card>
          )}

          {/* TAB 6: Payroll payouts & Deductions */}
          {activeTab === "payroll" && viewMode === "manager" && (
            <div>
              {/* Payroll Totals */}
              <div className="grid gap-4 sm:grid-cols-3 mb-6 no-print">
                <Card className="p-4 bg-indigo-50/50 border-indigo-100 flex flex-col justify-between">
                  <span className="text-[10px] text-indigo-700 font-extrabold uppercase">Total Payroll Cost (Gross)</span>
                  <span className="text-2xl font-black text-slate-900 mt-2">
                    ₹{reportPayrolls.reduce((sum, e) => sum + (resolvePayrollCalcs(e).gross || 0), 0).toLocaleString()}
                  </span>
                </Card>
                <Card className="p-4 bg-emerald-50/50 border-emerald-100 flex flex-col justify-between">
                  <span className="text-[10px] text-emerald-700 font-extrabold uppercase">Total PF Deductions</span>
                  <span className="text-2xl font-black text-slate-900 mt-2">
                    ₹{reportPayrolls.reduce((sum, e) => sum + (resolvePayrollCalcs(e).pf || 0), 0).toLocaleString()}
                  </span>
                </Card>
                <Card className="p-4 bg-blue-50/50 border-blue-100 flex flex-col justify-between">
                  <span className="text-[10px] text-blue-700 font-extrabold uppercase">Total Net Payouts</span>
                  <span className="text-2xl font-black text-slate-900 mt-2">
                    ₹{reportPayrolls.reduce((sum, e) => sum + (resolvePayrollCalcs(e).net || 0), 0).toLocaleString()}
                  </span>
                </Card>
              </div>

              {/* Scrollable Landscape optimized Wide Table */}
              <Card className="p-0 border-slate-200 overflow-x-auto bg-white shadow-sm scrollbar-thin">
                <table className="min-w-[1500px] w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4">Emp ID</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Period</th>
                      <th className="p-4">Basic</th>
                      <th className="p-4">HRA</th>
                      <th className="p-4">Spl. Allow</th>
                      <th className="p-4">Conveyance</th>
                      <th className="p-4">Medical</th>
                      <th className="p-4">LTA</th>
                      <th className="p-4">Bonus</th>
                      <th className="p-4">Incentives</th>
                      <th className="p-4">Overtime</th>
                      <th className="p-4">Reimburse.</th>
                      <th className="p-4 font-bold text-slate-900">Gross Pay</th>
                      <th className="p-4 text-rose-600">PF</th>
                      <th className="p-4 text-rose-600">ESI</th>
                      <th className="p-4 text-rose-600">PT</th>
                      <th className="p-4 text-rose-600">TDS</th>
                      <th className="p-4 font-bold text-indigo-700">Net Pay</th>
                      <th className="p-4 text-center no-print">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {reportPayrolls.map(e => {
                      const c = resolvePayrollCalcs(e);
                      return (
                        <tr key={`${e.id}-${e.month}`} className="hover:bg-slate-50/50 transition">
                          <td className="p-4 font-mono text-slate-500 font-black">{e.id}</td>
                          <td className="p-4 font-black text-slate-800">{e.fullName}</td>
                          <td className="p-4 font-black font-sans text-slate-800">{e.month}</td>
                          <td className="p-4 font-mono">₹{c.basic.toLocaleString()}</td>
                          <td className="p-4 font-mono">₹{c.hra.toLocaleString()}</td>
                          <td className="p-4 font-mono">₹{c.specialAllowance.toLocaleString()}</td>
                          <td className="p-4 font-mono">₹{c.conveyance.toLocaleString()}</td>
                          <td className="p-4 font-mono">₹{c.medicalAllowance.toLocaleString()}</td>
                          <td className="p-4 font-mono">₹{c.lta.toLocaleString()}</td>
                          <td className="p-4 font-mono">₹{c.bonus.toLocaleString()}</td>
                          <td className="p-4 font-mono">₹{c.incentives.toLocaleString()}</td>
                          <td className="p-4 font-mono">₹{c.overtime.toLocaleString()}</td>
                          <td className="p-4 font-mono">₹{c.reimbursements.toLocaleString()}</td>
                          <td className="p-4 font-mono font-black text-slate-900 bg-slate-50/50">₹{c.gross.toLocaleString()}</td>
                          <td className="p-4 font-mono text-rose-600">₹{c.pf.toLocaleString()}</td>
                          <td className="p-4 font-mono text-rose-600">₹{c.esi.toLocaleString()}</td>
                          <td className="p-4 font-mono text-rose-600">₹{c.pt.toLocaleString()}</td>
                          <td className="p-4 font-mono text-rose-600">₹{c.tds.toLocaleString()}</td>
                          <td className="p-4 font-mono font-black text-indigo-700 bg-indigo-50/10">₹{c.net.toLocaleString()}</td>
                          {actionCell(e, "payroll")}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* TAB 7: Finance Statement Ledger */}
          {activeTab === "finance" && viewMode === "manager" && (
            <div>
              {/* Finance Ledgers */}
              <div className="grid gap-4 sm:grid-cols-3 mb-6 no-print">
                <Card className="p-4 bg-emerald-50/50 border-emerald-100 flex flex-col justify-between">
                  <span className="text-[10px] text-emerald-700 font-extrabold uppercase">Total Inflow (Deposits)</span>
                  <span className="text-2xl font-black text-emerald-800 mt-2">
                    ₹{deposits.reduce((sum, curr) => sum + (Number(curr.amount) || 0), 0).toLocaleString()}
                  </span>
                </Card>
                <Card className="p-4 bg-rose-50/50 border-rose-100 flex flex-col justify-between">
                  <span className="text-[10px] text-rose-700 font-extrabold uppercase">Total Outflow (Expenses)</span>
                  <span className="text-2xl font-black text-rose-800 mt-2">
                    ₹{expenses.reduce((sum, curr) => sum + (Number(curr.amount) || 0), 0).toLocaleString()}
                  </span>
                </Card>
                <Card className="p-4 bg-indigo-50/50 border-indigo-100 flex flex-col justify-between">
                  <span className="text-[10px] text-indigo-700 font-extrabold uppercase">Net Operating Cash</span>
                  <span className="text-2xl font-black text-indigo-950 mt-2">
                    ₹{(deposits.reduce((sum, curr) => sum + (Number(curr.amount) || 0), 0) - expenses.reduce((sum, curr) => sum + (Number(curr.amount) || 0), 0)).toLocaleString()}
                  </span>
                </Card>
              </div>

              <Card className="p-0 border-slate-200 overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4">Reference No.</th>
                      <th className="p-4">Ledger Type</th>
                      <th className="p-4">Description details</th>
                      <th className="p-4">Date Time</th>
                      <th className="p-4 font-right">Amount</th>
                      <th className="p-4 text-center no-print">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {reportFinance.length > 0 ? (
                      reportFinance.map((f, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition">
                          <td className="p-4 font-mono text-slate-500 font-bold">{f.referenceNumber || `DEP-${f.id}`}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${f.type === "DEPOSIT" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"}`}>
                              {f.label}
                            </span>
                          </td>
                          <td className="p-4 font-normal text-slate-600 max-w-sm truncate" title={f.notes}>{f.notes}</td>
                          <td className="p-4 font-mono text-slate-400">{f.dateTime ? new Date(f.dateTime).toLocaleString("en-IN") : f.date || "Today"}</td>
                          <td className={`p-4 font-mono font-black text-sm text-right ${f.type === "DEPOSIT" ? "text-emerald-600" : "text-rose-600"}`}>
                            {f.type === "DEPOSIT" ? "+" : "-"} ₹{(f.amount || 0).toLocaleString()}
                          </td>
                          {actionCell(f, "finance")}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold italic">No finance ledger books logged.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* ========================================== */}
          {/* SELF PERSPECTIVE PAGES (ESS VIEWS)         */}
          {/* ========================================== */}

          {/* TAB 8: My Profile Details audit logs */}
          {activeTab === "my_profile" && viewMode === "self" && (
            <div className="max-w-3xl">
              {/* Row-Wise Actions Bar for Self Profile */}
              <div className="flex justify-end gap-2 mb-4 bg-white p-3 rounded-lg border border-slate-200 shadow-sm no-print">
                <span className="text-xs text-slate-400 font-bold uppercase self-center mr-auto">Profile Actions:</span>
                <button
                  onClick={() => handlePreview(myProfile, "my_profile")}
                  className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 hover:bg-indigo-100 transition px-3 py-1.5 text-[11px] font-black text-indigo-700"
                >
                  <Eye className="size-3.5" /> Preview Profile Sheet
                </button>
                <button
                  onClick={() => handleExportRowCSV(myProfile, "my_profile")}
                  className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 hover:bg-emerald-100 transition px-3 py-1.5 text-[11px] font-black text-emerald-700"
                >
                  <Share2 className="size-3.5" /> Export Profile CSV
                </button>
                <button
                  onClick={() => handleSingleRowPrint(myProfile, "my_profile")}
                  className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 hover:bg-blue-100 transition px-3 py-1.5 text-[11px] font-black text-blue-700"
                >
                  <Download className="size-3.5" /> Download Profile PDF
                </button>
              </div>

              <Card className="p-6 bg-white border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-lg font-black text-slate-800">{myProfile.fullName || "Loading Employee..."}</h3>
                    <p className="text-xs text-slate-400">{myProfile.designation} &bull; {myProfile.department}</p>
                  </div>
                  <Badge>{myProfile.id}</Badge>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 text-xs">
                  <div><span className="text-[10px] text-slate-400 font-bold block uppercase">Email Address</span><span className="text-slate-700 font-medium">{myProfile.email}</span></div>
                  <div><span className="text-[10px] text-slate-400 font-bold block uppercase">Mobile Number</span><span className="text-slate-700 font-mono">{myProfile.mobile}</span></div>
                  <div><span className="text-[10px] text-slate-400 font-bold block uppercase">PAN card</span><span className="text-slate-700 font-mono">{myProfile.pan || "N/A"}</span></div>
                  <div><span className="text-[10px] text-slate-400 font-bold block uppercase">Aadhaar card</span><span className="text-slate-700 font-mono">{myProfile.aadhaar || "N/A"}</span></div>
                  <div><span className="text-[10px] text-slate-400 font-bold block uppercase">Statutory PF UAN</span><span className="text-slate-700 font-mono">{myProfile.uan || "N/A"}</span></div>
                  <div><span className="text-[10px] text-slate-400 font-bold block uppercase">Statutory ESIC Code</span><span className="text-slate-700 font-mono">{myProfile.esicNumber || "N/A"}</span></div>
                  <div><span className="text-[10px] text-slate-400 font-bold block uppercase">Registered Branch</span><span className="text-slate-700 font-medium">{myProfile.branch || "Mumbai"}</span></div>
                  <div><span className="text-[10px] text-slate-400 font-bold block uppercase">Date Of Joining</span><span className="text-slate-700 font-mono">{myProfile.dateOfJoining}</span></div>
                </div>

                {/* Salary Overview info */}
                <div className="border-t border-slate-100 pt-4">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase mb-2">Compensation Overview</h4>
                  <div className="grid grid-cols-3 gap-4 text-xs font-bold bg-slate-50 p-3 rounded">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Basic Pay</span>
                      <span className="text-slate-700 font-mono">₹{myProfile.salary?.basic?.toLocaleString() || "0"}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">HRA Allowance</span>
                      <span className="text-slate-700 font-mono">₹{myProfile.salary?.hra?.toLocaleString() || "0"}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Special Allowance</span>
                      <span className="text-slate-700 font-mono">₹{myProfile.salary?.specialAllowance?.toLocaleString() || "0"}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 9: My Attendance Logs */}
          {activeTab === "my_attendance" && viewMode === "self" && (
            <Card className="p-0 border-slate-200 overflow-hidden bg-white shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Log Date</th>
                    <th className="p-4">Clock In</th>
                    <th className="p-4">Clock Out</th>
                    <th className="p-4">Punch IP Address</th>
                    <th className="p-4">Location verification</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center no-print">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700 font-mono">
                  {myAttendances.length > 0 ? (
                    myAttendances.map(a => {
                      const inTime = a.clockInDateTime ? new Date(a.clockInDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--";
                      const outTime = a.clockOutDateTime ? new Date(a.clockOutDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--";
                      return (
                        <tr key={a.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-4 font-black font-sans text-slate-800">{a.date}</td>
                          <td className="p-4 text-slate-700">{inTime}</td>
                          <td className="p-4 text-slate-500">{outTime}</td>
                          <td className="p-4 text-slate-400">{a.clockInIpAddress || "N/A"}</td>
                          <td className="p-4 text-emerald-600 font-bold font-sans">{a.clockInLocationName || "Self Punched"}</td>
                          <td className="p-4 font-sans">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              a.status === "Present" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                            }`}>
                              {a.status}
                            </span>
                          </td>
                          {actionCell(a, "my_attendance")}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 font-semibold italic font-sans">No attendance punch logs recorded.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Card>
          )}

          {/* TAB 10: My Leaves Ledger */}
          {activeTab === "my_leaves" && viewMode === "self" && (
            <Card className="p-0 border-slate-200 overflow-hidden bg-white shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Leave category type</th>
                    <th className="p-4">Start Date</th>
                    <th className="p-4">End Date</th>
                    <th className="p-4">Days taken</th>
                    <th className="p-4">Reason description</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center no-print">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {myLeaves.length > 0 ? (
                    myLeaves.map(l => {
                      const typeObj = leaveTypes.find(t => t.id === l.leaveTypeId);
                      return (
                        <tr key={l.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-4 font-bold text-slate-800">{typeObj ? typeObj.name : "Casual Leave"}</td>
                          <td className="p-4 font-mono text-slate-550">{l.startDate}</td>
                          <td className="p-4 font-mono text-slate-555">{l.endDate}</td>
                          <td className="p-4 font-mono">{l.totalDays} Days</td>
                          <td className="p-4 font-normal text-slate-500 max-w-xs truncate" title={l.reason}>{l.reason}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              l.status === "Approved" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                              l.status === "Pending" ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                            }`}>
                              {l.status}
                            </span>
                          </td>
                          {actionCell(l, "my_leaves")}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 font-semibold italic">No leave requests logged.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Card>
          )}

          {/* TAB 11: My Allocated Assets */}
          {activeTab === "my_assets" && viewMode === "self" && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {myAssets.map(asset => (
                <Card key={asset.id} className="border-slate-200 shadow-sm p-5 hover:border-indigo-200 transition flex flex-col justify-between h-52 bg-white">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-black text-slate-800 text-sm">{asset.name}</h3>
                        <p className="text-[10px] text-slate-400 font-mono">Serial: {asset.serialNumber}</p>
                      </div>
                      <Badge>{asset.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{asset.description || "No description provided."}</p>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">Allocated: {asset.purchaseDate}</span>
                    {/* Row-level actions directly inside ESS Card */}
                    <div className="flex items-center gap-1.5 no-print">
                      <button
                        onClick={() => handlePreview(asset, "my_assets")}
                        className="p-1 rounded bg-indigo-50 text-indigo-650 hover:bg-indigo-100 transition"
                        title="Preview"
                      >
                        <Eye className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleExportRowCSV(asset, "my_assets")}
                        className="p-1 rounded bg-emerald-50 text-emerald-650 hover:bg-emerald-100 transition"
                        title="Export CSV"
                      >
                        <Share2 className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleSingleRowPrint(asset, "my_assets")}
                        className="p-1 rounded bg-blue-50 text-blue-650 hover:bg-blue-100 transition"
                        title="Download PDF"
                      >
                        <Download className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}

              {myAssets.length === 0 && (
                <div className="col-span-full bg-white border border-slate-200 rounded-lg p-10 text-center text-slate-400 font-semibold shadow-sm">
                  You currently have no company assets allocated to your profile.
                </div>
              )}
            </div>
          )}

          {/* TAB 12: My Offboarding status */}
          {activeTab === "my_offboarding" && viewMode === "self" && (
            <Card className="p-0 border-slate-200 overflow-hidden bg-white shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Notice Date</th>
                    <th className="p-4">Exit Reason</th>
                    <th className="p-4">Requested Release Date</th>
                    <th className="p-4">Exit Type</th>
                    <th className="p-4 text-right">Status</th>
                    <th className="p-4 text-center no-print">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {myOffboardings.length > 0 ? (
                    myOffboardings.map(o => (
                      <tr key={o.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-mono text-slate-500">{o.submitDate || o.startDate}</td>
                        <td className="p-4 font-normal text-slate-650 max-w-xs truncate" title={o.description}>{o.description}</td>
                        <td className="p-4 font-mono text-slate-800">{o.endDate}</td>
                        <td className="p-4 font-bold text-slate-700">{o.type || "Resignation"}</td>
                        <td className="p-4 text-right font-sans">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            o.status === "Approved" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                            o.status === "Pending" ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        {actionCell(o, "my_offboarding")}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold italic">No exit offboarding requests submitted.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Card>
          )}

          {/* TAB 13: My Payroll Payslips history */}
          {activeTab === "my_payroll" && viewMode === "self" && (
            <Card className="p-0 border-slate-200 overflow-x-auto bg-white shadow-sm scrollbar-thin">
              <table className="min-w-[1400px] w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Cycle Month</th>
                    <th className="p-4">Basic Pay</th>
                    <th className="p-4">HRA Allow.</th>
                    <th className="p-4">Special Allow.</th>
                    <th className="p-4">Conveyance</th>
                    <th className="p-4">Medical</th>
                    <th className="p-4">LTA</th>
                    <th className="p-4">Bonus</th>
                    <th className="p-4">Incentives</th>
                    <th className="p-4">Overtime</th>
                    <th className="p-4">Reimburse.</th>
                    <th className="p-4 font-bold text-slate-900">Gross Pay</th>
                    <th className="p-4 text-rose-600">PF</th>
                    <th className="p-4 text-rose-600">ESI</th>
                    <th className="p-4 text-rose-600">PT</th>
                    <th className="p-4 text-rose-600">TDS</th>
                    <th className="p-4 font-bold text-indigo-700 text-right">Net payout</th>
                    <th className="p-4 text-center no-print">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700 font-mono">
                  {(() => {
                    if (!myProfile.id) {
                      return (
                        <tr>
                          <td colSpan={18} className="p-8 text-center text-slate-400 font-semibold italic font-sans">No payroll runs found for your account profile.</td>
                        </tr>
                      );
                    }

                    const c = resolvePayrollCalcs(myProfile);
                    return getMonthsInRange().map(m => {
                      const month = m.label;
                      const recordWithMonth = { ...myProfile, month, ...c };
                      return (
                        <tr key={month} className="hover:bg-slate-50/50 transition">
                          <td className="p-4 font-black font-sans text-slate-800">{month}</td>
                          <td className="p-4 text-slate-650">₹{c.basic.toLocaleString()}</td>
                          <td className="p-4 text-slate-650">₹{c.hra.toLocaleString()}</td>
                          <td className="p-4 text-slate-650">₹{c.specialAllowance.toLocaleString()}</td>
                          <td className="p-4 text-slate-650">₹{c.conveyance.toLocaleString()}</td>
                          <td className="p-4 text-slate-650">₹{c.medicalAllowance.toLocaleString()}</td>
                          <td className="p-4 text-slate-650">₹{c.lta.toLocaleString()}</td>
                          <td className="p-4 text-slate-650">₹{c.bonus.toLocaleString()}</td>
                          <td className="p-4 text-slate-650">₹{c.incentives.toLocaleString()}</td>
                          <td className="p-4 text-slate-650">₹{c.overtime.toLocaleString()}</td>
                          <td className="p-4 text-slate-650">₹{c.reimbursements.toLocaleString()}</td>
                          <td className="p-4 font-black text-slate-900 bg-slate-50/30">₹{c.gross.toLocaleString()}</td>
                          <td className="p-4 text-rose-600">₹{c.pf.toLocaleString()}</td>
                          <td className="p-4 text-rose-600">₹{c.esi.toLocaleString()}</td>
                          <td className="p-4 text-rose-600">₹{c.pt.toLocaleString()}</td>
                          <td className="p-4 text-rose-600">₹{c.tds.toLocaleString()}</td>
                          <td className="p-4 text-right font-black text-indigo-750 font-sans bg-indigo-50/10">₹{c.net.toLocaleString()}</td>
                          {actionCell(recordWithMonth, "my_payroll")}
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </Card>
          )}

          {/* TAB 14: My Expense Claims */}
          {activeTab === "my_expenses" && viewMode === "self" && (
            <Card className="p-0 border-slate-200 overflow-hidden bg-white shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Reference No.</th>
                    <th className="p-4">Claim date</th>
                    <th className="p-4">Description notes</th>
                    <th className="p-4">Claim Amount</th>
                    <th className="p-4 text-right">Status</th>
                    <th className="p-4 text-center no-print">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {myExpenses.length > 0 ? (
                    myExpenses.map(e => (
                      <tr key={e.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-mono font-bold text-slate-600">{e.referenceNumber || `EXP-${e.id}`}</td>
                        <td className="p-4 font-mono text-slate-500">{e.dateTime ? new Date(e.dateTime).toLocaleDateString("en-IN") : "Today"}</td>
                        <td className="p-4 font-normal text-slate-600 max-w-sm truncate" title={e.notes}>{e.notes}</td>
                        <td className="p-4 font-mono font-black text-slate-800">₹{(e.amount || 0).toLocaleString()}</td>
                        <td className="p-4 text-right font-sans">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            e.status === "Approved" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                            e.status === "Pending" ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                          }`}>
                            {e.status}
                          </span>
                        </td>
                        {actionCell(e, "my_expenses")}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold italic">No expense reimbursement claims filed.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Card>
          )}

        </div>
      </section>

      {/* ========================================== */}
      {/* PREVIEW DETAILS MODAL (SCREEN OVERLAY)     */}
      {/* ========================================== */}
      {previewModalOpen && previewRecord && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl border-slate-200 bg-white p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setPreviewModalOpen(false)}
              className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X className="size-5" />
            </button>
            <div className="border-b border-slate-150 pb-3 mb-4 flex items-center gap-2">
              <FileText className="size-5 text-indigo-500" />
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase">
                  {previewType.replace("my_", "").replace("_", " ")} Audit Record details
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">
                  Scope: {viewMode.toUpperCase()} | Generated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[60vh] pr-1 scrollbar-thin">
              {renderPreviewContent(previewRecord, previewType)}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-150 mt-5">
              <button
                onClick={() => handleExportRowCSV(previewRecord, previewType)}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 hover:bg-slate-50 transition"
              >
                <Share2 className="size-4 text-emerald-600" /> Export CSV
              </button>
              <button
                onClick={() => handleSingleRowPrint(previewRecord, previewType)}
                className="inline-flex items-center gap-1.5 rounded bg-slate-900 hover:bg-slate-800 transition px-4 py-2 text-xs font-black text-white shadow"
              >
                <Download className="size-4" /> Download PDF / Print
              </button>
            </div>
          </Card>
        </div>
      )}

    </main>

      {/* ========================================== */}
      {/* HIDDEN PRINT-ONLY LAYOUT (window.print())  */}
      {/* ========================================== */}
      {printRecord && (
        <div className="print-single-only hidden">
          <div className="border-2 border-slate-800 p-8 max-w-3xl mx-auto bg-white text-slate-850">
            <div className="flex justify-between items-center border-b-2 border-slate-800 pb-4 mb-6">
              <div>
                <h1 className="text-xl font-black text-slate-900 uppercase">{companyName}</h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">HRMS Ledger Audit Sheet</p>
              </div>
              <div className="text-right text-[10px] text-slate-400 font-mono">
                <p>Verify Code: VAL-{Math.floor(100000 + Math.random() * 900000)}</p>
                <p>Auditor email: {currentUserEmail}</p>
                <p>Timestamp: {new Date().toLocaleString()}</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1 mb-4">
                Audit Record Type: {printRecord.type.replace("my_", "").replace("_", " ").toUpperCase()}
              </h2>
              {renderPreviewContent(printRecord.record, printRecord.type)}
            </div>

            <div className="border-t border-slate-200 pt-8 flex justify-between text-[9px] text-slate-400 font-mono">
              <p>This is a system generated statutory audit certificate. No signature required.</p>
              <p className="border-t border-slate-300 w-48 text-center pt-2">Authorized Seal & Signature</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[280px_1fr]">
        <SaasSidebar active="Reports" />
        <section className="p-6 lg:p-8 flex items-center justify-center text-xs text-slate-500 font-bold font-sans">
          Loading report context...
        </section>
      </main>
    }>
      <ReportsPageContent />
    </Suspense>
  );
}
