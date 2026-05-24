import { Link } from 'react-router'
import {
  Keyboard,
  Github,
  Info,
} from 'lucide-react'

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--surface-elevated)',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Exam Info */}
          <div>
            <h4
              className="text-sm font-semibold mb-3"
              style={{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
              }}
            >
              Exam Information
            </h4>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              KCSA Exam &bull; 90 min &bull; 75% to pass &bull; CNCF/LF
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4
              className="text-sm font-semibold mb-3"
              style={{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
              }}
            >
              Quick Links
            </h4>
            <div className="flex flex-col gap-2">
              <button
                className="inline-flex items-center gap-2 text-sm transition-colors duration-200 hover:underline underline-offset-2"
                style={{ color: 'var(--text-secondary)' }}
                onClick={() => {
                  // Intentional no-op: placeholder for future navigation
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.color = 'var(--accent-primary)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
                }}
              >
                <Keyboard size={14} />
                Keyboard shortcuts
              </button>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-sm no-underline transition-colors duration-200"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.color = 'var(--accent-primary)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
                }}
              >
                <Github size={14} />
                Report issue
              </a>
              <Link
                to="/settings"
                className="inline-flex items-center gap-2 text-sm no-underline transition-colors duration-200"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  ;(e.currentTarget as HTMLElement).style.color = 'var(--accent-primary)'
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  ;(e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
                }}
              >
                <Info size={14} />
                About this book
              </Link>
            </div>
          </div>

          {/* Column 3: Version Info */}
          <div>
            <h4
              className="text-sm font-semibold mb-3"
              style={{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
              }}
            >
              Version
            </h4>
            <p
              className="text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: 'var(--text-tertiary)' }}
            >
              v1.0
            </p>
          </div>
        </div>

        {/* Bottom Row: Trademark */}
        <div
          className="mt-8 pt-4 text-center"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
        >
          <p
            className="text-xs tracking-wide"
            style={{
              color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-body)',
              letterSpacing: '0.02em',
            }}
          >
            Kubernetes&reg; is a registered trademark of The Linux Foundation.
          </p>
        </div>
      </div>
    </footer>
  )
}
