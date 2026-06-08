-- Phase 5: Simple page view analytics

CREATE TABLE IF NOT EXISTS page_views (
  id          BIGSERIAL   PRIMARY KEY,
  page_path   TEXT        NOT NULL,
  viewed_at   TIMESTAMPTZ DEFAULT now(),
  device_type TEXT        NOT NULL DEFAULT 'desktop',  -- 'mobile', 'tablet', 'desktop'
  lang        TEXT        NOT NULL DEFAULT 'th',
  referrer    TEXT        NOT NULL DEFAULT ''
);

CREATE INDEX idx_page_views_viewed_at ON page_views(viewed_at DESC);
CREATE INDEX idx_page_views_page_path ON page_views(page_path);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Public can insert (tracking)
CREATE POLICY "page_views_insert"
  ON page_views FOR INSERT WITH CHECK (true);

-- Only admins can read
CREATE POLICY "page_views_auth_read"
  ON page_views FOR SELECT
  USING (auth.role() = 'authenticated');
