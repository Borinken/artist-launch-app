import AdminShell from './_components/AdminShell';
import { getAllArtists } from '@/lib/adminData';

const planLabel: Record<string, string> = { start: 'Start', pro: 'Pro', studio: 'Studio' };

export default async function AdminArtistsPage() {
  const artists = await getAllArtists();

  return (
    <AdminShell>
      <h1 style={{ margin: '0 0 24px', fontSize: 28, fontFamily: 'var(--font-serif)' }}>Artistas</h1>

      <section className="card">
        {artists.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Sin artistas todavía.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px 4px', borderBottom: '1px solid var(--border)', fontSize: 12, color: 'var(--muted)' }}>Artista</th>
                <th style={{ textAlign: 'left', padding: '8px 4px', borderBottom: '1px solid var(--border)', fontSize: 12, color: 'var(--muted)' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '8px 4px', borderBottom: '1px solid var(--border)', fontSize: 12, color: 'var(--muted)' }}>Plan</th>
                <th style={{ textAlign: 'left', padding: '8px 4px', borderBottom: '1px solid var(--border)', fontSize: 12, color: 'var(--muted)' }}>País</th>
                <th style={{ textAlign: 'right', padding: '8px 4px', borderBottom: '1px solid var(--border)', fontSize: 12, color: 'var(--muted)' }}>Progreso</th>
              </tr>
            </thead>
            <tbody>
              {artists.map((a: any) => (
                <tr key={a.id}>
                  <td style={{ padding: '10px 4px', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                    <a href={`/admin/${a.id}`} style={{ textDecoration: 'underline' }}>{a.artist_name || a.legal_name}</a>
                  </td>
                  <td style={{ padding: '10px 4px', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--muted)' }}>{a.email}</td>
                  <td style={{ padding: '10px 4px', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                    <span className="badge" style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--accent)' }}>{planLabel[a.plan] ?? a.plan}</span>
                  </td>
                  <td style={{ padding: '10px 4px', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--muted)' }}>{a.country ?? '—'}</td>
                  <td style={{ padding: '10px 4px', borderBottom: '1px solid var(--border)', fontSize: 14, textAlign: 'right' }}>{a.career_progress_pct ?? 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </AdminShell>
  );
}
