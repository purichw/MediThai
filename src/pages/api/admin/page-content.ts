// GET /api/admin/page-content?slug=home
// Returns current DB overrides for a CMS page (used by inline admin editor).
import type { APIRoute } from 'astro';
import { createAdminSupabase, createServerSupabase } from '../../../lib/supabase-server';

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const GET: APIRoute = async ({ url, request, cookies }) => {
  // Auth check
  const supabase = createServerSupabase(request, cookies);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return json({ error: 'Unauthorized' }, 401);
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || !['admin', 'staff'].includes(profile.role)) return json({ error: 'Forbidden' }, 403);

  const slug = url.searchParams.get('slug') ?? '';
  if (!slug) return json({ error: 'Missing slug' }, 400);

  const adminSupa = createAdminSupabase();
  const { data: rows } = await adminSupa
    .from('site_content')
    .select('section_key, content, updated_at')
    .eq('page_slug', slug);

  const sections: Record<string, unknown> = {};
  for (const row of rows ?? []) {
    sections[row.section_key] = { ...row.content, updated_at: row.updated_at };
  }

  return json({ sections });
};
