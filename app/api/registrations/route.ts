import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

// POST /api/registrations
// body: { artist_id, track_id, registration_type, provider }
export async function POST(req: NextRequest) {
  const { artist_id, track_id, registration_type, provider } = await req.json();

  if (!artist_id || !registration_type) {
    return NextResponse.json(
      { error: 'artist_id y registration_type son requeridos' },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from('registrations')
    .insert({
      artist_id,
      track_id: track_id ?? null,
      registration_type,
      provider: provider ?? null,
      status: 'pending',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// PATCH /api/registrations  — actualizar estatus (uso interno/admin)
// body: { id, status, external_reference? }
export async function PATCH(req: NextRequest) {
  const { id, status, external_reference } = await req.json();
  if (!id || !status) {
    return NextResponse.json({ error: 'id y status son requeridos' }, { status: 400 });
  }

  const update: Record<string, any> = { status };
  if (external_reference) update.external_reference = external_reference;
  if (status === 'completed') update.completed_at = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from('registrations')
    .update(update)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Recalcular % de progreso de carrera del artista con base en registros completados
  if (data?.artist_id) {
    const { data: regs } = await supabaseAdmin
      .from('registrations')
      .select('status')
      .eq('artist_id', data.artist_id);

    if (regs && regs.length > 0) {
      const completed = regs.filter((r) => r.status === 'completed').length;
      const pct = Math.round((completed / regs.length) * 100);
      await supabaseAdmin
        .from('artists')
        .update({ career_progress_pct: pct })
        .eq('id', data.artist_id);
    }
  }

  return NextResponse.json(data);
}
