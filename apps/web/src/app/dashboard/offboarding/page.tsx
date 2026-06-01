"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { SaasSidebar } from "@/components/app/saas-sidebar";
import { Card, Badge } from "@/components/ui";
import { Search, Plus, Check, X, ShieldAlert, FileText, CheckCircle, RefreshCw, Upload, Calendar, AlertCircle, Laptop } from "lucide-react";
import { defaultOffboardings } from "@/lib/data";

function OffboardingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subTab = searchParams.get("sub") || "resignations";

  const [activeFilter, setActiveFilter] = useState<"Pending" | "Approved" | "Rejected">("Pending");

  // Collections
  const [offboardings, setOffboardings] = useState<any[]>([]);
  const [warnings, setWarnings] = useState<any[]>([]);
  const [terminations, setTerminations] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  
  const [viewMode, setViewMode] = useState<"self" | "manager">("manager");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [currentUserEmpId, setCurrentUserEmpId] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  // Warning Modal & Form states
  const [warningModal, setWarningModal] = useState(false);
  const [warningUser, setWarningUser] = useState("");
  const [warningTitle, setWarningTitle] = useState("");
  const [warningDate, setWarningDate] = useState("");
  const [warningDesc, setWarningDesc] = useState("");
  const [warningTemplate, setWarningTemplate] = useState("Warning Details:\n\nYou are hereby issued a formal warning regarding performance or behavioral concerns. Please ensure regular compliance with company rules.");
  const [editingWarningId, setEditingWarningId] = useState<number | null>(null);

  // Termination Modal & Form states
  const [terminationModal, setTerminationModal] = useState(false);
  const [terminationUser, setTerminationUser] = useState("");
  const [terminationNoticeDate, setTerminationNoticeDate] = useState("");
  const [terminationDate, setTerminationDate] = useState("");
  const [terminationTitle, setTerminationTitle] = useState("");
  const [terminationDesc, setTerminationDesc] = useState("");
  const [terminationTemplate, setTerminationTemplate] = useState("Termination Notice Details:\n\nFollowing official review, we regret to inform you that your employment with the company stands terminated. Your notice period and final settlement terms are enclosed.");
  const [editingTerminationId, setEditingTerminationId] = useState<number | null>(null);

  // Complaint Modal & Form states
  const [complaintModal, setComplaintModal] = useState(false);
  const [complaintTitle, setComplaintTitle] = useState("");
  const [complaintDate, setComplaintDate] = useState("");
  const [complaintFrom, setComplaintFrom] = useState("");
  const [complaintTo, setComplaintTo] = useState("");
  const [complaintDoc, setComplaintDoc] = useState("");
  const [complaintStatus, setComplaintStatus] = useState<"Pending" | "Approved" | "Rejected">("Pending");
  const [complaintDesc, setComplaintDesc] = useState("");
  const [complaintTemplate, setComplaintTemplate] = useState("Complaint Details:\n\nA grievance has been officially filed. Our ethics committee will review the details and initiate a formal response.");
  const [editingComplaintId, setEditingComplaintId] = useState<number | null>(null);

  // Clearances Workflow Modal states
  const [clearanceModal, setClearanceModal] = useState(false);
  const [activeResignation, setActiveResignation] = useState<any | null>(null);
  const [selectedAssetsToReturn, setSelectedAssetsToReturn] = useState<number[]>([]);
  const [hrStage, setHrStage] = useState<"Pending" | "In Progress" | "Approved" | "Rejected">("Pending");
  const [hrNotes, setHrNotes] = useState("");
  const [financeStage, setFinanceStage] = useState<"Pending" | "In Progress" | "Approved" | "Rejected">("Pending");
  const [financeNotes, setFinanceNotes] = useState("");
  const [itStage, setITStage] = useState<"Pending" | "In Progress" | "Approved" | "Rejected">("Pending");
  const [itNotes, setItNotes] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Resignation Form state (Self Tab)
  const [resignModalOpen, setResignModalOpen] = useState(false);
  const [exitTitle, setExitTitle] = useState("");
  const [exitDesc, setExitDesc] = useState("");
  const [expectedLwd, setExpectedLwd] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userType = localStorage.getItem("session_user_type");
      if (userType !== "company") {
        router.push("/login?tab=company");
        return;
      }

      // Load Resignations
      const storedOff = localStorage.getItem("hrms_offboardings");
      if (storedOff) {
        setOffboardings(JSON.parse(storedOff));
      } else {
        localStorage.setItem("hrms_offboardings", JSON.stringify(defaultOffboardings));
        setOffboardings(defaultOffboardings);
      }

      // Load Warnings
      const storedWarn = localStorage.getItem("hrms_warnings");
      if (storedWarn) {
        setWarnings(JSON.parse(storedWarn));
      } else {
        localStorage.setItem("hrms_warnings", JSON.stringify([]));
      }

      // Load Terminations
      const storedTerm = localStorage.getItem("hrms_terminations");
      if (storedTerm) {
        setTerminations(JSON.parse(storedTerm));
      } else {
        localStorage.setItem("hrms_terminations", JSON.stringify([]));
      }

      // Load Complaints
      const storedCompl = localStorage.getItem("hrms_complaints");
      if (storedCompl) {
        setComplaints(JSON.parse(storedCompl));
      } else {
        localStorage.setItem("hrms_complaints", JSON.stringify([]));
      }

      // Load Employees
      const storedEmp = localStorage.getItem("employees");
      if (storedEmp) {
        setEmployees(JSON.parse(storedEmp));
        const emps = JSON.parse(storedEmp);
        if (emps.length > 0) {
          setWarningUser(emps[0].id);
          setTerminationUser(emps[0].id);
          setComplaintFrom(emps[0].id);
          setComplaintTo(emps[0].id);
        }
      }

      // Load Assets
      const storedAssets = localStorage.getItem("hrms_assets");
      if (storedAssets) {
        setAssets(JSON.parse(storedAssets));
      }

      // View Mode Context
      const savedMode = (localStorage.getItem("session_view_mode") as any) || "manager";
      setViewMode(savedMode);
      const email = localStorage.getItem("session_company_email") || "admin@example.com";
      setCurrentUserEmail(email);

      // Find current employee ID
      if (storedEmp) {
        const emps = JSON.parse(storedEmp);
        const current = emps.find((e: any) => e.email.toLowerCase() === email.toLowerCase());
        if (current) {
          setCurrentUserEmpId(current.id);
        } else {
          setCurrentUserEmpId("EMP-001");
        }
      } else {
        setCurrentUserEmpId("EMP-001");
      }

      const listener = () => {
        setViewMode((localStorage.getItem("session_view_mode") as any) || "manager");
      };
      window.addEventListener("viewModeChanged", listener);
      return () => window.removeEventListener("viewModeChanged", listener);
    }
  }, [router]);

  // Sync route query change
  useEffect(() => {
    setActiveFilter("Pending");
  }, [subTab]);

  // Simulated Email Notifier
  const sendEmailNotification = (event: string, employeeId: string, subject: string, body: string) => {
    try {
      const emailConfig = localStorage.getItem("hrms_email_config");
      if (!emailConfig) return;
      const cfg = JSON.parse(emailConfig);
      
      // Map events to config keys
      let eventKey = "resignation";
      if (event.includes("Warning")) eventKey = "warning";
      if (event.includes("Termination")) eventKey = "termination";
      if (event.includes("Complaint")) eventKey = "complaint";
      if (event.includes("Leave")) eventKey = "appliedLeave";
      if (event.includes("Appreciation")) eventKey = "appreciations";

      const empObj = employees.find(e => e.id === employeeId);
      const targetEmail = empObj?.email || "employee@company.com";
      const targetName = empObj?.fullName || "Employee";

      const emailLogs = JSON.parse(localStorage.getItem("hrms_email_notifications_log") || "[]");

      if (cfg.toggles?.[eventKey]?.employee) {
        emailLogs.push({
          id: emailLogs.length + 1,
          event,
          recipient: targetEmail,
          recipientType: "Employee",
          subject,
          body,
          sentAt: new Date().toISOString()
        });
      }

      if (cfg.toggles?.[eventKey]?.manager) {
        emailLogs.push({
          id: emailLogs.length + 1,
          event,
          recipient: cfg.fromEmail || "manager@company.com",
          recipientType: "Manager",
          subject: `[Notification] ${subject}`,
          body: `HR notification trigger for employee ${targetName} (${employeeId}).\n\nDetails:\n${body}`,
          sentAt: new Date().toISOString()
        });
      }

      localStorage.setItem("hrms_email_notifications_log", JSON.stringify(emailLogs));
    } catch (e) {
      console.error("Failed to write simulated email logs:", e);
    }
  };

  // RESIGNATIONS (Self Tab submit)
  const handleOpenResign = () => {
    setExitTitle("");
    setExitDesc("");
    setExpectedLwd(new Date(Date.now() + 30*24*60*60*1000).toISOString().split("T")[0]); // 30 days notice
    setError(null);
    setSuccess(null);
    setResignModalOpen(true);
  };

  const handleResignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!exitTitle.trim() || !exitDesc.trim() || !expectedLwd) {
      setError("Please fill out all fields.");
      return;
    }

    const newId = offboardings.length > 0 ? Math.max(...offboardings.map(o => o.id)) + 1 : 1;
    const payload = {
      id: newId,
      userId: currentUserEmpId,
      managerId: "EMP-001",
      title: exitTitle,
      description: exitDesc,
      submitDate: new Date().toISOString().split("T")[0],
      startDate: new Date().toISOString().split("T")[0],
      endDate: expectedLwd,
      type: "Resignation",
      status: "Pending",
      assetsToReturn: [], // populated by manager
      assetsReturned: false,
      clearance: {
        it: "Pending",
        finance: "Pending",
        hr: "Pending"
      },
      clearanceNotes: {
        it: "",
        finance: "",
        hr: ""
      }
    };

    const updated = [payload, ...offboardings];
    setOffboardings(updated);
    localStorage.setItem("hrms_offboardings", JSON.stringify(updated));
    setSuccess("Resignation request submitted successfully.");

    // Trigger Notification
    sendEmailNotification(
      "Resignation Submitted",
      currentUserEmpId,
      "Resignation Received",
      `Dear Employee,\n\nWe have received your resignation notice submitted on ${payload.submitDate}. Your last working day is expected to be ${payload.endDate}.\n\nYour clearance tracking has been initiated.\n\nBest regards,\nHR Department`
    );

    setTimeout(() => setResignModalOpen(false), 800);
  };

  // CLEARANCES WORKFLOW (Manager view)
  const handleOpenClearance = (resignation: any) => {
    setActiveResignation(resignation);
    setSelectedAssetsToReturn(resignation.assetsToReturn || []);
    setHrStage(resignation.clearance?.hr || "Pending");
    setHrNotes(resignation.clearanceNotes?.hr || "");
    setFinanceStage(resignation.clearance?.finance || "Pending");
    setFinanceNotes(resignation.clearanceNotes?.finance || "");
    setITStage(resignation.clearance?.it || "Pending");
    setItNotes(resignation.clearanceNotes?.it || "");
    setError(null);
    setSuccess(null);
    setClearanceModal(true);
  };

  const handleClearanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeResignation) return;

    let overallStatus: "Pending" | "In Progress" | "Approved" | "Rejected" = "Pending";
    if (hrStage === "Approved" && financeStage === "Approved" && itStage === "Approved") {
      overallStatus = activeResignation.assetsReturned ? "Approved" : "Approved"; // We use "Approved" base status, and assetsReturned boolean determines if "Approved with Pending Assets Return" is shown in badge!
    } else if (hrStage === "Rejected" || financeStage === "Rejected" || itStage === "Rejected") {
      overallStatus = "Rejected";
    } else if (hrStage === "In Progress" || financeStage === "In Progress" || itStage === "In Progress") {
      overallStatus = "In Progress";
    }

    const updated = offboardings.map(o => {
      if (o.id === activeResignation.id) {
        // Also update employees list status to Resigned/Inactive if fully cleared
        if (overallStatus === "Approved" && activeResignation.assetsReturned) {
          const storedEmp = localStorage.getItem("employees");
          if (storedEmp) {
            const emps = JSON.parse(storedEmp);
            const updatedEmps = emps.map((e: any) => {
              if (e.id === o.userId) {
                return { ...e, status: "Inactive" };
              }
              return e;
            });
            localStorage.setItem("employees", JSON.stringify(updatedEmps));
          }
        }
        return {
          ...o,
          status: overallStatus,
          assetsToReturn: selectedAssetsToReturn,
          clearance: {
            hr: hrStage,
            finance: financeStage,
            it: itStage
          },
          clearanceNotes: {
            hr: hrNotes,
            finance: financeNotes,
            it: itNotes
          }
        };
      }
      return o;
    });

    setOffboardings(updated);
    localStorage.setItem("hrms_offboardings", JSON.stringify(updated));
    setSuccess("Clearances workflow updated successfully!");

    // Trigger Notification
    sendEmailNotification(
      "Resignation Status Updated",
      activeResignation.userId,
      `Resignation Clearance Update: ${overallStatus}`,
      `Your resignation clearance status has been updated to: ${overallStatus}.\n\nIT: ${itStage} (${itNotes})\nFinance: ${financeStage} (${financeNotes})\nHR: ${hrStage} (${hrNotes})\n\nSincerely,\nHR Office`
    );

    setTimeout(() => setClearanceModal(false), 800);
  };

  const handleToggleAssetSelection = (assetNameStr: string) => {
    setSelectedAssetsToReturn(prev => {
      if (prev.includes(assetNameStr as any)) {
        return prev.filter(a => a !== (assetNameStr as any));
      } else {
        return [...prev, assetNameStr as any];
      }
    });
  };

  const handleMarkAssetsReturned = (res: any) => {
    if (confirm("Confirm that employee has successfully returned all assigned assets?")) {
      const updated = offboardings.map(o => {
        if (o.id === res.id) {
          return {
            ...o,
            assetsReturned: true
          };
        }
        return o;
      });
      setOffboardings(updated);
      localStorage.setItem("hrms_offboardings", JSON.stringify(updated));
      setSuccess("Assets marked as returned. Relieving & Experience Letters are now unlocked!");
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  // WARNINGS CRUD
  const handleOpenWarning = (warning: any = null) => {
    if (warning) {
      setEditingWarningId(warning.id);
      setWarningUser(warning.userId);
      setWarningTitle(warning.title);
      setWarningDate(warning.date);
      setWarningDesc(warning.description);
      setWarningTemplate(warning.letterheadTemplate || "");
    } else {
      setEditingWarningId(null);
      setWarningUser(employees[0]?.id || "");
      setWarningTitle("");
      setWarningDate(new Date().toISOString().slice(0, 16).replace("T", " "));
      setWarningDesc("");
      setWarningTemplate("Warning Details:\n\nYou are hereby issued a formal warning regarding performance or behavioral concerns. Please ensure regular compliance with company rules.");
    }
    setError(null);
    setSuccess(null);
    setWarningModal(true);
  };

  const handleWarningSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!warningTitle.trim() || !warningDesc.trim()) {
      setError("Please fill out all warning details.");
      return;
    }

    const empObj = employees.find(e => e.id === warningUser);
    let updated;

    if (editingWarningId !== null) {
      updated = warnings.map(w => w.id === editingWarningId ? {
        ...w,
        userId: warningUser,
        userName: empObj?.fullName || "Employee",
        title: warningTitle,
        date: warningDate,
        description: warningDesc,
        letterheadTemplate: warningTemplate
      } : w);
      setSuccess("Warning record updated successfully!");
    } else {
      const newId = warnings.length > 0 ? Math.max(...warnings.map(w => w.id)) + 1 : 1;
      const payload = {
        id: newId,
        userId: warningUser,
        userName: empObj?.fullName || "Employee",
        title: warningTitle,
        date: warningDate,
        description: warningDesc,
        letterheadTemplate: warningTemplate,
        status: "Approved"
      };
      updated = [payload, ...warnings];
      setSuccess("New Warning record added!");

      // Trigger Email Notification
      sendEmailNotification(
        "Warning Issued",
        warningUser,
        `Official Warning Issued: ${warningTitle}`,
        `Dear ${empObj?.fullName},\n\nAn official warning has been issued to you on ${warningDate}.\n\nDetails:\n${warningDesc}\n\nSincerely,\nManagement`
      );
    }

    setWarnings(updated);
    localStorage.setItem("hrms_warnings", JSON.stringify(updated));
    setTimeout(() => setWarningModal(false), 800);
  };

  const handleDeleteWarning = (id: number) => {
    if (confirm("Are you sure you want to delete this warning record?")) {
      const updated = warnings.filter(w => w.id !== id);
      setWarnings(updated);
      localStorage.setItem("hrms_warnings", JSON.stringify(updated));
      setSuccess("Warning deleted successfully.");
      setTimeout(() => setSuccess(null), 2500);
    }
  };

  // TERMINATIONS CRUD
  const handleOpenTermination = (termination: any = null) => {
    if (termination) {
      setEditingTerminationId(termination.id);
      setTerminationUser(termination.userId);
      setTerminationTitle(termination.title);
      setTerminationNoticeDate(termination.noticeDate);
      setTerminationDate(termination.terminationDate);
      setTerminationDesc(termination.description);
      setTerminationTemplate(termination.letterheadTemplate || "");
    } else {
      setEditingTerminationId(null);
      setTerminationUser(employees[0]?.id || "");
      setTerminationTitle("");
      setTerminationNoticeDate(new Date().toISOString().slice(0, 16).replace("T", " "));
      setTerminationDate(new Date(Date.now() + 15*24*60*60*1000).toISOString().slice(0, 16).replace("T", " "));
      setTerminationDesc("");
      setTerminationTemplate("Termination Notice Details:\n\nFollowing official review, we regret to inform you that your employment with the company stands terminated. Your notice period and final settlement terms are enclosed.");
    }
    setError(null);
    setSuccess(null);
    setTerminationModal(true);
  };

  const handleTerminationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminationTitle.trim() || !terminationDesc.trim()) {
      setError("Please fill out all termination details.");
      return;
    }

    const empObj = employees.find(e => e.id === terminationUser);
    let updated;

    if (editingTerminationId !== null) {
      updated = terminations.map(t => t.id === editingTerminationId ? {
        ...t,
        userId: terminationUser,
        userName: empObj?.fullName || "Employee",
        title: terminationTitle,
        noticeDate: terminationNoticeDate,
        terminationDate,
        description: terminationDesc,
        letterheadTemplate: terminationTemplate
      } : t);
      setSuccess("Termination record updated successfully!");
    } else {
      const newId = terminations.length > 0 ? Math.max(...terminations.map(t => t.id)) + 1 : 1;
      const payload = {
        id: newId,
        userId: terminationUser,
        userName: empObj?.fullName || "Employee",
        title: terminationTitle,
        noticeDate: terminationNoticeDate,
        terminationDate,
        description: terminationDesc,
        letterheadTemplate: terminationTemplate,
        status: "Approved"
      };
      updated = [payload, ...terminations];
      setSuccess("New Termination record added!");

      // Update employee status to Inactive in directory
      const storedEmp = localStorage.getItem("employees");
      if (storedEmp) {
        const emps = JSON.parse(storedEmp);
        const updatedEmps = emps.map((e: any) => {
          if (e.id === terminationUser) {
            return { ...e, status: "Inactive" };
          }
          return e;
        });
        localStorage.setItem("employees", JSON.stringify(updatedEmps));
      }

      // Trigger Email Notification
      sendEmailNotification(
        "Termination Issued",
        terminationUser,
        `Official Notice of Termination: ${terminationTitle}`,
        `Dear ${empObj?.fullName},\n\nThis is to notify you that your employment with the company is scheduled for termination on ${terminationDate}.\n\nDetails:\n${terminationDesc}\n\nSincerely,\nHR Department`
      );
    }

    setTerminations(updated);
    localStorage.setItem("hrms_terminations", JSON.stringify(updated));
    setTimeout(() => setTerminationModal(false), 800);
  };

  const handleDeleteTermination = (id: number) => {
    if (confirm("Are you sure you want to delete this termination record?")) {
      const updated = terminations.filter(t => t.id !== id);
      setTerminations(updated);
      localStorage.setItem("hrms_terminations", JSON.stringify(updated));
      setSuccess("Termination deleted successfully.");
      setTimeout(() => setSuccess(null), 2500);
    }
  };

  // COMPLAINTS CRUD
  const handleOpenComplaint = (complaint: any = null) => {
    if (complaint) {
      setEditingComplaintId(complaint.id);
      setComplaintTitle(complaint.title);
      setComplaintDate(complaint.dateTime);
      setComplaintFrom(complaint.fromStaffId);
      setComplaintTo(complaint.toStaffId);
      setComplaintDoc(complaint.proofDocument || "");
      setComplaintStatus(complaint.status);
      setComplaintDesc(complaint.description);
      setComplaintTemplate(complaint.letterheadTemplate || "");
    } else {
      setEditingComplaintId(null);
      setComplaintTitle("");
      setComplaintDate(new Date().toISOString().slice(0, 16).replace("T", " "));
      setComplaintFrom(employees[0]?.id || "");
      setComplaintTo(employees[1]?.id || "");
      setComplaintDoc("");
      setComplaintStatus("Pending");
      setComplaintDesc("");
      setComplaintTemplate("Complaint Details:\n\nA grievance has been officially filed. Our ethics committee will review the details and initiate a formal response.");
    }
    setError(null);
    setSuccess(null);
    setComplaintModal(true);
  };

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintTitle.trim() || !complaintDesc.trim()) {
      setError("Please fill out all complaint details.");
      return;
    }

    const fromObj = employees.find(e => e.id === complaintFrom);
    const toObj = employees.find(e => e.id === complaintTo);
    let updated;

    if (editingComplaintId !== null) {
      updated = complaints.map(c => c.id === editingComplaintId ? {
        ...c,
        title: complaintTitle,
        dateTime: complaintDate,
        fromStaffId: complaintFrom,
        fromStaffName: fromObj?.fullName || "Employee",
        toStaffId: complaintTo,
        toStaffName: toObj?.fullName || "Employee",
        proofDocument: complaintDoc,
        status: complaintStatus,
        description: complaintDesc,
        letterheadTemplate: complaintTemplate
      } : c);
      setSuccess("Complaint updated successfully!");
    } else {
      const newId = complaints.length > 0 ? Math.max(...complaints.map(c => c.id)) + 1 : 1;
      const payload = {
        id: newId,
        title: complaintTitle,
        dateTime: complaintDate,
        fromStaffId: complaintFrom,
        fromStaffName: fromObj?.fullName || "Employee",
        toStaffId: complaintTo,
        toStaffName: toObj?.fullName || "Employee",
        proofDocument: complaintDoc,
        status: complaintStatus,
        description: complaintDesc,
        letterheadTemplate: complaintTemplate
      };
      updated = [payload, ...complaints];
      setSuccess("New Complaint record filed!");

      // Trigger Email Notification
      sendEmailNotification(
        "Complaint Filed",
        complaintTo,
        `[Grievance Registered] Complaint Filed`,
        `Dear employee,\n\nAn official complaint has been filed involving you on ${complaintDate}.\n\nDetails:\n${complaintDesc}\n\nOur ethics panel is looking into this.\n\nBest regards,\nHR Department`
      );
    }

    setComplaints(updated);
    localStorage.setItem("hrms_complaints", JSON.stringify(updated));
    setTimeout(() => setComplaintModal(false), 800);
  };

  const handleDeleteComplaint = (id: number) => {
    if (confirm("Are you sure you want to delete this complaint record?")) {
      const updated = complaints.filter(c => c.id !== id);
      setComplaints(updated);
      localStorage.setItem("hrms_complaints", JSON.stringify(updated));
      setSuccess("Complaint deleted successfully.");
      setTimeout(() => setSuccess(null), 2500);
    }
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setComplaintDoc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // LETTERHEAD DYNAMIC PRINT GENERATION
  const handleGenerateOffboardingLetter = (res: any, templateId: number) => {
    const empObj = employees.find(e => e.id === res.userId);
    if (!empObj) return;

    // Load template body from hrms_letterhead_templates
    const storedTemplates = localStorage.getItem("hrms_letterhead_templates");
    const templatesList = storedTemplates ? JSON.parse(storedTemplates) : [];
    const template = templatesList.find((t: any) => t.id === templateId) || {
      title: templateId === 2 ? "Relieving Letter" : "Experience Certificate",
      body: `TO WHOMSOEVER IT MAY CONCERN\n\nThis is to certify that {Employee Name} (Employee ID: {Employee ID}) has worked with {Company Name}.\n\nJoining Date: {Joining Date}\nExit Date: {Exit Date}\n\nYours Sincerely,\nHR Department`
    };

    // Resolve Placeholders
    const basic = empObj?.salary?.basic || 0;
    const hra = empObj?.salary?.hra || 0;
    const specialAllowance = empObj?.salary?.specialAllowance || 0;
    const conveyance = empObj?.salary?.conveyance || 0;
    const medicalAllowance = empObj?.salary?.medicalAllowance || 0;
    const lta = empObj?.salary?.lta || 0;
    const netSalaryVal = basic + hra + specialAllowance + conveyance + medicalAllowance + lta;

    const replacements: { [key: string]: string } = {
      "{Employee Name}": empObj.fullName || "John Doe",
      "{Employee ID}": empObj.id || "EMP-000",
      "{Designation}": empObj.designation || "Engineer",
      "{Department}": empObj.department || "Technology",
      "{Joining Date}": empObj.dateOfJoining || "2026-06-01",
      "{Exit Date}": res.endDate,
      "{Net Salary}": `₹${netSalaryVal.toLocaleString("en-IN")}`,
      "{Company Name}": "IMXPORTEX EWORLD PRIVATE LIMTED",
      "{Current Date}": new Date().toISOString().split("T")[0]
    };

    let resolvedBody = template.body || "";
    Object.entries(replacements).forEach(([placeholder, value]) => {
      resolvedBody = resolvedBody.split(placeholder).join(value);
    });

    const hrSignature = localStorage.getItem("hrms_hr_signature") || "";

    // Trigger Print Frame
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
          <title>${template.title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
            @page { size: A4; margin: 0; }
            body {
              margin: 0; padding: 0;
              font-family: 'Playfair Display', Georgia, serif;
              color: #1e293b; background-color: #ffffff;
              -webkit-print-color-adjust: exact; print-color-adjust: exact;
            }
            .page {
              position: relative; width: 210mm; height: 297mm; box-sizing: border-box;
              padding: 45mm 25mm 40mm 25mm; display: flex; flex-direction: column; justify-content: space-between;
            }
            .top-bar { position: absolute; top: 0; left: 0; right: 0; height: 8mm; background-color: #38a834; }
            .header {
              position: absolute; top: 12mm; left: 25mm; right: 25mm;
              display: flex; justify-content: flex-end; align-items: flex-start;
              border-bottom: 1px solid #f1f5f9; padding-bottom: 4mm; width: calc(100% - 50mm);
            }
            .logo-container { display: flex; flex-direction: column; align-items: flex-end; }
            .logo-text {
              display: flex; align-items: center; font-family: 'Inter', sans-serif;
              font-weight: 800; font-size: 22px; line-height: 1; letter-spacing: -0.5px;
            }
            .logo-im { color: #f15a24; }
            .logo-xp { color: #0071bc; }
            .logo-rt { color: #0071bc; }
            .logo-ex { color: #8cc63f; }
            .logo-globe { display: inline-block; width: 22px; height: 22px; margin: 0 2px; }
            .tagline { font-family: 'Inter', sans-serif; font-weight: 900; font-size: 6px; color: #0071bc; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 4px; }
            .content-area { flex-grow: 1; font-size: 13px; line-height: 1.6; white-space: pre-wrap; margin-top: 15mm; }
            .date-line { font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 700; color: #94a3b8; text-align: right; margin-bottom: 20px; text-transform: uppercase; }
            .signature-block { display: flex; justify-content: flex-start; margin-top: 15px; margin-bottom: 15px; font-family: 'Inter', sans-serif; }
            .signature-wrapper { display: flex; flex-direction: column; align-items: flex-start; text-align: left; }
            .signature-img { height: 40px; object-fit: contain; margin-bottom: 4px; }
            .signature-placeholder { height: 40px; width: 100px; border: 1px dashed #cbd5e1; border-radius: 4px; margin-bottom: 4px; }
            .signatory-title { font-weight: 800; font-size: 10px; color: #475569; }
            .signatory-subtitle { font-size: 8px; color: #94a3b8; }
            .footer { position: absolute; bottom: 15mm; left: 25mm; right: 25mm; text-align: center; font-family: 'Inter', sans-serif; width: calc(100% - 50mm); }
            .footer-line { width: 100%; height: 1.5px; background-color: #f58220; margin-bottom: 6px; }
            .footer-company { font-weight: 800; font-size: 10px; letter-spacing: 0.5px; text-transform: uppercase; margin: 0 0 3px 0; }
            .fc-im { color: #f15a24; } .fc-xport { color: #0071bc; } .fc-ex { color: #8cc63f; } .fc-eworld { color: #0071bc; }
            .footer-address { font-weight: 500; font-size: 8px; color: #475569; margin: 0 0 3px 0; }
            .footer-contact { font-weight: 700; font-size: 8px; color: #94a3b8; margin: 0; }
            .footer-link { color: #0071bc; text-decoration: underline; font-weight: 400; }
            .bottom-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 12mm; background-color: #38a834; }
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
              <div class="date-line">DATE: ${new Date().toISOString().split("T")[0]}</div>
              <div>
                ${(() => {
                  const match = resolvedBody.match(/(Yours Sincerely\s*,?|Sincerely\s*,?|Yours Faithfully\s*,?)/i);
                  if (match && match.index !== undefined) {
                    const splitIndex = match.index + match[0].length;
                    const beforeText = resolvedBody.substring(0, splitIndex);
                    const afterText = resolvedBody.substring(splitIndex);
                    return `
                      <div>${beforeText.replace(/\n/g, '<br>')}</div>
                      <div class="signature-block">
                        <div class="signature-wrapper">
                          ${hrSignature ? `<img class="signature-img" src="${hrSignature}" alt="Signature" />` : '<div class="signature-placeholder"></div>'}
                          <div class="signatory-title">Concerned HR Manager</div>
                          <div class="signatory-subtitle">Authorized Signatory</div>
                        </div>
                      </div>
                      <div>${afterText.replace(/\n/g, '<br>')}</div>
                    `;
                  }
                  return `
                    <div>${resolvedBody.replace(/\n/g, '<br>')}</div>
                    <div class="signature-block">
                      <div class="signature-wrapper">
                        ${hrSignature ? `<img class="signature-img" src="${hrSignature}" alt="Signature" />` : '<div class="signature-placeholder"></div>'}
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
              <p class="footer-contact">Email: <span class="footer-link">info@imxportex.com</span> Web: <span class="footer-link">www.imxportex.com</span></p>
            </div>
            <div class="bottom-bar"></div>
          </div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
        </html>
      `);
      doc.close();

      // Also copy automatically to Employee Documents
      try {
        const docTitle = `${template.title} - Exit`;
        const storedDocs = localStorage.getItem("hrms_employee_documents");
        const currentDocs = storedDocs ? JSON.parse(storedDocs) : [];
        const docId = currentDocs.length > 0 ? Math.max(...currentDocs.map((d: any) => d.id)) + 1 : 1;
        const newDoc = {
          id: docId,
          employeeId: res.userId,
          title: docTitle,
          date: new Date().toISOString().split("T")[0],
          type: "Generated Letter",
          fileSize: `${Math.round(resolvedBody.length / 1024 * 100) / 100} KB`,
          body: resolvedBody,
          signature: hrSignature,
          isGenerated: true,
          fileName: `${docTitle.replace(/\s+/g, "_")}.pdf`
        };
        localStorage.setItem("hrms_employee_documents", JSON.stringify([newDoc, ...currentDocs]));
      } catch (e) {
        console.error("Failed to copy to documents:", e);
      }

      setSuccess(`Letter generated & printed successfully! Letter sent to employee Documents.`);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  // Filter collections by Sub-tab & Status
  const getSubTabData = () => {
    const query = searchQuery.toLowerCase();
    if (subTab === "warnings") {
      return warnings.filter(w => w.status === activeFilter && (w.userName.toLowerCase().includes(query) || w.title.toLowerCase().includes(query)));
    }
    if (subTab === "terminations") {
      return terminations.filter(t => t.status === activeFilter && (t.userName.toLowerCase().includes(query) || t.title.toLowerCase().includes(query)));
    }
    if (subTab === "complaints") {
      return complaints.filter(c => c.status === activeFilter && (c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query)));
    }
    // resignations
    return offboardings.filter(o => o.status === activeFilter && (
      (employees.find(e => e.id === o.userId)?.fullName || "").toLowerCase().includes(query) ||
      o.title.toLowerCase().includes(query)
    ));
  };

  const getSubTabHeading = () => {
    if (subTab === "warnings") return "Employee Warnings";
    if (subTab === "terminations") return "Employee Terminations";
    if (subTab === "complaints") return "Staff Complaints & Grievances";
    return "Exit Resignations";
  };

  const getSubTabDesc = () => {
    if (subTab === "warnings") return "Issue and manage warning notices for staff misconduct or performance gap metrics.";
    if (subTab === "terminations") return "Record and execute structural staff terminations with dynamic notice terms.";
    if (subTab === "complaints") return "Manage internal workforce disputes, compliance complaints, and ethics reviews.";
    return "Process employee voluntary exit notices and full-clearance department settlements.";
  };

  const myResignations = offboardings.filter(o => o.userId === currentUserEmpId);

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[280px_1fr]">
      <SaasSidebar active={subTab === "warnings" ? "Warnings" : subTab === "terminations" ? "Terminations" : subTab === "complaints" ? "Complaints" : "Offboarding"} />

      <section className="p-6 lg:p-8 overflow-y-auto">
        {viewMode === "self" ? (
          /* SELF VIEW */
          <div className="max-w-4xl">
            <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white -mx-6 -mt-6 p-6 lg:-mx-8 lg:-mt-8 shadow-sm">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Resignation Exit Portal</h2>
                <p className="mt-1 text-sm text-slate-500">Submit your notice period and verify clearances.</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={"/dashboard/reports?tab=my_offboarding" as any}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 shadow hover:bg-slate-50 transition"
                >
                  <FileText className="size-4 text-indigo-500" /> View Exit Reports
                </Link>
                {myResignations.length === 0 && (
                  <button
                    onClick={handleOpenResign}
                    className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-xs font-black text-white shadow hover:bg-indigo-700 transition"
                  >
                    <Plus className="size-4" /> Submit Resignation
                  </button>
                )}
              </div>
            </header>

            {success && (
              <div className="mb-4 bg-emerald-50 text-emerald-800 p-3 rounded text-xs font-bold border border-emerald-100 flex items-center gap-2">
                <CheckCircle className="size-4 text-emerald-600" /> {success}
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-6">
                {myResignations.map(res => (
                  <Card key={res.id} className="p-6 bg-white border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Notice Title</span>
                        <h3 className="font-black text-slate-800 text-sm">{res.title}</h3>
                      </div>
                      <Badge className={res.status === "Approved" && !res.assetsReturned ? "bg-amber-500 text-white" : ""}>
                        {res.status === "Approved" && !res.assetsReturned ? "Approved with Pending Assets Return" : res.status}
                      </Badge>
                    </div>

                    <div className="text-xs text-slate-600 leading-relaxed font-normal">
                      <span className="font-bold text-slate-400 block mb-1">Notice Description</span>
                      {res.description}
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-xs font-bold bg-slate-50 p-3 rounded">
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">Notice Filed</span>
                        <span className="text-slate-700 font-mono">{res.submitDate}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">Last Working Day</span>
                        <span className="text-slate-700 font-mono">{res.endDate}</span>
                      </div>
                    </div>
                  </Card>
                ))}

                {myResignations.length === 0 && (
                  <div className="bg-white border border-slate-200 rounded-lg p-10 text-center text-slate-400 font-semibold shadow-sm">
                    No active resignation notice logged on your account.
                  </div>
                )}
              </div>

              <div className="md:col-span-1">
                <Card className="p-6 bg-white border-slate-200 shadow-sm h-fit">
                  <h4 className="font-black text-sm text-slate-800 border-b border-slate-100 pb-3 mb-4">Clearance status</h4>
                  {myResignations.length > 0 ? (
                    myResignations.map(res => {
                      const cl = res.clearance || { it: "Pending", finance: "Pending", hr: "Pending" };
                      return (
                        <div key={res.id} className="space-y-4 text-xs">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span className="font-bold text-slate-600">1. IT Asset Handover</span>
                            <Badge>{cl.it}</Badge>
                          </div>
                          {cl.it !== "Approved" && res.clearanceNotes?.it && (
                            <p className="text-[10px] text-rose-600 font-mono -mt-2">{res.clearanceNotes.it}</p>
                          )}

                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span className="font-bold text-slate-600">2. Finance / Claims</span>
                            <Badge>{cl.finance}</Badge>
                          </div>
                          {cl.finance !== "Approved" && res.clearanceNotes?.finance && (
                            <p className="text-[10px] text-rose-600 font-mono -mt-2">{res.clearanceNotes.finance}</p>
                          )}

                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span className="font-bold text-slate-600">3. HR / Documentation</span>
                            <Badge>{cl.hr}</Badge>
                          </div>
                          {cl.hr !== "Approved" && res.clearanceNotes?.hr && (
                            <p className="text-[10px] text-rose-600 font-mono -mt-2">{res.clearanceNotes.hr}</p>
                          )}

                          <div className="mt-4 p-3 rounded border border-indigo-150 bg-indigo-50/50 flex flex-col gap-1">
                            <span className="font-extrabold text-indigo-900 uppercase text-[9px]">Inventory Return</span>
                            <span className="font-black text-slate-700">
                              {res.assetsReturned ? "Returned ✓" : "Pending Return ✗"}
                            </span>
                            {res.assetsToReturn && res.assetsToReturn.length > 0 && (
                              <div className="mt-1 border-t border-indigo-100 pt-1.5 text-[9px] text-slate-500 font-normal">
                                <span className="font-bold text-slate-700 block">Requested Assets Handover:</span>
                                {res.assetsToReturn.join(", ")}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-[11px]">No active clearance logs.</div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        ) : (
          /* MANAGER VIEW */
          <div>
            <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white -mx-6 -mt-6 p-6 lg:-mx-8 lg:-mt-8 shadow-sm">
              <div>
                <h2 className="text-2xl font-black text-slate-900">{getSubTabHeading()}</h2>
                <p className="mt-1 text-sm text-slate-500">{getSubTabDesc()}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={"/dashboard/reports?tab=offboarding" as any}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 shadow hover:bg-slate-50 transition"
                >
                  <FileText className="size-4 text-indigo-500" /> View Exit Reports
                </Link>
                {subTab === "warnings" && (
                  <button
                    onClick={() => handleOpenWarning()}
                    className="inline-flex items-center gap-2 rounded bg-indigo-600 px-4 py-2.5 text-xs font-black text-white hover:bg-indigo-700 transition"
                  >
                    <Plus className="size-4" /> Add Warning
                  </button>
                )}
                {subTab === "terminations" && (
                  <button
                    onClick={() => handleOpenTermination()}
                    className="inline-flex items-center gap-2 rounded bg-indigo-600 px-4 py-2.5 text-xs font-black text-white hover:bg-indigo-700 transition"
                  >
                    <Plus className="size-4" /> Add Termination
                  </button>
                )}
                {subTab === "complaints" && (
                  <button
                    onClick={() => handleOpenComplaint()}
                    className="inline-flex items-center gap-2 rounded bg-indigo-600 px-4 py-2.5 text-xs font-black text-white hover:bg-indigo-700 transition"
                  >
                    <Plus className="size-4" /> Add Complaint
                  </button>
                )}
              </div>
            </header>

            {success && (
              <div className="mb-5 bg-emerald-50 text-emerald-800 p-3 rounded text-xs font-bold border border-emerald-100 flex items-center gap-2 animate-pulse">
                <CheckCircle className="size-4 text-emerald-600" /> {success}
              </div>
            )}

            {/* Filter Tabs */}
            <div className="flex border-b border-slate-200 mb-6 text-xs font-bold text-slate-400">
              {["Pending", "Approved", "Rejected"].map(filterVal => (
                <button
                  key={filterVal}
                  onClick={() => setActiveFilter(filterVal as any)}
                  className={`py-3 px-6 border-b-2 transition ${activeFilter === filterVal ? "border-indigo-600 text-indigo-600 font-extrabold" : "border-transparent hover:text-slate-700"}`}
                >
                  {filterVal} Requests
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="mb-6 bg-white p-4 rounded-lg border border-slate-200 shadow-sm max-w-md">
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <Search className="size-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search offboarding records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-md border border-slate-200 pl-9 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                />
              </div>
            </div>

            {/* Table layout */}
            <Card className="border-slate-200 shadow-sm overflow-hidden p-0 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                    {subTab === "resignations" ? (
                      <tr>
                        <th className="p-4">Employee</th>
                        <th className="p-4">Resignation Details</th>
                        <th className="p-4 font-mono">Dates</th>
                        <th className="p-4">Clearance Status</th>
                        <th className="p-4">Assets Handover</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    ) : subTab === "warnings" ? (
                      <tr>
                        <th className="p-4">Employee</th>
                        <th className="p-4">Warning Title</th>
                        <th className="p-4 font-mono">Warning Date</th>
                        <th className="p-4">Description</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    ) : subTab === "terminations" ? (
                      <tr>
                        <th className="p-4">Employee</th>
                        <th className="p-4">Notice Title</th>
                        <th className="p-4 font-mono">Notice / End Date</th>
                        <th className="p-4">Reason Details</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    ) : (
                      <tr>
                        <th className="p-4">Complaint Title</th>
                        <th className="p-4">From Staff</th>
                        <th className="p-4">To Staff</th>
                        <th className="p-4 font-mono">Date Filed</th>
                        <th className="p-4">Proof Doc</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    )}
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {getSubTabData().length > 0 ? (
                      getSubTabData().map((item) => {
                        if (subTab === "resignations") {
                          const empObj = employees.find(e => e.id === item.userId);
                          const cl = item.clearance || { it: "Pending", finance: "Pending", hr: "Pending" };
                          const isFullyCleared = cl.it === "Approved" && cl.finance === "Approved" && cl.hr === "Approved";
                          const relievingLettersUnlocked = isFullyCleared && item.assetsReturned;
                          
                          return (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition">
                              <td className="p-4">
                                <p className="font-black text-slate-900 text-sm">{empObj?.fullName || "Employee"}</p>
                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.userId}</p>
                              </td>
                              <td className="p-4">
                                <p className="font-bold text-slate-800">{item.title}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5 font-normal line-clamp-1">{item.description}</p>
                              </td>
                              <td className="p-4 font-mono text-slate-500">
                                Sub: {item.submitDate} <br />
                                LWD: {item.endDate}
                              </td>
                              <td className="p-4 space-y-1.5 text-[9px] font-bold">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-slate-400 w-16">IT Team:</span>
                                  <Badge>{cl.it}</Badge>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-slate-400 w-16">Finance:</span>
                                  <Badge>{cl.finance}</Badge>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-slate-400 w-16">HR Manager:</span>
                                  <Badge>{cl.hr}</Badge>
                                </div>
                              </td>
                              <td className="p-4 space-y-1.5">
                                <Badge className={item.assetsReturned ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}>
                                  {item.assetsReturned ? "Returned ✓" : "Pending Return ✗"}
                                </Badge>
                                {item.assetsToReturn && item.assetsToReturn.length > 0 && (
                                  <p className="text-[9px] text-slate-400 font-normal line-clamp-1 max-w-[120px]">
                                    Required: {item.assetsToReturn.join(", ")}
                                  </p>
                                )}
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex flex-col gap-1 w-32 ml-auto">
                                  <button
                                    onClick={() => handleOpenClearance(item)}
                                    className="rounded border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-600 transition font-bold px-2 py-1 text-[10px]"
                                  >
                                    Manage Clearances
                                  </button>

                                  {item.status === "Approved" && !item.assetsReturned && (
                                    <button
                                      onClick={() => handleMarkAssetsReturned(item)}
                                      className="rounded bg-amber-600 hover:bg-amber-700 text-white transition font-bold px-2 py-1 text-[10px]"
                                    >
                                      Mark Assets Returned
                                    </button>
                                  )}

                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => handleGenerateOffboardingLetter(item, 2)}
                                      disabled={!relievingLettersUnlocked}
                                      className={`flex-1 rounded text-white font-bold py-1 text-[9px] transition ${
                                        relievingLettersUnlocked ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                      }`}
                                      title={relievingLettersUnlocked ? "Generate Relieving Letter" : "Clearance required to generate relieving letter"}
                                    >
                                      Relieving
                                    </button>
                                    <button
                                      onClick={() => handleGenerateOffboardingLetter(item, 4)}
                                      disabled={!relievingLettersUnlocked}
                                      className={`flex-1 rounded text-white font-bold py-1 text-[9px] transition ${
                                        relievingLettersUnlocked ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                      }`}
                                      title={relievingLettersUnlocked ? "Generate Experience Letter" : "Clearance required to generate experience letter"}
                                    >
                                      Experience
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        }

                        if (subTab === "warnings") {
                          return (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition">
                              <td className="p-4">
                                <p className="font-black text-slate-900 text-sm">{item.userName}</p>
                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.userId}</p>
                              </td>
                              <td className="p-4 text-slate-900 font-black text-sm">{item.title}</td>
                              <td className="p-4 font-mono text-slate-500">{item.date}</td>
                              <td className="p-4 text-slate-500 font-normal leading-relaxed max-w-xs truncate" title={item.description}>
                                {item.description}
                              </td>
                              <td className="p-4 text-right">
                                <div className="inline-flex gap-2">
                                  <button
                                    onClick={() => handleOpenWarning(item)}
                                    className="text-[11px] font-bold text-indigo-600 hover:underline"
                                  >
                                    Edit
                                  </button>
                                  <span className="text-slate-200">|</span>
                                  <button
                                    onClick={() => handleDeleteWarning(item.id)}
                                    className="text-[11px] font-bold text-rose-600 hover:underline"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        }

                        if (subTab === "terminations") {
                          return (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition">
                              <td className="p-4">
                                <p className="font-black text-slate-900 text-sm">{item.userName}</p>
                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.userId}</p>
                              </td>
                              <td className="p-4 text-slate-900 font-black text-sm">{item.title}</td>
                              <td className="p-4 font-mono text-slate-500">
                                Notice: {item.noticeDate} <br />
                                End: {item.terminationDate}
                              </td>
                              <td className="p-4 text-slate-500 font-normal leading-relaxed max-w-xs truncate" title={item.description}>
                                {item.description}
                              </td>
                              <td className="p-4 text-right">
                                <div className="inline-flex gap-2">
                                  <button
                                    onClick={() => handleOpenTermination(item)}
                                    className="text-[11px] font-bold text-indigo-600 hover:underline"
                                  >
                                    Edit
                                  </button>
                                  <span className="text-slate-200">|</span>
                                  <button
                                    onClick={() => handleDeleteTermination(item.id)}
                                    className="text-[11px] font-bold text-rose-600 hover:underline"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        }

                        // complaints
                        return (
                          <tr key={item.id} className="hover:bg-slate-50/50 transition">
                            <td className="p-4 text-slate-900 font-black text-sm">
                              <p className="font-bold">{item.title}</p>
                              <p className="text-[10px] text-slate-400 font-normal line-clamp-1 mt-0.5">{item.description}</p>
                            </td>
                            <td className="p-4">{item.fromStaffName} <span className="text-[9px] text-slate-400 font-mono">({item.fromStaffId})</span></td>
                            <td className="p-4">{item.toStaffName} <span className="text-[9px] text-slate-400 font-mono">({item.toStaffId})</span></td>
                            <td className="p-4 font-mono text-slate-500">{item.dateTime}</td>
                            <td className="p-4">
                              {item.proofDocument ? (
                                <a
                                  href={item.proofDocument}
                                  download={`proof_${item.title.replace(/\s+/g, "_")}.png`}
                                  className="text-[10px] font-bold text-indigo-600 hover:underline"
                                >
                                  Download Proof
                                </a>
                              ) : (
                                <span className="text-slate-400 italic">None</span>
                              )}
                            </td>
                            <td className="p-4 text-right">
                              <div className="inline-flex gap-2">
                                <button
                                  onClick={() => handleOpenComplaint(item)}
                                  className="text-[11px] font-bold text-indigo-600 hover:underline"
                                >
                                  Edit
                                </button>
                                <span className="text-slate-200">|</span>
                                <button
                                  onClick={() => handleDeleteComplaint(item.id)}
                                  className="text-[11px] font-bold text-rose-600 hover:underline"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold">
                          No {activeFilter.toLowerCase()} {subTab} records found matching filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* MODAL: Submit Resignation (Self) */}
        {resignModalOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-slate-200 bg-white p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
              <button onClick={() => setResignModalOpen(false)} className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
                <X className="size-5" />
              </button>
              <h3 className="text-base font-black text-slate-900 mb-2">Submit Exit Resignation</h3>
              <p className="text-xs text-slate-400 mb-4 font-normal">Submit your formal notice period to leave the organization.</p>
              {error && <div className="mb-4 rounded-md bg-rose-50 p-3 text-xs font-bold text-rose-800 border border-rose-100">{error}</div>}
              {success && <div className="mb-4 rounded-md bg-emerald-50 p-3 text-xs font-bold text-emerald-800 border border-emerald-100 animate-pulse">{success}</div>}
              <form onSubmit={handleResignSubmit} className="space-y-4 text-xs">
                <label className="grid gap-1 font-bold text-slate-500 uppercase">Exit Notice Title<input type="text" value={exitTitle} onChange={e => setExitTitle(e.target.value)} placeholder="e.g. Resigning for higher studies" className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30" required /></label>
                <label className="grid gap-1 font-bold text-slate-500 uppercase">Last Working Day (LWD)<input type="date" value={expectedLwd} onChange={e => setExpectedLwd(e.target.value)} className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30" required /></label>
                <label className="grid gap-1 font-bold text-slate-500 uppercase font-bold">Reason / Details<textarea value={exitDesc} onChange={e => setExitDesc(e.target.value)} placeholder="Provide exit reason and handover plans..." className="h-24 rounded border border-slate-200 p-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30 resize-none" required /></label>
                <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setResignModalOpen(false)} className="rounded border border-slate-200 bg-white px-4 py-2.5 font-bold text-slate-600 hover:bg-slate-50 transition">Cancel</button><button type="submit" className="rounded bg-indigo-600 hover:bg-indigo-700 transition px-5 py-2.5 font-bold text-white shadow">Submit Notice</button></div>
              </form>
            </Card>
          </div>
        )}

        {/* MODAL: Clearances workflow details (Manager) */}
        {clearanceModal && activeResignation && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl border-slate-200 bg-white p-6 shadow-2xl relative animate-in zoom-in-95 duration-150 overflow-y-auto max-h-[90vh]">
              <button onClick={() => setClearanceModal(false)} className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
                <X className="size-5" />
              </button>
              <h3 className="text-base font-black text-slate-900 mb-1">Clearance & Resignation Workflow</h3>
              <p className="text-xs text-slate-400 mb-4 font-normal">Review clearances from HR, Finance, and IT Team. Select assets that need to be returned.</p>

              {success && <div className="mb-4 bg-emerald-50 text-emerald-800 p-3 rounded text-xs font-bold border border-emerald-100">{success}</div>}

              <form onSubmit={handleClearanceSubmit} className="space-y-4 text-xs font-semibold">
                {/* 1. Asset Handover Section */}
                <div className="p-4 rounded-lg border border-slate-200 space-y-3 bg-slate-50/50">
                  <h4 className="font-black text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <Laptop className="size-4 text-indigo-500" /> Handover Asset Selection
                  </h4>
                  <p className="text-[10px] text-slate-400 font-normal">Select the allocated assets that this employee must return upon exit.</p>
                  
                  <div className="grid gap-2 sm:grid-cols-2">
                    {assets.filter(a => a.userId === activeResignation.userId).length > 0 ? (
                      assets.filter(a => a.userId === activeResignation.userId).map(asset => {
                        const isSelected = selectedAssetsToReturn.includes(asset.name);
                        return (
                          <label key={asset.id} className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleAssetSelection(asset.name)}
                              className="size-3.5 text-indigo-600 rounded border-slate-300"
                            />
                            <div>
                              <span className="font-bold text-slate-700 block">{asset.name}</span>
                              <span className="text-[9px] text-slate-400 font-mono">Serial: {asset.serialNumber}</span>
                            </div>
                          </label>
                        );
                      })
                    ) : (
                      <p className="text-slate-400 text-[10px] italic font-normal col-span-2">This employee has no active allocated assets in inventory.</p>
                    )}
                  </div>
                </div>

                {/* 2. HR Workflow Clearance */}
                <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <h4 className="font-black text-slate-800 text-[11px] uppercase tracking-wider">HR Manager Stage</h4>
                    <select value={hrStage} onChange={e => setHrStage(e.target.value as any)} className="h-8 rounded border border-slate-200 px-2 bg-white text-xs">
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    Clearance Notes / Reason Description
                    <textarea
                      value={hrNotes}
                      onChange={e => setHrNotes(e.target.value)}
                      placeholder="Enter notes or rejection reasons..."
                      className="h-16 rounded border border-slate-200 p-2 font-normal resize-none outline-none focus:border-indigo-500"
                    />
                  </label>
                </div>

                {/* 3. Finance Workflow Clearance */}
                <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <h4 className="font-black text-slate-800 text-[11px] uppercase tracking-wider">Finance Manager Stage</h4>
                    <select value={financeStage} onChange={e => setFinanceStage(e.target.value as any)} className="h-8 rounded border border-slate-200 px-2 bg-white text-xs">
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    Clearance Notes / Outstanding Claims Description
                    <textarea
                      value={financeNotes}
                      onChange={e => setFinanceNotes(e.target.value)}
                      placeholder="Enter notes or pending claims status..."
                      className="h-16 rounded border border-slate-200 p-2 font-normal resize-none outline-none focus:border-indigo-500"
                    />
                  </label>
                </div>

                {/* 4. IT Team Workflow Clearance */}
                <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <h4 className="font-black text-slate-800 text-[11px] uppercase tracking-wider">IT Team / Assets Stage</h4>
                    <select value={itStage} onChange={e => setITStage(e.target.value as any)} className="h-8 rounded border border-slate-200 px-2 bg-white text-xs">
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    Clearance Notes / Handover Comments
                    <textarea
                      value={itNotes}
                      onChange={e => setItNotes(e.target.value)}
                      placeholder="Enter IT clearance comments..."
                      className="h-16 rounded border border-slate-200 p-2 font-normal resize-none outline-none focus:border-indigo-500"
                    />
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button type="button" onClick={() => setClearanceModal(false)} className="rounded border border-slate-200 bg-white px-4 py-2.5 text-slate-600 hover:bg-slate-50 transition">Cancel</button>
                  <button type="submit" className="rounded bg-indigo-600 hover:bg-indigo-700 transition px-5 py-2.5 text-white shadow">Save Changes</button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* MODAL: Warning Details & Template Form */}
        {warningModal && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-lg border-slate-200 bg-white p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
              <button onClick={() => setWarningModal(false)} className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
                <X className="size-5" />
              </button>
              <h3 className="text-base font-black text-slate-900 mb-1">{editingWarningId ? "Edit Warning" : "Add New Warning"}</h3>
              <p className="text-xs text-slate-400 mb-4 font-normal">Define warning specifics and select letterhead layout.</p>

              {error && <div className="mb-4 rounded-md bg-rose-50 p-3 text-xs font-bold text-rose-800 border border-rose-100">{error}</div>}

              <form onSubmit={handleWarningSubmit} className="space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-2 gap-4">
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    * User / Recipient Staff
                    <select value={warningUser} onChange={e => setWarningUser(e.target.value)} className="h-10 rounded border border-slate-200 px-3 bg-white outline-none">
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.id})</option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    * Warning Date
                    <input type="text" value={warningDate} onChange={e => setWarningDate(e.target.value)} className="h-10 rounded border border-slate-200 px-3 bg-slate-50/30 font-normal outline-none" required />
                  </label>
                </div>

                <label className="grid gap-1 font-bold text-slate-500 uppercase">
                  * Warning Title
                  <input type="text" value={warningTitle} onChange={e => setWarningTitle(e.target.value)} placeholder="e.g. Conduct Violation - Attendance Discrepancies" className="h-10 rounded border border-slate-200 px-3 font-normal outline-none" required />
                </label>

                {/* Tabs */}
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/20">
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">Description / Grievance notes<textarea value={warningDesc} onChange={e => setWarningDesc(e.target.value)} placeholder="Provide descriptive details..." className="h-20 rounded border border-slate-200 p-3 font-normal resize-none outline-none focus:border-indigo-500" required /></label>
                  <label className="grid gap-1 font-bold text-slate-500 uppercase mt-3">Warning Letterhead Template (Resolved Content)<textarea value={warningTemplate} onChange={e => setWarningTemplate(e.target.value)} className="h-20 rounded border border-slate-200 p-3 font-normal font-mono resize-none outline-none focus:border-indigo-500" /></label>
                </div>

                <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setWarningModal(false)} className="rounded border border-slate-200 bg-white px-4 py-2.5 text-slate-600 hover:bg-slate-50 transition">Cancel</button><button type="submit" className="rounded bg-indigo-600 hover:bg-indigo-700 transition px-5 py-2.5 text-white shadow">Create</button></div>
              </form>
            </Card>
          </div>
        )}

        {/* MODAL: Termination Details & Template Form */}
        {terminationModal && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-lg border-slate-200 bg-white p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
              <button onClick={() => setTerminationModal(false)} className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
                <X className="size-5" />
              </button>
              <h3 className="text-base font-black text-slate-900 mb-1">{editingTerminationId ? "Edit Termination Notice" : "Add New Termination"}</h3>
              <p className="text-xs text-slate-400 mb-4 font-normal">Define termination notice dates and letter template.</p>

              {error && <div className="mb-4 rounded-md bg-rose-50 p-3 text-xs font-bold text-rose-800 border border-rose-100">{error}</div>}

              <form onSubmit={handleTerminationSubmit} className="space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-2 gap-4">
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    * User / Subject Staff
                    <select value={terminationUser} onChange={e => setTerminationUser(e.target.value)} className="h-10 rounded border border-slate-200 px-3 bg-white outline-none">
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.id})</option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    * Notice Date
                    <input type="text" value={terminationNoticeDate} onChange={e => setTerminationNoticeDate(e.target.value)} className="h-10 rounded border border-slate-200 px-3 bg-white font-normal outline-none" required />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    * Termination Date
                    <input type="text" value={terminationDate} onChange={e => setTerminationDate(e.target.value)} className="h-10 rounded border border-slate-200 px-3 bg-white font-normal outline-none" required />
                  </label>
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    * Title / Reference
                    <input type="text" value={terminationTitle} onChange={e => setTerminationTitle(e.target.value)} placeholder="e.g. Contract Discontinuance" className="h-10 rounded border border-slate-200 px-3 font-normal outline-none" required />
                  </label>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/20">
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">Description / Performance Review Notes<textarea value={terminationDesc} onChange={e => setTerminationDesc(e.target.value)} placeholder="Provide descriptive termination grounds..." className="h-20 rounded border border-slate-200 p-3 font-normal resize-none outline-none focus:border-indigo-500" required /></label>
                  <label className="grid gap-1 font-bold text-slate-500 uppercase mt-3">Termination Letterhead Template (Resolved Content)<textarea value={terminationTemplate} onChange={e => setTerminationTemplate(e.target.value)} className="h-20 rounded border border-slate-200 p-3 font-normal font-mono resize-none outline-none focus:border-indigo-500" /></label>
                </div>

                <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setTerminationModal(false)} className="rounded border border-slate-200 bg-white px-4 py-2.5 text-slate-600 hover:bg-slate-50 transition">Cancel</button><button type="submit" className="rounded bg-indigo-600 hover:bg-indigo-700 transition px-5 py-2.5 text-white shadow">Create</button></div>
              </form>
            </Card>
          </div>
        )}

        {/* MODAL: Complaint Details & Template Form */}
        {complaintModal && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-lg border-slate-200 bg-white p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
              <button onClick={() => setComplaintModal(false)} className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
                <X className="size-5" />
              </button>
              <h3 className="text-base font-black text-slate-900 mb-1">{editingComplaintId ? "Edit Complaint Log" : "Add New Complaint"}</h3>
              <p className="text-xs text-slate-400 mb-4 font-normal">File official grievance complaints between staff profiles.</p>

              {error && <div className="mb-4 rounded-md bg-rose-50 p-3 text-xs font-bold text-rose-800 border border-rose-100">{error}</div>}

              <form onSubmit={handleComplaintSubmit} className="space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-2 gap-4">
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    * Title / Reference
                    <input type="text" value={complaintTitle} onChange={e => setComplaintTitle(e.target.value)} placeholder="e.g. Workspace harassment complaint" className="h-10 rounded border border-slate-200 px-3 font-normal outline-none" required />
                  </label>
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    * Date Time
                    <input type="text" value={complaintDate} onChange={e => setComplaintDate(e.target.value)} className="h-10 rounded border border-slate-200 px-3 bg-white font-normal outline-none" required />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    * From Staff
                    <select value={complaintFrom} onChange={e => setComplaintFrom(e.target.value)} className="h-10 rounded border border-slate-200 px-3 bg-white outline-none">
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.id})</option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    * To Staff (Accused)
                    <select value={complaintTo} onChange={e => setComplaintTo(e.target.value)} className="h-10 rounded border border-slate-200 px-3 bg-white outline-none">
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.id})</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    Proof Of Document
                    <input type="file" accept="image/*" onChange={handleDocUpload} className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                  </label>
                  <div className="grid gap-1">
                    <span className="font-bold text-slate-500 uppercase">Grievance Status</span>
                    <div className="flex gap-2 h-10 items-center">
                      {["Pending", "Approved", "Rejected"].map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setComplaintStatus(s as any)}
                          className={`flex-1 h-8 rounded text-[11px] font-black border transition ${
                            complaintStatus === s ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/20">
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">Description / Allegations Details<textarea value={complaintDesc} onChange={e => setComplaintDesc(e.target.value)} placeholder="Provide specific claims details..." className="h-16 rounded border border-slate-200 p-2 font-normal resize-none outline-none focus:border-indigo-500" required /></label>
                  <label className="grid gap-1 font-bold text-slate-500 uppercase mt-3">Complaint Letterhead Template<textarea value={complaintTemplate} onChange={e => setComplaintTemplate(e.target.value)} className="h-16 rounded border border-slate-200 p-2 font-normal font-mono resize-none outline-none focus:border-indigo-500" /></label>
                </div>

                <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setComplaintModal(false)} className="rounded border border-slate-200 bg-white px-4 py-2.5 text-slate-600 hover:bg-slate-50 transition">Cancel</button><button type="submit" className="rounded bg-indigo-600 hover:bg-indigo-700 transition px-5 py-2.5 text-white shadow">Create</button></div>
              </form>
            </Card>
          </div>
        )}
      </section>
    </main>
  );
}

export default function OffboardingPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[280px_1fr]">
        <SaasSidebar active="Offboarding" />
        <section className="p-6 lg:p-8 flex items-center justify-center text-xs text-slate-500 font-bold">
          Loading offboarding records...
        </section>
      </main>
    }>
      <OffboardingPageContent />
    </Suspense>
  );
}
