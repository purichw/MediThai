// Phase 5: Analytics data for admin dashboard
import type { APIRoute } from 'astro';
import { createServerSupabase } from '../../../lib/supabase-server';
import { createAdminSupabase } from '../../../lib/supabase-server';

export const GET: APIRoute = async ({ request, cookies }) => {
  const supabase = createServerSupabase(request, cookies);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return json({ error: 'Unauthorized' }, 401);

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || !['admin', 'staff'].includes(profile.role)) return json({ error: 'Forbidden' }, 403);

  const admin = createAdminSupabase();

  // Total views last 7 / 30 days
  const [{ count: views7 }, { count: views30 }] = await Promise.all([
    admin.from('page_views').select('*', { count: 'exact', head: true })
      .gte('viewed_at', new Date(Date.now() - 7 * 86400000).toISOString()),
    admin.from('page_views').select('*', { count: 'exact', head: true })
      .gte('viewed_at', new Date(Date.now() - 30 * 86400000).toISOString()),
  ]);

  // Today's views
  const todayStart = new Date(); todayStart.setHours(0,0,0,0);
  const { count: viewsToday } = await admin.from('page_views').select('*', { count: 'exact', head: true })
    .gte('viewed_at', todayStart.toISOString());

  // Daily views for last 14 days
  const { data: dailyRaw } = await admin
    .from('page_views')
    .select('viewed_at')
    .gte('viewed_at', new Date(Date.now() - 14 * 86400000).toISOString())
    .order('viewed_at', { ascending: true });

  const dailyMap: Record<string, number> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    dailyMap[d.toISOString().slice(0, 10)] = 0;
  }
  for (const row of dailyRaw ?? []) {
    const key = row.viewed_at.slice(0, 10);
    if (key in dailyMap) dailyMap[key]++;
  }

  // Top pages (last 30 days)
  const { data: allPaths } = await admin
    .from('page_views')
    .select('page_path')
    .gte('viewed_at', new Date(Date.now() - 30 * 86400000).toISOString());

  const pathCount: Record<string, number> = {};
  for (const r of allPaths ?? []) {
    pathCount[r.page_path] = (pathCount[r.page_path] || 0) + 1;
  }
  const topPages = Object.entries(pathCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([path, count]) => ({ path, count }));

  // Device breakdown (last 30 days)
  const { data: deviceRaw } = await admin
    .from('page_views')
    .select('device_type')
    .gte('viewed_at', new Date(Date.now() - 30 * 86400000).toISOString());

  const deviceCount: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0 };
  for (const r of deviceRaw ?? []) deviceCount[r.device_type] = (deviceCount[r.device_type] || 0) + 1;

  // Lang breakdown
  const { data: langRaw } = await admin
    .from('page_views')
    .select('lang')
    .gte('viewed_at', new Date(Date.now() - 30 * 86400000).toISOString());

  const langCount: Record<string, number> = { th: 0, en: 0 };
  for (const r of langRaw ?? []) langCount[r.lang] = (langCount[r.lang] || 0) + 1;

  return json({
    summary: { viewsToday, views7, views30 },
    daily: Object.entries(dailyMap).map(([date, count]) => ({ date, count })),
    topPages,
    devices: deviceCount,
    langs: langCount,
  });
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}
