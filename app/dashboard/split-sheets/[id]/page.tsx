import { supabaseAdmin } from '@/lib/supabaseClient';
import PrintButton from '../../_components/PrintButton';
import { notFound } from 'next/navigation';

export default async function SplitSheetDocPage({ params }: { params: { id: string } }) {
  const { data: sheet } = await supabaseAdmin
    .from('split_sheets')
    .select('*, tracks(title, artist_id, artists(legal_name, artist_name)), split_sheet_parties(*)')
    .eq('id', params.id)
    .single();

  if (!sheet) return notFound();

  const parties = sheet.split_sheet_parties ?? [];
  const track = sheet.tracks;

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 32, fontFamily: 'Georgia, serif', color: '#111' }}>
      <div className="no-print" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/dashboard" style={{ fontFamily: 'system-ui', fontSize: 14, color: '#666' }}>← Volver al dashboard</a>
        <PrintButton />
      </div>

      <h1 style={{ fontSize: 26, marginBottom: 4 }}>Split Sheet</h1>
      <p style={{ color: '#888', fontFamily: 'system-ui', textTransform: 'uppercase', fontSize: 12, letterSpacing: '0.05em' }}>
        {track?.title ?? 'Obra'}
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: '8px 4px' }}>Colaborador</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: '8px 4px' }}>Rol</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: '8px 4px' }}>PRO</th>
            <th style={{ textAlign: 'right', borderBottom: '1px solid #ccc', padding: '8px 4px' }}>%</th>
          </tr>
        </thead>
        <tbody>
          {parties.map((p: any) => (
            <tr key={p.id}>
              <td style={{ padding: '8px 4px', borderBottom: '1px solid #f0f0f0' }}>{p.full_name}</td>
              <td style={{ padding: '8px 4px', borderBottom: '1px solid #f0f0f0' }}>{p.role ?? '—'}</td>
              <td style={{ padding: '8px 4px', borderBottom: '1px solid #f0f0f0' }}>{p.pro_affiliation ?? '—'}</td>
              <td style={{ padding: '8px 4px', borderBottom: '1px solid #f0f0f0', textAlign: 'right' }}>{p.split_pct}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', gap: 40, marginTop: 48, flexWrap: 'wrap' }}>
        {parties.map((p: any) => (
          <div key={p.id} style={{ flex: '1 1 200px', textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid #333', marginBottom: 6, height: 40 }} />
            <span style={{ fontFamily: 'system-ui', fontSize: 12, color: '#666' }}>{p.full_name}</span>
          </div>
        ))}
      </div>

      <p style={{ marginTop: 40, fontFamily: 'system-ui', fontSize: 11, color: '#999' }}>
        Documento generado automáticamente por Artist Launch OS. Estatus: {sheet.status}.
      </p>

      <style>{`@media print { .no-print { display: none !important; } }`}</style>
    </main>
  );
}
