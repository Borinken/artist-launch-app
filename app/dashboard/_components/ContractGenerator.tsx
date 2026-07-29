'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Track = { id: string; title: string };

const CONTRACT_TYPES: { value: string; label: string }[] = [
  { value: 'letter_of_direction', label: 'Carta de instrucción de pago (LOD)' },
  { value: 'management_agreement', label: 'Acuerdo de management' },
  { value: 'producer_agreement', label: 'Acuerdo de productor' },
  { value: 'publishing_agreement', label: 'Acuerdo de publishing' },
  { value: 'beat_license', label: 'Licencia de beat' },
  { value: 'nda', label: 'Confidencialidad (NDA)' },
  { value: 'photo_release', label: 'Cesión de imagen (fotos)' },
  { value: 'video_release', label: 'Cesión de imagen (video)' },
  { value: 'work_for_hire', label: 'Obra por encargo' },
];

const ROLE_BY_TYPE: Record<string, string> = {
  letter_of_direction: 'Beneficiario del pago',
  management_agreement: 'Manager',
  producer_agreement: 'Productor',
  publishing_agreement: 'Editor (Publisher)',
  beat_license: 'Productor / Licenciante',
  nda: 'Contraparte',
  photo_release: 'Fotógrafo',
  video_release: 'Videógrafo',
  work_for_hire: 'Contratista',
};

export default function ContractGenerator({ artistId, tracks }: { artistId: string; tracks: Track[] }) {
  const router = useRouter();
  const [contractType, setContractType] = useState('letter_of_direction');
  const [trackId, setTrackId] = useState('');
  const [counterpartyName, setCounterpartyName] = useState('');
  const [percentage, setPercentage] = useState('');
  const [feeAmount, setFeeAmount] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [territoryOrTerm, setTerritoryOrTerm] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessUrl(null);
    setLoading(true);

    const res = await fetch('/api/contracts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        artist_id: artistId,
        track_id: trackId || null,
        contract_type: contractType,
        contract_data: {
          counterparty_name: counterpartyName,
          counterparty_role: ROLE_BY_TYPE[contractType],
          percentage: percentage || undefined,
          fee_amount: feeAmount || undefined,
          effective_date: effectiveDate || undefined,
          territory_or_term: territoryOrTerm || undefined,
          notes: notes || undefined,
        },
      }),
    });
    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? 'Error al generar el documento');
      return;
    }
    const data = await res.json();
    setSuccessUrl(`/dashboard/contracts/${data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 12 }}>
        <label className="label">Tipo de documento</label>
        <select className="input" value={contractType} onChange={(e) => setContractType(e.target.value)}>
          {CONTRACT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 180px' }}>
          <label className="label">{ROLE_BY_TYPE[contractType]}</label>
          <input className="input" value={counterpartyName} onChange={(e) => setCounterpartyName(e.target.value)} placeholder="Nombre" required />
        </div>
        <div style={{ flex: '1 1 140px' }}>
          <label className="label">Canción (opcional)</label>
          <select className="input" value={trackId} onChange={(e) => setTrackId(e.target.value)}>
            <option value="">— General —</option>
            {tracks.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 100px' }}>
          <label className="label">% (si aplica)</label>
          <input className="input" type="number" value={percentage} onChange={(e) => setPercentage(e.target.value)} placeholder="ej. 15" />
        </div>
        <div style={{ flex: '1 1 140px' }}>
          <label className="label">Monto (si aplica)</label>
          <input className="input" value={feeAmount} onChange={(e) => setFeeAmount(e.target.value)} placeholder="ej. $500 USD" />
        </div>
        <div style={{ flex: '1 1 140px' }}>
          <label className="label">Fecha efectiva</label>
          <input className="input" type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} />
        </div>
        <div style={{ flex: '1 1 140px' }}>
          <label className="label">Territorio / duración</label>
          <input className="input" value={territoryOrTerm} onChange={(e) => setTerritoryOrTerm(e.target.value)} placeholder="ej. Mundial, 2 años" />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label className="label">Notas adicionales</label>
        <textarea className="input" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Cláusulas o condiciones extra..." />
      </div>

      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? 'Generando…' : 'Generar documento'}
      </button>

      {error && <p style={{ color: '#f87171', fontSize: 13, marginTop: 8 }}>{error}</p>}
      {successUrl && (
        <p style={{ color: 'var(--success)', fontSize: 13, marginTop: 8 }}>
          Documento generado — <a href={successUrl} style={{ textDecoration: 'underline' }}>ver / imprimir</a>
        </p>
      )}
    </form>
  );
}
