import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

const EDITABLE_FIELDS = [
  'legal_name', 'artist_name', 'email', 'phone', 'country', 'tax_id',
  'legal_entity_name', 'has_w9', 'has_w8ben', 'manager_name', 'label_name',
] as const;

// PATCH /api/artists
// body: { id, ...campos editables del perfil/auditoría }
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: 'id es requerido' }, { status: 400 });
  }

  const update: Record<string, any> = {};
  for (const field of EDITABLE_FIELDS) {
    if (field in body) update[field] = body[field];
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'No hay campos válidos para actualizar' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('artists')
    .update(update)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
