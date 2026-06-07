// Server-side helper: read/write site_content from Supabase
import { createAdminSupabase } from './supabase-server';
import type { PageDef } from './cmsSchema';

export interface ContentSection {
  page_slug: string;
  section_key: string;
  content: {
    th?: Record<string, string>;
    en?: Record<string, string>;
    meta?: Record<string, string>;
  };
  updated_at?: string;
}

// Fetch all sections for one page (and optionally merge with a second page slug)
export async function getPageContent(
  pageSlugs: string | string[]
): Promise<Record<string, ContentSection>> {
  const slugs = Array.isArray(pageSlugs) ? pageSlugs : [pageSlugs];
  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from('site_content')
    .select('page_slug, section_key, content, updated_at')
    .in('page_slug', slugs);

  if (error || !data) return {};

  const result: Record<string, ContentSection> = {};
  for (const row of data) {
    result[`${row.page_slug}::${row.section_key}`] = row as ContentSection;
  }
  return result;
}

// Flatten all content for a page into a single TH + EN map
// (for injecting into the T object via the content API)
export async function getFlatContent(
  pageSlugs: string | string[]
): Promise<{ th: Record<string, string>; en: Record<string, string> }> {
  const sections = await getPageContent(pageSlugs);
  const th: Record<string, string> = {};
  const en: Record<string, string> = {};

  for (const section of Object.values(sections)) {
    Object.assign(th, section.content.th ?? {});
    Object.assign(en, section.content.en ?? {});
  }
  return { th, en };
}

// Upsert one section's content (admin only — use service role)
export async function upsertSection(
  pageSlug: string,
  sectionKey: string,
  content: ContentSection['content'],
  userId?: string
): Promise<{ error: string | null }> {
  const supabase = createAdminSupabase();
  const { error } = await supabase
    .from('site_content')
    .upsert(
      {
        page_slug: pageSlug,
        section_key: sectionKey,
        content,
        updated_at: new Date().toISOString(),
        updated_by: userId ?? null,
      },
      { onConflict: 'page_slug,section_key' }
    );

  return { error: error?.message ?? null };
}

// Get last-modified timestamp across a page's sections
export async function getPageLastModified(pageSlug: string): Promise<string | null> {
  const supabase = createAdminSupabase();
  const { data } = await supabase
    .from('site_content')
    .select('updated_at')
    .eq('page_slug', pageSlug)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();
  return data?.updated_at ?? null;
}
