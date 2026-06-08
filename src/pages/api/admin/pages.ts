// Phase 3: Custom pages CRUD
import type { APIRoute } from 'astro';
import { createServerSupabase, createAdminSupabase } from '../../../lib/supabase-server';

async function getAdminUser(request: Request, cookies: any) {
  const sb = createServerSupabase(request, cookies);
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;
  const { data: p } = await sb.from('profiles').select('role').eq('id', user.id).single();
  return p && ['admin', 'staff'].includes(p.role) ? user : null;
}

export const GET: APIRoute = async ({ request, cookies }) => {
  const user = await getAdminUser(request, cookies);
  if (!user) return json({ error: 'Unauthorized' }, 401);
  const { data } = await createAdminSupabase().from('custom_pages').select('*').order('sort_order');
  return json(data ?? []);
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const user = await getAdminUser(request, cookies);
  if (!user) return json({ error: 'Unauthorized' }, 401);
  const body = await request.json();
  const { slug, title_th, title_en, content_th, content_en, show_in_nav, nav_label_th, nav_label_en, nav_parent, visible, sort_order } = body;
  if (!slug || !title_th) return json({ error: 'slug and title_th required' }, 400);
  const { data, error } = await createAdminSupabase().from('custom_pages')
    .insert({ slug, title_th, title_en: title_en || '', content_th: content_th || '', content_en: content_en || '',
      show_in_nav: show_in_nav ?? false, nav_label_th: nav_label_th || title_th,
      nav_label_en: nav_label_en || title_en || '', nav_parent: nav_parent || '',
      visible: visible ?? true, sort_order: sort_order ?? 0 })
    .select().single();
  if (error) return json({ error: error.message }, 500);
  return json(data);
};

export const PUT: APIRoute = async ({ request, cookies }) => {
  const user = await getAdminUser(request, cookies);
  if (!user) return json({ error: 'Unauthorized' }, 401);
  const body = await request.json();
  const { id, ...fields } = body;
  if (!id) return json({ error: 'Missing id' }, 400);
  fields.updated_at = new Date().toISOString();
  const { data, error } = await createAdminSupabase().from('custom_pages').update(fields).eq('id', id).select().single();
  if (error) return json({ error: error.message }, 500);
  return json(data);
};

export const DELETE: APIRoute = async ({ request, cookies, url }) => {
  const user = await getAdminUser(request, cookies);
  if (!user) return json({ error: 'Unauthorized' }, 401);
  const id = url.searchParams.get('id');
  if (!id) return json({ error: 'Missing id' }, 400);
  const { error } = await createAdminSupabase().from('custom_pages').delete().eq('id', id);
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true });
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}
