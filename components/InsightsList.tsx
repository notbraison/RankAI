'use client';

import { CircleAlert as AlertCircle, TriangleAlert as AlertTriangle, Info, CircleCheck as CheckCircle2, Search, Cpu } from 'lucide-react';
import type { Insight } from '@/lib/supabase';
import { useState } from 'react';

const SEVERITY_CONFIG = {
  critical: {
    icon: AlertCircle,
    bg: 'bg-red-950/40',
    border: 'border-red-700/40',
    text: 'text-red-400',
    badge: 'bg-red-900/50 text-red-300 border-red-700/40',
    label: 'Critical',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-950/40',
    border: 'border-amber-700/40',
    text: 'text-amber-400',
    badge: 'bg-amber-900/50 text-amber-300 border-amber-700/40',
    label: 'Warning',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-950/40',
    border: 'border-blue-700/40',
    text: 'text-blue-400',
    badge: 'bg-blue-900/50 text-blue-300 border-blue-700/40',
    label: 'Opportunity',
  },
};

type Props = {
  insights: Insight[];
};

export default function InsightsList({ insights }: Props) {
  const [filter, setFilter] = useState<'all' | 'seo' | 'aeo'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = insights.filter(i => filter === 'all' || i.category === filter);
  const criticalCount = insights.filter(i => i.severity === 'critical').length;
  const warningCount = insights.filter(i => i.severity === 'warning').length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center rounded-lg border border-zinc-700/50 bg-zinc-800/50 p-0.5">
          {(['all', 'seo', 'aeo'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-all ${filter === f ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {f === 'seo' && <Search className="w-3 h-3" />}
              {f === 'aeo' && <Cpu className="w-3 h-3" />}
              {f.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          {criticalCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-950/50 text-red-400 border border-red-800/40">
              {criticalCount} Critical
            </span>
          )}
          {warningCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950/50 text-amber-400 border border-amber-800/40">
              {warningCount} Warning
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
        {filtered.map((insight) => {
          const cfg = SEVERITY_CONFIG[insight.severity];
          const Icon = cfg.icon;
          const isExpanded = expanded === insight.id;

          return (
            <button
              key={insight.id}
              onClick={() => setExpanded(isExpanded ? null : insight.id)}
              className={`w-full text-left rounded-lg border ${cfg.bg} ${cfg.border} p-3 transition-all duration-200 hover:brightness-110`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-4 h-4 ${cfg.text} flex-shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-zinc-200">{insight.title}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${cfg.badge}`}>
                        {cfg.label}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded border border-zinc-700/40 bg-zinc-800/50 text-zinc-400 uppercase">
                        {insight.category}
                      </span>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="mt-2 space-y-2">
                      <p className="text-xs text-zinc-400 leading-relaxed">{insight.description}</p>
                      <div className="flex items-start gap-1.5 rounded-md bg-zinc-900/50 border border-zinc-700/30 p-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-emerald-300">{insight.fix}</p>
                      </div>
                    </div>
                  )}
                </div>
                <svg
                  className={`w-4 h-4 text-zinc-600 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
