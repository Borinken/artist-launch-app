-- Vocabulario de estado de canciones (alineado al formulario de entrega)
alter table tracks drop constraint if exists tracks_status_check;
update tracks set status = 'unreleased' where status = 'draft';
update tracks set status = 'mastered' where status = 'in_review';
update tracks set status = 'published' where status in ('distributed', 'live');
alter table tracks alter column status set default 'unreleased';
alter table tracks add constraint tracks_status_check check (status in (
  'unreleased', 'recorded', 'mixed', 'mastered', 'published'
));

-- Monetización: ledger manual por fuente de ingreso
create table if not exists royalty_entries (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid references artists(id) on delete cascade,
  source text check (source in (
    'composition_pro', 'master_distribution', 'youtube_content_id', 'shows', 'merch', 'sync'
  )),
  amount_cents int not null default 0,
  currency text default 'usd',
  period_month date not null,
  notes text,
  created_at timestamptz default now()
);
alter table royalty_entries enable row level security;

-- Redes sociales: estado de conexión/reclamo por plataforma
create table if not exists social_accounts (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid references artists(id) on delete cascade,
  platform text check (platform in ('instagram', 'tiktok', 'youtube', 'spotify', 'apple_music')),
  handle text,
  status text default 'pending' check (status in ('connected', 'pending')),
  followers_count int,
  monthly_listeners int,
  profile_url text,
  updated_at timestamptz default now(),
  unique (artist_id, platform)
);
alter table social_accounts enable row level security;
