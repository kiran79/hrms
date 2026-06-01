import { SaasSidebar } from "@/components/app/saas-sidebar";
import { Card } from "@/components/ui";
import { saasPlans } from "@/lib/data";
import { CreditCard, ReceiptText, Users } from "lucide-react";

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-[260px_1fr]">
      <SaasSidebar active="Tenant Billing" />
      <section className="p-5 lg:p-8">
        <header className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Organization account</p>
          <h2 className="text-3xl font-bold">Subscription and billing</h2>
          <p className="mt-1 text-slate-600">Customer-admin view for plan, employee count, invoices, GST billing, payment method, and usage.</p>
        </header>

        <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
          <Card>
            <div className="mb-4 flex items-center gap-3">
              <CreditCard className="text-primary" />
              <h3 className="text-xl font-bold">Current subscription</h3>
            </div>
            <div className="grid gap-3 text-sm">
              <Row label="Plan" value="Growth" />
              <Row label="Rate" value="INR 149 / employee / month" />
              <Row label="Billable employees" value="1,248" />
              <Row label="Monthly recurring" value="INR 1,85,952" />
              <Row label="Next invoice" value="01 Jun 2026" />
              <Row label="Payment method" value="Razorpay AutoPay" />
            </div>
            <button className="mt-5 w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-white">Update payment method</button>
          </Card>

          <Card>
            <h3 className="mb-4 text-xl font-bold">Plan comparison</h3>
            <div className="grid gap-4 lg:grid-cols-4">
              {saasPlans.map((plan) => (
                <div key={plan.name} className={plan.name === "Growth" ? "rounded-md border border-primary p-4 ring-2 ring-cyan-100" : "rounded-md border border-border p-4"}>
                  <p className="font-bold">{plan.name}</p>
                  <p className="mt-2 text-2xl font-bold">INR {plan.price}</p>
                  <p className="text-xs text-slate-500">per employee/month</p>
                  <ul className="mt-4 grid gap-2 text-sm text-slate-600">
                    {plan.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <Card>
            <div className="mb-4 flex items-center gap-3">
              <Users className="text-primary" />
              <h3 className="text-xl font-bold">Usage this cycle</h3>
            </div>
            <Row label="Active employees" value="1,248" />
            <Row label="Storage used" value="82 GB / 250 GB" />
            <Row label="AI credits" value="18,420 / 25,000" />
            <Row label="WhatsApp notifications" value="9,880 messages" />
          </Card>

          <Card>
            <div className="mb-4 flex items-center gap-3">
              <ReceiptText className="text-primary" />
              <h3 className="text-xl font-bold">Recent invoices</h3>
            </div>
            <Row label="INV-2026-05" value="Paid - INR 1,85,952" />
            <Row label="INV-2026-04" value="Paid - INR 1,81,482" />
            <Row label="INV-2026-03" value="Paid - INR 1,78,651" />
            <Row label="GSTIN" value="27ABCDE1234F1Z5" />
          </Card>
        </div>
      </section>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-3 text-sm">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
