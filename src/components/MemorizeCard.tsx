import { useState } from 'react';
import { Eye, EyeOff, Brain } from 'lucide-react';

export interface MemorizeCardProps {
  fact: string;        // e.g. "6443"
  label: string;       // e.g. "API Server"
  mnemonic: string;    // e.g. "64GB server answers (43) API calls"
  pattern?: string;    // e.g. "Control plane core"
  group?: string;      // e.g. "Group 1"
}

export default function MemorizeCard({ fact, label, mnemonic, pattern, group }: MemorizeCardProps) {
  const [hidden, setHidden] = useState(false);

  return (
    <div
      className="rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        backgroundColor: 'var(--surface-elevated)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* Group / Pattern badge */}
      <div className="flex items-center gap-2 mb-3">
        {group && (
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: 'var(--surface-code)',
              color: 'var(--text-tertiary)',
            }}
          >
            {group}
          </span>
        )}
        {pattern && (
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: 'rgba(155,135,245,0.12)',
              color: 'var(--accent-lavender)',
            }}
          >
            {pattern}
          </span>
        )}
      </div>

      {/* Fact number — large */}
      <div className="flex items-baseline gap-3 mb-2">
        <span
          className="font-mono font-bold text-3xl md:text-4xl tabular-nums"
          style={{
            color: hidden ? 'transparent' : 'var(--accent-primary)',
            textShadow: hidden ? '0 0 8px rgba(9,105,218,0.4)' : 'none',
            userSelect: hidden ? 'none' : 'auto',
            transition: 'color 0.2s ease, text-shadow 0.2s ease',
          }}
        >
          {hidden ? '????' : fact}
        </span>
        <span
          className="text-sm font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
        </span>
      </div>

      {/* Mnemonic story */}
      <div
        className="flex items-start gap-2 mt-3 p-3 rounded-lg"
        style={{
          backgroundColor: 'rgba(130, 87, 229, 0.06)',
          borderLeft: '3px solid var(--accent-lavender)',
        }}
      >
        <Brain size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent-lavender)' }} />
        <span className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          {mnemonic}
        </span>
      </div>

      {/* Test Yourself button */}
      <button
        onClick={() => setHidden((prev) => !prev)}
        className="mt-4 flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg transition-all duration-200 hover:opacity-90"
        style={{
          backgroundColor: hidden ? 'rgba(9,105,218,0.1)' : 'var(--surface-code)',
          color: 'var(--accent-primary)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        {hidden ? <Eye size={14} /> : <EyeOff size={14} />}
        {hidden ? 'Show Answer' : 'Test Yourself'}
      </button>
    </div>
  );
}
