import { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { getEli5 } from '@/lib/eli5Data';
import { getBeginnerMode } from '@/lib/gamification';

interface ExplainLikeImFiveProps {
  concept: string;
}

export default function ExplainLikeImFive({ concept }: ExplainLikeImFiveProps) {
  const [open, setOpen] = useState(false);
  const entry = getEli5(concept);
  const beginnerMode = getBeginnerMode();

  if (!entry) return null;

  return (
    <div
      className="my-5 rounded-xl overflow-hidden"
      style={{
        backgroundColor: 'rgba(130, 87, 229, 0.04)',
        border: '1px solid rgba(130, 87, 229, 0.15)',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors duration-150 hover:opacity-80"
        style={{
          backgroundColor: open ? 'rgba(130, 87, 229, 0.06)' : 'transparent',
        }}
      >
        <div className="flex items-center gap-2">
          <Lightbulb size={16} style={{ color: 'var(--accent-lavender)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--accent-lavender)' }}>
            {beginnerMode ? '🧒 ELI5: ' + entry.concept : '🧒 ELI5'}
          </span>
        </div>
        {open ? (
          <ChevronUp size={14} style={{ color: 'var(--accent-lavender)' }} />
        ) : (
          <ChevronDown size={14} style={{ color: 'var(--accent-lavender)' }} />
        )}
      </button>

      {open && (
        <div className="px-4 pb-4">
          <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
            {entry.analogy}
          </p>
          <p className="text-xs italic" style={{ color: 'var(--text-tertiary)' }}>
            In short: {entry.short}
          </p>
        </div>
      )}
    </div>
  );
}
