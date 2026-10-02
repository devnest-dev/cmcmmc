create extension if not exists pgcrypto;

do $$
begin
  create type public.competition_entry_status as enum ('visible', 'hidden');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.competition_entries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  participant_name text not null,
  description text not null default '',
  youtube_url text not null,
  youtube_video_id text not null,
  status public.competition_entry_status not null default 'visible',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists competition_entries_status_idx on public.competition_entries (status);
create index if not exists competition_entries_created_at_idx on public.competition_entries (created_at desc);
create unique index if not exists competition_entries_youtube_video_id_idx
  on public.competition_entries (youtube_video_id)
  where status = 'visible';

-- Reuses public.set_updated_at(), already defined in
-- 20260531000000_create_submissions_table.sql.
drop trigger if exists competition_entries_set_updated_at on public.competition_entries;
create trigger competition_entries_set_updated_at
before update on public.competition_entries
for each row
execute function public.set_updated_at();

-- Permanent vote record: one row per person, ever, for the whole competition.
-- voter_email_hash is a salted HMAC of the normalized email (see
-- VOTE_EMAIL_HASH_SECRET) -- plaintext emails are never stored here. The
-- unique index is on voter_email_hash ALONE (not entry_id+hash), which is
-- what enforces "one vote total," not "one vote per entry."
create table if not exists public.competition_votes (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.competition_entries (id) on delete restrict,
  voter_email_hash text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists competition_votes_voter_email_hash_idx
  on public.competition_votes (voter_email_hash);
create index if not exists competition_votes_entry_id_idx on public.competition_votes (entry_id);

-- Short-lived OTP / vote-request state. Plaintext email is acceptable here
-- since rows are meant to be short-lived. Known gap: there is no
-- cron/cleanup job in this codebase today, so expired/abandoned rows will
-- accumulate until a cleanup mechanism is added later.
do $$
begin
  create type public.vote_request_status as enum ('pending', 'confirmed', 'expired', 'cancelled');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.competition_vote_requests (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.competition_entries (id) on delete cascade,
  email text not null,
  otp_code_hash text not null,
  status public.vote_request_status not null default 'pending',
  attempt_count integer not null default 0,
  expires_at timestamptz not null,
  created_at timestamptz not null default timezone('utc', now()),
  confirmed_at timestamptz
);

create index if not exists competition_vote_requests_email_idx on public.competition_vote_requests (email);
create index if not exists competition_vote_requests_status_idx on public.competition_vote_requests (status);
create index if not exists competition_vote_requests_created_at_idx
  on public.competition_vote_requests (created_at desc);
