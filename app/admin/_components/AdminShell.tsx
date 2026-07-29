'use client';

import { useRouter } from 'next/navigation';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px',
        borderBottom: '1px solid var(--border)',
      }}>
        <a href="/admin" style={{ fontWeight: 700, fontFamily: 'var(--font-serif)' }}>Royal Music Growth — Panel de Gestión</a>
        <button
          onClick={handleLogout}
          style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Cerrar sesión
        </button>
      </nav>
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 80px' }}>{children}</main>
    </div>
  );
}
