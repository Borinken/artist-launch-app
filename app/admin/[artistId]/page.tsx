import { notFound } from 'next/navigation';
import AdminShell from '../_components/AdminShell';
import AdminRegistrationStatus from '../_components/AdminRegistrationStatus';
import RegistrationRequestForm from '../../dashboard/_components/RegistrationRequestForm';
import ContractGenerator from '../../dashboard/_components/ContractGenerator';
import SplitSheetForm from '../../dashboard/_components/SplitSheetForm';
import PartySignToggle from '../../dashboard/_components/PartySignToggle';
import RoyaltyForm from '../../dashboard/_components/RoyaltyForm';
import {
  getArtist, getTracks, getRegistrations, getContracts, getSplitSheetsForTracks,
} from '@/lib/dashboardData';
import { REGISTRATION_TYPE_LABELS, formatCost, getRegistrationCatalog } from '@/lib/registrationCatalog';
import { CONTRACT_TYPE_LABELS } from '@/lib/contractTemplates';

const statusLabel: Record<string, string> = { pending: 'Pendiente', in_progress: 'En proceso', completed: 'Completo', blocked: 'Bloqueado', draft: 'Borrador', sent: 'Enviado', signed: 'Firmado', disputed: 'Disputado' };
const planLabel: Record<string, string> = { start: 'Start', pro: 'Pro', studio: 'Studio' };

export default async function AdminArtistPage({ params }: { params: { artistId: string } }) {
  const artist = await getArtist(params.artistId);
  if (!artist) return notFound();

  const tracks = await getTracks(artist.id);
  const [registrations, contracts, splitSheets] = await Promise.all([
    getRegistrations(artist.id), getContracts(artist.id), getSplitSheetsForTracks(tracks.map((t) => t.id)),
  ]);
  const trackOptions = tracks.map((t) => ({ id: t.id, title: t.title }));
  const catalog = getRegistrationCatalog(artist.country);
  const isSpain = artist.country?.trim().toLowerCase() === 'españa' || artist.country?.trim().toLowerCase() === 'spain';
  const currencySymbol = isSpain ? '€' : '$';

  return (
    <AdminShell>
      <a href="/admin" style={{ fontSize: 13, color: 'var(--muted)' }}>← Artistas</a>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0 24px', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontFamily: 'var(--font-serif)' }}>{artist.artist_name || artist.legal_name}</h1>
          <p style={{ color: 'var(--muted)', margin: '4px 0 0', fontSize: 14 }}>{artist.email} · {artist.country ?? 'sin país'}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="badge" style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--accent)' }}>Plan {planLabel[artist.plan] ?? artist.plan}</span>
          <a href={`/admin/${artist.id}/facturacion`} className="btn btn-ghost" style={{ padding: '6px 16px', fontSize: 13 }}>Facturación</a>
        </div>
      </div>

      <section className="card" style={{ marginBottom: 24, overflowX: 'auto' }}>
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Tramitar registro</h2>
        <RegistrationRequestForm artistId={artist.id} tracks={trackOptions} country={artist.country} />
      </section>

      <section className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Registros ({registrations.length})</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '6px 4px', borderBottom: '1px solid var(--border)', fontSize: 12, color: 'var(--muted)' }}>Servicio</th>
              <th style={{ textAlign: 'left', padding: '6px 4px', borderBottom: '1px solid var(--border)', fontSize: 12, color: 'var(--muted)' }}>Proveedor</th>
              <th style={{ textAlign: 'right', padding: '6px 4px', borderBottom: '1px solid var(--border)', fontSize: 12, color: 'var(--muted)' }}>Costo</th>
              <th style={{ textAlign: 'left', padding: '6px 4px', borderBottom: '1px solid var(--border)', fontSize: 12, color: 'var(--muted)' }}>Estatus</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((r: any) => (
              <tr key={r.id}>
                <td style={{ padding: '6px 4px', borderBottom: '1px solid var(--border)' }}>{REGISTRATION_TYPE_LABELS[r.registration_type] ?? r.registration_type} <span style={{ color: 'var(--muted)' }}>· {r.tracks?.title ?? 'General'}</span></td>
                <td style={{ padding: '6px 4px', borderBottom: '1px solid var(--border)', color: 'var(--muted)' }}>{r.provider ?? '—'}</td>
                <td style={{ padding: '6px 4px', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>{formatCost(r.cost_cents, r.currency)}</td>
                <td style={{ padding: '6px 4px', borderBottom: '1px solid var(--border)' }}>
                  <AdminRegistrationStatus id={r.id} status={r.status} externalReference={r.external_reference} />
                </td>
              </tr>
            ))}
            {registrations.length === 0 && <tr><td colSpan={4} style={{ color: 'var(--muted)', fontSize: 14, padding: '8px 4px' }}>Sin registros todavía.</td></tr>}
          </tbody>
        </table>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <section className="card">
          <h2 style={{ marginTop: 0, fontSize: 16 }}>Generar contrato / LOD</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px' }}>
            {contracts.map((c: any) => (
              <li key={c.id} style={{ padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 13, display: 'flex', justifyContent: 'space-between' }}>
                <a href={`/dashboard/contracts/${c.id}`} style={{ textDecoration: 'underline' }}>{c.title || CONTRACT_TYPE_LABELS[c.contract_type] || c.contract_type}</a>
                <span className={`badge badge-${c.status}`}>{statusLabel[c.status] ?? c.status}</span>
              </li>
            ))}
            {contracts.length === 0 && <li style={{ color: 'var(--muted)', fontSize: 13 }}>Sin documentos todavía.</li>}
          </ul>
          <ContractGenerator artistId={artist.id} tracks={trackOptions} />
        </section>

        <section className="card">
          <h2 style={{ marginTop: 0, fontSize: 16 }}>Split sheets</h2>
          <div style={{ marginBottom: 16 }}>
            {splitSheets.map((s: any) => (
              <div key={s.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <a href={`/dashboard/split-sheets/${s.id}`} style={{ textDecoration: 'underline' }}>{s.tracks?.title ?? 'Obra'}</a>
                  <span className={`badge badge-${s.status}`}>{statusLabel[s.status] ?? s.status}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                  {s.split_sheet_parties.map((p: any) => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                      <span style={{ color: 'var(--muted)' }}>{p.full_name} ({p.split_pct}%)</span>
                      <PartySignToggle partyId={p.id} signed={!!p.signed_at} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {splitSheets.length === 0 && <p style={{ color: 'var(--muted)', fontSize: 13 }}>Sin split sheets todavía.</p>}
          </div>
          <SplitSheetForm tracks={trackOptions} />
        </section>
      </div>

      <section className="card">
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Registrar ingreso de monetización</h2>
        <RoyaltyForm artistId={artist.id} />
      </section>
    </AdminShell>
  );
}
