// Public endpoint: returns content overrides for a page.
// Client merges these into the T object (translations.js) at runtime.
import type { APIRoute } from 'astro';
import { getFlatContent } from '../../lib/siteContent';

export const GET: APIRoute = async ({ url }) => {
  const page = url.searchParams.get('page') || 'home';
  const slugs = ['global', ...(page !== 'global' ? [page] : [])];

  const content = await getFlatContent(slugs);

  return new Response(JSON.stringify(content), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
};
