'use server';

import { analyzeUrl } from '@/lib/analyzer';
import { supabase } from '@/lib/supabase';
import type { ScanResult } from '@/lib/supabase';

export type ScanActionResult =
  | { success: true; data: ScanResult }
  | { success: false; error: string };

export async function scanUrl(url: string): Promise<ScanActionResult> {
  try {
    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
    new URL(normalizedUrl);

    const analysis = analyzeUrl(normalizedUrl);

    const { data, error } = await supabase
      .from('scan_results')
      .insert({
        url: normalizedUrl,
        seo_score: analysis.seo_score,
        aeo_score: analysis.aeo_score,
        entities: analysis.entities,
        schema_types: analysis.schema_types,
        meta_tags: analysis.meta_tags,
        headings: analysis.headings,
        insights: analysis.insights,
        ai_preview: analysis.ai_preview,
      })
      .select()
      .single();

    if (error) {
      return { success: true, data: { ...analysis, id: crypto.randomUUID(), created_at: new Date().toISOString() } };
    }

    return { success: true, data: data as ScanResult };
  } catch {
    return { success: false, error: 'Invalid URL. Please enter a valid website address.' };
  }
}

export async function getRecentScans(): Promise<ScanResult[]> {
  const { data } = await supabase
    .from('scan_results')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  return (data as ScanResult[]) || [];
}
