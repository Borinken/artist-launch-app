import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

const VALID_TYPES = [
  'producer_agreement', 'management_agreement', 'publishing_agreement',
  'beat_license', 'nda', 'photo_release', 'video_release', 'work_for_hire',
  'letter_of_direction', 'cesion_derechos_es',
];

// POST /api/contracts
// body: { artist_id, track_id?, contract_type, title, contract_data }
export async function POST(req: NextRequest) {
  const { artist_id, track_id, contract_type, title, contract_data } = await req.json();

  if (!artist_id || !contract_type || !VALID_TYPES.includes(contract_type)) {
    return NextResponse.json(
      { error: 'artist_id y contract_type (válido) son requeridos' },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from('contracts')
    .insert({
      artist_id,
      track_id: track_id ?? null,
      contract_type,
      title: title ?? null,
      contract_data: contract_data ?? {},
      status: 'draft',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// GET /api/contracts?artist_id=xxx
export async function GET(req: NextRequest) {
  const artistId = req.nextUrl.searchParams.get('artist_id');
  if (!artistId) return NextResponse.json({ error: 'artist_id requerido' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('contracts')
    .select('*')
    .eq('artist_id', artistId)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
