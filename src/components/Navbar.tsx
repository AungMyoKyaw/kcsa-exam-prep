import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router'
import {
  Menu,
  Search,
  Sun,
  Moon,
  BookOpen,
  X,
} from 'lucide-react'

interface NavbarProps {
  onMenuClick: () => void
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  onThemeToggle: () => void
}

export default function Navbar({ onMenuClick, sidebarOpen, theme, onThemeToggle }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <nav
      className="fixed top-0 left-0 right-0 h-[56px] z-40 flex items-center px-4 lg:px-6"
      style={{
        backgroundColor: 'var(--surface-base)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      {/* Left Group */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onMenuClick}
          className="hidden lg:flex items-center justify-center w-9 h-9 rounded-md hover:bg-[var(--surface-elevated)] transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <button
          onClick={onMenuClick}
          className="flex lg:hidden items-center justify-center w-9 h-9 rounded-md hover:bg-[var(--surface-elevated)] transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <Link to="/" className="flex items-center gap-2 no-underline">
          <BookOpen size={22} style={{ color: 'var(--accent-primary)' }} />
          <span
            className="text-xs font-semibold tracking-[0.06em] uppercase hidden sm:inline"
            style={{ color: 'var(--text-secondary)' }}
          >
            KCSA
          </span>
        </Link>
      </div>

      {/* Center: Search */}
      <div className="flex-1 flex justify-center max-w-lg mx-auto px-4">
        <div className="relative flex items-center w-full max-w-[320px]">
          <Search
            size={16}
            className="absolute left-3 pointer-events-none"
            style={{ color: 'var(--text-tertiary)' }}
          />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chapters, topics, commands..."
            className="w-full h-9 pl-9 pr-8 text-sm rounded-md outline-none transition-all"
            style={{
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 p-0.5 rounded-full hover:bg-[var(--border-subtle)] transition-colors"
              style={{ color: 'var(--text-tertiary)' }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Right Group */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onThemeToggle}
          className="w-9 h-9 rounded-md flex items-center justify-center hover:bg-[var(--surface-elevated)] transition-colors"
          style={{
            color: 'var(--text-secondary)',
          }}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </nav>
  )
}
