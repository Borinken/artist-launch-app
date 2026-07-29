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
      status: 'draft',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
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
