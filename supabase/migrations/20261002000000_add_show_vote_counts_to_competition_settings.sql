-- Global toggle for whether vote counts (and the vote-based ranking) are
-- shown to guests on the public voting page. Defaults to true to preserve
-- existing behavior.
alter table public.competition_settings
  add column if not exists show_vote_counts boolean not null default true;
