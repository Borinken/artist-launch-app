'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { REGISTRATION_TYPES } from '@/lib/registrationCatalog';

type Track = { id: string; title: string };

export default function RegistrationRequestForm({ artistId, tracks }: { artistId: string; tracks: Track[] }) {
  const router = useRouter();
  const [type, setType] = useState(REGISTRATION_TYPES[0].value);
  const [trackId, setTrackId] = useState('');
  const [provider, setProvider] = useState(REGISTRATION_TYPES[0].provider);
  const [cost, setCost] = useState(String(REGISTRATION_TYPES[0].suggestedCost));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleTypeChange(value: string) {
    setType(value);
    const catalogEntry = REGISTRATION_TYPES.find((t) => t.value === value);
    if (catalogEntry) {
      setProvider(catalogEntry.provider);
      setCost(String(catalogEntry.suggestedCost));
    }
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
        registration_type: type,
        provider,
        cost_cents: Math.round(Number(cost || 0) * 100),
        currency: 'usd',
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
        <div style={{ flex: '2 1 200px' }}>
          <label className="label">Tipo de registro</label>
          <select className="input" value={type} onChange={(e) => handleTypeChange(e.target.value)}>
            {REGISTRATION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
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

      <div style={{ display: 'flex', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 160px' }}>
          <label className="label">Proveedor</label>
          <input className="input" value={provider} onChange={(e) => setProvider(e.target.value)} />
        </div>
        <div style={{ flex: '1 1 120px' }}>
          <label className="label">Costo (USD)</label>
          <input className="input" type="number" step="0.01" min="0" value={cost} onChange={(e) => setCost(e.target.value)} />
        </div>
      </div>
      <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 0, marginBottom: 16 }}>
        Costo sugerido — ajústalo según tu tarifa real antes de confirmar con el artista.
      </p>

      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? 'Solicitando…' : 'Solicitar registro'}
      </button>
      {success && <span style={{ color: 'var(--success)', fontSize: 13, marginLeft: 12 }}>Solicitado ✓</span>}
      {error && <p style={{ color: '#f87171', fontSize: 13, marginTop: 8 }}>{error}</p>}
    </form>
  );
}
