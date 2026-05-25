import { useEffect, useState } from 'react';
import { Award, Lock } from 'lucide-react';
import {
  ALL_BADGES,
  getBadgeIds,
} from '@/lib/gamification';

export default function BadgeDisplay() {
  const [unlocked, setUnlocked] = useState(getBadgeIds);

  useEffect(() => {
    const handle = () => setUnlocked(getBadgeIds);
    window.addEventListener('storage', handle);
    const interval = setInterval(() => setUnlocked(getBadgeIds), 1000);
    return () => {
      window.removeEventListener('storage', handle);
      clearInterval(interval);
    };
  }, []);

  const recentBadges = ALL_BADGES.filter((b) => unlocked.includes(b.id)).slice(0, 4);

  if (recentBadges.length === 0) {
    return (
      <div
        className="rounded-xl border p-4"
        style={{ backgroundColor: 'var(--surface-base)', borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Award size={16} style={{ color: 'var(--warning)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Achievements</span>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          Complete quizzes and study daily to unlock badges!
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border p-4"
      style={{ backgroundColor: 'var(--surface-base)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Award size={16} style={{ color: 'var(--warning)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Achievements
          </span>
        </div>
        <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
          {unlocked.length}/{ALL_BADGES.length}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {recentBadges.map((badge) => (
          <div
            key={badge.id}
            className="flex items-center gap-2 px-2.5 py-2 rounded-lg"
            style={{ backgroundColor: 'var(--surface-elevated)' }}
          >
            <span className="text-lg">{badge.icon}</span>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                {badge.name}
              </p>
              <p className="text-[10px] truncate" style={{ color: 'var(--text-tertiary)' }}>
                {badge.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      {unlocked.length < ALL_BADGES.length && (
        <div className="mt-2 flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
          <Lock size={12} />
          <span>{ALL_BADGES.length - unlocked.length} more to unlock</span>
        </div>
      )}
    </div>
  );
}
