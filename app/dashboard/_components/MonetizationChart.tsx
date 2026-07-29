'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ROYALTY_SOURCES } from '@/lib/royaltySources';

export default function MonetizationChart({ data }: { data: Record<string, any>[] }) {
  if (data.length === 0) {
    return <p style={{ color: 'var(--muted)', fontSize: 14 }}>Sin ingresos registrados todavía.</p>;
  }

  return (
    <div style={{ height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: -10 }}>
          <XAxis dataKey="month" tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }} labelStyle={{ color: 'var(--text)' }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {ROYALTY_SOURCES.map((s) => (
            <Bar key={s.value} dataKey={s.value} name={s.label} stackId="a" fill={s.color} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
