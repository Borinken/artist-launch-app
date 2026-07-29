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
  label: string;
  done: boolean;
  href: string;
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
  return [
    { key: 'profile', label: 'Perfil completo', done: profileComplete, href: '/dashboard/perfil' },
    { key: 'track', label: 'Primera canción cargada', done: tracks.length > 0, href: '/dashboard/canciones' },
    { key: 'split', label: 'Split sheet firmado', done: splitSheets.some((s) => s.status === 'signed'), href: '/dashboard/contratos' },
    { key: 'registration', label: 'Primer registro solicitado', done: registrations.length > 0, href: '/dashboard/registros' },
    { key: 'distribution', label: 'Distribución activa', done: tracks.some((t) => t.status === 'published'), href: '/dashboard/canciones' },
    { key: 'social', label: 'Redes conectadas', done: socialAccounts.some((s) => s.status === 'connected'), href: '/dashboard/redes' },
  ];
}
