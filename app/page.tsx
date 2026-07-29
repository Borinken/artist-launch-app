'use client';

import { motion, type Variants } from 'framer-motion';
import MusicHero from './_components/MusicHero';
import Nav from './_components/Nav';
import FAQAccordion from './_components/FAQAccordion';
import PricingSection from './_components/PricingSection';

const DEMO_ARTIST = '5a0056f9-1445-4960-9cc5-a478b4865d5d';

const problems = [
  { icon: '?', title: 'No sabes si tu canción está registrada correctamente', desc: 'Sin un registro formal de copyright y PRO, no hay forma de reclamar lo que te corresponde.' },
  { icon: '⚠', title: 'Los splits verbales terminan en disputas', desc: 'Un acuerdo de palabra entre colaboradores no protege a nadie cuando la canción empieza a generar dinero.' },
  { icon: '$', title: 'Perdiste regalías porque nadie las reclamó', desc: 'SoundExchange, mecánicas y sync no se cobran solos — si nadie las reclama, se quedan sin pagar.' },
  { icon: '▤', title: 'No tienes un solo lugar donde ver tu catálogo', desc: 'Canciones, contratos y registros dispersos en carpetas, emails y hojas de cálculo distintas.' },
];

const steps = [
  { n: '01', title: 'Auditoría de tu perfil e identidad legal', desc: 'Revisamos tu información legal y fiscal para que los registros se puedan tramitar sin fricción.' },
  { n: '02', title: 'Registro de derechos', desc: 'PRO/SGAE, copyright, MLC/AIE/AGEDI según tu país — cada uno con su estatus visible en tu dashboard.' },
  { n: '03', title: 'Organización de splits y contratos', desc: 'Split sheets firmados por colaborador, LOD, acuerdos de management y producción.' },
  { n: '04', title: 'Distribución y metadata', desc: 'Tu música lista para plataformas digitales con la metadata correcta desde el día uno.' },
  { n: '05', title: 'Monetización activa y seguimiento', desc: 'Vemos de dónde viene tu dinero — composición, máster, YouTube, shows, merch, sync — mes a mes.' },
];

const services = [
  { icon: '©', title: 'Registro de copyright y PRO', desc: 'SGAE, ASCAP, BMI, AIE — registramos tu obra donde corresponde según tu país.' },
  { icon: '✎', title: 'Split sheets y contratos legales', desc: 'Acuerdos de management, producción, NDA y LOD, listos para firmar por colaborador.' },
  { icon: '▶', title: 'Distribución digital multi-plataforma', desc: 'Tu catálogo publicado con metadata correcta en todas las plataformas relevantes.' },
  { icon: '$', title: 'Monetización', desc: 'Sync, YouTube Content ID, shows y merch — todo bajo el mismo techo de seguimiento.' },
  { icon: '@', title: 'Gestión de redes y presencia digital', desc: 'Seguimiento del estatus de tus perfiles en Instagram, TikTok, Spotify y Apple Music.' },
  { icon: '◔', title: 'Dashboard de seguimiento en tiempo real', desc: 'Visualiza en tiempo real cuánto llevas avanzado en cada etapa de tu lanzamiento.' },
  { icon: '✦', title: 'Marketing y contenido', desc: 'EPK, bio corta/media/larga, fotos oficiales y calendario de publicación.' },
  { icon: '☺', title: 'Equipo: productores y managers', desc: 'Agrega a tu productor o manager con su propio checklist de identidad y contratos.' },
  { icon: '▤', title: 'Calendario de carrera completo', desc: 'Lanzamientos, shows y deadlines de registro — nunca se te pasa una fecha límite.' },
];

const partners = ['ASCAP', 'BMI', 'SESAC', 'SGAE', 'AIE', 'AGEDI', 'The MLC', 'TuneCore', 'SoundExchange'];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fromLeft: Variants = { hidden: { opacity: 0, x: -40 }, show: { opacity: 1, x: 0, transition: { duration: 0.6 } } };
const fromRight: Variants = { hidden: { opacity: 0, x: 40 }, show: { opacity: 1, x: 0, transition: { duration: 0.6 } } };

