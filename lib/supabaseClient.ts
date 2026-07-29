import { createClient } from '@supabase/supabase-js';

// Cliente para el servidor/API routes (usa la service role key, se salta RLS)
// SOLO usar dentro de app/api/* y Server Components — nunca importar desde
// un componente 'use client' (metería la service role key en el bundle).
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
