'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const DEMO_ARTIST = '5a0056f9-1445-4960-9cc5-a478b4865d5d';

const PLANS = [
  {
    name: 'Starter',
    priceUSD: 29,
    priceEUR: 27,
    tagline: 'Para tu primer lanzamiento, tú solo',
    features: [
      '1 canción activa por mes',
      'Registro básico de copyright/PRO',
      'Split sheets ilimitados',
      'Dashboard de progreso',
      'Soporte por email',
    ],
    limits: ['Sin equipo (productor/manager)', 'Distribución y publishing se cobran a la carta'],
    highlighted: false,
  },
  {
    name: 'Professional',
    priceUSD: 79,
    priceEUR: 75,
    tagline: 'Para artistas en crecimiento, con equipo',
    features: [
      'Hasta 5 canciones activas por mes',
      'Todos los registros: PRO/SGAE, MLC/AGEDI, SoundExchange/AIE',
      'Contratos y LOD ilimitados',
      'Hasta 2 miembros de equipo (productor + manager)',
      'Calendario compartido con tu equipo',
      '1 distribución incluida al mes',
      'Soporte prioritario',
    ],
    limits: ['Publishing administration se cobra aparte'],
    highlighted: true,
  },
  {
    name: 'Elite',
    priceUSD: 150,
    priceEUR: 140,
    tagline: 'Para sellos y managers con roster',
    features: [
      'Canciones ilimitadas',
      'Todo lo incluido en Professional',
      'Equipo ilimitado de productores y managers',
      'Publishing administration incluido',
      'Distribución ilimitada incluida',
      'Calendario multi-artista para tu roster',
      'Gestor dedicado + revisión legal de contratos',
    ],
    limits: [],
    highlighted: false,
  },
];

export default function PricingSection() {
  const [region, setRegion] = useState<'us' | 'es'>('us');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
        <div style={{ display: 'inline-flex', background: 'var(--card)', borderRadius: 999, padding: 4, border: '1px solid var(--border)' }}>
          {(['us', 'es'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              style={{
                padding: '8px 20px', borderRadius: 999, border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
                background: region === r ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : 'transparent',
                color: region === r ? '#0a0a0c' : 'var(--muted)',
                fontWeight: region === r ? 700 : 400,
              }}
            >
              {r === 'us' ? 'PR / EE.UU. (USD)' : 'España (EUR)'}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, alignItems: 'stretch' }}
      >
        {PLANS.map((p) => (
          <motion.div
            key={p.name} variants={fadeUp} whileHover={{ y: -6 }} className="card"
            style={{
              display: 'flex', flexDirection: 'column', position: 'relative',
              border: p.highlighted ? '1px solid var(--accent)' : '1px solid var(--border)',
              background: p.highlighted ? 'linear-gradient(160deg, rgba(212,175,55,0.08), var(--card))' : 'var(--card)',
            }}
          >
            {p.highlighted && (
              <span style={{
                position: 'absolute', top: -12, left: 24, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                color: '#0a0a0c', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 999,
              }}>
                MÁS POPULAR
              </span>
            )}
            <h3 style={{ margin: '8px 0 0', fontSize: 20, fontFamily: 'var(--font-serif)' }}>{p.name}</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, margin: '4px 0 20px' }}>{p.tagline}</p>
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: 40, fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
                {region === 'us' ? `$${p.priceUSD}` : `€${p.priceEUR}`}
              </span>
              <span style={{ color: 'var(--muted)', fontSize: 14 }}>/mes</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', flex: 1 }}>
              {p.features.map((f) => (
                <li key={f} style={{ display: 'flex', gap: 8, fontSize: 14, marginBottom: 10 }}>
                  <span style={{ color: 'var(--success)' }}>✓</span> {f}
                </li>
              ))}
              {p.limits.map((f) => (
                <li key={f} style={{ display: 'flex', gap: 8, fontSize: 13, marginBottom: 10, color: 'var(--muted)' }}>
                  <span>—</span> {f}
                </li>
              ))}
            </ul>
            <a href={`/dashboard?artist_id=${DEMO_ARTIST}`} className={p.highlighted ? 'btn btn-primary' : 'btn btn-ghost'} style={{ width: '100%' }}>
              Elegir {p.name}
            </a>
          </motion.div>
        ))}
      </motion.div>

      <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13, marginTop: 24 }}>
        Los gastos de registro ante terceros (Copyright Office, SGAE, TuneCore, etc.) se facturan aparte.
        {region === 'es' && ' Precios en EUR aproximados — ajusta según tu tarifa real en España.'}
      </p>
    </div>
  );
}
