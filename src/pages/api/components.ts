// Phase 4: Public GET for page components
import type { APIRoute } from 'astro';
import { createAdminSupabase } from '../../lib/supabase-server';

export const GET: APIRoute = async ({ url }) => {
  const page = url.searchParams.get('page') || 'home';
  const section = url.searchParams.get('section') || '';

  const supabase = createAdminSupabase();
  let q = supabase
    .from('page_components')
    .select('id, section_key, comp_type, content, sort_order, visible')
    .eq('page_slug', page)
    .eq('visible', true)
    .order('sort_order', { ascending: true });

  if (section) q = q.eq('section_key', section);

  const { data } = await q;

  return new Response(JSON.stringify(data ?? []), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
    },
  });
};
