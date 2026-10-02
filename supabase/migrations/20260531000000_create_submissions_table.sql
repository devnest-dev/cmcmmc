create extension if not exists pgcrypto;

do $$
begin
  create type public.submission_status as enum ('Pending', 'Verified', 'Needs review');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.submission_affiliation_type as enum ('parish', 'school', 'neither');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.submission_accommodation as enum ('avail', 'self');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.submission_payment_mode as enum ('GCash', 'BDO');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  submitted_at timestamptz not null default timezone('utc', now()),
  status public.submission_status not null default 'Pending',
  affiliation_type public.submission_affiliation_type not null,
  title text not null,
  first_name text not null,
  middle_name text not null default '',
  surname text not null,
  congregation text not null default '',
  email text not null,
  mobile text not null,
  complete_address text not null,
  shirt_size text not null,
  organization_name text not null default '',
  archdiocese text not null default '',
  parish_name text not null default '',
  parish_address text not null default '',
  role_in_ministry text not null default '',
  role_in_ministry_other text not null default '',
  province text not null default '',
  school_name text not null default '',
  school_address text not null default '',
  designation text not null default '',
  designation_other text not null default '',
  company_organization text not null default '',
  company_address text not null default '',
  position_designation text not null default '',
  day1_session text not null,
  day2_session text not null,
  accommodation public.submission_accommodation not null,
  payment_mode public.submission_payment_mode not null,
  id_upload_name text not null,
  id_upload_path text not null,
  payment_proof_name text not null,
  payment_proof_path text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists submissions_submitted_at_idx on public.submissions (submitted_at desc);
create index if not exists submissions_affiliation_type_idx on public.submissions (affiliation_type);
create index if not exists submissions_status_idx on public.submissions (status);
create index if not exists submissions_payment_mode_idx on public.submissions (payment_mode);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists submissions_set_updated_at on public.submissions;

create trigger submissions_set_updated_at
before update on public.submissions
for each row
execute function public.set_updated_at();