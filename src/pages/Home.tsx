import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { motion, useInView } from 'framer-motion'
import {
  FlaskConical,
  ClipboardList,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react'
import { domains, examTips } from '@/lib/domainData'

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]

/* ─── Animated Counter Hook ─── */
function useCountUp(end: number, duration: number = 1200, start: boolean = false) {
  const [value, setValue] = useState(0)
  const startTime = useRef<number | null>(null)

  useEffect(() => {
    if (!start) return
    startTime.current = null

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp
      const progress = Math.min((timestamp - startTime.current) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out
      setValue(Math.round(eased * end))
      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [start, end, duration])

  return value
}

/* ─── Section Wrapper with scroll-triggered entrance ─── */
function ScrollSection({
  children,
  className = '',
  style = {},
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' })

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: easeOutExpo }}
      className={className}
      style={style}
    >
      {children}
    </motion.section>
  )
}

/* ─── Stat Block ─── */
function StatBlock({
  value,
  label,
  isSymbol = false,
  delay = 0,
}: {
  value: number | string
  label: string
  isSymbol?: boolean
  delay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })
  const numericValue = typeof value === 'string' ? 0 : value
  const countValue = useCountUp(numericValue, 1200, isInView && !isSymbol)

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: easeOutExpo, delay }}
    >
      <span
        className="text-[clamp(1.5rem,3vw,2.25rem)] font-normal leading-tight"
        style={{
          color: 'var(--accent-primary)',
          fontFamily: 'var(--font-display)',
        }}
      >
        {isSymbol ? value : countValue}
      </span>
      <span
        className="text-xs font-semibold uppercase tracking-[0.06em] mt-1"
        style={{ color: 'var(--text-secondary)' }}
      >
        {label}
      </span>
    </motion.div>
  )
}

/* ─── Domain Progress Card ─── */
function DomainProgressCard({
  domain,
  index,
}: {
  domain: (typeof domains)[0]
  index: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })
  const totalChapters = domain.chapters.length
  const readCount = [1, 2].includes(domain.id) ? 3 : 0
  const progressPercent = Math.round((readCount / totalChapters) * 100)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.5, ease: easeOutExpo, delay: index * 0.08 }}
    >
      <Link
        to={`/domain${domain.id}`}
        className="block no-underline group"
      >
        <div
          className="p-4 rounded-[12px] transition-all duration-200 h-full"
          style={{
            backgroundColor: 'var(--surface-base)',
            border: '1px solid var(--border-subtle)',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.transform = 'translateY(-2px)'
            el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
            el.style.borderColor = 'rgba(4, 80, 54, 0.3)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.transform = 'translateY(0px)'
            el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'
            el.style.borderColor = 'var(--border-subtle)'
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-xs font-semibold uppercase tracking-[0.06em]"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {domain.number}
            </span>
            <span
              className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: 'rgba(242, 196, 77, 0.15)',
                color: 'var(--accent-amber)',
              }}
            >
              {domain.weight}%
            </span>
          </div>
          <p
            className="text-sm font-semibold mb-3 truncate"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
              letterSpacing: '-0.01em',
            }}
          >
            {domain.shortName}
          </p>
          <div className="w-full h-1 rounded-full overflow-hidden mb-2" style={{ backgroundColor: 'var(--border-subtle)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: 'var(--accent-primary)' }}
              initial={{ width: 0 }}
              animate={isInView ? { width: `${progressPercent}%` } : { width: 0 }}
              transition={{ duration: 1, ease: easeOutExpo, delay: index * 0.08 + 0.3 }}
            />
          </div>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {readCount === 0 ? 'Not started' : `${readCount}/${totalChapters} chapters`}
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

/* ─── Domain Study Card ─── */
function DomainStudyCard({
  domain,
  index,
}: {
  domain: (typeof domains)[0]
  index: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: easeOutExpo, delay: index * 0.1 }}
    >
      <Link
        to={`/domain${domain.id}`}
        className="block no-underline group h-full"
      >
        <div
          className="p-6 rounded-[12px] transition-all duration-250 h-full flex flex-col"
          style={{
            backgroundColor: 'var(--surface-base)',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.transform = 'translateY(-4px)'
            el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'
            el.style.borderColor = 'var(--border-medium)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.transform = 'translateY(0px)'
            el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'
            el.style.borderColor = 'var(--border-subtle)'
          }}
        >
          {/* Top row */}
          <div className="flex items-start justify-between mb-3">
            <span
              className="text-[clamp(1.5rem,3vw,2.25rem)] font-normal leading-none transition-opacity duration-300"
              style={{
                color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-display)',
                opacity: 0.3,
              }}
            >
              {domain.id}
            </span>
            <span
              className="text-[11px] font-semibold px-2 py-1 rounded-full"
              style={{
                backgroundColor: 'rgba(242, 196, 77, 0.15)',
                color: 'var(--accent-amber)',
              }}
            >
              {domain.weight}%
            </span>
          </div>

          {/* Title */}
          <h3
            className="text-lg font-bold mb-2"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
              letterSpacing: '-0.015em',
              lineHeight: 1.3,
            }}
          >
            {domain.title}
          </h3>

          {/* Description */}
          <p
            className="text-sm leading-relaxed mb-4 flex-1"
            style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}
          >
            {domain.description}
          </p>

          {/* Topic list */}
          <ul className="space-y-1.5 mb-4">
            {domain.topics.map((topic, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span
                  className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                />
                <span>{topic}</span>
              </li>
            ))}
          </ul>

          {/* CTA Link */}
          <div className="flex items-center gap-1 mt-auto pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <span
              className="text-[13px] font-semibold transition-transform duration-200 group-hover:translate-x-1"
              style={{ color: 'var(--accent-primary)' }}
            >
              Start Reading
            </span>
            <ArrowRight
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-1"
              style={{ color: 'var(--accent-primary)' }}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

