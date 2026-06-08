-- Phase 3: User-created custom pages

CREATE TABLE IF NOT EXISTS custom_pages (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  slug        TEXT        UNIQUE NOT NULL,
  title_th    TEXT        NOT NULL DEFAULT '',
  title_en    TEXT        NOT NULL DEFAULT '',
  content_th  TEXT        NOT NULL DEFAULT '',
  content_en  TEXT        NOT NULL DEFAULT '',
  show_in_nav BOOLEAN     NOT NULL DEFAULT FALSE,
  nav_label_th TEXT       NOT NULL DEFAULT '',
  nav_label_en TEXT       NOT NULL DEFAULT '',
  nav_parent  TEXT        NOT NULL DEFAULT '',  -- parent nav tab key, '' = top-level
  visible     BOOLEAN     NOT NULL DEFAULT TRUE,
  sort_order  INT         NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE custom_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "custom_pages_public_read"
  ON custom_pages FOR SELECT USING (visible = TRUE);

CREATE POLICY "custom_pages_auth_write"
  ON custom_pages FOR ALL
  USING (auth.role() = 'authenticated');
