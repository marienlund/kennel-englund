-- ============================================
-- Site Settings table for editable homepage
-- Run this in Supabase SQL Editor
-- ============================================

-- Create the site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed with homepage keys
INSERT INTO site_settings (id, value) VALUES
  ('hero_image_url', ''),
  ('hero_title', 'Kennel Team Englund'),
  ('hero_subtitle', 'Schæferhundeopdræt siden 1984'),
  ('intro_text_1', 'Opdræt af schæferhunde med fokus på mentalitet, sundhed og brugbarhed — siden 1984.'),
  ('intro_text_2', 'Vi avler sunde, mentalt stærke og brugbare schæferhunde. Alle vores hunde er røntgenfotograferet, mentalt beskrevne og uddannede. Vi tror på, at en god schæferhund starter med et godt gemyt.')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view settings)
CREATE POLICY "site_settings_public_read"
  ON site_settings
  FOR SELECT
  USING (true);

-- Authenticated users can update (admin)
CREATE POLICY "site_settings_auth_update"
  ON site_settings
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can insert (in case new keys are needed)
CREATE POLICY "site_settings_auth_insert"
  ON site_settings
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
