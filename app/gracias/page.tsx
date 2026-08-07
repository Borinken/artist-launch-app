import Link from 'next/link';

export const metadata = { title: 'Gracias — Artist Launch OS' };

export default function GraciasPage() {
  return (
    <main style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, textAlign: 'center',
    }}>
      <div className="card" style={{ maxWidth: 440 }}>
        <div style={{ fontSize: 15, color: 'var(--success)', marginBottom: 8 }}>✓ Pago confirmado</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, margin: '0 0 12px' }}>Bienvenido a Artist Launch OS</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, margin: '0 0 24px' }}>
          Tu suscripción quedó activa. Te escribiremos por email para activar tu perfil y empezar la
          auditoría inicial de tu carrera.
        </p>
        <Link href="/" className="btn btn-ghost">Volver al inicio</Link>
      </div>
    </main>
  );
}
