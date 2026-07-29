'use client';

import { motion, type Variants } from 'framer-motion';

const services = [
  { icon: '©', title: 'Registro de copyright & PRO', desc: 'SGAE, ASCAP, BMI, SESAC — registramos tu obra donde corresponde.' },
  { icon: '♬', title: 'The MLC & distribución', desc: 'Publishing administration y distribución digital gestionados de punta a punta.' },
  { icon: '✎', title: 'Split sheets', desc: 'Genera y firma splits de composición con validación automática de porcentajes.' },
  { icon: '§', title: 'Contratos & LOD', desc: 'Acuerdos de management, producción, NDA y cartas de instrucción de pago, listos para firmar.' },
  { icon: '◔', title: 'Progreso de carrera', desc: 'Visualiza en tiempo real cuánto llevas avanzado en cada etapa de tu lanzamiento.' },
  { icon: '▤', title: 'Calendario de lanzamientos', desc: 'Fechas de entrega, vencimientos y shows, todo en un solo lugar.' },
];

const plans = [
  {
    name: 'Start',
    price: '$29',
    tagline: 'Para tu primer lanzamiento',
    features: ['1 canción activa por mes', 'Registro de copyright básico', 'Dashboard de progreso', 'Soporte por email'],
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$79',
    tagline: 'Para artistas en crecimiento',
    features: ['Hasta 5 canciones por mes', 'PRO, MLC y distribución completos', 'Split sheets ilimitados', 'Contratos y LOD ilimitados', 'Soporte prioritario'],
    highlighted: true,
  },
  {
    name: 'Studio',
    price: '$150',
    tagline: 'Para sellos y managers',
    features: ['Canciones ilimitadas', 'Todo lo incluido en Pro', 'Publishing administration', 'Calendario con recordatorios', 'Gestor dedicado'],
    highlighted: false,
  },
];

