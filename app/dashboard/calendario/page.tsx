import DashboardShell from '../_components/DashboardShell';
import CalendarEventForm from '../_components/CalendarEventForm';
import { getSessionArtist } from '@/lib/getSessionArtist';
import { getCalendarEvents, getCollaborators } from '@/lib/dashboardData';

const typeLabel: Record<string, string> = {
  lanzamiento: 'Lanzamiento', entrega: 'Entrega de material', vencimiento: 'Vencimiento', show: 'Show',
};

export default async function CalendarioPage() {
  const artist = await getSessionArtist();
  if (!artist) return <main style={{ padding: 60 }}>Artista no encontrado.</main>;

  const [events, collaboratorLinks] = await Promise.all([getCalendarEvents(artist.id), getCollaborators(artist.id)]);
  const collaborators = collaboratorLinks.map((l: any) => ({ id: l.collaborators.id, full_name: l.collaborators.full_name, role: l.role }));
  const collaboratorById = Object.fromEntries(collaborators.map((c) => [c.id, c]));
  const today = new Date();

  return (
    <DashboardShell artist={artist} artistId={artist.id}>
      <h1 style={{ margin: '0 0 4px', fontSize: 28 }}>Calendario</h1>
      {collaborators.length > 0 && (
        <p style={{ color: 'var(--muted)', fontSize: 13, margin: '0 0 24px' }}>
          Compartido con tu equipo: {collaborators.map((c) => c.full_name).join(', ')}.
        </p>
      )}

      <section className="card" style={{ marginBottom: 24 }}>
        <CalendarEventForm artistId={artist.id} collaborators={collaborators} />
      </section>

      <section className="card">
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {events.map((e: any) => {
            const eventDate = new Date(e.event_date);
            const daysUntil = Math.round((eventDate.getTime() - today.getTime()) / 86400000);
            const isPast = daysUntil < 0;
            const isReminderWindow = e.event_type === 'lanzamiento' && daysUntil >= 0 && daysUntil <= 28;
            const collaborator = e.collaborator_id ? collaboratorById[e.collaborator_id] : null;
            return (
              <li key={e.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14, opacity: isPast ? 0.5 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  <span><strong>{e.event_date}</strong> — {e.title}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {collaborator && <span className="badge" style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--accent)' }}>{collaborator.full_name}</span>}
                    <span className="badge" style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--accent)' }}>{typeLabel[e.event_type] ?? e.event_type}</span>
                  </div>
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
