'use client';

import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Resumen', exact: true },
  { href: '/dashboard/perfil', label: 'Perfil' },
  { href: '/dashboard/canciones', label: 'Canciones' },
  { href: '/dashboard/distribucion', label: 'Distribución' },
  { href: '/dashboard/registros', label: 'Registros' },
  { href: '/dashboard/contratos', label: 'Contratos' },
  { href: '/dashboard/equipo', label: 'Equipo' },
  { href: '/dashboard/monetizacion', label: 'Monetización' },
  { href: '/dashboard/redes', label: 'Redes sociales' },
  { href: '/dashboard/calendario', label: 'Calendario' },
];

const planLabel: Record<string, string> = { start: 'Start', pro: 'Pro', studio: 'Studio' };

export default function DashboardShell({
  artist,
  artistId,
  children,
}: {
  artist: { artist_name: string | null; legal_name: string; plan: string };
  artistId: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const qs = `?artist_id=${artistId}`;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{
        width: 240, flexShrink: 0, borderRight: '1px solid var(--border)',
        padding: '24px 16px', position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '0 8px', marginBottom: 24 }}>
          <span style={{ fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-serif)' }}>Artist Launch OS</span>
        </div>

        <div style={{ padding: '10px 8px', marginBottom: 20, borderRadius: 12, background: 'var(--card)' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', marginBottom: 8,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#0a0a0c',
          }}>
            {(artist.artist_name || artist.legal_name || '?').charAt(0).toUpperCase()}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{artist.artist_name || artist.legal_name}</div>
          <span className="badge" style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--accent)', fontSize: 11, padding: '2px 10px', marginTop: 4, display: 'inline-block' }}>
            Plan {planLabel[artist.plan] ?? artist.plan}
          </span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <a
                key={item.href}
                href={`${item.href}${qs}`}
                style={{
                  padding: '10px 12px', borderRadius: 8, fontSize: 14,
                  color: isActive ? 'var(--text)' : 'var(--muted)',
                  background: isActive ? 'var(--card)' : 'transparent',
                  borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                  transition: 'background 0.15s',
                }}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <a href="/" style={{ fontSize: 12, color: 'var(--muted)', padding: '10px 12px' }}>← Volver al sitio</a>
      </aside>

      <main style={{ flex: 1, padding: '40px 32px 80px', maxWidth: 1000 }}>
        {children}
      </main>
    </div>
  );
}
