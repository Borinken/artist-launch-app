import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

const BUCKET = 'track-assets';

// POST /api/track-assets/sign
// body: { track_id, type: 'cover' | 'wav' }
// Genera una URL firmada para subir directo desde el navegador a Supabase
// Storage, evitando el límite de tamaño de body de las funciones de Vercel.
export async function POST(req: NextRequest) {
  const { track_id, type } = await req.json();

  if (!track_id || !['cover', 'wav'].includes(type)) {
    return NextResponse.json({ error: 'track_id y type (cover|wav) son requeridos' }, { status: 400 });
  }

  const path = type === 'cover' ? `${track_id}/cover.jpg` : `${track_id}/master.wav`;

  await supabaseAdmin.storage.from(BUCKET).remove([path]);

  const { data, error } = await supabaseAdmin.storage.from(BUCKET).createSignedUploadUrl(path);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ path, token: data.token, signedUrl: data.signedUrl });
}
