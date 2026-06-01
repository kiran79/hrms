"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppNav } from "@/components/app/app-nav";
import { Card, Badge } from "@/components/ui";
import { LockKeyhole, ShieldCheck, UserPlus, ArrowLeft } from "lucide-react";

export default function SaaSAdminSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    designation: "Platform Admin",
    password: "",
    confirmPassword: "",
  });
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { fullName, email, mobile, password, confirmPassword } = formData;
    
    if (!fullName || !email || !mobile || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      // Fetch existing admins from localStorage
      const existingAdminsStr = localStorage.getItem("saas_admins");
      const existingAdmins = existingAdminsStr ? JSON.parse(existingAdminsStr) : [];
      
      // Check if admin email already exists
      const emailExists = existingAdmins.some((admin: any) => admin.email.toLowerCase() === email.toLowerCase()) || 
                          email.toLowerCase() === "superadmin@bharathrms.local";
                          
      if (emailExists) {
        setError("An administrator account with this email already exists.");
        return;
      }

      // Add new admin
      const newAdmin = {
        fullName,
        email: email.toLowerCase(),
        mobile,
        designation: formData.designation,
        password, // In a real production app this would be hashed, but this is a frontend-centric mock
        createdAt: new Date().toISOString()
      };

      existingAdmins.push(newAdmin);
      localStorage.setItem("saas_admins", JSON.stringify(existingAdmins));
      
      setSuccess(true);
      setTimeout(() => {
        // Redirect to login page and pre-fill email
        router.push(`/login?tab=super-admin&newAdminEmail=${encodeURIComponent(email)}&registered=true`);
      }, 1500);

    } catch (e) {
      setError("Failed to save registration data. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <AppNav />
      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-7 border-slate-200">
          <div className="mb-4">
            <Link href="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-primary transition">
              <ArrowLeft className="size-3" /> Back to Login
            </Link>
          </div>
          <div className="mb-6 grid size-12 place-items-center rounded-md bg-indigo-50 text-indigo-600">
            <UserPlus className="size-6" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Register SaaS Administrator</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Create an independent Super Admin account to manage tenants, view MRR, configure white-label options, and oversee compliance rules.
          </p>

          {error && (
            <div className="mt-5 rounded-md bg-rose-50 border border-rose-200 p-3 text-sm text-rose-800 font-semibold animate-shake">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-5 rounded-md bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-800 font-semibold">
              SaaS Admin registered successfully! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Full Name *
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Anand Sharma"
                  className="h-11 rounded-md border border-border bg-white px-3 text-sm font-normal outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </label>
              
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Work Email *
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@bharathrms.com"
                  className="h-11 rounded-md border border-border bg-white px-3 text-sm font-normal outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Mobile Number *
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="+91 99999 88888"
                  className="h-11 rounded-md border border-border bg-white px-3 text-sm font-normal outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Designation / Role
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Platform Director"
                  className="h-11 rounded-md border border-border bg-white px-3 text-sm font-normal outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Admin Password *
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className="h-11 rounded-md border border-border bg-white px-3 text-sm font-normal outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Confirm Password *
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  className="h-11 rounded-md border border-border bg-white px-3 text-sm font-normal outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </label>
            </div>

            <label className="flex items-start gap-2 mt-2 text-xs text-slate-600">
              <input type="checkbox" className="size-4 mt-0.5 rounded border-border" required />
              <span>I understand that this user profile will have full administrative access to create companies, change subscription states, and manage system-wide settings.</span>
            </label>

            <button
              type="submit"
              disabled={success}
              className="mt-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition px-4 py-3 text-center text-sm font-semibold text-white shadow-sm disabled:opacity-50"
            >
              Register & Request Login
            </button>
          </form>
        </Card>

        <Card className="bg-slate-900 p-7 text-white flex flex-col justify-between border-none shadow-xl">
          <div>
            <LockKeyhole className="mb-5 text-indigo-400 size-10" />
            <h3 className="text-2xl font-bold text-slate-50">SaaS Owner Console</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              As a platform administrator, your workspace provides granular control over the entire multi-tenant system:
            </p>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">✓</span> Create, suspend, and configure company directories.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">✓</span> Set up subscription pricing models and review recurring billing events.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">✓</span> Update baseline Indian compliance configurations (PF, ESI, state Professional Taxes).
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">✓</span> Setup custom domains, branding logos, white-labeling parameters, SMTP, and SMS templates.
              </li>
            </ul>
          </div>
          <div className="mt-8">
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge>Supabase Auth</Badge>
              <Badge>Platform Admin</Badge>
              <Badge>SaaS Owner</Badge>
              <Badge>Secure Root</Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 border-t border-slate-800 pt-4">
              <ShieldCheck className="text-indigo-400 size-4" />
              <span>Full compliance & audit logging enabled for this session.</span>
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
}
