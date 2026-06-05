export const prerender = false;
import type { APIRoute } from 'astro';
import { createServerSupabase } from '../../lib/supabase-server';

export const GET: APIRoute = async ({ request, cookies, redirect, url }) => {
  const code = url.searchParams.get('code');
  if (code) {
    const supabase = createServerSupabase(request, cookies);
    await supabase.auth.exchangeCodeForSession(code);
  }
  return redirect('/dashboard');
};
