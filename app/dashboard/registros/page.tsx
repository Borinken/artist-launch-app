import DashboardShell from '../_components/DashboardShell';
import PageHeader from '../_components/PageHeader';
import EmptyState from '../_components/EmptyState';
import { getSessionArtist } from '@/lib/getSessionArtist';
import { getRegistrations } from '@/lib/dashboardData';
import { REGISTRATION_TYPE_LABELS, REGISTRATION_TYPE_PLAIN } from '@/lib/registrationCatalog';

const statusLabel: Record<string, string> = { pending: 'Esperando', in_progress: 'Lo estamos haciendo', completed: 'Listo', blocked: 'Necesita tu atención' };
const statusPill: Record<string, string> = { pending: 'pill-team', in_progress: 'pill-you', completed: 'pill-done', blocked: 'pill-bad' };

export default async function RegistrosPage() {
  const artist = await getSessionArtist();
  if (!artist) return <main style={{ padding: 60 }}>Artista no encontrado.</main>;

  const registrations = await getRegistrations(artist.id);
  const completed = registrations.filter((r) => r.status === 'completed');
  const pending = registrations.filter((r) => r.status !== 'completed');

  return (
    <DashboardShell artist={artist} artistId={artist.id}>
      <PageHeader
        title="Proteger mis derechos"
        subtitle="Estos son los trámites que hacen que tu música sea legalmente tuya y que puedas cobrar por ella."
        tip={<><b>No tienes que hacer nada aquí.</b> Nosotros nos encargamos de tramitarlos; tú solo ves cómo va cada uno.</>}
      />

      <div className="grid-2">
        <section className="card">
          <h2 className="section-title">En marcha ({pending.length})</h2>
          <p className="section-sub">Trámites que todavía se están haciendo.</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {pending.map((r: any) => <RegistrationRow key={r.id} r={r} />)}
          </ul>
          {pending.length === 0 && (
            <EmptyState title="Nada en marcha ahora" text="Cuando empecemos un trámite a tu nombre, lo verás aquí." />
          )}
        </section>

        <section className="card">
          <h2 className="section-title">Listos ({completed.length})</h2>
          <p className="section-sub">Trámites ya terminados.</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {completed.map((r: any) => <RegistrationRow key={r.id} r={r} />)}
          </ul>
          {completed.length === 0 && (
            <EmptyState title="Todavía ninguno" text="Aquí irán apareciendo tus registros terminados." />
          )}
        </section>
      </div>
    </DashboardShell>
  );
}

function RegistrationRow({ r }: { r: any }) {
  return (
    <li style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px' }}>
          <div style={{ fontSize: 15.5, fontWeight: 600 }}>{REGISTRATION_TYPE_LABELS[r.registration_type] ?? r.registration_type}</div>
          <div style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 2 }}>
            {r.tracks?.title ? `Canción: ${r.tracks.title}` : 'Para toda tu obra'}
            {r.status === 'completed' && r.completed_at ? ` · ${new Date(r.completed_at).toLocaleDateString('es')}` : ''}
          </div>
        </div>
        <span className={`pill ${statusPill[r.status] ?? 'pill-team'}`}>{statusLabel[r.status] ?? r.status}</span>
      </div>
      {REGISTRATION_TYPE_PLAIN[r.registration_type] && (
        <p style={{ margin: '8px 0 0', fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.5 }}>
          {REGISTRATION_TYPE_PLAIN[r.registration_type]}
        </p>
      )}
    </li>
  );
}