/* ─── Quick Action Card ─── */
function QuickActionCard({
  icon: Icon,
  title,
  description,
  to,
  index,
}: {
  icon: typeof FlaskConical
  title: string
  description: string
  to: string
  index: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, ease: easeOutExpo, delay: index * 0.12 }}
    >
      <Link to={to} className="block no-underline group h-full">
        <div
          className="p-6 rounded-[12px] transition-all duration-200 h-full flex flex-col"
          style={{
            backgroundColor: 'var(--surface-base)',
            border: '1px solid var(--border-subtle)',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.transform = 'translateY(-3px)'
            el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.transform = 'translateY(0px)'
            el.style.boxShadow = 'none'
          }}
        >
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors duration-200"
            style={{
              backgroundColor: 'rgba(4, 80, 54, 0.1)',
            }}
          >
            <Icon
              size={22}
              style={{ color: 'var(--accent-primary)' }}
            />
          </div>

          {/* Title */}
          <h3
            className="text-xl font-bold mb-2"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
              letterSpacing: '-0.015em',
            }}
          >
            {title}
          </h3>

          {/* Description */}
          <p
            className="text-sm leading-relaxed flex-1 mb-3"
            style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}
          >
            {description}
          </p>

          {/* CTA */}
          <span
            className="text-[13px] font-semibold"
            style={{ color: 'var(--accent-primary)' }}
          >
            Open &rarr;
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

/* ─── Recommendation Card ─── */
function RecommendationCard({
  priority,
  text,
  context,
  action,
  index,
}: {
  priority: 'High' | 'Medium' | 'Low'
  text: string
  context: string
  action: string
  index: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

  const priorityColors: Record<string, { bg: string; text: string }> = {
    High: { bg: 'rgba(212, 43, 30, 0.1)', text: 'var(--danger)' },
    Medium: { bg: 'rgba(242, 196, 77, 0.15)', text: 'var(--accent-amber)' },
    Low: { bg: 'rgba(10, 123, 62, 0.1)', text: 'var(--success)' },
  }
  const colors = priorityColors[priority]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.5, ease: easeOutExpo, delay: index * 0.1 }}
    >
      <div
        className="flex items-center gap-4 p-5 rounded-[12px]"
        style={{
          backgroundColor: 'var(--surface-base)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <span
          className="flex-shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide"
          style={{
            backgroundColor: colors.bg,
            color: colors.text,
          }}
        >
          {priority}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {text}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {context}
          </p>
        </div>
        <button
          className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-md transition-all duration-200"
          style={{
            color: 'var(--accent-primary)',
            border: '1px solid var(--accent-primary)',
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.backgroundColor = 'var(--accent-primary)'
            el.style.color = 'var(--surface-base)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.backgroundColor = 'transparent'
            el.style.color = 'var(--accent-primary)'
          }}
        >
          {action}
        </button>
      </div>
    </motion.div>
  )
}

