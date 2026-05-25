import { useState } from 'react';
import { Baby, ChevronDown, ChevronUp } from 'lucide-react';

interface ELI5Props {
  title?: string;
  children: React.ReactNode;
}

export default function ELI5({ title, children }: ELI5Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="my-6 rounded-lg"
      style={{
        borderLeft: '3px solid #f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.06)',
      }}
    >
      <div className="px-5 py-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 mb-2 w-full text-left cursor-pointer"
        >
          <Baby size={16} style={{ color: '#f59e0b' }} />
          <span className="text-sm font-semibold" style={{ color: '#f59e0b' }}>
            {title ?? '🧒 ELI5 — Explain Like I\'m 5'}
          </span>
          <span className="ml-auto">
            {expanded ? (
              <ChevronUp size={14} style={{ color: '#f59e0b' }} />
            ) : (
              <ChevronDown size={14} style={{ color: '#f59e0b' }} />
            )}
          </span>
        </button>
        {expanded && (
          <div className="text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {children}
          </div>
        )}
        {!expanded && (
          <p className="text-xs italic" style={{ color: 'var(--text-tertiary)' }}>
            Click to expand a simple analogy...
          </p>
        )}
      </div>
    </div>
  );
}
