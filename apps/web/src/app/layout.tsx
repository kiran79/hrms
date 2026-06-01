import type { Metadata } from "next";
import type React from "react";
import "./globals.css";
import { ThemeInjector } from "@/components/theme-injector";

export const metadata: Metadata = {
  title: "Bharat HRMS Payroll",
  description: "Enterprise multi-tenant HRMS and payroll SaaS for India"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ThemeInjector />
        {children}
      </body>
    </html>
  );
}
