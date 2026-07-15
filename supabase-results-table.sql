-- Create the results table for competition results
CREATE TABLE IF NOT EXISTS results (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  year text NOT NULL,
  title text NOT NULL,
  dog_name text NOT NULL,
  handler text DEFAULT '',
  result_type text DEFAULT 'gold',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read results"
  ON results FOR SELECT
  USING (true);

-- Authenticated users can insert
CREATE POLICY "Authenticated users can insert results"
  ON results FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update
CREATE POLICY "Authenticated users can update results"
  ON results FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete
CREATE POLICY "Authenticated users can delete results"
  ON results FOR DELETE
  TO authenticated
  USING (true);

-- Seed with existing hardcoded data
INSERT INTO results (year, title, dog_name, handler, result_type, sort_order) VALUES
  ('2019', 'DM Guld', 'Team Englund''s Aqua', 'Rita Andersen, PH Odder', 'gold', 1),
  ('2015', 'Udtaget til DM', 'Team Englund''s Bessi', 'Bente Andersen, PH Odder', 'silver', 2),
  ('2014', 'DM Guld', 'Team Englund''s Cooper', 'Niels Hansen, PH Odense', 'gold', 3),
  ('2012', 'DM Guld', 'Team Englund''s Aqua', 'Rita Andersen, PH Odder', 'gold', 4),
  ('2012', 'DM Sølv', 'Team Englund''s Basse', '', 'silver', 5);

-- Seed site_settings for om-os and kontakt pages (if not already there)
INSERT INTO site_settings (id, value) VALUES
  ('om_os_content', '')
ON CONFLICT (id) DO NOTHING;

INSERT INTO site_settings (id, value) VALUES
  ('contact_phone', '+45 2013 7884'),
  ('contact_email', 'team@kennel-englund.dk'),
  ('contact_address', 'Danmark'),
  ('contact_text', 'Har du spørgsmål om vores hunde, hvalpe eller opdræt? Du er altid velkommen til at kontakte os.')
ON CONFLICT (id) DO NOTHING;
