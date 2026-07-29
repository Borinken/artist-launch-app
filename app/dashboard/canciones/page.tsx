import DashboardShell from '../_components/DashboardShell';
import TrackForm from '../_components/TrackForm';
import { getArtist, getTracks } from '@/lib/dashboardData';
import { TRACK_STATUS_LABELS } from '@/lib/trackStatus';

export default async function CancionesPage({ searchParams }: { searchParams: { artist_id?: string } }) {
  const artistId = searchParams.artist_id;
  if (!artistId) return <main style={{ padding: 60 }}>Falta ?artist_id=</main>;

  const artist = await getArtist(artistId);
  if (!artist) return <main style={{ padding: 60 }}>Artista no encontrado.</main>;

  const tracks = await getTracks(artistId);

  return (
    <DashboardShell artist={artist} artistId={artistId}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>Canciones</h1>
      </div>

      <section className="card" style={{ marginBottom: 24 }}>
        <TrackForm artistId={artistId} />
      </section>

      <section className="card">
        {tracks.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Sin canciones registradas todavía.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px 4px', borderBottom: '1px solid var(--border)', fontSize: 12, color: 'var(--muted)' }}>Título</th>
                <th style={{ textAlign: 'left', padding: '8px 4px', borderBottom: '1px solid var(--border)', fontSize: 12, color: 'var(--muted)' }}>Tipo</th>
                <th style={{ textAlign: 'left', padding: '8px 4px', borderBottom: '1px solid var(--border)', fontSize: 12, color: 'var(--muted)' }}>Estado</th>
                <th style={{ textAlign: 'left', padding: '8px 4px', borderBottom: '1px solid var(--border)', fontSize: 12, color: 'var(--muted)' }}>ISRC/UPC</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((t) => (
                <tr key={t.id}>
                  <td style={{ padding: '10px 4px', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                    <a href={`/dashboard/canciones/${t.id}?artist_id=${artistId}`} style={{ textDecoration: 'underline' }}>{t.title}</a>
                  </td>
                  <td style={{ padding: '10px 4px', borderBottom: '1px solid var(--border)', fontSize: 14, color: 'var(--muted)' }}>{t.release_type}</td>
                  <td style={{ padding: '10px 4px', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                    <span className={`badge badge-${t.status}`}>{TRACK_STATUS_LABELS[t.status] ?? t.status}</span>
                  </td>
                  <td style={{ padding: '10px 4px', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--muted)' }}>
                    {t.isrc ?? '—'} / {t.upc ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </DashboardShell>
  );
}
