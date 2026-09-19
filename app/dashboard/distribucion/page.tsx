import DashboardShell from '../_components/DashboardShell';
import PageHeader from '../_components/PageHeader';
import EmptyState from '../_components/EmptyState';
import DistributionUploadForm from '../_components/DistributionUploadForm';
import TrackMetaForm from '../_components/TrackMetaForm';
import { getSessionArtist } from '@/lib/getSessionArtist';
import { getTracks } from '@/lib/dashboardData';
import { DISTRIBUTION_REFERENCE, OUR_DISTRIBUTION_FEE } from '@/lib/registrationCatalog';

const statusLabel: Record<string, string> = {
  not_started: 'Sin empezar', assets_submitted: 'Archivos recibidos', in_review: 'La estamos revisando', distributed: 'Ya está publicada',
};
const statusBadge: Record<string, string> = {
  not_started: 'badge-unreleased', assets_submitted: 'badge-pending', in_review: 'badge-pending', distributed: 'badge-published',
};

function metadataComplete(t: any) {
  return !!(t.genre && t.language && t.release_date);
}

function businessDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let count = 0;
  const cursor = new Date(today);
  while (cursor < target) {
    cursor.setDate(cursor.getDate() + 1);
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) count++;
  }
  return count;
}

export default async function DistribucionPage() {
  const artist = await getSessionArtist();
  if (!artist) return <main style={{ padding: 60 }}>Artista no encontrado.</main>;

  const tracks = await getTracks(artist.id);

  return (
    <DashboardShell artist={artist} artistId={artist.id}>
      <PageHeader
        title="Publicar mi música"
        subtitle="Aquí preparas tu canción para que suene en Spotify, Apple Music y las demás plataformas."
        tip={
          <>
            <b>Son 3 pasos por canción:</b> 1) completa los datos de la canción, 2) sube la portada y el audio, 3) nosotros la enviamos.
            Hazlo con al menos 10 días hábiles de margen antes de la fecha de salida.
          </>
        }
      />

      {tracks.length === 0 && (
        <section className="card" style={{ marginBottom: 24 }}>
          <EmptyState
            title="Primero añade una canción"
            text="Para publicar necesitas tener al menos una canción en tu lista."
            href="/dashboard/canciones"
            cta="Añadir mi canción"
          />
        </section>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {tracks.map((t: any) => {
          const daysUntil = t.release_date ? businessDaysUntil(t.release_date) : null;
          const leadTimeOk = daysUntil === null || daysUntil >= 10;
          return (
            <section key={t.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h2 style={{ margin: 0, fontSize: 16 }}>{t.title}</h2>
                <span className={`badge ${statusBadge[t.distribution_status] ?? 'badge-unreleased'}`}>
                  {statusLabel[t.distribution_status] ?? t.distribution_status}
                </span>
              </div>

              <div style={{ fontSize: 13, color: metadataComplete(t) ? 'var(--success)' : '#facc15', marginBottom: 4 }}>
                {metadataComplete(t) ? '✅ Datos de la canción completos' : '⏳ Faltan datos: género, idioma o fecha de salida'}
              </div>
              {daysUntil !== null && (
                <div style={{ fontSize: 13, color: leadTimeOk ? 'var(--success)' : '#f87171', marginBottom: 12 }}>
                  {leadTimeOk
                    ? `✅ Faltan ${daysUntil} días hábiles para la salida — vas a tiempo`
                    : `⚠ Solo faltan ${daysUntil} días hábiles — lo ideal son 10 o más. Puede que haya que mover la fecha`}
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <TrackMetaForm track={t} />
              </div>

              <DistributionUploadForm trackId={t.id} hasCover={!!t.cover_art_path} hasWav={!!t.wav_file_path} />
            </section>
          );
        })}
      </div>

      <section className="card" style={{ marginTop: 24 }}>
        <details className="faq" style={{ borderBottom: 'none', padding: 0 }}>
          <summary>¿Qué archivos necesito y cuánto cuesta?</summary>
          <div style={{ marginTop: 14, fontSize: 14.5, lineHeight: 1.6, color: 'var(--muted)' }}>
            <p style={{ margin: '0 0 6px' }}><strong style={{ color: 'var(--text)' }}>Portada:</strong> {DISTRIBUTION_REFERENCE.coverArtSpec}.</p>
            <p style={{ margin: '0 0 6px' }}><strong style={{ color: 'var(--text)' }}>Audio:</strong> {DISTRIBUTION_REFERENCE.audioSpec}.</p>
            <p style={{ margin: '0 0 6px' }}><strong style={{ color: 'var(--text)' }}>Plazo:</strong> {DISTRIBUTION_REFERENCE.leadTime}.</p>
            <p style={{ margin: '12px 0 6px' }}>
              <strong style={{ color: 'var(--text)' }}>Nuestro trabajo:</strong> €{OUR_DISTRIBUTION_FEE.amount} fijos por canción. {OUR_DISTRIBUTION_FEE.detail}.
            </p>
            <p style={{ margin: '0 0 4px' }}><strong style={{ color: 'var(--text)' }}>Lo que cobra el distribuidor ({DISTRIBUTION_REFERENCE.provider}), como referencia:</strong></p>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {DISTRIBUTION_REFERENCE.plans.map((p) => <li key={p.label}>{p.label}: {p.cost}</li>)}
            </ul>
          </div>
        </details>
      </section>
    </DashboardShell>
  );
}
