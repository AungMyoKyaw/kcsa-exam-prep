import { useRef, useState } from 'react'
import { Link } from 'react-router'
import {
  FlaskConical,
  ClipboardList,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Clock,
  Target,
  Layers,
  HelpCircle,
} from 'lucide-react'
import { domains, examTips } from '@/lib/domainData'

/* ─── Stat Block — static, no animation ─── */
function StatBlock({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Clock
  value: string
  label: string
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 rounded-lg" style={{ backgroundColor: 'var(--surface-elevated)' }}>
      <Icon size={20} style={{ color: 'var(--text-tertiary)' }} />
      <div>
        <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{value}</div>
        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</div>
      </div>
    </div>
  )
}

/* ─── Domain Progress Card ─── */
function DomainProgressCard({ domain }: { domain: (typeof domains)[0] }) {
  const totalChapters = domain.chapters.length
  const readCount = [1, 2].includes(domain.id) ? 3 : 0
  const progressPercent = Math.round((readCount / totalChapters) * 100)

  return (
    <Link to={`/domain${domain.id}`} className="block no-underline group">
      <div
        className="p-4 rounded-lg h-full transition-colors duration-150 hover:bg-[var(--surface-elevated)]"
        style={{
          backgroundColor: 'var(--surface-base)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
            {domain.number}
          </span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--surface-elevated)', color: 'var(--text-secondary)' }}>
            {domain.weight}%
          </span>
        </div>
        <p className="text-sm font-semibold mb-3 truncate" style={{ color: 'var(--text-primary)' }}>
          {domain.shortName}
        </p>
        <div className="w-full h-1.5 rounded-full overflow-hidden mb-2" style={{ backgroundColor: 'var(--border-subtle)' }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${progressPercent}%`, backgroundColor: 'var(--accent-primary)' }}
          />
        </div>
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {readCount === 0 ? 'Not started' : `${readCount}/${totalChapters} chapters`}
        </span>
      </div>
    </Link>
  )
}

/* ─── Domain Study Card ─── */
function DomainStudyCard({ domain }: { domain: (typeof domains)[0] }) {
  return (
    <Link to={`/domain${domain.id}`} className="block no-underline group h-full">
      <div
        className="p-6 rounded-lg h-full flex flex-col transition-colors duration-150 hover:bg-[var(--surface-elevated)]"
        style={{
          backgroundColor: 'var(--surface-base)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <span className="text-2xl font-bold" style={{ color: 'var(--text-tertiary)' }}>
            {domain.id}
          </span>
          <span className="text-[11px] font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--surface-elevated)', color: 'var(--text-secondary)' }}>
            {domain.weight}%
          </span>
        </div>

        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          {domain.title}
        </h3>

        <p className="text-base leading-relaxed mb-4 flex-1" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          {domain.description}
        </p>

        <ul className="space-y-2 mb-4">
          {domain.topics.map((topic, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--accent-primary)' }} />
              <span>{topic}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1 mt-auto pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <span className="text-sm font-medium" style={{ color: 'var(--accent-primary)' }}>
            Start Reading
          </span>
          <ArrowRight size={14} style={{ color: 'var(--accent-primary)' }} />
        </div>
      </div>
    </Link>
  )
}

/* ─── Quick Action Card ─── */
function QuickActionCard({
  icon: Icon,
  title,
  description,
  to,
}: {
  icon: typeof FlaskConical
  title: string
  description: string
  to: string
}) {
  return (
    <Link to={to} className="block no-underline group h-full">
      <div
        className="p-6 rounded-lg h-full flex flex-col transition-colors duration-150 hover:bg-[var(--surface-elevated)]"
        style={{
          backgroundColor: 'var(--surface-base)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--surface-elevated)' }}>
          <Icon size={20} style={{ color: 'var(--accent-primary)' }} />
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h3>
        <p className="text-base flex-1 mb-3" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          {description}
        </p>
        <span className="text-sm font-medium" style={{ color: 'var(--accent-primary)' }}>
          Open &rarr;
        </span>
      </div>
    </Link>
  )
}

/* ─── Recommendation Card ─── */
function RecommendationCard({
  priority,
  text,
  context,
}: {
  priority: 'High' | 'Medium' | 'Low'
  text: string
  context: string
}) {
  const priorityColors = {
    High: { bg: 'rgba(207, 34, 46, 0.1)', text: 'var(--danger)' },
    Medium: { bg: 'rgba(154, 103, 0, 0.1)', text: 'var(--warning)' },
    Low: { bg: 'rgba(26, 127, 55, 0.1)', text: 'var(--success)' },
  }
  const colors = priorityColors[priority]

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}>
      <span className="flex-shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide" style={{ backgroundColor: colors.bg, color: colors.text }}>
        {priority}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>{text}</p>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{context}</p>
      </div>
    </div>
  )
}

/* ─── Tip Card ─── */
function TipCard({ tip }: { tip: (typeof examTips)[0] }) {
  return (
    <div
      className="flex-shrink-0 w-[300px] min-h-[160px] p-5 rounded-lg flex flex-col"
      style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
    >
      <span className="self-start text-[11px] font-semibold px-2 py-1 rounded-full mb-3" style={{ backgroundColor: 'var(--surface-elevated)', color: 'var(--accent-primary)' }}>
        {tip.category}
      </span>
      <p className="text-base font-semibold mb-2 flex-1" style={{ color: 'var(--text-primary)', lineHeight: 1.5 }}>
        {tip.tip}
      </p>
      <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        {tip.detail}
      </p>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   MAIN HOME PAGE
   ═══════════════════════════════════════════════ */
export default function Home() {
  const tipsScrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollState = () => {
    const el = tipsScrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  const scrollTips = (direction: 'left' | 'right') => {
    const el = tipsScrollRef.current
    if (!el) return
    el.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' })
    setTimeout(updateScrollState, 350)
  }

  const totalChapters = domains.reduce((acc, d) => acc + d.chapters.length, 0)
  const totalRead = 5
  const overallPercent = Math.round((totalRead / totalChapters) * 100)

  const recommendations = [
    {
      priority: 'High' as const,
      text: 'Start with Domain 2: Kubernetes Cluster Component Security',
      context: 'Highest exam weight (22%) — foundational knowledge',
    },
    {
      priority: 'High' as const,
      text: 'Continue with Domain 3: Security Fundamentals',
      context: '22% weight — closely related to Domain 2',
    },
    {
      priority: 'Medium' as const,
      text: 'Complete Domain 1: Overview of Cloud Native Security',
      context: '14% weight — completes the foundation',
    },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="pt-12 pb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-semibold uppercase tracking-wide" style={{ backgroundColor: 'var(--surface-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
          CNCF / Linux Foundation Certification
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Kubernetes and Cloud Native Security Associate
        </h1>
        <p className="text-4xl md:text-5xl font-bold mb-10" style={{ color: 'var(--accent-primary)' }}>
          Exam Preparation
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <StatBlock icon={Clock} value="90 min" label="Duration" />
          <StatBlock icon={Target} value="75%" label="Passing Score" />
          <StatBlock icon={Layers} value="6" label="Domains" />
          <StatBlock icon={HelpCircle} value="60" label="Questions" />
        </div>
      </section>

      {/* Progress */}
      <section className="py-10">
        <h2 className="mb-2">Your Progress</h2>
        <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
          Track your reading across all exam domains
        </p>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Overall Completion</span>
            <span className="text-sm font-semibold" style={{ color: 'var(--accent-primary)' }}>{overallPercent}% Complete</span>
          </div>
          <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-subtle)' }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${overallPercent}%`, backgroundColor: 'var(--accent-primary)' }} />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {domains.map((domain) => (
            <DomainProgressCard key={domain.id} domain={domain} />
          ))}
        </div>
      </section>

      {/* Study by Domain */}
      <section className="py-10">
        <h2 className="mb-2">Study by Domain</h2>
        <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
          Select a domain to begin studying. Each domain is weighted based on exam coverage.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {domains.map((domain) => (
            <DomainStudyCard key={domain.id} domain={domain} />
          ))}
        </div>
      </section>

      {/* Recommendations */}
      <section className="py-10 px-6 rounded-lg mb-8" style={{ backgroundColor: 'var(--surface-elevated)' }}>
        <h2 className="mb-2">Recommended Next Steps</h2>
        <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
          Based on your progress and exam domain weightings
        </p>

        <div className="flex flex-col gap-3">
          {recommendations.map((rec, index) => (
            <RecommendationCard key={index} {...rec} />
          ))}
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-10">
        <h2 className="mb-2">Quick Access</h2>
        <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
          Jump to key tools and references
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard icon={FlaskConical} title="Practice Exam" description="60 questions • Timed 90 min • Full exam simulation" to="/practice-exam" />
          <QuickActionCard icon={ClipboardList} title="Quick Reference" description="Ports, commands, RBAC verbs, PSS matrix — all in one place" to="/cheat-sheet" />
          <QuickActionCard icon={BookOpen} title="Glossary" description="Searchable definitions of every KCSA term and concept" to="/glossary" />
        </div>
      </section>

      {/* Exam Tips */}
      <section className="py-10 -mx-6 px-6" style={{ backgroundColor: 'var(--surface-elevated)' }}>
        <h2 className="mb-2">Key Exam Tips</h2>
        <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
          High-yield facts to memorize before exam day
        </p>

        <div className="relative">
          <button
            onClick={() => scrollTips('left')}
            disabled={!canScrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-0"
            style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scrollTips('right')}
            disabled={!canScrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-0"
            style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
          >
            <ChevronRight size={16} />
          </button>

          <div
            ref={tipsScrollRef}
            className="flex gap-4 overflow-x-auto pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', paddingLeft: '4px', paddingRight: '4px' }}
            onScroll={updateScrollState}
          >
            {examTips.map((tip) => (
              <TipCard key={tip.id} tip={tip} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
