import { useState, useEffect, useCallback } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark')
  const [scrollProgress, setScrollProgress] = useState(0)

  // Load theme from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('kcsa-theme') as 'light' | 'dark' | 'system' | null
    if (saved) {
      setTheme(saved)
    }
  }, [])

  // Apply theme class to html
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        root.classList.add('dark')
      } else {
        root.classList.add('light')
      }
    } else {
      root.classList.add(theme)
    }

    localStorage.setItem('kcsa-theme', theme)
  }, [theme])

  // Handle theme toggle: cycles through dark → light → system
  const handleThemeToggle = useCallback(() => {
    setTheme((prev) => {
      if (prev === 'dark') return 'light'
      if (prev === 'light') return 'system'
      return 'dark'
    })
  }, [])

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        setScrollProgress(Math.round((scrollTop / docHeight) * 100))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault()
        setSidebarOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev)
  }, [])

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false)
  }, [])

  return (
    <div className="min-h-[100dvh]" style={{ backgroundColor: 'var(--page-bg)' }}>
      {/* Reading progress bar */}
      <div
        className="fixed top-0 left-0 right-0 h-[3px] z-50"
        style={{ backgroundColor: 'transparent' }}
      >
        <div
          className="h-full transition-all duration-200"
          style={{
            width: `${scrollProgress}%`,
            background: 'var(--accent-gradient)',
          }}
        />
      </div>

      <Navbar
        onMenuClick={toggleSidebar}
        sidebarOpen={sidebarOpen}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />

      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main content area */}
      <main
        className="transition-all duration-300"
        style={{
          paddingTop: '60px',
          paddingLeft: sidebarOpen ? '280px' : '0px',
          minHeight: '100dvh',
        }}
      >
        {/* Scrollable content */}
        <div
          className="min-h-[calc(100dvh-60px)] flex flex-col"
          style={{ transition: 'margin-left 0.3s ease' }}
        >
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </main>
    </div>
  )
}
