import { supabaseAdmin } from '@/lib/supabaseClient';
import TrackForm from './_components/TrackForm';
import SplitSheetForm from './_components/SplitSheetForm';
import ContractGenerator from './_components/ContractGenerator';
import ProgressChart from './_components/ProgressChart';
import { CONTRACT_TYPE_LABELS } from '@/lib/contractTemplates';

async function getArtistData(artistId: string) {
  const { data: artist } = await supabaseAdmin
    .from('artists')
    .select('*')
    .eq('id', artistId)
    .single();

  const { data: registrations } = await supabaseAdmin
    .from('registrations')
    .select('*')
    .eq('artist_id', artistId)
    .order('created_at', { ascending: false });

  const { data: tracks } = await supabaseAdmin
    .from('tracks')
    .select('*')
    .eq('artist_id', artistId)
    .order('created_at', { ascending: false });

  const { data: calendarEvents } = await supabaseAdmin
    .from('calendar_events')
    .select('*')
    .eq('artist_id', artistId)
    .gte('event_date', new Date().toISOString().slice(0, 10))
    .order('event_date', { ascending: true })
    .limit(5);

  const { data: contracts } = await supabaseAdmin
    .from('contracts')
    .select('*, tracks(title)')
    .eq('artist_id', artistId)
    .order('created_at', { ascending: false });

  const trackIds = (tracks ?? []).map((t) => t.id);
  const { data: splitSheets } = trackIds.length
    ? await supabaseAdmin
        .from('split_sheets')
        .select('*, tracks(title)')
        .in('track_id', trackIds)
        .order('created_at', { ascending: false })
    : { data: [] as any[] };

  return {
    artist,
    registrations: registrations ?? [],
    tracks: tracks ?? [],
    calendarEvents: calendarEvents ?? [],
    contracts: contracts ?? [],
    splitSheets: splitSheets ?? [],
  };
}

const statusLabel: Record<string, string> = {
  pending: 'Pendiente',
  in_progress: 'En proceso',
  completed: 'Completo',
  blocked: 'Bloqueado',
  draft: 'Borrador',
  sent: 'Enviado',
  signed: 'Firmado',
  disputed: 'Disputado',
};

const planLabel: Record<string, string> = { start: 'Start', pro: 'Pro', studio: 'Studio' };

export default async function DashboardPage({ searchParams }: { searchParams: { artist_id?: string } }) {
  const artistId = searchParams.artist_id;

  if (!artistId) {
    return (
      <main style={{ maxWidth: 720, margin: '0 auto', padding: 60, fontFamily: 'system-ui' }}>
        <p>Falta el parámetro <code>?artist_id=</code> en la URL. En producción esto vendría de la sesión autenticada.</p>
      </main>
    );
  }

  const { artist, registrations, tracks, calendarEvents, contracts, splitSheets } = await getArtistData(artistId);

  if (!artist) {
    return (
      <main style={{ maxWidth: 720, margin: '0 auto', padding: 60, fontFamily: 'system-ui' }}>
        <p>Artista no encontrado.</p>
      </main>
    );
  }

  const registrationsByStatus = ['pending', 'in_progress', 'completed', 'blocked']
    .map((status) => ({ status, count: registrations.filter((r) => r.status === status).length }))
    .filter((r) => r.count > 0);

  const trackOptions = tracks.map((t) => ({ id: t.id, title: t.title }));

  return (
    <main style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px 80px', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 32 }}>{artist.artist_name || artist.legal_name}</h1>
          <p style={{ color: 'var(--muted)', margin: '6px 0 0' }}>{artist.legal_name}</p>
        </div>
        <span className="badge" style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc', fontSize: 13, padding: '6px 16px' }}>
          Plan {planLabel[artist.plan] ?? artist.plan}
        </span>
      </header>

      <section className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Progreso de carrera</h2>
        <ProgressChart progressPct={artist.career_progress_pct ?? 0} registrationsByStatus={registrationsByStatus} />
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <section className="card">
          <h2 style={{ marginTop: 0, fontSize: 16 }}>Registros</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {registrations.map((r) => (
              <li key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                <span>{r.registration_type} <span style={{ color: 'var(--muted)' }}>· {r.provider ?? '—'}</span></span>
                <span className={`badge badge-${r.status}`}>{statusLabel[r.status] ?? r.status}</span>
              </li>
            ))}
            {registrations.length === 0 && <li style={{ color: 'var(--muted)', fontSize: 14 }}>Sin registros todavía.</li>}
          </ul>
        </section>

        <section className="card">
          <h2 style={{ marginTop: 0, fontSize: 16 }}>Próximas fechas</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {calendarEvents.map((e) => (
              <li key={e.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                <strong>{e.event_date}</strong> — {e.title}
              </li>
            ))}
            {calendarEvents.length === 0 && <li style={{ color: 'var(--muted)', fontSize: 14 }}>Sin fechas próximas.</li>}
          </ul>
        </section>
      </div>

      <section className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Canciones</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px' }}>
          {tracks.map((t) => (
            <li key={t.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
              <span>{t.title} <span style={{ color: 'var(--muted)' }}>· {t.release_type}</span></span>
              <span className={`badge badge-${t.status}`}>{t.status}</span>
            </li>
          ))}
          {tracks.length === 0 && <li style={{ color: 'var(--muted)', fontSize: 14 }}>Sin canciones registradas todavía.</li>}
        </ul>
        <TrackForm artistId={artistId} />
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <section className="card">
          <h2 style={{ marginTop: 0, fontSize: 16 }}>Split sheets</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px' }}>
            {splitSheets.map((s: any) => (
              <li key={s.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
                <a href={`/dashboard/split-sheets/${s.id}`} style={{ textDecoration: 'underline' }}>{s.tracks?.title ?? 'Obra'}</a>
                <span className={`badge badge-${s.status}`}>{statusLabel[s.status] ?? s.status}</span>
              </li>
            ))}
            {splitSheets.length === 0 && <li style={{ color: 'var(--muted)', fontSize: 14 }}>Sin split sheets todavía.</li>}
          </ul>
          <SplitSheetForm tracks={trackOptions} />
        </section>

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
      </div>
    </main>
  );
}
