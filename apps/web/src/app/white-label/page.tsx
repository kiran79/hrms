import { Field } from "@/components/app/field";
import { SaasSidebar } from "@/components/app/saas-sidebar";
import { Card } from "@/components/ui";
import { Globe2, Mail, MessageCircle, Palette } from "lucide-react";

export default function WhiteLabelPage() {
  return (
    <main className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-[260px_1fr]">
      <SaasSidebar active="White Label" />
      <section className="p-5 lg:p-8">
        <header className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Tenant branding</p>
          <h2 className="text-3xl font-bold">White-label SaaS settings</h2>
          <p className="mt-1 text-slate-600">Configure custom domain, logo, colors, SMTP, WhatsApp, and reseller branding per organization.</p>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <Card>
            <div className="mb-5 flex items-center gap-3">
              <Palette className="text-primary" />
              <h3 className="text-xl font-bold">Brand identity</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Brand name" defaultValue="Acme PeopleOps" />
              <Field label="Primary color" defaultValue="#087EA4" />
              <Field label="Logo URL" defaultValue="https://cdn.example.com/acme-logo.png" />
              <Field label="Support email" defaultValue="support@acmeindia.in" />
            </div>
          </Card>

          <Card>
            <div className="mb-5 flex items-center gap-3">
              <Globe2 className="text-primary" />
              <h3 className="text-xl font-bold">Custom domain</h3>
            </div>
            <Field label="Domain" defaultValue="hr.acmeindia.in" />
            <div className="mt-4 rounded-md bg-emerald-50 p-4 text-sm text-emerald-800">
              DNS verified. SSL certificate active. Tenant routing enabled.
            </div>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <Card>
            <div className="mb-5 flex items-center gap-3">
              <Mail className="text-primary" />
              <h3 className="text-xl font-bold">SMTP configuration</h3>
            </div>
            <div className="grid gap-4">
              <Field label="SMTP host" defaultValue="smtp.acmeindia.in" />
              <Field label="SMTP username" defaultValue="notifications@acmeindia.in" />
              <Field label="From name" defaultValue="Acme HRMS" />
            </div>
          </Card>

          <Card>
            <div className="mb-5 flex items-center gap-3">
              <MessageCircle className="text-primary" />
              <h3 className="text-xl font-bold">WhatsApp and SMS</h3>
            </div>
            <div className="grid gap-4">
              <Field label="WhatsApp provider" defaultValue="Gupshup / Interakt / Twilio" />
              <Field label="Sender ID" defaultValue="ACMEHR" />
              <Field label="Template namespace" defaultValue="payroll_leave_alerts" />
            </div>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white">Save white-label settings</button>
        </div>
      </section>
    </main>
  );
}
