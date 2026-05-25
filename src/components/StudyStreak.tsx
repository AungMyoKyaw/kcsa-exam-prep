import { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';
import { getStudyStreak, checkAndUpdateStreak } from '@/lib/gamification';

export default function StudyStreak() {
  const [streak, setStreak] = useState(getStudyStreak);

  useEffect(() => {
    const updated = checkAndUpdateStreak();
    setStreak(updated);
  }, []);

  if (streak === 0) return null;

  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
      style={{
        backgroundColor: streak >= 7 ? 'rgba(207, 34, 46, 0.1)' : 'rgba(232, 122, 93, 0.1)',
        color: streak >= 7 ? '#cf222e' : '#9a6700',
        border: `1px solid ${streak >= 7 ? 'rgba(207, 34, 46, 0.2)' : 'rgba(232, 122, 93, 0.2)'}`,
      }}
    >
      <Flame size={16} className={streak >= 7 ? 'animate-pulse' : ''} />
      <span>
        {streak} Day{streak !== 1 ? 's' : ''} Streak
      </span>
    </div>
  );
}
