// Shared helper — load a page's CMS content from site_content DB.
// Returns { db, th, en, cmsScript } ready to use in any Astro page.
import { createAdminSupabase } from './supabase-server';
import { cmsList } from './cmsSchema';

// ── Full-page CMS loader ─────────────────────────────────────────
// Usage (frontmatter):
//   const cms = await makePageCms('about');
//   const heading = cms.t('intro', 'heading', 'หัวข้อ default', 'Default heading');
//   const stats   = cms.items('intro', 'stats');                  // saved list or schema defaults
//   const lbl     = cms.li('intro', 'stats', i, 'label', item);   // bilingual item field
//   template: <h2 data-i18n={heading.k} set:html={heading.th} />
//   head:     <Fragment set:html={cms.script()} />
export interface CmsText { th: string; en: string; k: string }

export async function makePageCms(slug: string) {
  const supabase = createAdminSupabase();
  const { data: rows } = await supabase
    .from('site_content')
    .select('section_key, content')
    .eq('page_slug', slug);
  const db: Record<string, any> = {};
  for (const row of rows ?? []) db[row.section_key] = row.content;

  const thMap: Record<string, string> = {};
  const enMap: Record<string, string> = {};

  // bilingual scalar — DB override wins, else default; registers i18n key
  const t = (sec: string, key: string, defTh: string, defEn?: string): CmsText => {
    const th = db[sec]?.th?.[key] ?? defTh;
    const en = db[sec]?.en?.[key] ?? (defEn ?? defTh);
    const k = `c_${sec}_${key}`;
    thMap[k] = th; enMap[k] = en;
    return { th, en, k };
  };
  // mono scalar (stored in meta)
  const m = (sec: string, key: string, def: string): string =>
    db[sec]?.meta?.[key] ?? def;
  // list — saved array or schema defaults
  const items = (sec: string, key: string): Record<string, string>[] =>
    cmsList(db, sec, key, slug);
  // bilingual field inside a list item — registers i18n key
  const li = (sec: string, listKey: string, idx: number, fieldKey: string, item: Record<string, string>): CmsText => {
    const th = item[`${fieldKey}_th`] ?? '';
    const en = item[`${fieldKey}_en`] || th;
    const k = `li_${sec}_${listKey}_${idx}_${fieldKey}`;
    thMap[k] = th; enMap[k] = en;
    return { th, en, k };
  };
  const script = () =>
    `<script>window.__CMS_P__=${JSON.stringify({ th: thMap, en: enMap })}<\\/script>`;

  return { db, t, m, items, li, script };
}

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
