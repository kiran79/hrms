"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppNav } from "@/components/app/app-nav";
import { Card } from "@/components/ui";

const industries = ["IT Services", "Manufacturing", "Hospital", "School or College", "Staffing Agency", "Consulting"];

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: "",
    adminName: "",
    adminEmail: "",
    mobile: "",
    employeeCount: "250",
    industry: "IT Services",
    city: "Mumbai",
    state: "Maharashtra"
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { companyName, adminName, adminEmail, mobile } = formData;

    if (!companyName || !adminName || !adminEmail || !mobile) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      // Save temporary registering info to localStorage
      localStorage.setItem("registering_company", JSON.stringify({
        ...formData,
        employeeCount: parseInt(formData.employeeCount, 10) || 10
      }));
      
      // Navigate to Billing selection
      router.push("/billing");
    } catch (err) {
      setError("Failed to register. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <AppNav />
      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Step 1 of 2</p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Register your organization</h2>
          <p className="mt-2 text-sm text-slate-600">Create a tenant, configure admin access, and continue to plan/payment setup.</p>
        </div>

        <Card className="p-7 border-slate-200 shadow-sm">
          {error && (
            <div className="mb-5 rounded bg-rose-50 border border-rose-100 p-3 text-xs text-rose-800 font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Company Name *
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Acme India Pvt Ltd"
                className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-indigo-500"
                required
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Admin Full Name *
              <input
                type="text"
                name="adminName"
                value={formData.adminName}
                onChange={handleChange}
                placeholder="Priya Nair"
                className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-indigo-500"
                required
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Admin Email *
              <input
                type="email"
                name="adminEmail"
                value={formData.adminEmail}
                onChange={handleChange}
                placeholder="admin@company.com"
                className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-indigo-500"
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
                placeholder="+91 98765 43210"
                className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-indigo-500"
                required
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Employee Count
              <input
                type="number"
                name="employeeCount"
                value={formData.employeeCount}
                onChange={handleChange}
                className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-indigo-500"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Industry
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-indigo-500"
              >
                {industries.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              City
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Mumbai"
                className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-indigo-500"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              State
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Maharashtra"
                className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-indigo-500"
              />
            </label>

            <div className="mt-4 md:col-span-2 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500">Next: choose plan, payment mode, and activate the trial workspace.</p>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 hover:bg-indigo-700 transition px-5 py-3 text-sm font-bold text-white shadow-sm"
              >
                Continue to Payment Plan
              </button>
            </div>
          </form>
        </Card>
      </section>
    </main>
  );
}
