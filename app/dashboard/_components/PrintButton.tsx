'use client';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print"
      style={{
        padding: '10px 20px',
        borderRadius: 8,
        border: 'none',
        background: '#111',
        color: '#fff',
        cursor: 'pointer',
        fontSize: 14,
      }}
    >
      Imprimir / Guardar como PDF
    </button>
  );
}
