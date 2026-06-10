// Admin endpoint: upload an image to Supabase Storage (site-media bucket).
// Protected by middleware (ADMIN_ROUTES includes /api/admin) + explicit role check.
export const prerender = false;
import type { APIRoute } from 'astro';
import { createServerSupabase, createAdminSupabase } from '../../../lib/supabase-server';

const BUCKET = 'site-media';
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif'];

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabaseUser = createServerSupabase(request, cookies);
  const { data: { user } } = await supabaseUser.auth.getUser();
  if (!user) return json({ error: 'Unauthorized' }, 401);
  const { data: profile } = await supabaseUser.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || !['admin', 'staff'].includes(profile.role)) return json({ error: 'Forbidden' }, 403);

  let file: File | null = null;
  try {
    const form = await request.formData();
    file = form.get('file') as File | null;
  } catch {
    return json({ error: 'Invalid form data' }, 400);
  }
  if (!file) return json({ error: 'No file' }, 400);
  if (!ALLOWED.includes(file.type)) return json({ error: `ชนิดไฟล์ไม่รองรับ (${file.type})` }, 400);
  if (file.size > MAX_BYTES) return json({ error: 'ไฟล์ใหญ่เกิน 5 MB' }, 400);

  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const admin = createAdminSupabase();
  let { error } = await admin.storage.from(BUCKET).upload(path, bytes, {
    contentType: file.type, cacheControl: '31536000', upsert: false,
  });

  // Bucket missing on first ever upload — create it (public) and retry once
  if (error && /bucket/i.test(error.message)) {
    await admin.storage.createBucket(BUCKET, { public: true, fileSizeLimit: MAX_BYTES });
    ({ error } = await admin.storage.from(BUCKET).upload(path, bytes, {
      contentType: file.type, cacheControl: '31536000', upsert: false,
    }));
  }
  if (error) return json({ error: error.message }, 500);

  const { data } = admin.storage.from(BUCKET).getPublicUrl(path);
  return json({ ok: true, url: data.publicUrl, path });
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}
