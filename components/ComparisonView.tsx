'use client';

import { useState, useTransition } from 'react';
import { TrendingUp, TrendingDown, Minus, ArrowRight, Globe, Loader as Loader2 } from 'lucide-react';
import { scanUrl } from '@/app/actions';
import type { ScanResult } from '@/lib/supabase';

type Props = {
  primaryResult: ScanResult;
};

type RadarPoint = { metric: string; you: number; competitor: number };

function polarToXY(angle: number, r: number, cx: number, cy: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function RadarChartSVG({ data }: { data: RadarPoint[] }) {
  const cx = 120, cy = 120, maxR = 90;
  const n = data.length;
  const rings = [0.25, 0.5, 0.75, 1];

  const gridPaths = rings.map(r =>
    data.map((_, i) => {
      const { x, y } = polarToXY((360 / n) * i, maxR * r, cx, cy);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ') + ' Z'
  );

  const axes = data.map((_, i) => {
    const { x, y } = polarToXY((360 / n) * i, maxR, cx, cy);
    return { x, y };
  });

  const makePolygon = (key: 'you' | 'competitor') =>
    data.map((d, i) => {
      const val = d[key] / 100;
      const { x, y } = polarToXY((360 / n) * i, maxR * val, cx, cy);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ') + ' Z';

  return (
    <svg width="240" height="240" viewBox="0 0 240 240" className="mx-auto">
      {gridPaths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#27272a" strokeWidth="1" />
      ))}
      {axes.map((pt, i) => (
        <line key={i} x1={cx} y1={cy} x2={pt.x} y2={pt.y} stroke="#27272a" strokeWidth="1" />
      ))}
      <path d={makePolygon('you')} fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" />
      <path d={makePolygon('competitor')} fill="rgba(245,158,11,0.12)" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round" />
      {data.map((d, i) => {
        const angle = (360 / n) * i;
        const { x, y } = polarToXY(angle, maxR + 18, cx, cy);
        const anchor = x < cx - 5 ? 'end' : x > cx + 5 ? 'start' : 'middle';
        return (
          <text key={i} x={x} y={y} textAnchor={anchor} dominantBaseline="middle" fill="#71717a" fontSize="10">
            {d.metric}
          </text>
        );
      })}
      <g transform="translate(148, 210)">
        <rect x="0" y="0" width="8" height="8" rx="2" fill="#3b82f6" />
        <text x="11" y="7" fill="#71717a" fontSize="10">You</text>
        <rect x="36" y="0" width="8" height="8" rx="2" fill="#f59e0b" />
        <text x="47" y="7" fill="#71717a" fontSize="10">Them</text>
      </g>
    </svg>
  );
}

function ScoreDiff({ a, b, label }: { a: number; b: number; label: string }) {
  const diff = a - b;
  const Icon = diff > 0 ? TrendingUp : diff < 0 ? TrendingDown : Minus;
  const color = diff > 0 ? 'text-emerald-400' : diff < 0 ? 'text-red-400' : 'text-zinc-400';

  return (
    <div className="flex items-center justify-between py-2 border-b border-zinc-800/50 last:border-0">
      <span className="text-sm text-zinc-400">{label}</span>
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-zinc-200 w-8 text-center">{a}</span>
        <span className="text-zinc-600 text-xs">vs</span>
        <span className="text-sm font-semibold text-zinc-200 w-8 text-center">{b}</span>
        <div className={`flex items-center gap-1 w-16 justify-end ${color}`}>
          <Icon className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">{diff > 0 ? '+' : ''}{diff}</span>
        </div>
      </div>
    </div>
  );
}

export default function ComparisonView({ primaryResult }: Props) {
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [competitorResult, setCompetitorResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleScan = () => {
    if (!competitorUrl.trim()) return;
    setError('');
    startTransition(async () => {
      const result = await scanUrl(competitorUrl.trim());
      if (result.success) {
        setCompetitorResult(result.data);
      } else {
        setError(result.error);
      }
    });
  };

  const radarData: RadarPoint[] = competitorResult ? [
    { metric: 'SEO', you: primaryResult.seo_score, competitor: competitorResult.seo_score },
    { metric: 'AEO', you: primaryResult.aeo_score, competitor: competitorResult.aeo_score },
    { metric: 'Schema', you: Math.min(100, primaryResult.schema_types.length * 20), competitor: Math.min(100, competitorResult.schema_types.length * 20) },
    { metric: 'Meta', you: Object.values(primaryResult.meta_tags).filter(Boolean).length * 12.5, competitor: Object.values(competitorResult.meta_tags).filter(Boolean).length * 12.5 },
    { metric: 'Entities', you: Math.min(100, primaryResult.entities.length * 12), competitor: Math.min(100, competitorResult.entities.length * 12) },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2 p-3 rounded-lg border border-zinc-700/40 bg-zinc-800/40">
          <Globe className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span className="text-sm text-zinc-300 truncate flex-1">{primaryResult.url}</span>
          <span className="text-xs px-2 py-0.5 rounded bg-blue-950/50 text-blue-300 border border-blue-800/40">You</span>
        </div>

        <div className="flex items-center gap-2">
          <ArrowRight className="w-4 h-4 text-zinc-600 flex-shrink-0" />
          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={competitorUrl}
                onChange={e => setCompetitorUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleScan()}
                placeholder="Enter competitor URL..."
                className="w-full px-3 py-2.5 rounded-lg bg-zinc-800/60 border border-zinc-700/50 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
            <button
              onClick={handleScan}
              disabled={isPending || !competitorUrl.trim()}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-white transition-colors"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Scan'}
            </button>
          </div>
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>

      {competitorResult && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 p-3 rounded-lg border border-zinc-700/40 bg-zinc-800/40">
            <Globe className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="text-sm text-zinc-300 truncate flex-1">{competitorResult.url}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-950/50 text-amber-300 border border-amber-800/40">Competitor</span>
          </div>

          <div className="flex justify-center rounded-xl border border-zinc-700/40 bg-zinc-800/20 py-4">
            <RadarChartSVG data={radarData} />
          </div>

          <div className="space-y-0 rounded-xl border border-zinc-700/40 bg-zinc-800/30 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-zinc-500 font-medium">METRIC</span>
              <div className="flex items-center gap-4">
                <span className="text-xs text-blue-400 font-medium w-8 text-center">You</span>
                <span className="text-xs text-zinc-600 w-8" />
                <span className="text-xs text-amber-400 font-medium w-8 text-center">Them</span>
                <span className="text-xs text-zinc-500 w-16 text-right">Diff</span>
              </div>
            </div>
            <ScoreDiff a={primaryResult.seo_score} b={competitorResult.seo_score} label="SEO Score" />
            <ScoreDiff a={primaryResult.aeo_score} b={competitorResult.aeo_score} label="AEO Readiness" />
            <ScoreDiff a={primaryResult.schema_types.length} b={competitorResult.schema_types.length} label="Schema Types" />
            <ScoreDiff
              a={Object.values(primaryResult.meta_tags).filter(Boolean).length}
              b={Object.values(competitorResult.meta_tags).filter(Boolean).length}
              label="Meta Tags Present"
            />
            <ScoreDiff a={primaryResult.entities.length} b={competitorResult.entities.length} label="Entities Detected" />
          </div>
        </div>
      )}

      {!competitorResult && !isPending && (
        <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-zinc-700/40 rounded-xl">
          <Globe className="w-8 h-8 text-zinc-700 mb-3" />
          <p className="text-sm text-zinc-500">Enter a competitor URL above</p>
          <p className="text-xs text-zinc-600 mt-1">Compare SEO & AEO scores side-by-side</p>
        </div>
      )}

      {isPending && (
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-3" />
          <p className="text-sm text-zinc-500">Scanning competitor...</p>
        </div>
      )}
    </div>
  );
}
