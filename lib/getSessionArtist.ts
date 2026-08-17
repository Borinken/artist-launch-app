import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

// Demo record returned by the local development escape hatch (see
// middleware.ts). Gated on NODE_ENV so production can never fall into this
// branch — it reads through the service-role client and would bypass RLS.
const DEMO_ARTIST_ID = '5a0056f9-1445-4960-9cc5-a478b4865d5d';
const AUTH_DISABLED =
  process.env.DISABLE_AUTH === 'true' && process.env.NODE_ENV !== 'production';

// Resolves the artist from the authenticated session — never from a URL
// parameter. Returns null when there is no session, or when the signed-in user
// has no artist linked via auth_user_id.
export async function getSessionArtist() {
  if (AUTH_DISABLED) {
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
