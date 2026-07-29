import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

// POST /api/split-sheets
// body: { track_id, parties: [{ full_name, role, split_pct, pro_affiliation, ipi_number }] }
export async function POST(req: NextRequest) {
  const { track_id, parties } = await req.json();

  if (!track_id || !Array.isArray(parties) || parties.length === 0) {
    return NextResponse.json({ error: 'track_id y parties son requeridos' }, { status: 400 });
  }

  const totalPct = parties.reduce((sum: number, p: any) => sum + Number(p.split_pct || 0), 0);
  if (Math.round(totalPct) !== 100) {
    return NextResponse.json(
      { error: `El total de % debe ser 100. Recibido: ${totalPct}` },
      { status: 400 }
    );
  }

  const { data: sheet, error: sheetError } = await supabaseAdmin
    .from('split_sheets')
    .insert({ track_id, status: 'pending' })
    .select()
    .single();

  if (sheetError) {
    return NextResponse.json({ error: sheetError.message }, { status: 500 });
  }

  const partiesToInsert = parties.map((p: any) => ({
    split_sheet_id: sheet.id,
    full_name: p.full_name,
    role: p.role,
    split_pct: p.split_pct,
    pro_affiliation: p.pro_affiliation ?? null,
    ipi_number: p.ipi_number ?? null,
  }));

  const { error: partiesError } = await supabaseAdmin
    .from('split_sheet_parties')
    .insert(partiesToInsert);

  if (partiesError) {
    return NextResponse.json({ error: partiesError.message }, { status: 500 });
  }

  return NextResponse.json({ split_sheet_id: sheet.id, status: 'pending' }, { status: 201 });
}

// PATCH /api/split-sheets
// body: { party_id, signed: boolean }
// Marca la firma de un colaborador individual; cuando todos firmaron, el
// split sheet completo pasa a 'signed'.
export async function PATCH(req: NextRequest) {
  const { party_id, signed } = await req.json();
  if (!party_id) return NextResponse.json({ error: 'party_id es requerido' }, { status: 400 });

  const { data: party, error: partyError } = await supabaseAdmin
    .from('split_sheet_parties')
    .update({ signed_at: signed ? new Date().toISOString() : null })
    .eq('id', party_id)
    .select()
    .single();

  if (partyError) return NextResponse.json({ error: partyError.message }, { status: 500 });

  const { data: allParties } = await supabaseAdmin
    .from('split_sheet_parties')
    .select('signed_at')
    .eq('split_sheet_id', party.split_sheet_id);

  const allSigned = (allParties ?? []).length > 0 && (allParties ?? []).every((p) => p.signed_at);
  await supabaseAdmin
    .from('split_sheets')
    .update({ status: allSigned ? 'signed' : 'pending' })
    .eq('id', party.split_sheet_id);

  return NextResponse.json(party);
}

// GET /api/split-sheets?track_id=xxx
export async function GET(req: NextRequest) {
  const trackId = req.nextUrl.searchParams.get('track_id');
  if (!trackId) return NextResponse.json({ error: 'track_id requerido' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('split_sheets')
    .select('*, split_sheet_parties(*)')
    .eq('track_id', trackId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
