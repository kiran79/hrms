# Bharat HRMS Payroll SaaS

Production-shaped starter for a full Indian HRMS and payroll platform using Next.js 15, React 19, TypeScript, Tailwind CSS, NestJS, PostgreSQL/Supabase, Supabase Auth, and AI-provider-ready service boundaries.

## What Is Included

- Multi-tenant monorepo with web, API, and shared domain package.
- Role-based HRMS dashboard covering employees, payroll, attendance, leave, recruitment, compliance, documents, assets, performance, LMS, expenses, travel, workflows, AI, ESS, and reports.
- Shared Indian payroll calculation engine with EPF, EPS, ESIC, Professional Tax examples, LWF placeholders, and TDS estimate.
- NestJS API modules for employees, payroll, attendance, leave, recruitment, AI, auth, and tenant context.
- Supabase/PostgreSQL schema with tenant IDs, payroll auditability, statutory rule versions, and starter RLS policies.
- Docker Compose for local Postgres, API, and web.

## Run Locally

```bash
npm install
npm run dev
```

API:

```bash
npm run dev:api
```

Docker:

```bash
cp .env.example .env
docker compose up
```

## Important Compliance Note

Indian payroll rules change and vary by state. This project keeps statutory rules versioned and configurable. The sample engine is a development baseline, not a substitute for final payroll/legal validation before production filing.

## Key Paths

- Web app: `apps/web/src/app/page.tsx`
- API app: `apps/api/src/app.module.ts`
- Payroll engine: `packages/domain/src/index.ts`
- Database schema: `infra/supabase/schema.sql`
- Architecture notes: `docs/ARCHITECTURE.md`
