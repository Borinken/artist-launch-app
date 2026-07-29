import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

const VALID_SOURCES = ['composition_pro', 'master_distribution', 'youtube_content_id', 'shows', 'merch', 'sync'];

// POST /api/royalties
// body: { artist_id, source, amount_cents, currency, period_month, notes }
export async function POST(req: NextRequest) {
  const { artist_id, source, amount_cents, currency, period_month, notes } = await req.json();

  if (!artist_id || !VALID_SOURCES.includes(source) || !period_month) {
    return NextResponse.json({ error: 'artist_id, source válido y period_month son requeridos' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('royalty_entries')
    .insert({
      artist_id,
      source,
      amount_cents: amount_cents ?? 0,
      currency: currency ?? 'usd',
      period_month,
      notes: notes ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// GET /api/royalties?artist_id=xxx
export async function GET(req: NextRequest) {
  const artistId = req.nextUrl.searchParams.get('artist_id');
  if (!artistId) return NextResponse.json({ error: 'artist_id requerido' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('royalty_entries')
    .select('*')
    .eq('artist_id', artistId)
    .order('period_month', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
