import { XOctagon } from 'lucide-react';

interface ExamTrapProps {
  title?: string;
  children: React.ReactNode;
}

export default function ExamTrap({ title, children }: ExamTrapProps) {
  return (
    <div
      className="my-6 rounded-lg"
      style={{
        borderLeft: '3px solid var(--accent-coral)',
        backgroundColor: 'rgba(207, 34, 46, 0.06)',
      }}
    >
      <div className="px-5 py-4">
        <div className="flex items-center gap-2 mb-2">
          <XOctagon size={16} style={{ color: 'var(--accent-coral)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--accent-coral)' }}>
            {title ?? '⚠️ Exam Trap'}
          </span>
        </div>
        <div className="text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
