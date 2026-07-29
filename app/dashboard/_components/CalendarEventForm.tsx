'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const EVENT_TYPES = [
  { value: 'lanzamiento', label: 'Lanzamiento' },
  { value: 'entrega', label: 'Entrega de material' },
  { value: 'vencimiento', label: 'Vencimiento / deadline' },
  { value: 'show', label: 'Show / concierto' },
];

type Collaborator = { id: string; full_name: string; role: string };

export default function CalendarEventForm({ artistId, collaborators = [] }: { artistId: string; collaborators?: Collaborator[] }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState(EVENT_TYPES[0].value);
  const [collaboratorId, setCollaboratorId] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/calendar-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ artist_id: artistId, title, event_date: date, event_type: type, collaborator_id: collaboratorId || null }),
    });
    setLoading(false);
    setTitle('');
    setDate('');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
      <div style={{ flex: '2 1 200px' }}>
        <label className="label">Título</label>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div style={{ flex: '1 1 140px' }}>
        <label className="label">Fecha</label>
        <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      <div style={{ flex: '1 1 160px' }}>
        <label className="label">Tipo</label>
        <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
          {EVENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      {collaborators.length > 0 && (
        <div style={{ flex: '1 1 160px' }}>
          <label className="label">Relevante para (opcional)</label>
          <select className="input" value={collaboratorId} onChange={(e) => setCollaboratorId(e.target.value)}>
            <option value="">— Todo el equipo —</option>
            {collaborators.map((c) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
          </select>
        </div>
      )}
      <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Agregando…' : '+ Agregar fecha'}</button>
    </form>
  );
}
