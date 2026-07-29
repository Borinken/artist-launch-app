import { createClient } from '@supabase/supabase-js';

// Cliente para el navegador (usa la anon key, respeta RLS)
export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Cliente para el servidor/API routes (usa la service role key, se salta RLS)
// SOLO usar dentro de app/api/*, nunca importar en componentes de cliente.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
