import { useState } from 'react';
import { Baby } from 'lucide-react';
import { getBeginnerMode, setBeginnerMode } from '@/lib/gamification';

export default function BeginnerModeToggle() {
  const [enabled, setEnabled] = useState(getBeginnerMode);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    setBeginnerMode(next);
    window.dispatchEvent(new StorageEvent('storage', { key: 'kcsa-beginner-mode' }));
  };

  return (
    <div
      className="rounded-xl border p-4"
      style={{ backgroundColor: 'var(--surface-base)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Baby size={20} style={{ color: enabled ? 'var(--accent-primary)' : 'var(--text-tertiary)' }} />
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Beginner Mode
            </p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {enabled
                ? 'Extra explanations, tooltips, and analogies are shown.'
                : 'Standard mode for advanced users.'}
            </p>
          </div>
        </div>
        <button
          onClick={toggle}
          className="relative w-12 h-6 rounded-full transition-colors duration-200"
          style={{
            backgroundColor: enabled ? 'var(--accent-primary)' : 'var(--border-medium)',
          }}
        >
          <div
            className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
            style={{ transform: enabled ? 'translateX(26px)' : 'translateX(2px)' }}
          />
        </button>
      </div>
    </div>
  );
}
