import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabaseClient';
import DashboardShell from '../../_components/DashboardShell';
import TrackStatusSelect from '../../_components/TrackStatusSelect';
import TrackMetaForm from '../../_components/TrackMetaForm';
import SplitSheetForm from '../../_components/SplitSheetForm';
import { getArtist } from '@/lib/dashboardData';
import { TRACK_STATUS_LABELS } from '@/lib/trackStatus';

export default async function TrackDetailPage({ params, searchParams }: { params: { trackId: string }; searchParams: { artist_id?: string } }) {
  const artistId = searchParams.artist_id;
  if (!artistId) return <main style={{ padding: 60 }}>Falta ?artist_id=</main>;

  const artist = await getArtist(artistId);
  if (!artist) return <main style={{ padding: 60 }}>Artista no encontrado.</main>;

  const { data: track } = await supabaseAdmin.from('tracks').select('*').eq('id', params.trackId).single();
  if (!track) return notFound();

  const { data: splitSheets } = await supabaseAdmin
    .from('split_sheets').select('*, split_sheet_parties(*)').eq('track_id', track.id);

  const { data: registrations } = await supabaseAdmin
    .from('registrations').select('*').eq('track_id', track.id);

  const { data: contracts } = await supabaseAdmin
    .from('contracts').select('*').eq('track_id', track.id);

  return (
    <DashboardShell artist={artist} artistId={artistId}>
      <a href={`/dashboard/canciones?artist_id=${artistId}`} style={{ fontSize: 13, color: 'var(--muted)' }}>← Canciones</a>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0 24px' }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>{track.title}</h1>
        <TrackStatusSelect trackId={track.id} status={track.status} />
      </div>

      <section className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Metadata</h2>
        <TrackMetaForm trackId={track.id} isrc={track.isrc} upc={track.upc} releaseDate={track.release_date} />
      </section>

      <section className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Split sheets</h2>
        {(splitSheets ?? []).map((s: any) => (
          <div key={s.id} style={{ marginBottom: 12 }}>
            <a href={`/dashboard/split-sheets/${s.id}`} style={{ textDecoration: 'underline', fontSize: 14 }}>Ver documento</a>
            <span className={`badge badge-${s.status}`} style={{ marginLeft: 8 }}>{s.status}</span>
            <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0' }}>
              {s.split_sheet_parties.map((p: any) => (
                <li key={p.id} style={{ fontSize: 13, color: 'var(--muted)' }}>
                  {p.full_name} — {p.split_pct}% {p.signed_at ? '✅ firmado' : '⏳ pendiente'}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {(!splitSheets || splitSheets.length === 0) && <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 16 }}>Sin split sheet todavía.</p>}
        <SplitSheetForm tracks={[{ id: track.id, title: track.title }]} />
      </section>

      <section className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Registros asociados</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {(registrations ?? []).map((r: any) => (
            <li key={r.id} style={{ fontSize: 14, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
              {r.registration_type} <span className={`badge badge-${r.status}`} style={{ marginLeft: 8 }}>{r.status}</span>
            </li>
          ))}
          {(!registrations || registrations.length === 0) && <li style={{ color: 'var(--muted)', fontSize: 14 }}>Sin registros asociados.</li>}
        </ul>
      </section>

      <section className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Contratos asociados</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {(contracts ?? []).map((c: any) => (
            <li key={c.id} style={{ fontSize: 14, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
              <a href={`/dashboard/contracts/${c.id}`} style={{ textDecoration: 'underline' }}>{c.title || c.contract_type}</a>
            </li>
          ))}
          {(!contracts || contracts.length === 0) && <li style={{ color: 'var(--muted)', fontSize: 14 }}>Sin contratos asociados.</li>}
        </ul>
      </section>

      <section className="card">
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Archivos</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          La carga de archivos (WAV, letra, portada) requiere integrar Supabase Storage — pendiente de habilitar.
        </p>
      </section>
    </DashboardShell>
  );
}
