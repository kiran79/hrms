create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

create type user_role as enum (
  'SUPER_ADMIN',
  'ORG_ADMIN',
  'HR_MANAGER',
  'PAYROLL_MANAGER',
  'DEPARTMENT_HEAD',
  'REPORTING_MANAGER',
  'EMPLOYEE',
  'RECRUITER',
  'INTERVIEW_PANEL',
  'FINANCE_MANAGER',
  'AUDITOR'
);

create type employment_type as enum (
  'FULL_TIME',
  'PART_TIME',
  'CONTRACT',
  'CONSULTANT',
  'INTERN',
  'STAFFING_DEPLOYMENT'
);

create table tenants (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  plan text not null check (plan in ('STARTER', 'GROWTH', 'ENTERPRISE', 'WHITE_LABEL_PARTNER')),
  custom_domain text unique,
  logo_url text,
  primary_color text not null default '#087EA4',
  smtp_config jsonb not null default '{}',
  whatsapp_config jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table tenant_users (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  auth_user_id uuid not null,
  roles user_role[] not null default array['EMPLOYEE']::user_role[],
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (tenant_id, auth_user_id)
);

create table employees (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  employee_code text not null,
  full_name text not null,
  photo_url text,
  mobile text not null,
  email text not null,
  pan text,
  aadhaar_ciphertext bytea,
  aadhaar_last4 text,
  uan text,
  esic_number text,
  passport_number text,
  driving_license text,
  blood_group text,
  emergency_contacts jsonb not null default '[]',
  department text not null,
  designation text not null,
  branch text not null,
  location text not null,
  reporting_manager_id uuid references employees(id),
  date_of_joining date not null,
  employment_type employment_type not null,
  probation_days integer not null default 90,
  created_at timestamptz not null default now(),
  unique (tenant_id, employee_code)
);

create table employee_documents (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  employee_id uuid not null references employees(id) on delete cascade,
  document_type text not null,
  storage_path text not null,
  verification_status text not null default 'PENDING',
  uploaded_at timestamptz not null default now()
);

create table attendance_events (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  employee_id uuid not null references employees(id) on delete cascade,
  event_type text not null check (event_type in ('CHECK_IN', 'CHECK_OUT')),
  mode text not null check (mode in ('MANUAL', 'BIOMETRIC', 'GEO_FENCING', 'MOBILE', 'QR')),
  occurred_at timestamptz not null,
  latitude numeric,
  longitude numeric,
  device_id text,
  created_at timestamptz not null default now()
);

create table leave_requests (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  employee_id uuid not null references employees(id) on delete cascade,
  leave_type text not null,
  from_date date not null,
  to_date date not null,
  days numeric not null,
  status text not null default 'PENDING',
  approval_chain jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create table salary_structures (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  employee_id uuid not null references employees(id) on delete cascade,
  effective_from date not null,
  components jsonb not null,
  tax_regime text not null default 'NEW',
  state text not null,
  created_at timestamptz not null default now()
);

create table payroll_runs (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  payroll_month date not null,
  status text not null default 'DRAFT',
  statutory_rule_version text not null,
  locked_at timestamptz,
  created_by uuid not null,
  created_at timestamptz not null default now(),
  unique (tenant_id, payroll_month)
);

create table payroll_items (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  payroll_run_id uuid not null references payroll_runs(id) on delete cascade,
  employee_id uuid not null references employees(id),
  earnings jsonb not null,
  deductions jsonb not null,
  employer_contributions jsonb not null,
  gross_pay numeric not null,
  net_pay numeric not null,
  ctc_cost numeric not null,
  created_at timestamptz not null default now()
);

create table statutory_rule_versions (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,
  country text not null default 'IN',
  effective_from date not null,
  epf jsonb not null,
  esic jsonb not null,
  professional_tax jsonb not null,
  labour_welfare_fund jsonb not null,
  tds jsonb not null,
  source_notes text not null,
  created_at timestamptz not null default now()
);

create table job_requisitions (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  department text not null,
  title text not null,
  vacancies integer not null,
  budget_status text not null default 'PENDING',
  approval_status text not null default 'PENDING',
  created_at timestamptz not null default now()
);

create table candidates (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  job_requisition_id uuid references job_requisitions(id),
  full_name text not null,
  email text not null,
  mobile text,
  resume_storage_path text,
  ai_score numeric,
  stage text not null default 'APPLIED',
  created_at timestamptz not null default now()
);

create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references tenants(id) on delete set null,
  actor_user_id uuid,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  ip_address inet,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table tenants enable row level security;
alter table tenant_users enable row level security;
alter table employees enable row level security;
alter table employee_documents enable row level security;
alter table attendance_events enable row level security;
alter table leave_requests enable row level security;
alter table salary_structures enable row level security;
alter table payroll_runs enable row level security;
alter table payroll_items enable row level security;
alter table job_requisitions enable row level security;
alter table candidates enable row level security;
alter table audit_logs enable row level security;

create policy tenant_isolation_employees on employees
  using (tenant_id::text = current_setting('app.current_tenant_id', true));

create policy tenant_isolation_payroll_runs on payroll_runs
  using (tenant_id::text = current_setting('app.current_tenant_id', true));

create policy tenant_isolation_payroll_items on payroll_items
  using (tenant_id::text = current_setting('app.current_tenant_id', true));

create policy tenant_isolation_documents on employee_documents
  using (tenant_id::text = current_setting('app.current_tenant_id', true));

create policy tenant_isolation_attendance on attendance_events
  using (tenant_id::text = current_setting('app.current_tenant_id', true));

create policy tenant_isolation_leave on leave_requests
  using (tenant_id::text = current_setting('app.current_tenant_id', true));
