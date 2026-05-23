import { motion } from 'framer-motion';
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
    borderColor: 'var(--info, #1A5FB4)',
    bgTint: 'rgba(26, 95, 180, 0.06)',
    label: 'Info',
  },
  warning: {
    icon: AlertTriangle,
    borderColor: 'var(--warning, #B38600)',
    bgTint: 'rgba(179, 134, 0, 0.06)',
    label: 'Warning',
  },
  tip: {
    icon: Lightbulb,
    borderColor: 'var(--accent-sage, #0A7B3E)',
    bgTint: 'rgba(10, 123, 62, 0.06)',
    label: 'Tip',
  },
  exam: {
    icon: Star,
    borderColor: 'var(--accent-coral, #D42B1E)',
    bgTint: 'rgba(212, 43, 30, 0.06)',
    label: 'Exam Focus',
  },
};

export default function Callout({ variant, title, children }: CalloutProps) {
  const c = config[variant];
  const Icon = c.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="my-6 rounded-xl overflow-hidden"
      style={{
        borderLeft: `4px solid ${c.borderColor}`,
        backgroundColor: c.bgTint,
      }}
    >
      <div className="px-5 py-4">
        <div className="flex items-center gap-2 mb-2">
          <Icon size={16} style={{ color: c.borderColor }} />
          <span
            className="text-sm font-semibold"
            style={{ color: c.borderColor }}
          >
            {title || c.label}
          </span>
        </div>
        <div className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          {children}
        </div>
      </div>
    </motion.div>
  );
}
