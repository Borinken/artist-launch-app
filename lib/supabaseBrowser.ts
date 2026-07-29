import { createBrowserClient } from '@supabase/ssr';

// Cliente para el navegador (anon key). Usa @supabase/ssr para que la sesión
// se guarde en cookies (flujo PKCE) y sea legible por el middleware y los
// Server Components — un cliente de auth por localStorage no funcionaría
// con el resto de la arquitectura de sesión del lado del servidor.
export const supabaseBrowser = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
