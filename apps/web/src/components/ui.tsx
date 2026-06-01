import { clsx } from "clsx";
import type React from "react";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <section className={clsx("rounded-lg border border-border bg-white p-5 shadow-sm", className)} {...props} />;
}

export function Badge({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={clsx("rounded-full bg-muted px-3 py-1 text-xs font-semibold text-slate-700", className)} {...props}>{children}</span>;
}

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx("rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95", className)}
      {...props}
    />
  );
}