export default function HomePage() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <BackgroundBlobs />
      <Nav />

      {/* HERO */}
      <section style={{ padding: '80px 24px 60px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div initial="hidden" animate="show" variants={stagger} style={{ maxWidth: 820, margin: '0 auto' }}>
          <motion.span variants={fadeUp} className="badge" style={{
            background: 'rgba(212,175,55,0.12)', color: 'var(--accent)', padding: '6px 16px', fontSize: 13, marginBottom: 24, display: 'inline-block',
          }}>
            Gestión de derechos y carrera musical
          </motion.span>
          <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(36px, 6vw, 64px)', lineHeight: 1.08, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 20px', fontFamily: 'var(--font-serif)' }}>
            Tu música. Tus derechos.<br />
            <span style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-3))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Tu carrera, organizada.
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} style={{ fontSize: 18, color: 'var(--muted)', maxWidth: 580, margin: '0 auto 36px' }}>
            Registros de PRO/SGAE, copyright, splits, distribución y monetización —
            todo en un solo dashboard, para artistas en Puerto Rico, EE.UU. y España.
          </motion.p>
          <motion.div variants={fadeUp} style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#planes" className="btn btn-primary">Empezar mi lanzamiento</a>
            <a href="#proceso" className="btn btn-ghost">Ver cómo funciona</a>
          </motion.div>
          <motion.p variants={fadeUp} style={{ fontSize: 12, color: 'var(--muted)', marginTop: 24 }}>
            Usado por artistas en PR, EE.UU. y España
          </motion.p>
        </motion.div>

        <MusicHero />
        <Marquee />
      </section>

      {/* PROBLEMA */}
      <Section eyebrow="El problema" title="Lo que le pasa a la mayoría de los artistas independientes">
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginTop: 48 }}
        >
          {problems.map((p) => (
            <motion.div key={p.title} variants={fadeUp} className="card">
              <div style={{ fontSize: 22, color: 'var(--accent)', marginBottom: 12, fontFamily: 'var(--font-serif)' }}>{p.icon}</div>
              <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>{p.title}</h3>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: 14, lineHeight: 1.5 }}>{p.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* CÓMO FUNCIONA */}
      <Section id="proceso" eyebrow="Cómo funciona" title="Cinco pasos, de la idea a la monetización">
        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 32 }}>
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              variants={i % 2 === 0 ? fromLeft : fromRight}
              initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
              style={{ display: 'flex', gap: 24, alignItems: 'flex-start', justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end', textAlign: i % 2 === 0 ? 'left' : 'right', flexDirection: i % 2 === 0 ? 'row' : 'row-reverse' }}
            >
              <span style={{ fontSize: 40, fontWeight: 700, color: 'var(--accent)', opacity: 0.4, fontFamily: 'var(--font-serif)' }}>{s.n}</span>
              <div style={{ maxWidth: 480 }}>
                <h3 style={{ margin: '0 0 6px', fontSize: 18 }}>{s.title}</h3>
                <p style={{ margin: 0, color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* SERVICIOS */}
      <Section id="servicios" eyebrow="Servicios" title="Todo lo que necesitas para lanzar una obra">
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginTop: 48 }}
        >
          {services.map((s) => (
            <motion.div key={s.title} variants={fadeUp} whileHover={{ y: -4, borderColor: 'var(--accent)' }} className="card" style={{ transition: 'border-color 0.2s' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', fontSize: 16, marginBottom: 16, color: '#0a0a0c', fontWeight: 700,
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
      <Section id="planes" eyebrow="Planes y precios" title="Un plan para cada etapa de tu carrera">
        <div style={{ marginTop: 48 }}>
          <PricingSection />
        </div>
      </Section>

      {/* CASOS DE ÉXITO */}
      <Section id="casos" eyebrow="Casos de éxito" title="Resultados reales de artistas reales">
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginTop: 48 }}
        >
          {[1, 2, 3].map((i) => (
            <motion.div key={i} variants={fadeUp} className="card" style={{ textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', margin: '0 auto 16px',
                background: 'linear-gradient(135deg, var(--border), var(--bg-soft))', border: '1px dashed var(--border)',
              }} />
              <p style={{ color: 'var(--muted)', fontSize: 13, fontStyle: 'italic' }}>
                [Pendiente: reemplazar con testimonio real de artista]
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* FAQ */}
      <Section id="faq" eyebrow="FAQ" title="Preguntas frecuentes">
        <div style={{ marginTop: 48 }}>
          <FAQAccordion />
        </div>
      </Section>

      {/* CTA FINAL */}
      <section style={{
        margin: '0 24px 80px', padding: '64px 24px', borderRadius: 24, textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(212,175,55,0.12), rgba(184,134,11,0.06))',
        border: '1px solid var(--border)', position: 'relative', zIndex: 1,
      }}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', margin: '0 0 24px', fontFamily: 'var(--font-serif)' }}>
            Tu próximo lanzamiento merece un proceso profesional
          </h2>
          <a href={`/dashboard?artist_id=${DEMO_ARTIST}`} className="btn btn-primary" style={{ fontSize: 15, padding: '14px 32px' }}>
            Agenda tu auditoría gratis
          </a>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

function Section({ id, eyebrow, title, children }: { id?: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ padding: '70px 24px', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ textAlign: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{eyebrow}</span>
        <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', margin: '10px 0 0', letterSpacing: '-0.01em', fontFamily: 'var(--font-serif)' }}>{title}</h2>
      </motion.div>
      {children}
    </section>
  );
}

function Marquee() {
  const items = [...partners, ...partners];
  return (
    <div style={{ marginTop: 64, overflow: 'hidden', maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
      <div style={{ display: 'flex', gap: 48, width: 'max-content', animation: 'scroll-left 24s linear infinite' }}>
        {items.map((p, i) => (
          <span key={i} style={{ fontSize: 15, color: 'var(--muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{p}</span>
        ))}
      </div>
      <style>{`@keyframes scroll-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

function BackgroundBlobs() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.06), transparent 60%)' }} />
      <style>{`
        .blob { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.25; }
        .blob-1 { width: 500px; height: 500px; background: var(--accent); top: -150px; left: -100px; animation: float-1 18s ease-in-out infinite; }
        .blob-2 { width: 420px; height: 420px; background: var(--accent-3); top: 300px; right: -120px; animation: float-2 22s ease-in-out infinite; }
        @keyframes float-1 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(60px, 80px); } }
        @keyframes float-2 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-50px, -60px); } }
      `}</style>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '56px 24px 32px', position: 'relative', zIndex: 1 }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto', display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, marginBottom: 40,
      }}>
        <div>
          <div style={{ fontWeight: 700, fontFamily: 'var(--font-serif)', marginBottom: 8 }}>Artist Launch OS</div>
          <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6 }}>
            El sistema operativo para lanzar y administrar tu carrera musical.
          </p>
        </div>
        <FooterCol title="Producto" links={[
          { label: 'Cómo funciona', href: '#proceso' },
          { label: 'Precios', href: '#planes' },
          { label: 'Dashboard', href: `/dashboard?artist_id=${DEMO_ARTIST}` },
          { label: 'Casos de éxito', href: '#casos' },
        ]} />
        <FooterCol title="Legal" links={[
          { label: 'Términos y condiciones', href: '#' },
          { label: 'Política de privacidad (RGPD)', href: '#' },
          { label: 'Aviso legal', href: '#' },
        ]} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Contacto</div>
          <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.8 }}>
            hola@artistlaunchos.com<br />
            Trabajamos 100% remoto — PR, EE.UU. y España
          </p>
        </div>
        <NewsletterForm />
      </div>
      <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 12, borderTop: '1px solid var(--border)', paddingTop: 24 }}>
        © 2026 Artist Launch OS. Todos los derechos reservados.
      </p>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {links.map((l) => <a key={l.label} href={l.href} style={{ color: 'var(--muted)', fontSize: 13 }}>{l.label}</a>)}
      </div>
    </div>
  );
}

function NewsletterForm() {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Newsletter</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const msg = form.querySelector('.newsletter-msg') as HTMLElement | null;
          if (msg) msg.textContent = '¡Gracias! (conecta este formulario a tu proveedor de email)';
        }}
        style={{ display: 'flex', gap: 6 }}
      >
        <input className="input" type="email" placeholder="tu@email.com" required style={{ fontSize: 13, padding: '8px 10px' }} />
        <button className="btn btn-ghost" type="submit" style={{ padding: '8px 14px', fontSize: 13 }}>→</button>
      </form>
      <p className="newsletter-msg" style={{ fontSize: 12, color: 'var(--accent)', marginTop: 8, minHeight: 16 }} />
    </div>
  );
}
