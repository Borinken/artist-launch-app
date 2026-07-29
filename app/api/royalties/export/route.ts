import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { ROYALTY_SOURCE_LABELS } from '@/lib/royaltySources';

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

// GET /api/royalties/export?artist_id=xxx — descarga un CSV (se abre en Excel)
export async function GET(req: NextRequest) {
  const artistId = req.nextUrl.searchParams.get('artist_id');
  if (!artistId) return NextResponse.json({ error: 'artist_id requerido' }, { status: 400 });

  const { data: artist } = await supabaseAdmin.from('artists').select('artist_name, legal_name').eq('id', artistId).single();
  const { data: royalties } = await supabaseAdmin
    .from('royalty_entries')
    .select('*')
    .eq('artist_id', artistId)
    .order('period_month', { ascending: true });

  const rows = [
    ['Mes', 'Fuente', 'Monto', 'Moneda', 'Notas'],
    ...(royalties ?? []).map((r) => [
      r.period_month,
      ROYALTY_SOURCE_LABELS[r.source] ?? r.source,
      (r.amount_cents / 100).toFixed(2),
      r.currency.toUpperCase(),
      r.notes ?? '',
    ]),
  ];

  const total = (royalties ?? []).reduce((sum, r) => sum + r.amount_cents, 0) / 100;
  rows.push(['', '', '', '', '']);
  rows.push(['Total', '', total.toFixed(2), '', '']);

  const csv = rows.map((row) => row.map((cell) => escapeCsv(String(cell))).join(',')).join('\n');
  const filename = `reporte-monetizacion-${(artist?.artist_name || artist?.legal_name || 'artista').replace(/\s+/g, '-')}.csv`;

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
