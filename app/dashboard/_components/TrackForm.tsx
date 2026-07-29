'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TrackForm({ artistId }: { artistId: string }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [releaseType, setReleaseType] = useState('single');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch('/api/tracks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ artist_id: artistId, title, release_type: releaseType }),
    });
    setLoading(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? 'Error al crear la canción');
      return;
    }
    setTitle('');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
      <div style={{ flex: '1 1 200px' }}>
        <label className="label">Título de la canción</label>
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nombre de la canción"
          required
        />
      </div>
      <div style={{ width: 140 }}>
        <label className="label">Tipo</label>
        <select className="input" value={releaseType} onChange={(e) => setReleaseType(e.target.value)}>
          <option value="single">Single</option>
          <option value="ep">EP</option>
          <option value="album">Álbum</option>
        </select>
      </div>
      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? 'Agregando…' : '+ Agregar canción'}
      </button>
      {error && <p style={{ color: '#f87171', fontSize: 13, width: '100%' }}>{error}</p>}
    </form>
  );
}
