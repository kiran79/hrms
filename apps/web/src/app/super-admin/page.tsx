"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { tenantAccounts, saasPlans } from "@/lib/data";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Edit,
  Globe2,
  Home,
  Mail,
  Menu,
  Plus,
  Search,
  Send,
  Settings,
  Trash2,
  UserCog,
  Users,
  X,
  TrendingUp,
  Briefcase,
  AlertCircle,
  FileCheck,
  ShieldAlert,
  ArrowRightLeft,
  Settings2,
  Eye,
  LogOut,
  Sliders,
  DollarSign
} from "lucide-react";
import { Badge, Card } from "@/components/ui";

export default function SuperAdminPage() {
  const router = useRouter();
  
  // Sidebar view state
  const [activeView, setActiveView] = useState<
    "dashboard" | "companies" | "subscriptions" | "transactions" | "queries" | "website" | "settings"
  >("dashboard");

  // Companies List State
  const [companies, setCompanies] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Drawer States
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<"basic" | "logo">("basic");
  const [editingCompany, setEditingCompany] = useState<any | null>(null);
  
  // Drawer form states
  const [formName, setFormName] = useState("");
  const [formShortName, setFormShortName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formPlan, setFormPlan] = useState("Growth");
  const [formStatus, setFormStatus] = useState("Active");
  const [formAddress, setFormAddress] = useState("");
  const [formAdminEmail, setFormAdminEmail] = useState("");
  const [formAdminPassword, setFormAdminPassword] = useState("");
  const [formDomain, setFormDomain] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Subscriptions configuration state
  const [plans, setPlans] = useState<any[]>([]);

  // Public inquiries state
  const [inquiries, setInquiries] = useState<any[]>([]);

  // Transactions list state
  const [transactions, setTransactions] = useState<any[]>([]);

  // Admin user info
  const [adminName, setAdminName] = useState("SaaS Super Admin");

  // Initialize data from localStorage or defaults
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Authenticate check
      const userType = localStorage.getItem("session_user_type");
      if (userType !== "super-admin") {
        router.push("/login?tab=super-admin");
        return;
      }

      // Read admin name
      const storedAdminName = localStorage.getItem("session_admin_name");
      if (storedAdminName) {
        setAdminName(storedAdminName);
      }

      // 2. Load companies
      const storedCompanies = localStorage.getItem("companies");
      if (storedCompanies) {
        setCompanies(JSON.parse(storedCompanies));
      } else {
        localStorage.setItem("companies", JSON.stringify(tenantAccounts));
        setCompanies(tenantAccounts);
      }

      // 3. Load subscription plans
      const storedPlans = localStorage.getItem("saas_plans");
      if (storedPlans) {
        setPlans(JSON.parse(storedPlans));
      } else {
        localStorage.setItem("saas_plans", JSON.stringify(saasPlans));
        setPlans(saasPlans);
      }

      // 4. Load public contact queries
      const storedInquiries = localStorage.getItem("contact_queries");
      if (storedInquiries) {
        setInquiries(JSON.parse(storedInquiries));
      } else {
        const defaultQueries = [
          { name: "Rahul Deshmukh", email: "rahul@tata.com", company: "Tata Consultancy Services", employees: "12000", message: "Interested in the White Label Partner pricing for our sister concerns. Let's arrange a call.", date: "2026-05-30" },
          { name: "Pooja Hegde", email: "pooja@hegdehealth.in", company: "Hegde Hospital & Labs", employees: "450", message: "Need bio-metric device synchronization instructions for geo-fencing.", date: "2026-05-29" },
        ];
        localStorage.setItem("contact_queries", JSON.stringify(defaultQueries));
        setInquiries(defaultQueries);
      }

      // 5. Load mock transactions
      const storedTransactions = localStorage.getItem("transactions");
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      } else {
        const defaultTransactions = [
          { invoiceNo: "INV-2026-001", companyName: "Acme India Pvt Ltd", plan: "Growth", amount: "INR 1,85,952", date: "2026-05-25", status: "Paid", method: "Razorpay" },
          { invoiceNo: "INV-2026-002", companyName: "MetroCare Hospitals", plan: "Enterprise", amount: "INR 6,80,580", date: "2026-05-24", status: "Paid", method: "Bank Transfer" },
          { invoiceNo: "INV-2026-003", companyName: "Westfield Manufacturing", plan: "Growth", amount: "INR 1,16,220", date: "2026-05-20", status: "Unpaid", method: "Card" }
        ];
        localStorage.setItem("transactions", JSON.stringify(defaultTransactions));
        setTransactions(defaultTransactions);
      }
    }
  }, [router]);

  // Handle Log Out
  const handleLogout = () => {
    localStorage.removeItem("session_user_type");
    localStorage.removeItem("session_admin_email");
    localStorage.removeItem("session_admin_name");
    router.push("/login?tab=super-admin");
  };

  // Open drawer to ADD
  const handleAddCompanyClick = () => {
    setEditingCompany(null);
    setFormName("");
    setFormShortName("");
    setFormEmail("");
    setFormPhone("");
    setFormPlan("Growth");
    setFormStatus("Active");
    setFormAddress("");
    setFormAdminEmail("");
    setFormAdminPassword("");
    setFormDomain("");
    setLogoPreview(null);
    setDrawerTab("basic");
    setDrawerOpen(true);
  };

  // Open drawer to EDIT
  const handleEditCompanyClick = (company: any) => {
    setEditingCompany(company);
    setFormName(company.name);
    setFormShortName(company.name.slice(0, 3).toUpperCase());
    setFormEmail(company.email || `info@${company.domain}`);
    setFormPhone(company.phone || "+91 98765 43210");
    setFormPlan(company.plan);
    setFormStatus(company.status.includes("ends") || company.status.includes("due") ? "Active" : company.status);
    setFormAddress(company.address || "Mumbai, India");
    setFormAdminEmail(company.adminEmail || `admin@${company.domain}`);
    setFormAdminPassword("");
    setFormDomain(company.domain.replace("hr.", "").replace(".in", ""));
    setLogoPreview(company.logo || null);
    setDrawerTab("basic");
    setDrawerOpen(true);
  };

  // Save/Create Company Action
  const handleSaveCompany = () => {
    if (!formName || !formEmail || !formDomain) {
      alert("Please fill in Company Name, Email, and Domain prefix.");
      return;
    }

    const domainName = formDomain.includes(".") ? formDomain : `hr.${formDomain.toLowerCase().trim()}.in`;

    const updatedCompanies = [...companies];

    if (editingCompany) {
      // Edit mode
      const idx = updatedCompanies.findIndex((c) => c.domain === editingCompany.domain);
      if (idx !== -1) {
        updatedCompanies[idx] = {
          ...updatedCompanies[idx],
          name: formName,
          email: formEmail,
          phone: formPhone,
          plan: formPlan,
          status: formStatus,
          address: formAddress,
          adminEmail: formAdminEmail,
          domain: domainName,
          logo: logoPreview
        };
      }
    } else {
      // Add mode
      // Calculate MRR based on plan and dummy employees count
      const empCount = 200; // default initial
      let price = 149;
      if (formPlan === "Starter") price = 99;
      if (formPlan === "Enterprise") price = 199;
      if (formPlan === "White Label Partner") price = 499;
      const mrrVal = empCount * price;
      
      const newCompany = {
        name: formName,
        email: formEmail,
        phone: formPhone,
        plan: formPlan,
        employees: empCount,
        mrr: `INR ${mrrVal.toLocaleString("en-IN")}`,
        status: formStatus,
        domain: domainName,
        address: formAddress,
        adminEmail: formAdminEmail || `admin@${domainName}`,
        logo: logoPreview || null
      };
      updatedCompanies.push(newCompany);
    }

    // Save to localStorage
    localStorage.setItem("companies", JSON.stringify(updatedCompanies));
    setCompanies(updatedCompanies);
    setDrawerOpen(false);
  };

  // Delete Company Action
  const handleDeleteCompany = (company: any) => {
    if (confirm(`Are you sure you want to delete ${company.name}? All tenant payroll, employees, and settings will be permanently lost.`)) {
      const updated = companies.filter((c) => c.domain !== company.domain);
      localStorage.setItem("companies", JSON.stringify(updated));
      setCompanies(updated);
    }
  };

  // Masquerade / Login As Company
  const handleLoginAsCompany = (company: any) => {
    // Save company session details
    localStorage.setItem("session_user_type", "company");
    localStorage.setItem("session_company", JSON.stringify(company));
    localStorage.setItem("session_company_email", company.adminEmail || `admin@${company.domain}`);
    
    // Redirect to company dashboard
    router.push("/dashboard");
  };

  // Save modified subscription plans
  const handleSavePlanPrice = (planName: string, newPrice: number) => {
    const updated = plans.map((p) => p.name === planName ? { ...p, price: newPrice } : p);
    localStorage.setItem("saas_plans", JSON.stringify(updated));
    setPlans(updated);
    alert(`Price for ${planName} plan updated successfully.`);
  };

  // Filtered companies computed value
  const filteredCompanies = companies.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        c.domain.toLowerCase().includes(searchQuery.toLowerCase());
    
    const filterStatus = statusFilter === "All" || 
                         (statusFilter === "Active" && c.status.toLowerCase().includes("active")) ||
                         (statusFilter === "Inactive" && c.status.toLowerCase().includes("inactive")) ||
                         (statusFilter === "Trial" && c.status.toLowerCase().includes("trial")) ||
                         (statusFilter === "Due" && c.status.toLowerCase().includes("due"));
                         
    return matchSearch && filterStatus;
  });

  // MRR aggregation
  const totalMRR = companies.reduce((acc, curr) => {
    if (curr.mrr) {
      const num = parseInt(curr.mrr.replace(/[^0-9]/g, ""), 10);
      return acc + (isNaN(num) ? 0 : num);
    }
    return acc;
  }, 0);

  // Total Employees aggregation
  const totalEmployeesCount = companies.reduce((acc, curr) => acc + (curr.employees || 0), 0);

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <aside className="bg-slate-950 px-4 py-6 text-slate-300 flex flex-col justify-between">
        <div>
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="grid size-10 place-items-center rounded-md bg-indigo-600 text-white font-bold">
              <Building2 size={22} />
            </div>
            <div>
              <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Bharat HRMS</p>
              <h1 className="font-extrabold text-white text-base">Super Admin Console</h1>
            </div>
          </div>
          
          <nav className="grid gap-1 text-sm font-medium">
            <button
              onClick={() => setActiveView("dashboard")}
              className={`flex items-center gap-3 rounded-md px-4 py-3 transition ${
                activeView === "dashboard" ? "bg-indigo-600 text-white font-semibold" : "hover:bg-white/10 text-slate-400"
              }`}
            >
              <Home className="size-5" /> Platform Dashboard
            </button>
            <button
              onClick={() => setActiveView("companies")}
              className={`flex items-center gap-3 rounded-md px-4 py-3 transition ${
                activeView === "companies" ? "bg-indigo-600 text-white font-semibold" : "hover:bg-white/10 text-slate-400"
              }`}
            >
              <Building2 className="size-5" /> Manage Companies
            </button>
            <button
              onClick={() => setActiveView("subscriptions")}
              className={`flex items-center gap-3 rounded-md px-4 py-3 transition ${
                activeView === "subscriptions" ? "bg-indigo-600 text-white font-semibold" : "hover:bg-white/10 text-slate-400"
              }`}
            >
              <CreditCard className="size-5" /> Subscriptions & Plans
            </button>
            <button
              onClick={() => setActiveView("transactions")}
              className={`flex items-center gap-3 rounded-md px-4 py-3 transition ${
                activeView === "transactions" ? "bg-indigo-600 text-white font-semibold" : "hover:bg-white/10 text-slate-400"
              }`}
            >
              <ArrowRightLeft className="size-5" /> Transactions Log
            </button>
            <button
              onClick={() => setActiveView("queries")}
              className={`flex items-center gap-3 rounded-md px-4 py-3 transition ${
                activeView === "queries" ? "bg-indigo-600 text-white font-semibold" : "hover:bg-white/10 text-slate-400"
              }`}
              // Show notification badge for queries count
            >
              <Mail className="size-5" /> Public Inquiries
              {inquiries.length > 0 && (
                <span className="ml-auto rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  {inquiries.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveView("website")}
              className={`flex items-center gap-3 rounded-md px-4 py-3 transition ${
                activeView === "website" ? "bg-indigo-600 text-white font-semibold" : "hover:bg-white/10 text-slate-400"
              }`}
            >
              <Globe2 className="size-5" /> Branding Settings
            </button>
            <button
              onClick={() => setActiveView("settings")}
              className={`flex items-center gap-3 rounded-md px-4 py-3 transition ${
                activeView === "settings" ? "bg-indigo-600 text-white font-semibold" : "hover:bg-white/10 text-slate-400"
              }`}
            >
              <Settings className="size-5" /> Email & Gateway API
            </button>
          </nav>
        </div>

        <div className="border-t border-slate-800 pt-4">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="grid size-9 place-items-center rounded-full bg-slate-800 text-indigo-400 border border-slate-700">
              <UserCog className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-400 truncate">{adminName}</p>
              <Link href="/super-admin/profile" className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold underline block">
                Manage Profile
              </Link>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-slate-400 hover:bg-rose-950/20 hover:text-rose-400 transition"
          >
            <LogOut className="size-5" /> Log Out Session
          </button>
        </div>
      </aside>

      {/* Main View Area */}
      <section className="min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <div className="flex h-20 items-center justify-between border-b border-border bg-white px-6">
          <h2 className="text-lg font-bold text-slate-800">
            {activeView === "dashboard" && "SaaS Platform Management Dashboard"}
            {activeView === "companies" && "Multi-Tenant Directory"}
            {activeView === "subscriptions" && "Subscription Tiers Configurator"}
            {activeView === "transactions" && "Financial Auditing Ledger"}
            {activeView === "queries" && "Public Inquiries & Demo Leads"}
            {activeView === "website" && "White-Label & Domain Settings"}
            {activeView === "settings" && "SMTP, SMS & WhatsApp Gateway Config"}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              Region: India (IST)
            </span>
            <Link href="/super-admin/profile" className="grid size-10 place-items-center rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition shadow-sm">
              <UserCog className="size-5" />
            </Link>
          </div>
        </div>

        {/* View Details */}
        <div className="p-6">
          {/* ================= VIEW: DASHBOARD ================= */}
          {activeView === "dashboard" && (
            <div className="grid gap-6">
              {/* Stats Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="border-slate-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-500">Total Tenants</p>
                    <Building2 className="text-indigo-500 size-5" />
                  </div>
                  <p className="mt-2 text-3xl font-extrabold text-slate-900">{companies.length}</p>
                  <p className="mt-1 text-xs font-semibold text-emerald-700">+{companies.filter(c => c.status === "Active").length} Active</p>
                </Card>
                
                <Card className="border-slate-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-500">Billable Employees</p>
                    <Users className="text-cyan-500 size-5" />
                  </div>
                  <p className="mt-2 text-3xl font-extrabold text-slate-900">
                    {totalEmployeesCount.toLocaleString("en-IN")}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-indigo-700">Across all workspaces</p>
                </Card>

                <Card className="border-slate-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-500">Monthly Revenue (MRR)</p>
                    <TrendingUp className="text-emerald-500 size-5" />
                  </div>
                  <p className="mt-2 text-3xl font-extrabold text-slate-900">
                    INR {totalMRR.toLocaleString("en-IN")}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-emerald-700">+11.2% this quarter</p>
                </Card>

                <Card className="border-slate-200 bg-indigo-900/5 border-indigo-100">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-indigo-800">Inquiry Leads</p>
                    <Mail className="text-indigo-600 size-5" />
                  </div>
                  <p className="mt-2 text-3xl font-extrabold text-indigo-900">{inquiries.length}</p>
                  <p className="mt-1 text-xs font-semibold text-indigo-600">Pending review</p>
                </Card>
              </div>

              {/* Subscriptions alert if SMTP missing */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-amber-200 bg-amber-50 px-5 py-4">
                <div className="flex gap-3">
                  <ShieldAlert className="size-6 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-950">White-label SMTP Gateway configured incorrectly</p>
                    <p className="mt-0.5 text-xs text-amber-800 font-medium">Outgoing tenant payroll emails and salary slip notifications will fail until SMTP settings are resolved.</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveView("settings")}
                  className="rounded-md bg-white border border-amber-300 hover:bg-amber-100 transition px-4 py-2 text-xs font-bold text-amber-950"
                >
                  Configure Mailer
                </button>
              </div>

              {/* Main Content Panels */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Companies */}
                <Card className="border-slate-200">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">Recent Company Workspaces</h3>
                    <button onClick={() => setActiveView("companies")} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition">
                      View all directories →
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {companies.slice(0, 4).map((c) => (
                      <div key={c.domain} className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="grid size-9 place-items-center rounded-lg bg-indigo-50 font-bold text-indigo-600 text-xs shrink-0">
                            {c.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">{c.name}</p>
                            <p className="text-xs text-slate-500 truncate">{c.domain}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <Badge>{c.plan}</Badge>
                          <p className="mt-0.5 text-[10px] text-slate-500">{c.employees} users</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Recent Payments & Invoices */}
                <Card className="border-slate-200">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">Recent Subscription Invoices</h3>
                    <button onClick={() => setActiveView("transactions")} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition">
                      Billing history →
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {transactions.slice(0, 3).map((t) => (
                      <div key={t.invoiceNo} className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{t.companyName}</p>
                          <p className="text-xs text-slate-500 font-mono">{t.invoiceNo} • {t.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-900">{t.amount}</p>
                          <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            t.status === "Paid" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}>
                            {t.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Compliance Overview Panel */}
              <Card className="border-slate-200">
                <h3 className="mb-4 text-base font-bold text-slate-900">National Compliance Rules Pack Status</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-md border border-slate-200 p-4 bg-slate-50/50">
                    <p className="text-xs font-bold text-slate-500 uppercase">EPF Calculations</p>
                    <p className="mt-1 text-sm font-bold text-slate-800">12% Base Wage Ceiling</p>
                    <p className="mt-2 text-xs text-indigo-600 font-semibold flex items-center gap-1">
                      <FileCheck className="size-3" /> Statutory Version v2.4 (Active)
                    </p>
                  </div>
                  <div className="rounded-md border border-slate-200 p-4 bg-slate-50/50">
                    <p className="text-xs font-bold text-slate-500 uppercase">ESIC Deductions</p>
                    <p className="mt-1 text-sm font-bold text-slate-800">0.75% EE & 3.25% ER</p>
                    <p className="mt-2 text-xs text-indigo-600 font-semibold flex items-center gap-1">
                      <FileCheck className="size-3" /> Statutory Version v1.8 (Active)
                    </p>
                  </div>
                  <div className="rounded-md border border-slate-200 p-4 bg-slate-50/50">
                    <p className="text-xs font-bold text-slate-500 uppercase">Professional Tax (PT)</p>
                    <p className="mt-1 text-sm font-bold text-slate-800">28 Indian States Config</p>
                    <p className="mt-2 text-xs text-indigo-600 font-semibold flex items-center gap-1">
                      <FileCheck className="size-3" /> Rule Version v3.1 (Active)
                    </p>
                  </div>
                  <div className="rounded-md border border-slate-200 p-4 bg-slate-50/50">
                    <p className="text-xs font-bold text-slate-500 uppercase">Income Tax (TDS)</p>
                    <p className="mt-1 text-sm font-bold text-slate-800">Old & New Tax Regime FY26</p>
                    <p className="mt-2 text-xs text-indigo-600 font-semibold flex items-center gap-1">
                      <FileCheck className="size-3" /> Budget 2026 Core Engine
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ================= VIEW: COMPANIES (CRUD) ================= */}
          {activeView === "companies" && (
            <div className="grid gap-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={handleAddCompanyClick}
                  className="inline-flex items-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition px-5 py-3 text-sm font-semibold text-white shadow-sm"
                  type="button"
                >
                  <Plus className="size-4" /> Add New Company
                </button>
                <div className="flex items-center rounded-md border border-slate-200 bg-white overflow-hidden shadow-sm">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-11 border-r border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none font-semibold"
                  >
                    <option value="All">Status (All)</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Trial">Trial</option>
                    <option value="Due">Payment Due</option>
                  </select>
                  <div className="flex items-center px-3 text-slate-400">
                    <Search className="size-4" />
                  </div>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 w-56 pr-3 text-sm outline-none text-slate-700"
                    placeholder="Search company or domain..."
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm mt-2">
                <table className="w-full min-w-[1000px] text-left text-sm border-collapse">
                  <thead className="border-b border-slate-200 bg-slate-50 text-slate-800 font-bold text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-4">Company Details</th>
                      <th className="px-5 py-4">Workspace URL</th>
                      <th className="px-5 py-4">Admin Contacts</th>
                      <th className="px-5 py-4">Metrics</th>
                      <th className="px-5 py-4">Billing Plan</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredCompanies.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-12 text-center text-slate-500 font-semibold">
                          No company workspaces found matching the criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredCompanies.map((c) => (
                        <tr key={c.domain} className="hover:bg-slate-50/50 align-middle">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {c.logo ? (
                                <img src={c.logo} alt={c.name} className="size-11 object-contain rounded border border-slate-200 p-0.5 shrink-0 bg-white" />
                              ) : (
                                <div className="grid size-11 place-items-center rounded bg-indigo-50 font-black text-indigo-600 text-sm shrink-0 border border-indigo-100">
                                  {c.name.slice(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <p className="font-bold text-slate-900 text-sm">{c.name}</p>
                                <p className="text-xs text-slate-500">{c.phone || "+91 98765 43210"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <a
                              href={`https://${c.domain}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-600 hover:text-indigo-800 font-semibold underline text-xs break-all"
                            >
                              {c.domain}
                            </a>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-xs font-semibold text-slate-800">{c.adminEmail || `admin@${c.domain}`}</p>
                            <p className="text-[10px] text-slate-400">Created: 29-05-2026</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-xs font-semibold text-slate-800">Users: <span className="font-bold text-slate-900">{c.employees || 200}</span></p>
                            <p className="text-xs text-emerald-700 font-bold">{c.mrr || "INR 17,880"}/mo</p>
                          </td>
                          <td className="px-5 py-4 font-semibold text-xs text-slate-700">
                            <Badge>{c.plan}</Badge>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                              c.status.toLowerCase().includes("active")
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : c.status.toLowerCase().includes("trial")
                                ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                                : c.status.toLowerCase().includes("due")
                                ? "bg-amber-50 text-amber-700 border border-amber-100"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}>
                              <span className={`size-1.5 rounded-full ${
                                c.status.toLowerCase().includes("active") ? "bg-emerald-500" :
                                c.status.toLowerCase().includes("trial") ? "bg-indigo-500" :
                                c.status.toLowerCase().includes("due") ? "bg-amber-500" : "bg-slate-500"
                              }`} />
                              {c.status}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleLoginAsCompany(c)}
                                className="inline-flex items-center gap-1 rounded bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-1.5 text-xs font-bold hover:bg-indigo-100 transition shrink-0"
                                title="Login As Company Workspace"
                              >
                                <Eye className="size-3.5" /> Login as Org
                              </button>
                              <button
                                onClick={() => handleEditCompanyClick(c)}
                                className="grid size-8 place-items-center rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                                title="Edit Company Details"
                              >
                                <Edit className="size-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCompany(c)}
                                className="grid size-8 place-items-center rounded bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                                title="Delete Company"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= VIEW: SUBSCRIPTIONS ================= */}
          {activeView === "subscriptions" && (
            <div className="grid gap-6">
              <div className="mb-4">
                <p className="text-sm text-slate-500">Configure public subscription tiers and employee billing multipliers. All adjustments immediately apply to new tenant calculations.</p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {plans.map((p) => (
                  <Card key={p.name} className="border-slate-200 flex flex-col justify-between p-6">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold text-slate-900">{p.name}</h4>
                        <Badge>INR {p.price}/mo</Badge>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">{p.audience}</p>
                      <p className="mt-3 text-xs font-bold text-indigo-600">{p.limits}</p>
                      
                      <div className="mt-4 border-t border-slate-100 pt-3">
                        <p className="text-xs font-bold text-slate-700 mb-2">Enabled Modules:</p>
                        <div className="flex flex-wrap gap-1">
                          {p.features.map((f: string) => (
                            <span key={f} className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-slate-100 pt-4">
                      <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                        Monthly Employee Price (INR)
                        <div className="flex gap-2">
                          <input
                            type="number"
                            defaultValue={p.price}
                            id={`price-${p.name}`}
                            className="h-9 w-24 rounded border border-slate-200 px-2 outline-none focus:border-indigo-500 text-sm font-semibold"
                          />
                          <button
                            onClick={() => {
                              const input = document.getElementById(`price-${p.name}`) as HTMLInputElement;
                              if (input) {
                                handleSavePlanPrice(p.name, parseFloat(input.value));
                              }
                            }}
                            className="rounded bg-indigo-600 text-white px-3 py-1 text-xs font-bold hover:bg-indigo-700 transition"
                          >
                            Update
                          </button>
                        </div>
                      </label>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ================= VIEW: TRANSACTIONS ================= */}
          {activeView === "transactions" && (
            <Card className="border-slate-200">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">SaaS License Payment Logs</h3>
                  <p className="text-xs text-slate-500">Comprehensive system transaction records including automated payouts and pending balances.</p>
                </div>
              </div>
              <div className="overflow-x-auto rounded border border-slate-100">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-700">
                    <tr>
                      <th className="px-4 py-3">Invoice No</th>
                      <th className="px-4 py-3">Company Workspace</th>
                      <th className="px-4 py-3">Plan Tiers</th>
                      <th className="px-4 py-3">Transaction Amount</th>
                      <th className="px-4 py-3">Invoice Date</th>
                      <th className="px-4 py-3">Gateway Method</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {transactions.map((t) => (
                      <tr key={t.invoiceNo} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-mono text-xs font-bold">{t.invoiceNo}</td>
                        <td className="px-4 py-3 font-semibold text-xs">{t.companyName}</td>
                        <td className="px-4 py-3 font-semibold text-xs">{t.plan}</td>
                        <td className="px-4 py-3 font-bold">{t.amount}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{t.date}</td>
                        <td className="px-4 py-3 text-xs font-semibold text-slate-600">{t.method}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            t.status === "Paid" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* ================= VIEW: PUBLIC INQUIRIES ================= */}
          {activeView === "queries" && (
            <div className="grid gap-6">
              <div className="mb-2">
                <p className="text-sm text-slate-500">Contact form entries submitted by prospective clients from the home page landing slider.</p>
              </div>
              {inquiries.length === 0 ? (
                <Card className="p-8 text-center text-slate-500 font-semibold border-slate-200">
                  No pending support inquiries or demo requests available.
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {inquiries.map((q, idx) => (
                    <Card key={idx} className="border-slate-200 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                          <div>
                            <h4 className="font-bold text-slate-950 text-sm">{q.name}</h4>
                            <p className="text-xs text-slate-500">{q.email}</p>
                          </div>
                          <Badge>{q.employees} employees</Badge>
                        </div>
                        <p className="text-xs text-slate-700 font-bold mb-1">Company: <span className="text-slate-900 font-semibold">{q.company}</span></p>
                        <div className="bg-slate-50 rounded p-3 border border-slate-100">
                          <p className="text-xs text-slate-600 leading-5 italic">"{q.message}"</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-semibold">Received: {q.date}</span>
                        <a
                          href={`mailto:${q.email}?subject=Regarding your Bharat HRMS demo request`}
                          className="inline-flex items-center gap-1 rounded bg-indigo-600 text-white px-3 py-1.5 text-xs font-bold hover:bg-indigo-700 transition"
                        >
                          <Send className="size-3" /> Reply Email
                        </a>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= VIEW: WEBSITE SETTINGS ================= */}
          {activeView === "website" && (
            <Card className="border-slate-200 max-w-4xl p-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5">Platform White-Label Branding</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  SaaS Brand Name
                  <input type="text" defaultValue="Bharat HRMS Payroll" className="h-10 rounded border border-slate-200 px-3 outline-none focus:border-indigo-500" />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Global Helpdesk Email
                  <input type="email" defaultValue="support@bharathrms.in" className="h-10 rounded border border-slate-200 px-3 outline-none focus:border-indigo-500" />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Primary Brand Hex Color
                  <div className="flex gap-2">
                    <input type="color" defaultValue="#4f46e5" className="h-10 w-12 rounded border border-slate-200 p-1 cursor-pointer" />
                    <input type="text" defaultValue="#4f46e5" className="h-10 flex-1 rounded border border-slate-200 px-3 outline-none focus:border-indigo-500 font-mono text-sm" />
                  </div>
                </label>
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  White-label Login Domain
                  <input type="text" defaultValue="login.bharathrms.in" className="h-10 rounded border border-slate-200 px-3 outline-none focus:border-indigo-500" />
                </label>
              </div>

              <div className="mt-8 border-t border-slate-100 pt-6">
                <p className="font-bold text-sm text-slate-800 mb-3">Logo Resources</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {["Dark Logo", "Light Logo", "Favicon", "Small Logo"].map((item) => (
                    <div key={item} className="rounded border border-dashed border-slate-300 p-4 text-center bg-slate-50/50 hover:bg-slate-100/50 transition">
                      <p className="text-xs font-bold text-slate-700 mb-2">{item}</p>
                      <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition">Upload +</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 border-t border-slate-100 pt-4 flex justify-end">
                <button
                  onClick={() => alert("Branding parameters saved successfully.")}
                  className="rounded bg-indigo-600 hover:bg-indigo-700 transition text-white px-5 py-2.5 text-sm font-bold shadow-sm"
                >
                  Save Global Branding
                </button>
              </div>
            </Card>
          )}

          {/* ================= VIEW: GATEWAY SETTINGS ================= */}
          {activeView === "settings" && (
            <Card className="border-slate-200 max-w-4xl p-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5">System Notification Gateways</h3>
              
              <div className="grid gap-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-rose-500" /> Outgoing SMTP Mailer Setup
                  </h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                      Host Address
                      <input type="text" placeholder="smtp.mailgun.org" className="h-10 rounded border border-slate-200 px-3 outline-none focus:border-indigo-500 text-sm font-normal" />
                    </label>
                    <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                      Port Number
                      <input type="number" placeholder="587" className="h-10 rounded border border-slate-200 px-3 outline-none focus:border-indigo-500 text-sm font-normal" />
                    </label>
                    <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                      Auth User
                      <input type="text" placeholder="postmaster@bharathrms.in" className="h-10 rounded border border-slate-200 px-3 outline-none focus:border-indigo-500 text-sm font-normal" />
                    </label>
                    <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                      Auth Password
                      <input type="password" placeholder="••••••••" className="h-10 rounded border border-slate-200 px-3 outline-none focus:border-indigo-500 text-sm font-normal" />
                    </label>
                    <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                      SSL/TLS
                      <select className="h-10 rounded border border-slate-200 bg-white px-3 outline-none focus:border-indigo-500 text-sm font-normal">
                        <option>STARTTLS (Recommended)</option>
                        <option>SSL</option>
                        <option>Plaintext</option>
                      </select>
                    </label>
                    <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                      Default From Sender
                      <input type="text" placeholder="payroll-no-reply@bharathrms.in" className="h-10 rounded border border-slate-200 px-3 outline-none focus:border-indigo-500 text-sm font-normal" />
                    </label>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-500" /> WhatsApp Integration API
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                      WhatsApp Cloud API Provider
                      <select className="h-10 rounded border border-slate-200 bg-white px-3 outline-none focus:border-indigo-500 text-sm font-normal">
                        <option>Meta Cloud API (Official)</option>
                        <option>Twilio for WhatsApp</option>
                        <option>Gupshup Gateway</option>
                      </select>
                    </label>
                    <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                      Secret Access Token / API Key
                      <input type="password" placeholder="EAAa..." className="h-10 rounded border border-slate-200 px-3 outline-none focus:border-indigo-500 text-sm font-normal" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-slate-100 pt-4 flex justify-between items-center">
                <span className="text-xs text-rose-500 font-bold">* Keep gateway keys guarded. Full access logs are enabled.</span>
                <button
                  onClick={() => alert("API Gateway configurations saved.")}
                  className="rounded bg-indigo-600 hover:bg-indigo-700 transition text-white px-5 py-2.5 text-sm font-bold shadow-sm"
                >
                  Save Gateway APIs
                </button>
              </div>
            </Card>
          )}
        </div>
      </section>

      {/* ================= COMPONENT: DRAWER (ADD/EDIT COMPANY) ================= */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
          <aside className="h-full w-full max-w-[800px] flex flex-col bg-white shadow-2xl animate-slide-left overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-8 py-5 shrink-0">
              <div className="flex items-center gap-3">
                <button onClick={() => setDrawerOpen(false)} className="text-slate-500 hover:text-slate-700 transition">
                  <X className="size-6" />
                </button>
                <h3 className="text-xl font-bold text-slate-900">
                  {editingCompany ? `Edit Tenant: ${editingCompany.name}` : "Create New Company Workspace"}
                </h3>
              </div>
              <Badge>{editingCompany ? "Update Mode" : "New Tenant Setup"}</Badge>
            </header>

            {/* Content Tabs */}
            <div className="flex px-8 border-b border-slate-200 bg-slate-50/50 shrink-0">
              <button
                className={`py-3 px-1 border-b-2 font-bold text-sm text-center w-36 transition-all ${
                  drawerTab === "basic" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
                onClick={() => setDrawerTab("basic")}
              >
                Basic details
              </button>
              <button
                className={`py-3 px-1 border-b-2 font-bold text-sm text-center w-36 transition-all ${
                  drawerTab === "logo" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
                onClick={() => setDrawerTab("logo")}
              >
                Tenant logo
              </button>
            </div>

            {/* Inner scroll contents */}
            <div className="flex-1 overflow-y-auto p-8">
              {drawerTab === "basic" ? (
                <div className="grid gap-6">
                  {/* Basic Input Grid */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <label className="grid gap-2 text-sm font-semibold text-slate-700">
                      Company Legal Name *
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => {
                          setFormName(e.target.value);
                          if (!editingCompany) {
                            setFormDomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""));
                          }
                        }}
                        placeholder="Acme India Pvt Ltd"
                        className="h-10 rounded border border-slate-200 px-3 text-sm font-normal outline-none focus:border-indigo-500"
                        required
                      />
                    </label>

                    <label className="grid gap-2 text-sm font-semibold text-slate-700">
                      Workspace Subdomain Prefix *
                      <div className="flex rounded border border-slate-200 bg-slate-50 overflow-hidden focus-within:border-indigo-500">
                        <span className="flex items-center px-3 border-r border-slate-100 text-xs font-semibold text-slate-400">hr.</span>
                        <input
                          type="text"
                          value={formDomain}
                          onChange={(e) => setFormDomain(e.target.value)}
                          placeholder="acmeindia"
                          className="h-10 flex-1 bg-white px-3 text-sm font-normal outline-none"
                          required
                          disabled={!!editingCompany}
                        />
                        <span className="flex items-center px-3 border-l border-slate-100 text-xs font-semibold text-slate-400">.in</span>
                      </div>
                    </label>

                    <label className="grid gap-2 text-sm font-semibold text-slate-700">
                      Company Contact Email *
                      <input
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="hr@acmeindia.in"
                        className="h-10 rounded border border-slate-200 px-3 text-sm font-normal outline-none focus:border-indigo-500"
                        required
                      />
                    </label>

                    <label className="grid gap-2 text-sm font-semibold text-slate-700">
                      Company Contact Phone
                      <input
                        type="text"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="h-10 rounded border border-slate-200 px-3 text-sm font-normal outline-none focus:border-indigo-500"
                      />
                    </label>

                    <label className="grid gap-2 text-sm font-semibold text-slate-700">
                      Subscription Plan Tier
                      <select
                        value={formPlan}
                        onChange={(e) => setFormPlan(e.target.value)}
                        className="h-10 rounded border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500"
                      >
                        <option>Starter</option>
                        <option>Growth</option>
                        <option>Enterprise</option>
                        <option>White Label Partner</option>
                      </select>
                    </label>

                    <label className="grid gap-2 text-sm font-semibold text-slate-700">
                      Tenant Status
                      <select
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value)}
                        className="h-10 rounded border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500"
                      >
                        <option>Active</option>
                        <option>Inactive</option>
                        <option>Trial</option>
                        <option>Payment due</option>
                      </select>
                    </label>
                  </div>

                  <label className="grid gap-2 text-sm font-semibold text-slate-700">
                    Company Registered Address
                    <textarea
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      placeholder="Enter legal physical address details"
                      className="min-h-20 rounded border border-slate-200 p-3 text-sm font-normal outline-none focus:border-indigo-500"
                    />
                  </label>

                  {/* Admin Credentials Setup */}
                  <h4 className="border-b border-slate-100 pb-2 text-base font-bold text-slate-900 mt-4">
                    Tenant Root Admin Credentials
                  </h4>
                  <div className="grid gap-6 md:grid-cols-2">
                    <label className="grid gap-2 text-sm font-semibold text-slate-700">
                      Admin Email *
                      <input
                        type="email"
                        value={formAdminEmail}
                        onChange={(e) => setFormAdminEmail(e.target.value)}
                        placeholder="admin@acmeindia.in"
                        className="h-10 rounded border border-slate-200 px-3 text-sm font-normal outline-none focus:border-indigo-500"
                        required
                      />
                    </label>

                    <label className="grid gap-2 text-sm font-semibold text-slate-700">
                      Admin Login Password {editingCompany ? "(Blank to keep unchanged)" : "*"}
                      <input
                        type="password"
                        value={formAdminPassword}
                        onChange={(e) => setFormAdminPassword(e.target.value)}
                        placeholder={editingCompany ? "••••••••" : "Company@123"}
                        className="h-10 rounded border border-slate-200 px-3 text-sm font-normal outline-none focus:border-indigo-500"
                        required={!editingCompany}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                /* Logo Selection Tab */
                <div className="grid gap-6 text-center">
                  <p className="text-sm text-slate-500 text-left">Upload your tenant branding logo. In a live system, this overrides the default header graphics to provide white-labeled employee portals.</p>
                  
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="border border-dashed border-slate-300 rounded p-4 flex flex-col items-center justify-center min-h-[160px] bg-slate-50">
                      <p className="text-xs font-bold text-slate-700 mb-3">General Brand Logo</p>
                      
                      {logoPreview ? (
                        <div className="relative border border-slate-200 p-1 bg-white mb-2">
                          <img src={logoPreview} alt="Logo preview" className="h-14 w-auto object-contain" />
                          <button
                            type="button"
                            onClick={() => setLogoPreview(null)}
                            className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-0.5 size-4 grid place-items-center text-[10px] hover:bg-rose-700 transition"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="text-slate-400 mb-2">No file selected</div>
                      )}
                      
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setLogoPreview("https://hrmifly-saas.codeifly.in/images/light.png")}
                          className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-1.5 rounded border border-indigo-100 hover:bg-indigo-100 transition"
                        >
                          Select Demo Logo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-slate-50 px-8 py-4 shrink-0 flex justify-end gap-3">
              <button
                onClick={() => setDrawerOpen(false)}
                className="rounded border border-slate-200 bg-white hover:bg-slate-100 transition px-5 py-2.5 text-sm font-semibold text-slate-700"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCompany}
                className="rounded bg-indigo-600 hover:bg-indigo-700 transition px-6 py-2.5 text-sm font-bold text-white shadow-sm"
              >
                {editingCompany ? "Save Changes" : "Create Tenant"}
              </button>
            </footer>
          </aside>
        </div>
      )}
    </main>
  );
}
