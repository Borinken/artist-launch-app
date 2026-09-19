import DashboardShell from '../_components/DashboardShell';
import PageHeader from '../_components/PageHeader';
import EmptyState from '../_components/EmptyState';
import TrackForm from '../_components/TrackForm';
import { getSessionArtist } from '@/lib/getSessionArtist';
import { getTracks } from '@/lib/dashboardData';
import { TRACK_STATUS_LABELS } from '@/lib/trackStatus';

const releaseLabel: Record<string, string> = { single: 'Sencillo', ep: 'EP', album: 'Álbum' };

export default async function CancionesPage() {
  const artist = await getSessionArtist();
  if (!artist) return <main style={{ padding: 60 }}>Artista no encontrado.</main>;
  const artistId = artist.id;

  const tracks = await getTracks(artistId);

  return (
    <DashboardShell artist={artist} artistId={artistId}>
      <PageHeader
        title="Mis canciones"
        subtitle="Todas tus canciones en un solo lugar. Empieza añadiendo una."
        tip={<><b>Solo necesitas el título.</b> Los demás detalles (género, fecha, portada) los completas después, cuando quieras publicarla.</>}
      />

      <section className="card" style={{ marginBottom: 24 }}>
        <h2 className="section-title">Añadir una canción</h2>
        <p className="section-sub">Escribe el nombre y elige el tipo.</p>
        <TrackForm artistId={artistId} />
      </section>

      <section className="card">
        <h2 className="section-title">Mi lista ({tracks.length})</h2>
        {tracks.length === 0 ? (
          <EmptyState title="Todavía no has añadido canciones" text="Usa el recuadro de arriba para añadir la primera. Toma menos de un minuto." />
        ) : (
          <div className="table-scroll" style={{ marginTop: 12 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 460 }}>
              <thead>
                <tr>
                  {['Canción', 'Tipo', 'En qué punto está', 'Código'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 8px', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tracks.map((t) => (
                  <tr key={t.id}>
                    <td style={{ padding: '14px 8px', borderBottom: '1px solid var(--border)', fontSize: 15.5, fontWeight: 600 }}>
                      <a href={`/dashboard/canciones/${t.id}`} style={{ textDecoration: 'underline' }}>{t.title}</a>
                    </td>
                    <td style={{ padding: '14px 8px', borderBottom: '1px solid var(--border)', fontSize: 14.5, color: 'var(--muted)' }}>{releaseLabel[t.release_type] ?? t.release_type}</td>
                    <td style={{ padding: '14px 8px', borderBottom: '1px solid var(--border)' }}>
                      <span className={`badge badge-${t.status}`}>{TRACK_STATUS_LABELS[t.status] ?? t.status}</span>
                    </td>
                    <td style={{ padding: '14px 8px', borderBottom: '1px solid var(--border)', fontSize: 13.5, color: 'var(--muted)' }}>
                      {t.isrc ?? 'Aún sin asignar'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
