import Link from 'next/link';

export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main style={{ minHeight: '100vh', padding: '0 24px 100px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <nav style={{ padding: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontWeight: 700, fontFamily: 'var(--font-serif)', fontSize: 17 }}>
            Artist Launch OS
          </Link>
          <Link href="/" style={{ color: 'var(--muted)', fontSize: 13 }}>
            ← Volver al inicio
          </Link>
        </nav>

        <header style={{ borderBottom: '1px solid var(--border)', paddingBottom: 24, marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 4vw, 34px)', margin: '0 0 8px' }}>
            {title}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0 }}>Última actualización: {updated}</p>
        </header>

        <div className="legal-body">{children}</div>
      </div>

      <style>{`
        .legal-body h2 {
          font-family: var(--font-serif);
          font-size: 19px;
          margin: 36px 0 12px;
        }
        .legal-body h2:first-child { margin-top: 0; }
        .legal-body p, .legal-body li {
          color: var(--text);
          font-size: 14.5px;
          line-height: 1.7;
        }
        .legal-body p { margin: 0 0 14px; }
        .legal-body ul { margin: 0 0 14px; padding-left: 20px; }
        .legal-body li { margin-bottom: 6px; }
        .legal-body strong { color: var(--text); }
        .legal-body .fill {
          background: rgba(212, 175, 55, 0.14);
          color: var(--accent);
          padding: 1px 6px;
          border-radius: 4px;
          font-size: 13.5px;
          font-weight: 600;
        }
        .legal-body .note {
          background: var(--card);
          border: 1px solid var(--border);
          border-left: 3px solid var(--accent);
          border-radius: 0 10px 10px 0;
          padding: 12px 16px;
          font-size: 13.5px;
          color: var(--muted);
          margin: 0 0 20px;
        }
      `}</style>
    </main>
  );
}
