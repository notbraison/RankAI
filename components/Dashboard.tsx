'use client';

import { useState } from 'react';
import { Search, Cpu, Activity, Map, Bot, Zap, ArrowLeft, GitCompare, Tag, ChartBar as BarChart2 } from 'lucide-react';
import type { ScanResult } from '@/lib/supabase';
import ScoreGauge from './ScoreGauge';
import EntityMap from './EntityMap';
import AiPreviewCard from './AiPreviewCard';
import InsightsList from './InsightsList';
import MetaTagsPanel from './MetaTagsPanel';
import ComparisonView from './ComparisonView';

type Tab = 'overview' | 'meta' | 'compare';

type Props = {
  result: ScanResult;
  onReset: () => void;
};

export default function Dashboard({ result, onReset }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const domain = (() => { try { return new URL(result.url).hostname; } catch { return result.url; } })();
  const criticalCount = result.insights.filter(i => i.severity === 'critical').length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800/60 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>New Scan</span>
          </button>
          <div className="h-4 w-px bg-zinc-700" />
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-sm font-medium text-zinc-200 truncate">{domain}</span>
            <span className="hidden sm:inline text-xs text-zinc-600 truncate">{result.url}</span>
          </div>
          {criticalCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/50 border border-red-800/40">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              <span className="text-xs text-red-300">{criticalCount} Critical Issue{criticalCount !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-0">
          <div className="flex gap-0">
            {([
              { id: 'overview', label: 'Overview', icon: BarChart2 },
              { id: 'meta', label: 'Meta & Structure', icon: Tag },
              { id: 'compare', label: 'Competitor Comparison', icon: GitCompare },
            ] as const).map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-blue-400 text-blue-300'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-zinc-700/40 bg-zinc-900/50 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Health Scores</h2>
                </div>
                <div className="flex justify-around">
                  <ScoreGauge
                    score={result.seo_score}
                    label="SEO Score"
                    color="#3b82f6"
                    icon={<Search className="w-4 h-4 text-blue-400" />}
                  />
                  <ScoreGauge
                    score={result.aeo_score}
                    label="AEO Readiness"
                    color="#06b6d4"
                    icon={<Cpu className="w-4 h-4 text-cyan-400" />}
                  />
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/30">
                    <p className="text-xl font-bold text-zinc-100">{result.schema_types.length}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Schema Types</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/30">
                    <p className="text-xl font-bold text-zinc-100">{result.entities.length}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Entities</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/30">
                    <p className="text-xl font-bold text-zinc-100">{result.insights.filter(i => i.severity === 'critical').length}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Critical</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-700/40 bg-zinc-900/50 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Actionable Insights</h2>
                </div>
                <InsightsList insights={result.insights} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-zinc-700/40 bg-zinc-900/50 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Map className="w-4 h-4 text-sky-400" />
                  <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Entity Authority Map</h2>
                </div>
                <EntityMap entities={result.entities} />
              </div>

              <div className="rounded-2xl border border-zinc-700/40 bg-zinc-900/50 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">AI Citation Preview</h2>
                </div>
                <AiPreviewCard
                  url={result.url}
                  preview={result.ai_preview}
                  schemaTypes={result.schema_types}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'meta' && (
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-zinc-700/40 bg-zinc-900/50 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Tag className="w-4 h-4 text-blue-400" />
                <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Meta Tags & Page Structure</h2>
              </div>
              <MetaTagsPanel metaTags={result.meta_tags} headings={result.headings} />
            </div>
          </div>
        )}

        {activeTab === 'compare' && (
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl border border-zinc-700/40 bg-zinc-900/50 p-6">
              <div className="flex items-center gap-2 mb-6">
                <GitCompare className="w-4 h-4 text-blue-400" />
                <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Competitor Comparison</h2>
              </div>
              <ComparisonView primaryResult={result} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
