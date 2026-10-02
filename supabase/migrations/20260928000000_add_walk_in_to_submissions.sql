-- Walk-in (on-site kiosk) registrations share the submissions table with
-- online registrations. Walk-ins pay cash at the cashier and do not upload an
-- ID or payment proof, and the kiosk does not collect shirt size or address.

alter type public.submission_payment_mode add value if not exists 'Cash';

alter table public.submissions
  add column if not exists source text not null default 'online'
    check (source in ('online', 'walk_in'));

create index if not exists submissions_source_idx on public.submissions (source);

alter table public.submissions
  alter column id_upload_name drop not null,
  alter column id_upload_path drop not null,
  alter column payment_proof_name drop not null,
  alter column payment_proof_path drop not null,
  alter column shirt_size drop not null,
  alter column complete_address drop not null;
