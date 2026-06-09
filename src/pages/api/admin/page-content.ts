// GET /api/admin/page-content?slug=home
// Returns current DB overrides for a CMS page (used by inline admin editor).
// Auth is handled by middleware (all /api/admin routes require admin/staff).
import type { APIRoute } from 'astro';
import { createAdminSupabase } from '../../../lib/supabase-server';

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const GET: APIRoute = async ({ url }) => {
  const slug = url.searchParams.get('slug') ?? '';
  if (!slug) return json({ error: 'Missing slug' }, 400);

  const adminSupa = createAdminSupabase();
  const { data: rows, error } = await adminSupa
    .from('site_content')
    .select('section_key, content, updated_at')
    .eq('page_slug', slug);

  if (error) return json({ error: error.message }, 500);

  const sections: Record<string, unknown> = {};
  for (const row of rows ?? []) {
    sections[row.section_key] = { ...row.content, updated_at: row.updated_at };
  }

  return json({ sections });
};
