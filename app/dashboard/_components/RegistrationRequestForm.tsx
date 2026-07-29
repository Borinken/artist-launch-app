'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRegistrationCatalog, catalogKey, formatCost } from '@/lib/registrationCatalog';

type Track = { id: string; title: string };

export default function RegistrationRequestForm({ artistId, tracks, country }: { artistId: string; tracks: Track[]; country?: string | null }) {
  const router = useRouter();
  const catalog = getRegistrationCatalog(country);
  const isSpain = country?.trim().toLowerCase() === 'españa' || country?.trim().toLowerCase() === 'spain';
  const currency = isSpain ? 'eur' : 'usd';

  const [selectedKey, setSelectedKey] = useState(catalogKey(catalog[0]));
  const [trackId, setTrackId] = useState('');
  const [cost, setCost] = useState(String(catalog[0].cost));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const selected = catalog.find((c) => catalogKey(c) === selectedKey) ?? catalog[0];

  function handleSelect(key: string) {
    setSelectedKey(key);
    const entry = catalog.find((c) => catalogKey(c) === key);
    if (entry) setCost(String(entry.cost));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const res = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        artist_id: artistId,
        track_id: trackId || null,
        registration_type: selected.value,
        provider: selected.provider,
        cost_cents: Math.round(Number(cost || 0) * 100),
        currency,
      }),
    });
    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? 'Error al solicitar el registro');
      return;
    }
    setSuccess(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: '2 1 240px' }}>
          <label className="label">Servicio y proveedor</label>
          <select className="input" value={selectedKey} onChange={(e) => handleSelect(e.target.value)}>
            {catalog.map((c) => (
              <option key={catalogKey(c)} value={catalogKey(c)}>{c.label} — {formatCost(c.cost * 100, currency)}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: '1 1 140px' }}>
          <label className="label">Canción (opcional)</label>
          <select className="input" value={trackId} onChange={(e) => setTrackId(e.target.value)}>
            <option value="">— General —</option>
            {tracks.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>
      </div>

      <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 0, marginBottom: 12 }}>{selected.detail}</p>

      <div style={{ marginBottom: 4, maxWidth: 160 }}>
        <label className="label">Costo a cobrar ({currency.toUpperCase()})</label>
        <input className="input" type="number" step="0.01" min="0" value={cost} onChange={(e) => setCost(e.target.value)} />
      </div>
      <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 0, marginBottom: 16 }}>
        Precargado con el costo investigado del proveedor — ajústalo si tu tarifa real es distinta.
      </p>

      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? 'Solicitando…' : 'Solicitar registro'}
      </button>
      {success && <span style={{ color: 'var(--success)', fontSize: 13, marginLeft: 12 }}>Solicitado ✓</span>}
      {error && <p style={{ color: '#f87171', fontSize: 13, marginTop: 8 }}>{error}</p>}
    </form>
  );
}
