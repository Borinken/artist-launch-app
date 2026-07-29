'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { COLLABORATOR_ROLES } from '@/lib/collaboratorRoles';

export default function CollaboratorForm({ artistId }: { artistId: string }) {
  const router = useRouter();
  const [role, setRole] = useState<'producer' | 'manager'>('producer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [taxId, setTaxId] = useState('');
  const [ipiNumber, setIpiNumber] = useState('');
  const [proAffiliation, setProAffiliation] = useState('');
  const [commissionPct, setCommissionPct] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch('/api/collaborators', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        artist_id: artistId,
        role,
        full_name: fullName,
        email: email || undefined,
        phone: phone || undefined,
        tax_id: taxId || undefined,
        ipi_number: ipiNumber || undefined,
        pro_affiliation: proAffiliation || undefined,
        commission_pct: role === 'manager' && commissionPct ? Number(commissionPct) : undefined,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? 'Error al agregar colaborador');
      return;
    }
    setFullName(''); setEmail(''); setPhone(''); setTaxId(''); setIpiNumber(''); setProAffiliation(''); setCommissionPct('');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <div style={{ flex: '1 1 140px' }}>
          <label className="label">Rol</label>
          <select className="input" value={role} onChange={(e) => setRole(e.target.value as 'producer' | 'manager')}>
            {COLLABORATOR_ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <div style={{ flex: '2 1 200px' }}>
          <label className="label">Nombre completo</label>
          <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <div style={{ flex: '1 1 160px' }}>
          <label className="label">Email</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div style={{ flex: '1 1 140px' }}>
          <label className="label">Teléfono</label>
          <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div style={{ flex: '1 1 140px' }}>
          <label className="label">Tax ID</label>
          <input className="input" value={taxId} onChange={(e) => setTaxId(e.target.value)} />
        </div>
      </div>

      {role === 'producer' ? (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          <div style={{ flex: '1 1 140px' }}>
            <label className="label">IPI number (si co-escribe)</label>
            <input className="input" value={ipiNumber} onChange={(e) => setIpiNumber(e.target.value)} />
          </div>
          <div style={{ flex: '1 1 140px' }}>
            <label className="label">PRO afiliado</label>
            <input className="input" value={proAffiliation} onChange={(e) => setProAffiliation(e.target.value)} />
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: 16, maxWidth: 200 }}>
          <label className="label">Comisión (%)</label>
          <input className="input" type="number" step="0.1" value={commissionPct} onChange={(e) => setCommissionPct(e.target.value)} />
        </div>
      )}

      <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Agregando…' : '+ Agregar al equipo'}</button>
      {error && <p style={{ color: '#f87171', fontSize: 13, marginTop: 8 }}>{error}</p>}
    </form>
  );
}
