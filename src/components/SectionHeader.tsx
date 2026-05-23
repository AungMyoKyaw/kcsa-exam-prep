import { motion } from 'framer-motion';

interface SectionHeaderProps {
  number: string;
  title: string;
}

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function SectionHeader({ number, title }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: easeOutExpo }}
      className="mb-6 mt-12"
    >
      <div className="flex items-baseline gap-3">
        <span
          className="text-sm font-bold"
          style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}
        >
          {number}
        </span>
        <h2
          className="text-xl md:text-2xl font-normal"
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
          }}
        >
          {title}
        </h2>
      </div>
      <div
        className="mt-3 h-px w-full"
        style={{ backgroundColor: 'var(--border-subtle)' }}
      />
    </motion.div>
  );
}
