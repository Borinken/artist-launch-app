import { supabaseAdmin } from '@/lib/supabaseClient';

export const PLAN_FEES: Record<string, number> = { start: 29, pro: 79, studio: 150 };

export async function getAllArtists() {
  const { data } = await supabaseAdmin.from('artists').select('*').order('created_at', { ascending: false });
  return data ?? [];
}

export async function getArtistCompletionPct(artistId: string): Promise<number> {
  const { data: artist } = await supabaseAdmin.from('artists').select('*').eq('id', artistId).single();
  if (!artist) return 0;
  const fields = ['legal_name', 'email', 'phone', 'country', 'tax_id', 'legal_entity_name', 'manager_name', 'label_name'];
  const filled = fields.filter((f) => !!(artist as any)[f]).length;
  return Math.round((filled / fields.length) * 100);
}
