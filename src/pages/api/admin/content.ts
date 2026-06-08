// Admin endpoint: save/delete content sections.
// Protected by middleware (ADMIN_ROUTES includes /api/admin).
import type { APIRoute } from 'astro';
import { createServerSupabase } from '../../../lib/supabase-server';
import { upsertSection } from '../../../lib/siteContent';
import { CMS_PAGE_MAP } from '../../../lib/cmsSchema';

export const PUT: APIRoute = async ({ request, cookies }) => {
  // Verify the caller is authenticated + admin/staff via Supabase session
  const supabase = createServerSupabase(request, cookies);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return json({ error: 'Unauthorized' }, 401);

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (!profile || !['admin', 'staff'].includes(profile.role)) {
    return json({ error: 'Forbidden' }, 403);
  }

  let body: { page_slug: string; section_key: string; content: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const { page_slug, section_key, content } = body;

  // Special system section keys: _layout (Phase 2), _nav_config (Phase 3) — allowed on any page_slug
  const SYSTEM_KEYS = ['_layout', '_nav_config'];
  if (!SYSTEM_KEYS.includes(section_key)) {
    // Validate page/section exists in schema
    const pageDef = CMS_PAGE_MAP[page_slug];
    if (!pageDef) return json({ error: `Unknown page: ${page_slug}` }, 400);
    if (!pageDef.sections.find(s => s.key === section_key)) {
      return json({ error: `Unknown section: ${section_key}` }, 400);
    }
  }

  // Basic content validation
  if (!content || typeof content !== 'object') {
    return json({ error: 'content must be an object' }, 400);
  }

  const { error } = await upsertSection(page_slug, section_key, content as any, user.id);
  if (error) return json({ error }, 500);

  return json({ ok: true, page_slug, section_key, saved_at: new Date().toISOString() });
};

// DELETE a single key override within a section (or entire section)
export const DELETE: APIRoute = async ({ request, cookies }) => {
  const supabase = createServerSupabase(request, cookies);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return json({ error: 'Unauthorized' }, 401);

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (!profile || !['admin', 'staff'].includes(profile.role)) {
    return json({ error: 'Forbidden' }, 403);
  }

  const url = new URL(request.url);
  const page_slug = url.searchParams.get('page');
  const section_key = url.searchParams.get('section');

  if (!page_slug || !section_key) {
    return json({ error: 'page and section query params required' }, 400);
  }

  const { createAdminSupabase } = await import('../../../lib/supabase-server');
  const adminSupa = createAdminSupabase();
  const { error } = await adminSupa
    .from('site_content')
    .delete()
    .eq('page_slug', page_slug)
    .eq('section_key', section_key);

  if (error) return json({ error: error.message }, 500);
  return json({ ok: true });
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
