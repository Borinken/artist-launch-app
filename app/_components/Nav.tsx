'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LINKS = [
  { href: '#proceso', label: 'Cómo funciona' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#planes', label: 'Precios' },
  { href: '#faq', label: 'FAQ' },
];

const DEMO_ARTIST = '5a0056f9-1445-4960-9cc5-a478b4865d5d';

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '18px 24px', transition: 'background 0.3s, border-color 0.3s',
        backdropFilter: solid ? 'blur(14px)' : 'none',
        background: solid ? 'rgba(10,10,12,0.85)' : 'transparent',
        borderBottom: solid ? '1px solid var(--border)' : '1px solid transparent',
      }}>
        <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.01em', fontFamily: 'var(--font-serif)' }}>Artist Launch OS</span>

        <div className="nav-links" style={{ display: 'flex', gap: 28, alignItems: 'center', fontSize: 14 }}>
          {LINKS.map((l) => <a key={l.href} href={l.href} style={{ color: 'var(--muted)' }}>{l.label}</a>)}
          <a href={`/dashboard?artist_id=${DEMO_ARTIST}`} className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: 13 }}>Iniciar sesión</a>
          <a href="#planes" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>Solicitar auditoría gratis</a>
        </div>

        <button
          className="nav-burger"
          onClick={() => setMenuOpen(true)}
          style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text)', fontSize: 22, cursor: 'pointer' }}
          aria-label="Abrir menú"
        >
          ☰
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(10,10,12,0.98)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28,
            }}
          >
            <button
              onClick={() => setMenuOpen(false)}
              style={{ position: 'absolute', top: 20, right: 24, background: 'none', border: 'none', color: 'var(--text)', fontSize: 28, cursor: 'pointer' }}
              aria-label="Cerrar menú"
            >
              ×
            </button>
            {[...LINKS, { href: '#planes', label: 'Empezar ahora' }].map((l, i) => (
              <motion.a
                key={l.href + i}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                style={{ fontSize: 24, fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
              >
                {l.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 780px) {
          .nav-links { display: none !important; }
          .nav-burger { display: block !important; }
        }
      `}</style>
    </>
  );
}
