"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SaasSidebar } from "@/components/app/saas-sidebar";
import { Badge, Card } from "@/components/ui";
import { calculateIndianPayroll } from "@bharat-hrms/domain";
import {
  Banknote,
  Calendar,
  Lock,
  Unlock,
  CheckCircle,
  FileSpreadsheet,
  Printer,
  ChevronRight,
  Eye,
  Sliders,
  DollarSign,
  Briefcase,
  AlertCircle,
  User,
  Users,
  Settings,
  Download,
  Info,
  Clock,
  X,
  FileText
} from "lucide-react";

// Indian Number-to-Words Helper (Rupees Lakhs/Crores formatting)
function numberToIndianWords(num: number): string {
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function numToWords(n: number, s: string): string {
    let str = '';
    if (n > 19) {
      str += b[Math.floor(n / 10)] + ' ' + a[n % 10];
    } else {
      str += a[n];
    }
    if (n) {
      str += s;
    }
    return str;
  }

  let amount = Math.floor(num);
  let words = '';
  words += numToWords(Math.floor(amount / 10000000), ' Crore ');
  words += numToWords(Math.floor((amount / 100000) % 100), ' Lakh ');
  words += numToWords(Math.floor((amount / 1000) % 100), ' Thousand ');
  words += numToWords(Math.floor((amount / 100) % 10), ' Hundred ');

  let remainder = amount % 100;
  if (remainder > 0) {
    if (words !== '') words += 'and ';
    if (remainder > 19) {
      words += b[Math.floor(remainder / 10)] + ' ' + a[remainder % 10];
    } else {
      words += a[remainder];
    }
  }

  return words.trim() ? 'Rupees ' + words.trim() + ' Only' : 'Rupees Zero';
}

