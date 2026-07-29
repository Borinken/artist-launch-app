const features = [
  { label: 'Base de datos (Supabase)', detail: 'artists, tracks, split_sheets, registrations, subscriptions, payments, calendar_events', done: true },
  { label: 'API de split sheets', detail: 'POST /api/split-sheets — valida que los porcentajes sumen 100', done: true },
  { label: 'API de registros', detail: 'POST /api/registrations', done: true },
  { label: 'Webhook de Stripe', detail: 'POST /api/webhooks/stripe — suscripciones y pagos', done: true },
  { label: 'Dashboard de artista', detail: '/dashboard?artist_id=UUID', done: true },
  { label: 'Autenticación de usuarios', detail: 'Pendiente — Supabase Auth', done: false },
  { label: 'Llaves reales de Stripe', detail: 'Pendiente — hoy son placeholders', done: false },
];

export default function HomePage() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 32, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Artist Launch OS</h1>
      <p style={{ color: '#666' }}>Backend de gestión de artistas: base de datos, APIs y dashboard.</p>

      <section style={{ marginTop: 32 }}>
        <h2>Qué está construido</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {features.map((f) => (
            <li key={f.label} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
              <span style={{ marginRight: 8 }}>{f.done ? '✅' : '⏳'}</span>
              <strong>{f.label}</strong>
              <div style={{ color: '#999', fontSize: 14, marginLeft: 24 }}>{f.detail}</div>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Ver dashboard de prueba</h2>
        <p>
          <a href="/dashboard?artist_id=5a0056f9-1445-4960-9cc5-a478b4865d5d">
            /dashboard?artist_id=5a0056f9-1445-4960-9cc5-a478b4865d5d
          </a>
        </p>
      </section>
    </main>
  );
}
