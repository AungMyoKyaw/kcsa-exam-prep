import { Sparkles } from 'lucide-react'

interface MnemonicStoryProps {
  title?: string;
  children: React.ReactNode;
  pattern?: string;
}

export default function MnemonicStory({ title, children, pattern }: MnemonicStoryProps) {
  return (
    <div
      className="my-6 rounded-xl overflow-hidden"
      style={{
        backgroundColor: 'rgba(155, 135, 245, 0.04)',
        border: '1.5px solid var(--accent-lavender)',
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center gap-2"
        style={{
          backgroundColor: 'rgba(155, 135, 245, 0.08)',
          borderBottom: '1px solid rgba(155, 135, 245, 0.15)',
        }}
      >
        <Sparkles size={16} style={{ color: 'var(--accent-lavender)' }} />
        <span className="text-sm font-bold" style={{ color: 'var(--accent-lavender)' }}>
          {title ?? '✨ Mnemonic Story'}
        </span>
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        <div className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          {children}
        </div>

        {pattern && (
          <div
            className="mt-4 p-3 rounded-lg text-xs font-mono leading-relaxed"
            style={{
              backgroundColor: 'var(--surface-code)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <span className="font-semibold" style={{ color: 'var(--accent-lavender)' }}>
              Pattern:{' '}
            </span>
            {pattern}
          </div>
        )}
      </div>
    </div>
  );
}