/* ─── Tip Card ─── */
function TipCard({ tip }: { tip: (typeof examTips)[0] }) {
  return (
    <div
      className="flex-shrink-0 w-[280px] min-h-[160px] p-5 rounded-[12px] flex flex-col"
      style={{
        backgroundColor: 'var(--surface-base)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <span
        className="self-start text-[11px] font-semibold px-2 py-1 rounded-full mb-3"
        style={{
          backgroundColor: `${tip.categoryColor}15`,
          color: tip.categoryColor,
        }}
      >
        {tip.category}
      </span>
      <p
        className="text-sm font-semibold mb-2 flex-1"
        style={{ color: 'var(--text-primary)', lineHeight: 1.5 }}
      >
        {tip.tip}
      </p>
      <p
        className="text-xs"
        style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}
      >
        {tip.detail}
      </p>
    </div>
  )
}

/* ─── Floating Shape ─── */
function FloatingShape({
  className = '',
  delay = 0,
  style = {},
}: {
  className?: string
  delay?: number
  style?: React.CSSProperties
}) {
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      style={style}
      animate={{
        y: [-10, 10],
      }}
      transition={{
        duration: 6,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'reverse',
        delay,
      }}
    />
  )
}

/* ═══════════════════════════════════════════════
   MAIN HOME PAGE
   ═══════════════════════════════════════════════ */
