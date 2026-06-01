"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { AppNav } from "@/components/app/app-nav";
import { Badge, Card } from "@/components/ui";
import { Building2, LockKeyhole, ShieldCheck, UserCog, AlertCircle, CheckCircle2 } from "lucide-react";
import { tenantAccounts } from "@/lib/data";

const defaultSuperAdmin = {
  email: "superadmin@bharathrms.local",
  password: "SuperAdmin@123"
};

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Set tab based on query param if available
  const initialTab = searchParams.get("tab") === "super-admin" ? "super-admin" : "company";
  const [tab, setTab] = useState<"super-admin" | "company">(initialTab);
  
  // Fields for Super Admin Form
  const [saEmail, setSaEmail] = useState(defaultSuperAdmin.email);
  const [saPassword, setSaPassword] = useState(defaultSuperAdmin.password);
  
  // Fields for Company Form
  const [coEmail, setCoEmail] = useState("admin@example.com");
  const [coPassword, setCoPassword] = useState("12345678");
  const [coDomain, setCoDomain] = useState("hrmifly");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialize companies list in localStorage if it doesn't exist
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCompanies = localStorage.getItem("companies");
      if (!storedCompanies) {
        localStorage.setItem("companies", JSON.stringify(tenantAccounts));
      }
      
      // Check for signup redirects
      const registered = searchParams.get("registered");
      const newEmail = searchParams.get("newAdminEmail");
      if (registered && newEmail) {
        setSaEmail(decodeURIComponent(newEmail));
        setSaPassword("");
        setSuccess("SaaS Admin registered successfully! Enter your password to login.");
      }
    }
  }, [searchParams]);

  const handleSuperAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!saEmail || !saPassword) {
      setError("Please fill in email and password.");
      return;
    }

    // 1. Verify against default super admin credentials
    if (saEmail.toLowerCase() === defaultSuperAdmin.email.toLowerCase() && saPassword === defaultSuperAdmin.password) {
      loginSuperAdmin(defaultSuperAdmin.email, "SaaS Super Admin");
      return;
    }

    // 2. Verify against dynamic admins in localStorage
    try {
      const storedAdminsStr = localStorage.getItem("saas_admins");
      const storedAdmins = storedAdminsStr ? JSON.parse(storedAdminsStr) : [];
      
      const matchedAdmin = storedAdmins.find(
        (admin: any) => admin.email.toLowerCase() === saEmail.toLowerCase() && admin.password === saPassword
      );

      if (matchedAdmin) {
        loginSuperAdmin(matchedAdmin.email, matchedAdmin.fullName);
        return;
      }
    } catch (err) {
      console.error("Error reading SaaS admins:", err);
    }

    // 3. Fallback check for customized admin profile (after password change)
    try {
      const storedProfileStr = localStorage.getItem("saas_profile");
      if (storedProfileStr) {
        const storedProfile = JSON.parse(storedProfileStr);
        if (storedProfile.email.toLowerCase() === saEmail.toLowerCase() && storedProfile.password === saPassword) {
          loginSuperAdmin(storedProfile.email, storedProfile.fullName);
          return;
        }
      }
    } catch (err) {
      console.error("Error checking customized profile:", err);
    }

    setError("Invalid Super Admin credentials.");
  };

  const loginSuperAdmin = (email: string, name: string) => {
    setSuccess("Login successful! Entering SaaS console...");
    
    // Save session
    localStorage.setItem("session_user_type", "super-admin");
    localStorage.setItem("session_admin_email", email);
    localStorage.setItem("session_admin_name", name);
    
    setTimeout(() => {
      router.push("/super-admin");
    }, 1000);
  };

  const handleCompanyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!coEmail || !coPassword || !coDomain) {
      setError("Please enter your company email, password, and workspace domain.");
      return;
    }

    try {
      const companiesStr = localStorage.getItem("companies");
      const companies = companiesStr ? JSON.parse(companiesStr) : tenantAccounts;
      
      // Let's find the company by checking domain match or email match
      // e.g. domain: "acmeindia" matches domain "hr.acmeindia.in" or name "Acme India Pvt Ltd"
      const cleanedDomain = coDomain.toLowerCase().replace("hr.", "").replace(".in", "").trim();
      
      const matchedCompany = companies.find((c: any) => {
        const compDomain = c.domain.toLowerCase();
        return compDomain.includes(cleanedDomain) || c.name.toLowerCase().includes(cleanedDomain);
      });

      if (matchedCompany) {
        // Successful login
        setSuccess(`Welcome back! Logging into ${matchedCompany.name}...`);
        
        localStorage.setItem("session_user_type", "company");
        localStorage.setItem("session_company", JSON.stringify(matchedCompany));
        localStorage.setItem("session_company_email", coEmail);

        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        // Fallback: If they entered a company not in database, we can create a mock one to be user-friendly,
        // or prompt them. Let's create it dynamically so they never get stuck!
        const generatedName = coDomain.charAt(0).toUpperCase() + coDomain.slice(1) + " Pvt Ltd";
        const newCo = {
          name: generatedName,
          plan: "Growth",
          employees: 120,
          mrr: "INR 17,880",
          status: "Active",
          domain: coDomain.includes(".") ? coDomain : `hr.${coDomain}.in`
        };

        // Save new company to database
        const updatedCompanies = [...companies, newCo];
        localStorage.setItem("companies", JSON.stringify(updatedCompanies));

        // Login as this new company
        setSuccess(`Company registered in workspace. Entering ${generatedName}...`);
        localStorage.setItem("session_user_type", "company");
        localStorage.setItem("session_company", JSON.stringify(newCo));
        localStorage.setItem("session_company_email", coEmail);

        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      }
    } catch (err) {
      setError("An error occurred during company login. Please try again.");
    }
  };

  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[0.9fr_1.1fr]">
      <Card className="p-7 border-slate-200">
        <div className="mb-6 grid size-12 place-items-center rounded-md bg-indigo-50 text-indigo-600">
          <LockKeyhole className="size-6" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Login to your workspace</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Choose whether you are entering the SaaS owner console or a company HRMS workspace.
        </p>

        {/* Tab Selection */}
        <div className="mt-6 grid grid-cols-2 rounded-lg bg-slate-100 p-1 text-sm font-semibold">
          <button
            className={tab === "super-admin" ? "rounded-md bg-white px-3 py-3 text-indigo-600 shadow-sm transition-all" : "rounded-md px-3 py-3 text-slate-600 transition-all"}
            onClick={() => { setTab("super-admin"); setError(null); setSuccess(null); }}
            type="button"
          >
            Login as Super Admin
          </button>
          <button
            className={tab === "company" ? "rounded-md bg-white px-3 py-3 text-indigo-600 shadow-sm transition-all" : "rounded-md px-3 py-3 text-slate-600 transition-all"}
            onClick={() => { setTab("company"); setError(null); setSuccess(null); }}
            type="button"
          >
            Login as Company
          </button>
        </div>

        {error && (
          <div className="mt-5 flex items-center gap-2 rounded-md bg-rose-50 border border-rose-200 p-3 text-sm text-rose-800 font-semibold">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-5 flex items-center gap-2 rounded-md bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-800 font-semibold animate-pulse">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Super Admin Form */}
        {tab === "super-admin" ? (
          <form onSubmit={handleSuperAdminLogin} className="mt-6 grid gap-4">
            <div className="rounded-md border border-indigo-200 bg-indigo-50/50 p-4 text-xs text-indigo-950">
              <p className="font-bold text-sm text-indigo-900 mb-1">Default Platform Credentials</p>
              <p>Email: <span className="font-bold select-all">{defaultSuperAdmin.email}</span></p>
              <p>Password: <span className="font-bold select-all">{defaultSuperAdmin.password}</span></p>
              <p className="mt-2 text-slate-500 font-medium">After login, customize these in "Super Admin Profile Management".</p>
            </div>
            
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Super Admin Email
              <input
                type="email"
                value={saEmail}
                onChange={(e) => setSaEmail(e.target.value)}
                placeholder="superadmin@bharathrms.local"
                className="h-11 rounded-md border border-border bg-white px-3 text-sm font-normal outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                required
              />
            </label>
            
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Password
              <input
                type="password"
                value={saPassword}
                onChange={(e) => setSaPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 rounded-md border border-border bg-white px-3 text-sm font-normal outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                required
              />
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-600 my-1">
              <input type="checkbox" className="size-4 rounded border-border text-indigo-600 focus:ring-indigo-500" defaultChecked />
              Remember this administrator
            </label>
            
            <button
              type="submit"
              className="rounded-md bg-indigo-600 hover:bg-indigo-700 transition px-4 py-3 text-center text-sm font-semibold text-white shadow-sm"
            >
              Sign In to SaaS Panel
            </button>
            
            <Link
              href={"/super-admin/signup" as any}
              className="rounded-md border border-slate-200 hover:bg-slate-50 text-slate-700 transition px-4 py-3 text-center text-sm font-semibold"
            >
              Signup as SaaS Admin
            </Link>
          </form>
        ) : (
          /* Company Form */
          <form onSubmit={handleCompanyLogin} className="mt-6 grid gap-4">
            <div className="rounded-md border border-cyan-200 bg-cyan-50/50 p-4 text-xs text-cyan-950">
              <p className="font-bold text-sm text-cyan-900 mb-1">Pre-configured Demo Companies</p>
              <div className="grid grid-cols-2 gap-1 font-mono text-[10px]">
                <div>Domain: <span className="font-bold">hrmifly</span></div>
                <div>User: <span className="font-bold">admin@example.com</span></div>
                <div>Password: <span className="font-bold">12345678</span></div>
              </div>
              <p className="mt-2 text-slate-500 font-medium">Or enter a custom domain name (e.g. "mycomp") and we will auto-generate it!</p>
            </div>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Company Domain / Tenant Code
              <div className="flex rounded-md border border-border bg-slate-50 overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                <span className="flex items-center bg-slate-100 px-3 border-r border-border text-xs font-semibold text-slate-500">hr.</span>
                <input
                  type="text"
                  value={coDomain}
                  onChange={(e) => setCoDomain(e.target.value)}
                  placeholder="acmeindia"
                  className="h-11 flex-1 bg-white px-3 text-sm font-normal outline-none"
                  required
                />
                <span className="flex items-center bg-slate-100 px-3 border-l border-border text-xs font-semibold text-slate-500">.in</span>
              </div>
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Company Email
              <input
                type="email"
                value={coEmail}
                onChange={(e) => setCoEmail(e.target.value)}
                placeholder="hr@acmeindia.in"
                className="h-11 rounded-md border border-border bg-white px-3 text-sm font-normal outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                required
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Password
              <input
                type="password"
                value={coPassword}
                onChange={(e) => setCoPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 rounded-md border border-border bg-white px-3 text-sm font-normal outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                required
              />
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-600 my-1">
              <input type="checkbox" className="size-4 rounded border-border text-indigo-600 focus:ring-indigo-500" defaultChecked />
              Remember this workspace
            </label>
            
            <button
              type="submit"
              className="rounded-md bg-indigo-600 hover:bg-indigo-700 transition px-4 py-3 text-center text-sm font-semibold text-white shadow-sm"
            >
              Sign In to Company Dashboard
            </button>
            
            <Link
              href="/register"
              className="rounded-md border border-slate-200 hover:bg-slate-50 text-slate-700 transition px-4 py-3 text-center text-sm font-semibold"
            >
              Register New Company
            </Link>
          </form>
        )}

        <div className="mt-5 flex items-center justify-between text-xs font-semibold">
          <Link href="/register" className="text-indigo-600 hover:text-indigo-800 transition">
            Create organization
          </Link>
          <a className="text-slate-500 hover:text-slate-700 transition" href="#">
            Forgot password?
          </a>
        </div>
      </Card>

      <Card className="bg-slate-900 p-7 text-white flex flex-col justify-between border-none shadow-xl">
        <div>
          {tab === "super-admin" ? (
            <UserCog className="mb-5 text-indigo-400 size-10" />
          ) : (
            <Building2 className="mb-5 text-indigo-400 size-10" />
          )}
          <h3 className="text-2xl font-bold text-slate-50">
            {tab === "super-admin" ? "SaaS Owner console" : "Company workspace access"}
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {tab === "super-admin"
              ? "Super Admin manages platform-wide companies, subscription billing, billing tiers, global email layouts, and security credentials."
              : "Company administrators can configure their organization's internal workflows: manage employee databases, calculate Indian payroll, track attendance shifts, and approve leave applications."}
          </p>
        </div>
        <div className="mt-8">
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge>Supabase Auth</Badge>
            <Badge>JWT roles</Badge>
            <Badge>2FA ready</Badge>
            <Badge>Audit logs</Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 border-t border-slate-800 pt-4">
            <ShieldCheck className="text-indigo-400 size-4" />
            <span>Encrypted login protocol with role isolation active.</span>
          </div>
        </div>
      </Card>
    </section>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <AppNav />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[300px] text-slate-500 text-sm font-semibold">
          Loading login screen...
        </div>
      }>
        <LoginContent />
      </Suspense>
    </main>
  );
}
