-- RLS for litters table: public read, admin write
-- Run this in the Supabase SQL Editor

-- Enable RLS if not already
ALTER TABLE litters ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view litters)
CREATE POLICY IF NOT EXISTS "Public read litters"
  ON litters FOR SELECT
  USING (true);

-- Admin insert
CREATE POLICY IF NOT EXISTS "Admin insert litters"
  ON litters FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admin update
CREATE POLICY IF NOT EXISTS "Admin update litters"
  ON litters FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admin delete
CREATE POLICY IF NOT EXISTS "Admin delete litters"
  ON litters FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
