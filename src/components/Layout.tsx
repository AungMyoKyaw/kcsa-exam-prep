import { useState, useEffect, useCallback } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024
    }
    return true
  })

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev)
  }, [])

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false)
  }, [])

  return (
    <div className="min-h-[100dvh]" style={{ backgroundColor: 'var(--page-bg)' }}>
      <Navbar
        onMenuClick={toggleSidebar}
        sidebarOpen={sidebarOpen}
      />

      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <main
        className={`transition-all duration-200 ${sidebarOpen ? 'lg:pl-[280px]' : ''}`}
        style={{
          paddingTop: '56px',
          minHeight: '100dvh',
        }}
      >
        <div className="min-h-[calc(100dvh-56px)] flex flex-col">
          <div className="flex-1 max-w-[900px] mx-auto w-full px-4 sm:px-6 py-6 md:py-8">
            {children}
          </div>
          <Footer />
        </div>
      </main>
    </div>
  )
}
