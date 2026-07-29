import { notFound } from 'next/navigation';
import AdminShell from '../../_components/AdminShell';
import { getArtist, getRegistrations, getTracks, getCollaborators } from '@/lib/dashboardData';
import { formatCost, OUR_DISTRIBUTION_FEE } from '@/lib/registrationCatalog';
import { PLAN_FEES } from '@/lib/adminData';

export default async function FacturacionPage({ params }: { params: { artistId: string } }) {
  const artist = await getArtist(params.artistId);
  if (!artist) return notFound();

  const [registrations, tracks, collaboratorLinks] = await Promise.all([
    getRegistrations(artist.id), getTracks(artist.id), getCollaborators(artist.id),
  ]);

  const planFee = PLAN_FEES[artist.plan] ?? 0;
  const collaboratorFeesCents = collaboratorLinks.reduce((sum: number, l: any) => sum + (l.monthly_fee_cents ?? 0), 0);
  const distributedTracks = tracks.filter((t: any) => t.distribution_status !== 'not_started');
  const distributionFeeTotal = distributedTracks.length * OUR_DISTRIBUTION_FEE.amount;
  const registrationCostsCents = registrations.reduce((sum: number, r: any) => sum + (r.cost_cents ?? 0), 0);

  const recurringTotal = planFee + collaboratorFeesCents / 100;

  return (
    <AdminShell>
      <a href={`/admin/${artist.id}`} style={{ fontSize: 13, color: 'var(--muted)' }}>← {artist.artist_name || artist.legal_name}</a>
      <h1 style={{ margin: '8px 0 24px', fontSize: 28, fontFamily: 'var(--font-serif)' }}>Facturación</h1>

      <section className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Cargos recurrentes (mensual)</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px 4px', borderBottom: '1px solid var(--border)' }}>Fee de gestión — Plan {artist.plan}</td>
              <td style={{ padding: '8px 4px', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>${planFee.toFixed(2)}</td>
            </tr>
            {collaboratorLinks.filter((l: any) => l.monthly_fee_cents).map((l: any) => (
              <tr key={l.id}>
                <td style={{ padding: '8px 4px', borderBottom: '1px solid var(--border)' }}>Colaborador — {l.collaborators.full_name}</td>
                <td style={{ padding: '8px 4px', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>${(l.monthly_fee_cents / 100).toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td style={{ padding: '8px 4px', fontWeight: 700 }}>Total recurrente</td>
              <td style={{ padding: '8px 4px', fontWeight: 700, textAlign: 'right' }}>${recurringTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Distribución (por lanzamiento)</h2>
        <p style={{ fontSize: 14, color: 'var(--muted)' }}>
          {distributedTracks.length} lanzamiento(s) gestionados × €{OUR_DISTRIBUTION_FEE.amount} = <strong>€{distributionFeeTotal}</strong>
          {' '}(no incluye el costo del distribuidor, que se paga aparte)
        </p>
      </section>

      <section className="card">
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Gastos de terceros a facturar (pass-through)</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: -8, marginBottom: 12 }}>
          Lo que pagaste a SGAE/ASCAP/Copyright Office/etc. en nombre del artista — factúraselo tal cual.
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {registrations.filter((r: any) => r.cost_cents).map((r: any) => (
            <li key={r.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
              <span>{r.provider} <span style={{ color: 'var(--muted)' }}>· {r.tracks?.title ?? 'General'}</span></span>
              <span>{formatCost(r.cost_cents, r.currency)}</span>
            </li>
          ))}
          {registrationCostsCents === 0 && <li style={{ color: 'var(--muted)', fontSize: 14 }}>Sin gastos de terceros registrados.</li>}
        </ul>
        <p style={{ marginTop: 12, fontWeight: 700, fontSize: 14 }}>Total pass-through: {formatCost(registrationCostsCents)}</p>
      </section>
    </AdminShell>
  );
}
