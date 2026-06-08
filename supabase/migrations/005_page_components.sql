-- Phase 4: Dynamic components per page/section
-- Allows admin to add/edit/remove cards: specialties, quick_cards, trust_points, testimonials, stats

CREATE TABLE IF NOT EXISTS page_components (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug   TEXT        NOT NULL,
  section_key TEXT        NOT NULL,
  comp_type   TEXT        NOT NULL,
  content     JSONB       NOT NULL DEFAULT '{}',
  sort_order  INT         NOT NULL DEFAULT 0,
  visible     BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_page_components_page_section ON page_components(page_slug, section_key);

ALTER TABLE page_components ENABLE ROW LEVEL SECURITY;

CREATE POLICY "page_components_public_read"
  ON page_components FOR SELECT USING (true);

CREATE POLICY "page_components_auth_write"
  ON page_components FOR ALL
  USING (auth.role() = 'authenticated');

COMMENT ON TABLE page_components IS
  'Dynamic components for page sections. comp_type: specialty_card, quick_card, trust_point, testimonial, stat_counter, quick_action.
   content shape varies by comp_type — all text fields are bilingual {th, en}.';
