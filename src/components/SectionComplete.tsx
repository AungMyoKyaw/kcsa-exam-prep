import { CheckCircle, Trophy } from 'lucide-react'

interface SectionCompleteProps {
  sectionName: string;
  sectionNumber: number;
  totalSections: number;
}

export default function SectionComplete({ sectionName, sectionNumber, totalSections }: SectionCompleteProps) {
  return (
    <div
      className="my-8 rounded-xl overflow-hidden"
      style={{
        backgroundColor: 'rgba(163, 196, 168, 0.06)',
        border: '1.5px solid var(--accent-sage)',
      }}
    >
      <div className="px-5 py-4 flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(163,196,168,0.15)' }}
        >
          <CheckCircle size={20} style={{ color: 'var(--accent-sage)' }} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold" style={{ color: 'var(--accent-sage)' }}>
            ✅ Section Complete!
          </h4>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            You finished <strong>{sectionName}</strong>. Section {sectionNumber} of {totalSections} done.
          </p>
        </div>
        <div
          className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: 'rgba(163,196,168,0.12)', color: 'var(--accent-sage)' }}
        >
          <Trophy size={12} />
          {Math.round((sectionNumber / totalSections) * 100)}% of domain
        </div>
      </div>
    </div>
  );
}
