'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const PLANS = [
  {
    name: 'Starter',
    slug: 'start',
    priceUSD: 29,
    priceEUR: 27,
    tagline: 'Para tu primer lanzamiento, tú solo',
    features: [
      '1 canción activa por mes',
      'Registro básico de copyright/PRO',
      'Split sheets ilimitados',
      'Dashboard de progreso y calendario de carrera',
      'Seguimiento básico de redes sociales',
      'Soporte por email',
    ],
    limits: ['Sin equipo (productor/manager)', 'Distribución y publishing se cobran a la carta', 'Sin seguimiento de monetización'],
    highlighted: false,
  },
  {
    name: 'Professional',
    slug: 'pro',
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
      'Seguimiento de monetización (todas las fuentes)',
      'Marketing: EPK y calendario de contenido',
      'Soporte prioritario',
    ],
    limits: ['Publishing administration se cobra aparte'],
    highlighted: true,
  },
  {
    name: 'Elite',
    slug: 'studio',
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
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  async function handleChoose(slug: string) {
    setLoadingPlan(slug);
    setCheckoutError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: slug, region }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'No se pudo iniciar el pago');
      window.location.href = data.url;
    } catch (err: any) {
      setCheckoutError(err.message || 'No se pudo iniciar el pago. Intenta de nuevo.');
      setLoadingPlan(null);
    }
  }

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
            <button
              onClick={() => handleChoose(p.slug)}
              disabled={loadingPlan !== null}
              className={p.highlighted ? 'btn btn-primary' : 'btn btn-ghost'}
              style={{ width: '100%' }}
            >
              {loadingPlan === p.slug ? 'Redirigiendo…' : `Elegir ${p.name}`}
            </button>
          </motion.div>
        ))}
      </motion.div>

      {checkoutError && (
        <p style={{ textAlign: 'center', color: '#f87171', fontSize: 13, marginTop: 16 }}>{checkoutError}</p>
      )}

      <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13, marginTop: 24 }}>
        Los gastos de registro ante terceros (Copyright Office, SGAE, TuneCore, etc.) se facturan aparte.
        {region === 'es' && ' Precios en EUR aproximados — ajusta según tu tarifa real en España.'}
      </p>
      <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 12, marginTop: 8 }}>
        Al continuar aceptas nuestros{' '}
        <a href="/legal/terminos" style={{ textDecoration: 'underline' }}>Términos y condiciones</a>.
      </p>
    </div>
  );
}
