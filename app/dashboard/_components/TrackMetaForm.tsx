'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Track = {
  id: string;
  isrc: string | null;
  upc: string | null;
  release_date: string | null;
  genre: string | null;
  language: string | null;
  is_explicit: boolean;
  contains_samples: boolean;
  is_cover: boolean;
};

export default function TrackMetaForm({ track }: { track: Track }) {
  const router = useRouter();
  const [form, setForm] = useState({
    isrc: track.isrc ?? '',
    upc: track.upc ?? '',
    release_date: track.release_date ?? '',
    genre: track.genre ?? '',
    language: track.language ?? '',
    is_explicit: track.is_explicit,
    contains_samples: track.contains_samples,
    is_cover: track.is_cover,
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  function update(field: keyof typeof form, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/tracks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: track.id, ...form }),
    });
    setLoading(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        <div style={{ flex: '1 1 140px' }}>
          <label className="label">ISRC</label>
          <input className="input" value={form.isrc} onChange={(e) => update('isrc', e.target.value)} />
        </div>
        <div style={{ flex: '1 1 140px' }}>
          <label className="label">UPC</label>
          <input className="input" value={form.upc} onChange={(e) => update('upc', e.target.value)} />
        </div>
        <div style={{ flex: '1 1 140px' }}>
          <label className="label">Fecha de lanzamiento</label>
          <input className="input" type="date" value={form.release_date} onChange={(e) => update('release_date', e.target.value)} />
        </div>
        <div style={{ flex: '1 1 140px' }}>
          <label className="label">Género</label>
          <input className="input" value={form.genre} onChange={(e) => update('genre', e.target.value)} />
        </div>
        <div style={{ flex: '1 1 140px' }}>
          <label className="label">Idioma</label>
          <input className="input" value={form.language} onChange={(e) => update('language', e.target.value)} placeholder="Español, Inglés..." />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20, marginBottom: 12 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <input type="checkbox" checked={form.is_explicit} onChange={(e) => update('is_explicit', e.target.checked)} /> Explícito
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <input type="checkbox" checked={form.contains_samples} onChange={(e) => update('contains_samples', e.target.checked)} /> Contiene samples
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <input type="checkbox" checked={form.is_cover} onChange={(e) => update('is_cover', e.target.checked)} /> Es un cover
        </label>
      </div>

      <button className="btn btn-ghost" type="submit" disabled={loading}>{loading ? 'Guardando…' : 'Guardar metadata'}</button>
      {saved && <span style={{ color: 'var(--success)', fontSize: 13, marginLeft: 12 }}>✓</span>}
    </form>
  );
}
