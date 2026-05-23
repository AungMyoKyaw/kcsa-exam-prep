import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import {
  ChevronRight,
  FlaskConical,
  ClipboardList,
  BookOpen,
  Settings,
  CheckCircle2,
  Circle,
} from 'lucide-react'
import { domains } from '@/lib/domainData'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const readChapters: Record<string, boolean> = {
  'd1-c1': true,
  'd1-c2': true,
  'd1-c3': true,
  'd2-c1': true,
  'd2-c2': true,
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const [expandedDomains, setExpandedDomains] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: false,
    4: false,
    5: false,
    6: false,
  })

  const toggleDomain = (domainId: number) => {
    setExpandedDomains((prev) => ({ ...prev, [domainId]: !prev[domainId] }))
  }

  const isActive = (path: string) => location.pathname === path

  const sidebarContent = (
    <div
      className="h-full flex flex-col overflow-y-auto custom-scrollbar"
      style={{ backgroundColor: 'var(--surface-base)' }}
    >
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <span
          className="text-xs font-semibold uppercase tracking-[0.06em]"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Chapters
        </span>
      </div>

      {/* Domain Groups */}
      <div className="flex-1 px-2 pb-4">
        {domains.map((domain) => {
          const domainPath = `/domain${domain.id}`
          const isExpanded = expandedDomains[domain.id]
          const isDomainActive = isActive(domainPath)
          const totalChapters = domain.chapters.length
          const readCount = domain.chapters.filter((ch) => readChapters[ch.id]).length

          return (
            <div key={domain.id} className="mb-0.5">
              {/* Domain Header */}
              <button
                onClick={() => toggleDomain(domain.id)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-colors duration-150 hover:bg-[var(--surface-elevated)]"
                style={{
                  backgroundColor: isDomainActive ? 'var(--surface-elevated)' : 'transparent',
                  color: isDomainActive ? 'var(--accent-primary)' : 'var(--text-primary)',
                }}
              >
                <ChevronRight
                  size={14}
                  style={{
                    color: 'var(--text-tertiary)',
                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.15s ease',
                  }}
                />
                <Link
                  to={domainPath}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 flex items-center justify-between min-w-0 no-underline"
                  onClickCapture={onClose}
                >
                  <span className="text-sm font-medium truncate">
                    {domain.number}
                  </span>
                </Link>
                <span
                  className="flex-shrink-0 text-[11px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: 'var(--surface-elevated)',
                    color: 'var(--text-tertiary)',
                  }}
                >
                  {domain.weight}%
                </span>
              </button>

              {/* Sub-chapters — no animation, instant toggle */}
              {isExpanded && (
                <div className="pl-8 pr-2 py-1">
                  {domain.chapters.map((chapter) => {
                    const chapterPath = `${domainPath}/${chapter.id}`
                    const isRead = readChapters[chapter.id]
                    return (
                      <Link
                        key={chapter.id}
                        to={chapterPath}
                        onClick={onClose}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors duration-150 no-underline hover:bg-[var(--surface-elevated)]"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {isRead ? (
                          <CheckCircle2
                            size={14}
                            style={{ color: 'var(--accent-sage)' }}
                            className="flex-shrink-0"
                          />
                        ) : (
                          <Circle
                            size={14}
                            style={{ color: 'var(--text-tertiary)' }}
                            className="flex-shrink-0"
                          />
                        )}
                        <span className="truncate">{chapter.title}</span>
                      </Link>
                    )
                  })}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 mt-1">
                    <div
                      className="flex-1 h-1 rounded-full overflow-hidden"
                      style={{ backgroundColor: 'var(--border-subtle)' }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(readCount / totalChapters) * 100}%`,
                          backgroundColor: 'var(--accent-primary)',
                        }}
                      />
                    </div>
                    <span
                      className="text-[10px] font-medium"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      {readCount}/{totalChapters}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Utility Links */}
      <div
        className="px-2 py-3 mt-auto"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        {[
          { to: '/practice-exam', icon: FlaskConical, label: 'Practice Exam' },
          { to: '/cheat-sheet', icon: ClipboardList, label: 'Cheat Sheet' },
          { to: '/glossary', icon: BookOpen, label: 'Glossary' },
          { to: '/settings', icon: Settings, label: 'Settings' },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 no-underline hover:bg-[var(--surface-elevated)]"
            style={{
              color: isActive(item.to) ? 'var(--accent-primary)' : 'var(--text-secondary)',
              backgroundColor: isActive(item.to) ? 'var(--surface-elevated)' : 'transparent',
            }}
          >
            <item.icon size={16} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:block fixed left-0 top-[56px] bottom-0 z-30 transition-all duration-200"
        style={{
          width: isOpen ? '280px' : '0px',
          borderRight: isOpen ? '1px solid var(--border-subtle)' : 'none',
          overflow: 'hidden',
          opacity: isOpen ? 1 : 0,
        }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile/Tablet Sidebar Overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 lg:hidden"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={onClose}
          />
          <aside
            className="fixed left-0 top-[56px] bottom-0 z-40 w-[280px] lg:hidden overflow-hidden"
            style={{
              borderRight: '1px solid var(--border-subtle)',
              animation: 'sidebarSlideIn 0.2s ease',
            }}
          >
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  )
}
