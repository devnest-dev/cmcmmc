alter table public.submissions
  add column if not exists day_one_attendance timestamptz,
  add column if not exists day_two_attendance timestamptz,
  add column if not exists day_one_breakout_attendance timestamptz,
  add column if not exists day_two_breakout_attendance timestamptz,
  add column if not exists kit_received boolean not null default false;
