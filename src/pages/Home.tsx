import { useEffect, useState, useMemo } from 'react'
import { Link, useLocation } from 'react-router'
import {
  Shield,
  Server,
  Lock,
  Globe,
  Database,
  FileText,
  Zap,
  BookOpen,
  Target,
  Clock,
  Award,
  ChevronRight,
  Layers,
  BrainCircuit,
  FlaskConical,
  CheckCircle2,
  Brain,
  RotateCcw,
} from 'lucide-react'
import { domains } from '@/lib/domainData'
import StudyStreak from '@/components/StudyStreak'
import XPBar from '@/components/XPBar'
import DailyChallenge from '@/components/DailyChallenge'
import BadgeDisplay from '@/components/BadgeDisplay'
import CircularProgress from '@/components/CircularProgress'
import { checkAndUpdateStreak, getLastLocation, saveLastLocation } from '@/lib/gamification'

const domainMeta = [
  { id: 1, icon: Shield, color: '#0969da', bg: '#ddf4ff', border: '#54aeff' },
  { id: 2, icon: Server, color: '#1a7f37', bg: '#dafbe1', border: '#4ac26b' },
  { id: 3, icon: Lock, color: '#8257e5', bg: '#f0e6ff', border: '#c084fc' },
  { id: 4, icon: Globe, color: '#9a6700', bg: '#fff8c5', border: '#eac54f' },
  { id: 5, icon: Database, color: '#cf222e', bg: '#ffebe9', border: '#ff8182' },
  { id: 6, icon: FileText, color: '#6a737d', bg: '#f0f0f0', border: '#b4bcc3' },
]

const studyPath = [
  {
    step: 1,
    domain: 1,
    title: 'Overview of Cloud Native Security',
    why: 'Start here — understand the big picture: 4Cs model, defense in depth, and security frameworks.',
    icon: Shield,
    color: '#0969da',
  },
  {
    step: 2,
    domain: 2,
    title: 'Cluster Component Security',
    why: 'Learn the Kubernetes architecture: API Server, etcd, Kubelet, Scheduler, and Controller Manager.',
    icon: Server,
    color: '#1a7f37',
  },
  {
    step: 3,
    domain: 3,
    title: 'Security Fundamentals',
    why: 'Master the core security primitives: Authentication, Authorization, Network Policies, and Secrets.',
    icon: Lock,
    color: '#8257e5',
  },
  {
    step: 4,
    domain: 5,
    title: 'Platform Security',
    why: 'Understand supply chain security: image scanning, admission controllers, and runtime security.',
    icon: Database,
    color: '#cf222e',
  },
  {
    step: 5,
    domain: 4,
    title: 'Threat Model',
    why: 'Learn to think like an attacker: STRIDE, vulnerability management, and incident response.',
    icon: Globe,
    color: '#9a6700',
  },
  {
    step: 6,
    domain: 6,
    title: 'Compliance & Frameworks',
    why: 'Finish with compliance: CIS Benchmarks, NIST, MITRE ATT&CK, and audit logging.',
    icon: FileText,
    color: '#6a737d',
  },
]

