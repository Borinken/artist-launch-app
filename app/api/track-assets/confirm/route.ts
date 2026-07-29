import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

// POST /api/track-assets/confirm
// body: { track_id, type: 'cover' | 'wav', path }
export async function POST(req: NextRequest) {
  const { track_id, type, path } = await req.json();
  if (!track_id || !['cover', 'wav'].includes(type) || !path) {
    return NextResponse.json({ error: 'track_id, type y path son requeridos' }, { status: 400 });
  }

  const update: Record<string, any> = type === 'cover' ? { cover_art_path: path } : { wav_file_path: path };

  const { data: track } = await supabaseAdmin.from('tracks').select('cover_art_path, wav_file_path').eq('id', track_id).single();
  const hasCover = type === 'cover' ? true : !!track?.cover_art_path;
  const hasWav = type === 'wav' ? true : !!track?.wav_file_path;
  if (hasCover && hasWav) update.distribution_status = 'assets_submitted';

  const { data, error } = await supabaseAdmin.from('tracks').update(update).eq('id', track_id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
