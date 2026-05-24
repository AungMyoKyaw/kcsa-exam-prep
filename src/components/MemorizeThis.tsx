import { useState } from 'react';
import { Eye, EyeOff, Brain, HelpCircle } from 'lucide-react';

interface MemorizeThisProps {
  title?: string;
  children: React.ReactNode;
  selfTest?: { question: string; answer: string };
}

export default function MemorizeThis({ title, children, selfTest }: MemorizeThisProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      className="my-6 rounded-xl overflow-hidden"
      style={{
        backgroundColor: 'rgba(130, 87, 229, 0.04)',
        border: '1.5px solid var(--accent-lavender)',
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center gap-2"
        style={{
          backgroundColor: 'rgba(130, 87, 229, 0.08)',
          borderBottom: '1px solid rgba(130, 87, 229, 0.15)',
        }}
      >
        <Brain size={16} style={{ color: 'var(--accent-lavender)' }} />
        <span className="text-sm font-bold" style={{ color: 'var(--accent-lavender)' }}>
          {title ?? '🧠 Memorize This'}
        </span>
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        <div className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          {children}
        </div>

        {/* Self-test prompt */}
        {selfTest && (
          <div className="mt-4 pt-3" style={{ borderTop: '1px dashed var(--border-subtle)' }}>
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle size={14} style={{ color: 'var(--accent-amber)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--accent-amber)' }}>
                Self-Test
              </span>
            </div>
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              {selfTest.question}
            </p>
            <button
              onClick={() => setRevealed((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: revealed
                  ? 'rgba(163,196,168,0.12)'
                  : 'var(--surface-elevated)',
                color: revealed ? 'var(--accent-sage)' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {revealed ? <EyeOff size={12} /> : <Eye size={12} />}
              {revealed ? selfTest.answer : 'Tap to reveal answer'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
