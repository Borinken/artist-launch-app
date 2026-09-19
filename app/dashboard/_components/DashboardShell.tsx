'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import Icon from './Icon';

// Menú agrupado y con palabras de todos los días — sin jerga técnica.
const NAV_GROUPS: { title: string | null; items: { href: string; label: string; icon: string; exact?: boolean }[] }[] = [
  { title: null, items: [{ href: '/dashboard', label: 'Inicio', icon: 'home', exact: true }] },
  {
    title: 'Tu música',
    items: [
      { href: '/dashboard/canciones', label: 'Mis canciones', icon: 'music' },
      { href: '/dashboard/distribucion', label: 'Publicar mi música', icon: 'upload' },
      { href: '/dashboard/registros', label: 'Proteger mis derechos', icon: 'shield' },
      { href: '/dashboard/contratos', label: 'Contratos y firmas', icon: 'file' },
    ],
  },
  { title: 'Tu dinero', items: [{ href: '/dashboard/monetizacion', label: 'Mis ingresos', icon: 'money' }] },
  {
    title: 'Tu carrera',
    items: [
      { href: '/dashboard/equipo', label: 'Mi equipo', icon: 'users' },
      { href: '/dashboard/redes', label: 'Mis redes sociales', icon: 'share' },
      { href: '/dashboard/calendario', label: 'Mis fechas', icon: 'calendar' },
      { href: '/dashboard/perfil', label: 'Mis datos', icon: 'user' },
    ],
  },
];

const planLabel: Record<string, string> = { start: 'Starter', pro: 'Professional', studio: 'Elite' };

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
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await supabaseBrowser.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  const displayName = artist.artist_name || artist.legal_name;

  return (
    <div className="dash-shell">
      <div className="dash-topbar">
        <span style={{ fontWeight: 700, fontFamily: 'var(--font-serif)' }}>Artist Launch OS</span>
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          className="btn btn-ghost"
          style={{ padding: '8px 14px', fontSize: 14 }}
        >
          <Icon name="menu" size={18} /> Menú
        </button>
      </div>

      {open && <div className="dash-scrim" onClick={() => setOpen(false)} />}

      <aside className={`dash-side${open ? ' open' : ''}`}>
        <div style={{ padding: '0 8px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: 16, fontFamily: 'var(--font-serif)' }}>Artist Launch OS</span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            className="dash-close"
            style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', display: open ? 'block' : 'none' }}
          >
            <Icon name="close" />
          </button>
        </div>

        <div style={{ padding: 12, marginBottom: 8, borderRadius: 12, background: 'var(--card)', display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: '#0a0a0c',
          }}>
            {(displayName || '?').charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</div>
            <div style={{ fontSize: 12.5, color: 'var(--accent-3)' }}>Plan {planLabel[artist.plan] ?? artist.plan}</div>
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          {NAV_GROUPS.map((group, gi) => (
            <div key={gi}>
              {group.title && <div className="nav-group-title">{group.title}</div>}
              {group.items.map((item) => {
                const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`nav-link${isActive ? ' active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                  >
                    <Icon name={item.icon} />
                    {item.label}
                  </a>
                );
              })}
            </div>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 12 }}>
          <a
            href="/dashboard/ayuda"
            className={`nav-link${pathname.startsWith('/dashboard/ayuda') ? ' active' : ''}`}
            onClick={() => setOpen(false)}
          >
            <Icon name="help" />
            ¿Necesitas ayuda?
          </a>
          <button
            onClick={handleLogout}
            style={{
              fontSize: 13.5, color: 'var(--muted)', padding: '10px 12px', background: 'none',
              border: 'none', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', width: '100%',
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="dash-main">{children}</main>
    </div>
  );
}
