'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROYALTY_SOURCES } from '@/lib/royaltySources';

export default function RoyaltyForm({ artistId }: { artistId: string }) {
  const router = useRouter();
  const [source, setSource] = useState(ROYALTY_SOURCES[0].value);
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch('/api/royalties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        artist_id: artistId,
        source,
        amount_cents: Math.round(Number(amount || 0) * 100),
        period_month: `${month}-01`,
        notes: notes || undefined,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? 'Error al guardar');
      return;
    }
    setAmount('');
    setNotes('');
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <div style={{ flex: '2 1 200px' }}>
          <label className="label">Fuente</label>
          <select className="input" value={source} onChange={(e) => setSource(e.target.value)}>
            {ROYALTY_SOURCES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div style={{ flex: '1 1 120px' }}>
          <label className="label">Mes</label>
          <input className="input" type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
        </div>
        <div style={{ flex: '1 1 120px' }}>
          <label className="label">Monto</label>
          <input className="input" type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label className="label">Notas (opcional)</label>
        <input className="input" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Guardando…' : '+ Agregar ingreso'}</button>
      {saved && <span style={{ color: 'var(--success)', fontSize: 13, marginLeft: 12 }}>Guardado ✓</span>}
      {error && <p style={{ color: '#f87171', fontSize: 13, marginTop: 8 }}>{error}</p>}
    </form>
  );
}
