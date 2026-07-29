import DashboardShell from './_components/DashboardShell';
import ProgressChart from './_components/ProgressChart';
import { getSessionArtist } from '@/lib/getSessionArtist';
import {
  getTracks, getRegistrations, getContracts,
  getSplitSheetsForTracks, getSocialAccounts, getRoyalties, buildChecklist,
} from '@/lib/dashboardData';

export default async function DashboardPage() {
  const artist = await getSessionArtist();
  if (!artist) {
    return <main style={{ maxWidth: 720, margin: '0 auto', padding: 60 }}><p>Artista no encontrado.</p></main>;
  }
  const artistId = artist.id;

  const [tracks, registrations, contracts, socialAccounts, royalties] = await Promise.all([
    getTracks(artistId), getRegistrations(artistId), getContracts(artistId), getSocialAccounts(artistId), getRoyalties(artistId),
  ]);
  const splitSheets = await getSplitSheetsForTracks(tracks.map((t) => t.id));

  const checklist = buildChecklist({ artist, tracks, splitSheets, registrations, socialAccounts });

  const registrationsByStatus = ['pending', 'in_progress', 'completed', 'blocked']
    .map((status) => ({ status, count: registrations.filter((r) => r.status === status).length }))
    .filter((r) => r.count > 0);

  const missingAudit: string[] = [];
  if (!artist.legal_name) missingAudit.push('Nombre legal');
  if (!artist.tax_id) missingAudit.push('NIF/tax ID');
  if (!artist.country) missingAudit.push('País');

  const completedRegs = registrations.filter((r) => r.status === 'completed').length;
  const pendingRegs = registrations.length - completedRegs;
  const pendingSignatures = contracts.filter((c) => c.status !== 'signed').length + splitSheets.filter((s: any) => s.status !== 'signed').length;
  const thisMonth = new Date().toISOString().slice(0, 7);
  const monetizationThisMonth = royalties
    .filter((r) => r.period_month?.slice(0, 7) === thisMonth)
    .reduce((sum, r) => sum + (r.amount_cents ?? 0), 0);

  return (
    <DashboardShell artist={artist} artistId={artistId}>
      <h1 style={{ margin: '0 0 4px', fontSize: 28 }}>Resumen</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 24px' }}>{artist.artist_name || artist.legal_name}</p>

      {missingAudit.length > 0 && (
        <div className="card" style={{ marginBottom: 20, borderColor: '#facc15', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 14 }}>⚠ Te faltan {missingAudit.length} dato(s) para poder tramitar registros: <strong>{missingAudit.join(', ')}</strong></span>
          <a href="/dashboard/perfil" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>Completar ahora</a>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        <KpiCard label="Canciones activas" value={tracks.length} />
        <KpiCard label="Registros" value={`${completedRegs} / ${registrations.length}`} sub="completados" />
        <KpiCard label="Pendientes de firma" value={pendingSignatures} sub="contratos + splits" />
        <KpiCard label="Monetización del mes" value={`$${(monetizationThisMonth / 100).toFixed(0)}`} />
      </div>

      <section className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Progreso de carrera</h2>
        <ProgressChart progressPct={artist.career_progress_pct ?? 0} registrationsByStatus={registrationsByStatus} />
      </section>

      <section className="card">
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Checklist de lanzamiento</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {checklist.map((item) => (
            <li key={item.key}>
              <a href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 4px',
                borderBottom: '1px solid var(--border)', fontSize: 14, color: 'var(--text)',
              }}>
                <span>{item.done ? '✅' : '⏳'}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                <span style={{ color: 'var(--muted)' }}>→</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </DashboardShell>
  );
}

function KpiCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="card">
      <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4, fontFamily: 'var(--font-serif)' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{sub}</div>}
    </div>
  );
}
