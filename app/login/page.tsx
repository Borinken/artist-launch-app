'use client';

import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabaseBrowser.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  return (
    <main style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-sans)', padding: 24,
    }}>
      <div className="card" style={{ maxWidth: 380, width: '100%' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, margin: '0 0 8px' }}>Iniciar sesión</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 24px' }}>
          Te enviamos un link mágico a tu email — sin contraseña.
        </p>

        {sent ? (
          <p style={{ color: 'var(--success)', fontSize: 14 }}>
            ✅ Revisa tu correo <strong>{email}</strong> y haz clic en el link para entrar.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ marginBottom: 16 }}
            />
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Enviando…' : 'Enviar link mágico'}
            </button>
            {error && <p style={{ color: '#f87171', fontSize: 13, marginTop: 12 }}>{error}</p>}
          </form>
        )}
      </div>
    </main>
  );
}
