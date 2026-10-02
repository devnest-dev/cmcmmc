-- Singleton settings row for the manual voting on/off toggle. `id` is
-- constrained to always be `true` so there can only ever be one row.
create table if not exists public.competition_settings (
  id boolean primary key default true,
  voting_open boolean not null default false,
  updated_at timestamptz not null default timezone('utc', now()),
  constraint competition_settings_single_row check (id)
);

insert into public.competition_settings (id, voting_open)
values (true, false)
on conflict (id) do nothing;

drop trigger if exists competition_settings_set_updated_at on public.competition_settings;
create trigger competition_settings_set_updated_at
before update on public.competition_settings
for each row
execute function public.set_updated_at();
