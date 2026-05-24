import { useEffect, useState, useCallback } from 'react'
import { Link, useLocation } from 'react-router'
import {
  Home,
  Shield,
  Server,
  Lock,
  Globe,
  Database,
  FileText,
  FlaskConical,
  Layers,
  BookOpen,
  Settings,
  X,
  CheckCircle2,
  Clock,
  BrainCircuit,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { domains } from '@/lib/domainData'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const domainIcons = [
  Shield,
  Server,
  Lock,
  Globe,
  Database,
  FileText,
]

const domainColors = [
  '#0969da',
  '#1a7f37',
  '#8257e5',
  '#9a6700',
  '#cf222e',
  '#6a737d',
]

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const [readChapters, setReadChapters] = useState<Record<string, string[]>>({})
  const [expandedDomains, setExpandedDomains] = useState<Record<number, boolean>>({})
  const [examDate, setExamDate] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('kcsa_read_chapters')
    if (saved) setReadChapters(JSON.parse(saved))
    const date = localStorage.getItem('kcsa_exam_date')
    if (date) setExamDate(date)

    // Expand current domain
    const match = location.pathname.match(/\/domain(\d)/)
    if (match) {
      setExpandedDomains((prev) => ({ ...prev, [Number(match[1])]: true }))
    }
  }, [location.pathname])

  const toggleDomain = useCallback((id: number) => {
    setExpandedDomains((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const totalChapters = domains.reduce((sum, d) => sum + d.chapters.length, 0)
  const completedChapters = Object.values(readChapters).reduce(
    (sum, chapters) => sum + chapters.length,
    0
  )
  const overallPct = Math.round((completedChapters / totalChapters) * 100)

  const daysUntilExam = examDate
    ? Math.max(0, Math.ceil((new Date(examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className="fixed top-14 left-0 bottom-0 z-30 w-[280px] overflow-y-auto border-r transition-transform duration-200 lg:translate-x-0"
        style={{
          backgroundColor: 'var(--surface-base)',
          borderColor: 'var(--border-subtle)',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <div className="p-4">
          {/* Close button (mobile) */}
          <button
            onClick={onClose}
            className="lg:hidden absolute top-3 right-3 p-1.5 rounded-md"
            style={{ color: 'var(--text-secondary)' }}
          >
            <X size={18} />
          </button>

          {/* Exam Countdown Card */}
          {daysUntilExam !== null && (
            <div
              className="mb-4 p-3 rounded-lg border"
              style={{
                backgroundColor: daysUntilExam <= 7 ? 'var(--accent-coral)' : 'var(--accent-lavender-soft)',
                borderColor: daysUntilExam <= 7 ? 'var(--accent-coral)' : 'var(--accent-lavender)',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Clock size={14} style={{ color: daysUntilExam <= 7 ? '#fff' : 'var(--accent-lavender)' }} />
                <span
                  className="text-xs font-bold uppercase tracking-wide"
                  style={{ color: daysUntilExam <= 7 ? '#fff' : 'var(--accent-lavender)' }}
                >
                  {daysUntilExam === 0 ? 'Exam Today!' : `${daysUntilExam} Days Left`}
                </span>
              </div>
              <p
                className="text-xs"
                style={{ color: daysUntilExam <= 7 ? 'rgba(255,255,255,0.85)' : 'var(--accent-lavender)' }}
              >
                {daysUntilExam <= 7
                  ? 'Final stretch — focus on weak areas!'
                  : 'Stay consistent. Small daily wins add up.'}
              </p>
            </div>
          )}

          {/* Overall Progress */}
          <div className="mb-5 p-3 rounded-lg" style={{ backgroundColor: 'var(--surface-elevated)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                Overall Progress
              </span>
              <span className="text-xs font-bold" style={{ color: 'var(--accent-primary)' }}>
                {overallPct}%
              </span>
            </div>
            <div
              className="h-3 rounded-full overflow-hidden"
              style={{ backgroundColor: 'var(--surface-base)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-200"
                style={{
                  width: `${overallPct}%`,
                  background: 'var(--accent-gradient)',
                }}
              />
            </div>
            <p className="text-xs mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
              {completedChapters} of {totalChapters} chapters completed
            </p>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors duration-150"
              style={{
                backgroundColor: location.pathname === '/' ? 'var(--surface-elevated)' : 'transparent',
                color: location.pathname === '/' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: location.pathname === '/' ? 600 : 400,
              }}
            >
              <Home size={16} />
              Home
            </Link>

            <div className="pt-2 pb-1">
              <span className="px-2.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                Domains
              </span>
            </div>

            {domains.map((domain) => {
              const Icon = domainIcons[domain.id - 1]
              const color = domainColors[domain.id - 1]
              const isActive = location.pathname.startsWith(`/domain${domain.id}`)
              const isExpanded = expandedDomains[domain.id]
              const readCount = readChapters[domain.id]?.length || 0
              const totalCount = domain.chapters.length
              const pct = Math.round((readCount / totalCount) * 100)
              const isDone = pct === 100

              return (
                <div key={domain.id}>
                  <button
                    onClick={() => toggleDomain(domain.id)}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors duration-150"
                    style={{
                      backgroundColor: isActive ? 'var(--surface-elevated)' : 'transparent',
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    <Icon size={16} style={{ color: isActive ? color : 'var(--text-tertiary)' }} />
                    <span className="flex-1 text-left truncate">
                      D{domain.number}: {domain.title}
                    </span>
                    {isDone && (
                      <CheckCircle2 size={14} style={{ color: 'var(--success)' }} />
                    )}
                    {isExpanded ? (
                      <ChevronDown size={14} style={{ color: 'var(--text-tertiary)' }} />
                    ) : (
                      <ChevronRight size={14} style={{ color: 'var(--text-tertiary)' }} />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="ml-6 mt-1 space-y-0.5">
                      {domain.chapters.map((chapter) => {
                        const isRead = readChapters[domain.id]?.includes(chapter.id)
                        return (
                          <Link
                            key={chapter.id}
                            to={`/domain${domain.id}/${chapter.id}`}
                            onClick={onClose}
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors duration-150"
                            style={{
                              backgroundColor: location.pathname === `/domain${domain.id}/${chapter.id}`
                                ? 'var(--surface-elevated)'
                                : 'transparent',
                              color: location.pathname === `/domain${domain.id}/${chapter.id}`
                                ? 'var(--text-primary)'
                                : 'var(--text-secondary)',
                            }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{
                                backgroundColor: isRead ? color : 'var(--border-medium)',
                              }}
                            />
                            <span className="flex-1 truncate">{chapter.title}</span>
                            {isRead && (
                              <CheckCircle2 size={12} style={{ color: 'var(--success)', flexShrink: 0 }} />
                            )}
                          </Link>
                        )
                      })}
                      {/* Mini progress bar per domain */}
                      <div className="px-2.5 pt-1 pb-1">
                        <div
                          className="h-1.5 rounded-full overflow-hidden"
                          style={{ backgroundColor: 'var(--surface-base)' }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${pct}%`, backgroundColor: color }}
                          />
                        </div>
                        <div className="flex justify-between mt-0.5">
                          <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                            {readCount}/{totalCount}
                          </span>
                          <span className="text-[10px] font-medium" style={{ color }}>
                            {pct}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            <div className="pt-3 pb-1">
              <span className="px-2.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                Tools
              </span>
            </div>

            <Link
              to="/practice-exam"
              onClick={onClose}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors duration-150"
              style={{
                backgroundColor: location.pathname === '/practice-exam' ? 'var(--surface-elevated)' : 'transparent',
                color: location.pathname === '/practice-exam' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: location.pathname === '/practice-exam' ? 600 : 400,
              }}
            >
              <FlaskConical size={16} />
              Practice Exam
            </Link>
            <Link
              to="/quick-recall"
              onClick={onClose}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors duration-150"
              style={{
                backgroundColor: location.pathname === '/quick-recall' ? 'var(--surface-elevated)' : 'transparent',
                color: location.pathname === '/quick-recall' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: location.pathname === '/quick-recall' ? 600 : 400,
              }}
            >
              <BrainCircuit size={16} />
              Quick Recall
            </Link>
            <Link
              to="/cheat-sheet"
              onClick={onClose}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors duration-150"
              style={{
                backgroundColor: location.pathname === '/cheat-sheet' ? 'var(--surface-elevated)' : 'transparent',
                color: location.pathname === '/cheat-sheet' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: location.pathname === '/cheat-sheet' ? 600 : 400,
              }}
            >
              <Layers size={16} />
              Cheat Sheet
            </Link>
            <Link
              to="/glossary"
              onClick={onClose}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors duration-150"
              style={{
                backgroundColor: location.pathname === '/glossary' ? 'var(--surface-elevated)' : 'transparent',
                color: location.pathname === '/glossary' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: location.pathname === '/glossary' ? 600 : 400,
              }}
            >
              <BookOpen size={16} />
              Glossary
            </Link>

            <div className="pt-3 pb-1">
              <span className="px-2.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                Settings
              </span>
            </div>

            <Link
              to="/settings"
              onClick={onClose}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors duration-150"
              style={{
                backgroundColor: location.pathname === '/settings' ? 'var(--surface-elevated)' : 'transparent',
                color: location.pathname === '/settings' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: location.pathname === '/settings' ? 600 : 400,
              }}
            >
              <Settings size={16} />
              Settings
            </Link>
          </nav>
        </div>
      </aside>
    </>
  )
}
