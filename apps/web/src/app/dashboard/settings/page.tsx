"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SaasSidebar } from "@/components/app/saas-sidebar";
import { Card, Badge } from "@/components/ui";
import { Search, Plus, X, Settings as SettingsIcon, MapPin, Coins, CheckCircle, Globe, Mail, GripVertical, Eye, EyeOff } from "lucide-react";
import { defaultLocations, defaultCurrencies } from "@/lib/data";

// ─── Default Sections ────────────────────────────────────────────────────────
// These mirror the existing landing page sections and are pre-loaded into the
// Frontend Customizer so admins can edit them immediately without starting blank.
const DEFAULT_LANDING_SECTIONS = [
  {
    id: "sec-hero",
    type: "hero",
    visible: true,
    title: "Complete HRMS and Payroll Software for Indian Businesses",
    subtitle: "Hire to retire, payroll to compliance",
    badge: "Multi-tenant SaaS",
    content: "Run employee records, attendance, leave, recruitment, onboarding, payroll, statutory compliance, documents, expenses, assets, workflows, and employee self-service from one SaaS platform.",
    cta1Label: "Start Free Registration",
    cta2Label: "View SaaS Console",
    items: ""
  },
  {
    id: "sec-industries",
    type: "marquee",
    visible: true,
    title: "Trusted Across Industries",
    subtitle: "",
    badge: "",
    content: "",
    cta1Label: "",
    cta2Label: "",
    items: "SMEs\nHospitals\nManufacturing\nIT and Consulting\nStaffing Agencies\nNBFCs\nRetail Chains\nReal Estate"
  },
  {
    id: "sec-features",
    type: "grid",
    visible: true,
    title: "Everything HR, Payroll, Compliance, and Employee Experience Needs",
    subtitle: "Functionality, section by section",
    badge: "",
    content: "Designed for Indian organizations that need a practical daily HR tool and a scalable SaaS operating model.",
    cta1Label: "",
    cta2Label: "",
    items: "Core HR and Employee Lifecycle: Employee master, KYC, documents, onboarding, probation, transfers, exits, letters, assets, and ESS.\nAttendance, Shifts and Leave: Biometric, mobile, geo-fenced, QR attendance, overtime, late marks, flexible shifts, leave balance, and approvals.\nIndian Payroll and Compliance: Salary structures, EPF, EPS, ESIC, PT, LWF, TDS, Form 16, Form 24Q, payslips, bank files, and audit trails.\nRecruitment and AI Assistant: Requisitions, careers portal, ATS, resume ranking, interview questions, offer letters, and HR policy drafts.\nPerformance, LMS and Expenses: KRA, KPI, OKR, appraisals, courses, certifications, travel requests, expense claims, and reimbursements.\nSaaS, Security and White Label: Multi-tenant isolation, custom domains, branding, SMTP, WhatsApp, IP restrictions, MFA, and activity logs."
  },
  {
    id: "sec-compliance",
    type: "cards",
    visible: true,
    title: "Payroll that Understands Indian Statutory Workflows",
    subtitle: "India compliance built in",
    badge: "",
    content: "Configure payroll components, state-wise rules, tax regimes, reimbursements, arrears, overtime, payroll locks, audit trails, and statutory report exports.",
    cta1Label: "",
    cta2Label: "",
    items: "EPF and EPS\nESIC\nProfessional Tax\nLabour Welfare Fund\nTDS\nForm 16 and 24Q\nGratuity\nBonus Act"
  },
  {
    id: "sec-saas",
    type: "highlights",
    visible: true,
    title: "Built to Sell, Operate, and Scale as a Subscription Product",
    subtitle: "SaaS platform",
    badge: "",
    content: "",
    cta1Label: "",
    cta2Label: "",
    items: "Tenant isolation: Every customer has isolated company data, branding, roles, and configuration.\nSubscription billing: Plans, employee-based pricing, invoices, GST, trials, and usage metering.\nWhite label partners: Custom domain, logo, colors, SMTP, WhatsApp, and reseller-ready controls."
  },
  {
    id: "sec-pricing",
    type: "pricing",
    visible: true,
    title: "Simple Per-Employee Pricing for Every Stage",
    subtitle: "Pricing",
    badge: "",
    content: "",
    cta1Label: "Choose Plan",
    cta2Label: "",
    items: "Starter: 49: Up to 50 employees. Core HR and payroll.\nGrowth: 89: Up to 500 employees. Full compliance suite.\nEnterprise: 149: Unlimited employees. AI and white-label.\nPartner: 0: Reseller program. Custom pricing."
  },
  {
    id: "sec-contact",
    type: "contact",
    visible: true,
    title: "Ready to Launch Your HRMS SaaS?",
    subtitle: "Contact",
    badge: "",
    content: "Request a demo for HR, payroll, compliance, employee self-service, and white-label partner workflows.",
    cta1Label: "Register and Continue",
    cta2Label: "",
    items: "+91 98765 43210\nsales@bharathrms.example\nMumbai, Maharashtra, India\nCustom domain and SaaS deployment ready"
  }
];
// ─────────────────────────────────────────────────────────────────────────────

function formatAlphanumeric(num: number, padding: number): string {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  let n = num;
  while (n > 0) {
    result = chars[n % 36] + result;
    n = Math.floor(n / 36);
  }
  return result.padStart(padding, "0");
}

// ─── Shared Helper Components ────────────────────────────────────────────────
function ColorPickerField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="grid gap-1 font-bold text-slate-500 uppercase text-[10px]">
      {label}
      <div className="flex gap-1.5 items-center">
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="size-10 rounded border border-slate-200 cursor-pointer p-0 bg-transparent shrink-0"
        />
        <span className="font-mono text-slate-400">{value}</span>
      </div>
    </label>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

function SettingsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tab state synced with query param ?tab=company/locations/currencies
  const initialTab = searchParams.get("tab") || "company";
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const [company, setCompany] = useState<any | null>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);

  // Form states: Company Settings
  const [compName, setCompName] = useState("");
  const [compDomain, setCompDomain] = useState("");
  const [compEmail, setCompEmail] = useState("");
  const [compPhone, setCompPhone] = useState("");
  const [compTimezone, setCompTimezone] = useState("UTC+5:30 (Kolkata)");
  const [compDateFormat, setCompDateFormat] = useState("YYYY-MM-DD");
  const [compLogo, setCompLogo] = useState("");

  // Form states: Employee ID Setup
  const [idPrefix, setIdPrefix] = useState("EMP-");
  const [idNextNumber, setIdNextNumber] = useState(9);
  const [idType, setIdType] = useState("Numeric");
  const [idPadding, setIdPadding] = useState(3);

  // Form states: Email & SMTP Configurations
  const [smtpHost, setSmtpHost] = useState("smtp.mailtrap.io");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("username");
  const [smtpPass, setSmtpPass] = useState("password");
  const [smtpFromEmail, setSmtpFromEmail] = useState("noreply@imxportex.com");
  const [smtpFromName, setSmtpFromName] = useState("Bharat HRMS Notifications");
  const [notificationToggles, setNotificationToggles] = useState<any>({
    offerLetter: { employee: true, manager: true },
    appliedLeave: { employee: true, manager: true },
    appreciations: { employee: true, manager: true },
    attendanceReg: { employee: true, manager: true },
    resignation: { employee: true, manager: true },
    warning: { employee: true, manager: true },
    termination: { employee: true, manager: true },
    complaint: { employee: true, manager: true }
  });

  // Customizer states
  const [toMonth, setToMonth] = useState(0);
  const [toYear, setToYear] = useState(2024);
  const [currentMonthLimit, setCurrentMonthLimit] = useState(0);
  const [currentYearLimit, setCurrentYearLimit] = useState(2024);
  const [themePreset, setThemePreset] = useState("indigo");
  const [primaryColor, setPrimaryColor] = useState("#4f46e5");
  const [secondaryColor, setSecondaryColor] = useState("#0ea5e9");
  const [bgColor, setBgColor] = useState("#f8fafc");
  const [textColor, setTextColor] = useState("#0f172a");
  const [fontFamily, setFontFamily] = useState("Outfit");
  const [fontSize, setFontSize] = useState("medium");
  // ── Header Design
  const [headerBg, setHeaderBg] = useState("#ffffff");
  const [headerTextColor, setHeaderTextColor] = useState("#0f172a");
  const [headerNavColor, setHeaderNavColor] = useState(""); // empty = use primaryColor
  const [headerLogoTextVisible, setHeaderLogoTextVisible] = useState(true);
  const [headerLogoUrl, setHeaderLogoUrl] = useState("");
  // ── Footer Design
  const [footerBg, setFooterBg] = useState("#ffffff");
  const [footerTextColor, setFooterTextColor] = useState("#64748b");
  const [footerLinkColor, setFooterLinkColor] = useState(""); // empty = use primaryColor
  const [footerText, setFooterText] = useState(""); // custom footer copyright text
  // ── Sections
  const [sections, setSections] = useState<any[]>([]);
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  // Extended section fields
  const [newSecTitle, setNewSecTitle] = useState("");
  const [newSecSubtitle, setNewSecSubtitle] = useState("");
  const [newSecBadge, setNewSecBadge] = useState("");
  const [newSecContent, setNewSecContent] = useState("");
  const [newSecItems, setNewSecItems] = useState("");
  const [newSecCta1, setNewSecCta1] = useState("");
  const [newSecCta2, setNewSecCta2] = useState("");
  const [newSecType, setNewSecType] = useState("hero");
  const [newSecVisible, setNewSecVisible] = useState(true);
  const [newSecSectionBg, setNewSecSectionBg] = useState(""); // custom bg per section
  const [newSecCardBg, setNewSecCardBg] = useState("");       // custom card bg per section

  // Form states: Location Modals
  const [locationModal, setLocationModal] = useState(false);
  const [locName, setLocName] = useState("");
  const [locAddress, setLocAddress] = useState("");
  const [locRegion, setLocRegion] = useState("South India");
  const [locOfficeType, setLocOfficeType] = useState("Corporate Office");
  const [locCity, setLocCity] = useState("");
  const [editLocationId, setEditLocationId] = useState<number | null>(null);

  // Form states: Currency Modals
  const [currencyModal, setCurrencyModal] = useState(false);
  const [currName, setCurrName] = useState("");
  const [currCode, setCurrCode] = useState("");
  const [currSymbol, setCurrSymbol] = useState("");
  const [editCurrencyId, setEditCurrencyId] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [emailLogs, setEmailLogs] = useState<any[]>([]);

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

  const applyPresetTheme = (preset: string) => {
    setThemePreset(preset);
    if (preset === "indigo") {
      setPrimaryColor("#4f46e5");
      setSecondaryColor("#0ea5e9");
      setBgColor("#f8fafc");
      setTextColor("#0f172a");
    } else if (preset === "emerald") {
      setPrimaryColor("#059669");
      setSecondaryColor("#10b981");
      setBgColor("#f0fdf4");
      setTextColor("#064e3b");
    } else if (preset === "rose") {
      setPrimaryColor("#db2777");
      setSecondaryColor("#f43f5e");
      setBgColor("#fff1f2");
      setTextColor("#4c0519");
    } else if (preset === "ocean") {
      setPrimaryColor("#0284c7");
      setSecondaryColor("#06b6d4");
      setBgColor("#f0f9ff");
      setTextColor("#082f49");
    } else if (preset === "dark") {
      setPrimaryColor("#334155");
      setSecondaryColor("#64748b");
      setBgColor("#1e293b");
      setTextColor("#f8fafc");
    } else if (preset === "sunset") {
      setPrimaryColor("#ea580c");
      setSecondaryColor("#f97316");
      setBgColor("#fff7ed");
      setTextColor("#431407");
    }
  };

  const handleSaveFrontendConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const config = buildFullConfig(sections);
    localStorage.setItem("hrms_frontend_config", JSON.stringify(config));
    setSuccess("Frontend theme and sections config saved successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const buildFullConfig = (updatedSections: any[]) => ({
    themePreset,
    primaryColor,
    secondaryColor,
    bgColor,
    textColor,
    fontFamily,
    fontSize,
    // Header
    headerBg,
    headerTextColor,
    headerNavColor,
    headerLogoTextVisible,
    headerLogoUrl,
    // Footer
    footerBg,
    footerTextColor,
    footerLinkColor,
    footerText,
    sections: updatedSections
  });

  const handleOpenAddSection = () => {
    setEditingSectionId(null);
    setNewSecTitle("");
    setNewSecSubtitle("");
    setNewSecBadge("");
    setNewSecContent("");
    setNewSecItems("");
    setNewSecCta1("");
    setNewSecCta2("");
    setNewSecType("hero");
    setNewSecVisible(true);
    setNewSecSectionBg("");
    setNewSecCardBg("");
    setSectionModalOpen(true);
  };

  const handleOpenEditSection = (sec: any) => {
    setEditingSectionId(sec.id);
    setNewSecTitle(sec.title || "");
    setNewSecSubtitle(sec.subtitle || "");
    setNewSecBadge(sec.badge || "");
    setNewSecContent(sec.content || "");
    setNewSecItems(sec.items || "");
    setNewSecCta1(sec.cta1Label || "");
    setNewSecCta2(sec.cta2Label || "");
    setNewSecType(sec.type || "hero");
    setNewSecVisible(sec.visible !== false);
    setNewSecSectionBg(sec.sectionBg || "");
    setNewSecCardBg(sec.cardBg || "");
    setSectionModalOpen(true);
  };

  const handleSaveSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSecTitle.trim()) {
      alert("Section title is required.");
      return;
    }

    const sectionData = {
      title: newSecTitle,
      subtitle: newSecSubtitle,
      badge: newSecBadge,
      content: newSecContent,
      items: newSecItems,
      cta1Label: newSecCta1,
      cta2Label: newSecCta2,
      type: newSecType,
      visible: newSecVisible,
      sectionBg: newSecSectionBg,
      cardBg: newSecCardBg
    };

    let updated;
    if (editingSectionId !== null) {
      updated = sections.map(s => s.id === editingSectionId ? { ...s, ...sectionData } : s);
    } else {
      const newId = `sec-${Date.now()}`;
      updated = [...sections, { id: newId, ...sectionData }];
    }
    setSections(updated);
    persistFrontendConfig(updated);
    setSectionModalOpen(false);
  };

  const persistFrontendConfig = (updatedSections: any[]) => {
    localStorage.setItem("hrms_frontend_config", JSON.stringify(buildFullConfig(updatedSections)));
  };

  const handleToggleSectionVisibility = (id: string) => {
    const updated = sections.map(s => s.id === id ? { ...s, visible: s.visible === false ? true : false } : s);
    setSections(updated);
    persistFrontendConfig(updated);
  };

  const handleDeleteSection = (id: string) => {
    const isDefault = DEFAULT_LANDING_SECTIONS.some(d => d.id === id);
    const msg = isDefault
      ? "This is a default section. Deleting it will remove it from your frontend. Are you sure?"
      : "Are you sure you want to delete this homepage section?";
    if (confirm(msg)) {
      const updated = sections.filter(s => s.id !== id);
      setSections(updated);
      persistFrontendConfig(updated);
    }
  };

  const handleMoveSection = (idx: number, direction: "up" | "down") => {
    const copy = [...sections];
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx >= 0 && targetIdx < copy.length) {
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      setSections(copy);
      persistFrontendConfig(copy);
    }
  };

  const handleResetToDefaults = () => {
    if (confirm("Reset all sections to the default template? Your custom edits will be lost.")) {
      setSections(DEFAULT_LANDING_SECTIONS);
      persistFrontendConfig(DEFAULT_LANDING_SECTIONS);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const logs = localStorage.getItem("hrms_email_notifications_log");
      if (logs) {
        setEmailLogs(JSON.parse(logs));
      }
    }
  }, [activeTab]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userType = localStorage.getItem("session_user_type");
      if (userType !== "company") {
        router.push("/login?tab=company");
        return;
      }

      // Initialize dynamic limits on client-side mount
      const d = new Date();
      setToMonth(d.getMonth());
      setToYear(d.getFullYear());
      setCurrentMonthLimit(d.getMonth());
      setCurrentYearLimit(d.getFullYear());

      // Load Frontend Customizer settings
      const storedFrontend = localStorage.getItem("hrms_frontend_config");
      if (storedFrontend) {
        const config = JSON.parse(storedFrontend);
        setThemePreset(config.themePreset || "indigo");
        setPrimaryColor(config.primaryColor || "#4f46e5");
        setSecondaryColor(config.secondaryColor || "#0ea5e9");
        setBgColor(config.bgColor || "#f8fafc");
        setTextColor(config.textColor || "#0f172a");
        setFontFamily(config.fontFamily || "Outfit");
        setFontSize(config.fontSize || "medium");
        // Header
        setHeaderBg(config.headerBg || "#ffffff");
        setHeaderTextColor(config.headerTextColor || "#0f172a");
        setHeaderNavColor(config.headerNavColor || "");
        setHeaderLogoTextVisible(config.headerLogoTextVisible !== false);
        setHeaderLogoUrl(config.headerLogoUrl || "");
        // Footer
        setFooterBg(config.footerBg || "#ffffff");
        setFooterTextColor(config.footerTextColor || "#64748b");
        setFooterLinkColor(config.footerLinkColor || "");
        setFooterText(config.footerText || "");
        if (config.sections && config.sections.length > 0) {
          const merged = DEFAULT_LANDING_SECTIONS.map(def => {
            const saved = config.sections.find((s: any) => s.id === def.id);
            return saved ? { ...def, ...saved } : def;
          });
          const customSections = config.sections.filter((s: any) => !DEFAULT_LANDING_SECTIONS.find(d => d.id === s.id));
          setSections([...merged, ...customSections]);
        } else {
          setSections(DEFAULT_LANDING_SECTIONS);
        }
      } else {
        setSections(DEFAULT_LANDING_SECTIONS);
      }

      // Load Company Details
      const companyStr = localStorage.getItem("session_company");
      if (companyStr) {
        const co = JSON.parse(companyStr);
        setCompany(co);
        setCompName(co.name || "Acme India Pvt Ltd");
        setCompDomain(co.domain || "hr.acmeindia.in");
        setCompEmail(localStorage.getItem("session_company_email") || "admin@example.com");
        setCompLogo(co.logo || "");
      }

      // Load Locations
      const storedLoc = localStorage.getItem("hrms_locations");
      if (storedLoc) {
        setLocations(JSON.parse(storedLoc));
      } else {
        localStorage.setItem("hrms_locations", JSON.stringify(defaultLocations));
        setLocations(defaultLocations);
      }

      // Load Currencies
      const storedCurr = localStorage.getItem("hrms_currencies");
      if (storedCurr) {
        setCurrencies(JSON.parse(storedCurr));
      } else {
        localStorage.setItem("hrms_currencies", JSON.stringify(defaultCurrencies));
        setCurrencies(defaultCurrencies);
      }

      // Load ID Settings
      const storedIdConfig = localStorage.getItem("hrms_id_config");
      if (storedIdConfig) {
        const config = JSON.parse(storedIdConfig);
        setIdPrefix(config.prefix || "EMP-");
        setIdNextNumber(Number(config.nextNumber) || 9);
        setIdType(config.idType || "Numeric");
        setIdPadding(Number(config.paddingLength) || 3);
      } else {
        const defaultConfig = { prefix: "EMP-", nextNumber: 9, idType: "Numeric", paddingLength: 3 };
        localStorage.setItem("hrms_id_config", JSON.stringify(defaultConfig));
      }

      // Load Email Config
      const storedEmailConfig = localStorage.getItem("hrms_email_config");
      if (storedEmailConfig) {
        const config = JSON.parse(storedEmailConfig);
        setSmtpHost(config.smtpHost || "smtp.mailtrap.io");
        setSmtpPort(config.smtpPort || "587");
        setSmtpUser(config.smtpUser || "username");
        setSmtpPass(config.smtpPass || "password");
        setSmtpFromEmail(config.fromEmail || "noreply@imxportex.com");
        setSmtpFromName(config.fromName || "Bharat HRMS Notifications");
        if (config.toggles) {
          setNotificationToggles(config.toggles);
        }
      } else {
        const defaultConfig = {
          smtpHost: "smtp.mailtrap.io",
          smtpPort: "587",
          smtpUser: "username",
          smtpPass: "password",
          fromEmail: "noreply@imxportex.com",
          fromName: "Bharat HRMS Notifications",
          toggles: {
            offerLetter: { employee: true, manager: true },
            appliedLeave: { employee: true, manager: true },
            appreciations: { employee: true, manager: true },
            attendanceReg: { employee: true, manager: true },
            resignation: { employee: true, manager: true },
            warning: { employee: true, manager: true },
            termination: { employee: true, manager: true },
            complaint: { employee: true, manager: true }
          }
        };
        localStorage.setItem("hrms_email_config", JSON.stringify(defaultConfig));
      }
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
    router.push(`/dashboard/settings?tab=${tab}` as any);
  };

  // Save Company settings
  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!compName.trim()) {
      setError("Company Name is required.");
      return;
    }

    const updatedCo = {
      ...company,
      name: compName,
      domain: compDomain,
      logo: compLogo
    };

    localStorage.setItem("session_company", JSON.stringify(updatedCo));
    localStorage.setItem("session_company_email", compEmail);
    setCompany(updatedCo);

    // Notify sidebar to refresh company name
    window.dispatchEvent(new Event("viewModeChanged"));

    setSuccess("Company settings updated successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save/Update Location
  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!locCity.trim() || !locAddress.trim()) {
      setError("Please fill out both office city and address.");
      return;
    }

    let updated;
    if (editLocationId !== null) {
      updated = locations.map(l => l.id === editLocationId ? {
        ...l,
        name: `${locCity} (${locOfficeType})`,
        region: locRegion,
        officeType: locOfficeType,
        city: locCity,
        address: locAddress
      } : l);
      setSuccess("Office branch location updated successfully!");
    } else {
      const newId = locations.length > 0 ? Math.max(...locations.map(l => l.id)) + 1 : 1;
      const payload = {
        id: newId,
        name: `${locCity} (${locOfficeType})`,
        region: locRegion,
        officeType: locOfficeType,
        city: locCity,
        address: locAddress
      };
      updated = [...locations, payload];
      setSuccess("Office branch location added successfully!");
    }

    setLocations(updated);
    localStorage.setItem("hrms_locations", JSON.stringify(updated));
    setTimeout(() => setLocationModal(false), 800);
  };

  const handleEditLocation = (loc: any) => {
    setEditLocationId(loc.id);
    setLocRegion(loc.region || "South India");
    setLocOfficeType(loc.officeType || "Corporate Office");
    setLocCity(loc.city || "");
    setLocAddress(loc.address || "");
    setError(null);
    setSuccess(null);
    setLocationModal(true);
  };
  const handleDeleteLocation = (id: number) => {
    if (confirm("Are you sure you want to delete this office location?")) {
      const updated = locations.filter(l => l.id !== id);
      setLocations(updated);
      localStorage.setItem("hrms_locations", JSON.stringify(updated));
      setSuccess("Office branch location deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  // Save/Update Currency
  const handleSaveCurrency = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currName.trim() || !currCode.trim() || !currSymbol.trim()) {
      setError("Please fill out all currency fields.");
      return;
    }

    let updated;
    if (editCurrencyId !== null) {
      updated = currencies.map(c => c.id === editCurrencyId ? { ...c, name: currName, code: currCode.toUpperCase(), symbol: currSymbol } : c);
      setSuccess("Currency updated successfully!");
    } else {
      const newId = currencies.length > 0 ? Math.max(...currencies.map(c => c.id)) + 1 : 1;
      const payload = {
        id: newId,
        name: currName,
        code: currCode.toUpperCase(),
        symbol: currSymbol,
        position: "left"
      };
      updated = [...currencies, payload];
      setSuccess("New currency added successfully!");
    }

    setCurrencies(updated);
    localStorage.setItem("hrms_currencies", JSON.stringify(updated));
    setTimeout(() => setCurrencyModal(false), 800);
  };

  const handleEditCurrency = (curr: any) => {
    setEditCurrencyId(curr.id);
    setCurrName(curr.name);
    setCurrCode(curr.code);
    setCurrSymbol(curr.symbol);
    setError(null);
    setSuccess(null);
    setCurrencyModal(true);
  };

  const handleDeleteCurrency = (id: number) => {
    if (confirm("Are you sure you want to delete this currency?")) {
      const updated = currencies.filter(c => c.id !== id);
      setCurrencies(updated);
      localStorage.setItem("hrms_currencies", JSON.stringify(updated));
      setSuccess("Currency deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleSaveIdConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const config = {
      prefix: idPrefix,
      nextNumber: Number(idNextNumber),
      idType,
      paddingLength: Number(idPadding)
    };

    localStorage.setItem("hrms_id_config", JSON.stringify(config));
    setSuccess("Employee ID generation settings saved!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleSaveEmailConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const config = {
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPass,
      fromEmail: smtpFromEmail,
      fromName: smtpFromName,
      toggles: notificationToggles
    };

    localStorage.setItem("hrms_email_config", JSON.stringify(config));
    setSuccess("Email and SMTP notification configurations saved!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleToggleNotification = (eventKey: string, recipient: "employee" | "manager") => {
    setNotificationToggles((prev: any) => {
      const updated = { ...prev };
      if (!updated[eventKey]) {
        updated[eventKey] = { employee: true, manager: true };
      }
      updated[eventKey] = {
        ...updated[eventKey],
        [recipient]: !updated[eventKey][recipient]
      };
      return updated;
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[280px_1fr]">
      <SaasSidebar active="Settings" />

      <section className="p-6 lg:p-8 overflow-y-auto">
        {/* Header */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white -mx-6 -mt-6 p-6 lg:-mx-8 lg:-mt-8 shadow-sm">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Workspace Configurations</h2>
            <p className="mt-1 text-sm text-slate-500">Configure company properties, register office locations, and set standard currency models.</p>
          </div>
          {activeTab === "locations" && (
            <button
              onClick={() => { setLocRegion("South India"); setLocOfficeType("Corporate Office"); setLocCity(""); setLocAddress(""); setError(null); setSuccess(null); setLocationModal(true); }}
              className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-xs font-black text-white shadow hover:bg-indigo-700 transition"
            >
              <Plus className="size-4" /> Add Location
            </button>
          )}
          {activeTab === "currencies" && (
            <button
              onClick={() => { setCurrName(""); setCurrCode(""); setCurrSymbol(""); setError(null); setSuccess(null); setCurrencyModal(true); }}
              className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-xs font-black text-white shadow hover:bg-indigo-700 transition"
            >
              <Plus className="size-4" /> Add Currency
            </button>
          )}
        </header>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 mb-6 text-xs font-bold text-slate-400">
          <button
            onClick={() => handleTabChange("company")}
            className={`py-3 px-6 border-b-2 transition ${activeTab === "company" ? "border-indigo-600 text-indigo-600 font-extrabold" : "border-transparent hover:text-slate-700"}`}
          >
            Company Profile
          </button>
          <button
            onClick={() => handleTabChange("locations")}
            className={`py-3 px-6 border-b-2 transition ${activeTab === "locations" ? "border-indigo-600 text-indigo-600 font-extrabold" : "border-transparent hover:text-slate-700"}`}
          >
            Office Locations
          </button>
          <button
            onClick={() => handleTabChange("currencies")}
            className={`py-3 px-6 border-b-2 transition ${activeTab === "currencies" ? "border-indigo-600 text-indigo-600 font-extrabold" : "border-transparent hover:text-slate-700"}`}
          >
            Active Currencies
          </button>
          <button
            onClick={() => handleTabChange("id_setup")}
            className={`py-3 px-6 border-b-2 transition ${activeTab === "id_setup" ? "border-indigo-600 text-indigo-600 font-extrabold" : "border-transparent hover:text-slate-700"}`}
          >
            Employee ID Setup
          </button>
          <button
            onClick={() => handleTabChange("email_config")}
            className={`py-3 px-6 border-b-2 transition ${activeTab === "email_config" ? "border-indigo-600 text-indigo-600 font-extrabold" : "border-transparent hover:text-slate-700"}`}
          >
            Email & Notifications
          </button>
          <button
            onClick={() => handleTabChange("frontend_editor")}
            className={`py-3 px-6 border-b-2 transition ${activeTab === "frontend_editor" ? "border-indigo-600 text-indigo-600 font-extrabold" : "border-transparent hover:text-slate-700"}`}
          >
            Frontend Customizer
          </button>
        </div>

        {success && (
          <div className="mb-5 flex items-center gap-2 rounded-md bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800 animate-pulse">
            <CheckCircle className="size-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        {/* Dynamic settings views */}
        {activeTab === "company" && (
          <Card className="border-slate-200 bg-white p-6 max-w-2xl shadow-sm">
            <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
              <Globe className="size-4 text-indigo-500" /> General Company Information
            </h3>

            {error && (
              <div className="mb-4 rounded-md bg-rose-50 p-3 text-xs font-bold text-rose-800 border border-rose-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSaveCompany} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <label className="grid gap-1 font-bold text-slate-500 uppercase">
                  Company Legal Name
                  <input
                    type="text"
                    value={compName}
                    onChange={(e) => setCompName(e.target.value)}
                    className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                    required
                  />
                </label>

                <label className="grid gap-1 font-bold text-slate-500 uppercase">
                  Workspace Domain Code
                  <input
                    type="text"
                    value={compDomain}
                    onChange={(e) => setCompDomain(e.target.value)}
                    className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                    required
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="grid gap-1 font-bold text-slate-500 uppercase">
                  Working Email Address
                  <input
                    type="email"
                    value={compEmail}
                    onChange={(e) => setCompEmail(e.target.value)}
                    className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                    required
                  />
                </label>

                <label className="grid gap-1 font-bold text-slate-500 uppercase">
                  Primary Timezone
                  <select
                    value={compTimezone}
                    onChange={(e) => setCompTimezone(e.target.value)}
                    className="h-10 rounded border border-slate-200 px-3 bg-white outline-none focus:border-indigo-500"
                  >
                    <option value="UTC+5:30 (Kolkata)">UTC+5:30 (Kolkata / Indian Standard Time)</option>
                    <option value="UTC+0:00 (GMT)">UTC+0:00 (Greenwich Mean Time)</option>
                    <option value="UTC-5:00 (Eastern)">UTC-5:00 (US Eastern Standard Time)</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="grid gap-1 font-bold text-slate-500 uppercase">
                  Standard Date Format
                  <select
                    value={compDateFormat}
                    onChange={(e) => setCompDateFormat(e.target.value)}
                    className="h-10 rounded border border-slate-200 px-3 bg-white outline-none focus:border-indigo-500"
                  >
                    <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-05-30)</option>
                    <option value="DD-MM-YYYY">DD-MM-YYYY (e.g. 30-05-2026)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 05/30/2026)</option>
                  </select>
                </label>

                <label className="grid gap-1 font-bold text-slate-500 uppercase">
                  Support Contact Phone
                  <input
                    type="text"
                    value={compPhone}
                    onChange={(e) => setCompPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="grid gap-1 font-bold text-slate-500 uppercase col-span-2">
                  Company Logo
                  <div className="flex items-center gap-4 mt-1">
                    {compLogo ? (
                      <div className="relative size-16 rounded-md border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center shrink-0">
                        <img src={compLogo} alt="Company Logo" className="size-full object-contain" />
                        <button
                          type="button"
                          onClick={() => setCompLogo("")}
                          className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition flex items-center justify-center text-white text-[10px] font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="size-16 rounded-md border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 shrink-0 text-[10px]">
                        <span>No Logo</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 file:hover:bg-indigo-100 file:cursor-pointer"
                    />
                  </div>
                </label>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="rounded bg-indigo-600 hover:bg-indigo-700 transition px-6 py-2.5 font-bold text-white shadow"
                >
                  Save Company Profile
                </button>
              </div>
            </form>
          </Card>
        )}

        {activeTab === "locations" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map(loc => (
              <Card key={loc.id} className="border-slate-200 p-5 bg-white shadow-sm hover:border-indigo-200 transition flex flex-col justify-between min-h-[190px]">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                    <Badge className="bg-indigo-50 text-indigo-700 font-bold text-[9px]">
                      {loc.region || "South India"}
                    </Badge>
                    <Badge className="bg-slate-100 text-slate-700 font-bold text-[9px]">
                      {loc.officeType || "Corporate Office"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-indigo-50 rounded text-indigo-600 shrink-0">
                      <MapPin className="size-4 animate-bounce" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 text-sm">{loc.city || loc.name}</h3>
                      <p className="text-[9px] text-slate-400 font-mono mt-0.5">Location ID: LOC-0{loc.id}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-3 font-normal leading-relaxed">{loc.address}</p>
                </div>
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between mt-3">
                  <span className="text-[9px] text-indigo-600 font-bold uppercase tracking-wider">
                    {loc.region || "South India"} &rsaquo; {loc.officeType || "Corporate"} &rsaquo; {loc.city || "City"}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleEditLocation(loc)}
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      Edit
                    </button>
                    <span className="text-slate-200">|</span>
                    <button
                      onClick={() => handleDeleteLocation(loc.id)}
                      className="text-[10px] font-bold text-rose-600 hover:text-rose-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "currencies" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currencies.map(curr => (
              <Card key={curr.id} className="border-slate-200 p-5 bg-white shadow-sm hover:border-indigo-200 transition flex flex-col justify-between h-36">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-indigo-50 rounded text-indigo-600">
                      <Coins className="size-4" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 text-sm">{curr.name} ({curr.code})</h3>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">Symbol position: Left</p>
                    </div>
                  </div>
                  <Badge>{curr.code}</Badge>
                </div>
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Symbol Sign: <span className="text-sm font-black text-slate-800 ml-1">{curr.symbol}</span></span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditCurrency(curr)}
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      Edit
                    </button>
                    <span className="text-slate-200">|</span>
                    <button
                      onClick={() => handleDeleteCurrency(curr.id)}
                      className="text-[10px] font-bold text-rose-600 hover:text-rose-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "id_setup" && (
          <Card className="border-slate-200 bg-white p-6 max-w-2xl shadow-sm animate-in fade-in duration-200">
            <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
              <SettingsIcon className="size-4 text-indigo-500" /> Employee ID Configuration Setup
            </h3>

            <form onSubmit={handleSaveIdConfig} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <label className="grid gap-1 font-bold text-slate-500 uppercase">
                  Employee ID Prefix
                  <input
                    type="text"
                    value={idPrefix}
                    onChange={(e) => setIdPrefix(e.target.value)}
                    placeholder="e.g. EMP-"
                    className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                  />
                </label>

                <label className="grid gap-1 font-bold text-slate-500 uppercase">
                  Starting / Next Number
                  <input
                    type="number"
                    value={idNextNumber}
                    onChange={(e) => setIdNextNumber(Math.max(1, Number(e.target.value)))}
                    className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="grid gap-1 font-bold text-slate-500 uppercase">
                  Sequence Type Setup
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                    className="h-10 rounded border border-slate-200 px-3 bg-white outline-none focus:border-indigo-500"
                  >
                    <option value="Numeric">Numeric (Sequential: 001, 002...)</option>
                    <option value="Alpha-Numeric">Alpha-Numeric (Sequential Base-36: 009, 00A, 00B...)</option>
                  </select>
                </label>

                <label className="grid gap-1 font-bold text-slate-500 uppercase">
                  Padding Length (Digits)
                  <input
                    type="number"
                    value={idPadding}
                    onChange={(e) => setIdPadding(Math.max(1, Math.min(10, Number(e.target.value))))}
                    className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                  />
                </label>
              </div>

              <div className="mt-4 p-4 rounded bg-indigo-50/50 border border-indigo-100 flex flex-col gap-1">
                <span className="font-extrabold text-indigo-950 uppercase text-[10px]">ID Generation Preview</span>
                <span className="text-lg font-black text-indigo-700 font-mono">
                  {idPrefix}{idType === "Numeric" ? String(idNextNumber).padStart(idPadding, "0") : formatAlphanumeric(idNextNumber, idPadding)}
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  Onboarding a new employee will auto-assign this ID, then increment the sequence automatically.
                </span>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="rounded bg-indigo-600 hover:bg-indigo-700 transition px-6 py-2.5 font-bold text-white shadow"
                >
                  Save ID Setup Rules
                </button>
              </div>
            </form>
          </Card>
        )}

        {activeTab === "email_config" && (
          <Card className="border-slate-200 bg-white p-6 max-w-3xl shadow-sm animate-in fade-in duration-200">
            <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
              <Mail className="size-4 text-indigo-500" /> SMTP Configuration & Notification Toggles
            </h3>

            <form onSubmit={handleSaveEmailConfig} className="space-y-6 text-xs">
              <div>
                <h4 className="font-black text-slate-700 mb-3 text-[11px] uppercase tracking-wider">SMTP Server Properties (Mock)</h4>
                <div className="grid grid-cols-3 gap-4">
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    SMTP Host / Server
                    <input
                      type="text"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                      placeholder="smtp.example.com"
                      className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                    />
                  </label>

                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    SMTP Port
                    <input
                      type="text"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                      placeholder="587"
                      className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                    />
                  </label>

                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    SMTP Username
                    <input
                      type="text"
                      value={smtpUser}
                      onChange={(e) => setSmtpUser(e.target.value)}
                      placeholder="smtp_user"
                      className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-3">
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    SMTP Password
                    <input
                      type="password"
                      value={smtpPass}
                      onChange={(e) => setSmtpPass(e.target.value)}
                      placeholder="••••••••"
                      className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                    />
                  </label>

                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    Sender Email Address
                    <input
                      type="email"
                      value={smtpFromEmail}
                      onChange={(e) => setSmtpFromEmail(e.target.value)}
                      placeholder="notifications@company.com"
                      className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                    />
                  </label>

                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    Sender Display Name
                    <input
                      type="text"
                      value={smtpFromName}
                      onChange={(e) => setSmtpFromName(e.target.value)}
                      placeholder="HR Notifications"
                      className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                    />
                  </label>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="font-black text-slate-700 mb-3 text-[11px] uppercase tracking-wider">Email Notification Events</h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="p-3">Workflow Event / Trigger</th>
                        <th className="p-3 text-center">Email Employee</th>
                        <th className="p-3 text-center">Email Manager / HR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {[
                        { key: "offerLetter", name: "Offer Letters Sent / Finalized" },
                        { key: "appliedLeave", name: "Leave Applications, Approvals & Rejections" },
                        { key: "appreciations", name: "Appreciations & Awards Recognition" },
                        { key: "attendanceReg", name: "Attendance Regularization Requests" },
                        { key: "resignation", name: "Resignation Notice Submission & Clearances" },
                        { key: "warning", name: "Employee Warnings Issued" },
                        { key: "termination", name: "Employee Terminations Issued" },
                        { key: "complaint", name: "Staff Complaints Filed" }
                      ].map((item) => {
                        const toggleData = notificationToggles[item.key] || { employee: true, manager: true };
                        return (
                          <tr key={item.key} className="hover:bg-slate-50/50 transition">
                            <td className="p-3 text-xs font-bold text-slate-800">{item.name}</td>
                            <td className="p-3 text-center">
                              <input
                                type="checkbox"
                                checked={toggleData.employee}
                                onChange={() => handleToggleNotification(item.key, "employee")}
                                className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                              />
                            </td>
                            <td className="p-3 text-center">
                              <input
                                type="checkbox"
                                checked={toggleData.manager}
                                onChange={() => handleToggleNotification(item.key, "manager")}
                                className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="rounded bg-indigo-600 hover:bg-indigo-700 transition px-6 py-2.5 font-bold text-white shadow"
                >
                  Save Configuration
                </button>
              </div>
            </form>

            <div className="border-t border-slate-100 mt-6 pt-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-black text-slate-700 text-[11px] uppercase tracking-wider">Simulated Email Dispatch Log</h4>
                <button
                  type="button"
                  onClick={() => {
                    const logs = localStorage.getItem("hrms_email_notifications_log");
                    if (logs) setEmailLogs(JSON.parse(logs));
                  }}
                  className="text-[10px] font-bold text-indigo-600 hover:underline"
                >
                  Refresh Logs
                </button>
              </div>
              <div className="border border-slate-200 rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[9px] border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="p-2.5">Event</th>
                      <th className="p-2.5">Recipient</th>
                      <th className="p-2.5">Subject</th>
                      <th className="p-2.5 font-mono">Date Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-600 text-[11px]">
                    {emailLogs.length > 0 ? (
                      emailLogs.map((log: any) => (
                        <tr key={log.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-2.5 font-bold text-slate-800">{log.event}</td>
                          <td className="p-2.5">{log.recipient} <Badge className="ml-1 text-[8px] scale-90">{log.recipientType}</Badge></td>
                          <td className="p-2.5 text-slate-500 font-normal truncate max-w-xs" title={log.body}>{log.subject}</td>
                          <td className="p-2.5 font-mono text-[9px] text-slate-400">{new Date(log.sentAt).toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-slate-400 italic">No emails dispatched yet. Trigger an onboarding or approval event to see logs.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        )}

        {activeTab === "frontend_editor" && (
          <div className="grid gap-8 lg:grid-cols-12 items-start animate-in fade-in duration-200">
            {/* Left Column: Settings Panel */}
            <div className="lg:col-span-7 space-y-6">
              {/* Theme Settings Card */}
              <Card className="border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
                  <Globe className="size-4 text-indigo-500" /> Theme Color Palettes
                </h3>

                <div className="space-y-4">
                  {/* Preset Themes selection buttons */}
                  <div>
                    <label className="block font-bold text-slate-400 uppercase text-[10px] mb-2">Preset Themes</label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {[
                        { key: "indigo", name: "Indigo", color: "#4f46e5" },
                        { key: "emerald", name: "Emerald", color: "#059669" },
                        { key: "rose", name: "Rose", color: "#db2777" },
                        { key: "ocean", name: "Ocean", color: "#0284c7" },
                        { key: "dark", name: "Dark Slate", color: "#334155" },
                        { key: "sunset", name: "Sunset", color: "#ea580c" }
                      ].map(t => (
                        <button
                          key={t.key}
                          type="button"
                          onClick={() => applyPresetTheme(t.key)}
                          className={`flex flex-col items-center gap-1.5 p-2 rounded border text-[10px] font-bold transition hover:bg-slate-50 ${themePreset === t.key ? "border-indigo-600 bg-indigo-50/20 text-indigo-700" : "border-slate-250 text-slate-650"}`}
                        >
                          <span className="size-4 rounded-full border shadow-sm shrink-0" style={{ backgroundColor: t.color }}></span>
                          {t.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleSaveFrontendConfig} className="space-y-4 text-xs pt-2">
                    {/* Custom Color Pickers */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <label className="grid gap-1 font-bold text-slate-500 uppercase">
                        Primary Color
                        <div className="flex gap-1.5 items-center">
                          <input
                            type="color"
                            value={primaryColor}
                            onChange={e => { setPrimaryColor(e.target.value); setThemePreset("custom"); }}
                            className="size-10 rounded border border-slate-200 cursor-pointer p-0 bg-transparent shrink-0"
                          />
                          <span className="font-mono text-slate-400">{primaryColor}</span>
                        </div>
                      </label>

                      <label className="grid gap-1 font-bold text-slate-500 uppercase">
                        Secondary Color
                        <div className="flex gap-1.5 items-center">
                          <input
                            type="color"
                            value={secondaryColor}
                            onChange={e => { setSecondaryColor(e.target.value); setThemePreset("custom"); }}
                            className="size-10 rounded border border-slate-200 cursor-pointer p-0 bg-transparent shrink-0"
                          />
                          <span className="font-mono text-slate-400">{secondaryColor}</span>
                        </div>
                      </label>

                      <label className="grid gap-1 font-bold text-slate-500 uppercase">
                        Background
                        <div className="flex gap-1.5 items-center">
                          <input
                            type="color"
                            value={bgColor}
                            onChange={e => { setBgColor(e.target.value); setThemePreset("custom"); }}
                            className="size-10 rounded border border-slate-200 cursor-pointer p-0 bg-transparent shrink-0"
                          />
                          <span className="font-mono text-slate-400">{bgColor}</span>
                        </div>
                      </label>

                      <label className="grid gap-1 font-bold text-slate-500 uppercase">
                        Text Color
                        <div className="flex gap-1.5 items-center">
                          <input
                            type="color"
                            value={textColor}
                            onChange={e => { setTextColor(e.target.value); setThemePreset("custom"); }}
                            className="size-10 rounded border border-slate-200 cursor-pointer p-0 bg-transparent shrink-0"
                          />
                          <span className="font-mono text-slate-400">{textColor}</span>
                        </div>
                      </label>
                    </div>

                    {/* Font Settings */}
                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                      <label className="grid gap-1 font-bold text-slate-500 uppercase">
                        Frontend Font Family
                        <select
                          value={fontFamily}
                          onChange={e => setFontFamily(e.target.value)}
                          className="h-10 rounded border border-slate-200 px-3 bg-white outline-none focus:border-indigo-500 text-xs font-normal"
                        >
                          <option value="Inter">Inter (Modern Sans-Serif)</option>
                          <option value="Outfit">Outfit (Geometric & Sleek)</option>
                          <option value="Roboto">Roboto (Clean Sans)</option>
                          <option value="Playfair Display">Playfair Display (Premium Serif)</option>
                          <option value="Fira Code">Fira Code (Developer Mono)</option>
                        </select>
                      </label>

                      <label className="grid gap-1 font-bold text-slate-500 uppercase">
                        Base Font Scale
                        <select
                          value={fontSize}
                          onChange={e => setFontSize(e.target.value)}
                          className="h-10 rounded border border-slate-200 px-3 bg-white outline-none focus:border-indigo-500 text-xs font-normal"
                        >
                          <option value="small">Small (Dense Layout)</option>
                          <option value="medium">Medium (Standard)</option>
                          <option value="large">Large (Comfortable)</option>
                        </select>
                      </label>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                      <button
                        type="submit"
                        className="rounded bg-indigo-600 hover:bg-indigo-700 transition px-6 py-2.5 font-bold text-white shadow"
                      >
                        Save Theme & Typography Config
                      </button>
                    </div>
                  </form>
                </div>
              </Card>

              {/* ─── Header Design Card ─────────────────────────── */}
              <Card className="border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
                  <SettingsIcon className="size-4 text-indigo-500" /> Header Design
                </h3>
                <div className="space-y-4 text-xs">
                  {/* Logo + Logo Text visibility */}
                  <div className="grid grid-cols-1 gap-4">
                    <label className="grid gap-1 font-bold text-slate-500 uppercase">
                      Custom Header Logo URL
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={headerLogoUrl}
                          onChange={e => setHeaderLogoUrl(e.target.value)}
                          placeholder="https://your-cdn.com/logo.png or paste base64"
                          className="h-10 flex-1 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                        />
                        {headerLogoUrl && (
                          <img src={headerLogoUrl} alt="Preview" className="h-9 w-16 object-contain rounded border border-slate-200 bg-white shrink-0" onError={e => (e.currentTarget.style.display = "none")} />
                        )}
                        {headerLogoUrl && (
                          <button type="button" onClick={() => setHeaderLogoUrl("")} className="text-rose-500 hover:text-rose-700 font-bold text-[10px] shrink-0">Clear</button>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-normal">Leave blank to use the company logo from Company Settings. Supports PNG, SVG, JPG or base64 data URI.</p>
                    </label>
                  </div>

                  {/* Logo text / company name visible toggle */}
                  <div className="flex items-center justify-between p-3 rounded border border-slate-100 bg-slate-50/50">
                    <div>
                      <p className="font-bold text-slate-700 uppercase text-[10px] tracking-wider">Show Company Name Text</p>
                      <p className="text-[10px] text-slate-400 font-normal mt-0.5">Display the company name next to the logo in the header.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setHeaderLogoTextVisible(v => !v)}
                      className={`h-8 min-w-[70px] rounded-full border px-3 font-bold text-[10px] transition flex items-center gap-1.5 ${headerLogoTextVisible ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-slate-100 border-slate-200 text-slate-500"}`}
                    >
                      <span className={`size-2 rounded-full shrink-0 ${headerLogoTextVisible ? "bg-emerald-500" : "bg-slate-400"}`} />
                      {headerLogoTextVisible ? "Visible" : "Hidden"}
                    </button>
                  </div>

                  {/* Header colors */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                    <ColorPickerField label="Header Background" value={headerBg} onChange={v => setHeaderBg(v)} />
                    <ColorPickerField label="Header Text / Logo Color" value={headerTextColor} onChange={v => setHeaderTextColor(v)} />
                    <ColorPickerField label="Nav Link Color" value={headerNavColor || primaryColor} onChange={v => setHeaderNavColor(v)} />
                  </div>

                  {/* Live mini-preview of header */}
                  <div className="rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider px-3 py-1 bg-slate-50 border-b border-slate-100">Header Preview</div>
                    <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: headerBg }}>
                      <div className="flex items-center gap-2">
                        {headerLogoUrl
                          ? <img src={headerLogoUrl} alt="Logo" className="h-7 object-contain" onError={e => (e.currentTarget.style.display="none")} />
                          : <div className="size-7 rounded flex items-center justify-center text-white text-[10px] font-black" style={{ backgroundColor: primaryColor }}>B</div>
                        }
                        {headerLogoTextVisible && (
                          <span className="font-black text-sm" style={{ color: headerTextColor }}>Bharat HRMS</span>
                        )}
                      </div>
                      <div className="flex gap-4 text-[10px] font-bold">
                        {["Home","Features","Pricing","Contact"].map(n => (
                          <span key={n} style={{ color: headerNavColor || primaryColor }}>{n}</span>
                        ))}
                      </div>
                      <div className="rounded px-3 py-1 text-[10px] font-black text-white" style={{ backgroundColor: primaryColor }}>Login</div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => persistFrontendConfig(sections)}
                      className="rounded bg-indigo-600 hover:bg-indigo-700 transition px-5 py-2 font-bold text-white shadow text-xs"
                    >
                      Save Header Config
                    </button>
                  </div>
                </div>
              </Card>

              {/* ─── Footer Design Card ─────────────────────────── */}
              <Card className="border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
                  <SettingsIcon className="size-4 text-indigo-500" /> Footer Design
                </h3>
                <div className="space-y-4 text-xs">
                  {/* Custom copyright text */}
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    Custom Copyright / Footer Text
                    <input
                      type="text"
                      value={footerText}
                      onChange={e => setFooterText(e.target.value)}
                      placeholder="e.g. © 2025 Bharat HRMS. All Rights Reserved."
                      className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                    />
                    <span className="text-[10px] text-slate-400 font-normal">Leave blank to auto-generate from company name.</span>
                  </label>

                  {/* Footer colors */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                    <ColorPickerField label="Footer Background" value={footerBg} onChange={v => setFooterBg(v)} />
                    <ColorPickerField label="Footer Text Color" value={footerTextColor} onChange={v => setFooterTextColor(v)} />
                    <ColorPickerField label="Footer Link Color" value={footerLinkColor || primaryColor} onChange={v => setFooterLinkColor(v)} />
                  </div>

                  {/* Live mini-preview */}
                  <div className="rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider px-3 py-1 bg-slate-50 border-b border-slate-100">Footer Preview</div>
                    <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3" style={{ backgroundColor: footerBg }}>
                      <span className="text-[11px] font-semibold" style={{ color: footerTextColor }}>
                        {footerText || "© Bharat HRMS Payroll SaaS. All Rights Reserved."}
                      </span>
                      <div className="flex gap-4 text-[11px] font-bold">
                        {["Register","Login","SaaS Admin"].map(n => (
                          <span key={n} style={{ color: footerLinkColor || primaryColor }}>{n}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => persistFrontendConfig(sections)}
                      className="rounded bg-indigo-600 hover:bg-indigo-700 transition px-5 py-2 font-bold text-white shadow text-xs"
                    >
                      Save Footer Config
                    </button>
                  </div>
                </div>
              </Card>

              {/* Sections Editor Card */}
              <Card className="border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap justify-between items-center border-b border-slate-100 pb-3 mb-5 gap-2">
                  <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                    <GripVertical className="size-4 text-indigo-500 shrink-0" /> Frontend Page Sections
                    <span className="ml-1 text-[10px] font-normal text-slate-400 normal-case">({sections.length} sections • {sections.filter(s => s.visible !== false).length} visible)</span>
                  </h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleResetToDefaults}
                      className="inline-flex items-center gap-1 rounded bg-amber-50 hover:bg-amber-100 transition px-2.5 py-1.5 text-[10px] font-bold text-amber-700 border border-amber-200"
                    >
                      ↺ Reset Defaults
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenAddSection}
                      className="inline-flex items-center gap-1 rounded bg-indigo-50 hover:bg-indigo-100 transition px-2.5 py-1.5 text-[10px] font-bold text-indigo-700 border border-indigo-100"
                    >
                      <Plus className="size-3" /> Add Section
                    </button>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 mb-4 leading-normal">
                  All sections below are rendered on your public-facing landing page. Click <strong>Edit</strong> to modify any section's content. Reorder with the arrow buttons. Toggle the eye icon to show/hide a section without deleting it.
                </p>

                <div className="space-y-2">
                  {sections.map((sec, idx) => {
                    const isDefault = DEFAULT_LANDING_SECTIONS.some(d => d.id === sec.id);
                    const isHidden = sec.visible === false;
                    return (
                      <div key={sec.id} className={`flex items-start justify-between p-3 rounded-lg border text-xs transition ${isHidden ? "border-slate-100 bg-slate-50 opacity-60" : "border-indigo-100/60 bg-indigo-50/20 hover:border-indigo-200"}`}>
                        <div className="min-w-0 pr-2 flex gap-2 items-start">
                          <div className="mt-0.5 text-slate-400 cursor-grab shrink-0 pt-0.5">⠿</div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`font-extrabold text-[11px] tracking-wide ${isHidden ? "text-slate-400 line-through" : "text-slate-800"}`}>{sec.title}</span>
                              <Badge className="text-[8px] uppercase tracking-wider bg-indigo-50 text-indigo-700 shrink-0 scale-90">{sec.type}</Badge>
                              {isDefault && <Badge className="text-[8px] uppercase bg-slate-100 text-slate-500 shrink-0 scale-90">default</Badge>}
                              {isHidden && <Badge className="text-[8px] uppercase bg-rose-50 text-rose-600 shrink-0 scale-90">hidden</Badge>}
                            </div>
                            {sec.subtitle && <p className="text-[9px] text-indigo-500 font-bold uppercase tracking-widest mt-0.5">{sec.subtitle}</p>}
                            {(sec.content || sec.items) && (
                              <p className="text-[10px] text-slate-500 font-normal mt-0.5 truncate max-w-xs leading-normal">
                                {sec.content || (sec.items || "").split("\n")[0]}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                          {/* Move Up */}
                          <button type="button" disabled={idx === 0} onClick={() => handleMoveSection(idx, "up")}
                            className="p-1 rounded bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 disabled:opacity-30 disabled:pointer-events-none" title="Move Up">↑</button>
                          {/* Move Down */}
                          <button type="button" disabled={idx === sections.length - 1} onClick={() => handleMoveSection(idx, "down")}
                            className="p-1 rounded bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 disabled:opacity-30 disabled:pointer-events-none" title="Move Down">↓</button>
                          {/* Toggle Visibility */}
                          <button type="button" onClick={() => handleToggleSectionVisibility(sec.id)}
                            className={`p-1 rounded border text-[10px] font-bold transition ${isHidden ? "bg-slate-100 border-slate-200 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700" : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-rose-50 hover:text-rose-700"}`}
                            title={isHidden ? "Show Section" : "Hide Section"}>
                            {isHidden ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                          </button>
                          {/* Edit */}
                          <button type="button" onClick={() => handleOpenEditSection(sec)}
                            className="p-1 px-2 rounded bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 font-bold text-indigo-700 text-[10px] transition">
                            Edit
                          </button>
                          {/* Delete */}
                          <button type="button" onClick={() => handleDeleteSection(sec.id)}
                            className="p-1 px-2 rounded bg-rose-50 hover:bg-rose-100 border border-rose-100 font-bold text-rose-700 text-[10px] transition">
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {sections.length === 0 && (
                    <div className="p-8 text-center text-xs text-slate-400">
                      <p className="font-bold">No sections found.</p>
                      <button type="button" onClick={handleResetToDefaults} className="mt-2 text-indigo-600 underline">Load default sections</button>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right Column: Live Preview Panel */}
            <div className="lg:col-span-5 sticky top-6">
              <div className="border border-slate-200 rounded-lg overflow-hidden shadow-md bg-white">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 text-slate-500 font-bold flex items-center justify-between text-[10px] uppercase">
                  <span>Real-Time Frontend Live Preview (Portal)</span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-500 animate-ping"></span>
                    Theme: {themePreset.toUpperCase()}
                  </span>
                </div>
                <div
                  style={{
                    backgroundColor: bgColor,
                    color: textColor,
                    fontFamily: fontFamily === "Fira Code" ? "monospace" : fontFamily,
                    fontSize: fontSize === "small" ? "12px" : fontSize === "large" ? "16px" : "14px"
                  }}
                  className="p-6 min-h-[420px] max-h-[600px] overflow-y-auto space-y-6 transition-all duration-300 scrollbar-thin"
                >
                  {/* Simulated Header */}
                  <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: primaryColor + "30" }}>
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-md flex items-center justify-center font-black text-white shrink-0 shadow" style={{ backgroundColor: primaryColor }}>
                        B
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm uppercase" style={{ color: primaryColor }}>{compName || "Bharat HRMS"}</h4>
                        <p className="text-[9px] text-slate-450 font-mono tracking-wider">{compDomain || "hr.company.in"}</p>
                      </div>
                    </div>
                    <nav className="flex items-center gap-3 text-xs font-bold" style={{ color: secondaryColor }}>
                      <span className="hover:opacity-85 cursor-pointer">Portal</span>
                      <span className="hover:opacity-85 cursor-pointer">Directory</span>
                      <button className="rounded px-2.5 py-1 text-[10px] text-white font-bold transition shadow-sm hover:scale-105 shrink-0" style={{ backgroundColor: primaryColor }}>Login</button>
                    </nav>
                  </div>

                  {/* Dynamic Sections */}
                  <div className="space-y-4">
                    {sections.map((sec) => (
                      <div key={sec.id} className="p-4 rounded border transition-all" style={{ borderColor: primaryColor + "20", backgroundColor: textColor === "#f8fafc" ? "#334155" : "white" }}>
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-extrabold text-xs" style={{ color: primaryColor }}>{sec.title}</h5>
                          <Badge className="text-[8px] uppercase">{sec.type}</Badge>
                        </div>
                        <p className="text-xs font-normal leading-relaxed text-slate-500">{sec.content}</p>
                      </div>
                    ))}
                    
                    {sections.length === 0 && (
                      <div className="p-8 text-center text-xs text-slate-400 italic">
                        No layout sections defined. Use the section editor above to add homepage components!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Add/Edit Location */}
        {locationModal && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-slate-200 bg-white p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
              <button onClick={() => setLocationModal(false)} className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
                <X className="size-5" />
              </button>
              <h3 className="text-base font-black text-slate-900 mb-2">{editLocationId !== null ? "Edit Office Branch" : "Add Office Branch"}</h3>
              <p className="text-xs text-slate-400 mb-4">Configure the office location details. Employees can log attendance inside this branch geofence.</p>
              {error && <div className="mb-4 rounded-md bg-rose-50 p-3 text-xs font-bold text-rose-800 border border-rose-100">{error}</div>}
              {success && <div className="mb-4 rounded-md bg-emerald-50 p-3 text-xs font-bold text-emerald-800 border border-emerald-100 animate-pulse">{success}</div>}
              <form onSubmit={handleSaveLocation} className="space-y-4 text-xs">
                <label className="grid gap-1 font-bold text-slate-500 uppercase">
                  Office Region *
                  <select
                    value={locRegion}
                    onChange={(e) => setLocRegion(e.target.value)}
                    className="h-10 rounded border border-slate-200 px-3 bg-white outline-none focus:border-indigo-500 text-xs font-normal"
                    required
                  >
                    <option value="South India">South India</option>
                    <option value="North India">North India</option>
                    <option value="West India">West India</option>
                    <option value="East India">East India</option>
                  </select>
                </label>

                <label className="grid gap-1 font-bold text-slate-500 uppercase">
                  Office Type *
                  <select
                    value={locOfficeType}
                    onChange={(e) => setLocOfficeType(e.target.value)}
                    className="h-10 rounded border border-slate-200 px-3 bg-white outline-none focus:border-indigo-500 text-xs font-normal"
                    required
                  >
                    <option value="Registered Office">Registered Office</option>
                    <option value="Corporate Office">Corporate Office</option>
                    <option value="Branch Office">Branch Office</option>
                    <option value="Support">Support</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                  </select>
                </label>

                <label className="grid gap-1 font-bold text-slate-500 uppercase">
                  Office City *
                  <input
                    type="text"
                    value={locCity}
                    onChange={(e) => setLocCity(e.target.value)}
                    placeholder="e.g. Hyderabad, Delhi, Mumbai"
                    className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                    required
                  />
                </label>

                <label className="grid gap-1 font-bold text-slate-500 uppercase">
                  Office Physical Address *
                  <textarea
                    value={locAddress}
                    onChange={(e) => setLocAddress(e.target.value)}
                    placeholder="Full physical address for postal verification..."
                    className="h-20 rounded border border-slate-200 p-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30 resize-none"
                    required
                  />
                </label>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setLocationModal(false)}
                    className="rounded border border-slate-200 bg-white px-4 py-2.5 font-bold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-indigo-600 hover:bg-indigo-700 transition px-5 py-2.5 font-bold text-white shadow"
                  >
                    Save Office Location
                  </button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* MODAL: Add/Edit Currency */}
        {currencyModal && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-slate-200 bg-white p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
              <button onClick={() => setCurrencyModal(false)} className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
                <X className="size-5" />
              </button>
              <h3 className="text-base font-black text-slate-900 mb-2">{editCurrencyId !== null ? "Edit Active Currency" : "Add Active Currency"}</h3>
              <p className="text-xs text-slate-400 mb-4">Configure the currency settings for company accounts ledger entries.</p>
              {error && <div className="mb-4 rounded-md bg-rose-50 p-3 text-xs font-bold text-rose-800 border border-rose-100">{error}</div>}
              {success && <div className="mb-4 rounded-md bg-emerald-50 p-3 text-xs font-bold text-emerald-800 border border-emerald-100 animate-pulse">{success}</div>}
              <form onSubmit={handleSaveCurrency} className="space-y-4 text-xs">
                <label className="grid gap-1 font-bold text-slate-500 uppercase">Currency Full Name<input type="text" value={currName} onChange={e => setCurrName(e.target.value)} placeholder="e.g. Euro" className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30" required /></label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">ISO Currency Code<input type="text" value={currCode} onChange={e => setCurrCode(e.target.value)} placeholder="EUR" className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30" required /></label>
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">Currency Symbol Sign<input type="text" value={currSymbol} onChange={e => setCurrSymbol(e.target.value)} placeholder="€" className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30" required /></label>
                </div>
                <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setCurrencyModal(false)} className="rounded border border-slate-200 bg-white px-4 py-2.5 font-bold text-slate-600 hover:bg-slate-50 transition">Cancel</button><button type="submit" className="rounded bg-indigo-600 hover:bg-indigo-700 transition px-5 py-2.5 font-bold text-white shadow">Save Currency</button></div>
              </form>
            </Card>
          </div>
        )}

        {/* MODAL: Add/Edit Layout Section */}
        {sectionModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-4 pt-12">
            <Card className="w-full max-w-lg border-slate-200 bg-white p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
              <button onClick={() => setSectionModalOpen(false)} className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
                <X className="size-5" />
              </button>
              <h3 className="text-base font-black text-slate-900 mb-1">
                {editingSectionId !== null ? "Edit Frontend Section" : "Add New Section"}
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                {editingSectionId !== null
                  ? "Edit this section's content. Changes will appear on the public landing page after saving."
                  : "Add a new custom section to your public landing page."}
              </p>
              
              <form onSubmit={handleSaveSection} className="space-y-4 text-xs">
                {/* Row: Type + Visible */}
                <div className="grid grid-cols-2 gap-3">
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    Section Type *
                    <select
                      value={newSecType}
                      onChange={(e) => setNewSecType(e.target.value)}
                      className="h-10 rounded border border-slate-200 px-3 bg-white outline-none focus:border-indigo-500 text-xs font-normal"
                      required
                    >
                      <option value="hero">Hero Banner</option>
                      <option value="grid">Feature Grid (columns)</option>
                      <option value="cards">Cards / Checklist</option>
                      <option value="highlights">Highlights (dark)</option>
                      <option value="marquee">Industry Strip / Tag Cloud</option>
                      <option value="pricing">Pricing Table</option>
                      <option value="contact">Contact / CTA</option>
                      <option value="text">Plain Text Block</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 font-bold text-slate-500 uppercase">
                    Visibility
                    <button
                      type="button"
                      onClick={() => setNewSecVisible(v => !v)}
                      className={`h-10 rounded border px-3 font-bold text-xs flex items-center gap-2 transition ${newSecVisible ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-slate-100 border-slate-200 text-slate-500"}`}
                    >
                      {newSecVisible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                      {newSecVisible ? "Visible" : "Hidden"}
                    </button>
                  </label>
                </div>

                {/* Subtitle / Eyebrow */}
                <div className="grid grid-cols-2 gap-3">
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    Eyebrow / Label
                    <input type="text" value={newSecSubtitle} onChange={e => setNewSecSubtitle(e.target.value)}
                      placeholder="e.g. India compliance built in"
                      className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30" />
                  </label>
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    Badge Text
                    <input type="text" value={newSecBadge} onChange={e => setNewSecBadge(e.target.value)}
                      placeholder="e.g. Multi-tenant SaaS"
                      className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30" />
                  </label>
                </div>

                {/* Title */}
                <label className="grid gap-1 font-bold text-slate-500 uppercase">
                  Section Title *
                  <input type="text" value={newSecTitle} onChange={(e) => setNewSecTitle(e.target.value)}
                    placeholder="e.g. Everything HR Needs in One Platform"
                    className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                    required />
                </label>

                {/* Body content */}
                <label className="grid gap-1 font-bold text-slate-500 uppercase">
                  Body / Description Text
                  <textarea value={newSecContent} onChange={(e) => setNewSecContent(e.target.value)}
                    placeholder="Write a paragraph of descriptive text for this section..."
                    className="h-20 rounded border border-slate-200 p-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30 resize-none" />
                </label>

                {/* Items list */}
                <label className="grid gap-1 font-bold text-slate-500 uppercase">
                  Items / List (one per line)
                  <div className="text-[9px] text-slate-400 font-normal -mt-0.5 mb-1 leading-relaxed normal-case">
                    For <strong>grid/features</strong>: <code>Title: Description</code><br/>
                    For <strong>cards/checklist</strong>: just item names, one per line<br/>
                    For <strong>highlights</strong>: <code>Title: Description</code><br/>
                    For <strong>pricing</strong>: <code>Plan: Price: Description</code>
                  </div>
                  <textarea value={newSecItems} onChange={(e) => setNewSecItems(e.target.value)}
                    placeholder={newSecType === "grid" ? "Feature Title: Feature description\nAnother Feature: Its description" :
                      newSecType === "pricing" ? "Starter: 49: Up to 50 employees\nGrowth: 89: Up to 500 employees" :
                      "Item 1\nItem 2\nItem 3"}
                    className="h-28 rounded border border-slate-200 p-3 font-normal font-mono text-[10px] outline-none focus:border-indigo-500 bg-slate-50/30 resize-none" />
                </label>

                {/* CTA Labels */}
                <div className="grid grid-cols-2 gap-3">
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    Primary CTA Label
                    <input type="text" value={newSecCta1} onChange={e => setNewSecCta1(e.target.value)}
                      placeholder="e.g. Start Free Registration"
                      className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30" />
                  </label>
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    Secondary CTA Label
                    <input type="text" value={newSecCta2} onChange={e => setNewSecCta2(e.target.value)}
                      placeholder="e.g. View SaaS Console"
                      className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30" />
                  </label>
                </div>

                {/* Section & Card Background Colors */}
                <div className="border-t border-slate-100 pt-4">
                  <p className="font-bold text-slate-500 uppercase text-[10px] mb-3 tracking-wider">Background Colors (override global defaults)</p>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="grid gap-1 font-bold text-slate-500 uppercase">
                      Section Background
                      <div className="flex gap-1.5 items-center">
                        <input type="color" value={newSecSectionBg || "#f8fafc"}
                          onChange={e => setNewSecSectionBg(e.target.value)}
                          className="size-10 rounded border border-slate-200 cursor-pointer p-0 bg-transparent shrink-0" />
                        <span className="font-mono text-slate-400">{newSecSectionBg || "(default)"}</span>
                        {newSecSectionBg && (
                          <button type="button" onClick={() => setNewSecSectionBg("")} className="text-[9px] text-rose-400 hover:text-rose-600 font-bold underline shrink-0">clear</button>
                        )}
                      </div>
                    </label>
                    <label className="grid gap-1 font-bold text-slate-500 uppercase">
                      Card / Item Background
                      <div className="flex gap-1.5 items-center">
                        <input type="color" value={newSecCardBg || "#ffffff"}
                          onChange={e => setNewSecCardBg(e.target.value)}
                          className="size-10 rounded border border-slate-200 cursor-pointer p-0 bg-transparent shrink-0" />
                        <span className="font-mono text-slate-400">{newSecCardBg || "(default)"}</span>
                        {newSecCardBg && (
                          <button type="button" onClick={() => setNewSecCardBg("")} className="text-[9px] text-rose-400 hover:text-rose-600 font-bold underline shrink-0">clear</button>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button type="button" onClick={() => setSectionModalOpen(false)}
                    className="rounded border border-slate-200 bg-white px-4 py-2.5 font-bold text-slate-600 hover:bg-slate-50 transition">
                    Cancel
                  </button>
                  <button type="submit"
                    className="rounded bg-indigo-600 hover:bg-indigo-700 transition px-5 py-2.5 font-bold text-white shadow">
                    {editingSectionId ? "Save Changes" : "Add Section"}
                  </button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </section>
    </main>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[280px_1fr]">
        <SaasSidebar active="Settings" />
        <section className="p-6 lg:p-8 flex items-center justify-center text-xs text-slate-500 font-bold">
          Loading configurations...
        </section>
      </main>
    }>
      <SettingsPageContent />
    </Suspense>
  );
}
