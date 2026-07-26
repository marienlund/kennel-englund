CREATE TABLE IF NOT EXISTS litter_extra_photos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  litter_id uuid REFERENCES litters(id) ON DELETE CASCADE NOT NULL,
  parent_type text NOT NULL CHECK (parent_type IN ('sire', 'dam')),
  photo_url text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE litter_extra_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read litter photos" ON litter_extra_photos FOR SELECT USING (true);
CREATE POLICY "Admin can insert litter photos" ON litter_extra_photos FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin can delete litter photos" ON litter_extra_photos FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