export default function Home() {
  const heroRef = useRef(null)
  const heroInView = useInView(heroRef, { once: true })
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

  // Calculate overall progress
  const totalChapters = domains.reduce((acc, d) => acc + d.chapters.length, 0)
  const totalRead = 5 // Demo: 5 chapters read across domains 1 & 2
  const overallPercent = Math.round((totalRead / totalChapters) * 100)

  // Recommendations
  const recommendations = [
    {
      priority: 'High' as const,
      text: 'Start with Domain 2: Kubernetes Cluster Component Security',
      context: 'Highest exam weight (22%) — foundational knowledge',
      action: 'Go →',
    },
    {
      priority: 'High' as const,
      text: 'Continue with Domain 3: Security Fundamentals',
      context: '22% weight — closely related to Domain 2',
      action: 'Go →',
    },
    {
      priority: 'Medium' as const,
      text: 'Complete Domain 1: Overview of Cloud Native Security',
      context: '14% weight — completes the foundation',
      action: 'Go →',
    },
  ]

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* ═══════ SECTION 1: HERO ═══════ */}
      <section
        ref={heroRef}
        className="relative pt-20 pb-12 md:pt-24 md:pb-16 text-center overflow-hidden"
      >
        {/* Decorative floating shapes */}
        <FloatingShape
          className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-lg top-0 right-0 md:right-10 opacity-[0.08] rotate-12"
          style={{
            backgroundColor: 'var(--accent-lavender)',
            clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
          }}
          delay={0}
        />
        <FloatingShape
          className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] rounded-full bottom-4 left-4 md:left-20 opacity-[0.1]"
          style={{ backgroundColor: 'var(--accent-primary)' }}
          delay={3}
        />

        {/* Exam Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
          style={{
            border: '1px solid var(--border-medium)',
            color: 'var(--text-secondary)',
          }}
          initial={{ opacity: 0 }}
          animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.06em]">
            CNCF / Linux Foundation Certification
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          className="font-normal leading-[1.1] mb-2"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.02em',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
        >
          Kubernetes and Cloud Native Security Associate
        </motion.h1>

        <motion.p
          className="font-normal leading-[1.1] mb-10"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            color: 'var(--accent-primary)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.02em',
          }}
          initial={{ opacity: 0 }}
          animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.3 }}
        >
          Exam Preparation
        </motion.p>

        {/* Stats Row */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12">
          <StatBlock value={90} label="Minutes" delay={0.1} />
          <StatBlock value={75} label="Passing Score" delay={0.2} />
          <StatBlock value={6} label="Domains" delay={0.3} />
          <StatBlock value={0} label="Practice Questions" isSymbol delay={0.4} />
        </div>
      </section>

      {/* ═══════ SECTION 2: PROGRESS OVERVIEW ═══════ */}
      <ScrollSection className="py-12">
        <div className="mb-8">
          <h2
            className="font-normal mb-2"
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.01em',
            }}
          >
            Your Progress
          </h2>
          <p
            className="text-lg"
            style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}
          >
            Track your reading across all exam domains
          </p>
        </div>

        {/* Overall Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-sm font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              Overall Completion
            </span>
            <span
              className="text-sm font-semibold"
              style={{ color: 'var(--accent-primary)' }}
            >
              {overallPercent}% Complete
            </span>
          </div>
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--border-subtle)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--accent-gradient)' }}
              initial={{ width: 0 }}
              animate={{ width: `${overallPercent}%` }}
              transition={{ duration: 1, ease: easeOutExpo, delay: 0.3 }}
            />
          </div>
        </div>

        {/* Domain Progress Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {domains.map((domain, index) => (
            <DomainProgressCard key={domain.id} domain={domain} index={index} />
          ))}
        </div>
      </ScrollSection>

      {/* ═══════ SECTION 3: DOMAIN QUICK-START GRID ═══════ */}
      <ScrollSection className="py-12">
        <div className="mb-8">
          <h2
            className="font-normal mb-2"
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.01em',
            }}
          >
            Study by Domain
          </h2>
          <p
            className="text-lg"
            style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}
          >
            Select a domain to begin studying. Each domain is weighted based on exam coverage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {domains.map((domain, index) => (
            <DomainStudyCard key={domain.id} domain={domain} index={index} />
          ))}
        </div>
      </ScrollSection>

      {/* ═══════ SECTION 4: STUDY RECOMMENDATIONS ═══════ */}
      <ScrollSection
        className="py-12 px-4 sm:px-6 lg:px-8 rounded-[20px] mb-12"
        style={{ backgroundColor: 'var(--surface-elevated)' }}
      >
        <div className="max-w-[680px] mx-auto">
          <div className="mb-6">
            <h2
              className="font-normal mb-2"
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.01em',
              }}
            >
              Recommended Next Steps
            </h2>
            <p
              className="text-lg"
              style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}
            >
              Based on your progress and exam domain weightings
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {recommendations.map((rec, index) => (
              <RecommendationCard key={index} {...rec} index={index} />
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* ═══════ SECTION 5: QUICK ACTIONS ═══════ */}
      <ScrollSection className="py-12">
        <div className="mb-8">
          <h2
            className="font-normal mb-2"
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.01em',
            }}
          >
            Quick Access
          </h2>
          <p
            className="text-lg"
            style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}
          >
            Jump to key tools and references
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickActionCard
            icon={FlaskConical}
            title="Practice Exam"
            description="60 questions • Timed 90 min • Full exam simulation"
            to="/practice-exam"
            index={0}
          />
          <QuickActionCard
            icon={ClipboardList}
            title="Quick Reference"
            description="Ports, commands, RBAC verbs, PSS matrix — all in one place"
            to="/cheat-sheet"
            index={1}
          />
          <QuickActionCard
            icon={BookOpen}
            title="Glossary"
            description="Searchable definitions of every KCSA term and concept"
            to="/glossary"
            index={2}
          />
        </div>
      </ScrollSection>

      {/* ═══════ SECTION 6: EXAM TIPS CAROUSEL ═══════ */}
      <section
        className="py-12 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: 'var(--surface-elevated)' }}
      >
        <div className="max-w-[1100px] mx-auto">
          <div className="mb-8">
            <h2
              className="font-normal mb-2"
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.01em',
              }}
            >
              Key Exam Tips
            </h2>
            <p
              className="text-lg"
              style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}
            >
              High-yield facts to memorize before exam day
            </p>
          </div>

          <div className="relative">
            {/* Scroll buttons */}
            <button
              onClick={() => scrollTips('left')}
              disabled={!canScrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-0"
              style={{
                backgroundColor: 'var(--surface-base)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scrollTips('right')}
              disabled={!canScrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-0"
              style={{
                backgroundColor: 'var(--surface-base)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <ChevronRight size={16} />
            </button>

            {/* Tips scroll container */}
            <div
              ref={tipsScrollRef}
              className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                paddingLeft: '4px',
                paddingRight: '4px',
              }}
              onScroll={updateScrollState}
            >
              {examTips.map((tip) => (
                <TipCard key={tip.id} tip={tip} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom spacer */}
      <div className="pb-12" />
    </div>
  )
}
