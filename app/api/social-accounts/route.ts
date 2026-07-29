import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

const VALID_PLATFORMS = ['instagram', 'tiktok', 'youtube', 'spotify', 'apple_music'];

// POST /api/social-accounts  (upsert por artist_id + platform)
// body: { artist_id, platform, handle, status, followers_count, monthly_listeners, profile_url }
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { artist_id, platform } = body;

  if (!artist_id || !VALID_PLATFORMS.includes(platform)) {
    return NextResponse.json({ error: 'artist_id y platform válida son requeridos' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('social_accounts')
    .upsert({
      artist_id,
      platform,
      handle: body.handle ?? null,
      status: body.status ?? 'connected',
      followers_count: body.followers_count ?? null,
      monthly_listeners: body.monthly_listeners ?? null,
      profile_url: body.profile_url ?? null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'artist_id,platform' })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// GET /api/social-accounts?artist_id=xxx
export async function GET(req: NextRequest) {
  const artistId = req.nextUrl.searchParams.get('artist_id');
  if (!artistId) return NextResponse.json({ error: 'artist_id requerido' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('social_accounts')
    .select('*')
    .eq('artist_id', artistId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
