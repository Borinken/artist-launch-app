import DashboardShell from '../_components/DashboardShell';
import RegistrationRequestForm from '../_components/RegistrationRequestForm';
import TabbedPanel from '../_components/TabbedPanel';
import { getArtist, getTracks, getRegistrations } from '@/lib/dashboardData';
import { REGISTRATION_TYPE_LABELS, formatCost } from '@/lib/registrationCatalog';

const statusLabel: Record<string, string> = { pending: 'Pendiente', in_progress: 'En proceso', completed: 'Completo', blocked: 'Bloqueado' };

export default async function RegistrosPage({ searchParams }: { searchParams: { artist_id?: string } }) {
  const artistId = searchParams.artist_id;
  if (!artistId) return <main style={{ padding: 60 }}>Falta ?artist_id=</main>;

  const artist = await getArtist(artistId);
  if (!artist) return <main style={{ padding: 60 }}>Artista no encontrado.</main>;

  const [tracks, registrations] = await Promise.all([getTracks(artistId), getRegistrations(artistId)]);
  const trackOptions = tracks.map((t) => ({ id: t.id, title: t.title }));

  const missingFields: string[] = [];
  if (!artist.tax_id) missingFields.push('NIF/tax ID del artista');
  if (!artist.country) missingFields.push('País del artista');
  if (!artist.legal_name) missingFields.push('Nombre legal del artista');

  const completed = registrations.filter((r) => r.status === 'completed');
  const pending = registrations.filter((r) => r.status !== 'completed');

  return (
    <DashboardShell artist={artist} artistId={artistId}>
      <h1 style={{ margin: '0 0 24px', fontSize: 28 }}>Registros</h1>

      <section className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Solicitar registro</h2>
        <RegistrationRequestForm artistId={artistId} tracks={trackOptions} country={artist.country} />
      </section>

      <section className="card">
        <TabbedPanel
          tabs={[
            {
              label: `Pendientes / en proceso (${pending.length})`,
              content: (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {pending.map((r: any) => (
                    <li key={r.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                        <span>{REGISTRATION_TYPE_LABELS[r.registration_type] ?? r.registration_type} <span style={{ color: 'var(--muted)' }}>· {r.provider ?? '—'} · {r.tracks?.title ?? 'General'}</span></span>
                        <span className={`badge badge-${r.status}`}>{statusLabel[r.status] ?? r.status}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{formatCost(r.cost_cents, r.currency)}</div>
                      {missingFields.length > 0 && (
                        <div style={{ fontSize: 12, color: '#facc15', marginTop: 4 }}>Falta: {missingFields.join(', ')}</div>
                      )}
                    </li>
                  ))}
                  {pending.length === 0 && <li style={{ color: 'var(--muted)', fontSize: 14 }}>Sin registros pendientes.</li>}
                </ul>
              ),
            },
            {
              label: `Completados (${completed.length})`,
              content: (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {completed.map((r: any) => (
                    <li key={r.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{REGISTRATION_TYPE_LABELS[r.registration_type] ?? r.registration_type} <span style={{ color: 'var(--muted)' }}>· {r.provider ?? '—'} · {r.tracks?.title ?? 'General'}</span></span>
                        <span className="badge badge-completed">Completo</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                        {formatCost(r.cost_cents, r.currency)} · completado {r.completed_at ? new Date(r.completed_at).toLocaleDateString() : ''}
                        {r.external_reference && <> · referencia: {r.external_reference}</>}
                      </div>
                    </li>
                  ))}
                  {completed.length === 0 && <li style={{ color: 'var(--muted)', fontSize: 14 }}>Sin registros completados todavía.</li>}
                </ul>
              ),
            },
          ]}
        />
      </section>
    </DashboardShell>
  );
}
