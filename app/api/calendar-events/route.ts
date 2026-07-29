import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

// POST /api/calendar-events
// body: { artist_id, title, event_date, event_type, collaborator_id }
export async function POST(req: NextRequest) {
  const { artist_id, title, event_date, event_type, collaborator_id } = await req.json();

  if (!artist_id || !title || !event_date) {
    return NextResponse.json({ error: 'artist_id, title y event_date son requeridos' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('calendar_events')
    .insert({ artist_id, title, event_date, event_type: event_type ?? null, collaborator_id: collaborator_id || null })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// GET /api/calendar-events?artist_id=xxx
export async function GET(req: NextRequest) {
  const artistId = req.nextUrl.searchParams.get('artist_id');
  if (!artistId) return NextResponse.json({ error: 'artist_id requerido' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('calendar_events')
    .select('*')
    .eq('artist_id', artistId)
    .order('event_date', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
