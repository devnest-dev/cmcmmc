-- Admins can add entries manually from the dashboard. These rows are tagged
-- with source = 'admin' and, like walk-ins, carry no ID or payment proof
-- uploads.

alter table public.submissions
  drop constraint if exists submissions_source_check;

alter table public.submissions
  add constraint submissions_source_check
    check (source in ('online', 'walk_in', 'admin'));
