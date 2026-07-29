import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

// Deriva el artista de la SESIÓN autenticada — nunca de un parámetro de URL.
// Devuelve null si no hay sesión o si el usuario logueado no tiene un
// artista vinculado (auth_user_id).
export async function getSessionArtist() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: artist } = await supabaseAdmin
    .from('artists')
    .select('*')
    .eq('auth_user_id', user.id)
    .single();

  return artist;
}
