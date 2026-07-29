import DashboardShell from '../_components/DashboardShell';
import CalendarEventForm from '../_components/CalendarEventForm';
import { getArtist, getCalendarEvents } from '@/lib/dashboardData';

const typeLabel: Record<string, string> = {
  lanzamiento: 'Lanzamiento', entrega: 'Entrega de material', vencimiento: 'Vencimiento', show: 'Show',
};

export default async function CalendarioPage({ searchParams }: { searchParams: { artist_id?: string } }) {
  const artistId = searchParams.artist_id;
  if (!artistId) return <main style={{ padding: 60 }}>Falta ?artist_id=</main>;

  const artist = await getArtist(artistId);
  if (!artist) return <main style={{ padding: 60 }}>Artista no encontrado.</main>;

  const events = await getCalendarEvents(artistId);
  const today = new Date();

  return (
    <DashboardShell artist={artist} artistId={artistId}>
      <h1 style={{ margin: '0 0 24px', fontSize: 28 }}>Calendario</h1>

      <section className="card" style={{ marginBottom: 24 }}>
        <CalendarEventForm artistId={artistId} />
      </section>

      <section className="card">
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {events.map((e) => {
            const eventDate = new Date(e.event_date);
            const daysUntil = Math.round((eventDate.getTime() - today.getTime()) / 86400000);
            const isPast = daysUntil < 0;
            const isReminderWindow = e.event_type === 'lanzamiento' && daysUntil >= 0 && daysUntil <= 28;
            return (
              <li key={e.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14, opacity: isPast ? 0.5 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span><strong>{e.event_date}</strong> — {e.title}</span>
                  <span className="badge" style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--accent)' }}>{typeLabel[e.event_type] ?? e.event_type}</span>
                </div>
                {isReminderWindow && (
                  <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 4 }}>
                    🔔 Recordatorio: faltan {daysUntil} días para el lanzamiento — es la ventana de 3-4 semanas para cerrar registros y metadata.
                  </div>
                )}
              </li>
            );
          })}
          {events.length === 0 && <li style={{ color: 'var(--muted)', fontSize: 14 }}>Sin fechas registradas todavía.</li>}
        </ul>
      </section>
    </DashboardShell>
  );
}
