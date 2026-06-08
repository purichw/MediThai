// Phase 5: Page view tracking — public POST endpoint
import type { APIRoute } from 'astro';
import { createAdminSupabase } from '../../lib/supabase-server';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { page_path, lang, referrer } = await request.json();
    if (!page_path) return new Response('{}', { status: 400 });

    const ua = request.headers.get('user-agent') || '';
    const device_type = /mobile|android|iphone|ipad/i.test(ua) ? 'mobile'
      : /tablet/i.test(ua) ? 'tablet' : 'desktop';

    const supabase = createAdminSupabase();
    await supabase.from('page_views').insert({
      page_path: page_path.substring(0, 200),
      device_type,
      lang: lang || 'th',
      referrer: (referrer || '').substring(0, 200),
    });

    return new Response('{"ok":true}', {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response('{"ok":false}', { status: 500 });
  }
};
