import DashboardShell from '../_components/DashboardShell';
import DistributionUploadForm from '../_components/DistributionUploadForm';
import { getArtist, getTracks } from '@/lib/dashboardData';

const statusLabel: Record<string, string> = {
  not_started: 'No iniciado', assets_submitted: 'Assets enviados', in_review: 'En revisión', distributed: 'Distribuido',
};
const statusBadge: Record<string, string> = {
  not_started: 'badge-unreleased', assets_submitted: 'badge-pending', in_review: 'badge-pending', distributed: 'badge-published',
};

function metadataComplete(t: any) {
  return !!(t.genre && t.language && t.release_date);
}

export default async function DistribucionPage({ searchParams }: { searchParams: { artist_id?: string } }) {
  const artistId = searchParams.artist_id;
  if (!artistId) return <main style={{ padding: 60 }}>Falta ?artist_id=</main>;

  const artist = await getArtist(artistId);
  if (!artist) return <main style={{ padding: 60 }}>Artista no encontrado.</main>;

  const tracks = await getTracks(artistId);

  return (
    <DashboardShell artist={artist} artistId={artistId}>
      <h1 style={{ margin: '0 0 4px', fontSize: 28 }}>Distribución</h1>
      <p style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 24px' }}>
        Para distribuir una canción necesitamos: carátula (3000x3000px), master en WAV y la metadata completa.
        El costo del servicio de distribución se solicita desde <a href={`/dashboard/registros?artist_id=${artistId}`} style={{ textDecoration: 'underline' }}>Registros</a>.
      </p>

      {tracks.length === 0 && <p style={{ color: 'var(--muted)', fontSize: 14 }}>Agrega una canción en la sección Canciones primero.</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {tracks.map((t: any) => (
          <section key={t.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 style={{ margin: 0, fontSize: 16 }}>{t.title}</h2>
              <span className={`badge ${statusBadge[t.distribution_status] ?? 'badge-unreleased'}`}>
                {statusLabel[t.distribution_status] ?? t.distribution_status}
              </span>
            </div>

            <div style={{ fontSize: 13, color: metadataComplete(t) ? 'var(--success)' : '#facc15', marginBottom: 12 }}>
              {metadataComplete(t) ? '✅ Metadata completa' : '⏳ Falta metadata (género, idioma o fecha de lanzamiento)'}
              {' — '}<a href={`/dashboard/canciones/${t.id}?artist_id=${artistId}`} style={{ textDecoration: 'underline' }}>editar en la ficha de la canción</a>
            </div>

            <DistributionUploadForm trackId={t.id} hasCover={!!t.cover_art_path} hasWav={!!t.wav_file_path} />
          </section>
        ))}
      </div>
    </DashboardShell>
  );
}