export default function PayrollPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("May");
  const [selectedYear, setSelectedYear] = useState("2026");
  
  // Payroll session state
  const [processedRecords, setProcessedRecords] = useState<Record<string, any>>({});
  const [payrollLocked, setPayrollLocked] = useState(false);

  // Modal control states
  const [processModalOpen, setProcessModalOpen] = useState(false);
  const [activeEmployee, setActiveEmployee] = useState<any | null>(null);

  // Payslip Modal states
  const [payslipModalOpen, setPayslipModalOpen] = useState(false);
  const [payslipRecord, setPayslipRecord] = useState<any | null>(null);

  // Dynamic Process inputs
  const [lopDays, setLopDays] = useState(0);
  const [monthDays, setMonthDays] = useState(31);
  const [taxRegime, setTaxRegime] = useState<"NEW" | "OLD">("NEW");
  const [stateName, setStateName] = useState("Maharashtra");
  const [bonus, setBonus] = useState(0);
  const [incentives, setIncentives] = useState(0);
  const [overtime, setOvertime] = useState(0);
  const [reimbursements, setReimbursements] = useState(0);

  // Calculated state
  const [liveBreakdown, setLiveBreakdown] = useState<any>(null);

  // Default company info
  const [companyName, setCompanyName] = useState("Hrmifly SaaS");

  // Tab switcher state
  const [activeTab, setActiveTab] = useState<"ledger" | "components">("ledger");

  // Custom components CRUD states
  const [customComponents, setCustomComponents] = useState<any[]>([]);
  const [componentModalOpen, setComponentModalOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState<any | null>(null);
  const [compName, setCompName] = useState("");
  const [compType, setCompType] = useState<"earning" | "deduction">("earning");
  const [compAmount, setCompAmount] = useState(0);
  const [compDesc, setCompDesc] = useState("");

  // Process Modal custom value mapping componentId -> overridden amount
  const [customValues, setCustomValues] = useState<Record<string, number>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userType = localStorage.getItem("session_user_type");
      if (userType !== "company") {
        router.push("/login?tab=company");
        return;
      }

      // Load company
      const companyStr = localStorage.getItem("session_company");
      if (companyStr) {
        const co = JSON.parse(companyStr);
        setCompanyName(co.name || "Hrmifly SaaS");
      }

      // Load employees
      const storedEmployees = localStorage.getItem("employees");
      if (storedEmployees) {
        setEmployees(JSON.parse(storedEmployees));
      } else {
        // Fallback
        setEmployees([]);
      }

      // Load processed payroll for current month/year
      const storageKey = `processed_payroll_${selectedMonth}_${selectedYear}`;
      const storedPayroll = localStorage.getItem(storageKey);
      if (storedPayroll) {
        setProcessedRecords(JSON.parse(storedPayroll));
      } else {
        setProcessedRecords({});
      }

      // Load lock state
      const lockKey = `payroll_lock_${selectedMonth}_${selectedYear}`;
      const locked = localStorage.getItem(lockKey) === "true";
      setPayrollLocked(locked);

      // Load custom salary components
      const storedComponents = localStorage.getItem("custom_salary_components");
      if (storedComponents) {
        setCustomComponents(JSON.parse(storedComponents));
      } else {
        const defaults = [
          { id: "comp-1", name: "Internet & Phone Allowance", type: "earning", defaultAmount: 1500, description: "Monthly mobile/broadband reimbursement" },
          { id: "comp-2", name: "Travel Allowance", type: "earning", defaultAmount: 2000, description: "Conveyance helper for offsite meetings" },
          { id: "comp-3", name: "Gym Membership", type: "earning", defaultAmount: 1000, description: "Health and wellness benefit allowance" },
          { id: "comp-4", name: "Voluntary Provident Fund (VPF)", type: "deduction", defaultAmount: 0, description: "Voluntary employee contribution to PF" },
          { id: "comp-5", name: "Salary Advance Recovery", type: "deduction", defaultAmount: 0, description: "Deduction for advance salary taken previously" }
        ];
        localStorage.setItem("custom_salary_components", JSON.stringify(defaults));
        setCustomComponents(defaults);
      }
    }
  }, [router, selectedMonth, selectedYear]);

  // Recalculate live payroll when inputs change
  useEffect(() => {
    if (!activeEmployee) return;

    const baseSalary = activeEmployee.salary || {};
    const paidDays = Math.max(0, monthDays - lopDays);

    const customEarnings = customComponents
      .filter((c) => c.type === "earning")
      .map((c) => ({
        id: c.id,
        name: c.name,
        amount: Number(customValues[c.id] ?? c.defaultAmount)
      }));

    const customDeductions = customComponents
      .filter((c) => c.type === "deduction")
      .map((c) => ({
        id: c.id,
        name: c.name,
        amount: Number(customValues[c.id] ?? c.defaultAmount)
      }));

    const inputData = {
      tenantId: "tenant-demo",
      employeeId: activeEmployee.id,
      state: stateName,
      taxRegime: taxRegime,
      basic: baseSalary.basic || 0,
      hra: baseSalary.hra || 0,
      specialAllowance: baseSalary.specialAllowance || 0,
      conveyance: baseSalary.conveyance || 0,
      medicalAllowance: baseSalary.medicalAllowance || 0,
      lta: baseSalary.lta || 0,
      bonus: Number(bonus),
      incentives: Number(incentives),
      overtime: Number(overtime),
      reimbursements: Number(reimbursements),
      otherDeductions: 0,
      lopDays: Number(lopDays),
      paidDays: paidDays,
      monthDays: monthDays,
      customEarnings,
      customDeductions
    };

    try {
      const result = calculateIndianPayroll(inputData);
      setLiveBreakdown({
        input: inputData,
        calculations: result,
        customValues,
        customComponents
      });
    } catch (e) {
      console.error("Calculation error:", e);
    }
  }, [activeEmployee, lopDays, monthDays, taxRegime, stateName, bonus, incentives, overtime, reimbursements, customValues, customComponents]);

  const openProcessModal = (employee: any) => {
    if (payrollLocked) return;
    setActiveEmployee(employee);
    
    // Load previously processed inputs if any
    const record = processedRecords[employee.id];
    setLopDays(record?.input?.lopDays ?? 0);
    setMonthDays(record?.input?.monthDays ?? 31);
    setTaxRegime(record?.input?.taxRegime ?? "NEW");
    setStateName(record?.input?.state ?? employee.location ?? "Maharashtra");
    setBonus(record?.input?.bonus ?? 0);
    setIncentives(record?.input?.incentives ?? 0);
    setOvertime(record?.input?.overtime ?? 0);
    setReimbursements(record?.input?.reimbursements ?? 0);

    // Build values mapping using component default or previous overridden amount
    const initialValues: Record<string, number> = {};
    customComponents.forEach((comp) => {
      if (record?.customValues && record.customValues[comp.id] !== undefined) {
        initialValues[comp.id] = record.customValues[comp.id];
      } else {
        initialValues[comp.id] = comp.defaultAmount;
      }
    });
    setCustomValues(initialValues);
    setProcessModalOpen(true);
  };

  // Custom Components CRUD operations
  const openAddComponent = () => {
    setActiveComponent(null);
    setCompName("");
    setCompType("earning");
    setCompAmount(0);
    setCompDesc("");
    setComponentModalOpen(true);
  };

  const openEditComponent = (comp: any) => {
    setActiveComponent(comp);
    setCompName(comp.name);
    setCompType(comp.type);
    setCompAmount(comp.defaultAmount);
    setCompDesc(comp.description || "");
    setComponentModalOpen(true);
  };

  const handleSaveComponent = () => {
    if (!compName.trim()) {
      alert("Please provide a component name.");
      return;
    }

    let updated: any[];
    if (activeComponent) {
      updated = customComponents.map((c) =>
        c.id === activeComponent.id
          ? { ...c, name: compName.trim(), type: compType, defaultAmount: Number(compAmount), description: compDesc.trim() }
          : c
      );
    } else {
      const newComp = {
        id: `comp-${Date.now()}`,
        name: compName.trim(),
        type: compType,
        defaultAmount: Number(compAmount),
        description: compDesc.trim()
      };
      updated = [...customComponents, newComp];
    }

    setCustomComponents(updated);
    localStorage.setItem("custom_salary_components", JSON.stringify(updated));
    setComponentModalOpen(false);
  };

  const handleDeleteComponent = (id: string) => {
    if (confirm("Are you sure you want to delete this custom component?")) {
      const updated = customComponents.filter((c) => c.id !== id);
      setCustomComponents(updated);
      localStorage.setItem("custom_salary_components", JSON.stringify(updated));
    }
  };

  const handleSaveProcess = () => {
    if (!activeEmployee || !liveBreakdown) return;

    const storageKey = `processed_payroll_${selectedMonth}_${selectedYear}`;
    const updated = {
      ...processedRecords,
      [activeEmployee.id]: liveBreakdown
    };

    setProcessedRecords(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    // Also auto-save to Employee Documents Module
    try {
      const storedDocs = localStorage.getItem("hrms_employee_documents");
      const currentDocs = storedDocs ? JSON.parse(storedDocs) : [];
      const docTitle = `Payslip - ${selectedMonth} ${selectedYear}`;
      
      const existingIndex = currentDocs.findIndex(
        (d: any) => d.employeeId === activeEmployee.id && d.title === docTitle && d.type === "Payslip"
      );

      const newDoc = {
        id: existingIndex >= 0 ? currentDocs[existingIndex].id : (currentDocs.length > 0 ? Math.max(...currentDocs.map((d: any) => d.id)) + 1 : 1),
        employeeId: activeEmployee.id,
        title: docTitle,
        date: new Date().toISOString().split("T")[0],
        type: "Payslip",
        fileSize: "18 KB",
        isGenerated: true,
        isPayslip: true,
        payroll: liveBreakdown,
        selectedMonth,
        selectedYear,
        fileName: `Payslip_${selectedMonth}_${selectedYear}.pdf`
      };

      if (existingIndex >= 0) {
        currentDocs[existingIndex] = newDoc;
      } else {
        currentDocs.unshift(newDoc);
      }
      localStorage.setItem("hrms_employee_documents", JSON.stringify(currentDocs));
    } catch (e) {
      console.error("Failed to auto-save payslip to employee documents:", e);
    }

    setProcessModalOpen(false);
  };

  const handleToggleLock = () => {
    const lockKey = `payroll_lock_${selectedMonth}_${selectedYear}`;
    const nextState = !payrollLocked;
    setPayrollLocked(nextState);
    localStorage.setItem(lockKey, String(nextState));
  };

  const handleOpenPayslip = (employeeId: string) => {
    const record = processedRecords[employeeId];
    if (record) {
      // Fetch full employee info to merge
      const emp = employees.find((e) => e.id === employeeId);
      setPayslipRecord({
        employee: emp,
        payroll: record
      });
      setPayslipModalOpen(true);
    }
  };

  const handlePrint = () => {
    if (!payslipRecord) return;
    const printContent = document.getElementById("payslip-card-content");
    if (!printContent) return;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Payslip_${payslipRecord.employee?.fullName || 'Employee'}</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800;900&display=swap');
            
            @page {
              size: A4;
              margin: 0;
            }
            
            body {
              margin: 0;
              padding: 0;
              font-family: 'Inter', sans-serif;
              color: #1e293b;
              background-color: #ffffff;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            .page {
              position: relative;
              width: 210mm;
              height: 297mm;
              box-sizing: border-box;
              padding: 40mm 20mm 35mm 20mm;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            
            .top-bar {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 8mm;
              background-color: #38a834;
            }
            
            .header {
              position: absolute;
              top: 12mm;
              left: 20mm;
              right: 20mm;
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid #f1f5f9;
              padding-bottom: 4mm;
              width: calc(100% - 40mm);
            }
            
            .logo-container {
              display: flex;
              flex-direction: column;
              align-items: flex-end;
            }
            
            .logo-text {
              display: flex;
              align-items: center;
              font-weight: 800;
              font-size: 20px;
              line-height: 1;
              letter-spacing: -0.5px;
            }
            
            .logo-im { color: #f15a24; }
            .logo-xp { color: #0071bc; }
            .logo-rt { color: #0071bc; }
            .logo-ex { color: #8cc63f; }
            
            .logo-globe {
              display: inline-block;
              width: 20px;
              height: 20px;
              margin: 0 2px;
            }
            
            .tagline {
              font-weight: 900;
              font-size: 5px;
              color: #0071bc;
              letter-spacing: 1.5px;
              text-transform: uppercase;
              margin-top: 4px;
            }
            
            .content-area {
              flex-grow: 1;
              margin-top: 10mm;
            }
            
            .footer {
              position: absolute;
              bottom: 12mm;
              left: 20mm;
              right: 20mm;
              text-align: center;
              width: calc(100% - 40mm);
            }
            
            .footer-line {
              width: 100%;
              height: 1.5px;
              background-color: #f58220;
              margin-bottom: 6px;
            }
            
            .footer-company {
              font-weight: 800;
              font-size: 10px;
              letter-spacing: 0.5px;
              text-transform: uppercase;
              margin: 0 0 3px 0;
            }
            
            .fc-im { color: #f15a24; }
            .fc-xport { color: #0071bc; }
            .fc-ex { color: #8cc63f; }
            .fc-eworld { color: #0071bc; }
            
            .footer-address {
              font-weight: 500;
              font-size: 8px;
              color: #475569;
              margin: 0 0 3px 0;
            }
            
            .footer-contact {
              font-weight: 700;
              font-size: 8px;
              color: #94a3b8;
              margin: 0;
            }
            
            .footer-link {
              color: #0071bc;
              text-decoration: underline;
              font-weight: 400;
            }
            
            .bottom-bar {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 12mm;
              background-color: #38a834;
            }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="top-bar"></div>
            
            <div class="header">
              <div>
                <h2 class="text-base font-black text-slate-950 uppercase tracking-wide">PAYSLIP</h2>
                <p class="font-extrabold text-xs text-slate-500 mt-0.5">For ${selectedMonth} ${selectedYear}</p>
              </div>
              <div class="logo-container">
                <div class="logo-text">
                  <span class="logo-im">im</span>
                  <span class="logo-xp">xp</span>
                  <svg class="logo-globe" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" fill="#0071bc" />
                    <ellipse cx="50" cy="50" rx="44" ry="16" stroke="#ffffff" stroke-width="4" fill="none" opacity="0.8" />
                    <ellipse cx="50" cy="50" rx="16" ry="44" stroke="#ffffff" stroke-width="4" fill="none" opacity="0.8" />
                    <line x1="6" y1="50" x2="94" y2="50" stroke="#ffffff" stroke-width="4" opacity="0.8" />
                    <line x1="50" y1="6" x2="50" y2="94" stroke="#ffffff" stroke-width="4" opacity="0.8" />
                    <path d="M15 75 C10 40, 40 10, 75 15 C90 20, 95 35, 90 50 C85 65, 70 85, 45 88" stroke="#8cc63f" stroke-width="8" stroke-linecap="round" fill="none" />
                    <path d="M35 83 L47 90 L40 76 Z" fill="#8cc63f" />
                  </svg>
                  <span class="logo-rt">rt</span>
                  <span class="logo-ex">ex</span>
                </div>
                <div class="tagline">Global Reach | Global Presence</div>
              </div>
            </div>
            
            <div class="content-area">
              ${printContent.innerHTML}
            </div>
            
            <div class="footer">
              <div class="footer-line"></div>
              <p class="footer-company">
                <span class="fc-im">IM</span><span class="fc-xport">XPORT</span><span class="fc-ex">EX</span> <span class="fc-eworld">EWORLD PRIVATE LIMTED</span>
              </p>
              <p class="footer-address">1-11-251/11, RKP MANSION, BEGUMPET, HYDERABAD – 500016</p>
              <p class="footer-contact">
                Email: <span class="footer-link">info@imxportex.com</span> Web: <span class="footer-link">www.imxportex.com</span>
              </p>
            </div>
            
            <div class="bottom-bar"></div>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
        </html>
      `);
      doc.close();
      
      setTimeout(() => {
        iframe.contentWindow?.focus();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1500);
      }, 500);
    }
  };

  // Aggregated metrics
  const processedCount = Object.keys(processedRecords).length;
  const totalEmployees = employees.length;

  let totalNetPay = 0;
  let totalDeductions = 0;
  let totalCtc = 0;

  Object.values(processedRecords).forEach((rec: any) => {
    const c = rec.calculations || {};
    totalNetPay += c.netPay || 0;
    totalDeductions += c.totalDeductions || 0;
    totalCtc += c.ctcCost || 0;
  });

  // Export salary register CSV
  const handleExportCSV = () => {
    if (processedCount === 0) {
      alert("No processed records available to export.");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Employee ID,Name,Department,Paid Days,LOP Days,Regime,Gross Earnings,PF (Employee),ESI (Employee),PT,TDS,LWF,Total Deductions,Net Pay,Employer Cost (CTC)\n";

    Object.keys(processedRecords).forEach((empId) => {
      const rec = processedRecords[empId];
      const emp = employees.find((e) => e.id === empId);
      const c = rec.calculations;
      const inp = rec.input;

      csvContent += `${empId},"${emp?.fullName}","${emp?.department}",${inp.paidDays},${inp.lopDays},${inp.taxRegime},${c.grossEarnings},${c.employeePf},${c.employeeEsi},${c.professionalTax},${c.estimatedTds},${c.labourWelfareFund},${c.totalDeductions},${c.netPay},${c.ctcCost}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Salary_Register_${selectedMonth}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[280px_1fr]">
      <SaasSidebar active="Payroll" />

      <section className="p-6 lg:p-8 overflow-y-auto">
        {/* Header Section */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white -mx-6 -mt-6 p-6 lg:-mx-8 lg:-mt-8 shadow-sm">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Indian Payroll processing command</h2>
            <p className="mt-1 text-sm text-slate-500">Calculate employee salaries, professional tax (PT), provident fund (PF), ESIC insurance, and monthly TDS.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={"/dashboard/reports?tab=payroll" as any}
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 shadow hover:bg-slate-50 transition"
            >
              <FileText className="size-4 text-indigo-500" /> View Payroll Reports
            </Link>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition"
            >
              <FileSpreadsheet className="size-4 text-emerald-600" /> Export Salary Register
            </button>
            <button
              onClick={handleToggleLock}
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-xs font-black text-white shadow transition ${
                payrollLocked ? "bg-amber-600 hover:bg-amber-700" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {payrollLocked ? (
                <>
                  <Unlock className="size-4" /> Unlock Monthly Payroll
                </>
              ) : (
                <>
                  <Lock className="size-4" /> Lock Monthly Payroll
                </>
              )}
            </button>
          </div>
        </header>

        {/* Configurations selector and Quick Stats */}
        <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] mb-6">
          {/* Period Selector Card */}
          <Card className="border-slate-200 shadow-sm flex flex-col justify-between p-5">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Select Processing Period</h3>
              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-1 text-xs font-bold text-slate-500">
                  Month
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="h-10 rounded border border-slate-200 px-2 bg-white text-slate-700 outline-none"
                  >
                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m) => (
                      <option key={m} value={m.slice(0, 3)}>
                        {m}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1 text-xs font-bold text-slate-500">
                  Year
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="h-10 rounded border border-slate-200 px-2 bg-white text-slate-700 outline-none"
                  >
                    {["2025", "2026", "2027"].map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4 flex items-center gap-3">
              {payrollLocked ? (
                <div className="flex items-center gap-2 rounded bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-2 w-full font-bold">
                  <Lock className="size-4 shrink-0" />
                  <span>Payroll is LOCKED for {selectedMonth} {selectedYear}. Adjustments are disabled.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-2 w-full font-bold">
                  <Unlock className="size-4 shrink-0" />
                  <span>Payroll processing is ACTIVE. Run, recalculate, or review employee files.</span>
                </div>
              )}
            </div>
          </Card>

          {/* Quick stats Card */}
          <Card className="border-slate-200 shadow-sm p-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Financial Summary ({selectedMonth} {selectedYear})</h3>
            <div className="grid gap-4 grid-cols-3">
              <div className="bg-slate-50 border border-slate-150 rounded p-4 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Processed Net Pay</p>
                <p className="text-xl font-black text-slate-900 mt-1">₹{totalNetPay.toLocaleString('en-IN')}</p>
                <span className="text-[10px] text-slate-500 font-bold block mt-1">{processedCount} of {totalEmployees} processed</span>
              </div>
              <div className="bg-slate-50 border border-slate-150 rounded p-4 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Deductions</p>
                <p className="text-xl font-black text-slate-900 mt-1">₹{totalDeductions.toLocaleString('en-IN')}</p>
                <span className="text-[10px] text-slate-500 font-bold block mt-1">PF, ESIC, Tax & TDS</span>
              </div>
              <div className="bg-slate-50 border border-slate-150 rounded p-4 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated CTC Cost</p>
                <p className="text-xl font-black text-indigo-600 mt-1">₹{totalCtc.toLocaleString('en-IN')}</p>
                <span className="text-[10px] text-slate-500 font-bold block mt-1">Gross + Employer shares</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs Switcher for Ledger and Settings */}
        <div className="flex border-b border-slate-200 mb-6 bg-white rounded-lg p-1.5 shadow-sm max-w-md">
          <button
            onClick={() => setActiveTab("ledger")}
            className={`flex-1 text-center py-2.5 rounded-md text-xs font-black transition flex items-center justify-center gap-2 ${
              activeTab === "ledger"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <Users className="size-4" />
            Staff Compensation Ledger
          </button>
          <button
            onClick={() => setActiveTab("components")}
            className={`flex-1 text-center py-2.5 rounded-md text-xs font-black transition flex items-center justify-center gap-2 ${
              activeTab === "components"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <Settings className="size-4" />
            Manage Salary Components
          </button>
        </div>

        {/* Employees Payroll Checklist */}
        {activeTab === "ledger" && (
          <Card className="border-slate-200 shadow-sm overflow-hidden p-0">
          <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800">Staff Compensation Ledger</h3>
            <Badge>{processedCount} / {totalEmployees} Calculations Processed</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Employee</th>
                  <th className="p-4">Base Basic Salary</th>
                  <th className="p-4">Month Stats</th>
                  <th className="p-4">Processed Gross</th>
                  <th className="p-4">Deductions Breakdown</th>
                  <th className="p-4">Net Payout</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {employees.length > 0 ? (
                  employees.map((emp) => {
                    const record = processedRecords[emp.id];
                    const isProcessed = !!record;
                    const c = record?.calculations || {};
                    const inp = record?.input || {};
                    
                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="grid size-9 place-items-center rounded-full bg-slate-100 font-bold text-slate-700 text-sm">
                              {emp.fullName.slice(0, 1).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{emp.fullName}</p>
                              <p className="text-[10px] text-slate-400 font-mono">Code: {emp.id} • {emp.designation}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-slate-800">₹{(emp.salary?.basic || 0).toLocaleString('en-IN')}</p>
                          <span className="text-[9px] text-slate-400 block font-medium">Fixed basic structure</span>
                        </td>
                        <td className="p-4">
                          {isProcessed ? (
                            <div>
                              <p className="text-slate-800">{inp.paidDays} Paid Days</p>
                              {inp.lopDays > 0 && <span className="text-[10px] text-rose-500 font-bold">{inp.lopDays} LOP Days</span>}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Not processed yet</span>
                          )}
                        </td>
                        <td className="p-4">
                          {isProcessed ? (
                            <p className="font-bold text-slate-800">₹{c.grossEarnings.toLocaleString('en-IN')}</p>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="p-4">
                          {isProcessed ? (
                            <div className="flex flex-wrap gap-1 text-[9px] max-w-[200px]">
                              <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold">PF: ₹{c.employeePf}</span>
                              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">ESI: ₹{c.employeeEsi}</span>
                              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">PT: ₹{c.professionalTax}</span>
                              {c.estimatedTds > 0 && <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-bold">TDS: ₹{c.estimatedTds}</span>}
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="p-4">
                          {isProcessed ? (
                            <div>
                              <p className="font-black text-emerald-600 text-sm">₹{c.netPay.toLocaleString('en-IN')}</p>
                              <span className="inline-flex rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 mt-0.5 text-[9px] font-extrabold uppercase px-1.5 py-0.5">PROCESSED</span>
                            </div>
                          ) : (
                            <span className="inline-flex rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-extrabold uppercase px-1.5 py-0.5">PENDING</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openProcessModal(emp)}
                              disabled={payrollLocked}
                              className={`rounded text-xs font-bold px-3 py-1.5 border transition ${
                                isProcessed
                                  ? "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 disabled:opacity-50"
                                  : "bg-indigo-600 hover:bg-indigo-700 text-white border-transparent disabled:opacity-50 shadow-sm"
                              }`}
                            >
                              <Sliders className="size-3.5 inline mr-1" />
                              {isProcessed ? "Re-Process" : "Process Salary"}
                            </button>
                            {isProcessed && (
                              <button
                                onClick={() => handleOpenPayslip(emp.id)}
                                className="rounded bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-slate-500 hover:text-emerald-700 transition px-3 py-1.5 text-xs font-bold"
                              >
                                <Eye className="size-3.5 inline mr-1" />
                                Payslip
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 font-semibold">
                      Please register employees in the "Employee Master Directory" before processing payroll.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
        )}

        {/* Custom Components CRUD Panel */}
        {activeTab === "components" && (
          <Card className="border-slate-200 shadow-sm p-6 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <div>
                <h3 className="text-base font-black text-slate-800">Custom Salary Components</h3>
                <p className="text-xs text-slate-400 mt-1">Configure custom allowances and deductions that dynamically affect payslip calculations.</p>
              </div>
              <button
                onClick={openAddComponent}
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-xs font-black text-white shadow-sm transition"
              >
                + Add Custom Component
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Component Name</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Default Monthly Amount</th>
                    <th className="p-4">Description</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {customComponents.length > 0 ? (
                    customComponents.map((comp) => (
                      <tr key={comp.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-bold text-slate-900">{comp.name}</td>
                        <td className="p-4">
                          {comp.type === "earning" ? (
                            <span className="inline-flex rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold uppercase px-2 py-0.5">
                              EARNING
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-extrabold uppercase px-2 py-0.5">
                              DEDUCTION
                            </span>
                          )}
                        </td>
                        <td className="p-4 font-bold text-slate-800">₹{comp.defaultAmount.toLocaleString('en-IN')}</td>
                        <td className="p-4 text-slate-400 font-medium">{comp.description || "-"}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEditComponent(comp)}
                              className="rounded border border-slate-250 bg-white hover:bg-slate-50 text-slate-600 transition px-2.5 py-1.5 text-xs font-bold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteComponent(comp.id)}
                              className="rounded border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 transition px-2.5 py-1.5 text-xs font-bold"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 font-semibold italic">
                        No custom components defined yet. Click "Add Custom Component" to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Component CRUD Modal */}
        {componentModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col">
              <div className="bg-slate-950 p-5 text-white flex items-center justify-between">
                <h3 className="text-sm font-black">{activeComponent ? "Edit Salary Component" : "Add Custom Salary Component"}</h3>
                <button
                  onClick={() => setComponentModalOpen(false)}
                  className="rounded bg-slate-800 hover:bg-slate-700 p-1.5 transition text-slate-400 hover:text-white"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <label className="grid gap-1 font-bold text-slate-500">
                  Component Name
                  <input
                    type="text"
                    value={compName}
                    onChange={(e) => setCompName(e.target.value)}
                    className="h-10 rounded border border-slate-200 px-3 outline-none focus:border-indigo-500 bg-white text-slate-800"
                    placeholder="e.g. Remote Work Allowance"
                  />
                </label>

                <label className="grid gap-1 font-bold text-slate-500">
                  Type
                  <select
                    value={compType}
                    onChange={(e) => setCompType(e.target.value as "earning" | "deduction")}
                    className="h-10 rounded border border-slate-200 px-2 bg-white text-slate-800 outline-none focus:border-indigo-500"
                  >
                    <option value="earning">Earning (Addition to Gross)</option>
                    <option value="deduction">Deduction (Subtraction from Net)</option>
                  </select>
                </label>

                <label className="grid gap-1 font-bold text-slate-500">
                  Default Monthly Amount (INR)
                  <input
                    type="number"
                    value={compAmount}
                    onChange={(e) => setCompAmount(Number(e.target.value))}
                    className="h-10 rounded border border-slate-200 px-3 outline-none focus:border-indigo-500 bg-white text-slate-800"
                    min={0}
                  />
                </label>

                <label className="grid gap-1 font-bold text-slate-500">
                  Description
                  <textarea
                    value={compDesc}
                    onChange={(e) => setCompDesc(e.target.value)}
                    className="h-20 rounded border border-slate-200 p-3 outline-none focus:border-indigo-500 bg-white text-slate-800 resize-none"
                    placeholder="Brief description of the component..."
                  />
                </label>
              </div>

              <div className="bg-slate-50 p-4 flex justify-end gap-2 border-t border-slate-150">
                <button
                  onClick={() => setComponentModalOpen(false)}
                  className="rounded border border-slate-300 bg-white hover:bg-slate-100 transition px-4 py-2 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveComponent}
                  className="rounded bg-indigo-600 hover:bg-indigo-700 text-white transition px-5 py-2 font-black shadow-sm"
                >
                  Save Component
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Payroll Calculation Modal */}
        {processModalOpen && activeEmployee && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="bg-slate-950 p-5 text-white flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-base font-black">Process Monthly Compensation</h3>
                  <p className="text-xs text-slate-400 mt-1">Configure paid days, allowances, and regimes for {activeEmployee.fullName} ({activeEmployee.id})</p>
                </div>
                <button
                  onClick={() => setProcessModalOpen(false)}
                  className="rounded bg-slate-800 hover:bg-slate-700 p-1.5 transition text-slate-400 hover:text-white"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Grid content */}
              <div className="flex-1 overflow-y-auto p-6 grid gap-6 md:grid-cols-[1fr_1.1fr] text-xs">
                {/* Inputs Left Column */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1.5">1. Attendance & Tax Setup</h4>
                  
                  <div className="grid gap-3 grid-cols-2">
                    <label className="grid gap-1 font-bold text-slate-500">
                      Total Month Days
                      <input
                        type="number"
                        value={monthDays}
                        onChange={(e) => setMonthDays(Number(e.target.value))}
                        className="h-10 rounded border border-slate-200 px-3 outline-none focus:border-indigo-500 bg-slate-50 text-slate-600 font-bold"
                      />
                    </label>
                    <label className="grid gap-1 font-bold text-slate-500">
                      Loss-of-Pay (LOP) Days
                      <input
                        type="number"
                        value={lopDays}
                        onChange={(e) => setLopDays(Number(e.target.value))}
                        className="h-10 rounded border border-slate-200 px-3 outline-none focus:border-indigo-500 bg-white font-bold text-slate-800"
                        min={0}
                        max={monthDays}
                      />
                    </label>
                  </div>

                  <div className="grid gap-3 grid-cols-2">
                    <label className="grid gap-1 font-bold text-slate-500">
                      Tax Compliance Regime
                      <select
                        value={taxRegime}
                        onChange={(e) => setTaxRegime(e.target.value as "NEW" | "OLD")}
                        className="h-10 rounded border border-slate-200 px-2 bg-white text-slate-700 outline-none focus:border-indigo-500"
                      >
                        <option value="NEW">New Tax Regime (Sec 115BAC)</option>
                        <option value="OLD">Old Tax Regime (With Slabs)</option>
                      </select>
                    </label>
                    <label className="grid gap-1 font-bold text-slate-500">
                      PT State Slab
                      <select
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className="h-10 rounded border border-slate-200 px-2 bg-white text-slate-700 outline-none focus:border-indigo-500"
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
                  </div>

                  <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1.5 mt-5">2. Variable Earnings & Additions</h4>
                  
                  <div className="grid gap-3 grid-cols-2">
                    <label className="grid gap-1 font-bold text-slate-500">
                      Performance Bonus (INR)
                      <input
                        type="number"
                        value={bonus}
                        onChange={(e) => setBonus(Number(e.target.value))}
                        className="h-10 rounded border border-slate-200 px-3 outline-none focus:border-indigo-500 bg-white"
                      />
                    </label>
                    <label className="grid gap-1 font-bold text-slate-500">
                      Sales Incentives (INR)
                      <input
                        type="number"
                        value={incentives}
                        onChange={(e) => setIncentives(Number(e.target.value))}
                        className="h-10 rounded border border-slate-200 px-3 outline-none focus:border-indigo-500 bg-white"
                      />
                    </label>
                  </div>

                  <div className="grid gap-3 grid-cols-2">
                    <label className="grid gap-1 font-bold text-slate-500">
                      Overtime Payout (INR)
                      <input
                        type="number"
                        value={overtime}
                        onChange={(e) => setOvertime(Number(e.target.value))}
                        className="h-10 rounded border border-slate-200 px-3 outline-none focus:border-indigo-500 bg-white"
                      />
                    </label>
                    <label className="grid gap-1 font-bold text-slate-500">
                      Tax-Free Reimbursements
                      <input
                        type="number"
                        value={reimbursements}
                        onChange={(e) => setReimbursements(Number(e.target.value))}
                        className="h-10 rounded border border-slate-200 px-3 outline-none focus:border-indigo-500 bg-white"
                      />
                    </label>
                  </div>

                  <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1.5 mt-5">3. Custom Earnings & Deductions</h4>
                  {customComponents.length > 0 ? (
                    <div className="grid gap-3 grid-cols-2">
                      {customComponents.map((comp) => (
                        <label key={comp.id} className="grid gap-1 font-bold text-slate-500">
                          {comp.name} ({comp.type === "earning" ? "INR Earning" : "INR Deduction"})
                          <input
                            type="number"
                            value={customValues[comp.id] ?? 0}
                            onChange={(e) => setCustomValues({ ...customValues, [comp.id]: Number(e.target.value) })}
                            className="h-10 rounded border border-slate-200 px-3 outline-none focus:border-indigo-500 bg-white"
                          />
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic">No custom components defined. Add them in the "Manage Salary Components" tab.</p>
                  )}
                </div>

                {/* Calculations Results Right Column */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Dynamic Calculation Sheet</h4>
                      <span className="inline-flex rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold px-2 py-0.5">
                        Paid Days: {monthDays - lopDays} / {monthDays}
                      </span>
                    </div>

                    {liveBreakdown && (
                      <div className="space-y-4">
                        {/* Summary Metrics */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-white p-3 rounded border border-slate-150">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gross Earnings</span>
                            <span className="text-lg font-black text-slate-900">₹{liveBreakdown.calculations.grossEarnings.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="bg-white p-3 rounded border border-slate-150">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Net Take-Home</span>
                            <span className="text-lg font-black text-emerald-600">₹{liveBreakdown.calculations.netPay.toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        {/* Breakdown tables */}
                        <div className="grid grid-cols-2 gap-4">
                          {/* Earnings side */}
                          <div>
                            <p className="font-bold text-slate-800 uppercase text-[9px] mb-1.5 border-b border-slate-200 pb-1">Earnings (Prorated)</p>
                            <div className="space-y-1 text-[10px]">
                              <div className="flex justify-between">
                                <span className="text-slate-500">Basic Pay</span>
                                <span>₹{(Math.round(liveBreakdown.input.basic * (liveBreakdown.input.paidDays / liveBreakdown.input.monthDays) * 100)/100).toLocaleString('en-IN')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">HRA Allowance</span>
                                <span>₹{(Math.round(liveBreakdown.input.hra * (liveBreakdown.input.paidDays / liveBreakdown.input.monthDays) * 100)/100).toLocaleString('en-IN')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Special Allow.</span>
                                <span>₹{(Math.round(liveBreakdown.input.specialAllowance * (liveBreakdown.input.paidDays / liveBreakdown.input.monthDays) * 100)/100).toLocaleString('en-IN')}</span>
                              </div>
                              {liveBreakdown.input.conveyance > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Conveyance</span>
                                  <span>₹{(Math.round(liveBreakdown.input.conveyance * (liveBreakdown.input.paidDays / liveBreakdown.input.monthDays) * 100)/100).toLocaleString('en-IN')}</span>
                                </div>
                              )}
                              {liveBreakdown.input.medicalAllowance > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Medical Allow.</span>
                                  <span>₹{(Math.round(liveBreakdown.input.medicalAllowance * (liveBreakdown.input.paidDays / liveBreakdown.input.monthDays) * 100)/100).toLocaleString('en-IN')}</span>
                                </div>
                              )}
                              {liveBreakdown.input.lta > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-slate-500">LTA Allowance</span>
                                  <span>₹{(Math.round(liveBreakdown.input.lta * (liveBreakdown.input.paidDays / liveBreakdown.input.monthDays) * 100)/100).toLocaleString('en-IN')}</span>
                                </div>
                              )}
                              {bonus > 0 && <div className="flex justify-between font-bold text-indigo-600"><span>Bonus</span><span>₹{bonus}</span></div>}
                              {incentives > 0 && <div className="flex justify-between font-bold text-indigo-600"><span>Incentives</span><span>₹{incentives}</span></div>}
                              {reimbursements > 0 && <div className="flex justify-between"><span>Reimburse.</span><span>₹{reimbursements}</span></div>}
                              {liveBreakdown.input.customEarnings?.map((item: any) => {
                                if (item.amount <= 0) return null;
                                return (
                                  <div key={item.id} className="flex justify-between font-bold text-indigo-600">
                                    <span>{item.name}</span>
                                    <span>₹{item.amount.toLocaleString('en-IN')}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Deductions side */}
                          <div>
                            <p className="font-bold text-slate-800 uppercase text-[9px] mb-1.5 border-b border-slate-200 pb-1">Deductions (Statutory)</p>
                            <div className="space-y-1 text-[10px]">
                              <div className="flex justify-between">
                                <span className="text-slate-500">Employee PF</span>
                                <span className="text-rose-600">-₹{liveBreakdown.calculations.employeePf}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Employee ESI</span>
                                <span className="text-rose-600">-₹{liveBreakdown.calculations.employeeEsi}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Professional Tax</span>
                                <span className="text-rose-600">-₹{liveBreakdown.calculations.professionalTax}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Monthly TDS</span>
                                <span className="text-rose-600">-₹{liveBreakdown.calculations.estimatedTds}</span>
                              </div>
                              {liveBreakdown.calculations.labourWelfareFund > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-slate-500">LWF</span>
                                  <span className="text-rose-600">-₹{liveBreakdown.calculations.labourWelfareFund}</span>
                                </div>
                              )}
                              {liveBreakdown.input.customDeductions?.map((item: any) => {
                                if (item.amount <= 0) return null;
                                return (
                                  <div key={item.id} className="flex justify-between font-bold text-rose-700">
                                    <span>{item.name}</span>
                                    <span>-₹{item.amount.toLocaleString('en-IN')}</span>
                                  </div>
                                );
                              })}
                              <div className="flex justify-between border-t border-slate-200 pt-1 font-bold text-rose-700">
                                <span>Total Deductions</span>
                                <span>-₹{liveBreakdown.calculations.totalDeductions}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Employer Contributions cost */}
                        <div className="bg-white p-3 rounded border border-slate-250 mt-4 text-[10px]">
                          <p className="font-bold text-slate-800 uppercase text-[9px] border-b border-slate-100 pb-1 mb-1.5">Employer Statutory Contributions</p>
                          <div className="grid grid-cols-2 gap-2 text-slate-500">
                            <div>Employer EPF Share: <span className="font-bold text-slate-800">₹{liveBreakdown.calculations.employerPf}</span></div>
                            <div>Employer EPS Share: <span className="font-bold text-slate-800">₹{liveBreakdown.calculations.employerEps}</span></div>
                            <div>Employer ESIC Share: <span className="font-bold text-slate-800">₹{liveBreakdown.calculations.employerEsi}</span></div>
                            <div className="col-span-2 border-t border-slate-100 pt-1 font-bold text-slate-800 flex justify-between text-xs">
                              <span>Total Monthly CTC Cost:</span>
                              <span className="text-indigo-600">₹{liveBreakdown.calculations.ctcCost.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end gap-2 border-t border-slate-200 pt-4 bg-transparent shrink-0">
                    <button
                      onClick={() => setProcessModalOpen(false)}
                      className="rounded border border-slate-300 bg-white hover:bg-slate-100 transition px-4 py-2.5 font-bold text-slate-600 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProcess}
                      className="rounded bg-indigo-600 hover:bg-indigo-700 text-white transition px-5 py-2.5 font-black text-xs shadow flex items-center gap-1.5"
                    >
                      <CheckCircle className="size-4" /> Save & Complete Process
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Premium Payslip Viewer Modal */}
        {payslipModalOpen && payslipRecord && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header bar */}
              <div className="bg-slate-950 p-5 text-white flex items-center justify-between shrink-0">
                <h3 className="text-sm font-black">Payslip Generated</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 shadow-sm transition"
                  >
                    <Printer className="size-3.5" /> Print Payslip
                  </button>
                  <button
                    onClick={() => setPayslipModalOpen(false)}
                    className="rounded bg-slate-800 hover:bg-slate-700 p-1.5 transition text-slate-400 hover:text-white"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              {/* Printable Body Content */}
              <div className="flex-grow overflow-y-auto p-6 bg-slate-100" id="printable-payslip">
                {/* Simulated A4 PDF Page with Letterhead */}
                <div className="bg-white text-slate-800 min-h-[950px] flex flex-col justify-between border border-slate-300 rounded shadow-md pt-16 pb-20 px-8 relative overflow-hidden max-w-3xl mx-auto font-sans">
                  {/* Top Green Bar */}
                  <div className="h-3 bg-[#38a834] w-full absolute top-0 left-0 right-0"></div>

                  {/* Header */}
                  <div className="pb-3 mb-6 flex justify-between items-center border-b border-slate-100 shrink-0">
                    <div>
                      <h2 className="text-base font-black text-slate-950 uppercase tracking-wide">PAYSLIP</h2>
                      <p className="font-extrabold text-xs text-slate-500 mt-0.5">For {selectedMonth} {selectedYear}</p>
                    </div>
                    <div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center select-none leading-none gap-0.5">
                          <span className="text-[#f15a24] font-sans font-extrabold text-lg tracking-tight">im</span>
                          <span className="text-[#0071bc] font-sans font-extrabold text-lg tracking-tight">xp</span>
                          <span className="inline-block mx-0.5" style={{ width: '14px', height: '14px' }}>
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                              <circle cx="50" cy="50" r="44" fill="#0071bc" />
                              <ellipse cx="50" cy="50" rx="44" ry="16" stroke="#ffffff" strokeWidth="4" fill="none" opacity="0.8" />
                              <ellipse cx="50" cy="50" rx="16" ry="44" stroke="#ffffff" strokeWidth="4" fill="none" opacity="0.8" />
                              <line x1="6" y1="50" x2="94" y2="50" stroke="#ffffff" strokeWidth="4" opacity="0.8" />
                              <line x1="50" y1="6" x2="50" y2="94" stroke="#ffffff" strokeWidth="4" opacity="0.8" />
                              <path 
                                d="M15 75 C10 40, 40 10, 75 15 C90 20, 95 35, 90 50 C85 65, 70 85, 45 88" 
                                stroke="#8cc63f" 
                                strokeWidth="8" 
                                strokeLinecap="round" 
                                fill="none" 
                              />
                              <path d="M35 83 L47 90 L40 76 Z" fill="#8cc63f" />
                            </svg>
                          </span>
                          <span className="text-[#0071bc] font-sans font-extrabold text-lg tracking-tight">rt</span>
                          <span className="text-[#8cc63f] font-sans font-extrabold text-lg tracking-tight">ex</span>
                        </div>
                        <div className="text-[5px] text-[#0071bc] font-black tracking-wider uppercase font-sans mt-0.5">
                          Global Reach <span className="text-slate-300 mx-0.5">|</span> Global Presence
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex-grow text-xs text-slate-800" id="payslip-card-content">

                  {/* Metadata grid */}
                  <div className="grid grid-cols-2 gap-6 my-5 border-b border-slate-200 pb-5">
                    {/* Left details */}
                    <div>
                      <p className="font-bold text-slate-900 uppercase text-[9px] tracking-wider text-indigo-600 mb-2">Employee Metadata</p>
                      <table className="w-full text-left font-medium space-y-1">
                        <tbody>
                          <tr><td className="text-slate-400 pr-4">Employee ID:</td><td className="font-bold text-slate-900">{payslipRecord.employee?.id}</td></tr>
                          <tr><td className="text-slate-400 pr-4">Name:</td><td className="font-bold text-slate-900">{payslipRecord.employee?.fullName}</td></tr>
                          <tr><td className="text-slate-400 pr-4">Designation:</td><td>{payslipRecord.employee?.designation}</td></tr>
                          <tr><td className="text-slate-400 pr-4">Department:</td><td>{payslipRecord.employee?.department}</td></tr>
                          <tr><td className="text-slate-400 pr-4">Date of Joining:</td><td>{payslipRecord.employee?.dateOfJoining}</td></tr>
                          {payslipRecord.employee?.employmentType === "CONTRACT" && (
                            <>
                              <tr><td className="text-slate-400 pr-4 text-indigo-600 font-bold">Contract Name:</td><td className="font-bold text-slate-900">{payslipRecord.employee?.clientName || "Not Configured"}</td></tr>
                              <tr><td className="text-slate-400 pr-4 text-indigo-600 font-bold">Work Location:</td><td className="font-bold text-slate-900">{payslipRecord.employee?.workLocation || "Not Configured"}</td></tr>
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Right details */}
                    <div>
                      <p className="font-bold text-slate-900 uppercase text-[9px] tracking-wider text-indigo-600 mb-2">Compliance Registers</p>
                      <table className="w-full text-left font-medium space-y-1">
                        <tbody>
                          <tr><td className="text-slate-400 pr-4">Aadhaar Card:</td><td className="font-mono">{payslipRecord.employee?.aadhaar || "Not Provided"}</td></tr>
                          <tr><td className="text-slate-400 pr-4">PAN Card:</td><td className="font-mono">{payslipRecord.employee?.pan || "Not Provided"}</td></tr>
                          <tr><td className="text-slate-400 pr-4">PF UAN:</td><td className="font-mono">{payslipRecord.employee?.uan || "Not Provided"}</td></tr>
                          <tr><td className="text-slate-400 pr-4">ESIC Code:</td><td className="font-mono">{payslipRecord.employee?.esicNumber || "Not Provided"}</td></tr>
                          <tr><td className="text-slate-400 pr-4">State Location:</td><td>{payslipRecord.payroll?.input?.state}</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Attendance block */}
                  <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-5 grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                    <div>
                      <span className="text-slate-400 uppercase text-[8px] block">Month Days</span>
                      <span className="text-slate-800 text-xs font-black">{payslipRecord.payroll?.input?.monthDays}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase text-[8px] block">LOP Days</span>
                      <span className="text-rose-600 text-xs font-black">{payslipRecord.payroll?.input?.lopDays}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase text-[8px] block">Paid Days</span>
                      <span className="text-slate-800 text-xs font-black">{payslipRecord.payroll?.input?.paidDays}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase text-[8px] block">Tax Regime</span>
                      <span className="text-indigo-600 text-xs font-black">{payslipRecord.payroll?.input?.taxRegime}</span>
                    </div>
                  </div>

                  {/* Table structure for Earnings vs Deductions */}
                  <div className="grid grid-cols-2 gap-0 border border-slate-300 rounded overflow-hidden">
                    {/* Earnings side */}
                    <div className="border-r border-slate-300">
                      <div className="bg-slate-900 text-white p-2 font-bold uppercase tracking-wider text-[9px] flex justify-between">
                        <span>Earnings</span>
                        <span>Amount (INR)</span>
                      </div>
                      <div className="divide-y divide-slate-100 p-2 space-y-1.5 font-medium">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Basic Salary</span>
                          <span>₹{(Math.round(payslipRecord.payroll.input.basic * (payslipRecord.payroll.input.paidDays / payslipRecord.payroll.input.monthDays) * 100)/100).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">House Rent Allowance (HRA)</span>
                          <span>₹{(Math.round(payslipRecord.payroll.input.hra * (payslipRecord.payroll.input.paidDays / payslipRecord.payroll.input.monthDays) * 100)/100).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Special Allowance</span>
                          <span>₹{(Math.round(payslipRecord.payroll.input.specialAllowance * (payslipRecord.payroll.input.paidDays / payslipRecord.payroll.input.monthDays) * 100)/100).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Conveyance Allowance</span>
                          <span>₹{(Math.round(payslipRecord.payroll.input.conveyance * (payslipRecord.payroll.input.paidDays / payslipRecord.payroll.input.monthDays) * 100)/100).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Medical Allowance</span>
                          <span>₹{(Math.round(payslipRecord.payroll.input.medicalAllowance * (payslipRecord.payroll.input.paidDays / payslipRecord.payroll.input.monthDays) * 100)/100).toLocaleString('en-IN')}</span>
                        </div>
                        {payslipRecord.payroll.input.lta > 0 && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">LTA Allowance</span>
                            <span>₹{(Math.round(payslipRecord.payroll.input.lta * (payslipRecord.payroll.input.paidDays / payslipRecord.payroll.input.monthDays) * 100)/100).toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        {payslipRecord.payroll.input.bonus > 0 && <div className="flex justify-between font-bold text-indigo-600"><span>Bonus Paid</span><span>₹{payslipRecord.payroll.input.bonus}</span></div>}
                        {payslipRecord.payroll.input.incentives > 0 && <div className="flex justify-between font-bold text-indigo-600"><span>Performance Incentives</span><span>₹{payslipRecord.payroll.input.incentives}</span></div>}
                        {payslipRecord.payroll.input.overtime > 0 && <div className="flex justify-between"><span>Overtime Pay</span><span>₹{payslipRecord.payroll.input.overtime}</span></div>}
                        {payslipRecord.payroll.input.reimbursements > 0 && <div className="flex justify-between"><span>Reimbursements</span><span>₹{payslipRecord.payroll.input.reimbursements}</span></div>}
                        {payslipRecord.payroll.input.customEarnings?.map((item: any) => {
                          if (item.amount <= 0) return null;
                          return (
                            <div key={item.id} className="flex justify-between font-bold text-indigo-600">
                              <span>{item.name}</span>
                              <span>₹{item.amount.toLocaleString('en-IN')}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Deductions side */}
                    <div>
                      <div className="bg-slate-900 text-white p-2 font-bold uppercase tracking-wider text-[9px] flex justify-between">
                        <span>Deductions</span>
                        <span>Amount (INR)</span>
                      </div>
                      <div className="divide-y divide-slate-100 p-2 space-y-1.5 font-medium">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Provident Fund (Employee EPF)</span>
                          <span className="text-rose-600">₹{payslipRecord.payroll.calculations.employeePf}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">State ESIC Contribution</span>
                          <span className="text-rose-600">₹{payslipRecord.payroll.calculations.employeeEsi}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Professional Tax (PT)</span>
                          <span className="text-rose-600">₹{payslipRecord.payroll.calculations.professionalTax}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Monthly TDS (Income Tax)</span>
                          <span className="text-rose-600">₹{payslipRecord.payroll.calculations.estimatedTds}</span>
                        </div>
                        {payslipRecord.payroll.calculations.labourWelfareFund > 0 && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Labour Welfare Fund (LWF)</span>
                            <span className="text-rose-600">₹{payslipRecord.payroll.calculations.labourWelfareFund}</span>
                          </div>
                        )}
                        {payslipRecord.payroll.input.customDeductions?.map((item: any) => {
                          if (item.amount <= 0) return null;
                          return (
                            <div key={item.id} className="flex justify-between font-bold text-rose-700 border-b border-transparent">
                              <span>{item.name}</span>
                              <span className="text-rose-600">₹{item.amount.toLocaleString('en-IN')}</span>
                            </div>
                          );
                        })}
                        {/* Pad empty lines to match height */}
                        <div className="flex justify-between border-transparent"><span className="text-transparent">Placeholder</span><span className="text-transparent">-</span></div>
                        <div className="flex justify-between border-transparent"><span className="text-transparent">Placeholder</span><span className="text-transparent">-</span></div>
                      </div>
                    </div>
                  </div>

                  {/* Totals Block */}
                  <div className="grid grid-cols-2 gap-0 border-x border-b border-slate-300 font-extrabold text-[10px]">
                    <div className="p-2 border-r border-slate-300 flex justify-between bg-slate-50 text-slate-900">
                      <span>Total Gross Earnings:</span>
                      <span>₹{payslipRecord.payroll.calculations.grossEarnings.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="p-2 flex justify-between bg-slate-50 text-rose-800 border-b border-transparent">
                      <span>Total Deductions:</span>
                      <span>₹{payslipRecord.payroll.calculations.totalDeductions.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Net payout highlight */}
                  <div className="border border-slate-900 rounded p-4 my-5 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-indigo-50 border-indigo-200">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">Net Take-Home Pay (Pushed to Bank)</span>
                      <span className="text-xs font-semibold text-slate-500 mt-1 block italic">"{numberToIndianWords(payslipRecord.payroll.calculations.netPay)}"</span>
                    </div>
                    <div className="text-right shrink-0 mt-3 sm:mt-0">
                      <span className="text-2xl font-black text-indigo-900">INR {payslipRecord.payroll.calculations.netPay.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Footer disclaimer */}
                  <div className="mt-8 flex justify-between items-end border-t border-slate-200 pt-6 text-[10px] text-slate-400 font-semibold italic">
                    <div>
                      <p>System Generated Payslip. No signature required.</p>
                      <p className="mt-1">Generated by Bharat HRMS Cloud SaaS on {new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p>Employer Signature / Chop</p>
                      <div className="h-10 w-24 border-b border-slate-300 mt-1"></div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center font-sans shrink-0">
                  <div className="w-full h-[1.5px] bg-[#f58220] mb-2"></div>
                  <div className="text-[9px] leading-normal mb-1">
                    <p className="font-extrabold tracking-wide uppercase">
                      <span className="text-[#f15a24]">IM</span>
                      <span className="text-[#0071bc]">XPORT</span>
                      <span className="text-[#8cc63f]">EX</span>{" "}
                      <span className="text-[#0071bc]">EWORLD PRIVATE LIMTED</span>
                    </p>
                    <p className="mt-0.5 font-medium text-slate-700">1-11-251/11, RKP MANSION, BEGUMPET, HYDERABAD – 500016</p>
                    <p className="mt-0.5 font-bold text-slate-400">
                      <span className="text-slate-500 font-bold">Email:</span>{" "}
                      <span className="text-[#0071bc] font-normal underline">info@imxportex.com</span>{" "}
                      <span className="text-slate-500 font-bold">Web:</span>{" "}
                      <span className="text-[#0071bc] font-normal underline">www.imxportex.com</span>
                    </p>
                  </div>
                </div>

                {/* Bottom Green Bar */}
                <div className="h-6 bg-[#38a834] w-full absolute bottom-0 left-0 right-0"></div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={() => setPayslipModalOpen(false)}
                className="rounded border border-slate-200 bg-white px-5 py-2 font-bold text-slate-600 hover:bg-slate-50 transition text-xs"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}
      </section>
    </main>
  );
}
