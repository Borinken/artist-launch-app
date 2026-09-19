import DashboardShell from '../_components/DashboardShell';
import PageHeader from '../_components/PageHeader';
import EmptyState from '../_components/EmptyState';
import CollaboratorForm from '../_components/CollaboratorForm';
import { getSessionArtist } from '@/lib/getSessionArtist';
import { getCollaborators, getContracts } from '@/lib/dashboardData';
import { COLLABORATOR_ROLE_LABELS, getCollaboratorChecklist } from '@/lib/collaboratorRoles';

export default async function EquipoPage() {
  const artist = await getSessionArtist();
  if (!artist) return <main style={{ padding: 60 }}>Artista no encontrado.</main>;

  const [collaborators, contracts] = await Promise.all([getCollaborators(artist.id), getContracts(artist.id)]);

  const hasSignedContractByRole = (role: string) => {
    const type = role === 'manager' ? 'management_agreement' : 'producer_agreement';
    return contracts.some((c: any) => c.contract_type === type && c.status === 'signed');
  };

  return (
    <DashboardShell artist={artist} artistId={artist.id}>
      <PageHeader
        title="Mi equipo"
        subtitle="Las personas que trabajan contigo: tu productor y tu manager."
        tip={<><b>Ellos también ven tu calendario</b>, así todos saben qué fechas vienen.</>}
      />

      <section className="card" style={{ marginBottom: 24 }}>
        <h2 className="section-title">Añadir a alguien</h2>
        <p className="section-sub">Escribe su nombre, su correo y elige su papel.</p>
        <CollaboratorForm artistId={artist.id} plan={artist.plan} currentCount={collaborators.length} />
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
              <p style={{ fontSize: 13, margin: '4px 0', color: !ac.monthly_fee_cents ? 'var(--success)' : 'var(--text)' }}>
                {!ac.monthly_fee_cents ? 'Incluido en el plan' : `$${(ac.monthly_fee_cents / 100).toFixed(2)}/mes`}
              </p>
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
        {collaborators.length === 0 && (
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <EmptyState title="Todavía no has añadido a nadie" text="Si trabajas con un productor o un manager, añádelo arriba para que también vea tu calendario." />
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
