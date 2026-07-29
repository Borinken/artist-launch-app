import { supabaseAdmin } from '@/lib/supabaseClient';
import { renderContractHtml } from '@/lib/contractTemplates';
import PrintButton from '../../_components/PrintButton';
import { notFound } from 'next/navigation';

export default async function ContractDocPage({ params }: { params: { id: string } }) {
  const { data: contract } = await supabaseAdmin
    .from('contracts')
    .select('*, artists(*), tracks(title)')
    .eq('id', params.id)
    .single();

  if (!contract) return notFound();

  const cd = (contract.contract_data ?? {}) as Record<string, string>;

  const html = renderContractHtml({
    contractType: contract.contract_type,
    title: contract.title,
    artistLegalName: contract.artists?.legal_name ?? '',
    artistName: contract.artists?.artist_name,
    trackTitle: contract.tracks?.title ?? cd.track_title,
    counterpartyName: cd.counterparty_name,
    counterpartyRole: cd.counterparty_role,
    effectiveDate: cd.effective_date,
    percentage: cd.percentage,
    feeAmount: cd.fee_amount,
    territoryOrTerm: cd.territory_or_term,
    notes: cd.notes,
  });

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 32, fontFamily: 'Georgia, serif', color: '#111' }}>
      <div className="no-print" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/dashboard" style={{ fontFamily: 'system-ui', fontSize: 14, color: '#666' }}>← Volver al dashboard</a>
        <PrintButton />
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <style>{`
        h1 { font-size: 26px; margin-bottom: 4px; }
        h2 { font-size: 16px; margin-top: 28px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
        .muted { color: #888; font-family: system-ui; text-transform: uppercase; font-size: 12px; letter-spacing: 0.05em; }
        table.kv { width: 100%; border-collapse: collapse; margin-top: 12px; }
        table.kv td { padding: 6px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
        table.kv td:first-child { color: #666; width: 40%; }
        .signatures { display: flex; gap: 40px; margin-top: 48px; }
        .signatures > div { flex: 1; text-align: center; }
        .sig-line { border-top: 1px solid #333; margin-bottom: 6px; height: 40px; }
        .signatures span { font-family: system-ui; font-size: 12px; color: #666; }
        .disclaimer { margin-top: 40px; font-family: system-ui; font-size: 11px; color: #999; }
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>
    </main>
  );
}
