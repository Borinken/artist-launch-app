import DashboardShell from '../_components/DashboardShell';
import PartySignToggle from '../_components/PartySignToggle';
import { getSessionArtist } from '@/lib/getSessionArtist';
import { getTracks, getContracts, getSplitSheetsForTracks } from '@/lib/dashboardData';
import { CONTRACT_TYPE_LABELS } from '@/lib/contractTemplates';

const statusLabel: Record<string, string> = { draft: 'Borrador', sent: 'Enviado', signed: 'Firmado', pending: 'Pendiente', disputed: 'Disputado' };

export default async function ContratosPage() {
  const artist = await getSessionArtist();
  if (!artist) return <main style={{ padding: 60 }}>Artista no encontrado.</main>;

  const tracks = await getTracks(artist.id);
  const [contracts, splitSheets] = await Promise.all([
    getContracts(artist.id), getSplitSheetsForTracks(tracks.map((t) => t.id)),
  ]);

  return (
    <DashboardShell artist={artist} artistId={artist.id}>
      <h1 style={{ margin: '0 0 4px', fontSize: 28 }}>Mis contratos</h1>
      <p style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 24px' }}>
        Tus documentos generados por Royal Music Growth. Descárgalos o fírmalos aquí.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <section className="card">
          <h2 style={{ marginTop: 0, fontSize: 16 }}>Contratos y LOD</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
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
        </section>

        <section className="card">
          <h2 style={{ marginTop: 0, fontSize: 16 }}>Split sheets</h2>
          <div>
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
        </section>
      </div>
    </DashboardShell>
  );
}
