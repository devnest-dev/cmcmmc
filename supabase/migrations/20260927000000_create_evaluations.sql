-- Participant evaluation form responses. `submission_id` is set when the
-- form is opened through the participant's QR / check-in link; public
-- responses leave it null. Personal info is snapshotted on every row so
-- exports stay complete even if the linked submission is later deleted.
create table if not exists public.evaluations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  submission_id uuid references public.submissions(id) on delete set null,
  source text not null check (source in ('qr', 'public')),
  full_name text not null,
  archdiocese text not null default '',
  parish_name text not null default '',
  parish_address text not null default '',
  email text not null,
  consent boolean not null check (consent),
  certificate_requested boolean not null default false,
  -- { "q1": 1-4, ..., "q25": 1-4 } — keys match the printed form numbering.
  ratings jsonb not null,
  insights text not null,
  improvements text not null,
  topics text not null,
  volunteer_message text
);

create index if not exists evaluations_created_at_idx on public.evaluations (created_at desc);
create index if not exists evaluations_submission_id_idx on public.evaluations (submission_id);

-- Singleton settings row for the evaluation on/off toggle and hard cutoff.
create table if not exists public.evaluation_settings (
  id boolean primary key default true,
  evaluation_open boolean not null default false,
  closes_at timestamptz not null default '2026-10-17 23:59:59+08',
  updated_at timestamptz not null default timezone('utc', now()),
  constraint evaluation_settings_single_row check (id)
);

insert into public.evaluation_settings (id, evaluation_open)
values (true, false)
on conflict (id) do nothing;

drop trigger if exists evaluation_settings_set_updated_at on public.evaluation_settings;
create trigger evaluation_settings_set_updated_at
before update on public.evaluation_settings
for each row
execute function public.set_updated_at();
