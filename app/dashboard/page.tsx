import DashboardShell from './_components/DashboardShell';
import Icon from './_components/Icon';
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
  const doneCount = checklist.filter((c) => c.done).length;
  const pct = Math.round((doneCount / checklist.length) * 100);

  // Próximo paso: lo primero que le toca al artista; si todo lo suyo está hecho,
  // lo primero que está en manos del equipo; y si no queda nada, celebrar.
  const nextForYou = checklist.find((c) => !c.done && c.who === 'tu');
  const nextForTeam = checklist.find((c) => !c.done && c.who === 'equipo');

  const completedRegs = registrations.filter((r) => r.status === 'completed').length;
  const pendingSignatures = contracts.filter((c) => c.status !== 'signed').length + splitSheets.filter((s: any) => s.status !== 'signed').length;
  const thisMonth = new Date().toISOString().slice(0, 7);
  const monetizationThisMonth = royalties
    .filter((r) => r.period_month?.slice(0, 7) === thisMonth)
    .reduce((sum, r) => sum + (r.amount_cents ?? 0), 0);

  const firstName = (artist.artist_name || artist.legal_name || '').split(' ')[0];

  return (
    <DashboardShell artist={artist} artistId={artistId}>
      <header className="page-head">
        <h1>Hola, {firstName}</h1>
        <p>Aquí tienes todo lo de tu carrera musical en un solo lugar. Empieza por lo que te marcamos abajo.</p>
      </header>

      {/* PRÓXIMO PASO */}
      <section
        className="card"
        style={{
          marginBottom: 24, padding: 28,
          background: 'linear-gradient(160deg, rgba(212,175,55,0.12), var(--card) 60%)',
          borderColor: 'rgba(212,175,55,0.4)',
        }}
      >
        {nextForYou ? (
          <>
            <div style={{ fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-3)', fontWeight: 600, marginBottom: 8 }}>
              Tu próximo paso
            </div>
            <h2 style={{ margin: '0 0 10px', fontSize: 'clamp(22px, 3.5vw, 28px)' }}>{nextForYou.label}</h2>
            <p style={{ margin: '0 0 20px', color: 'var(--muted)', fontSize: 16, lineHeight: 1.6, maxWidth: '58ch' }}>{nextForYou.why}</p>
            <a href={nextForYou.href} className="btn btn-primary btn-lg">{nextForYou.cta} →</a>
          </>
        ) : nextForTeam ? (
          <>
            <div style={{ fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-3)', fontWeight: 600, marginBottom: 8 }}>
              Por tu parte, todo listo
            </div>
            <h2 style={{ margin: '0 0 10px', fontSize: 'clamp(22px, 3.5vw, 28px)' }}>Ahora nos toca a nosotros</h2>
            <p style={{ margin: '0 0 20px', color: 'var(--muted)', fontSize: 16, lineHeight: 1.6, maxWidth: '58ch' }}>
              {nextForTeam.label}. {nextForTeam.why}
            </p>
            <a href={nextForTeam.href} className="btn btn-ghost btn-lg">{nextForTeam.cta}</a>
          </>
        ) : (
          <>
            <div style={{ fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#34d399', fontWeight: 600, marginBottom: 8 }}>
              Completado
            </div>
            <h2 style={{ margin: '0 0 10px', fontSize: 'clamp(22px, 3.5vw, 28px)' }}>Todo en orden</h2>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: 16, lineHeight: 1.6, maxWidth: '58ch' }}>
              Has completado todos los pasos. Cuando subas una canción nueva, vuelve aquí para ver qué sigue.
            </p>
          </>
        )}

        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
            <span>Llevas <strong>{doneCount} de {checklist.length}</strong> pasos</span>
            <span style={{ color: 'var(--muted)' }}>{pct}%</span>
          </div>
          <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progreso de tu lanzamiento">
            <span style={{ width: `${pct}%` }} />
          </div>
        </div>
      </section>

      {/* DE UN VISTAZO */}
      <h2 className="section-title">De un vistazo</h2>
      <p className="section-sub">Toca cualquier recuadro para ver el detalle.</p>
      <div className="grid-4" style={{ marginBottom: 32 }}>
        <Tile href="/dashboard/canciones" icon="music" label="Canciones" value={tracks.length} note="que has subido" />
        <Tile href="/dashboard/registros" icon="shield" label="Derechos registrados" value={`${completedRegs} de ${registrations.length}`} note="trámites listos" />
        <Tile
          href="/dashboard/contratos" icon="file" label="Firmas pendientes" value={pendingSignatures}
          note={pendingSignatures === 0 ? 'nada por firmar' : 'documentos por firmar'} alert={pendingSignatures > 0}
        />
        <Tile href="/dashboard/monetizacion" icon="money" label="Ingresos este mes" value={`$${(monetizationThisMonth / 100).toFixed(0)}`} note="dinero recibido" />
      </div>

      {/* TU CAMINO */}
      <h2 className="section-title">Tu camino paso a paso</h2>
      <p className="section-sub">Sigue el orden: cada paso prepara el siguiente.</p>
      <section className="card" style={{ padding: '8px 20px', marginBottom: 32 }}>
        <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {checklist.map((item, i) => (
            <li key={item.key} style={{ borderBottom: i < checklist.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <a href={item.href} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '18px 0', textDecoration: 'none', color: 'var(--text)' }}>
                <span
                  aria-hidden="true"
                  style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 15,
                    background: item.done ? 'rgba(52,211,153,0.18)' : 'var(--bg-soft)',
                    color: item.done ? '#34d399' : 'var(--muted)',
                    border: item.done ? '1px solid rgba(52,211,153,0.5)' : '1px solid var(--border)',
                  }}
                >
                  {item.done ? <Icon name="check" size={18} /> : i + 1}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 16, fontWeight: 600 }}>{item.label}</span>
                  <span style={{ display: 'block', fontSize: 14, color: 'var(--muted)', marginTop: 2, lineHeight: 1.45 }}>{item.why}</span>
                </span>
                {item.done
                  ? <span className="pill pill-done">Hecho</span>
                  : item.who === 'tu'
                    ? <span className="pill pill-you">Te toca a ti</span>
                    : <span className="pill pill-team">Lo hacemos nosotros</span>}
              </a>
            </li>
          ))}
        </ol>
      </section>

      {/* AYUDA */}
      <section className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 260px' }}>
          <h2 className="section-title" style={{ fontSize: 17 }}>¿Algo no queda claro?</h2>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: 15, lineHeight: 1.5 }}>
            Te explicamos cada palabra rara con ejemplos, o nos escribes y te respondemos.
          </p>
        </div>
        <a href="/dashboard/ayuda" className="btn btn-ghost">Ver ayuda</a>
      </section>
    </DashboardShell>
  );
}

function Tile({
  href, icon, label, value, note, alert,
}: { href: string; icon: string; label: string; value: string | number; note: string; alert?: boolean }) {
  return (
    <a href={href} className="card tile" style={{ color: 'var(--text)', borderColor: alert ? 'rgba(212,175,55,0.5)' : undefined }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--muted)', fontSize: 14 }}>
        <Icon name={icon} size={18} /> {label}
      </div>
      <div style={{ fontSize: 34, fontWeight: 700, marginTop: 8, fontFamily: 'var(--font-serif)', color: alert ? 'var(--accent-3)' : undefined }}>{value}</div>
      <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>{note}</div>
    </a>
  );
}
