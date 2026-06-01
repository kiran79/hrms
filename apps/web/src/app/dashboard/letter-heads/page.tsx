"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SaasSidebar } from "@/components/app/saas-sidebar";
import { Card, Badge } from "@/components/ui";
import { Search, Plus, X, FileText, Download, Eye, CheckCircle2, Mail } from "lucide-react";
import { defaultLetterheadTemplates } from "@/lib/data";

export default function LetterHeadsPage() {
  const router = useRouter();
  
  const [templates, setTemplates] = useState<any[]>([]);
  const [generatedLetters, setGeneratedLetters] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [company, setCompany] = useState<any | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"templates" | "generated">("templates");

  // Form states
  const [generateModal, setGenerateModal] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number>(1);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [letterTitle, setLetterTitle] = useState("");
  const [letterBody, setLetterBody] = useState("");

  const [previewItem, setPreviewItem] = useState<any | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Custom bindings for placeholders
  const [customExitDate, setCustomExitDate] = useState("2026-06-30");
  const [customEffectiveDate, setCustomEffectiveDate] = useState("2026-06-01");
  const [customHikePercentage, setCustomHikePercentage] = useState("15");
  const [customNewSalary, setCustomNewSalary] = useState("138000");

  // Template CRUD states
  const [templateModal, setTemplateModal] = useState(false);
  const [templateTitle, setTemplateTitle] = useState("");
  const [templateDesc, setTemplateDesc] = useState("");
  const [templateBody, setTemplateBody] = useState("");
  const [editTemplateId, setEditTemplateId] = useState<number | null>(null);

  const [companyEmail, setCompanyEmail] = useState("info@imxportex.com");
  const [primaryAddress, setPrimaryAddress] = useState("1-11-251/11, RKP MANSION, BEGUMPET, HYDERABAD – 500016");
  const [hrSignature, setHrSignature] = useState("");

  // Email modal states
  const [emailModal, setEmailModal] = useState(false);
  const [emailTargetLetter, setEmailTargetLetter] = useState<any | null>(null);
  const [emailRecipient, setEmailRecipient] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userType = localStorage.getItem("session_user_type");
      if (userType !== "company") {
        router.push("/login?tab=company");
        return;
      }

      // Load Templates with smart seeding of default templates & bodies
      const storedTemplates = localStorage.getItem("hrms_letterhead_templates");
      let parsedTemplates = storedTemplates ? JSON.parse(storedTemplates) : [];
      
      defaultLetterheadTemplates.forEach((dt: any) => {
        const existing = parsedTemplates.find((t: any) => t.id === dt.id);
        if (!existing) {
          parsedTemplates.push(dt);
        } else if (!existing.body) {
          existing.body = dt.body; // Seed body if it was missing from previous tasks
        }
      });
      
      localStorage.setItem("hrms_letterhead_templates", JSON.stringify(parsedTemplates));
      setTemplates(parsedTemplates);

      // Load Generated Letters
      const storedLetters = localStorage.getItem("hrms_generated_letters");
      if (storedLetters) {
        setGeneratedLetters(JSON.parse(storedLetters));
      } else {
        localStorage.setItem("hrms_generated_letters", JSON.stringify([]));
      }

      // Load Employees
      const storedEmp = localStorage.getItem("employees");
      if (storedEmp) {
        const emps = JSON.parse(storedEmp);
        setEmployees(emps);
        if (emps.length > 0) setSelectedEmpId(emps[0].id);
      }

      // Load Company Info
      const companyStr = localStorage.getItem("session_company");
      if (companyStr) {
        setCompany(JSON.parse(companyStr));
      }

      // Load Company Email
      const storedEmail = localStorage.getItem("session_company_email");
      if (storedEmail) {
        setCompanyEmail(storedEmail);
      }

      // Load Office Locations for primary address
      const storedLoc = localStorage.getItem("hrms_locations");
      if (storedLoc) {
        const locs = JSON.parse(storedLoc);
        if (locs.length > 0) {
          setPrimaryAddress(locs[0].address);
        }
      }

      // Load HR signature
      const storedSig = localStorage.getItem("hrms_hr_signature");
      if (storedSig) {
        setHrSignature(storedSig);
      }
    }
  }, [router]);

  const insertPlaceholder = (placeholder: string) => {
    const textarea = document.getElementById("letterBodyTextarea") as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      const newText = before + placeholder + after;
      setLetterBody(newText);
      
      // Put cursor right after the inserted placeholder
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + placeholder.length;
      }, 0);
    } else {
      setLetterBody(prev => prev + placeholder);
    }
  };

  const resolveLetterBody = (text: string, empId: string) => {
    if (!text) return "";
    const emp = employees.find(e => e.id === empId);
    
    // Calculate employee salary components
    const basic = emp?.salary?.basic || 0;
    const hra = emp?.salary?.hra || 0;
    const specialAllowance = emp?.salary?.specialAllowance || 0;
    const conveyance = emp?.salary?.conveyance || 0;
    const medicalAllowance = emp?.salary?.medicalAllowance || 0;
    const lta = emp?.salary?.lta || 0;
    
    const netSalaryVal = basic + hra + specialAllowance + conveyance + medicalAllowance + lta;
    const ctcVal = netSalaryVal; // Or ctc calculation
    
    const replacements: { [key: string]: string } = {
      "{Employee Name}": emp?.fullName || "John Doe",
      "{Employee ID}": emp?.id || "EMP-000",
      "{Designation}": emp?.designation || "Software Engineer",
      "{Department}": emp?.department || "Technology",
      "{Joining Date}": emp?.dateOfJoining || "2026-06-01",
      "{Exit Date}": customExitDate,
      "{Basic Salary}": `₹${basic.toLocaleString("en-IN")}`,
      "{Net Salary}": `₹${netSalaryVal.toLocaleString("en-IN")}`,
      "{CTC}": `₹${ctcVal.toLocaleString("en-IN")}`,
      "{Hike Percentage}": customHikePercentage,
      "{New Salary}": `₹${Number(customNewSalary || 0).toLocaleString("en-IN")}`,
      "{Effective Date}": customEffectiveDate,
      "{Company Name}": company?.name || "Acme India Pvt Ltd",
      "{Domain}": company?.domain || "hr.acmeindia.in",
      "{Current Date}": new Date().toISOString().split("T")[0]
    };

    let resolved = text;
    Object.entries(replacements).forEach(([placeholder, value]) => {
      resolved = resolved.split(placeholder).join(value);
    });

    return resolved;
  };

  const renderBodyWithSignature = (text: string, signatureBase64: string, size: "sm" | "md" | "lg" = "md") => {
    if (!text) return null;
    
    const isSm = size === "sm";
    const isLg = size === "lg";
    
    const sigImgClass = isSm ? "h-6 mb-0.5" : isLg ? "h-12 mb-1.5" : "h-9 mb-1";
    const sigBoxClass = isSm ? "h-6 w-16 text-[6px]" : isLg ? "h-10 w-28 text-[11px]" : "h-8 w-24 text-[9px]";
    const titleClass = isSm ? "text-[8px] font-extrabold text-slate-600" : isLg ? "text-xs font-extrabold text-slate-700" : "text-[10px] font-extrabold text-slate-700";
    const subtitleClass = isSm ? "text-[6px] text-slate-400" : isLg ? "text-[10px] text-slate-400" : "text-[8px] text-slate-400";
    const marginClass = isSm ? "my-2" : isLg ? "my-4" : "my-3";

    const match = text.match(/(Yours Sincerely\s*,?|Sincerely\s*,?|Yours Faithfully\s*,?)/i);
    if (match && match.index !== undefined) {
      const splitIndex = match.index + match[0].length;
      const beforeText = text.substring(0, splitIndex);
      const afterText = text.substring(splitIndex);
      
      return (
        <div className="whitespace-pre-line text-left">
          {beforeText}
          <div className={`${marginClass} flex flex-col items-start select-none`}>
            {signatureBase64 ? (
              <img src={signatureBase64} alt="HR Signature" className={`${sigImgClass} object-contain`} />
            ) : (
              <div className={`${sigBoxClass} border border-dashed border-slate-200 rounded flex items-center justify-center text-slate-300`}>
                No Signature
              </div>
            )}
            <span className={titleClass}>Concerned HR Manager</span>
            <span className={subtitleClass}>Authorized Signatory</span>
          </div>
          {afterText}
        </div>
      );
    }
    
    return (
      <div className="whitespace-pre-line text-left">
        {text}
        <div className={`${marginClass} flex flex-col items-start select-none`}>
          {signatureBase64 ? (
            <img src={signatureBase64} alt="HR Signature" className={`${sigImgClass} object-contain`} />
          ) : (
            <div className={`${sigBoxClass} border border-dashed border-slate-200 rounded flex items-center justify-center text-slate-300`}>
              No Signature
            </div>
          )}
          <span className={titleClass}>Concerned HR Manager</span>
          <span className={subtitleClass}>Authorized Signatory</span>
        </div>
      </div>
    );
  };

  const handleOpenAddTemplate = () => {
    setEditTemplateId(null);
    setTemplateTitle("");
    setTemplateDesc("");
    setTemplateBody("");
    setError(null);
    setSuccess(null);
    setTemplateModal(true);
  };

  const handleOpenEditTemplate = (template: any) => {
    setEditTemplateId(template.id);
    setTemplateTitle(template.title);
    setTemplateDesc(template.description);
    setTemplateBody(template.body || "");
    setError(null);
    setSuccess(null);
    setTemplateModal(true);
  };

  const handleDeleteTemplate = (id: number) => {
    if (confirm("Are you sure you want to delete this template?")) {
      const updated = templates.filter(t => t.id !== id);
      setTemplates(updated);
      localStorage.setItem("hrms_letterhead_templates", JSON.stringify(updated));
      setSuccess("Template deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!templateTitle.trim() || !templateBody.trim()) {
      setError("Please provide template title and content.");
      return;
    }

    let updated;
    if (editTemplateId !== null) {
      updated = templates.map(t => t.id === editTemplateId ? { ...t, title: templateTitle, description: templateDesc, body: templateBody } : t);
      setSuccess("Template updated successfully!");
    } else {
      const newId = templates.length > 0 ? Math.max(...templates.map(t => t.id)) + 1 : 1;
      const payload = {
        id: newId,
        title: templateTitle,
        description: templateDesc,
        body: templateBody
      };
      updated = [...templates, payload];
      setSuccess("Template added successfully!");
    }

    setTemplates(updated);
    localStorage.setItem("hrms_letterhead_templates", JSON.stringify(updated));
    setTimeout(() => setTemplateModal(false), 800);
  };

  const handleTemplateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension === 'docx') {
        setError("Word document (.docx) binary parsing is restricted client-side. Please convert to plain text (.txt) or HTML format, or copy-paste content directly.");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setTemplateBody(text || "");
        setSuccess("Template file loaded successfully!");
        setError(null);
      };
      reader.readAsText(file);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setHrSignature(base64);
        localStorage.setItem("hrms_hr_signature", base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveSignature = () => {
    setHrSignature("");
    localStorage.removeItem("hrms_hr_signature");
  };

  const handleOpenGenerate = (template: any) => {
    setSelectedTemplateId(template.id);
    setLetterTitle(`Generated ${template.title}`);
    setLetterBody(template.body || `Dear {Employee Name},\n\nThis is an official document from {Company Name}.\n\nSincerely,\nHR Department`);
    
    const storedSig = localStorage.getItem("hrms_hr_signature");
    if (storedSig) {
      setHrSignature(storedSig);
    } else {
      setHrSignature("");
    }
    
    setError(null);
    setSuccess(null);
    setGenerateModal(true);
  };

  const handleEmpChange = (empId: string) => {
    setSelectedEmpId(empId);
  };

  const handleGenerateLetter = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!letterTitle.trim() || !letterBody.trim()) {
      setError("Please specify letter title and body content.");
      return;
    }

    const empObj = employees.find(e => e.id === selectedEmpId);
    const resolvedBodyText = resolveLetterBody(letterBody, selectedEmpId);

    const newId = generatedLetters.length > 0 ? Math.max(...generatedLetters.map(l => l.id)) + 1 : 1;
    const payload = {
      id: newId,
      templateId: Number(selectedTemplateId),
      title: letterTitle,
      body: resolvedBodyText,
      employeeId: selectedEmpId,
      employeeName: empObj?.fullName || "Employee",
      signature: hrSignature,
      date: new Date().toISOString().split("T")[0]
    };

    const updated = [payload, ...generatedLetters];
    setGeneratedLetters(updated);
    localStorage.setItem("hrms_generated_letters", JSON.stringify(updated));

    // Also auto-save to Employee Documents Module
    try {
      const storedDocs = localStorage.getItem("hrms_employee_documents");
      const currentDocs = storedDocs ? JSON.parse(storedDocs) : [];
      const docId = currentDocs.length > 0 ? Math.max(...currentDocs.map((d: any) => d.id)) + 1 : 1;
      const newDoc = {
        id: docId,
        employeeId: selectedEmpId,
        title: letterTitle,
        date: new Date().toISOString().split("T")[0],
        type: "Generated Letter",
        fileSize: `${Math.round(resolvedBodyText.length / 1024 * 100) / 100} KB`,
        body: resolvedBodyText,
        signature: hrSignature,
        isGenerated: true,
        fileName: `${letterTitle.replace(/\s+/g, "_")}.pdf`
      };
      localStorage.setItem("hrms_employee_documents", JSON.stringify([newDoc, ...currentDocs]));
    } catch (e) {
      console.error("Failed to auto-save to employee documents:", e);
    }

    setSuccess("Document generated successfully! Sent to employee documents folder.");
    setTimeout(() => setGenerateModal(false), 800);
  };

  const handleOpenPreview = (letter: any) => {
    setPreviewItem(letter);
    setPreviewModal(true);
  };

  const handleOpenEmailModal = (letter: any) => {
    const empObj = employees.find(e => e.id === letter.employeeId);
    setEmailTargetLetter(letter);
    setEmailRecipient(empObj?.email || "employee@example.com");
    setEmailSubject(`Signed Document: ${letter.title}`);
    setEmailBody(`Dear ${letter.employeeName},\n\nPlease find attached your signed copy of ${letter.title} generated on ${letter.date}.\n\nThis is an official communication from IMXPORTEX EWORLD PRIVATE LIMTED.\n\nBest regards,\nHR Department\nIMXPORTEX EWORLD PRIVATE LIMTED`);
    setEmailSuccess(false);
    setIsSendingEmail(false);
    setEmailModal(true);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingEmail(true);
    setTimeout(() => {
      setIsSendingEmail(false);
      setEmailSuccess(true);
      setTimeout(() => {
        setEmailModal(false);
      }, 1500);
    }, 1500);
  };

  const handleDownloadPDF = (letter: any) => {
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
          <title>${letter.title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
            
            @page {
              size: A4;
              margin: 0;
            }
            
            body {
              margin: 0;
              padding: 0;
              font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
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
              padding: 45mm 25mm 40mm 25mm;
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
              font-size: 22px;
              line-height: 1;
              letter-spacing: -0.5px;
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
              align-items: flex-start;
              text-align: left;
            }
            
            .signature-img {
              height: 40px;
              object-fit: contain;
              margin-bottom: 4px;
            }
            
            .signature-placeholder {
              height: 40px;
              width: 100px;
              border: 1px dashed #cbd5e1;
              border-radius: 4px;
              margin-bottom: 4px;
            }
            
            .signatory-title {
              font-weight: 800;
              font-size: 10px;
              color: #475569;
            }
            
            .signatory-subtitle {
              font-size: 8px;
              color: #94a3b8;
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
                <div class="tagline">Global Reach | Global Presence</div>
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
      doc.close();
      
      setTimeout(() => {
        iframe.contentWindow?.focus();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1500);
      }, 500);
    }
  };

  const filteredTemplates = templates.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredLetters = generatedLetters.filter(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()) || l.employeeName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[280px_1fr]">
      <SaasSidebar active="Letter Heads" />

      <section className="p-6 lg:p-8 overflow-y-auto">
        {/* Header */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white -mx-6 -mt-6 p-6 lg:-mx-8 lg:-mt-8 shadow-sm">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Corporate Letter Heads</h2>
            <p className="mt-1 text-sm text-slate-500">Design letterhead layouts and generate official signed documents for employees.</p>
          </div>
          {activeTab === "templates" && (
            <button
              onClick={handleOpenAddTemplate}
              className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-xs font-black text-white shadow hover:bg-indigo-700 transition"
            >
              <Plus className="size-4" /> Add Template
            </button>
          )}
        </header>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 mb-6 text-xs font-bold text-slate-400">
          <button
            onClick={() => setActiveTab("templates")}
            className={`py-3 px-6 border-b-2 transition ${activeTab === "templates" ? "border-indigo-600 text-indigo-600 font-extrabold" : "border-transparent hover:text-slate-700"}`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab("generated")}
            className={`py-3 px-6 border-b-2 transition ${activeTab === "generated" ? "border-indigo-600 text-indigo-600 font-extrabold" : "border-transparent hover:text-slate-700"}`}
          >
            Generated Letters
          </button>
        </div>

        {/* Search */}
        <div className="mb-6 bg-white p-4 rounded-lg border border-slate-200 shadow-sm max-w-md">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
              <Search className="size-4" />
            </span>
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-md border border-slate-200 pl-9 pr-4 text-sm outline-none focus:border-indigo-500 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Grid List */}
        {activeTab === "templates" ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map(t => (
              <Card key={t.id} className="border-slate-200 p-5 bg-white shadow-sm hover:border-indigo-200 transition flex flex-col justify-between h-44">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-indigo-50 rounded text-indigo-600">
                      <FileText className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 text-sm">{t.title}</h3>
                      <p className="text-[9px] text-slate-400 font-mono mt-0.5">Template ID: LH-0{t.id}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-3 font-normal">{t.description}</p>
                </div>
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEditTemplate(t)}
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      Edit
                    </button>
                    <span className="text-slate-200">|</span>
                    <button
                      onClick={() => handleDeleteTemplate(t.id)}
                      className="text-[10px] font-bold text-rose-600 hover:text-rose-800"
                    >
                      Delete
                    </button>
                  </div>
                  <button
                    onClick={() => handleOpenGenerate(t)}
                    className="inline-flex items-center gap-1.5 rounded bg-indigo-600 hover:bg-indigo-700 transition text-white px-2.5 py-1.5 text-[10px] font-bold shadow"
                  >
                    Generate Letter
                  </button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-slate-200 shadow-sm overflow-hidden p-0 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Document Title</th>
                    <th className="p-4">Employee</th>
                    <th className="p-4">Creation Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {filteredLetters.length > 0 ? (
                    filteredLetters.map((letter) => (
                      <tr key={letter.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded text-indigo-600">
                              <FileText className="size-4" />
                            </div>
                            <span className="font-black text-slate-800 text-sm">{letter.title}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600">{letter.employeeName} ({letter.employeeId})</td>
                        <td className="p-4 text-slate-500 font-mono font-bold">{letter.date}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenPreview(letter)}
                              className="inline-flex items-center gap-1.5 rounded border border-indigo-200 bg-white hover:bg-indigo-50 transition text-indigo-600 px-3 py-1.5 font-bold"
                            >
                              <Eye className="size-3.5" /> Preview Frame
                            </button>
                            <button
                              onClick={() => handleOpenEmailModal(letter)}
                              className="inline-flex items-center gap-1.5 rounded bg-emerald-600 hover:bg-emerald-700 transition text-white px-3 py-1.5 font-bold"
                            >
                              <Mail className="size-3.5" /> Email Employee
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-400 font-semibold">
                        No generated documents recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* MODAL: Generate Letter Form */}
        {generateModal && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-7xl h-[85vh] border-slate-200 bg-slate-50 shadow-2xl relative animate-in zoom-in-95 duration-150 flex flex-col p-0 overflow-hidden">
              {/* Modal Header */}
              <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-base font-black text-slate-900">Configure & Generate Corporate Letter</h3>
                  <p className="text-xs text-slate-400">Map employee profiles, configure variable placeholders, customize letter content, and preview real-time resolved document outputs.</p>
                </div>
                <button onClick={() => setGenerateModal(false)} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
                  <X className="size-5" />
                </button>
              </div>

              {/* Modal Body - 4 Columns */}
              <div className="flex-1 min-h-0 flex divide-x divide-slate-200">
                
                {/* Column 1: Selection & Variable Inputs (Scrollable) */}
                <div className="w-80 bg-white p-5 overflow-y-auto space-y-4 shrink-0">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2">1. Select Target & Title</h4>
                  <div className="space-y-3">
                    <label className="grid gap-1 text-[11px] font-bold text-slate-500 uppercase">
                      Target Employee
                      <select
                        value={selectedEmpId}
                        onChange={(e) => handleEmpChange(e.target.value)}
                        className="h-10 w-full rounded border border-slate-200 px-3 bg-white font-normal outline-none focus:border-indigo-500 text-xs"
                      >
                        {employees.map(e => (
                          <option key={e.id} value={e.id}>{e.fullName} ({e.id})</option>
                        ))}
                      </select>
                    </label>
                    
                    <label className="grid gap-1 text-[11px] font-bold text-slate-500 uppercase">
                      Document Title
                      <input
                        type="text"
                        value={letterTitle}
                        onChange={e => setLetterTitle(e.target.value)}
                        placeholder="e.g. Offer Letter - John Doe"
                        className="h-10 w-full rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 text-xs"
                        required
                      />
                    </label>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2">2. Custom Placeholder Inputs</h4>
                    <p className="text-[10px] text-slate-400 mb-3 font-medium">Specify additional variables not fetched from the employee profile.</p>
                    <div className="space-y-3 text-xs">
                      <label className="grid gap-1 text-[11px] font-bold text-slate-500 uppercase">
                        Exit Date
                        <input
                          type="date"
                          value={customExitDate}
                          onChange={e => setCustomExitDate(e.target.value)}
                          className="h-9 w-full rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500"
                        />
                      </label>

                      <label className="grid gap-1 text-[11px] font-bold text-slate-500 uppercase">
                        Effective Date
                        <input
                          type="date"
                          value={customEffectiveDate}
                          onChange={e => setCustomEffectiveDate(e.target.value)}
                          className="h-9 w-full rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500"
                        />
                      </label>

                      <div className="grid grid-cols-2 gap-2">
                        <label className="grid gap-1 text-[11px] font-bold text-slate-500 uppercase">
                          Hike %
                          <input
                            type="number"
                            value={customHikePercentage}
                            onChange={e => setCustomHikePercentage(e.target.value)}
                            className="h-9 w-full rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500"
                          />
                        </label>
                        <label className="grid gap-1 text-[11px] font-bold text-slate-500 uppercase">
                          New Salary
                          <input
                            type="number"
                            value={customNewSalary}
                            onChange={e => setCustomNewSalary(e.target.value)}
                            className="h-9 w-full rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2">3. HR Manager Signature</h4>
                    <p className="text-[10px] text-slate-400 mb-3 font-medium">Upload signature image to embed directly on the letter.</p>
                    <div className="space-y-3 text-xs">
                      {hrSignature ? (
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-24 rounded border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center shrink-0">
                            <img src={hrSignature} alt="Signature Preview" className="size-full object-contain" />
                            <button
                              type="button"
                              onClick={handleRemoveSignature}
                              className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition flex items-center justify-center text-white text-[9px] font-bold"
                            >
                              Remove
                            </button>
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold">Signature uploaded</span>
                        </div>
                      ) : (
                        <label className="grid gap-1 text-[11px] font-bold text-slate-500 uppercase">
                          Upload Signature Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleSignatureUpload}
                            className="text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-indigo-50 file:text-indigo-700 file:hover:bg-indigo-100 file:cursor-pointer"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Column 2: Template Body Editor */}
                <div className="flex-1 flex flex-col bg-white min-w-0">
                  <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">3. Edit Letter Template Body</span>
                    <span className="text-[10px] text-slate-400 font-medium">Edit text freely. Insert placeholders via panel.</span>
                  </div>
                  <div className="flex-1 p-5 min-h-0 flex flex-col">
                    <textarea
                      id="letterBodyTextarea"
                      value={letterBody}
                      onChange={e => setLetterBody(e.target.value)}
                      className="flex-1 w-full rounded border border-slate-200 p-4 font-mono text-xs leading-relaxed outline-none focus:border-indigo-500 bg-slate-50/30 resize-none"
                      placeholder="Type your letter content here..."
                      required
                    />
                  </div>
                </div>

                {/* Column 3: Clickable Placeholders Panel */}
                <div className="w-64 bg-slate-50 p-5 overflow-y-auto space-y-4 shrink-0 flex flex-col">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-1">Placeholders</h4>
                  <p className="text-[10px] text-slate-400 leading-normal mb-2">Click any placeholder to insert it into the letter body at your cursor position:</p>
                  
                  <div className="space-y-4 flex-1">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Employee Info</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "{Employee Name}",
                          "{Employee ID}",
                          "{Designation}",
                          "{Department}",
                          "{Joining Date}",
                          "{Basic Salary}",
                          "{Net Salary}",
                          "{CTC}"
                        ].map(ph => (
                          <button
                            key={ph}
                            type="button"
                            onClick={() => insertPlaceholder(ph)}
                            className="px-2 py-1 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-[10px] font-bold text-left border border-indigo-100/50 transition cursor-pointer"
                          >
                            {ph}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Offboarding</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "{Exit Date}"
                        ].map(ph => (
                          <button
                            key={ph}
                            type="button"
                            onClick={() => insertPlaceholder(ph)}
                            className="px-2 py-1 rounded bg-amber-50 text-amber-700 hover:bg-amber-100 text-[10px] font-bold text-left border border-amber-100/50 transition cursor-pointer"
                          >
                            {ph}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Appraisal & Hike</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "{Hike Percentage}",
                          "{New Salary}",
                          "{Effective Date}"
                        ].map(ph => (
                          <button
                            key={ph}
                            type="button"
                            onClick={() => insertPlaceholder(ph)}
                            className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10px] font-bold text-left border border-emerald-100/50 transition cursor-pointer"
                          >
                            {ph}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Company & System</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "{Company Name}",
                          "{Domain}",
                          "{Current Date}"
                        ].map(ph => (
                          <button
                            key={ph}
                            type="button"
                            onClick={() => insertPlaceholder(ph)}
                            className="px-2 py-1 rounded bg-slate-200 text-slate-700 hover:bg-slate-300 text-[10px] font-bold text-left border border-slate-300/50 transition cursor-pointer"
                          >
                            {ph}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
                               {/* Column 4: Live Simulated PDF Letterhead Preview (Scrollable) */}
                <div className="w-[450px] bg-slate-100 p-5 overflow-y-auto shrink-0 flex flex-col min-w-0">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2 shrink-0">Live Letterhead Preview</h4>
                  <div className="flex-1 bg-white border border-slate-300 rounded shadow-md pt-10 pb-16 px-8 text-slate-800 flex flex-col justify-between font-serif text-[11px] leading-relaxed whitespace-pre-line relative min-h-[600px] select-none overflow-hidden">
                    {/* Top Green Bar */}
                    <div className="h-3 bg-[#38a834] w-full absolute top-0 left-0 right-0"></div>

                    {/* Header */}
                    <div className="pb-3 mb-4 flex justify-between items-start border-b border-slate-100">
                      <div>
                        {/* Empty spacing */}
                      </div>
                      <div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center select-none leading-none gap-0.5">
                            <span className="text-[#f15a24] font-sans font-extrabold text-sm tracking-tight">im</span>
                            <span className="text-[#0071bc] font-sans font-extrabold text-sm tracking-tight">xp</span>
                            <span className="inline-block mx-0.5" style={{ width: '12px', height: '12px' }}>
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
                            <span className="text-[#0071bc] font-sans font-extrabold text-sm tracking-tight">rt</span>
                            <span className="text-[#8cc63f] font-sans font-extrabold text-sm tracking-tight">ex</span>
                          </div>
                          <div className="text-[5px] text-[#0071bc] font-black tracking-wider uppercase font-sans mt-0.5">
                            Global Reach <span className="text-slate-300 mx-0.5">|</span> Global Presence
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Date & Body */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-right font-sans text-[8px] text-slate-400 font-bold mb-2">DATE: {new Date().toISOString().split("T")[0]}</p>
                        <div className="text-slate-800 text-[10px] font-medium leading-relaxed font-serif">
                          {renderBodyWithSignature(resolveLetterBody(letterBody, selectedEmpId), hrSignature, "sm")}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-2 text-center font-sans">
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
                    </div>

                    {/* Bottom Green Bar */}
                    <div className="h-5 bg-[#38a834] w-full absolute bottom-0 left-0 right-0"></div>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3 shrink-0">
                {error && <div className="text-xs font-bold text-rose-600 mr-auto">{error}</div>}
                {success && <div className="text-xs font-bold text-emerald-600 mr-auto animate-pulse">{success}</div>}
                <button type="button" onClick={() => setGenerateModal(false)} className="rounded border border-slate-200 bg-white px-4 py-2 font-bold text-slate-600 hover:bg-slate-50 transition text-xs">
                  Cancel
                </button>
                <button onClick={handleGenerateLetter} className="rounded bg-indigo-600 hover:bg-indigo-700 transition px-5 py-2 font-bold text-white shadow text-xs">
                  Generate & Lock PDF
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* MODAL: Preview Generated Letter (Header/Footer Frame) */}
        {previewModal && previewItem && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl border-slate-200 bg-white shadow-2xl relative p-0 overflow-hidden animate-in zoom-in-95 duration-150">
              <div className="bg-slate-950 p-4 text-white flex items-center justify-between">
                <span className="font-extrabold text-sm flex items-center gap-1.5"><FileText className="size-4 text-indigo-400" /> Letter Head Preview Frame</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleDownloadPDF(previewItem)} className="rounded bg-indigo-600 hover:bg-indigo-700 p-1.5 transition text-white flex items-center gap-1 text-[10px] font-bold px-3 py-1.5"><Download className="size-3.5" /> PDF Download</button>
                  <button onClick={() => setPreviewModal(false)} className="rounded bg-slate-800 hover:bg-slate-700 p-1.5 transition text-slate-400 hover:text-white"><X className="size-4" /></button>
                </div>
              </div>

              {/* Simulated PDF Page */}
              <div className="p-12 bg-white text-slate-800 min-h-[550px] flex flex-col justify-between border-4 border-slate-200 m-6 shadow-inner font-serif text-sm leading-relaxed whitespace-pre-line relative overflow-hidden pt-14 pb-20">
                {/* Top Green Bar */}
                <div className="h-4 bg-[#38a834] w-full absolute top-0 left-0 right-0"></div>

                {/* Header */}
                <div className="pb-4 mb-8 flex justify-between items-start border-b border-slate-100">
                  <div>
                    {/* Empty spacing */}
                  </div>
                  <div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center select-none leading-none gap-0.5">
                        <span className="text-[#f15a24] font-sans font-extrabold text-xl tracking-tight">im</span>
                        <span className="text-[#0071bc] font-sans font-extrabold text-xl tracking-tight">xp</span>
                        <span className="inline-block mx-0.5" style={{ width: '18px', height: '18px' }}>
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
                        <span className="text-[#0071bc] font-sans font-extrabold text-xl tracking-tight">rt</span>
                        <span className="text-[#8cc63f] font-sans font-extrabold text-xl tracking-tight">ex</span>
                      </div>
                      <div className="text-[7px] text-[#0071bc] font-bold tracking-wider uppercase font-sans mt-0.5">
                        Global Reach <span className="text-slate-300 mx-0.5">|</span> Global Presence
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="flex-grow px-4 py-2 font-serif">
                  <p className="text-right font-sans text-[10px] text-slate-400 font-bold mb-4">DATE: {previewItem.date}</p>
                  <div className="text-slate-800 text-xs font-medium font-serif leading-relaxed">
                    {renderBodyWithSignature(previewItem.body, previewItem.signature, "md")}
                  </div>
                </div>

                {/* Footer Separator & Info */}
                <div className="mt-6 text-center font-sans">
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
                <div className="h-8 bg-[#38a834] w-full absolute bottom-0 left-0 right-0"></div>
              </div>
              <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end">
                <button
                  onClick={() => setPreviewModal(false)}
                  className="rounded border border-slate-200 bg-white px-5 py-2 font-bold text-slate-600 hover:bg-slate-50 transition text-xs"
                >
                  Close Preview
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* MODAL: Add/Edit Template */}
        {templateModal && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl border-slate-200 bg-white p-6 shadow-2xl relative animate-in zoom-in-95 duration-150 flex flex-col">
              <button onClick={() => setTemplateModal(false)} className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
                <X className="size-5" />
              </button>
              <h3 className="text-base font-black text-slate-900 mb-2">{editTemplateId !== null ? "Edit Letterhead Template" : "Add Letterhead Template"}</h3>
              <p className="text-xs text-slate-400 mb-4">Configure template details or upload a draft template from your drive.</p>
              
              {error && <div className="mb-4 rounded-md bg-rose-50 p-3 text-xs font-bold text-rose-800 border border-rose-100">{error}</div>}
              {success && <div className="mb-4 rounded-md bg-emerald-50 p-3 text-xs font-bold text-emerald-800 border border-emerald-100 animate-pulse">{success}</div>}
              
              <form onSubmit={handleSaveTemplate} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    Template Name/Title
                    <input 
                      type="text" 
                      value={templateTitle} 
                      onChange={e => setTemplateTitle(e.target.value)} 
                      placeholder="e.g. Experience Certificate" 
                      className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30" 
                      required 
                    />
                  </label>
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    Brief Description
                    <input 
                      type="text" 
                      value={templateDesc} 
                      onChange={e => setTemplateDesc(e.target.value)} 
                      placeholder="e.g. Standard certificate for outgoing employees." 
                      className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30" 
                    />
                  </label>
                </div>

                <div className="border border-slate-200 rounded p-4 bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-600 uppercase text-[10px]">Import Template File from Drive</span>
                    <input
                      type="file"
                      accept=".txt,.html,.htm,.docx"
                      onChange={handleTemplateFileUpload}
                      className="text-[10px] text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-indigo-50 file:text-indigo-700 file:hover:bg-indigo-100 file:cursor-pointer"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">Supports uploading plain text (`.txt`), HTML templates, or Word docs. We will read the textual draft content directly.</p>
                </div>

                <label className="grid gap-1 font-bold text-slate-500 uppercase">
                  Template Body Content (with placeholders)
                  <textarea 
                    value={templateBody} 
                    onChange={e => setTemplateBody(e.target.value)} 
                    placeholder="Type template layout here. Use standard placeholders like {Employee Name}, {Joining Date}, {Exit Date}, {Net Salary}..." 
                    className="h-48 rounded border border-slate-200 p-3 font-mono font-normal outline-none focus:border-indigo-500 bg-slate-50/30 resize-none leading-relaxed" 
                    required 
                  />
                </label>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setTemplateModal(false)} className="rounded border border-slate-200 bg-white px-4 py-2.5 font-bold text-slate-600 hover:bg-slate-50 transition">Cancel</button>
                  <button type="submit" className="rounded bg-indigo-600 hover:bg-indigo-700 transition px-5 py-2.5 font-bold text-white shadow">Save Template</button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* MODAL: Email Employee */}
        {emailModal && emailTargetLetter && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-lg border-slate-200 bg-white p-6 shadow-2xl relative animate-in zoom-in-95 duration-150 flex flex-col">
              <button onClick={() => setEmailModal(false)} className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
                <X className="size-5" />
              </button>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-emerald-50 rounded text-emerald-600">
                  <Mail className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Email Generated Letter</h3>
                  <p className="text-[10px] text-slate-400">Directly dispatch the signed document to the employee's inbox.</p>
                </div>
              </div>

              {emailSuccess ? (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                  <CheckCircle2 className="size-12 text-emerald-500 animate-bounce" />
                  <h4 className="text-sm font-black text-slate-800">Email Dispatched!</h4>
                  <p className="text-xs text-slate-500">The PDF document with authorized HR signature has been successfully emailed to <strong>{emailRecipient}</strong>.</p>
                </div>
              ) : (
                <form onSubmit={handleSendEmail} className="space-y-4 text-xs">
                  <div className="space-y-3">
                    <label className="grid gap-1 font-bold text-slate-500 uppercase">
                      Recipient Email
                      <input 
                        type="email" 
                        value={emailRecipient} 
                        onChange={e => setEmailRecipient(e.target.value)} 
                        placeholder="employee@imxportex.com" 
                        className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30" 
                        required 
                      />
                    </label>

                    <label className="grid gap-1 font-bold text-slate-500 uppercase">
                      Subject
                      <input 
                        type="text" 
                        value={emailSubject} 
                        onChange={e => setEmailSubject(e.target.value)} 
                        placeholder="Signed Document" 
                        className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30" 
                        required 
                      />
                    </label>

                    <label className="grid gap-1 font-bold text-slate-500 uppercase">
                      Message Body
                      <textarea 
                        value={emailBody} 
                        onChange={e => setEmailBody(e.target.value)} 
                        rows={5}
                        className="rounded border border-slate-200 p-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30 resize-none leading-relaxed" 
                        required 
                      />
                    </label>

                    <div className="border border-slate-100 rounded-md p-3 bg-slate-50/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="size-5 text-indigo-500" />
                        <div>
                          <p className="font-extrabold text-[10px] text-slate-700 truncate max-w-[240px]">{emailTargetLetter.title}.pdf</p>
                          <p className="text-[8px] text-slate-400 font-medium">PDF Attachment • Contains HR Signature</p>
                        </div>
                      </div>
                      <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-50 text-[8px] font-bold">Auto Attached</Badge>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button type="button" onClick={() => setEmailModal(false)} className="rounded border border-slate-200 bg-white px-4 py-2 font-bold text-slate-600 hover:bg-slate-50 transition">Cancel</button>
                    <button 
                      type="submit" 
                      disabled={isSendingEmail}
                      className="rounded bg-emerald-600 hover:bg-emerald-700 transition px-5 py-2 font-bold text-white shadow flex items-center gap-1.5"
                    >
                      {isSendingEmail ? (
                        <>
                          <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="size-3.5" /> Send Email
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </Card>
          </div>
        )}
      </section>
    </main>
  );
}
