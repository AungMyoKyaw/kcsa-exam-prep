import type { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  number: string;
  title: string;
  color?: string;
  icon?: LucideIcon;
}

export default function SectionHeader({ number, title, color = 'var(--accent-primary)', icon: Icon }: SectionHeaderProps) {
  return (
    <div className="mb-6 mt-16">
      <div className="flex items-baseline gap-3">
        <span className="text-sm font-bold px-2 py-0.5 rounded-md" style={{ color, backgroundColor: color + '12', fontFamily: 'var(--font-mono)' }}>
          {number}
        </span>
        <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          {Icon && <Icon size={22} className="inline-block mr-2 -mt-1" style={{ color }} />}
          {title}
        </h2>
      </div>
      <div className="mt-3 h-px w-full" style={{ backgroundColor: 'var(--border-subtle)' }} />
    </div>
  );
}
