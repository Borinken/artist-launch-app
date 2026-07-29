'use client';

import { RadialBarChart, RadialBar, PolarAngleAxis, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const STATUS_COLORS: Record<string, string> = {
  pending: '#facc15',
  in_progress: '#818cf8',
  completed: '#34d399',
  blocked: '#f87171',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  in_progress: 'En proceso',
  completed: 'Completo',
  blocked: 'Bloqueado',
};

export default function ProgressChart({
  progressPct,
  registrationsByStatus,
}: {
  progressPct: number;
  registrationsByStatus: { status: string; count: number }[];
}) {
  const radialData = [{ name: 'Progreso', value: progressPct, fill: 'url(#progressGradient)' }];
  const barData = registrationsByStatus.map((r) => ({
    name: STATUS_LABELS[r.status] ?? r.status,
    value: r.count,
    color: STATUS_COLORS[r.status] ?? '#9797a3',
  }));

  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 220px', height: 200, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart innerRadius="70%" outerRadius="100%" data={radialData} startAngle={90} endAngle={-270}>
            <defs>
              <linearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar background={{ fill: 'var(--bg-soft)' }} dataKey="value" cornerRadius={20} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
        }}>
          <span style={{ fontSize: 32, fontWeight: 700 }}>{progressPct}%</span>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>Progreso de carrera</span>
        </div>
      </div>

      <div style={{ flex: '2 1 280px', height: 200 }}>
        {barData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={90} tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }}
                labelStyle={{ color: 'var(--text)' }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={18}>
                {barData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--muted)', fontSize: 14 }}>
            Sin registros todavía.
          </div>
        )}
      </div>
    </div>
  );
}
