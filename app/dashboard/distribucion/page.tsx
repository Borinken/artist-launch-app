import DashboardShell from '../_components/DashboardShell';
import DistributionUploadForm from '../_components/DistributionUploadForm';
import TrackMetaForm from '../_components/TrackMetaForm';
import { getSessionArtist } from '@/lib/getSessionArtist';
import { getTracks } from '@/lib/dashboardData';
import { DISTRIBUTION_REFERENCE, OUR_DISTRIBUTION_FEE } from '@/lib/registrationCatalog';

const statusLabel: Record<string, string> = {
  not_started: 'No iniciado', assets_submitted: 'Assets enviados', in_review: 'En revisión', distributed: 'Distribuido',
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
      <h1 style={{ margin: '0 0 4px', fontSize: 28 }}>Distribución</h1>
      <p style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 20px' }}>
        Para distribuir una canción se necesita: carátula, master en WAV y la metadata completa —
        igual que pide cualquier distribuidor (TuneCore, DistroKid, etc.).
      </p>

      <section className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Nuestra tarifa vs. el costo del distribuidor</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase' }}>Nuestra gestión</div>
            <div style={{ fontSize: 26, fontWeight: 700, fontFamily: 'var(--font-serif)' }}>€{OUR_DISTRIBUTION_FEE.amount} <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 400 }}>fijo</span></div>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 0' }}>{OUR_DISTRIBUTION_FEE.detail}</p>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase' }}>Costo del distribuidor ({DISTRIBUTION_REFERENCE.provider}, referencia)</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '6px 0 0' }}>
              {DISTRIBUTION_REFERENCE.plans.map((p) => (
                <li key={p.label} style={{ fontSize: 13, display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                  <span style={{ color: 'var(--muted)' }}>{p.label}</span><span>{p.cost}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--muted)' }}>
          <p style={{ margin: '0 0 4px' }}>📐 Carátula: {DISTRIBUTION_REFERENCE.coverArtSpec}</p>
          <p style={{ margin: '0 0 4px' }}>🎵 Audio: {DISTRIBUTION_REFERENCE.audioSpec}</p>
          <p style={{ margin: 0 }}>🗓 {DISTRIBUTION_REFERENCE.leadTime}</p>
        </div>
      </section>

      {tracks.length === 0 && <p style={{ color: 'var(--muted)', fontSize: 14 }}>Agrega una canción en la sección Canciones primero.</p>}

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
                {metadataComplete(t) ? '✅ Metadata completa' : '⏳ Falta metadata (género, idioma o fecha de lanzamiento)'}
              </div>
              {daysUntil !== null && (
                <div style={{ fontSize: 13, color: leadTimeOk ? 'var(--success)' : '#f87171', marginBottom: 12 }}>
                  {leadTimeOk
                    ? `✅ Faltan ${daysUntil} días hábiles para el lanzamiento — cumple el mínimo de 10`
                    : `⚠ Solo faltan ${daysUntil} días hábiles — se recomiendan al menos 10 antes de la fecha de lanzamiento`}
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
    </DashboardShell>
  );
}
