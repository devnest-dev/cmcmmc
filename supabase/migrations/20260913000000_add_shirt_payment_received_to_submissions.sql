alter table public.submissions
  add column if not exists shirt_payment_received boolean not null default false;
