import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

const VALID_ROLES = ['producer', 'manager'];

// POST /api/collaborators
// body: { artist_id, role, full_name, email, phone, tax_id, ipi_number, pro_affiliation, entity_name, commission_pct }
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { artist_id, role, full_name } = body;

  if (!artist_id || !VALID_ROLES.includes(role) || !full_name) {
    return NextResponse.json({ error: 'artist_id, role válido y full_name son requeridos' }, { status: 400 });
  }

  const { data: collaborator, error: collabError } = await supabaseAdmin
    .from('collaborators')
    .insert({
      full_name,
      role,
      email: body.email ?? null,
      phone: body.phone ?? null,
      tax_id: body.tax_id ?? null,
      ipi_number: body.ipi_number ?? null,
      pro_affiliation: body.pro_affiliation ?? null,
      entity_name: body.entity_name ?? null,
    })
    .select()
    .single();

  if (collabError) return NextResponse.json({ error: collabError.message }, { status: 500 });

  const { data: link, error: linkError } = await supabaseAdmin
    .from('artist_collaborators')
    .insert({
      artist_id,
      collaborator_id: collaborator.id,
      role,
      commission_pct: role === 'manager' && body.commission_pct != null ? body.commission_pct : null,
    })
    .select()
    .single();

  if (linkError) return NextResponse.json({ error: linkError.message }, { status: 500 });

  return NextResponse.json({ ...collaborator, link }, { status: 201 });
}

// PATCH /api/collaborators
// body: { collaborator_id, link_id?, commission_pct?, tax_id?, ipi_number?, pro_affiliation?, email?, phone? }
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { collaborator_id, link_id, commission_pct, ...fields } = body;

  if (!collaborator_id) return NextResponse.json({ error: 'collaborator_id requerido' }, { status: 400 });

  if (Object.keys(fields).length > 0) {
    const { error } = await supabaseAdmin.from('collaborators').update(fields).eq('id', collaborator_id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (link_id && commission_pct !== undefined) {
    const { error } = await supabaseAdmin.from('artist_collaborators').update({ commission_pct }).eq('id', link_id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// GET /api/collaborators?artist_id=xxx
export async function GET(req: NextRequest) {
  const artistId = req.nextUrl.searchParams.get('artist_id');
  if (!artistId) return NextResponse.json({ error: 'artist_id requerido' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('artist_collaborators')
    .select('*, collaborators(*)')
    .eq('artist_id', artistId)
    .eq('status', 'active');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
