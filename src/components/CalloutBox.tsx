import type { ReactNode } from 'react';
import { Info, AlertTriangle, Lightbulb, Star } from 'lucide-react';

export type CalloutVariant = 'info' | 'warning' | 'tip' | 'exam';

interface CalloutBoxProps {
  variant: CalloutVariant;
  title?: string;
  children: ReactNode;
}

const variantConfig = {
  info: {
    icon: Info,
    label: 'Info',
    borderColor: 'var(--info)',
    bgTint: 'rgba(26,95,180,0.06)',
    textColor: 'var(--info)',
  },
  warning: {
    icon: AlertTriangle,
    label: 'Warning',
    borderColor: 'var(--warning)',
    bgTint: 'rgba(179,134,0,0.06)',
    textColor: 'var(--warning)',
  },
  tip: {
    icon: Lightbulb,
    label: 'Tip',
    borderColor: 'var(--accent-sage)',
    bgTint: 'rgba(10,123,62,0.06)',
    textColor: 'var(--accent-sage)',
  },
  exam: {
    icon: Star,
    label: 'Exam Focus',
    borderColor: 'var(--accent-coral)',
    bgTint: 'rgba(212,43,30,0.06)',
    textColor: 'var(--accent-coral)',
  },
};

export default function CalloutBox({ variant, title, children }: CalloutBoxProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className="rounded-xl my-6 overflow-hidden"
      style={{
        borderLeft: `4px solid ${config.borderColor}`,
        backgroundColor: config.bgTint,
      }}
    >
      <div className="px-5 py-4">
        <div className="flex items-center gap-2 mb-2">
          <Icon size={18} style={{ color: config.textColor }} />
          <span
            className="text-sm font-semibold"
            style={{ color: config.textColor }}
          >
            {title ?? config.label}
          </span>
        </div>
        <div
          className="text-sm leading-relaxed"
          style={{ color: 'var(--text-primary)' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
