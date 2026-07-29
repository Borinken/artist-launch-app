import DashboardShell from '../_components/DashboardShell';
import MonetizationChart from '../_components/MonetizationChart';
import { getSessionArtist } from '@/lib/getSessionArtist';
import { getRoyalties } from '@/lib/dashboardData';

export default async function MonetizacionPage() {
  const artist = await getSessionArtist();
  if (!artist) return <main style={{ padding: 60 }}>Artista no encontrado.</main>;

  const royalties = await getRoyalties(artist.id);

  const byMonth: Record<string, Record<string, number>> = {};
  for (const r of royalties) {
    const month = (r.period_month as string).slice(0, 7);
    byMonth[month] = byMonth[month] || {};
    byMonth[month][r.source] = (byMonth[month][r.source] ?? 0) + r.amount_cents / 100;
  }
  const months = Object.keys(byMonth).sort();
  const chartData = months.map((month) => ({ month, ...byMonth[month] }));

  const totalFor = (month: string) => Object.values(byMonth[month] ?? {}).reduce((a, b) => a + b, 0);
  const currentMonth = months[months.length - 1];
  const previousMonth = months[months.length - 2];
  const currentTotal = currentMonth ? totalFor(currentMonth) : 0;
  const previousTotal = previousMonth ? totalFor(previousMonth) : 0;
  const trendPct = previousTotal > 0 ? Math.round(((currentTotal - previousTotal) / previousTotal) * 100) : null;

  return (
    <DashboardShell artist={artist} artistId={artist.id}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>Mi monetización</h1>
        <a href={`/api/royalties/export?artist_id=${artist.id}`} className="btn btn-ghost" style={{ fontSize: 13, padding: '8px 16px' }}>
          ⬇ Descargar reporte (Excel/CSV)
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="card">
          <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase' }}>Este mes</div>
          <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-serif)' }}>${currentTotal.toFixed(0)}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase' }}>Mes anterior</div>
          <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-serif)' }}>${previousTotal.toFixed(0)}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase' }}>Tendencia</div>
          <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-serif)', color: trendPct === null ? 'var(--muted)' : trendPct >= 0 ? 'var(--success)' : '#f87171' }}>
            {trendPct === null ? '—' : `${trendPct > 0 ? '+' : ''}${trendPct}%`}
          </div>
        </div>
      </div>

      <section className="card">
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Ingresos por fuente</h2>
        <MonetizationChart data={chartData} />
      </section>
    </DashboardShell>
  );
}
