'use client';

import { useEffect, useState } from 'react';
import { Check, Loader as Loader2, Globe, Code as Code2, Brain, Sparkles, Shield, Zap } from 'lucide-react';

const STEPS = [
  { icon: Globe, label: 'Fetching HTML...', duration: 800 },
  { icon: Code2, label: 'Parsing DOM Structure...', duration: 700 },
  { icon: Shield, label: 'Analyzing Meta Tags & OpenGraph...', duration: 900 },
  { icon: Brain, label: 'Extracting Entities...', duration: 1000 },
  { icon: Zap, label: 'Detecting JSON-LD Schema...', duration: 700 },
  { icon: Sparkles, label: 'Testing for LLM Readability...', duration: 1100 },
];

type Props = {
  url: string;
};

export default function LoadingSteps({ url }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    let elapsed = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    STEPS.forEach((step, i) => {
      const t = setTimeout(() => {
        setCurrentStep(i);
      }, elapsed);
      timeouts.push(t);

      elapsed += step.duration;

      const tc = setTimeout(() => {
        setCompletedSteps(prev => [...prev, i]);
      }, elapsed - 100);
      timeouts.push(tc);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  const domain = (() => { try { return new URL(url).hostname; } catch { return url; } })();

  return (
    <div className="flex flex-col items-center gap-8 py-12">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-700/40 bg-blue-950/30">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-xs text-blue-300 font-medium">Scanning {domain}</span>
        </div>
        <h2 className="text-2xl font-bold text-white">Analyzing your page</h2>
        <p className="text-zinc-500 text-sm">Running 6 diagnostic checks across SEO & AEO factors</p>
      </div>

      <div className="w-full max-w-md space-y-2">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isCompleted = completedSteps.includes(i);
          const isCurrent = currentStep === i && !isCompleted;
          const isPending = i > currentStep;

          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500 ${
                isCompleted
                  ? 'bg-emerald-950/20 border-emerald-700/30'
                  : isCurrent
                  ? 'bg-blue-950/30 border-blue-700/40'
                  : 'bg-zinc-900/30 border-zinc-800/40 opacity-40'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                isCompleted ? 'bg-emerald-900/50' : isCurrent ? 'bg-blue-900/50' : 'bg-zinc-800/50'
              }`}>
                {isCompleted ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                ) : (
                  <Icon className="w-4 h-4 text-zinc-600" />
                )}
              </div>
              <span className={`text-sm font-medium ${
                isCompleted ? 'text-emerald-300' : isCurrent ? 'text-blue-300' : 'text-zinc-600'
              }`}>
                {step.label}
              </span>
              {isCompleted && (
                <span className="ml-auto text-xs text-emerald-600">Done</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="w-full max-w-md">
        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${((completedSteps.length) / STEPS.length) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-zinc-600">{completedSteps.length}/{STEPS.length} checks</span>
          <span className="text-xs text-zinc-600">{Math.round((completedSteps.length / STEPS.length) * 100)}%</span>
        </div>
      </div>
    </div>
  );
}
