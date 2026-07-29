import DashboardShell from '../_components/DashboardShell';
import { getSessionArtist } from '@/lib/getSessionArtist';
import { getRegistrations } from '@/lib/dashboardData';
import { REGISTRATION_TYPE_LABELS } from '@/lib/registrationCatalog';

const statusLabel: Record<string, string> = { pending: 'Pendiente', in_progress: 'En proceso', completed: 'Completo', blocked: 'Bloqueado' };

export default async function RegistrosPage() {
  const artist = await getSessionArtist();
  if (!artist) return <main style={{ padding: 60 }}>Artista no encontrado.</main>;

  const registrations = await getRegistrations(artist.id);
  const completed = registrations.filter((r) => r.status === 'completed');
  const pending = registrations.filter((r) => r.status !== 'completed');

  return (
    <DashboardShell artist={artist} artistId={artist.id}>
      <h1 style={{ margin: '0 0 4px', fontSize: 28 }}>Mis registros</h1>
      <p style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 24px' }}>
        Estatus de tus registros de derechos. Tu manager en Royal Music Growth se encarga de tramitarlos.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <section className="card">
          <h2 style={{ marginTop: 0, fontSize: 16 }}>En proceso ({pending.length})</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {pending.map((r: any) => (
              <li key={r.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
                <span>{REGISTRATION_TYPE_LABELS[r.registration_type] ?? r.registration_type} <span style={{ color: 'var(--muted)' }}>· {r.tracks?.title ?? 'General'}</span></span>
                <span className={`badge badge-${r.status}`}>{statusLabel[r.status] ?? r.status}</span>
              </li>
            ))}
            {pending.length === 0 && <li style={{ color: 'var(--muted)', fontSize: 14 }}>Sin registros pendientes.</li>}
          </ul>
        </section>

        <section className="card">
          <h2 style={{ marginTop: 0, fontSize: 16 }}>Completados ({completed.length})</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {completed.map((r: any) => (
              <li key={r.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{REGISTRATION_TYPE_LABELS[r.registration_type] ?? r.registration_type} <span style={{ color: 'var(--muted)' }}>· {r.tracks?.title ?? 'General'}</span></span>
                  <span className="badge badge-completed">✅ Completo</span>
                </div>
                {r.completed_at && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{new Date(r.completed_at).toLocaleDateString()}</div>}
              </li>
            ))}
            {completed.length === 0 && <li style={{ color: 'var(--muted)', fontSize: 14 }}>Sin registros completados todavía.</li>}
          </ul>
        </section>
      </div>
    </DashboardShell>
  );
}
