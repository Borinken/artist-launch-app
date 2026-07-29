-- Distribución: metadata de assets y estatus del envío a plataformas
alter table tracks add column if not exists cover_art_path text;
alter table tracks add column if not exists wav_file_path text;
alter table tracks add column if not exists genre text;
alter table tracks add column if not exists distribution_status text default 'not_started';
alter table tracks drop constraint if exists tracks_distribution_status_check;
alter table tracks add constraint tracks_distribution_status_check check (distribution_status in (
  'not_started', 'assets_submitted', 'in_review', 'distributed'
));

-- Equipo: productores y managers como colaboradores de primera clase
create table if not exists collaborators (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role text check (role in ('producer', 'manager')),
  email text,
  phone text,
  tax_id text,
  ipi_number text,
  pro_affiliation text,
  entity_name text,
  created_at timestamptz default now()
);
alter table collaborators enable row level security;

create table if not exists artist_collaborators (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid references artists(id) on delete cascade,
  collaborator_id uuid references collaborators(id) on delete cascade,
  role text check (role in ('producer', 'manager')),
  commission_pct numeric(5,2),
  status text default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz default now(),
  unique (artist_id, collaborator_id)
);
alter table artist_collaborators enable row level security;

-- Calendario: asociar opcionalmente un evento a un colaborador del equipo
alter table calendar_events add column if not exists collaborator_id uuid references collaborators(id) on delete set null;
