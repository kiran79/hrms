import Link from "next/link";
import { Building2 } from "lucide-react";

export function AppNav() {
  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-md bg-primary text-white">
            <Building2 size={22} />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">Bharat HRMS Payroll</p>
            <h1 className="text-xl font-bold">Enterprise HRMS SaaS</h1>
          </div>
        </Link>
        <nav className="flex items-center gap-2 text-sm font-semibold">
          <Link href="/login" className="rounded-md px-3 py-2 text-slate-700 hover:bg-muted">
            Login
          </Link>
          <Link href="/register" className="rounded-md bg-primary px-4 py-2 text-white">
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
}
