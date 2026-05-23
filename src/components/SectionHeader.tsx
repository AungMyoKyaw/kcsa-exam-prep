interface SectionHeaderProps {
  number: string;
  title: string;
}

export default function SectionHeader({ number, title }: SectionHeaderProps) {
  return (
    <div className="mb-6 mt-16">
      <div className="flex items-baseline gap-3">
        <span className="text-sm font-bold" style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
          {number}
        </span>
        <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h2>
      </div>
      <div className="mt-3 h-px w-full" style={{ backgroundColor: 'var(--border-subtle)' }} />
    </div>
  );
}
