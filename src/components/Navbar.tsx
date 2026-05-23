import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
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

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]

export default function Navbar({ onMenuClick, sidebarOpen, theme, onThemeToggle }: NavbarProps) {
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [progress, setProgress] = useState(0)
  const [currentDomain] = useState('Domain 1')
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

  useEffect(() => {
    const timer = setTimeout(() => setProgress(0), 100)
    return () => clearTimeout(timer)
  }, [])

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <nav
      className="fixed top-0 left-0 right-0 h-[60px] z-40 flex items-center px-4 lg:px-6"
      style={{
        backgroundColor: isDark ? 'rgba(20, 31, 27, 0.9)' : 'rgba(244, 245, 240, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${isDark ? '#1E2E28' : '#E8E9E3'}`,
        transition: 'background-color 0.4s ease, border-color 0.4s ease',
      }}
    >
      {/* Left Group */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onMenuClick}
          className="lg:flex hidden items-center justify-center w-9 h-9 rounded-md transition-colors duration-200"
          style={{
            color: 'var(--text-secondary)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = isDark ? '#1C2A24' : '#F0F1EC'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
          }}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <button
          onClick={onMenuClick}
          className="flex lg:hidden items-center justify-center w-9 h-9 rounded-md transition-colors duration-200"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <Link to="/" className="flex items-center gap-2 no-underline group">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <BookOpen
              size={22}
              style={{ color: 'var(--accent-primary)' }}
              className="transition-transform duration-200 group-hover:scale-105"
            />
          </div>
          <span
            className="text-xs font-semibold tracking-[0.06em] uppercase hidden sm:inline"
            style={{ color: 'var(--text-secondary)' }}
          >
            KCSA
          </span>
        </Link>
      </div>

      {/* Center: Search */}
      <div className="flex-1 flex justify-center max-w-xl mx-auto px-4">
        <div
          className="relative flex items-center transition-all duration-300"
          style={{ width: searchFocused ? '100%' : '240px', maxWidth: '320px' }}
        >
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
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search chapters, topics, commands..."
            className="w-full h-9 pl-9 pr-8 text-sm rounded-full outline-none transition-all duration-300"
            style={{
              backgroundColor: isDark ? '#182520' : '#FFFFFF',
              border: `1px solid ${searchFocused ? 'var(--accent-primary)' : isDark ? '#2A3D35' : '#D1D4CC'}`,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
            }}
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                onClick={() => setSearchQuery('')}
                className="absolute right-2 p-0.5 rounded-full"
                style={{ color: 'var(--text-tertiary)' }}
              >
                <X size={14} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Group */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onThemeToggle}
          className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            color: 'var(--text-secondary)',
            border: `1px solid ${isDark ? '#2A3D35' : '#D1D4CC'}`,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = isDark ? '#1C2A24' : '#F0F1EC'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
          }}
          aria-label="Toggle theme"
        >
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.div
                key="sun"
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 180, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Sun size={16} />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ rotate: 180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -180, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Moon size={16} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <div
          className="hidden md:flex items-center gap-2 h-7 px-3 rounded-full"
          style={{
            backgroundColor: isDark ? 'rgba(61, 217, 160, 0.1)' : 'rgba(4, 80, 54, 0.08)',
            border: `1px solid ${isDark ? '#2A3D35' : '#D1D4CC'}`,
          }}
        >
          <span className="text-xs font-medium" style={{ color: 'var(--accent-primary)' }}>
            {currentDomain}
          </span>
          <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? '#1E2E28' : '#E8E9E3' }}>
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'var(--accent-gradient)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: easeOutExpo, delay: 0.5 }}
            />
          </div>
          <span className="text-xs font-medium" style={{ color: 'var(--accent-primary)' }}>
            {progress}%
          </span>
        </div>
      </div>
    </nav>
  )
}
