import { defineMiddleware } from 'astro:middleware';
import { createServerClient, parseCookieHeader } from '@supabase/ssr';

const PATIENT_ROUTES = ['/dashboard', '/my-appointments', '/book'];
const ADMIN_ROUTES = ['/admin', '/api/admin'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, cookies, redirect } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  const isPatientRoute = PATIENT_ROUTES.some(r => path.startsWith(r));
  const isAdminRoute = ADMIN_ROUTES.some(r => path.startsWith(r));

  if (!isPatientRoute && !isAdminRoute) return next();

  const supabase = createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => parseCookieHeader(request.headers.get('Cookie') ?? ''),
        setAll: (cookiesToSet) => cookiesToSet.forEach(({ name, value, options }) => cookies.set(name, value, options)),
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect('/login');

  if (isAdminRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (!profile || !['admin', 'staff'].includes(profile.role)) {
      return redirect('/dashboard');
    }
  }

  return next();
});
