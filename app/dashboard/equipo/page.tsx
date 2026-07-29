import DashboardShell from '../_components/DashboardShell';
import CollaboratorForm from '../_components/CollaboratorForm';
import { getArtist, getCollaborators, getContracts } from '@/lib/dashboardData';
import { COLLABORATOR_ROLE_LABELS, getCollaboratorChecklist } from '@/lib/collaboratorRoles';

export default async function EquipoPage({ searchParams }: { searchParams: { artist_id?: string } }) {
  const artistId = searchParams.artist_id;
  if (!artistId) return <main style={{ padding: 60 }}>Falta ?artist_id=</main>;

  const artist = await getArtist(artistId);
  if (!artist) return <main style={{ padding: 60 }}>Artista no encontrado.</main>;

  const [collaborators, contracts] = await Promise.all([getCollaborators(artistId), getContracts(artistId)]);

  const hasSignedContractByRole = (role: string) => {
    const type = role === 'manager' ? 'management_agreement' : 'producer_agreement';
    return contracts.some((c: any) => c.contract_type === type && c.status === 'signed');
  };

  return (
    <DashboardShell artist={artist} artistId={artistId}>
      <h1 style={{ margin: '0 0 4px', fontSize: 28 }}>Equipo</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 24px', fontSize: 14 }}>
        Productores y managers asociados a este artista. También ven el calendario del artista.
      </p>

      <section className="card" style={{ marginBottom: 24 }}>
        <CollaboratorForm artistId={artistId} />
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        {collaborators.map((ac: any) => {
          const c = ac.collaborators;
          const checklist = getCollaboratorChecklist(ac.role, c, hasSignedContractByRole(ac.role), ac.commission_pct);
          return (
            <div key={ac.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16 }}>{c.full_name}</h3>
                  <span className="badge" style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--accent)', marginTop: 4 }}>
                    {COLLABORATOR_ROLE_LABELS[ac.role]}
                  </span>
                </div>
                {ac.role === 'manager' && ac.commission_pct != null && (
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>{ac.commission_pct}% comisión</span>
                )}
              </div>
              {c.email && <p style={{ fontSize: 13, color: 'var(--muted)', margin: '4px 0' }}>{c.email}</p>}
              <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0' }}>
                {checklist.map((item) => (
                  <li key={item.key} style={{ fontSize: 13, padding: '4px 0', display: 'flex', gap: 8 }}>
                    <span>{item.done ? '✅' : '⏳'}</span> {item.label}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        {collaborators.length === 0 && <p style={{ color: 'var(--muted)', fontSize: 14 }}>Sin productores ni managers agregados todavía.</p>}
      </div>
    </DashboardShell>
  );
}
