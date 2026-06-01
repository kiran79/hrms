"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AppNav } from "@/components/app/app-nav";
import { Card } from "@/components/ui";
import { CheckCircle2, CreditCard, ArrowLeft } from "lucide-react";
import { saasPlans } from "@/lib/data";

export default function BillingPage() {
  const router = useRouter();
  
  // Registration data state
  const [companyName, setCompanyName] = useState("Acme India Pvt Ltd");
  const [employeeCount, setEmployeeCount] = useState(250);
  const [adminEmail, setAdminEmail] = useState("admin@company.com");
  const [adminName, setAdminName] = useState("Priya Nair");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [address, setAddress] = useState("Mumbai, Maharashtra");

  // Selected Plan Tier
  const [selectedPlanName, setSelectedPlanName] = useState("Growth");
  
  // Plans list state
  const [plans, setPlans] = useState<any[]>(saasPlans);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Read registration data
      const regDataStr = localStorage.getItem("registering_company");
      if (regDataStr) {
        const regData = JSON.parse(regDataStr);
        setCompanyName(regData.companyName || "Acme India Pvt Ltd");
        setEmployeeCount(parseInt(regData.employeeCount, 10) || 250);
        setAdminEmail(regData.adminEmail || "admin@company.com");
        setAdminName(regData.adminName || "Priya Nair");
        setPhone(regData.mobile || "+91 98765 43210");
        setAddress(`${regData.city || "Mumbai"}, ${regData.state || "Maharashtra"}`);
      }

      // 2. Read plan pricing
      const storedPlans = localStorage.getItem("saas_plans");
      if (storedPlans) {
        setPlans(JSON.parse(storedPlans));
      }
    }
  }, []);

  const selectedPlan = plans.find((p) => p.name === selectedPlanName) || plans[1] || saasPlans[1];
  const unitPrice = selectedPlan.price;
  const monthlyAmount = employeeCount * unitPrice;
  const gstAmount = Math.round(monthlyAmount * 0.18);
  const totalAmount = monthlyAmount + gstAmount;

  // Handle Pay Action (creating the company workspace)
  const handlePaymentSubmit = () => {
    try {
      const workspacePrefix = companyName.toLowerCase().replace(/[^a-z0-9]/g, "");
      const domainName = `hr.${workspacePrefix || "workspace"}.in`;

      const newCompanyObj = {
        name: companyName,
        plan: selectedPlanName,
        employees: employeeCount,
        mrr: `INR ${monthlyAmount.toLocaleString("en-IN")}`,
        status: "Active",
        domain: domainName,
        email: adminEmail,
        phone: phone,
        address: address,
        adminEmail: adminEmail
      };

      // 1. Save company to global database
      const companiesStr = localStorage.getItem("companies");
      const companiesList = companiesStr ? JSON.parse(companiesStr) : [];
      
      // Prevent duplicates
      const filteredList = companiesList.filter((c: any) => c.domain.toLowerCase() !== domainName.toLowerCase());
      filteredList.push(newCompanyObj);
      localStorage.setItem("companies", JSON.stringify(filteredList));

      // 2. Add billing invoice record
      const storedTxStr = localStorage.getItem("transactions");
      const txList = storedTxStr ? JSON.parse(storedTxStr) : [];
      const invoiceNo = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
      txList.unshift({
        invoiceNo,
        companyName,
        plan: selectedPlanName,
        amount: `INR ${monthlyAmount.toLocaleString("en-IN")}`,
        date: new Date().toISOString().split("T")[0],
        status: "Paid",
        method: "Razorpay Sandbox"
      });
      localStorage.setItem("transactions", JSON.stringify(txList));

      // 3. Clear temporary data
      localStorage.removeItem("registering_company");

      // 4. Start active company session
      localStorage.setItem("session_user_type", "company");
      localStorage.setItem("session_company", JSON.stringify(newCompanyObj));
      localStorage.setItem("session_company_email", adminEmail);

      alert(`Payment Success! Workspace generated for ${companyName} at ${domainName}. Redirecting to dashboard...`);
      
      router.push("/dashboard");
    } catch (e) {
      alert("Failed to activate workspace. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <AppNav />
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-4">
          <Link href="/register" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-primary transition">
            <ArrowLeft className="size-3" /> Back to Workspace Register
          </Link>
        </div>
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Step 2 of 2</p>
          <h2 className="mt-1 text-3xl font-extrabold text-slate-900">Choose Plan & Activate Workspace</h2>
          <p className="mt-1.5 text-sm text-slate-500">
            Selected Organization: <span className="font-semibold text-slate-800">{companyName}</span> ({employeeCount} employees)
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-5 lg:grid-cols-4">
          {plans.map((p) => (
            <Card
              key={p.name}
              onClick={() => setSelectedPlanName(p.name)}
              className={`cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between p-6 ${
                selectedPlanName === p.name
                  ? "border-indigo-600 ring-2 ring-indigo-50 border-t-8"
                  : "border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-950">{p.name}</h3>
                  {selectedPlanName === p.name && (
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 rounded-full px-2 py-0.5">Selected</span>
                  )}
                </div>
                <p className="mt-2 text-3xl font-extrabold text-slate-900">
                  INR {p.price}
                </p>
                <p className="text-xs text-slate-400">per employee/month</p>
                <p className="mt-3 min-h-12 text-xs leading-5 text-slate-500">{p.audience}</p>
                
                <ul className="mt-4 gap-2 text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-3">
                  {p.features.map((f: string) => (
                    <li key={f} className="flex gap-2 items-center">
                      <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                className={`mt-6 w-full rounded py-2 text-xs font-bold transition ${
                  selectedPlanName === p.name
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {selectedPlanName === p.name ? "Plan Selected" : "Choose Plan"}
              </button>
            </Card>
          ))}
        </div>

        {/* Payment Summary */}
        <Card className="mt-8 grid gap-6 p-7 border-slate-200 shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
              <CreditCard className="text-indigo-600 size-5" />
              <h3 className="text-base font-bold text-slate-900">Workspace Invoice Breakdown</h3>
            </div>
            <div className="grid gap-2.5 text-sm">
              <Row label="Billing Plan Tier" value={selectedPlanName} />
              <Row label="Active Employees Count" value={`${employeeCount} Users`} />
              <Row label="Statutory Licensing Rate" value={`INR ${unitPrice} / employee`} />
              <Row label="Monthly Licensing Fee" value={`INR ${monthlyAmount.toLocaleString("en-IN")}`} />
              <Row label="Indian CGST + SGST (18%)" value={`INR ${gstAmount.toLocaleString("en-IN")}`} />
              <Row label="Total Monthly Billing" value={`INR ${totalAmount.toLocaleString("en-IN")}`} strong />
            </div>
          </div>
          <div className="rounded-lg bg-slate-950 p-6 text-white flex flex-col justify-between">
            <div>
              <h4 className="text-base font-bold">Demo Subscription sandbox</h4>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                You are executing a demo activation. Clicking below authorizes a simulated payment, provisions your workspace database variables, launches tenant configuration schemas, and initiates the root company administrator.
              </p>
            </div>
            <button
              onClick={handlePaymentSubmit}
              className="mt-6 w-full block rounded bg-white hover:bg-slate-100 transition px-4 py-3 text-center text-sm font-bold text-slate-950"
            >
              Pay & Initiate Workspace Dashboard
            </button>
          </div>
        </Card>
      </section>
    </main>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-2">
      <span className="text-slate-500 font-medium">{label}</span>
      <span className={strong ? "text-base font-extrabold text-slate-900" : "font-bold text-slate-800"}>{value}</span>
    </div>
  );
}
