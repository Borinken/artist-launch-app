'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Artist = {
  id: string;
  legal_name: string;
  artist_name: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  tax_id: string | null;
  legal_entity_name: string | null;
  has_w9: boolean;
  has_w8ben: boolean;
  manager_name: string | null;
  label_name: string | null;
};

const FIELDS: { key: keyof Artist; label: string; required?: boolean }[] = [
  { key: 'legal_name', label: 'Nombre legal', required: true },
  { key: 'artist_name', label: 'Nombre artístico' },
  { key: 'email', label: 'Email', required: true },
  { key: 'phone', label: 'Teléfono' },
  { key: 'country', label: 'País' },
  { key: 'tax_id', label: 'NIF / SSN / RFC' },
  { key: 'legal_entity_name', label: 'Entidad legal (si aplica)' },
  { key: 'manager_name', label: 'Manager' },
  { key: 'label_name', label: 'Sello discográfico' },
];

const AUDIT_FIELDS: (keyof Artist)[] = ['legal_name', 'email', 'tax_id', 'country'];

export default function ArtistProfileForm({ artist }: { artist: Artist }) {
  const router = useRouter();
  const [form, setForm] = useState<Artist>(artist);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filledCount = FIELDS.filter((f) => !!form[f.key]).length;
  const completionPct = Math.round((filledCount / FIELDS.length) * 100);
  const missingForAudit = AUDIT_FIELDS.filter((k) => !form[k]);

  function update(key: keyof Artist, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch('/api/artists', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? 'Error al guardar');
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ flex: 1, height: 6, borderRadius: 999, background: 'var(--bg-soft)', overflow: 'hidden', marginRight: 16 }}>
          <div style={{
            width: `${completionPct}%`, height: '100%',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', transition: 'width 0.3s',
          }} />
        </div>
        <span style={{ fontSize: 13, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{completionPct}% completo</span>
      </div>

      {missingForAudit.length > 0 && (
        <p style={{ fontSize: 13, color: '#facc15', marginTop: 0, marginBottom: 16 }}>
          ⚠ Faltan datos clave para poder solicitar registros: {missingForAudit.join(', ')}
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 12 }}>
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="label">{f.label}{f.required && ' *'}</label>
            <input
              className="input"
              value={(form[f.key] as string) ?? ''}
              onChange={(e) => update(f.key, e.target.value)}
              required={f.required}
            />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
          <input type="checkbox" checked={!!form.has_w9} onChange={(e) => update('has_w9', e.target.checked)} />
          Tiene W-9
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
          <input type="checkbox" checked={!!form.has_w8ben} onChange={(e) => update('has_w8ben', e.target.checked)} />
          Tiene W-8BEN
        </label>
      </div>

      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? 'Guardando…' : 'Guardar perfil'}
      </button>
      {saved && <span style={{ color: 'var(--success)', fontSize: 13, marginLeft: 12 }}>Guardado ✓</span>}
      {error && <p style={{ color: '#f87171', fontSize: 13, marginTop: 8 }}>{error}</p>}
    </form>
  );
}
