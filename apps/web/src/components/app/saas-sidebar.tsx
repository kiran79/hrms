"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Building2,
  Gauge,
  LogOut,
  Users,
  CreditCard,
  Layers3,
  CalendarDays,
  Award,
  CalendarCheck,
  MapPin,
  Inbox,
  Briefcase,
  Landmark,
  FileCheck2,
  Settings as SettingsIcon,
  ChevronDown,
  ChevronRight,
  UserCircle,
  Folder,
  FileText
} from "lucide-react";
import type { Route } from "next";

export function SaasSidebar({ active }: { active: string }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [companyName, setCompanyName] = useState("Acme India Pvt Ltd");
  const [domain, setDomain] = useState("hr.acmeindia.in");
  const [companyLogo, setCompanyLogo] = useState("");
  const [viewMode, setViewMode] = useState<"self" | "manager">("manager");
  
  // Collapsible Submenus
  const [employeesOpen, setEmployeesOpen] = useState(true);
  const [financeOpen, setFinanceOpen] = useState(false);
  const [offboardingOpen, setOffboardingOpen] = useState(true);

  const loadCompanyData = () => {
    const companyStr = localStorage.getItem("session_company");
    if (companyStr) {
      const company = JSON.parse(companyStr);
      setCompanyName(company.name || "Acme India Pvt Ltd");
      setDomain(company.domain || "hr.acmeindia.in");
      setCompanyLogo(company.logo || "");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      loadCompanyData();
      
      // Load active view mode
      const savedMode = localStorage.getItem("session_view_mode") as "self" | "manager";
      if (savedMode) {
        setViewMode(savedMode);
      } else {
        localStorage.setItem("session_view_mode", "manager");
      }

      const handleRefresh = () => {
        loadCompanyData();
        const savedMode = localStorage.getItem("session_view_mode") as "self" | "manager";
        if (savedMode) setViewMode(savedMode);
      };

      window.addEventListener("viewModeChanged", handleRefresh);
      return () => window.removeEventListener("viewModeChanged", handleRefresh);
    }
  }, []);

  const handleToggleMode = (mode: "self" | "manager") => {
    setViewMode(mode);
    localStorage.setItem("session_view_mode", mode);
    // Dispatch a custom event to notify current page of view mode change
    window.dispatchEvent(new Event("viewModeChanged"));
    
    // Redirect to dashboard on toggle to avoid routing mismatch
    router.push("/dashboard" as any);
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("session_user_type");
    localStorage.removeItem("session_company");
    localStorage.removeItem("session_company_email");
    localStorage.removeItem("session_view_mode");
    router.push(("/login?tab=company" as any));
  };

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 text-white flex flex-col justify-between min-h-screen shrink-0 font-sans">
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-60px)] px-4 py-5 scrollbar-thin scrollbar-thumb-slate-800">
        
        {/* Top Header */}
        <div className="mb-6 flex items-center gap-3 px-1">
          <div className="grid size-9 place-items-center rounded-md bg-indigo-600 shadow-lg shadow-indigo-600/30 overflow-hidden shrink-0">
            {companyLogo ? (
              <img src={companyLogo} alt="Logo" className="size-full object-contain p-1 bg-white" />
            ) : (
              <Building2 className="size-5" />
            )}
          </div>
          <div>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Bharat HRMS</p>
            <h1 className="font-extrabold text-white text-sm">Workspace Portal</h1>
          </div>
        </div>

        {/* Company Badge */}
        <div className="mb-5 rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-xs">
          <div className="flex items-center gap-2 font-semibold text-slate-200">
            {companyLogo ? (
              <img src={companyLogo} alt="Logo" className="size-3.5 object-contain rounded shrink-0 bg-white" />
            ) : (
              <Building2 className="size-3.5 text-indigo-400 shrink-0" />
            )}
            <span className="truncate">{companyName}</span>
          </div>
          <p className="mt-1 text-[9px] text-slate-500 font-mono truncate">Domain: {domain}</p>
        </div>

        {/* Perspective Toggles */}
        <div className="mb-6 grid grid-cols-2 rounded-lg bg-slate-900 p-1 text-xs font-bold text-center">
          <button
            onClick={() => handleToggleMode("self")}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-md transition ${
              viewMode === "self"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <UserCircle className="size-3.5" />
            Self
          </button>
          <button
            onClick={() => handleToggleMode("manager")}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-md transition ${
              viewMode === "manager"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Users className="size-3.5" />
            Manager
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="grid gap-1 text-xs text-slate-400">
          
          {/* COMMON: Dashboard */}
          <Link
            href={"/dashboard" as any}
            className={`flex items-center gap-2.5 rounded-md px-3 py-2 transition ${
              active === "Dashboard"
                ? "bg-indigo-600/10 border-l-2 border-indigo-600 text-white font-semibold"
                : "hover:bg-slate-900 hover:text-white"
            }`}
          >
            <Gauge className="size-4 text-indigo-400" />
            <span>Dashboard</span>
          </Link>

          {viewMode === "manager" ? (
            /* MANAGER MODE LINKS */
            <>
              {/* COLLAPSIBLE: Employees */}
              <div>
                <button
                  onClick={() => setEmployeesOpen(!employeesOpen)}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 transition hover:bg-slate-900 hover:text-white"
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="size-4 text-indigo-400" />
                    <span>Employees</span>
                  </div>
                  {employeesOpen ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
                </button>
                {employeesOpen && (
                  <div className="mt-0.5 ml-4 pl-3 border-l border-slate-800 grid gap-0.5">
                    <Link
                      href={"/dashboard/employees" as any}
                      className={`block rounded-md px-3 py-1.5 transition ${
                        active === "Employees" ? "text-indigo-400 font-semibold" : "hover:text-white"
                      }`}
                    >
                      Employee Directory
                    </Link>
                    <Link
                      href={"/dashboard/departments" as any}
                      className={`block rounded-md px-3 py-1.5 transition ${
                        active === "Departments" ? "text-indigo-400 font-semibold" : "hover:text-white"
                      }`}
                    >
                      Departments
                    </Link>
                    <Link
                      href={"/dashboard/designations" as any}
                      className={`block rounded-md px-3 py-1.5 transition ${
                        active === "Designations" ? "text-indigo-400 font-semibold" : "hover:text-white"
                      }`}
                    >
                      Designations
                    </Link>
                    <Link
                      href={"/dashboard/shifts" as any}
                      className={`block rounded-md px-3 py-1.5 transition ${
                        active === "Shifts" ? "text-indigo-400 font-semibold" : "hover:text-white"
                      }`}
                    >
                      Shifts
                    </Link>
                    <Link
                      href={"/dashboard/shift-roster" as any}
                      className={`block rounded-md px-3 py-1.5 transition ${
                        active === "Shift Roster" ? "text-indigo-400 font-semibold" : "hover:text-white"
                      }`}
                    >
                      Shift Roster
                    </Link>
                  </div>
                )}
              </div>

              {/* Assets */}
              <Link
                href={"/dashboard/assets" as any}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 transition ${
                  active === "Assets"
                    ? "bg-indigo-600/10 border-l-2 border-indigo-600 text-white font-semibold"
                    : "hover:bg-slate-900 hover:text-white"
                }`}
              >
                <CreditCard className="size-4 text-indigo-400" />
                <span>Assets</span>
              </Link>

              {/* Holidays */}
              <Link
                href={"/dashboard/holidays" as any}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 transition ${
                  active === "Holidays"
                    ? "bg-indigo-600/10 border-l-2 border-indigo-600 text-white font-semibold"
                    : "hover:bg-slate-900 hover:text-white"
                }`}
              >
                <CalendarDays className="size-4 text-indigo-400" />
                <span>Holidays</span>
              </Link>

              {/* Appreciations */}
              <Link
                href={"/dashboard/appreciations" as any}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 transition ${
                  active === "Appreciations"
                    ? "bg-indigo-600/10 border-l-2 border-indigo-600 text-white font-semibold"
                    : "hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Award className="size-4 text-indigo-400" />
                <span>Appreciations</span>
              </Link>

              {/* Leaves */}
              <Link
                href={"/dashboard/leaves" as any}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 transition ${
                  active === "Leaves"
                    ? "bg-indigo-600/10 border-l-2 border-indigo-600 text-white font-semibold"
                    : "hover:bg-slate-900 hover:text-white"
                }`}
              >
                <CalendarCheck className="size-4 text-indigo-400" />
                <span>Leaves</span>
              </Link>

              {/* Attendance */}
              <Link
                href={"/dashboard/attendance" as any}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 transition ${
                  active === "Attendance"
                    ? "bg-indigo-600/10 border-l-2 border-indigo-600 text-white font-semibold"
                    : "hover:bg-slate-900 hover:text-white"
                }`}
              >
                <MapPin className="size-4 text-indigo-400" />
                <span>Attendance</span>
              </Link>

              {/* COLLAPSIBLE: Offboarding */}
              <div>
                <button
                  onClick={() => setOffboardingOpen(!offboardingOpen)}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 transition hover:bg-slate-900 hover:text-white"
                >
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="size-4 text-indigo-400" />
                    <span>Offboardings</span>
                  </div>
                  {offboardingOpen ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
                </button>
                {offboardingOpen && (
                  <div className="mt-0.5 ml-4 pl-3 border-l border-slate-800 grid gap-0.5">
                    <Link
                      href={"/dashboard/offboarding?sub=warnings" as any}
                      className={`block rounded-md px-3 py-1.5 transition ${
                        active === "Warnings" ? "text-indigo-400 font-semibold" : "hover:text-white"
                      }`}
                    >
                      Warnings
                    </Link>
                    <Link
                      href={"/dashboard/offboarding?sub=resignations" as any}
                      className={`block rounded-md px-3 py-1.5 transition ${
                        active === "Resignations" ? "text-indigo-400 font-semibold" : "hover:text-white"
                      }`}
                    >
                      Resignations
                    </Link>
                    <Link
                      href={"/dashboard/offboarding?sub=terminations" as any}
                      className={`block rounded-md px-3 py-1.5 transition ${
                        active === "Terminations" ? "text-indigo-400 font-semibold" : "hover:text-white"
                      }`}
                    >
                      Terminations
                    </Link>
                    <Link
                      href={"/dashboard/offboarding?sub=complaints" as any}
                      className={`block rounded-md px-3 py-1.5 transition ${
                        active === "Complaints" ? "text-indigo-400 font-semibold" : "hover:text-white"
                      }`}
                    >
                      Complaints
                    </Link>
                  </div>
                )}
              </div>

              {/* Payroll */}
              <Link
                href={"/dashboard/payroll" as any}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 transition ${
                  active === "Payroll"
                    ? "bg-indigo-600/10 border-l-2 border-indigo-600 text-white font-semibold"
                    : "hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Layers3 className="size-4 text-indigo-400" />
                <span>Payroll Run</span>
              </Link>

              {/* COLLAPSIBLE: Finance */}
              <div>
                <button
                  onClick={() => setFinanceOpen(!financeOpen)}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 transition hover:bg-slate-900 hover:text-white"
                >
                  <div className="flex items-center gap-2.5">
                    <Landmark className="size-4 text-indigo-400" />
                    <span>Finance</span>
                  </div>
                  {financeOpen ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
                </button>
                {financeOpen && (
                  <div className="mt-0.5 ml-4 pl-3 border-l border-slate-800 grid gap-0.5">
                    <Link
                      href={"/dashboard/finance?tab=accounts" as any}
                      className={`block rounded-md px-3 py-1.5 transition ${
                        active === "Accounts" ? "text-indigo-400 font-semibold" : "hover:text-white"
                      }`}
                    >
                      Bank Accounts
                    </Link>
                    <Link
                      href={"/dashboard/finance?tab=deposits" as any}
                      className={`block rounded-md px-3 py-1.5 transition ${
                        active === "Deposits" ? "text-indigo-400 font-semibold" : "hover:text-white"
                      }`}
                    >
                      Deposits (Inflow)
                    </Link>
                    <Link
                      href={"/dashboard/finance?tab=expenses" as any}
                      className={`block rounded-md px-3 py-1.5 transition ${
                        active === "Expenses" ? "text-indigo-400 font-semibold" : "hover:text-white"
                      }`}
                    >
                      Expenses (Outflow)
                    </Link>
                  </div>
                )}
              </div>

              {/* Letter Heads */}
              <Link
                href={"/dashboard/letter-heads" as any}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 transition ${
                  active === "Letter Heads"
                    ? "bg-indigo-600/10 border-l-2 border-indigo-600 text-white font-semibold"
                    : "hover:bg-slate-900 hover:text-white"
                }`}
              >
                <FileCheck2 className="size-4 text-indigo-400" />
                <span>Letter Heads</span>
              </Link>

              {/* Employee Documents */}
              <Link
                href={"/dashboard/documents" as any}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 transition ${
                  active === "Documents"
                    ? "bg-indigo-600/10 border-l-2 border-indigo-600 text-white font-semibold"
                    : "hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Folder className="size-4 text-indigo-400" />
                <span>Documents</span>
              </Link>

              {/* Tenant Billing */}
              <Link
                href={"/account" as any}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 transition ${
                  active === "Tenant Billing"
                    ? "bg-indigo-600/10 border-l-2 border-indigo-600 text-white font-semibold"
                    : "hover:bg-slate-900 hover:text-white"
                }`}
              >
                <CreditCard className="size-4 text-indigo-400" />
                <span>SaaS Billing</span>
              </Link>

              {/* Reports Center */}
              <Link
                href={"/dashboard/reports" as any}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 transition ${
                  active === "Reports"
                    ? "bg-indigo-600/10 border-l-2 border-indigo-600 text-white font-semibold"
                    : "hover:bg-slate-900 hover:text-white"
                }`}
              >
                <FileText className="size-4 text-indigo-400" />
                <span>Reports Center</span>
              </Link>

              {/* Settings */}
              <Link
                href={"/dashboard/settings" as any}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 transition ${
                  active === "Settings"
                    ? "bg-indigo-600/10 border-l-2 border-indigo-600 text-white font-semibold"
                    : "hover:bg-slate-900 hover:text-white"
                }`}
              >
                <SettingsIcon className="size-4 text-indigo-400" />
                <span>Settings</span>
              </Link>
            </>
          ) : (
            /* SELF ESS MODE LINKS */
            <>
              {/* My Profile */}
              <Link
                href={"/dashboard/employees" as any}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 transition ${
                  active === "Employees"
                    ? "bg-indigo-600/10 border-l-2 border-indigo-600 text-white font-semibold"
                    : "hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Users className="size-4 text-indigo-400" />
                <span>My Profile</span>
              </Link>

              {/* My Attendance */}
              <Link
                href={"/dashboard/attendance" as any}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 transition ${
                  active === "Attendance"
                    ? "bg-indigo-600/10 border-l-2 border-indigo-600 text-white font-semibold"
                    : "hover:bg-slate-900 hover:text-white"
                }`}
              >
                <MapPin className="size-4 text-indigo-400" />
                <span>Clock In/Out</span>
              </Link>

              {/* Apply Leave */}
              <Link
                href={"/dashboard/leaves" as any}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 transition ${
                  active === "Leaves"
                    ? "bg-indigo-600/10 border-l-2 border-indigo-600 text-white font-semibold"
                    : "hover:bg-slate-900 hover:text-white"
                }`}
              >
                <CalendarCheck className="size-4 text-indigo-400" />
                <span>Apply Leave</span>
              </Link>

              {/* My Assets */}
              <Link
                href={"/dashboard/assets" as any}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 transition ${
                  active === "Assets"
                    ? "bg-indigo-600/10 border-l-2 border-indigo-600 text-white font-semibold"
                    : "hover:bg-slate-900 hover:text-white"
                }`}
              >
                <CreditCard className="size-4 text-indigo-400" />
                <span>My Assets</span>
              </Link>

              {/* My Appreciations */}
              <Link
                href={"/dashboard/appreciations" as any}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 transition ${
                  active === "Appreciations"
                    ? "bg-indigo-600/10 border-l-2 border-indigo-600 text-white font-semibold"
                    : "hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Award className="size-4 text-indigo-400" />
                <span>My Appreciations</span>
              </Link>

              {/* My Offboarding */}
              <Link
                href={"/dashboard/offboarding?sub=resignations" as any}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 transition ${
                  active === "Resignations"
                    ? "bg-indigo-600/10 border-l-2 border-indigo-600 text-white font-semibold"
                    : "hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Briefcase className="size-4 text-indigo-400" />
                <span>Submit Resignation</span>
              </Link>

              {/* Settings */}
              <Link
                href={"/dashboard/settings" as any}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 transition ${
                  active === "Settings"
                    ? "bg-indigo-600/10 border-l-2 border-indigo-600 text-white font-semibold"
                    : "hover:bg-slate-900 hover:text-white"
                }`}
              >
                <SettingsIcon className="size-4 text-indigo-400" />
                <span>Preferences</span>
              </Link>

              {/* My Documents */}
              <Link
                href={"/dashboard/documents" as any}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 transition ${
                  active === "Documents"
                    ? "bg-indigo-600/10 border-l-2 border-indigo-600 text-white font-semibold"
                    : "hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Folder className="size-4 text-indigo-400" />
                <span>My Documents</span>
              </Link>

              {/* My Reports */}
              <Link
                href={"/dashboard/reports" as any}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 transition ${
                  active === "Reports"
                    ? "bg-indigo-600/10 border-l-2 border-indigo-600 text-white font-semibold"
                    : "hover:bg-slate-900 hover:text-white"
                }`}
              >
                <FileText className="size-4 text-indigo-400" />
                <span>My Reports</span>
              </Link>
            </>
          )}

        </nav>
      </div>

      {/* Sidebar Footer Logout */}
      <div className="p-4 border-t border-slate-900 bg-slate-950">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded px-3 py-2 text-xs text-slate-400 hover:bg-rose-950/20 hover:text-rose-400 transition"
        >
          <LogOut className="size-4" /> 
          <span>Exit Workspace</span>
        </button>
      </div>
    </aside>
  );
}
