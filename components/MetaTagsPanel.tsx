'use client';

import { Check, X, ExternalLink } from 'lucide-react';
import type { MetaTags } from '@/lib/supabase';

type Props = {
  metaTags: MetaTags;
  headings: { level: number; text: string }[];
};

export default function MetaTagsPanel({ metaTags, headings }: Props) {
  const checks = [
    { label: 'Title Tag', value: metaTags.title, present: !!metaTags.title },
    { label: 'Meta Description', value: metaTags.description, present: !!metaTags.description },
    { label: 'Canonical URL', value: metaTags.canonical, present: !!metaTags.canonical },
    { label: 'OG Title', value: metaTags.og_title, present: !!metaTags.og_title },
    { label: 'OG Description', value: metaTags.og_description, present: !!metaTags.og_description },
    { label: 'OG Image', value: metaTags.og_image, present: !!metaTags.og_image },
    { label: 'Twitter Card', value: metaTags.twitter_card, present: !!metaTags.twitter_card },
    { label: 'Robots', value: metaTags.robots, present: !!metaTags.robots },
  ];

  const presentCount = checks.filter(c => c.present).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-400">{presentCount}/{checks.length} tags present</span>
        <div className="h-1.5 w-32 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
            style={{ width: `${(presentCount / checks.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-1.5">
        {checks.map(check => (
          <div key={check.label} className={`flex items-start gap-2 px-3 py-2 rounded-lg border ${check.present ? 'bg-emerald-950/20 border-emerald-800/30' : 'bg-red-950/20 border-red-800/30'}`}>
            {check.present
              ? <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
              : <X className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
            }
            <div className="min-w-0 flex-1">
              <span className="text-xs font-medium text-zinc-300">{check.label}</span>
              {check.value && (
                <p className="text-[11px] text-zinc-500 truncate mt-0.5">{check.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {headings.length > 0 && (
        <div className="pt-3 border-t border-zinc-800 space-y-1.5">
          <p className="text-xs font-medium text-zinc-400 mb-2">Heading Hierarchy</p>
          {headings.slice(0, 5).map((h, i) => (
            <div key={i} className="flex items-start gap-2" style={{ paddingLeft: `${(h.level - 1) * 12}px` }}>
              <span className="text-[10px] text-zinc-600 font-mono mt-0.5 w-5 flex-shrink-0">H{h.level}</span>
              <span className="text-xs text-zinc-400 truncate">{h.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
