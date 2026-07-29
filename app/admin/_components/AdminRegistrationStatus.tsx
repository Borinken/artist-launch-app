'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const STATUSES = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'in_progress', label: 'En proceso' },
  { value: 'completed', label: 'Completo' },
  { value: 'blocked', label: 'Bloqueado' },
];

export default function AdminRegistrationStatus({ id, status, externalReference }: { id: string; status: string; externalReference: string | null }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [reference, setReference] = useState(externalReference ?? '');
  const [loading, setLoading] = useState(false);

  async function handleChange(newStatus: string) {
    setValue(newStatus);
    setLoading(true);
    await fetch('/api/registrations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus, external_reference: reference || undefined }),
    });
    setLoading(false);
    router.refresh();
  }

  async function handleReferenceBlur() {
    if (reference === (externalReference ?? '')) return;
    await fetch('/api/registrations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: value, external_reference: reference || undefined }),
    });
    router.refresh();
  }

  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <select className="input" style={{ width: 'auto', padding: '4px 8px', fontSize: 12 }} value={value} onChange={(e) => handleChange(e.target.value)} disabled={loading}>
        {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
      </select>
      <input
        className="input"
        style={{ width: 110, padding: '4px 8px', fontSize: 12 }}
        placeholder="Referencia"
        value={reference}
        onChange={(e) => setReference(e.target.value)}
        onBlur={handleReferenceBlur}
      />
    </div>
  );
}
