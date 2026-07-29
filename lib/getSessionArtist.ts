import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

// Artista de respaldo mientras DISABLE_AUTH=true (ver middleware.ts) — el
// mismo artista demo que se usaba antes de tener login real.
const DEMO_ARTIST_ID = '5a0056f9-1445-4960-9cc5-a478b4865d5d';

// Deriva el artista de la SESIÓN autenticada — nunca de un parámetro de URL.
// Devuelve null si no hay sesión o si el usuario logueado no tiene un
// artista vinculado (auth_user_id).
export async function getSessionArtist() {
  if (process.env.DISABLE_AUTH === 'true') {
    const { data: demoArtist } = await supabaseAdmin.from('artists').select('*').eq('id', DEMO_ARTIST_ID).single();
    return demoArtist;
  }

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
