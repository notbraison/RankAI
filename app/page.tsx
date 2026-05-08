'use client';

import { useState, useTransition, useRef } from 'react';
import { Search, Cpu, ArrowRight, Zap, Shield, Brain, Globe as Globe2, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';
import { scanUrl } from './actions';
import type { ScanResult } from '@/lib/supabase';
import LoadingSteps from '@/components/LoadingSteps';
import Dashboard from '@/components/Dashboard';

const EXAMPLE_URLS = [
  'https://vercel.com',
  'https://stripe.com',
  'https://linear.app',
  'https://github.com',
];

const FEATURE_PILLS = [
  { icon: Search, label: 'Meta Tag Analysis' },
  { icon: Brain, label: 'Entity Extraction' },
  { icon: Shield, label: 'Schema Detection' },
  { icon: Sparkles, label: 'LLM Readability' },
  { icon: TrendingUp, label: 'AEO Scoring' },
  { icon: Globe2, label: 'Competitor Compare' },
];

export default function Home() {
  const [url, setUrl] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scanningUrl, setScanningUrl] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleScan = (targetUrl?: string) => {
    const urlToScan = (targetUrl || url).trim();
    if (!urlToScan) {
      inputRef.current?.focus();
      return;
    }
    setError('');
    setScanningUrl(urlToScan);
    setShowLoading(true);

    setTimeout(() => {
      startTransition(async () => {
        const res = await scanUrl(urlToScan);
        if (res.success) {
          setResult(res.data);
          setShowLoading(false);
        } else {
          setError(res.error);
          setShowLoading(false);
        }
      });
    }, 5200);
  };

  if (result) {
    return <Dashboard result={result} onReset={() => { setResult(null); setUrl(''); setScanningUrl(''); }} />;
  }

  if (showLoading || isPending) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="w-full max-w-lg">
          <LoadingSteps url={scanningUrl} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <nav className="relative z-10 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-zinc-100">AEOlyzer</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-500 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Powered by AI Analysis
            </span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-65px)] px-4 py-16">
        <div className="w-full max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-700/30 bg-blue-950/20 text-blue-300 text-xs font-medium">
            <Cpu className="w-3.5 h-3.5" />
            <span>SEO + Answer Engine Optimization Analysis</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="text-zinc-100">Rank in search.</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Cited by AI.
              </span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Analyze any page for SEO health and AEO readiness. Discover how AI engines
              like ChatGPT and Gemini will summarize and cite your content.
            </p>
          </div>

          <div className="w-full max-w-2xl mx-auto">
            <div className={`flex items-center gap-2 rounded-2xl border bg-zinc-900/80 backdrop-blur-sm p-2 transition-all duration-300 ${error ? 'border-red-600/50' : 'border-zinc-700/50 focus-within:border-blue-500/50 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]'}`}>
              <div className="flex items-center gap-2 pl-3 flex-1 min-w-0">
                <Globe2 className="w-5 h-5 text-zinc-500 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={url}
                  onChange={e => { setUrl(e.target.value); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleScan()}
                  placeholder="Enter a URL to analyze... (e.g. yoursite.com)"
                  className="flex-1 min-w-0 bg-transparent text-zinc-200 placeholder-zinc-600 text-base focus:outline-none"
                />
              </div>
              <button
                onClick={() => handleScan()}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-200 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] active:scale-95 flex-shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Scan Page</span>
              </button>
            </div>
            {error && (
              <p className="text-sm text-red-400 mt-2 text-left px-2">{error}</p>
            )}

            <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
              <span className="text-xs text-zinc-600">Try:</span>
              {EXAMPLE_URLS.map(u => (
                <button
                  key={u}
                  onClick={() => { setUrl(u); handleScan(u); }}
                  className="flex items-center gap-1 text-xs text-zinc-500 hover:text-blue-400 transition-colors group"
                >
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  {u.replace('https://', '')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {FEATURE_PILLS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-800/60 bg-zinc-900/40 text-xs text-zinc-500"
              >
                <Icon className="w-3.5 h-3.5 text-zinc-600" />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 px-4">
          {[
            {
              icon: Search,
              color: 'text-blue-400',
              bg: 'bg-blue-950/30',
              border: 'border-blue-800/30',
              title: 'Deep SEO Analysis',
              desc: 'Meta tags, OG data, canonical URLs, heading hierarchy, image alt text — every signal scored.',
            },
            {
              icon: Brain,
              color: 'text-cyan-400',
              bg: 'bg-cyan-950/30',
              border: 'border-cyan-800/30',
              title: 'AEO Readiness Score',
              desc: 'FAQ & Article schema, entity recognition, direct-answer paragraphs — optimize for AI citation.',
            },
            {
              icon: ArrowRight,
              color: 'text-emerald-400',
              bg: 'bg-emerald-950/30',
              border: 'border-emerald-800/30',
              title: 'Competitor Intelligence',
              desc: 'Compare your SEO & AEO scores against any competitor with a radar chart breakdown.',
            },
          ].map(card => {
            const Icon = card.icon;
            return (
              <div key={card.title} className={`rounded-2xl border ${card.border} ${card.bg} p-5 text-left`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${card.bg}`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <h3 className="text-sm font-semibold text-zinc-200 mb-1">{card.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
