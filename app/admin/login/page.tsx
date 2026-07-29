'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError('Contraseña incorrecta');
      return;
    }
    router.push('/admin');
    router.refresh();
  }

  return (
    <main style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-sans)', padding: 24,
    }}>
      <div className="card" style={{ maxWidth: 380, width: '100%' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, margin: '0 0 8px' }}>Panel de Gestión</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 24px' }}>Royal Music Growth — acceso interno</p>
        <form onSubmit={handleSubmit}>
          <label className="label">Contraseña</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ marginBottom: 16 }}
          />
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
          {error && <p style={{ color: '#f87171', fontSize: 13, marginTop: 12 }}>{error}</p>}
        </form>
      </div>
    </main>
  );
}
