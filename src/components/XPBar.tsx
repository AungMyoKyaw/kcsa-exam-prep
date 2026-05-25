import { useEffect, useState } from 'react';
import { Trophy, Star } from 'lucide-react';
import {
  getXP,
  getLevel,
  getXPToNext,
  getProgressToNext,
  LEVELS,
} from '@/lib/gamification';

export default function XPBar() {
  const [xp, setXp] = useState(getXP);

  useEffect(() => {
    const handle = () => setXp(getXP);
    window.addEventListener('storage', handle);
    const interval = setInterval(() => setXp(getXP), 1000);
    return () => {
      window.removeEventListener('storage', handle);
      clearInterval(interval);
    };
  }, []);

  const level = getLevel(xp);
  const next = LEVELS.find((l) => l.min > xp);
  const progress = getProgressToNext(xp);
  const xpToNext = getXPToNext(xp);

  return (
    <div
      className="rounded-xl border p-4"
      style={{
        backgroundColor: 'var(--surface-base)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${level.color}15` }}
          >
            <Trophy size={16} style={{ color: level.color }} />
          </div>
          <div>
            <span className="text-sm font-bold" style={{ color: level.color }}>
              {level.name}
            </span>
            <span className="text-xs ml-1.5" style={{ color: 'var(--text-tertiary)' }}>
              Level {LEVELS.indexOf(level) + 1}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Star size={14} style={{ color: 'var(--warning)' }} />
          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            {xp} XP
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="flex-1 h-2.5 rounded-full overflow-hidden"
          style={{ backgroundColor: 'var(--surface-elevated)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              backgroundColor: level.color,
            }}
          />
        </div>
        {next && (
          <span className="text-xs font-medium tabular-nums whitespace-nowrap" style={{ color: 'var(--text-tertiary)' }}>
            {xpToNext} to {next.name}
          </span>
        )}
      </div>
    </div>
  );
}