export default function Home() {
  const [progress, setProgress] = useState<Record<string, string[]>>({})
  const [examDate, setExamDate] = useState<string | null>(null)
  const [lastLocation, setLastLocation] = useState<string | null>(null)
  const location = useLocation()

  useEffect(() => {
    const saved = localStorage.getItem('kcsa_read_chapters')
    if (saved) setProgress(JSON.parse(saved))
    const date = localStorage.getItem('kcsa_exam_date')
    if (date) setExamDate(date)
    setLastLocation(getLastLocation())
    checkAndUpdateStreak()
  }, [])

  useEffect(() => {
    saveLastLocation(location.pathname)
  }, [location.pathname])

  const totalChapters = useMemo(
    () => domains.reduce((sum, d) => sum + d.chapters.length, 0),
    []
  )
  const completedChapters = useMemo(
    () =>
      Object.values(progress).reduce(
        (sum, chapters) => sum + chapters.length,
        0
      ),
    [progress]
  )

  const daysUntilExam = useMemo(() => {
    if (!examDate) return null
    const diff = new Date(examDate).getTime() - Date.now()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }, [examDate])

  return (
    <div>
      {/* Hero Header */}
      <div className="mb-10">
        <h1
          className="text-4xl font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          KCSA Exam Prep
        </h1>
        <p className="text-lg mb-4" style={{ color: 'var(--text-secondary)' }}>
          Master Kubernetes and Cloud Native Security. Study the 6 domains, test
          your knowledge, and pass the KC-SA exam.
        </p>

        <div className="flex flex-wrap gap-4 mt-6">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'var(--surface-elevated)' }}
          >
            <BookOpen size={16} style={{ color: 'var(--accent-primary)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>
              {totalChapters} Chapters
            </span>
          </div>
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'var(--surface-elevated)' }}
          >
            <FlaskConical size={16} style={{ color: 'var(--success)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>
              300 Questions
            </span>
          </div>
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'var(--surface-elevated)' }}
          >
            <Target size={16} style={{ color: 'var(--warning)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>
              6 Domains
            </span>
          </div>
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'var(--surface-elevated)' }}
          >
            <CheckCircle2
              size={16}
              style={{
                color:
                  completedChapters > 0 ? 'var(--success)' : 'var(--text-tertiary)',
              }}
            />
            <span style={{ color: 'var(--text-secondary)' }}>
              {completedChapters}/{totalChapters} Read
            </span>
          </div>
          {daysUntilExam !== null && (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold"
              style={{
                backgroundColor:
                  daysUntilExam <= 7
                    ? 'var(--accent-coral)'
                    : 'var(--accent-lavender-soft)',
                color: daysUntilExam <= 7 ? '#fff' : 'var(--accent-lavender)',
              }}
            >
              <Clock size={16} />
              {daysUntilExam === 0
                ? 'Exam is today! 🎯'
                : `${daysUntilExam} day${daysUntilExam !== 1 ? 's' : ''} until exam`}
            </div>
          )}
          <StudyStreak />
        </div>
      </div>

      {/* Gamification Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2">
          <XPBar />
        </div>
        <div>
          <BadgeDisplay />
        </div>
      </div>

      {/* Continue where left off */}
      {lastLocation && (
        <div className="mb-8">
          <Link
            to={lastLocation}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-md"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: '#fff',
            }}
          >
            <RotateCcw size={16} />
            Continue where you left off
            <ChevronRight size={14} />
          </Link>
        </div>
      )}

      {/* Daily Challenge */}
      <div className="mb-8">
        <DailyChallenge />
      </div>

      {/* Quick Action Cards */}
      <h2
        className="text-xl font-semibold mb-4 flex items-center gap-2"
        style={{ color: 'var(--text-primary)' }}
      >
        <Zap size={20} style={{ color: 'var(--accent-primary)' }} />
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <Link
          to="/practice-exam"
          className="group block p-5 rounded-xl border transition-all duration-200 hover:shadow-md"
          style={{
            backgroundColor: 'var(--surface-base)',
            borderColor: 'var(--border-subtle)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-primary)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <div
            className="flex items-center justify-between mb-3"
            style={{ color: 'var(--accent-primary)' }}
          >
            <FlaskConical size={28} />
            <ChevronRight
              size={18}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </div>
          <h3
            className="text-base font-semibold mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            Practice Exam
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            105 questions across all 6 domains with full explanations.
          </p>
        </Link>

        <Link
          to="/quick-recall"
          className="group block p-5 rounded-xl border transition-all duration-200 hover:shadow-md"
          style={{
            backgroundColor: 'var(--surface-base)',
            borderColor: 'var(--border-subtle)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-lavender)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <div
            className="flex items-center justify-between mb-3"
            style={{ color: 'var(--accent-lavender)' }}
          >
            <BrainCircuit size={28} />
            <ChevronRight
              size={18}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </div>
          <h3
            className="text-base font-semibold mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            Quick Recall
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Flashcards for ports, PSS rules, RBAC verbs, and key facts.
          </p>
        </Link>

        <Link
          to="/cheat-sheet"
          className="group block p-5 rounded-xl border transition-all duration-200 hover:shadow-md"
          style={{
            backgroundColor: 'var(--surface-base)',
            borderColor: 'var(--border-subtle)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--success)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <div
            className="flex items-center justify-between mb-3"
            style={{ color: 'var(--success)' }}
          >
            <Layers size={28} />
            <ChevronRight
              size={18}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </div>
          <h3
            className="text-base font-semibold mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            Cheat Sheet
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            One-page reference for commands, ports, and quick facts.
          </p>
        </Link>
      </div>

      {/* Domain Cards */}
      <h2
        className="text-xl font-semibold mb-4 flex items-center gap-2"
        style={{ color: 'var(--text-primary)' }}
      >
        <Layers size={20} style={{ color: 'var(--accent-primary)' }} />
        Study Domains
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {domains.map((domain) => {
          const meta = domainMeta.find((m) => m.id === domain.id)!
          const Icon = meta.icon
          const readCount = progress[domain.id]?.length || 0
          const totalCount = domain.chapters.length
          const pct = Math.round((readCount / totalCount) * 100)
          const isDone = pct === 100

          return (
            <Link
              key={domain.id}
              to={`/domain${domain.id}`}
              className="group block p-5 rounded-xl border transition-all duration-200 hover:shadow-md"
              style={{
                backgroundColor: 'var(--surface-base)',
                borderColor: meta.border,
                borderLeftWidth: '4px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: meta.bg }}
                >
                  <Icon size={22} style={{ color: meta.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className="text-base font-semibold truncate flex-1 min-w-0"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {domain.number}: {domain.title}
                    </h3>
                    {isDone && (
                      <CheckCircle2 size={18} className="flex-shrink-0" style={{ color: 'var(--success)' }} />
                    )}
                  </div>
                  <p
                    className="text-sm mb-3"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {totalCount} chapters · {domain.weight}% exam weight
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex-1 h-2 rounded-full overflow-hidden self-center"
                      style={{ backgroundColor: 'var(--surface-elevated)' }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-200"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: meta.color,
                        }}
                      />
                    </div>
                    <div className="flex-shrink-0 self-center">
                      <CircularProgress percentage={pct} color={meta.color} size={36} strokeWidth={3} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Study Path */}
      <h2
        className="text-xl font-semibold mb-4 flex items-center gap-2"
        style={{ color: 'var(--text-primary)' }}
      >
        <Award size={20} style={{ color: 'var(--warning)' }} />
        Recommended Study Path
      </h2>
      <div
        className="rounded-xl border p-6 mb-10"
        style={{
          backgroundColor: 'var(--surface-base)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
          Follow this order to build your understanding from the ground up.
          Each step prepares you for the next.
        </p>
        <div className="space-y-0">
          {studyPath.map((step, i) => {
            const readCount = progress[step.domain]?.length || 0
            const totalCount =
              domains.find((d) => d.id === step.domain)?.chapters.length || 0
            const isDone = readCount === totalCount && totalCount > 0
            const isActive = readCount > 0 && !isDone

            return (
              <Link
                key={step.step}
                to={`/domain${step.domain}`}
                className="flex items-start gap-4 py-4 transition-colors duration-200"
                style={{
                  borderBottom:
                    i < studyPath.length - 1
                      ? '1px solid var(--border-subtle)'
                      : 'none',
                }}
              >
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold mt-0.5"
                  style={{
                    backgroundColor: isDone ? step.color : isActive ? step.color : 'var(--surface-elevated)',
                    color: isDone || isActive ? '#fff' : step.color,
                    border: isDone || isActive ? 'none' : `2px solid ${step.color}`,
                  }}
                >
                  {isDone ? <CheckCircle2 size={16} /> : isActive ? (
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#fff' }} />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: '#fff' }} />
                    </span>
                  ) : step.step}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {step.title}
                    </span>
                    {isActive && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor: step.color + '15',
                          color: step.color,
                        }}
                      >
                        In Progress
                      </span>
                    )}
                    {isDone && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor: 'var(--surface-elevated)',
                          color: 'var(--success)',
                        }}
                      >
                        Completed
                      </span>
                    )}
                  </div>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {step.why}
                  </p>
                </div>
                <ChevronRight
                  size={16}
                  className="flex-shrink-0 mt-2"
                  style={{ color: 'var(--text-tertiary)' }}
                />
              </Link>
            )
          })}
        </div>
      </div>

      {/* Quick Motivation */}
      <div
        className="rounded-xl p-5 flex items-start gap-3"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <Brain
          size={20}
          className="flex-shrink-0 mt-0.5"
          style={{ color: 'var(--accent-lavender)' }}
        />
        <div>
          <p
            className="text-sm font-medium mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            Study Tip
          </p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            The KCSA exam tests understanding, not memorization. Focus on{' '}
            <strong>why</strong> security controls exist, not just{' '}
            <strong>what</strong> they are. Use the Quick Recall flashcards for
            facts you must memorize (ports, verbs, levels), and read each domain
            for conceptual depth.
          </p>
        </div>
      </div>
    </div>
  )
}
