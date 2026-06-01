# Bharat HRMS Payroll SaaS Architecture

## Product Scope

This repository is structured as a production foundation for a multi-tenant HRMS and payroll SaaS for India. It covers:

- Employee lifecycle, onboarding, KYC, document storage, and employee self-service.
- Recruitment, requisitions, career portal, ATS, interview scheduling, offers, and AI screening.
- Attendance, shifts, overtime, late marks, geo-fenced/mobile/QR/biometric events.
- Leave policies, balances, approvals, encashment, holidays, and loss-of-pay integration.
- Payroll processing, payslips, bank files, arrears, bonuses, reimbursements, payroll locking, and audit trails.
- Indian statutory calculations for EPF, EPS, ESIC, PT, LWF, TDS, Form 16, Form 24Q, gratuity, bonus, shops and establishment, minimum wage, and overtime workflows.
- White-label tenant branding, custom domain, SMTP, WhatsApp, reseller billing, and tenant-level configuration.

## Workspace

- `apps/web`: Next.js 15, React 19, TypeScript, Tailwind UI shell.
- `apps/api`: NestJS API modules and service boundaries.
- `packages/domain`: Shared TypeScript payroll and HR domain logic.
- `infra/supabase`: PostgreSQL/Supabase schema with tenant-aware tables and RLS policies.

## Multi-Tenancy

Every business table carries `tenant_id`. API requests must resolve tenant context from Supabase Auth/JWT claims and set the PostgreSQL setting `app.current_tenant_id` before querying RLS-protected tables.

Recommended production isolation model:

1. Shared database, strict tenant column, RLS enabled for all tenant-owned tables.
2. Tenant-aware storage buckets or tenant-prefixed Supabase Storage paths.
3. Tenant-scoped background jobs for payroll, compliance exports, and notifications.
4. Separate encryption keys or envelope-encrypted sensitive KYC fields for enterprise tenants.

## Compliance Strategy

Statutory rules must be versioned and effective dated. Payroll runs store `statutory_rule_version` so old payslips and filings remain reproducible after a government rule change.

The current code includes a sample rules engine for:

- EPF employee and employer contribution.
- EPS split from employer contribution.
- ESIC employee and employer contribution.
- State-wise Professional Tax examples.
- Labour Welfare Fund placeholders.
- TDS estimate for old and new regimes.

Before live payroll filing, each state rule pack must be verified by payroll/legal specialists and stored in `statutory_rule_versions`.

## Security Controls

- Supabase Auth for identity.
- JWT claims for tenant and role membership.
- Role metadata through `@Roles(...)`.
- PostgreSQL RLS for tenant isolation.
- Audit logs for sensitive changes.
- KYC fields stored encrypted, with only masked values surfaced by default.
- IP restrictions and MFA should be enforced per tenant policy.

## AI Layer

AI providers should be wrapped behind one application service with tenant-level provider settings:

- OpenAI for structured HR assistant responses, document generation, and policy drafting.
- Gemini/Claude as configurable alternatives.
- Retrieval should be tenant-scoped and policy-aware.
- Salary and personal data should be redacted unless the user has explicit role permission.

## Deployment

The included `docker-compose.yml` runs Postgres, the NestJS API, and the Next.js web app for local development. Production deployments can split these into AWS ECS/Fargate, DigitalOcean Apps, or VPS containers behind a reverse proxy.
