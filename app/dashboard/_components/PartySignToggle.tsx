'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PartySignToggle({ partyId, signed }: { partyId: string; signed: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    await fetch('/api/split-sheets', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ party_id: partyId, signed: !signed }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={signed ? 'badge badge-signed' : 'badge badge-pending'}
      style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
    >
      {signed ? '✅ Firmado' : '⏳ Marcar firmado'}
    </button>
  );
}
