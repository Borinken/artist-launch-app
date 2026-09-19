import { supabaseAdmin } from '@/lib/supabaseClient';

export async function getArtist(artistId: string) {
  const { data } = await supabaseAdmin.from('artists').select('*').eq('id', artistId).single();
  return data;
}

export async function getTracks(artistId: string) {
  const { data } = await supabaseAdmin
    .from('tracks')
    .select('*')
    .eq('artist_id', artistId)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function getRegistrations(artistId: string) {
  const { data } = await supabaseAdmin
    .from('registrations')
    .select('*, tracks(title)')
    .eq('artist_id', artistId)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function getCalendarEvents(artistId: string, opts: { upcomingOnly?: boolean; limit?: number } = {}) {
  let query = supabaseAdmin.from('calendar_events').select('*').eq('artist_id', artistId);
  if (opts.upcomingOnly) query = query.gte('event_date', new Date().toISOString().slice(0, 10));
  query = query.order('event_date', { ascending: true });
  if (opts.limit) query = query.limit(opts.limit);
  const { data } = await query;
  return data ?? [];
}

export async function getContracts(artistId: string) {
  const { data } = await supabaseAdmin
    .from('contracts')
    .select('*, tracks(title)')
    .eq('artist_id', artistId)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function getSplitSheetsForTracks(trackIds: string[]) {
  if (trackIds.length === 0) return [];
  const { data } = await supabaseAdmin
    .from('split_sheets')
    .select('*, tracks(title), split_sheet_parties(*)')
    .in('track_id', trackIds)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function getRoyalties(artistId: string) {
  const { data } = await supabaseAdmin
    .from('royalty_entries')
    .select('*')
    .eq('artist_id', artistId)
    .order('period_month', { ascending: true });
  return data ?? [];
}

export async function getCollaborators(artistId: string) {
  const { data } = await supabaseAdmin
    .from('artist_collaborators')
    .select('*, collaborators(*)')
    .eq('artist_id', artistId)
    .eq('status', 'active');
  return data ?? [];
}

export async function getSocialAccounts(artistId: string) {
  const { data } = await supabaseAdmin
    .from('social_accounts')
    .select('*')
    .eq('artist_id', artistId);
  return data ?? [];
}

export type ChecklistItem = {
  key: string;
  label: string;      // qué hay que lograr, en palabras simples
  why: string;        // por qué importa, en una frase
  done: boolean;
  href: string;
  cta: string;        // texto del botón
  who: 'tu' | 'equipo'; // quién tiene que mover ficha
};

export function buildChecklist(params: {
  artist: any;
  tracks: any[];
  splitSheets: any[];
  registrations: any[];
  socialAccounts: any[];
}): ChecklistItem[] {
  const { artist, tracks, splitSheets, registrations, socialAccounts } = params;
  const profileComplete = !!(artist.legal_name && artist.email && artist.tax_id && artist.country);
  const hasUnsignedSheet = splitSheets.some((s) => s.status !== 'signed');
  return [
    {
      key: 'profile', label: 'Completa tus datos', done: profileComplete, href: '/dashboard/perfil', cta: 'Completar mis datos', who: 'tu',
      why: 'Tu nombre legal, país y número de identificación fiscal. Sin esto no podemos registrar nada a tu nombre.',
    },
    {
      key: 'track', label: 'Añade tu primera canción', done: tracks.length > 0, href: '/dashboard/canciones', cta: 'Añadir mi canción', who: 'tu',
      why: 'Solo con el título es suficiente por ahora. Los demás detalles se completan después.',
    },
    {
      key: 'split', label: 'Firma quién es dueño de qué en tu canción', done: splitSheets.some((s) => s.status === 'signed'),
      href: '/dashboard/contratos', cta: hasUnsignedSheet ? 'Ver y firmar' : 'Ver mis contratos', who: hasUnsignedSheet ? 'tu' : 'equipo',
      why: 'Un papel simple (se llama "split sheet") donde queda escrito el porcentaje de cada persona. Evita discusiones cuando la canción genere dinero.',
    },
    {
      key: 'registration', label: 'Registra tu canción para poder cobrar', done: registrations.length > 0, href: '/dashboard/registros', cta: 'Ver cómo va', who: 'equipo',
      why: 'Registrarla te permite cobrar cada vez que suene. Nosotros hacemos el trámite y tú ves aquí cómo avanza.',
    },
    {
      key: 'distribution', label: 'Publica tu música en Spotify, Apple Music y más', done: tracks.some((t) => t.status === 'published'),
      href: '/dashboard/distribucion', cta: 'Preparar mi publicación', who: 'tu',
      why: 'Subes la portada y el audio, y nosotros la enviamos a todas las plataformas.',
    },
    {
      key: 'social', label: 'Conecta tus redes sociales', done: socialAccounts.some((s) => s.status === 'connected'),
      href: '/dashboard/redes', cta: 'Añadir mis redes', who: 'tu',
      why: 'Así vemos tus seguidores y oyentes en un solo lugar.',
    },
  ];
}
