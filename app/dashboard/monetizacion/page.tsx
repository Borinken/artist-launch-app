import DashboardShell from '../_components/DashboardShell';
import PageHeader from '../_components/PageHeader';
import EmptyState from '../_components/EmptyState';
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
      <PageHeader
        title="Mis ingresos"
        subtitle="El dinero que ha generado tu música, mes a mes y de dónde viene."
        action={
          royalties.length > 0 ? (
            <a href={`/api/royalties/export?artist_id=${artist.id}`} className="btn btn-ghost">
              Descargar mi reporte (Excel)
            </a>
          ) : undefined
        }
      />

      <div className="grid-tiles" style={{ marginBottom: 24 }}>
        <div className="card">
          <div style={{ fontSize: 14, color: 'var(--muted)' }}>Este mes</div>
          <div style={{ fontSize: 34, fontWeight: 700, fontFamily: 'var(--font-serif)', marginTop: 6 }}>${currentTotal.toFixed(0)}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: 14, color: 'var(--muted)' }}>Mes anterior</div>
          <div style={{ fontSize: 34, fontWeight: 700, fontFamily: 'var(--font-serif)', marginTop: 6 }}>${previousTotal.toFixed(0)}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: 14, color: 'var(--muted)' }}>Comparado con el mes anterior</div>
          <div style={{ fontSize: 34, fontWeight: 700, fontFamily: 'var(--font-serif)', marginTop: 6, color: trendPct === null ? 'var(--muted)' : trendPct >= 0 ? 'var(--success)' : '#f87171' }}>
            {trendPct === null ? '—' : `${trendPct > 0 ? '+' : ''}${trendPct}%`}
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>
            {trendPct === null ? 'aún no hay con qué comparar' : trendPct >= 0 ? 'estás ganando más' : 'estás ganando menos'}
          </div>
        </div>
      </div>

      <section className="card">
        <h2 className="section-title">¿De dónde viene tu dinero?</h2>
        <p className="section-sub">Cada color es una fuente distinta: plataformas, YouTube, conciertos, merch…</p>
        {royalties.length === 0 ? (
          <EmptyState
            title="Aún no hay ingresos registrados"
            text="Cuando tu música empiece a generar dinero, lo verás aquí mes a mes. Los primeros pagos suelen tardar unos meses después del lanzamiento."
          />
        ) : (
          <MonetizationChart data={chartData} />
        )}
      </section>
    </DashboardShell>
  );
}
