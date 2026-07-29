import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

// POST /api/tracks
// body: { artist_id, title, release_type }
export async function POST(req: NextRequest) {
  const { artist_id, title, release_type } = await req.json();

  if (!artist_id || !title) {
    return NextResponse.json({ error: 'artist_id y title son requeridos' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('tracks')
    .insert({
      artist_id,
      title,
      release_type: release_type ?? 'single',
      status: 'unreleased',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// PATCH /api/tracks
// body: { id, status?, isrc?, upc?, release_date? }
export async function PATCH(req: NextRequest) {
  const { id, status, isrc, upc, release_date } = await req.json();
  if (!id) return NextResponse.json({ error: 'id es requerido' }, { status: 400 });

  const update: Record<string, any> = {};
  if (status) update.status = status;
  if (isrc !== undefined) update.isrc = isrc;
  if (upc !== undefined) update.upc = upc;
  if (release_date !== undefined) update.release_date = release_date;

  const { data, error } = await supabaseAdmin
    .from('tracks')
    .update(update)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// GET /api/tracks?artist_id=xxx
export async function GET(req: NextRequest) {
  const artistId = req.nextUrl.searchParams.get('artist_id');
  if (!artistId) return NextResponse.json({ error: 'artist_id requerido' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('tracks')
    .select('*')
    .eq('artist_id', artistId)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
