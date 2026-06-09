// Shared helper — load a page's CMS content from site_content DB.
// Returns { db, th, en, cmsScript } ready to use in any Astro page.
import { createAdminSupabase } from './supabase-server';

export interface HeroDefaults {
  pg_title: string;
  pg_desc: string;
  pg_title_en?: string;
  pg_desc_en?: string;
}

export async function loadPageCMS(slug: string, defaults: HeroDefaults) {
  const supabase = createAdminSupabase();
  const { data: rows } = await supabase
    .from('site_content')
    .select('section_key, content')
    .eq('page_slug', slug);

  const db: Record<string, any> = {};
  for (const row of rows ?? []) db[row.section_key] = row.content;

  const heroDb = db.hero ?? {};

  const th: Record<string, string> = {
    pg_title: heroDb.th?.pg_title ?? defaults.pg_title,
    pg_desc:  heroDb.th?.pg_desc  ?? defaults.pg_desc,
  };
  const en: Record<string, string> = {
    pg_title: heroDb.en?.pg_title ?? (defaults.pg_title_en ?? defaults.pg_title),
    pg_desc:  heroDb.en?.pg_desc  ?? (defaults.pg_desc_en  ?? defaults.pg_desc),
  };

  const cmsScript = `<script>window.__CMS_P__=${JSON.stringify({ th, en })}<\\/script>`;

  return { db, th, en, cmsScript };
}
