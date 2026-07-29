'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Track = { id: string; title: string };
type Party = { full_name: string; role: string; split_pct: string; pro_affiliation: string };

const emptyParty = (): Party => ({ full_name: '', role: '', split_pct: '', pro_affiliation: '' });

export default function SplitSheetForm({ tracks }: { tracks: Track[] }) {
  const router = useRouter();
  const [trackId, setTrackId] = useState(tracks[0]?.id ?? '');
  const [parties, setParties] = useState<Party[]>([emptyParty(), emptyParty()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);

  const total = parties.reduce((sum, p) => sum + (Number(p.split_pct) || 0), 0);

  function updateParty(i: number, field: keyof Party, value: string) {
    setParties((prev) => prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessUrl(null);

    if (!trackId) {
      setError('Selecciona una canción primero.');
      return;
    }
    if (Math.round(total) !== 100) {
      setError(`El total debe sumar 100%. Actualmente: ${total}%`);
      return;
    }

    setLoading(true);
    const res = await fetch('/api/split-sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        track_id: trackId,
        parties: parties.map((p) => ({ ...p, split_pct: Number(p.split_pct) })),
      }),
    });
    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? 'Error al crear el split sheet');
      return;
    }
    const data = await res.json();
    setSuccessUrl(`/dashboard/split-sheets/${data.split_sheet_id}`);
    setParties([emptyParty(), emptyParty()]);
    router.refresh();
  }

  if (tracks.length === 0) {
    return <p style={{ color: 'var(--muted)', fontSize: 14 }}>Agrega una canción primero para poder crear un split sheet.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 16 }}>
        <label className="label">Canción</label>
        <select className="input" value={trackId} onChange={(e) => setTrackId(e.target.value)}>
          {tracks.map((t) => (
            <option key={t.id} value={t.id}>{t.title}</option>
          ))}
        </select>
      </div>

      {parties.map((p, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          <input className="input" style={{ flex: '2 1 140px' }} placeholder="Nombre completo"
            value={p.full_name} onChange={(e) => updateParty(i, 'full_name', e.target.value)} required />
          <input className="input" style={{ flex: '1 1 100px' }} placeholder="Rol"
            value={p.role} onChange={(e) => updateParty(i, 'role', e.target.value)} />
          <input className="input" style={{ flex: '1 1 110px' }} placeholder="PRO (SGAE...)"
            value={p.pro_affiliation} onChange={(e) => updateParty(i, 'pro_affiliation', e.target.value)} />
          <input className="input" style={{ flex: '0 1 80px' }} placeholder="%" type="number"
            value={p.split_pct} onChange={(e) => updateParty(i, 'split_pct', e.target.value)} required />
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <button type="button" className="btn btn-ghost" onClick={() => setParties((p) => [...p, emptyParty()])}>
          + Colaborador
        </button>
        <span style={{ fontSize: 13, color: Math.round(total) === 100 ? 'var(--success)' : 'var(--muted)' }}>
          Total: {total}%
        </span>
      </div>

      <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: 16 }}>
        {loading ? 'Generando…' : 'Generar split sheet'}
      </button>

      {error && <p style={{ color: '#f87171', fontSize: 13, marginTop: 8 }}>{error}</p>}
      {successUrl && (
        <p style={{ color: 'var(--success)', fontSize: 13, marginTop: 8 }}>
          Split sheet creado — <a href={successUrl} style={{ textDecoration: 'underline' }}>ver / imprimir documento</a>
        </p>
      )}
    </form>
  );
}
