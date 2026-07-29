import { supabaseAdmin } from '@/lib/supabaseClient';

// Server Component — se ejecuta en el servidor, usa la service role key.
// En producción, reemplazar el artistId fijo por el del usuario autenticado
// (ej. desde la sesión de Supabase Auth).
async function getArtistData(artistId: string) {
  const { data: artist } = await supabaseAdmin
    .from('artists')
    .select('*')
    .eq('id', artistId)
    .single();

  const { data: registrations } = await supabaseAdmin
    .from('registrations')
    .select('*')
    .eq('artist_id', artistId)
    .order('created_at', { ascending: false });

  const { data: tracks } = await supabaseAdmin
    .from('tracks')
    .select('*')
    .eq('artist_id', artistId)
    .order('created_at', { ascending: false });

  const { data: calendarEvents } = await supabaseAdmin
    .from('calendar_events')
    .select('*')
    .eq('artist_id', artistId)
    .gte('event_date', new Date().toISOString().slice(0, 10))
    .order('event_date', { ascending: true })
    .limit(5);

  return { artist, registrations: registrations ?? [], tracks: tracks ?? [], calendarEvents: calendarEvents ?? [] };
}

export default async function DashboardPage({ searchParams }: { searchParams: { artist_id?: string } }) {
  const artistId = searchParams.artist_id;

  if (!artistId) {
    return <p style={{ padding: 40, fontFamily: 'monospace' }}>
      Falta el parámetro ?artist_id= en la URL. En producción esto vendría de la sesión autenticada.
    </p>;
  }

  const { artist, registrations, tracks, calendarEvents } = await getArtistData(artistId);

  if (!artist) {
    return <p style={{ padding: 40, fontFamily: 'monospace' }}>Artista no encontrado.</p>;
  }

  const statusLabel: Record<string, string> = {
    pending: 'Pendiente',
    in_progress: 'En proceso',
    completed: 'Completo',
    blocked: 'Bloqueado',
  };

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: 32, fontFamily: 'system-ui, sans-serif' }}>
      <h1>{artist.artist_name || artist.legal_name}</h1>
      <p style={{ color: '#666' }}>Plan: {artist.plan} — Progreso de carrera: {artist.career_progress_pct}%</p>

      <section style={{ marginTop: 32 }}>
        <h2>Registros</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Tipo</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Proveedor</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Estatus</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((r) => (
              <tr key={r.id}>
                <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{r.registration_type}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{r.provider ?? '—'}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{statusLabel[r.status] ?? r.status}</td>
              </tr>
            ))}
            {registrations.length === 0 && (
              <tr><td colSpan={3} style={{ padding: 8, color: '#999' }}>Sin registros todavía.</td></tr>
            )}
          </tbody>
        </table>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Próximas fechas</h2>
        <ul>
          {calendarEvents.map((e) => (
            <li key={e.id}>{e.event_date} — {e.title}</li>
          ))}
          {calendarEvents.length === 0 && <li style={{ color: '#999' }}>Sin fechas próximas.</li>}
        </ul>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Canciones</h2>
        <ul>
          {tracks.map((t) => (
            <li key={t.id}>{t.title} — {t.status}</li>
          ))}
          {tracks.length === 0 && <li style={{ color: '#999' }}>Sin canciones registradas todavía.</li>}
        </ul>
      </section>
    </main>
  );
}
