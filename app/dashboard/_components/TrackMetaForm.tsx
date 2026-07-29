'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TrackMetaForm({ trackId, isrc, upc, releaseDate }: {
  trackId: string; isrc: string | null; upc: string | null; releaseDate: string | null;
}) {
  const router = useRouter();
  const [form, setForm] = useState({ isrc: isrc ?? '', upc: upc ?? '', release_date: releaseDate ?? '' });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/tracks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: trackId, ...form }),
    });
    setLoading(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
      <div style={{ flex: '1 1 140px' }}>
        <label className="label">ISRC</label>
        <input className="input" value={form.isrc} onChange={(e) => { setForm((f) => ({ ...f, isrc: e.target.value })); setSaved(false); }} />
      </div>
      <div style={{ flex: '1 1 140px' }}>
        <label className="label">UPC</label>
        <input className="input" value={form.upc} onChange={(e) => { setForm((f) => ({ ...f, upc: e.target.value })); setSaved(false); }} />
      </div>
      <div style={{ flex: '1 1 140px' }}>
        <label className="label">Fecha de lanzamiento</label>
        <input className="input" type="date" value={form.release_date} onChange={(e) => { setForm((f) => ({ ...f, release_date: e.target.value })); setSaved(false); }} />
      </div>
      <button className="btn btn-ghost" type="submit" disabled={loading}>{loading ? 'Guardando…' : 'Guardar'}</button>
      {saved && <span style={{ color: 'var(--success)', fontSize: 13 }}>✓</span>}
    </form>
  );
}
