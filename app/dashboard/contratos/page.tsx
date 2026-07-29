import DashboardShell from '../_components/DashboardShell';
import ContractGenerator from '../_components/ContractGenerator';
import SplitSheetForm from '../_components/SplitSheetForm';
import PartySignToggle from '../_components/PartySignToggle';
import { getArtist, getTracks, getContracts, getSplitSheetsForTracks } from '@/lib/dashboardData';
import { CONTRACT_TYPE_LABELS } from '@/lib/contractTemplates';

const statusLabel: Record<string, string> = { draft: 'Borrador', sent: 'Enviado', signed: 'Firmado', pending: 'Pendiente', disputed: 'Disputado' };

export default async function ContratosPage({ searchParams }: { searchParams: { artist_id?: string } }) {
  const artistId = searchParams.artist_id;
  if (!artistId) return <main style={{ padding: 60 }}>Falta ?artist_id=</main>;

  const artist = await getArtist(artistId);
  if (!artist) return <main style={{ padding: 60 }}>Artista no encontrado.</main>;

  const tracks = await getTracks(artistId);
  const [contracts, splitSheets] = await Promise.all([
    getContracts(artistId), getSplitSheetsForTracks(tracks.map((t) => t.id)),
  ]);
  const trackOptions = tracks.map((t) => ({ id: t.id, title: t.title }));

  return (
    <DashboardShell artist={artist} artistId={artistId}>
      <h1 style={{ margin: '0 0 24px', fontSize: 28 }}>Contratos y Split Sheets</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <section className="card">
          <h2 style={{ marginTop: 0, fontSize: 16 }}>Contratos y LOD</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px' }}>
            {contracts.map((c: any) => (
              <li key={c.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
                <a href={`/dashboard/contracts/${c.id}`} style={{ textDecoration: 'underline' }}>
                  {c.title || CONTRACT_TYPE_LABELS[c.contract_type] || c.contract_type}
                </a>
                <span className={`badge badge-${c.status}`}>{statusLabel[c.status] ?? c.status}</span>
              </li>
            ))}
            {contracts.length === 0 && <li style={{ color: 'var(--muted)', fontSize: 14 }}>Sin documentos generados todavía.</li>}
          </ul>
          <ContractGenerator artistId={artistId} tracks={trackOptions} />
        </section>

        <section className="card">
          <h2 style={{ marginTop: 0, fontSize: 16 }}>Split sheets</h2>
          <div style={{ marginBottom: 16 }}>
            {splitSheets.map((s: any) => (
              <div key={s.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <a href={`/dashboard/split-sheets/${s.id}`} style={{ textDecoration: 'underline' }}>{s.tracks?.title ?? 'Obra'}</a>
                  <span className={`badge badge-${s.status}`}>{statusLabel[s.status] ?? s.status}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                  {s.split_sheet_parties.map((p: any) => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                      <span style={{ color: 'var(--muted)' }}>{p.full_name} ({p.split_pct}%)</span>
                      <PartySignToggle partyId={p.id} signed={!!p.signed_at} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {splitSheets.length === 0 && <p style={{ color: 'var(--muted)', fontSize: 14 }}>Sin split sheets todavía.</p>}
          </div>
          <SplitSheetForm tracks={trackOptions} />
        </section>
      </div>
    </DashboardShell>
  );
}
