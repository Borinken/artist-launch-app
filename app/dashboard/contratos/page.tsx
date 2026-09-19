import DashboardShell from '../_components/DashboardShell';
import PageHeader from '../_components/PageHeader';
import EmptyState from '../_components/EmptyState';
import PartySignToggle from '../_components/PartySignToggle';
import { getSessionArtist } from '@/lib/getSessionArtist';
import { getTracks, getContracts, getSplitSheetsForTracks } from '@/lib/dashboardData';
import { CONTRACT_TYPE_LABELS } from '@/lib/contractTemplates';

const statusLabel: Record<string, string> = { draft: 'En preparación', sent: 'Por firmar', signed: 'Firmado', pending: 'Por firmar', disputed: 'En disputa' };
const statusPill: Record<string, string> = { draft: 'pill-team', sent: 'pill-you', signed: 'pill-done', pending: 'pill-you', disputed: 'pill-bad' };

export default async function ContratosPage() {
  const artist = await getSessionArtist();
  if (!artist) return <main style={{ padding: 60 }}>Artista no encontrado.</main>;

  const tracks = await getTracks(artist.id);
  const [contracts, splitSheets] = await Promise.all([
    getContracts(artist.id), getSplitSheetsForTracks(tracks.map((t) => t.id)),
  ]);

  return (
    <DashboardShell artist={artist} artistId={artist.id}>
      <PageHeader
        title="Contratos y firmas"
        subtitle="Los papeles que protegen tu música y tus acuerdos con otras personas. Aquí los ves y los firmas."
        tip={<><b>¿Qué es un "split sheet"?</b> Un papel donde queda escrito quién es dueño de qué porcentaje de una canción. Cuando todos firman, nadie puede discutirlo después.</>}
      />

      <div className="grid-2">
        <section className="card">
          <h2 className="section-title">Mis contratos</h2>
          <p className="section-sub">Acuerdos con productores, managers y otras personas.</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {contracts.map((c: any) => (
              <li key={c.id} style={{ padding: '14px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <a href={`/dashboard/contracts/${c.id}`} style={{ fontSize: 15.5, fontWeight: 600, textDecoration: 'underline', flex: '1 1 180px' }}>
                  {c.title || CONTRACT_TYPE_LABELS[c.contract_type] || c.contract_type}
                </a>
                <span className={`pill ${statusPill[c.status] ?? 'pill-team'}`}>{statusLabel[c.status] ?? c.status}</span>
              </li>
            ))}
          </ul>
          {contracts.length === 0 && (
            <EmptyState title="Aún no tienes contratos" text="Cuando preparemos uno para ti, aparecerá aquí para que lo revises y lo firmes." />
          )}
        </section>

        <section className="card">
          <h2 className="section-title">Reparto de mis canciones</h2>
          <p className="section-sub">Quién es dueño de qué porcentaje. Marca cuando cada persona haya firmado.</p>
          <div>
            {splitSheets.map((s: any) => (
              <div key={s.id} style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <a href={`/dashboard/split-sheets/${s.id}`} style={{ fontSize: 15.5, fontWeight: 600, textDecoration: 'underline' }}>{s.tracks?.title ?? 'Obra'}</a>
                  <span className={`pill ${statusPill[s.status] ?? 'pill-team'}`}>{statusLabel[s.status] ?? s.status}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                  {s.split_sheet_parties.map((p: any) => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, fontSize: 14 }}>
                      <span style={{ color: 'var(--muted)' }}>{p.full_name} — {p.split_pct}%</span>
                      <PartySignToggle partyId={p.id} signed={!!p.signed_at} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {splitSheets.length === 0 && (
            <EmptyState title="Aún no hay repartos" text="Cuando subas una canción con más de un autor, prepararemos el reparto y te avisaremos para firmarlo." />
          )}
        </section>
      </div>
    </DashboardShell>
  );
}