const partners = ['SGAE', 'ASCAP', 'BMI', 'SESAC', 'The MLC', 'TuneCore', 'SoundExchange'];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function HomePage() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <BackgroundBlobs />

      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '20px 32px', backdropFilter: 'blur(12px)',
        background: 'rgba(8,8,11,0.6)', borderBottom: '1px solid var(--border)',
      }}>
        <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>Artist Launch OS</span>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', fontSize: 14 }}>
          <a href="#servicios" style={{ color: 'var(--muted)' }}>Servicios</a>
          <a href="#planes" style={{ color: 'var(--muted)' }}>Planes</a>
          <a href="/dashboard?artist_id=5a0056f9-1445-4960-9cc5-a478b4865d5d" className="btn btn-primary" style={{ padding: '8px 18px' }}>
            Ver dashboard
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: '120px 24px 100px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div initial="hidden" animate="show" variants={stagger} style={{ maxWidth: 820, margin: '0 auto' }}>
          <motion.span variants={fadeUp} className="badge" style={{
            background: 'rgba(168,85,247,0.12)', color: '#c084fc', padding: '6px 16px', fontSize: 13, marginBottom: 24, display: 'inline-block',
          }}>
            El sistema operativo para tu carrera musical
          </motion.span>
          <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(36px, 6vw, 68px)', lineHeight: 1.05, fontWeight: 700, letterSpacing: '-0.03em', margin: '0 0 20px' }}>
            Lanza tu música<br />
            <span style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              sin perder el control
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} style={{ fontSize: 18, color: 'var(--muted)', maxWidth: 560, margin: '0 auto 36px' }}>
            Registros, split sheets, contratos y distribución — todo en un solo dashboard,
            con tus datos reales y sin depender de hojas de cálculo.
          </motion.p>
          <motion.div variants={fadeUp} style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#planes" className="btn btn-primary">Ver planes</a>
            <a href="/dashboard?artist_id=5a0056f9-1445-4960-9cc5-a478b4865d5d" className="btn btn-ghost">Explorar el dashboard →</a>
          </motion.div>
        </motion.div>

        <Marquee />
      </section>

      {/* SERVICIOS */}
      <Section id="servicios" eyebrow="Servicios" title="Todo lo que necesitas para lanzar una obra">
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginTop: 48 }}
        >
          {services.map((s) => (
            <motion.div
              key={s.title} variants={fadeUp}
              whileHover={{ y: -4, borderColor: 'var(--accent)' }}
              className="card"
              style={{ transition: 'border-color 0.2s' }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', fontSize: 18, marginBottom: 16,
              }}>
                {s.icon}
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: 17 }}>{s.title}</h3>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: 14, lineHeight: 1.5 }}>{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* PLANES */}
      <Section id="planes" eyebrow="Planes" title="Un plan para cada etapa de tu carrera">
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginTop: 48, alignItems: 'stretch' }}
        >
          {plans.map((p) => (
            <motion.div
              key={p.name} variants={fadeUp}
              whileHover={{ y: -6 }}
              className="card"
              style={{
                display: 'flex', flexDirection: 'column',
                border: p.highlighted ? '1px solid var(--accent)' : '1px solid var(--border)',
                background: p.highlighted ? 'linear-gradient(160deg, rgba(168,85,247,0.08), var(--card))' : 'var(--card)',
                position: 'relative',
              }}
            >
              {p.highlighted && (
                <span style={{
                  position: 'absolute', top: -12, left: 24, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                  color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 999,
                }}>
                  MÁS POPULAR
                </span>
              )}
              <h3 style={{ margin: '8px 0 0', fontSize: 20 }}>{p.name}</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14, margin: '4px 0 20px' }}>{p.tagline}</p>
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontSize: 40, fontWeight: 700 }}>{p.price}</span>
                <span style={{ color: 'var(--muted)', fontSize: 14 }}>/mes</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', flex: 1 }}>
                {p.features.map((f) => (
                  <li key={f} style={{ display: 'flex', gap: 8, fontSize: 14, marginBottom: 10, color: 'var(--text)' }}>
                    <span style={{ color: 'var(--success)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <a href="/dashboard?artist_id=5a0056f9-1445-4960-9cc5-a478b4865d5d"
                className={p.highlighted ? 'btn btn-primary' : 'btn btn-ghost'} style={{ width: '100%' }}>
                Elegir {p.name}
              </a>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* CTA FINAL */}
      <Section eyebrow="Empieza hoy" title="Tu próximo lanzamiento merece un proceso profesional">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ textAlign: 'center', marginTop: 32 }}
        >
          <a href="/dashboard?artist_id=5a0056f9-1445-4960-9cc5-a478b4865d5d" className="btn btn-primary" style={{ fontSize: 15, padding: '14px 32px' }}>
            Entrar al dashboard de prueba
          </a>
        </motion.div>
      </Section>

      <footer style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--muted)', fontSize: 13, borderTop: '1px solid var(--border)' }}>
        Artist Launch OS — construido para artistas independientes.
      </footer>
    </div>
  );
}

function Section({ id, eyebrow, title, children }: { id?: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ textAlign: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{eyebrow}</span>
        <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', margin: '10px 0 0', letterSpacing: '-0.02em' }}>{title}</h2>
      </motion.div>
      {children}
    </section>
  );
}

function Marquee() {
  const items = [...partners, ...partners];
  return (
    <div style={{ marginTop: 64, overflow: 'hidden', maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
      <div style={{ display: 'flex', gap: 48, width: 'max-content', animation: 'scroll-left 22s linear infinite' }}>
        {items.map((p, i) => (
          <span key={i} style={{ fontSize: 15, color: 'var(--muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{p}</span>
        ))}
      </div>
      <style>{`
        @keyframes scroll-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

function BackgroundBlobs() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <style>{`
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.35;
        }
        .blob-1 {
          width: 500px; height: 500px;
          background: var(--accent);
          top: -150px; left: -100px;
          animation: float-1 16s ease-in-out infinite;
        }
        .blob-2 {
          width: 420px; height: 420px;
          background: var(--accent-3);
          top: 300px; right: -120px;
          animation: float-2 20s ease-in-out infinite;
        }
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(60px, 80px); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-50px, -60px); }
        }
      `}</style>
    </div>
  );
}
