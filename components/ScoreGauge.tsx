'use client';

type Props = {
  score: number;
  label: string;
  color: string;
  trackColor?: string;
  icon: React.ReactNode;
};

function getGrade(score: number): { grade: string; label: string } {
  if (score >= 90) return { grade: 'A+', label: 'Excellent' };
  if (score >= 80) return { grade: 'A', label: 'Very Good' };
  if (score >= 70) return { grade: 'B', label: 'Good' };
  if (score >= 60) return { grade: 'C', label: 'Fair' };
  if (score >= 50) return { grade: 'D', label: 'Poor' };
  return { grade: 'F', label: 'Critical' };
}

export default function ScoreGauge({ score, label, color, icon }: Props) {
  const { grade, label: gradeLabel } = getGrade(score);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (score / 100) * circumference;
  const gap = 8;
  const arcCircumference = circumference - gap;
  const arcDash = (score / 100) * arcCircumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-40 h-40">
        <svg width="160" height="160" viewBox="0 0 160 160" className="rotate-[-90deg]">
          <circle
            cx="80" cy="80" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <circle
            cx="80" cy="80" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${strokeDash} ${circumference - strokeDash}`}
            style={{ transition: 'stroke-dasharray 1s ease-out', filter: `drop-shadow(0 0 6px ${color}66)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="mb-0.5 opacity-70">{icon}</div>
          <span className="text-3xl font-bold text-white tabular-nums">{score}</span>
          <span className="text-[11px] text-zinc-400 font-medium">{grade} · {gradeLabel}</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-zinc-200">{label}</p>
        <div className="mt-1.5 flex items-center gap-1.5 justify-center">
          <div className="h-1 rounded-full bg-zinc-800 w-24 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${score}%`, backgroundColor: color }}
            />
          </div>
          <span className="text-xs text-zinc-500 tabular-nums">{score}/100</span>
        </div>
      </div>
    </div>
  );
}
