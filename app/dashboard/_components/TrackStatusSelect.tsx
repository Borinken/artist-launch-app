'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TRACK_STATUSES } from '@/lib/trackStatus';

export default function TrackStatusSelect({ trackId, status }: { trackId: string; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [loading, setLoading] = useState(false);

  async function handleChange(newStatus: string) {
    setValue(newStatus);
    setLoading(true);
    await fetch('/api/tracks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: trackId, status: newStatus }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <select
      className="input"
      style={{ width: 'auto', padding: '4px 10px', fontSize: 13, opacity: loading ? 0.6 : 1 }}
      value={value}
      onChange={(e) => handleChange(e.target.value)}
    >
      {TRACK_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
    </select>
  );
}
