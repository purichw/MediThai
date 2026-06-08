// Phase 4: Admin CRUD for page components
import type { APIRoute } from 'astro';
import { createServerSupabase, createAdminSupabase } from '../../../lib/supabase-server';

async function getAdminUser(request: Request, cookies: any) {
  const sb = createServerSupabase(request, cookies);
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;
  const { data: profile } = await sb.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || !['admin', 'staff'].includes(profile.role)) return null;
  return user;
}

// GET: list components for a page/section
export const GET: APIRoute = async ({ request, cookies, url }) => {
  const user = await getAdminUser(request, cookies);
  if (!user) return json({ error: 'Unauthorized' }, 401);

  const page = url.searchParams.get('page') || 'home';
  const section = url.searchParams.get('section') || '';
  const supabase = createAdminSupabase();
  let q = supabase.from('page_components').select('*').eq('page_slug', page).order('sort_order');
  if (section) q = q.eq('section_key', section);
  const { data, error } = await q;
  if (error) return json({ error: error.message }, 500);
  return json(data);
};

// POST: create component
export const POST: APIRoute = async ({ request, cookies }) => {
  const user = await getAdminUser(request, cookies);
  if (!user) return json({ error: 'Unauthorized' }, 401);

  const body = await request.json();
  const { page_slug, section_key, comp_type, content, sort_order, visible } = body;
  if (!page_slug || !section_key || !comp_type) return json({ error: 'Missing fields' }, 400);

  const supabase = createAdminSupabase();
  const { data, error } = await supabase.from('page_components').insert({
    page_slug, section_key, comp_type,
    content: content || {},
    sort_order: sort_order ?? 0,
    visible: visible ?? true,
    updated_at: new Date().toISOString(),
  }).select().single();
  if (error) return json({ error: error.message }, 500);
  return json(data);
};

// PUT: update component
export const PUT: APIRoute = async ({ request, cookies }) => {
  const user = await getAdminUser(request, cookies);
  if (!user) return json({ error: 'Unauthorized' }, 401);

  const body = await request.json();
  const { id, content, sort_order, visible } = body;
  if (!id) return json({ error: 'Missing id' }, 400);

  const supabase = createAdminSupabase();
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (content !== undefined) update.content = content;
  if (sort_order !== undefined) update.sort_order = sort_order;
  if (visible !== undefined) update.visible = visible;

  const { data, error } = await supabase.from('page_components').update(update).eq('id', id).select().single();
  if (error) return json({ error: error.message }, 500);
  return json(data);
};

// DELETE: remove component
export const DELETE: APIRoute = async ({ request, cookies, url }) => {
  const user = await getAdminUser(request, cookies);
  if (!user) return json({ error: 'Unauthorized' }, 401);

  const id = url.searchParams.get('id');
  if (!id) return json({ error: 'Missing id' }, 400);

  const supabase = createAdminSupabase();
  const { error } = await supabase.from('page_components').delete().eq('id', id);
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true });
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}
