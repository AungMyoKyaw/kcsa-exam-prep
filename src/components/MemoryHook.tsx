import { Brain } from 'lucide-react';

interface MemoryHookProps {
  title?: string;
  children: React.ReactNode;
}

export default function MemoryHook({ title, children }: MemoryHookProps) {
  return (
    <div
      className="my-6 rounded-lg"
      style={{
        borderLeft: '3px solid var(--accent-lavender)',
        backgroundColor: 'rgba(130, 87, 229, 0.06)',
      }}
    >
      <div className="px-4 md:px-5 py-4">
        <div className="flex items-center gap-2 mb-2">
          <Brain size={16} style={{ color: 'var(--accent-lavender)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--accent-lavender)' }}>
            {title ?? '🧠 Memory Hook'}
          </span>
        </div>
        <div className="text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
