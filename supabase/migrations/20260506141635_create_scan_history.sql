/*
  # Create SEO/AEO Scan History Tables

  1. New Tables
    - `scan_results`
      - `id` (uuid, primary key)
      - `url` (text) - The scanned URL
      - `seo_score` (integer) - SEO score 0-100
      - `aeo_score` (integer) - AEO readiness score 0-100
      - `entities` (jsonb) - Array of detected entities
      - `schema_types` (jsonb) - Detected JSON-LD schema types
      - `meta_tags` (jsonb) - Meta tag analysis results
      - `headings` (jsonb) - H1-H6 hierarchy data
      - `insights` (jsonb) - Actionable insights/fixes
      - `ai_preview` (text) - AI citation preview text
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `scan_results` table
    - Public read/write allowed (anonymous tool, no auth required)
    - Policies use anon role for public access

  3. Notes
    - This is a public SEO analysis tool, no user authentication required
    - Scans are stored for comparison and history features
*/

CREATE TABLE IF NOT EXISTS scan_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  seo_score integer NOT NULL DEFAULT 0,
  aeo_score integer NOT NULL DEFAULT 0,
  entities jsonb NOT NULL DEFAULT '[]',
  schema_types jsonb NOT NULL DEFAULT '[]',
  meta_tags jsonb NOT NULL DEFAULT '{}',
  headings jsonb NOT NULL DEFAULT '[]',
  insights jsonb NOT NULL DEFAULT '[]',
  ai_preview text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE scan_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert scan results"
  ON scan_results FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read scan results"
  ON scan_results FOR SELECT
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_scan_results_url ON scan_results(url);
CREATE INDEX IF NOT EXISTS idx_scan_results_created_at ON scan_results(created_at DESC);
