"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge, Card } from "@/components/ui";
import {
  ArrowRight,
  Banknote,
  Bot,
  CalendarCheck,
  CheckCircle2,
  Globe2,
  Layers3,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  UsersRound,
  LayoutGrid
} from "lucide-react";

// ─── Default Sections (identical to settings DEFAULT_LANDING_SECTIONS) ──────
const DEFAULT_SECTIONS = [
  { id: "sec-hero", type: "hero", visible: true, title: "Complete HRMS and Payroll Software for Indian Businesses", subtitle: "Hire to retire, payroll to compliance", badge: "Multi-tenant SaaS", content: "Run employee records, attendance, leave, recruitment, onboarding, payroll, statutory compliance, documents, expenses, assets, workflows, and employee self-service from one SaaS platform.", cta1Label: "Start Free Registration", cta2Label: "View SaaS Console", items: "", sectionBg: "", cardBg: "" },
  { id: "sec-industries", type: "marquee", visible: true, title: "Trusted Across Industries", subtitle: "", badge: "", content: "", cta1Label: "", cta2Label: "", items: "SMEs\nHospitals\nManufacturing\nIT and Consulting\nStaffing Agencies\nNBFCs\nRetail Chains\nReal Estate", sectionBg: "", cardBg: "" },
  { id: "sec-features", type: "grid", visible: true, title: "Everything HR, Payroll, Compliance, and Employee Experience Needs", subtitle: "Functionality, section by section", badge: "", content: "Designed for Indian organizations that need a practical daily HR tool and a scalable SaaS operating model.", cta1Label: "", cta2Label: "", items: "Core HR and Employee Lifecycle: Employee master, KYC, documents, onboarding, probation, transfers, exits, letters, assets, and ESS.\nAttendance, Shifts and Leave: Biometric, mobile, geo-fenced, QR attendance, overtime, late marks, flexible shifts, leave balance, and approvals.\nIndian Payroll and Compliance: Salary structures, EPF, EPS, ESIC, PT, LWF, TDS, Form 16, Form 24Q, payslips, bank files, and audit trails.\nRecruitment and AI Assistant: Requisitions, careers portal, ATS, resume ranking, interview questions, offer letters, and HR policy drafts.\nPerformance, LMS and Expenses: KRA, KPI, OKR, appraisals, courses, certifications, travel requests, expense claims, and reimbursements.\nSaaS, Security and White Label: Multi-tenant isolation, custom domains, branding, SMTP, WhatsApp, IP restrictions, MFA, and activity logs.", sectionBg: "", cardBg: "" },
  { id: "sec-compliance", type: "cards", visible: true, title: "Payroll that Understands Indian Statutory Workflows", subtitle: "India compliance built in", badge: "", content: "Configure payroll components, state-wise rules, tax regimes, reimbursements, arrears, overtime, payroll locks, audit trails, and statutory report exports.", cta1Label: "", cta2Label: "", items: "EPF and EPS\nESIC\nProfessional Tax\nLabour Welfare Fund\nTDS\nForm 16 and 24Q\nGratuity\nBonus Act", sectionBg: "", cardBg: "" },
  { id: "sec-saas", type: "highlights", visible: true, title: "Built to Sell, Operate, and Scale as a Subscription Product", subtitle: "SaaS platform", badge: "", content: "", cta1Label: "", cta2Label: "", items: "Tenant isolation: Every customer has isolated company data, branding, roles, and configuration.\nSubscription billing: Plans, employee-based pricing, invoices, GST, trials, and usage metering.\nWhite label partners: Custom domain, logo, colors, SMTP, WhatsApp, and reseller-ready controls.", sectionBg: "", cardBg: "" },
  { id: "sec-pricing", type: "pricing", visible: true, title: "Simple Per-Employee Pricing for Every Stage", subtitle: "Pricing", badge: "", content: "", cta1Label: "Choose Plan", cta2Label: "", items: "Starter: 49: Up to 50 employees. Core HR and payroll.\nGrowth: 89: Up to 500 employees. Full compliance suite.\nEnterprise: 149: Unlimited employees. AI and white-label.\nPartner: 0: Reseller program. Custom pricing.", sectionBg: "", cardBg: "" },
  { id: "sec-contact", type: "contact", visible: true, title: "Ready to Launch Your HRMS SaaS?", subtitle: "Contact", badge: "", content: "Request a demo for HR, payroll, compliance, employee self-service, and white-label partner workflows.", cta1Label: "Register and Continue", cta2Label: "", items: "+91 98765 43210\nsales@bharathrms.example\nMumbai, Maharashtra, India\nCustom domain and SaaS deployment ready", sectionBg: "", cardBg: "" }
];

