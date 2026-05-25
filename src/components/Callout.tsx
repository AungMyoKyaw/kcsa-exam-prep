import {
  Info,
  AlertTriangle,
  Lightbulb,
  Star,
} from 'lucide-react';

type CalloutVariant = 'info' | 'warning' | 'tip' | 'exam';

interface CalloutProps {
  variant: CalloutVariant;
  title?: string;
  children: React.ReactNode;
}

const config = {
  info: {
    icon: Info,
    borderColor: 'var(--info)',
    bgTint: 'rgba(9, 105, 218, 0.06)',
    label: 'Info',
  },
  warning: {
    icon: AlertTriangle,
    borderColor: 'var(--warning)',
    bgTint: 'rgba(154, 103, 0, 0.06)',
    label: 'Warning',
  },
  tip: {
    icon: Lightbulb,
    borderColor: 'var(--accent-sage)',
    bgTint: 'rgba(26, 127, 55, 0.06)',
    label: 'Tip',
  },
  exam: {
    icon: Star,
    borderColor: 'var(--accent-coral)',
    bgTint: 'rgba(207, 34, 46, 0.06)',
    label: 'Exam Focus',
  },
};

export default function Callout({ variant, title, children }: CalloutProps) {
  const c = config[variant];
  const Icon = c.icon;

  return (
    <div
      className="my-6 rounded-lg"
      style={{
        borderLeft: `3px solid ${c.borderColor}`,
        backgroundColor: c.bgTint,
      }}
    >
      <div className="px-4 md:px-5 py-4">
        <div className="flex items-center gap-2 mb-2">
          <Icon size={16} style={{ color: c.borderColor }} />
          <span className="text-sm font-semibold" style={{ color: c.borderColor }}>
            {title ?? c.label}
          </span>
        </div>
        <div className="text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
