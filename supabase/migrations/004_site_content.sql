-- CMS: site_content table for admin-editable content
-- Run in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS site_content (
  page_slug   TEXT        NOT NULL,
  section_key TEXT        NOT NULL,
  content     JSONB       NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ DEFAULT now(),
  updated_by  UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  PRIMARY KEY (page_slug, section_key)
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Anyone can read (content is public)
CREATE POLICY "site_content_public_read"
  ON site_content FOR SELECT USING (true);

-- Authenticated users can write (role check is done in the API layer)
CREATE POLICY "site_content_auth_write"
  ON site_content FOR ALL
  USING (auth.role() = 'authenticated');

COMMENT ON TABLE site_content IS
  'CMS content overrides per page/section. Keys match data-i18n attributes in translations.js.
   content JSON shape: {"th": {"key": "value", ...}, "en": {"key": "value", ...}, "meta": {...}}';