const SECTION_ICONS: Record<string, React.ReactNode> = {
  "Core HR": <UsersRound className="size-5" />,
  "Attendance": <CalendarCheck className="size-5" />,
  "Payroll": <Banknote className="size-5" />,
  "Recruitment": <Bot className="size-5" />,
  "Performance": <Layers3 className="size-5" />,
  "SaaS": <ShieldCheck className="size-5" />
};
function getIcon(title: string) {
  for (const [key, icon] of Object.entries(SECTION_ICONS)) {
    if (title.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return <LayoutGrid className="size-5" />;
}

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [sections, setSections] = useState<any[]>(DEFAULT_SECTIONS);
  // Global colors
  const [primaryColor, setPrimaryColor] = useState("#4f46e5");
  const [secondaryColor, setSecondaryColor] = useState("#0ea5e9");
  const [bgColor, setBgColor] = useState("#f8fafc");
  const [textColor, setTextColor] = useState("#0f172a");
  const [fontFamily, setFontFamily] = useState("Outfit");
  const [fontSize, setFontSize] = useState("medium");
  // Header
  const [headerBg, setHeaderBg] = useState("#ffffff");
  const [headerTextColor, setHeaderTextColor] = useState("#0f172a");
  const [headerNavColor, setHeaderNavColor] = useState("");
  const [headerLogoTextVisible, setHeaderLogoTextVisible] = useState(true);
  const [headerLogoUrl, setHeaderLogoUrl] = useState("");
  // Footer
  const [footerBg, setFooterBg] = useState("#ffffff");
  const [footerTextColor, setFooterTextColor] = useState("#64748b");
  const [footerLinkColor, setFooterLinkColor] = useState("");
  const [footerText, setFooterText] = useState("");
  // Company
  const [companyName, setCompanyName] = useState("");
  const [companyDomain, setCompanyDomain] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");

  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem("hrms_frontend_config");
    if (stored) {
      try {
        const config = JSON.parse(stored);
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
        // Sections
        if (config.sections && config.sections.length > 0) {
          const merged = DEFAULT_SECTIONS.map(def => {
            const saved = config.sections.find((s: any) => s.id === def.id);
            return saved ? { ...def, ...saved } : def;
          });
          const customSections = config.sections.filter((s: any) => !DEFAULT_SECTIONS.find(d => d.id === s.id));
          setSections([...merged, ...customSections]);
        }
      } catch (e) {}
    }
    const companyStr = localStorage.getItem("session_company");
    if (companyStr) {
      try {
        const co = JSON.parse(companyStr);
        setCompanyName(co.name || "");
        setCompanyDomain(co.domain || "");
        setCompanyLogo(co.logo || "");
      } catch (e) {}
    }
  }, []);

  if (!isClient) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500 font-bold text-xs">
        Loading workspace portal...
      </main>
    );
  }

  const rootFontSizeClass = fontSize === "small" ? "text-xs" : fontSize === "large" ? "text-base" : "text-sm";
  const visibleSections = sections.filter(s => s.visible !== false);
  // Effective logo: headerLogoUrl > companyLogo
  const effectiveLogo = headerLogoUrl || companyLogo;

  return (
    <main
      className={`min-h-screen ${rootFontSizeClass} transition-colors duration-300`}
      style={{ backgroundColor: bgColor, color: textColor, fontFamily: fontFamily === "Fira Code" ? "monospace" : fontFamily }}
    >
      {/* ═══ HEADER ══════════════════════════════════════════════════ */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur shadow-sm"
        style={{ backgroundColor: headerBg + "f0", borderColor: headerBg === "#ffffff" ? (primaryColor + "18") : (headerBg + "60") }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-3">
            {effectiveLogo ? (
              <div className="size-10 rounded border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center shrink-0">
                <img src={effectiveLogo} alt="Logo" className="size-full object-contain" />
              </div>
            ) : (
              <div className="grid size-10 place-items-center rounded-md font-black text-white text-lg shadow shrink-0" style={{ backgroundColor: primaryColor }}>
                {(companyName || "B")[0].toUpperCase()}
              </div>
            )}
            {headerLogoTextVisible && (
              <div>
                <h1 className="text-lg font-black tracking-tight" style={{ color: headerTextColor }}>
                  {companyName || "Bharat HRMS"}
                </h1>
                <p className="text-[10px] font-mono tracking-wider" style={{ color: headerTextColor + "80" }}>
                  {companyDomain || "Cloud HRMS for India"}
                </p>
              </div>
            )}
          </Link>

          <nav className="hidden items-center gap-6 font-bold text-xs uppercase tracking-wider lg:flex">
            {visibleSections
              .filter(s => ["hero", "grid", "pricing", "contact"].includes(s.type))
              .slice(0, 4)
              .map(sec => (
                <a key={sec.id} href={`#${sec.id}`}
                  className="hover:opacity-75 transition"
                  style={{ color: headerNavColor || primaryColor }}>
                  {sec.subtitle || sec.title.split(" ").slice(0, 2).join(" ")}
                </a>
              ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/login"
              className="rounded px-4 py-2 text-xs font-black text-white shadow hover:opacity-90 transition"
              style={{ backgroundColor: primaryColor }}>
              Login
            </Link>
            <Link href="/register"
              className="hidden rounded border px-4 py-2 text-xs font-bold hover:opacity-80 transition sm:block"
              style={{ borderColor: primaryColor + "50", color: primaryColor }}>
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* ═══ SECTIONS ════════════════════════════════════════════════ */}
      {visibleSections.map(sec => {
        const sharedProps = { sec, pc: primaryColor, sc: secondaryColor, globalBg: bgColor };
        if (sec.type === "hero") return <HeroSection key={sec.id} {...sharedProps} />;
        if (sec.type === "marquee") return <MarqueeSection key={sec.id} {...sharedProps} />;
        if (sec.type === "grid") return <GridSection key={sec.id} {...sharedProps} />;
        if (sec.type === "cards") return <CardsSection key={sec.id} {...sharedProps} />;
        if (sec.type === "highlights") return <HighlightsSection key={sec.id} {...sharedProps} />;
        if (sec.type === "pricing") return <PricingSection key={sec.id} {...sharedProps} />;
        if (sec.type === "contact") return <ContactSection key={sec.id} {...sharedProps} />;
        return (
          <section key={sec.id} id={sec.id} className="mx-auto max-w-7xl px-5 py-14"
            style={sec.sectionBg ? { backgroundColor: sec.sectionBg } : {}}>
            {sec.subtitle && <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: primaryColor }}>{sec.subtitle}</p>}
            <h2 className="text-3xl font-black mb-4">{sec.title}</h2>
            <p className="leading-relaxed opacity-80 max-w-3xl whitespace-pre-line">{sec.content}</p>
          </section>
        );
      })}

      {/* ═══ FOOTER ══════════════════════════════════════════════════ */}
      <footer className="border-t mt-16" style={{ backgroundColor: footerBg, borderColor: primaryColor + "18" }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-xs font-bold">
          <span style={{ color: footerTextColor }}>
            {footerText || `© ${companyName || "Bharat HRMS Payroll SaaS"}. All Rights Reserved.`}
          </span>
          <div className="flex gap-4">
            {(
               [
                 ["Register", "/register"],
                 ["Login", "/login"],
                 ["SaaS Admin", "/super-admin"],
               ] as const
             ).map(([label, href]) => (
            <Link
            key={label}
            href={href}
            className="hover:underline transition"
            style={{ color: footerLinkColor || primaryColor }}
            >
           {label}
           </Link>
          ))}
</div>
        </div>
      </footer>
    </main>
  );
}

// ─── Section Components ───────────────────────────────────────────────────────

type SectionProps = { sec: any; pc: string; sc: string; globalBg: string };

function HeroSection({ sec, pc, sc }: SectionProps) {
  const bg = sec.sectionBg || "#0f172a";
  return (
    <section id={sec.id} className="relative overflow-hidden" style={{ backgroundColor: bg, minHeight: "88vh", display: "flex", alignItems: "center" }}>
      <div className="absolute inset-x-0 top-0 h-64 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${pc}25 0%, transparent 70%)` }} />
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 w-full lg:grid-cols-[1fr_0.95fr]">
        <div className="relative z-10 text-white">
          {sec.badge && (
            <div className="mb-6">
              <span className="rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-widest" style={{ backgroundColor: pc + "25", color: sc }}>
                {sec.badge}
              </span>
            </div>
          )}
          {sec.subtitle && <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: sc }}>{sec.subtitle}</p>}
          <h2 className="text-4xl md:text-5xl font-black leading-tight max-w-3xl">{sec.title}</h2>
          {sec.content && <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">{sec.content}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            {sec.cta1Label && (
              <Link href="/register" className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-black text-white shadow-sm hover:opacity-90 transition" style={{ backgroundColor: pc }}>
                {sec.cta1Label} <ArrowRight className="size-4" />
              </Link>
            )}
            {sec.cta2Label && (
              <Link href="/super-admin" className="rounded-md border border-white/20 px-5 py-3 text-sm font-bold text-white hover:bg-white/10 transition">{sec.cta2Label}</Link>
            )}
            <Link href="/login" className="rounded-md bg-white px-5 py-3 text-sm font-bold text-slate-950 hover:opacity-90 transition shadow-sm">Login</Link>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
            {[["126+", "Companies"], ["84k+", "Employees"], ["India", "Payroll Ready"]].map(([value, label]) => (
              <div key={label} className="rounded-md border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-bold">{value}</p>
                <p className="mt-1 text-xs text-slate-300">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 rounded-xl border border-white/10 bg-white p-4 shadow-2xl self-center">
          <div className="rounded-lg bg-slate-100 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color: pc }}>Live HR Command Center</p>
                <h3 className="text-2xl font-bold text-slate-950">May Payroll Dashboard</h3>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Locked</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {[["Employees", "1,248"], ["Net Pay", "INR 8.42 Cr"], ["Attendance", "94.7%"], ["Compliance Alerts", "7"]].map(([label, value]) => (
                <div key={label} className="rounded-md bg-white p-4 shadow-sm">
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-1 text-2xl font-bold text-slate-950">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-md bg-white p-4">
              <p className="mb-3 text-sm font-bold text-slate-950">Workflow automation</p>
              {["Leave applied → notify manager", "Payroll processed → generate payslips", "Candidate shortlisted → schedule interview"].map(item => (
                <div key={item} className="flex items-center gap-2 border-t border-slate-100 py-3 text-sm text-slate-700">
                  <CheckCircle2 className="size-4 text-emerald-600" /> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MarqueeSection({ sec, pc, globalBg }: SectionProps) {
  const items = (sec.items || "").split("\n").filter(Boolean);
  if (!items.length) return null;
  const bg = sec.sectionBg || "transparent";
  return (
    <section id={sec.id} className="border-y py-4 overflow-hidden" style={{ backgroundColor: bg === "transparent" ? undefined : bg, borderColor: pc + "18" }}>
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 max-w-7xl mx-auto px-5">
        {items.map((item: string, i: number) => (
          <span key={i} className="text-sm font-semibold text-slate-600 whitespace-nowrap">{item}</span>
        ))}
      </div>
    </section>
  );
}

function GridSection({ sec, pc, sc, globalBg }: SectionProps) {
  const items = (sec.items || "").split("\n").filter(Boolean);
  const sectionStyle = sec.sectionBg ? { backgroundColor: sec.sectionBg } : {};
  const cardStyle = { backgroundColor: sec.cardBg || "#ffffff" };
  return (
    <section id={sec.id} className="py-16" style={sectionStyle}>
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-10 max-w-3xl">
          {sec.subtitle && <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: pc }}>{sec.subtitle}</p>}
          <h2 className="text-4xl font-black">{sec.title}</h2>
          {sec.content && <p className="mt-3 text-slate-600 leading-7">{sec.content}</p>}
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((part: string, i: number) => {
            const [titlePart, ...descParts] = part.split(":");
            const desc = descParts.join(":").trim();
            return (
              <div key={i} className="p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow" style={{ ...cardStyle, borderColor: pc + "18" }}>
                <div className="mb-5 grid size-12 place-items-center rounded-md" style={{ backgroundColor: pc + "12", color: pc }}>
                  {getIcon(titlePart)}
                </div>
                <h3 className="text-lg font-black">{titlePart.trim()}</h3>
                {desc && <p className="mt-3 text-sm leading-6 text-slate-600">{desc}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CardsSection({ sec, pc, sc, globalBg }: SectionProps) {
  const items = (sec.items || "").split("\n").filter(Boolean);
  const sectionStyle = { backgroundColor: sec.sectionBg || (pc + "08") };
  const cardStyle = { backgroundColor: sec.cardBg || "#ffffff" };
  return (
    <section id={sec.id} className="py-16" style={sectionStyle}>
      <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          {sec.subtitle && <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: pc }}>{sec.subtitle}</p>}
          <h2 className="text-4xl font-black">{sec.title}</h2>
          {sec.content && <p className="mt-4 leading-7 text-slate-600">{sec.content}</p>}
          {items.length > 0 && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {items.map((item: string, i: number) => (
                <div key={i} className="flex items-center gap-2 rounded-md p-3 text-sm font-semibold shadow-sm" style={cardStyle}>
                  <ShieldCheck className="size-4 text-emerald-600 shrink-0" /> {item.trim()}
                </div>
              ))}
            </div>
          )}
          {sec.cta1Label && (
            <Link href="/register" className="mt-6 inline-flex items-center gap-2 rounded px-5 py-3 text-sm font-black text-white shadow hover:opacity-90 transition" style={{ backgroundColor: pc }}>
              {sec.cta1Label} <ArrowRight className="size-4" />
            </Link>
          )}
        </div>
        <div className="p-6 rounded-xl border shadow-sm" style={{ ...cardStyle, borderColor: pc + "15" }}>
          <h3 className="text-xl font-bold mb-5">Operations Snapshot</h3>
          <div className="grid gap-3">
            {[["Core Payroll Engine", "99.9% uptime", "All components operational"],
              ["Indian Compliance", "Auto-updated", "EPF, ESIC, PT, TDS synced"],
              ["Employee Self Service", "Mobile-first", "Leave, payslip, KYC, docs"],
              ["Attendance System", "Multi-mode", "Biometric, geo-fence, QR"]].map(([name, metric, note]) => (
              <div key={name} className="rounded-md border border-slate-100 p-4" style={cardStyle}>
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-sm">{name}</p>
                  <span className="text-xs text-slate-500">{metric}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HighlightsSection({ sec, pc, sc }: SectionProps) {
  const items = (sec.items || "").split("\n").filter(Boolean);
  const sectionBg = sec.sectionBg || "#0f172a";
  const cardBg = sec.cardBg || "rgba(255,255,255,0.04)";
  return (
    <section id={sec.id} className="py-16 text-white" style={{ backgroundColor: sectionBg }}>
      <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-3">
        <div className="lg:col-span-1">
          {sec.subtitle && <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: sc }}>{sec.subtitle}</p>}
          <h2 className="text-4xl font-black">{sec.title}</h2>
          {sec.content && <p className="mt-4 leading-7 text-slate-300">{sec.content}</p>}
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:col-span-2">
          {items.map((part: string, i: number) => {
            const [titlePart, ...descParts] = part.split(":");
            const desc = descParts.join(":").trim();
            return (
              <div key={i} className="rounded-lg border border-white/10 p-5 hover:bg-white/5 transition" style={{ backgroundColor: cardBg }}>
                <Sparkles className="mb-4" style={{ color: sc }} />
                <h3 className="font-black">{titlePart.trim()}</h3>
                {desc && <p className="mt-2 text-sm leading-6 text-slate-300">{desc}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PricingSection({ sec, pc, sc, globalBg }: SectionProps) {
  const items = (sec.items || "").split("\n").filter(Boolean);
  const sectionStyle = sec.sectionBg ? { backgroundColor: sec.sectionBg } : {};
  const cardStyle = { backgroundColor: sec.cardBg || "#ffffff" };
  return (
    <section id={sec.id} className="py-16" style={sectionStyle}>
      <div className="mx-auto max-w-7xl px-5">
        {sec.subtitle && <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: pc }}>{sec.subtitle}</p>}
        <h2 className="mt-2 text-4xl font-black mb-10">{sec.title}</h2>
        <div className="grid gap-5 lg:grid-cols-4">
          {items.map((part: string, i: number) => {
            const [planName, price, ...descParts] = part.split(":");
            const desc = descParts.join(":").trim();
            const isHighlight = i === 1;
            return (
              <div key={i} className={`p-6 rounded-xl border shadow-sm ${isHighlight ? "ring-2" : ""}`}
                style={{ ...cardStyle, borderColor: pc + "20", ...(isHighlight ? { ringColor: pc } : {}) }}>
                {isHighlight && (
                  <div className="mb-3 text-[10px] font-black uppercase tracking-widest text-center rounded-full py-0.5" style={{ backgroundColor: pc + "15", color: pc }}>
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-black">{planName?.trim()}</h3>
                <p className="mt-4 text-4xl font-black">{price?.trim() === "0" ? "Custom" : `INR ${price?.trim()}`}</p>
                {price?.trim() !== "0" && <p className="text-xs text-slate-500">per employee/month</p>}
                <p className="mt-4 text-sm leading-6 text-slate-600">{desc}</p>
                <Link href="/register" className="mt-6 block rounded-md px-4 py-3 text-center text-sm font-black text-white hover:opacity-90 transition"
                  style={{ backgroundColor: isHighlight ? pc : pc + "cc" }}>
                  {sec.cta1Label || "Get Started"}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ContactSection({ sec, pc, sc, globalBg }: SectionProps) {
  const items = (sec.items || "").split("\n").filter(Boolean);
  const sectionStyle = { backgroundColor: sec.sectionBg || (pc + "08") };
  const cardStyle = { backgroundColor: sec.cardBg || "#ffffff" };
  const contactIcons = [<Phone className="size-4" />, <Mail className="size-4" />, <Globe2 className="size-4" />, <Globe2 className="size-4" />];
  return (
    <section id={sec.id} className="py-16" style={sectionStyle}>
      <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          {sec.subtitle && <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: pc }}>{sec.subtitle}</p>}
          <h2 className="text-4xl font-black">{sec.title}</h2>
          {sec.content && <p className="mt-4 leading-7 text-slate-600">{sec.content}</p>}
          <div className="mt-6 grid gap-3">
            {items.map((item: string, i: number) => (
              <div key={i} className="flex items-center gap-3 rounded-md p-3 text-sm font-semibold text-slate-700 shadow-sm" style={cardStyle}>
                <span style={{ color: pc }}>{contactIcons[i] || <Globe2 className="size-4" />}</span>
                {item.trim()}
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 rounded-xl border shadow-sm" style={{ ...cardStyle, borderColor: pc + "15" }}>
          <h3 className="text-xl font-bold mb-5">Request a Demo</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <input className="h-11 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-indigo-400" placeholder="Name" />
            <input className="h-11 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-indigo-400" placeholder="Work email" />
            <input className="h-11 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-indigo-400" placeholder="Company" />
            <input className="h-11 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-indigo-400" placeholder="Employee count" />
            <textarea className="min-h-28 rounded-md border border-slate-200 px-3 py-3 text-sm md:col-span-2 outline-none focus:border-indigo-400 resize-none" placeholder="Tell us what you need" />
          </div>
          <Link href="/register" className="mt-5 inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-black text-white hover:opacity-90 transition" style={{ backgroundColor: pc }}>
            {sec.cta1Label || "Register and Continue"} <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
