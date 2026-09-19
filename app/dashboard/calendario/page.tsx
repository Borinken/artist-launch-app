import DashboardShell from '../_components/DashboardShell';
import PageHeader from '../_components/PageHeader';
import EmptyState from '../_components/EmptyState';
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
      <PageHeader
        title="Mis fechas importantes"
        subtitle={
          collaborators.length > 0
            ? `Lanzamientos, conciertos y entregas. Compartido con tu equipo: ${collaborators.map((c) => c.full_name).join(', ')}.`
            : 'Lanzamientos, conciertos y entregas, todo en una lista para que no se te pase nada.'
        }
      />

      <section className="card" style={{ marginBottom: 24 }}>
        <h2 className="section-title">Añadir una fecha</h2>
        <p className="section-sub">Por ejemplo: el día que sale tu canción o un concierto.</p>
        <CalendarEventForm artistId={artist.id} collaborators={collaborators} />
      </section>

      <section className="card">
        <h2 className="section-title">Próximas fechas</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0' }}>
          {events.map((e: any) => {
            const eventDate = new Date(e.event_date);
            const daysUntil = Math.round((eventDate.getTime() - today.getTime()) / 86400000);
            const isPast = daysUntil < 0;
            const isReminderWindow = e.event_type === 'lanzamiento' && daysUntil >= 0 && daysUntil <= 28;
            const collaborator = e.collaborator_id ? collaboratorById[e.collaborator_id] : null;
            return (
              <li key={e.id} style={{ padding: '14px 0', borderBottom: '1px solid var(--border)', fontSize: 15, opacity: isPast ? 0.5 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  <span><strong>{e.event_date}</strong> — {e.title}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {collaborator && <span className="badge" style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--accent)' }}>{collaborator.full_name}</span>}
                    <span className="badge" style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--accent)' }}>{typeLabel[e.event_type] ?? e.event_type}</span>
                  </div>
                </div>
                {isReminderWindow && (
                  <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 4 }}>
                    🔔 Faltan {daysUntil} días para el lanzamiento — es el momento de dejar listos los trámites y los datos de la canción.
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        {events.length === 0 && (
          <EmptyState title="Aún no hay fechas" text="Añade la fecha de tu próximo lanzamiento y te recordaremos cuándo cerrar los trámites." />
        )}
      </section>
    </DashboardShell>
  );
}
