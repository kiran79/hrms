"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SaasSidebar } from "@/components/app/saas-sidebar";
import { Card, Badge } from "@/components/ui";
import { 
  Folder, 
  FileText, 
  UploadCloud, 
  Download, 
  Trash2, 
  Search, 
  Plus, 
  X, 
  User, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  Eye,
  FileDown,
  Printer
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

// Default placeholder documents
const defaultDocuments = [
  {
    id: 1,
    employeeId: "EMP-001",
    title: "Employment Agreement",
    date: "2026-01-15",
    type: "Uploaded Document",
    fileSize: "128 KB",
    fileName: "employment_agreement.pdf",
    isGenerated: false,
    fileContent: "data:text/plain;base64,U01BUlQgSFJNUyBDT05UUkFDVA=="
  },
  {
    id: 2,
    employeeId: "EMP-002",
    title: "Relieving Certificate",
    date: "2026-02-28",
    type: "Uploaded Document",
    fileSize: "45 KB",
    fileName: "relieving_certificate.pdf",
    isGenerated: false,
    fileContent: "data:text/plain;base64,UkVMSUVWSU5HIExFVFRFUg=="
  }
];

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  
  const [viewMode, setViewMode] = useState<"self" | "manager">("manager");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [currentUserEmpId, setCurrentUserEmpId] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // all, generated, uploaded

  // Modal and Upload Form States
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileBase64, setSelectedFileBase64] = useState<string>("");
  const [targetEmployeeId, setTargetEmployeeId] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Generated Letter Preview Modal
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<any | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userType = localStorage.getItem("session_user_type");
      if (userType !== "company") {
        router.push("/login?tab=company");
        return;
      }

      // Load Employees
      const storedEmp = localStorage.getItem("employees");
      let loadedEmps: any[] = [];
      if (storedEmp) {
        loadedEmps = JSON.parse(storedEmp);
        setEmployees(loadedEmps);
      }

      // Load View Mode
      const savedMode = (localStorage.getItem("session_view_mode") as any) || "manager";
      setViewMode(savedMode);
      
      // Load current logged-in employee session details
      const email = localStorage.getItem("session_company_email") || "admin@example.com";
      setCurrentUserEmail(email);

      if (loadedEmps.length > 0) {
        const current = loadedEmps.find((e: any) => e.email.toLowerCase() === email.toLowerCase());
        if (current) {
          setCurrentUserEmpId(current.id);
        } else {
          setCurrentUserEmpId(loadedEmps[0].id);
        }
      } else {
        setCurrentUserEmpId("EMP-001");
      }

      // Load Documents from localStorage
      const storedDocs = localStorage.getItem("hrms_employee_documents");
      if (storedDocs) {
        setDocuments(JSON.parse(storedDocs));
      } else {
        localStorage.setItem("hrms_employee_documents", JSON.stringify(defaultDocuments));
        setDocuments(defaultDocuments);
      }

      const listener = () => {
        const updatedMode = (localStorage.getItem("session_view_mode") as any) || "manager";
        setViewMode(updatedMode);
      };
      window.addEventListener("viewModeChanged", listener);
      return () => window.removeEventListener("viewModeChanged", listener);
    }
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFileBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenUpload = () => {
    setDocTitle("");
    setSelectedFile(null);
    setSelectedFileBase64("");
    setTargetEmployeeId(viewMode === "self" ? currentUserEmpId : (employees[0]?.id || ""));
    setError(null);
    setSuccess(null);
    setUploadModalOpen(true);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!docTitle.trim()) {
      setError("Please enter a document title.");
      return;
    }

    if (!selectedFile || !selectedFileBase64) {
      setError("Please select a file to upload.");
      return;
    }

    const newId = documents.length > 0 ? Math.max(...documents.map(d => d.id)) + 1 : 1;
    const sizeKB = Math.round(selectedFile.size / 1024);
    const newDoc = {
      id: newId,
      employeeId: viewMode === "self" ? currentUserEmpId : targetEmployeeId,
      title: docTitle,
      date: new Date().toISOString().split("T")[0],
      type: "Uploaded Document",
      fileSize: `${sizeKB} KB`,
      fileName: selectedFile.name,
      isGenerated: false,
      fileContent: selectedFileBase64
    };

    const updated = [newDoc, ...documents];
    setDocuments(updated);
    localStorage.setItem("hrms_employee_documents", JSON.stringify(updated));
    setSuccess("Document uploaded successfully!");
    setTimeout(() => setUploadModalOpen(false), 800);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this document? Official generated letters cannot be retrieved once deleted.")) {
      const updated = documents.filter(d => d.id !== id);
      setDocuments(updated);
      localStorage.setItem("hrms_employee_documents", JSON.stringify(updated));
    }
  };

  const handleDownload = (doc: any) => {
    if (doc.isGenerated) {
      // Generated letter download/print
      handleDownloadPDF(doc);
    } else {
      // Standard file download from Base64
      const link = document.createElement("a");
      link.href = doc.fileContent;
      link.download = doc.fileName || doc.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpenPreview = (doc: any) => {
    setPreviewItem(doc);
    setPreviewModalOpen(true);
  };

  const handleDownloadPDF = (letter: any) => {
    if (typeof window !== "undefined") {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);
      const doc = iframe.contentWindow?.document;
      if (!doc) return;
      doc.open();
      
      if (letter.isPayslip) {
        const emp = employees.find(e => e.id === letter.employeeId) || {};
        const payroll = letter.payroll || {};
        const calcs = payroll.calculations || {};
        const inp = payroll.input || {};

        const fmt = (val: number) => (val || 0).toLocaleString('en-IN');
        const basicAmt = Math.round(inp.basic * (inp.paidDays / inp.monthDays) * 100) / 100;
        const hraAmt = Math.round(inp.hra * (inp.paidDays / inp.monthDays) * 100) / 100;
        const specialAmt = Math.round(inp.specialAllowance * (inp.paidDays / inp.monthDays) * 100) / 100;
        const conveyanceAmt = Math.round(inp.conveyance * (inp.paidDays / inp.monthDays) * 100) / 100;
        const medicalAmt = Math.round(inp.medicalAllowance * (inp.paidDays / inp.monthDays) * 100) / 100;
        const ltaAmt = Math.round((inp.lta || 0) * (inp.paidDays / inp.monthDays) * 100) / 100;

        doc.write(`
          <html>
          <head>
            <title>${letter.title}</title>
            <style>
              @page {
                size: A4;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
                background-color: #ffffff;
                font-family: 'Inter', sans-serif;
              }
              .page {
                position: relative;
                width: 210mm;
                height: 297mm;
                box-sizing: border-box;
                padding: 35mm 20mm 35mm 20mm;
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
                justify-content: flex-end;
                align-items: flex-start;
                border-bottom: 1.5px solid #38a834;
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
                font-size: 24px;
                letter-spacing: -0.5px;
                line-height: 1;
              }
              .logo-im { color: #f15a24; }
              .logo-xp { color: #0071bc; }
              .logo-rt { color: #0071bc; }
              .logo-ex { color: #8cc63f; }
              .logo-globe {
                display: inline-block;
                width: 22px;
                height: 22px;
                margin: 0 2px;
              }
              .tagline {
                font-weight: 900;
                font-size: 6px;
                color: #0071bc;
                letter-spacing: 1.5px;
                text-transform: uppercase;
                margin-top: 4px;
              }
              .content-area {
                flex-grow: 1;
                font-size: 11px;
                line-height: 1.5;
                margin-top: 15mm;
              }
              .payslip-title {
                text-align: center;
                font-size: 14px;
                font-weight: 850;
                color: #1e293b;
                text-transform: uppercase;
                margin-bottom: 15px;
                letter-spacing: 1px;
              }
              .meta-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 15px;
                border-bottom: 1px solid #e2e8f0;
                padding-bottom: 15px;
              }
              .meta-title {
                font-weight: 800;
                font-size: 9px;
                text-transform: uppercase;
                color: #4f46e5;
                margin-bottom: 5px;
                letter-spacing: 0.5px;
              }
              .meta-table {
                width: 100%;
                border-collapse: collapse;
              }
              .meta-table td {
                padding: 2px 0;
                vertical-align: top;
              }
              .meta-label {
                color: #94a3b8;
                width: 120px;
                font-weight: 600;
              }
              .meta-val {
                color: #1e293b;
                font-weight: 700;
              }
              .attendance-block {
                background-color: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 4px;
                padding: 10px;
                margin-bottom: 15px;
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                text-align: center;
              }
              .att-item-label {
                font-size: 8px;
                color: #94a3b8;
                text-transform: uppercase;
                font-weight: 700;
                display: block;
              }
              .att-item-val {
                font-size: 12px;
                font-weight: 900;
                color: #1e293b;
              }
              .att-item-val.danger {
                color: #dc2626;
              }
              .att-item-val.primary {
                color: #4f46e5;
              }
              .table-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                border: 1px solid #cbd5e1;
                border-radius: 4px;
                overflow: hidden;
              }
              .table-side {
                background: white;
              }
              .table-side.left {
                border-right: 1px solid #cbd5e1;
              }
              .table-header {
                background-color: #0f172a;
                color: #ffffff;
                padding: 6px 10px;
                font-weight: 800;
                text-transform: uppercase;
                font-size: 9px;
                letter-spacing: 0.5px;
                display: flex;
                justify-content: space-between;
              }
              .table-body {
                padding: 8px;
              }
              .row-item {
                display: flex;
                justify-content: space-between;
                padding: 4px 2px;
                font-size: 10px;
                font-weight: 600;
              }
              .row-item.highlight {
                color: #4f46e5;
                font-weight: 800;
              }
              .row-label {
                color: #64748b;
              }
              .row-val {
                color: #0f172a;
              }
              .row-val.deduction {
                color: #dc2626;
              }
              .totals-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                border-left: 1px solid #cbd5e1;
                border-right: 1px solid #cbd5e1;
                border-bottom: 1px solid #cbd5e1;
                font-weight: 800;
                font-size: 10px;
              }
              .total-side {
                padding: 6px 10px;
                display: flex;
                justify-content: space-between;
                background-color: #f8fafc;
              }
              .total-side.left {
                border-right: 1px solid #cbd5e1;
                color: #0f172a;
              }
              .total-side.right {
                color: #991b1b;
              }
              .net-pay-block {
                border: 1.5px solid #e2e8f0;
                background-color: #eef2ff;
                border-radius: 4px;
                padding: 12px;
                margin-top: 15px;
                margin-bottom: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
              }
              .net-words-title {
                font-size: 9px;
                font-weight: 800;
                color: #4f46e5;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .net-words {
                font-size: 11px;
                font-weight: 700;
                color: #475569;
                font-style: italic;
                margin-top: 2px;
              }
              .net-amount {
                font-size: 20px;
                font-weight: 900;
                color: #1e1b4b;
              }
              .disclaimer-block {
                margin-top: 25px;
                border-top: 1px solid #e2e8f0;
                padding-top: 15px;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                font-size: 9px;
                color: #94a3b8;
                font-weight: 600;
                font-style: italic;
              }
              .disclaimer-text p {
                margin: 0;
              }
              .disclaimer-sign {
                text-align: right;
              }
              .disclaimer-sign p {
                margin: 0;
                color: #94a3b8;
              }
              .sign-line {
                width: 100px;
                height: 1px;
                background-color: #cbd5e1;
                margin-top: 25px;
              }
              .footer {
                position: absolute;
                bottom: 15mm;
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
                  <div class="tagline">GLOBAL REACH | GLOBAL PRESENCE</div>
                </div>
              </div>
              
              <div class="content-area">
                <div class="payslip-title">PAYSLIP FOR THE MONTH OF ${letter.selectedMonth.toUpperCase()} ${letter.selectedYear}</div>
                
                <div class="meta-grid">
                  <div>
                    <div class="meta-title">Employee Metadata</div>
                    <table class="meta-table">
                      <tr><td class="meta-label">Employee ID:</td><td class="meta-val">${emp.id || ''}</td></tr>
                      <tr><td class="meta-label">Name:</td><td class="meta-val">${emp.fullName || ''}</td></tr>
                      <tr><td class="meta-label">Designation:</td><td class="meta-val">${emp.designation || ''}</td></tr>
                      <tr><td class="meta-label">Department:</td><td class="meta-val">${emp.department || ''}</td></tr>
                      <tr><td class="meta-label">Date of Joining:</td><td class="meta-val">${emp.dateOfJoining || ''}</td></tr>
                      ${emp.employmentType === 'CONTRACT' ? `
                        <tr><td class="meta-label" style="color: #4f46e5;">Contract Name:</td><td class="meta-val">${emp.clientName || 'Not Configured'}</td></tr>
                        <tr><td class="meta-label" style="color: #4f46e5;">Work Location:</td><td class="meta-val">${emp.workLocation || 'Not Configured'}</td></tr>
                      ` : ''}
                    </table>
                  </div>
                  <div>
                    <div class="meta-title">Compliance Registers</div>
                    <table class="meta-table">
                      <tr><td class="meta-label">Aadhaar Card:</td><td class="meta-val" style="font-family: monospace;">${emp.aadhaar || 'Not Provided'}</td></tr>
                      <tr><td class="meta-label">PAN Card:</td><td class="meta-val" style="font-family: monospace;">${emp.pan || 'Not Provided'}</td></tr>
                      <tr><td class="meta-label">PF UAN:</td><td class="meta-val" style="font-family: monospace;">${emp.uan || 'Not Provided'}</td></tr>
                      <tr><td class="meta-label">ESIC Code:</td><td class="meta-val" style="font-family: monospace;">${emp.esicNumber || 'Not Provided'}</td></tr>
                      <tr><td class="meta-label">State Location:</td><td class="meta-val">${inp.state || ''}</td></tr>
                    </table>
                  </div>
                </div>
                
                <div class="attendance-block">
                  <div>
                    <span class="att-item-label">Month Days</span>
                    <span class="att-item-val">${inp.monthDays}</span>
                  </div>
                  <div>
                    <span class="att-item-label">LOP Days</span>
                    <span class="att-item-val danger">${inp.lopDays}</span>
                  </div>
                  <div>
                    <span class="att-item-label">Paid Days</span>
                    <span class="att-item-val">${inp.paidDays}</span>
                  </div>
                  <div>
                    <span class="att-item-label">Tax Regime</span>
                    <span class="att-item-val primary">${inp.taxRegime}</span>
                  </div>
                </div>
                
                <div class="table-grid">
                  <div class="table-side left">
                    <div class="table-header">
                      <span>Earnings</span>
                      <span>Amount (INR)</span>
                    </div>
                    <div class="table-body">
                      <div class="row-item">
                        <span class="row-label">Basic Salary</span>
                        <span class="row-val">₹${fmt(basicAmt)}</span>
                      </div>
                      <div class="row-item">
                        <span class="row-label">House Rent Allowance (HRA)</span>
                        <span class="row-val">₹${fmt(hraAmt)}</span>
                      </div>
                      <div class="row-item">
                        <span class="row-label">Special Allowance</span>
                        <span class="row-val">₹${fmt(specialAmt)}</span>
                      </div>
                      <div class="row-item">
                        <span class="row-label">Conveyance Allowance</span>
                        <span class="row-val">₹${fmt(conveyanceAmt)}</span>
                      </div>
                      <div class="row-item">
                        <span class="row-label">Medical Allowance</span>
                        <span class="row-val">₹${fmt(medicalAmt)}</span>
                      </div>
                      ${ltaAmt > 0 ? `
                        <div class="row-item">
                          <span class="row-label">LTA Allowance</span>
                          <span class="row-val">₹${fmt(ltaAmt)}</span>
                        </div>
                      ` : ''}
                      ${inp.bonus > 0 ? `
                        <div class="row-item highlight">
                          <span class="row-label">Bonus Paid</span>
                          <span class="row-val">₹${fmt(inp.bonus)}</span>
                        </div>
                      ` : ''}
                      ${inp.incentives > 0 ? `
                        <div class="row-item highlight">
                          <span class="row-label">Performance Incentives</span>
                          <span class="row-val">₹${fmt(inp.incentives)}</span>
                        </div>
                      ` : ''}
                      ${inp.overtime > 0 ? `
                        <div class="row-item">
                          <span class="row-label">Overtime Pay</span>
                          <span class="row-val">₹${fmt(inp.overtime)}</span>
                        </div>
                      ` : ''}
                      ${inp.reimbursements > 0 ? `
                        <div class="row-item">
                          <span class="row-label">Reimbursements</span>
                          <span class="row-val">₹${fmt(inp.reimbursements)}</span>
                        </div>
                      ` : ''}
                      ${(inp.customEarnings || []).map((item: any) => {
                        if (item.amount <= 0) return '';
                        return `
                          <div class="row-item highlight">
                            <span class="row-label">${item.name}</span>
                            <span class="row-val">₹${fmt(item.amount)}</span>
                          </div>
                        `;
                      }).join('')}
                    </div>
                  </div>
                  <div class="table-side">
                    <div class="table-header">
                      <span>Deductions</span>
                      <span>Amount (INR)</span>
                    </div>
                    <div class="table-body">
                      <div class="row-item">
                        <span class="row-label">Provident Fund (Employee EPF)</span>
                        <span class="row-val deduction">₹${fmt(calcs.employeePf)}</span>
                      </div>
                      <div class="row-item">
                        <span class="row-label">State ESIC Contribution</span>
                        <span class="row-val deduction">₹${fmt(calcs.employeeEsi)}</span>
                      </div>
                      <div class="row-item">
                        <span class="row-label">Professional Tax (PT)</span>
                        <span class="row-val deduction">₹${fmt(calcs.professionalTax)}</span>
                      </div>
                      <div class="row-item">
                        <span class="row-label">Monthly TDS (Income Tax)</span>
                        <span class="row-val deduction">₹${fmt(calcs.estimatedTds)}</span>
                      </div>
                      ${calcs.labourWelfareFund > 0 ? `
                        <div class="row-item">
                          <span class="row-label">Labour Welfare Fund (LWF)</span>
                          <span class="row-val deduction">₹${fmt(calcs.labourWelfareFund)}</span>
                        </div>
                      ` : ''}
                      ${(inp.customDeductions || []).map((item: any) => {
                        if (item.amount <= 0) return '';
                        return `
                          <div class="row-item" style="color: #b91c1c; font-weight: 700;">
                            <span class="row-label">${item.name}</span>
                            <span class="row-val deduction">₹${fmt(item.amount)}</span>
                          </div>
                        `;
                      }).join('')}
                    </div>
                  </div>
                </div>
                
                <div class="totals-grid">
                  <div class="total-side left">
                    <span>Total Gross Earnings:</span>
                    <span>₹${fmt(calcs.grossEarnings)}</span>
                  </div>
                  <div class="total-side right">
                    <span>Total Deductions:</span>
                    <span>₹${fmt(calcs.totalDeductions)}</span>
                  </div>
                </div>
                
                <div class="net-pay-block">
                  <div>
                    <div class="net-words-title">Net Take-Home Pay (Pushed to Bank)</div>
                    <div class="net-words">"${numberToIndianWords(calcs.netPay)}"</div>
                  </div>
                  <div class="net-amount">INR ${fmt(calcs.netPay)}</div>
                </div>
                
                <div class="disclaimer-block">
                  <div class="disclaimer-text">
                    <p>System Generated Payslip. No signature required.</p>
                    <p style="margin-top: 3px;">Generated by Bharat HRMS Cloud SaaS on ${new Date().toLocaleDateString()}</p>
                  </div>
                  <div class="disclaimer-sign">
                    <p>Employer Signature / Chop</p>
                    <div class="sign-line"></div>
                  </div>
                </div>
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
      } else {
        doc.write(`
          <html>
          <head>
            <title>${letter.title}</title>
            <style>
              @page {
                size: A4;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
                background-color: #ffffff;
              }
              .page {
                position: relative;
                width: 210mm;
                height: 297mm;
                box-sizing: border-box;
                padding: 40mm 25mm 40mm 25mm;
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
                left: 25mm;
                right: 25mm;
                display: flex;
                justify-content: flex-end;
                align-items: flex-start;
                border-bottom: 1px solid #f1f5f9;
                padding-bottom: 4mm;
                width: calc(100% - 50mm);
              }
              .logo-container {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
              }
              .logo-text {
                display: flex;
                align-items: center;
                font-family: 'Inter', sans-serif;
                font-weight: 800;
                font-size: 24px;
                letter-spacing: -0.5px;
                line-height: 1;
              }
              .logo-im { color: #f15a24; }
              .logo-xp { color: #0071bc; }
              .logo-rt { color: #0071bc; }
              .logo-ex { color: #8cc63f; }
              .logo-globe {
                display: inline-block;
                width: 22px;
                height: 22px;
                margin: 0 2px;
              }
              .tagline {
                font-family: 'Inter', sans-serif;
                font-weight: 900;
                font-size: 6px;
                color: #0071bc;
                letter-spacing: 1.5px;
                text-transform: uppercase;
                margin-top: 4px;
              }
              .content-area {
                flex-grow: 1;
                font-size: 13px;
                line-height: 1.6;
                white-space: pre-wrap;
                margin-top: 15mm;
              }
              .date-line {
                font-family: 'Inter', sans-serif;
                font-size: 10px;
                font-weight: 700;
                color: #94a3b8;
                text-align: right;
                margin-bottom: 20px;
                text-transform: uppercase;
              }
              .signature-block {
                display: flex;
                justify-content: flex-start;
                margin-top: 15px;
                margin-bottom: 15px;
                font-family: 'Inter', sans-serif;
              }
              .signature-wrapper {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
              }
              .signature-img {
                height: 30px;
                object-fit: contain;
                margin-bottom: 2px;
              }
              .signature-placeholder {
                height: 30px;
                margin-bottom: 2px;
              }
              .signatory-title {
                font-weight: 800;
                font-size: 9px;
                color: #475569;
                text-transform: uppercase;
              }
              .signatory-subtitle {
                font-weight: 700;
                font-size: 7px;
                color: #94a3b8;
                text-transform: uppercase;
                margin-top: 1px;
              }
              .footer {
                position: absolute;
                bottom: 15mm;
                left: 25mm;
                right: 25mm;
                text-align: center;
                font-family: 'Inter', sans-serif;
                width: calc(100% - 50mm);
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
                  <div class="tagline">GLOBAL REACH | GLOBAL PRESENCE</div>
                </div>
              </div>
              
              <div class="content-area">
                <div class="date-line">DATE: ${letter.date}</div>
                <div>
                  ${(() => {
                    const match = letter.body.match(/(Yours Sincerely\s*,?|Sincerely\s*,?|Yours Faithfully\s*,?)/i);
                    if (match && match.index !== undefined) {
                      const splitIndex = match.index + match[0].length;
                      const beforeText = letter.body.substring(0, splitIndex);
                      const afterText = letter.body.substring(splitIndex);
                      return `
                        <div>${beforeText.replace(/\n/g, '<br>')}</div>
                        <div class="signature-block">
                          <div class="signature-wrapper">
                            ${letter.signature ? `<img class="signature-img" src="${letter.signature}" alt="Signature" />` : '<div class="signature-placeholder"></div>'}
                            <div class="signatory-title">Concerned HR Manager</div>
                            <div class="signatory-subtitle">Authorized Signatory</div>
                          </div>
                        </div>
                        <div>${afterText.replace(/\n/g, '<br>')}</div>
                      `;
                    }
                    return `
                      <div>${letter.body.replace(/\n/g, '<br>')}</div>
                      <div class="signature-block">
                        <div class="signature-wrapper">
                          ${letter.signature ? `<img class="signature-img" src="${letter.signature}" alt="Signature" />` : '<div class="signature-placeholder"></div>'}
                          <div class="signatory-title">Concerned HR Manager</div>
                          <div class="signatory-subtitle">Authorized Signatory</div>
                        </div>
                      </div>
                    `;
                  })()}
                </div>
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
      }

      doc.close();
      
      setTimeout(() => {
        iframe.contentWindow?.focus();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1500);
      }, 500);
    }
  };

  const renderBodyWithSignature = (body: string, sig: string, size: "sm" | "md" | "lg" = "md") => {
    const match = body.match(/(Yours Sincerely\s*,?|Sincerely\s*,?|Yours Faithfully\s*,?)/i);
    const sizeClasses = {
      sm: { text: "text-[10px] leading-relaxed", sigH: "h-6", pad: "mt-2 mb-1" },
      md: { text: "text-xs leading-relaxed", sigH: "h-8", pad: "mt-4 mb-2" },
      lg: { text: "text-sm leading-relaxed", sigH: "h-12", pad: "mt-6 mb-3" }
    }[size];

    if (match && match.index !== undefined) {
      const splitIndex = match.index + match[0].length;
      const beforeText = body.substring(0, splitIndex);
      const afterText = body.substring(splitIndex);

      return (
        <div className={sizeClasses.text}>
          <div className="whitespace-pre-line">{beforeText}</div>
          <div className={`flex justify-start ${sizeClasses.pad} font-sans`}>
            <div className="flex flex-col items-center text-center shrink-0">
              {sig ? (
                <img src={sig} alt="HR Signature" className={`${sizeClasses.sigH} object-contain mb-0.5`} />
              ) : (
                <div className={`w-16 border border-dashed border-slate-200 rounded flex items-center justify-center text-[6px] text-slate-300 mb-0.5`} style={{ height: size === "sm" ? "16px" : "24px" }}>
                  No Sig
                </div>
              )}
              <span className="font-extrabold text-slate-600 text-[8px] uppercase tracking-wide">Concerned HR Manager</span>
              <span className="text-[6px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Authorized Signatory</span>
            </div>
          </div>
          <div className="whitespace-pre-line">{afterText}</div>
        </div>
      );
    }

    return (
      <div className={sizeClasses.text}>
        <div className="whitespace-pre-line">{body}</div>
        <div className={`flex justify-start ${sizeClasses.pad} font-sans`}>
          <div className="flex flex-col items-center text-center shrink-0">
            {sig ? (
              <img src={sig} alt="HR Signature" className={`${sizeClasses.sigH} object-contain mb-0.5`} />
            ) : (
              <div className={`w-16 border border-dashed border-slate-200 rounded flex items-center justify-center text-[6px] text-slate-300 mb-0.5`} style={{ height: size === "sm" ? "16px" : "24px" }}>
                No Sig
              </div>
            )}
            <span className="font-extrabold text-slate-600 text-[8px] uppercase tracking-wide">Concerned HR Manager</span>
            <span className="text-[6px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Authorized Signatory</span>
          </div>
        </div>
      </div>
    );
  };

  // Filter documents
  const filteredDocs = documents.filter(d => {
    // 1. Filter by employee ownership
    const isOwner = viewMode === "self" ? d.employeeId === currentUserEmpId : true;
    if (!isOwner) return false;

    // 2. Filter by type
    if (typeFilter === "generated" && !d.isGenerated) return false;
    if (typeFilter === "uploaded" && d.isGenerated) return false;

    // 3. Search query
    const empObj = employees.find(e => e.id === d.employeeId);
    const query = searchQuery.toLowerCase();
    return (
      d.title.toLowerCase().includes(query) ||
      (d.fileName || "").toLowerCase().includes(query) ||
      (empObj?.fullName || "").toLowerCase().includes(query) ||
      d.employeeId.toLowerCase().includes(query)
    );
  });

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[280px_1fr]">
      <SaasSidebar active="Documents" />

      <section className="p-6 lg:p-8 overflow-y-auto">
        {viewMode === "self" ? (
          /* SELF ESS VIEW: My Personal Vault */
          <div>
            <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white -mx-6 -mt-6 p-6 lg:-mx-8 lg:-mt-8 shadow-sm">
              <div>
                <h2 className="text-2xl font-black text-slate-900">My Document Vault</h2>
                <p className="mt-1 text-sm text-slate-500">Access, upload, and download employment records, agreements, and official letters.</p>
              </div>
              <button
                onClick={handleOpenUpload}
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-xs font-black text-white shadow hover:bg-indigo-700 transition cursor-pointer"
              >
                <UploadCloud className="size-4" /> Upload Document
              </button>
            </header>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <div className="relative max-w-xs flex-1">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <Search className="size-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-full rounded-md border border-slate-200 pl-9 pr-4 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <button
                  onClick={() => setTypeFilter("all")}
                  className={`px-3 py-1.5 rounded-md font-bold transition ${
                    typeFilter === "all" ? "bg-indigo-50 text-indigo-700 border border-indigo-150" : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  All Documents
                </button>
                <button
                  onClick={() => setTypeFilter("generated")}
                  className={`px-3 py-1.5 rounded-md font-bold transition ${
                    typeFilter === "generated" ? "bg-indigo-50 text-indigo-700 border border-indigo-150" : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  Official Letters
                </button>
                <button
                  onClick={() => setTypeFilter("uploaded")}
                  className={`px-3 py-1.5 rounded-md font-bold transition ${
                    typeFilter === "uploaded" ? "bg-indigo-50 text-indigo-700 border border-indigo-150" : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  My Uploads
                </button>
              </div>
            </div>

            {/* Document Cards */}
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {filteredDocs.map((doc) => (
                <Card key={doc.id} className="border-slate-200 shadow-sm p-5 bg-white hover:border-indigo-300 transition flex flex-col justify-between h-40">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-lg shrink-0 ${doc.isGenerated ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"}`}>
                      <FileText className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-slate-800 text-xs truncate" title={doc.title}>{doc.title}</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Size: {doc.fileSize}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                        <Calendar className="size-3" /> {doc.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3">
                    <Badge className={doc.isGenerated ? "bg-emerald-50 text-emerald-700" : "bg-indigo-50 text-indigo-700"}>
                      {doc.type}
                    </Badge>
                    <div className="flex items-center gap-1.5">
                      {doc.isGenerated && (
                        <>
                          <button
                            onClick={() => handleOpenPreview(doc)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
                            title="Preview"
                          >
                            <Eye className="size-3.5" />
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(doc)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
                            title="Print"
                          >
                            <Printer className="size-3.5" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDownload(doc)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
                        title="Download"
                      >
                        <Download className="size-3.5" />
                      </button>
                      {!doc.isGenerated && (
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                          title="Delete"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}

              {filteredDocs.length === 0 && (
                <div className="col-span-full bg-white border border-slate-200 rounded-lg p-10 text-center text-slate-400 font-semibold shadow-sm flex flex-col items-center justify-center">
                  <Folder className="size-12 text-slate-200 mb-3" />
                  <span>No documents matching the criteria found.</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* MANAGER VIEW: Employee Documents Manager */
          <div>
            <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white -mx-6 -mt-6 p-6 lg:-mx-8 lg:-mt-8 shadow-sm">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Document Repository</h2>
                <p className="mt-1 text-sm text-slate-500">Manage and catalog official paperwork, certifications, and generated letters for all staff.</p>
              </div>
              <button
                onClick={handleOpenUpload}
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-xs font-black text-white shadow hover:bg-indigo-700 transition cursor-pointer"
              >
                <Plus className="size-4" /> Upload for Employee
              </button>
            </header>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <div className="relative max-w-sm flex-1">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <Search className="size-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search by title, employee ID or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-md border border-slate-200 pl-9 pr-4 text-xs outline-none focus:border-indigo-500 bg-slate-50/50"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <button
                  onClick={() => setTypeFilter("all")}
                  className={`px-3.5 py-2 rounded-md font-bold transition ${
                    typeFilter === "all" ? "bg-indigo-50 text-indigo-700 border border-indigo-100" : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  All Vault
                </button>
                <button
                  onClick={() => setTypeFilter("generated")}
                  className={`px-3.5 py-2 rounded-md font-bold transition ${
                    typeFilter === "generated" ? "bg-indigo-50 text-indigo-700 border border-indigo-100" : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  Letters Generated
                </button>
                <button
                  onClick={() => setTypeFilter("uploaded")}
                  className={`px-3.5 py-2 rounded-md font-bold transition ${
                    typeFilter === "uploaded" ? "bg-indigo-50 text-indigo-700 border border-indigo-100" : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  Manual Uploads
                </button>
              </div>
            </div>

            {/* Document Table */}
            <Card className="border-slate-200 shadow-sm overflow-hidden p-0 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4">Employee</th>
                      <th className="p-4">Document Title</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">File Size</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {filteredDocs.length > 0 ? (
                      filteredDocs.map((doc) => {
                        const empObj = employees.find(e => e.id === doc.employeeId);
                        return (
                          <tr key={doc.id} className="hover:bg-slate-50/50 transition">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="grid size-9 place-items-center rounded-full bg-slate-100 font-bold text-slate-600 text-sm">
                                  <User className="size-4 text-slate-400" />
                                </div>
                                <div>
                                  <p className="font-black text-slate-900 text-sm">{empObj?.fullName || "System Admin"}</p>
                                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{doc.employeeId}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 font-black text-slate-800 text-sm max-w-xs truncate">
                              <span className="flex items-center gap-1.5">
                                <FileText className="size-4 text-slate-400" />
                                {doc.title}
                              </span>
                            </td>
                            <td className="p-4">
                              <Badge className={doc.isGenerated ? "bg-emerald-50 text-emerald-700" : "bg-indigo-50 text-indigo-700"}>
                                {doc.type}
                              </Badge>
                            </td>
                            <td className="p-4 text-slate-400 font-mono font-bold">{doc.fileSize}</td>
                            <td className="p-4 text-slate-600 font-mono font-bold">{doc.date}</td>
                            <td className="p-4 text-right flex items-center justify-end gap-1">
                              {doc.isGenerated && (
                                <>
                                  <button
                                    onClick={() => handleOpenPreview(doc)}
                                    className="p-1.5 text-slate-400 hover:text-indigo-600 rounded hover:bg-slate-100 transition"
                                    title="Preview Document"
                                  >
                                    <Eye className="size-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDownloadPDF(doc)}
                                    className="p-1.5 text-slate-400 hover:text-indigo-600 rounded hover:bg-slate-100 transition"
                                    title="Print"
                                  >
                                    <Printer className="size-3.5" />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleDownload(doc)}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 rounded hover:bg-slate-100 transition"
                                title="Download"
                              >
                                <Download className="size-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(doc.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition"
                                title="Delete Document"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold">
                          No records cataloged in the repository.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* MODAL: Upload Document */}
        {uploadModalOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-slate-200 bg-white p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
              <button
                onClick={() => setUploadModalOpen(false)}
                className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="size-5" />
              </button>

              <h3 className="text-base font-black text-slate-900 mb-2">Upload Document</h3>
              <p className="text-xs text-slate-400 mb-4">
                Store employment files, contracts, or certifications inside the employee vault.
              </p>

              {error && (
                <div className="mb-4 rounded-md bg-rose-50 p-3 text-xs font-bold text-rose-800 border border-rose-100 flex items-center gap-1.5">
                  <AlertCircle className="size-4 shrink-0" />
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 rounded-md bg-emerald-50 p-3 text-xs font-bold text-emerald-800 border border-emerald-100 animate-pulse flex items-center gap-1.5">
                  <CheckCircle className="size-4 shrink-0" />
                  {success}
                </div>
              )}

              <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
                {viewMode === "manager" && (
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    Select Recipient Employee
                    <select
                      value={targetEmployeeId}
                      onChange={(e) => setTargetEmployeeId(e.target.value)}
                      className="h-10 rounded border border-slate-200 px-3 bg-white outline-none focus:border-indigo-500 font-normal"
                      required
                    >
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.id})</option>
                      ))}
                    </select>
                  </label>
                )}

                <label className="grid gap-1 font-bold text-slate-500 uppercase">
                  Document Title / Description
                  <input
                    type="text"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="e.g. Relieving Certificate, Hike Letter"
                    className="h-10 rounded border border-slate-200 px-3 outline-none focus:border-indigo-500 font-normal bg-slate-50/20"
                    required
                  />
                </label>

                <label className="grid gap-1 font-bold text-slate-500 uppercase">
                  Choose File
                  <div className="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg p-6 bg-slate-50/50 hover:bg-slate-50 transition relative">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      required
                    />
                    <UploadCloud className="size-8 text-slate-400 mb-2" />
                    <span className="font-bold text-slate-600">
                      {selectedFile ? selectedFile.name : "Click or Drag to Upload File"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal mt-1">
                      {selectedFile ? `${Math.round(selectedFile.size / 1024)} KB` : "Supports PDFs, Images, TXT"}
                    </span>
                  </div>
                </label>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setUploadModalOpen(false)}
                    className="rounded border border-slate-200 bg-white px-4 py-2.5 font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-indigo-600 hover:bg-indigo-700 transition px-5 py-2.5 font-bold text-white shadow cursor-pointer"
                  >
                    Upload Vault
                  </button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {previewModalOpen && previewItem && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl border-slate-200 bg-white shadow-2xl relative p-0 overflow-hidden animate-in zoom-in-95 duration-150">
              <div className="bg-slate-950 p-4 text-white flex items-center justify-between">
                <span className="font-extrabold text-sm flex items-center gap-1.5">
                  <FileText className="size-4 text-indigo-400" /> {previewItem.isPayslip ? "Payslip Preview Frame" : "Letter Preview Frame"}
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleDownloadPDF(previewItem)} 
                    className="rounded bg-emerald-600 hover:bg-emerald-700 p-1.5 transition text-white flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 cursor-pointer"
                  >
                    <Printer className="size-3.5" /> Print
                  </button>
                  <button 
                    onClick={() => handleDownloadPDF(previewItem)} 
                    className="rounded bg-indigo-600 hover:bg-indigo-700 p-1.5 transition text-white flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 cursor-pointer"
                  >
                    <Download className="size-3.5" /> Download PDF
                  </button>
                  <button
                    onClick={() => setPreviewModalOpen(false)}
                    className="rounded bg-slate-800 hover:bg-slate-700 p-1.5 transition text-slate-400 hover:text-white flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 cursor-pointer"
                  >
                    <X className="size-3.5" /> Close
                  </button>
                </div>
              </div>

              {/* simulated PDF frame */}
              <div className="p-6 bg-slate-100 overflow-y-auto max-h-[70vh] flex justify-center select-none">
                <div className="bg-white w-[595px] min-h-[750px] shadow-lg relative p-12 text-slate-800 flex flex-col justify-between relative overflow-hidden font-serif text-[10px] leading-relaxed">
                  {/* Top Green Bar */}
                  <div className="h-2 bg-[#38a834] w-full absolute top-0 left-0 right-0"></div>

                  {/* Header */}
                  <div className="pb-2 mb-4 flex justify-between items-start border-b border-slate-100">
                    <div></div>
                    <div>
                      <div className="flex flex-col items-end font-sans">
                        <div className="flex items-center select-none leading-none gap-0.5">
                          <span className="text-[#f15a24] font-sans font-extrabold text-base tracking-tight">im</span>
                          <span className="text-[#0071bc] font-sans font-extrabold text-base tracking-tight">xp</span>
                          <span className="inline-block mx-0.5" style={{ width: '13px', height: '13px' }}>
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                              <circle cx="50" cy="50" r="44" fill="#0071bc" />
                              <ellipse cx="50" cy="50" rx="44" ry="16" stroke="#ffffff" strokeWidth="4" fill="none" opacity="0.8" />
                              <ellipse cx="50" cy="50" rx="16" ry="44" stroke="#ffffff" stroke-width="4" fill="none" opacity="0.8" />
                              <line x1="6" y1="50" x2="94" y2="50" stroke="#ffffff" stroke-width="4" opacity="0.8" />
                              <line x1="50" y1="6" x2="50" y2="94" stroke="#ffffff" stroke-width="4" opacity="0.8" />
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
                          <span className="text-[#0071bc] font-sans font-extrabold text-base tracking-tight">rt</span>
                          <span className="text-[#8cc63f] font-sans font-extrabold text-base tracking-tight">ex</span>
                        </div>
                        <div className="text-[5px] text-[#0071bc] font-black tracking-wider uppercase font-sans mt-0.5">
                          GLOBAL REACH <span className="text-slate-300 mx-0.5">|</span> GLOBAL PRESENCE
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  {previewItem.isPayslip ? (
                    <div className="flex-grow px-1 py-1 font-sans text-slate-800 text-[9px] leading-tight select-none w-full">
                      <div className="text-center text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
                        PAYSLIP FOR THE MONTH OF {previewItem.payroll?.input?.monthDays ? previewItem.selectedMonth.toUpperCase() : ''} {previewItem.selectedYear}
                      </div>

                      {/* Metadata grid */}
                      {(() => {
                        const emp = employees.find(e => e.id === previewItem.employeeId) || {};
                        const payroll = previewItem.payroll || {};
                        const inp = payroll.input || {};
                        const calcs = payroll.calculations || {};
                        const fmt = (val: number) => (val || 0).toLocaleString('en-IN');
                        const basicAmt = Math.round(inp.basic * (inp.paidDays / inp.monthDays) * 100) / 100;
                        const hraAmt = Math.round(inp.hra * (inp.paidDays / inp.monthDays) * 100) / 100;
                        const specialAmt = Math.round(inp.specialAllowance * (inp.paidDays / inp.monthDays) * 100) / 100;
                        const conveyanceAmt = Math.round(inp.conveyance * (inp.paidDays / inp.monthDays) * 100) / 100;
                        const medicalAmt = Math.round(inp.medicalAllowance * (inp.paidDays / inp.monthDays) * 100) / 100;
                        const ltaAmt = Math.round((inp.lta || 0) * (inp.paidDays / inp.monthDays) * 100) / 100;

                        return (
                          <>
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-3 mb-3">
                              <div>
                                <p className="font-extrabold text-[8px] text-indigo-600 uppercase tracking-wide mb-1">Employee Metadata</p>
                                <table className="w-full text-left text-[8px]">
                                  <tbody>
                                    <tr><td className="text-slate-400 font-semibold pr-2">Employee ID:</td><td className="font-bold text-slate-800">{emp.id}</td></tr>
                                    <tr><td className="text-slate-400 font-semibold pr-2">Name:</td><td className="font-bold text-slate-800">{emp.fullName}</td></tr>
                                    <tr><td className="text-slate-400 font-semibold pr-2">Designation:</td><td className="text-slate-700">{emp.designation}</td></tr>
                                    <tr><td className="text-slate-400 font-semibold pr-2">Department:</td><td className="text-slate-700">{emp.department}</td></tr>
                                    <tr><td className="text-slate-400 font-semibold pr-2">Date of Joining:</td><td className="text-slate-700">{emp.dateOfJoining}</td></tr>
                                    {emp.employmentType === "CONTRACT" && (
                                      <>
                                        <tr><td className="text-indigo-600 font-bold pr-2">Contract Name:</td><td className="font-bold text-slate-800">{emp.clientName || "Not Configured"}</td></tr>
                                        <tr><td className="text-indigo-600 font-bold pr-2">Work Location:</td><td className="font-bold text-slate-800">{emp.workLocation || "Not Configured"}</td></tr>
                                      </>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                              <div>
                                <p className="font-extrabold text-[8px] text-indigo-600 uppercase tracking-wide mb-1">Compliance Registers</p>
                                <table className="w-full text-left text-[8px]">
                                  <tbody>
                                    <tr><td className="text-slate-400 font-semibold pr-2">Aadhaar Card:</td><td className="font-mono text-slate-800">{emp.aadhaar || "Not Provided"}</td></tr>
                                    <tr><td className="text-slate-400 font-semibold pr-2">PAN Card:</td><td className="font-mono text-slate-800">{emp.pan || "Not Provided"}</td></tr>
                                    <tr><td className="text-slate-400 font-semibold pr-2">PF UAN:</td><td className="font-mono text-slate-800">{emp.uan || "Not Provided"}</td></tr>
                                    <tr><td className="text-slate-400 font-semibold pr-2">ESIC Code:</td><td className="font-mono text-slate-800">{emp.esicNumber || "Not Provided"}</td></tr>
                                    <tr><td className="text-slate-400 font-semibold pr-2">State Location:</td><td className="text-slate-700">{inp.state}</td></tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Attendance block */}
                            <div className="bg-slate-50 border border-slate-200 rounded p-2 mb-3 grid grid-cols-4 gap-1 text-center font-bold text-[8px]">
                              <div>
                                <span className="text-slate-400 uppercase text-[7px] block">Month Days</span>
                                <span className="text-slate-800 font-black">{inp.monthDays}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 uppercase text-[7px] block">LOP Days</span>
                                <span className="text-rose-600 font-black">{inp.lopDays}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 uppercase text-[7px] block">Paid Days</span>
                                <span className="text-slate-800 font-black">{inp.paidDays}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 uppercase text-[7px] block">Tax Regime</span>
                                <span className="text-indigo-600 font-black">{inp.taxRegime}</span>
                              </div>
                            </div>

                            {/* Earnings vs Deductions table */}
                            <div className="grid grid-cols-2 gap-0 border border-slate-300 rounded overflow-hidden">
                              {/* Earnings side */}
                              <div className="border-r border-slate-300">
                                <div className="bg-slate-900 text-white p-1.5 font-bold uppercase tracking-wider text-[8px] flex justify-between">
                                  <span>Earnings</span>
                                  <span>Amount (INR)</span>
                                </div>
                                <div className="divide-y divide-slate-100 p-1.5 space-y-1 font-semibold text-[8px]">
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Basic Salary</span>
                                    <span>₹{fmt(basicAmt)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">House Rent Allowance (HRA)</span>
                                    <span>₹{fmt(hraAmt)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Special Allowance</span>
                                    <span>₹{fmt(specialAmt)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Conveyance Allowance</span>
                                    <span>₹{fmt(conveyanceAmt)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Medical Allowance</span>
                                    <span>₹{fmt(medicalAmt)}</span>
                                  </div>
                                  {ltaAmt > 0 && (
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">LTA Allowance</span>
                                      <span>₹{fmt(ltaAmt)}</span>
                                    </div>
                                  )}
                                  {inp.bonus > 0 && <div className="flex justify-between font-bold text-indigo-600"><span>Bonus Paid</span><span>₹{fmt(inp.bonus)}</span></div>}
                                  {inp.incentives > 0 && <div className="flex justify-between font-bold text-indigo-600"><span>Performance Incentives</span><span>₹{fmt(inp.incentives)}</span></div>}
                                  {inp.overtime > 0 && <div className="flex justify-between"><span>Overtime Pay</span><span>₹{fmt(inp.overtime)}</span></div>}
                                  {inp.reimbursements > 0 && <div className="flex justify-between"><span>Reimbursements</span><span>₹{fmt(inp.reimbursements)}</span></div>}
                                  {inp.customEarnings?.map((item: any) => {
                                    if (item.amount <= 0) return null;
                                    return (
                                      <div key={item.id} className="flex justify-between font-bold text-indigo-600">
                                        <span>{item.name}</span>
                                        <span>₹{fmt(item.amount)}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Deductions side */}
                              <div>
                                <div className="bg-slate-900 text-white p-1.5 font-bold uppercase tracking-wider text-[8px] flex justify-between">
                                  <span>Deductions</span>
                                  <span>Amount (INR)</span>
                                </div>
                                <div className="divide-y divide-slate-100 p-1.5 space-y-1 font-semibold text-[8px]">
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Provident Fund (Employee EPF)</span>
                                    <span className="text-rose-600">₹{fmt(calcs.employeePf)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">State ESIC Contribution</span>
                                    <span className="text-rose-600">₹{fmt(calcs.employeeEsi)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Professional Tax (PT)</span>
                                    <span className="text-rose-600">₹{fmt(calcs.professionalTax)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Monthly TDS (Income Tax)</span>
                                    <span className="text-rose-600">₹{fmt(calcs.estimatedTds)}</span>
                                  </div>
                                  {calcs.labourWelfareFund > 0 && (
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Labour Welfare Fund (LWF)</span>
                                      <span className="text-rose-600">₹{fmt(calcs.labourWelfareFund)}</span>
                                    </div>
                                  )}
                                  {inp.customDeductions?.map((item: any) => {
                                    if (item.amount <= 0) return null;
                                    return (
                                      <div key={item.id} className="flex justify-between font-bold text-rose-700">
                                        <span>{item.name}</span>
                                        <span className="text-rose-600">₹{fmt(item.amount)}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* Totals Block */}
                            <div className="grid grid-cols-2 gap-0 border-x border-b border-slate-300 font-extrabold text-[8px] mb-3">
                              <div className="p-1.5 border-r border-slate-300 flex justify-between bg-slate-50 text-slate-900">
                                <span>Total Gross Earnings:</span>
                                <span>₹{fmt(calcs.grossEarnings)}</span>
                              </div>
                              <div className="p-1.5 flex justify-between bg-slate-50 text-rose-800">
                                <span>Total Deductions:</span>
                                <span>₹{fmt(calcs.totalDeductions)}</span>
                              </div>
                            </div>

                            {/* Net payout highlight */}
                            <div className="border border-indigo-200 rounded p-2.5 flex items-center justify-between bg-indigo-50">
                              <div>
                                <span className="text-[7px] font-bold text-indigo-700 uppercase tracking-wider block">Net Take-Home Pay (Pushed to Bank)</span>
                                <span className="text-[8px] font-semibold text-slate-500 italic mt-0.5 block">"{numberToIndianWords(calcs.netPay)}"</span>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-base font-black text-indigo-900">INR {fmt(calcs.netPay)}</span>
                              </div>
                            </div>

                            {/* Footer disclaimer */}
                            <div className="mt-4 flex justify-between items-end border-t border-slate-200 pt-3 text-[7px] text-slate-400 font-semibold italic">
                              <div>
                                <p>System Generated Payslip. No signature required.</p>
                                <p className="mt-0.5">Generated by Bharat HRMS Cloud SaaS on {new Date().toLocaleDateString()}</p>
                              </div>
                              <div className="text-right">
                                <p>Employer Signature / Chop</p>
                                <div className="h-6 w-16 border-b border-slate-300 mt-0.5"></div>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="flex-grow px-2 py-1 font-serif text-slate-800">
                      <p className="text-right font-sans text-[8px] text-slate-400 font-bold mb-3">DATE: {previewItem.date}</p>
                      {renderBodyWithSignature(previewItem.body, previewItem.signature, "sm")}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-4 text-center font-sans">
                    <div className="w-full h-[1px] bg-[#f58220] mb-1.5"></div>
                    <div className="text-[7px] leading-normal mb-1">
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
                  <div className="h-5 bg-[#38a834] w-full absolute bottom-0 left-0 right-0"></div>
                </div>
              </div>

              <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
                <button 
                  onClick={() => handleDownloadPDF(previewItem)} 
                  className="rounded bg-emerald-600 hover:bg-emerald-700 px-4 py-2 font-bold text-white transition text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="size-4" /> Print
                </button>
                <button 
                  onClick={() => handleDownloadPDF(previewItem)} 
                  className="rounded bg-indigo-600 hover:bg-indigo-700 px-4 py-2 font-bold text-white transition text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="size-4" /> Download PDF
                </button>
                <button
                  onClick={() => setPreviewModalOpen(false)}
                  className="rounded border border-slate-200 bg-white px-4 py-2 font-bold text-slate-600 hover:bg-slate-50 transition text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </Card>
          </div>
        )}
      </section>
    </main>
  );
}
