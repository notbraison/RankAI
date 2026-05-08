'use client';

import type { Entity } from '@/lib/supabase';

const TYPE_COLORS: Record<Entity['type'], { bg: string; text: string; border: string }> = {
  organization: { bg: 'bg-blue-950/60', text: 'text-blue-300', border: 'border-blue-700/40' },
  person: { bg: 'bg-emerald-950/60', text: 'text-emerald-300', border: 'border-emerald-700/40' },
  product: { bg: 'bg-amber-950/60', text: 'text-amber-300', border: 'border-amber-700/40' },
  topic: { bg: 'bg-sky-950/60', text: 'text-sky-300', border: 'border-sky-700/40' },
  location: { bg: 'bg-rose-950/60', text: 'text-rose-300', border: 'border-rose-700/40' },
  technology: { bg: 'bg-violet-950/60', text: 'text-violet-300', border: 'border-violet-700/40' },
};

const TYPE_LABELS: Record<Entity['type'], string> = {
  organization: 'Org',
  person: 'Person',
  product: 'Product',
  topic: 'Topic',
  location: 'Location',
  technology: 'Tech',
};

type Props = {
  entities: Entity[];
};

export default function EntityMap({ entities }: Props) {
  const sorted = [...entities].sort((a, b) => b.relevance - a.relevance);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {sorted.map((entity) => {
          const colors = TYPE_COLORS[entity.type];
          const fontSize = entity.relevance >= 85
            ? 'text-base font-semibold'
            : entity.relevance >= 70
            ? 'text-sm font-medium'
            : 'text-xs font-normal';

          return (
            <div
              key={entity.name}
              className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${colors.bg} ${colors.border} cursor-default transition-all duration-200 hover:scale-105 hover:brightness-110`}
            >
              <span className={`${colors.text} ${fontSize}`}>{entity.name}</span>
              <span className={`text-[10px] ${colors.text} opacity-50`}>{entity.relevance}%</span>
              <div className={`absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap text-[10px] bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded text-zinc-300 z-10`}>
                {TYPE_LABELS[entity.type]}
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-2 pt-2 border-t border-zinc-800">
        {sorted.slice(0, 4).map((entity) => {
          const colors = TYPE_COLORS[entity.type];
          return (
            <div key={entity.name} className="flex items-center gap-3">
              <div className="flex items-center gap-2 w-40">
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${colors.bg} ${colors.text} border ${colors.border}`}>
                  {TYPE_LABELS[entity.type]}
                </span>
                <span className="text-sm text-zinc-300 truncate">{entity.name}</span>
              </div>
              <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700`}
                  style={{ width: `${entity.relevance}%`, backgroundColor: colors.text.replace('text-', '') === 'sky-300' ? '#7dd3fc' : colors.text.includes('blue') ? '#93c5fd' : colors.text.includes('emerald') ? '#6ee7b7' : colors.text.includes('amber') ? '#fcd34d' : colors.text.includes('rose') ? '#fda4af' : '#c4b5fd' }}
                />
              </div>
              <span className="text-xs text-zinc-500 w-10 text-right">{entity.relevance}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
