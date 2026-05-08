'use client';

import { Bot, ExternalLink, Star, ThumbsUp, ThumbsDown, Copy, Check } from 'lucide-react';
import { useState } from 'react';

type Props = {
  url: string;
  preview: string;
  schemaTypes: string[];
};

export default function AiPreviewCard({ url, preview, schemaTypes }: Props) {
  const [copied, setCopied] = useState(false);
  const domain = (() => { try { return new URL(url).hostname; } catch { return url; } })();

  const handleCopy = () => {
    navigator.clipboard.writeText(preview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasGoodStructure = schemaTypes.length >= 2;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/50 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-zinc-700/50 bg-zinc-900/50">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          <span className="ml-2 text-xs text-zinc-500 font-mono">AI Answer Engine Simulation</span>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-sm text-zinc-200 leading-relaxed">{preview}</p>
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-700/50 bg-zinc-800/80 hover:bg-zinc-700/50 cursor-pointer transition-colors">
                  <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-zinc-300 to-zinc-400 flex items-center justify-center">
                    <span className="text-[6px] text-zinc-900 font-bold">W</span>
                  </div>
                  <span className="text-[11px] text-zinc-400">{domain}</span>
                  <ExternalLink className="w-2.5 h-2.5 text-zinc-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-700/50">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Good</span>
              </button>
              <button className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>Bad</span>
              </button>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className={`rounded-lg border p-3 ${hasGoodStructure ? 'border-emerald-700/40 bg-emerald-950/20' : 'border-zinc-700/40 bg-zinc-800/30'}`}>
          <div className="flex items-center gap-2 mb-1">
            <Star className={`w-3.5 h-3.5 ${hasGoodStructure ? 'text-emerald-400' : 'text-zinc-600'}`} />
            <span className="text-xs font-medium text-zinc-300">Citation Likelihood</span>
          </div>
          <p className={`text-lg font-bold ${hasGoodStructure ? 'text-emerald-400' : 'text-zinc-500'}`}>
            {hasGoodStructure ? 'High' : 'Low'}
          </p>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            {schemaTypes.length} schema type{schemaTypes.length !== 1 ? 's' : ''} detected
          </p>
        </div>

        <div className="rounded-lg border border-zinc-700/40 bg-zinc-800/30 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Bot className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-medium text-zinc-300">Schema Coverage</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {schemaTypes.length > 0 ? schemaTypes.map(s => (
              <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950/50 text-blue-300 border border-blue-800/40">
                {s}
              </span>
            )) : (
              <span className="text-[10px] text-zinc-600">None detected</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
