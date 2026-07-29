-- ARTIST LAUNCH OS — Esquema de base de datos (Supabase / Postgres)
-- Ejecutar en: Supabase Dashboard > SQL Editor > New query

-- Extensión para UUIDs
create extension if not exists "pgcrypto";

-- =========================================================
-- 1. ARTISTAS (clientes)
-- =========================================================
create table artists (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete set null,
  legal_name text not null,
  artist_name text,
  email text not null unique,
  phone text,
  country text,                -- España, Puerto Rico, etc.
  tax_id text,                 -- NIF / SSN / RFC
  legal_entity_name text,
  has_w9 boolean default false,
  has_w8ben boolean default false,
  manager_name text,
  label_name text,
  plan text default 'start' check (plan in ('start','pro','studio')),
  career_progress_pct int default 0,
  created_at timestamptz default now()
);

-- =========================================================
-- 2. SUSCRIPCIONES Y PAGOS (Stripe)
-- =========================================================
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid references artists(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  plan text check (plan in ('start','pro','studio')),
  status text default 'active' check (status in ('active','past_due','canceled','trialing')),
  current_period_end timestamptz,
  created_at timestamptz default now()
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid references artists(id) on delete cascade,
  stripe_payment_intent_id text unique,
  amount_cents int not null,
  currency text default 'usd',
  status text,                 -- succeeded, failed, refunded
  description text,            -- 'Suscripción Pro', 'Registro por canción', etc.
  created_at timestamptz default now()
);

-- =========================================================
-- 3. OBRAS / TRACKS
-- =========================================================
create table tracks (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid references artists(id) on delete cascade,
  title text not null,
  release_type text check (release_type in ('single','ep','album')),
  isrc text,
  upc text,
  language text,
  is_explicit boolean default false,
  contains_samples boolean default false,
  is_cover boolean default false,
  release_date date,
  status text default 'draft' check (status in ('draft','in_review','distributed','live')),
  created_at timestamptz default now()
);

-- =========================================================
-- 4. SPLIT SHEETS
-- =========================================================
create table split_sheets (
  id uuid primary key default gen_random_uuid(),
  track_id uuid references tracks(id) on delete cascade,
  status text default 'pending' check (status in ('pending','signed','disputed')),
  created_at timestamptz default now()
);

create table split_sheet_parties (
  id uuid primary key default gen_random_uuid(),
  split_sheet_id uuid references split_sheets(id) on delete cascade,
  full_name text not null,
  role text,                   -- Compositor, Productor, Artista
  split_pct numeric(5,2) not null,
  pro_affiliation text,        -- SGAE, ASCAP, BMI, SESAC
  ipi_number text,
  signed_at timestamptz
);

-- =========================================================
-- 5. CONTRATOS GENERALES (producer agreement, management, NDA, etc.)
-- =========================================================
create table contracts (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid references artists(id) on delete cascade,
  track_id uuid references tracks(id) on delete set null,
  contract_type text check (contract_type in (
    'producer_agreement','management_agreement','publishing_agreement',
    'beat_license','nda','photo_release','video_release','work_for_hire'
  )),
  file_url text,               -- referencia a Supabase Storage
  status text default 'draft' check (status in ('draft','sent','signed')),
  created_at timestamptz default now()
);

-- =========================================================
-- 6. REGISTROS (copyright, PRO, MLC, distribución, publishing)
-- =========================================================
create table registrations (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid references artists(id) on delete cascade,
  track_id uuid references tracks(id) on delete set null,
  registration_type text check (registration_type in (
    'pro_affiliation','copyright','the_mlc','distribution',
    'publishing_admin','soundexchange','spotify_verified','apple_verified'
  )),
  provider text,                -- SGAE, ASCAP, TuneCore, TuneCore Pub, etc.
  status text default 'pending' check (status in ('pending','in_progress','completed','blocked')),
  external_reference text,      -- ID de confirmación externo
  completed_at timestamptz,
  created_at timestamptz default now()
);

-- =========================================================
-- 7. CALENDARIO
-- =========================================================
create table calendar_events (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid references artists(id) on delete cascade,
  title text not null,
  event_date date not null,
  event_type text,             -- lanzamiento, entrega, vencimiento, show
  created_at timestamptz default now()
);

-- =========================================================
-- RLS (Row Level Security) — cada artista ve solo lo suyo
-- =========================================================
alter table artists enable row level security;
alter table tracks enable row level security;
alter table split_sheets enable row level security;
alter table split_sheet_parties enable row level security;
alter table contracts enable row level security;
alter table registrations enable row level security;
alter table calendar_events enable row level security;
alter table subscriptions enable row level security;
alter table payments enable row level security;

create policy "Artists read own row" on artists
  for select using (auth.uid() = auth_user_id);

create policy "Artists read own tracks" on tracks
  for select using (artist_id in (select id from artists where auth_user_id = auth.uid()));

create policy "Artists read own registrations" on registrations
  for select using (artist_id in (select id from artists where auth_user_id = auth.uid()));

create policy "Artists read own calendar" on calendar_events
  for select using (artist_id in (select id from artists where auth_user_id = auth.uid()));

-- Nota: las escrituras (insert/update) desde el panel de administración
-- deben hacerse con la service_role key desde el backend, no desde el cliente.
