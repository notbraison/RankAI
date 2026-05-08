import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ScanResult = {
  id: string;
  url: string;
  seo_score: number;
  aeo_score: number;
  entities: Entity[];
  schema_types: string[];
  meta_tags: MetaTags;
  headings: Heading[];
  insights: Insight[];
  ai_preview: string;
  created_at: string;
};

export type Entity = {
  name: string;
  type: 'organization' | 'person' | 'product' | 'topic' | 'location' | 'technology';
  relevance: number;
};

export type MetaTags = {
  title: string | null;
  description: string | null;
  canonical: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  twitter_card: string | null;
  robots: string | null;
};

export type Heading = {
  level: number;
  text: string;
};

export type Insight = {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'seo' | 'aeo';
  title: string;
  description: string;
  fix: string;
};
