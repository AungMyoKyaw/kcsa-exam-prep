import { useEffect, useState, useRef, useCallback } from 'react';
import {
  Menu,
  X,
  Search,
  BrainCircuit,
  Settings,
  Moon,
  Sun,
  FlaskConical,
} from 'lucide-react';
import { Link, useLocation } from 'react-router';

interface NavbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

const routeTitles: Record<string, string> = {
  '/': 'Home',
  '/domain1': 'Domain 1: Overview',
  '/domain2': 'Domain 2: Cluster Components',
  '/domain3': 'Domain 3: Security Fundamentals',
  '/domain4': 'Domain 4: Threat Model',
  '/domain5': 'Domain 5: Platform Security',
  '/domain6': 'Domain 6: Compliance',
  '/practice-exam': 'Practice Exam',
  '/quick-recall': 'Quick Recall',
  '/cheat-sheet': 'Cheat Sheet',
  '/glossary': 'Glossary',
  '/settings': 'Settings',
};

export default function Navbar({ onMenuClick, sidebarOpen }: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ label: string; to: string }>>([]);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  // Build search index from chapters and utility pages
  const searchIndex = useCallback(() => {
    const results: Array<{ label: string; to: string }> = [];
    const domainChapters = [
      { domain: 1, chapters: ['Overview', 'Security Frameworks', 'Security Best Practices', 'Container Security', 'DevSecOps', 'Network Security', 'Namespace Isolation', 'Defense in Depth'] },
      { domain: 2, chapters: ['API Server', 'etcd', 'Kubelet', 'Scheduler', 'Controller Manager', 'PKI & Certificates', 'Admission Controllers', 'Service Accounts'] },
      { domain: 3, chapters: ['Authentication', 'Authorization', 'RBAC', 'Network Policies', 'Pod Security Standards', 'Secrets Management', 'TLS', 'Image Scanning'] },
      { domain: 4, chapters: ['STRIDE', 'MITRE ATT&CK', 'Vulnerability Management', 'Incident Response', 'Runtime Threats'] },
      { domain: 5, chapters: ['Supply Chain', 'Image Security', 'Admission Controllers', 'Runtime Security', 'Falco', 'Kyverno', 'OPA Gatekeeper', 'SLSA'] },
      { domain: 6, chapters: ['CIS Benchmarks', 'NIST', 'Compliance', 'Audit Logging', 'kube-bench'] },
    ];
    domainChapters.forEach(({ domain, chapters }) => {
      chapters.forEach((ch, i) => {
        results.push({ label: `Domain ${domain} · ${ch}`, to: `/domain${domain}/d${domain}-c${i + 1}` });
      });
    });
    results.push(
      { label: 'Practice Exam', to: '/practice-exam' },
      { label: 'Quick Recall', to: '/quick-recall' },
      { label: 'Cheat Sheet', to: '/cheat-sheet' },
      { label: 'Glossary', to: '/glossary' },
      { label: 'Settings', to: '/settings' },
    );
    return results;
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const idx = searchIndex();
    const filtered = idx.filter((item) => item.label.toLowerCase().includes(q)).slice(0, 8);
    setSearchResults(filtered);
  }, [searchQuery, searchIndex]);

  useEffect(() => {
    // Close search on route change
    setSearchOpen(false);
    setSearchQuery('');
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchOpen]);

  const toggleDarkMode = useCallback(() => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  }, [darkMode]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const pageTitle = routeTitles[location.pathname] || 'KCSA Exam Prep';

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4 border-b"
      style={{
        backgroundColor: 'var(--surface-base)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-md transition-colors duration-200 hover:opacity-80"
          style={{ color: 'var(--text-secondary)' }}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-sm"
          style={{ color: 'var(--text-primary)' }}
        >
          <FlaskConical size={18} style={{ color: 'var(--accent-primary)' }} />
          KCSA Prep
        </Link>

        <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'var(--surface-elevated)', color: 'var(--text-secondary)' }}>
          {pageTitle}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative" ref={searchRef}>
          <button
            onClick={() => setSearchOpen((p) => !p)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md text-sm border transition-all duration-200 hover:opacity-80"
            style={{
              backgroundColor: 'var(--surface-elevated)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-secondary)',
            }}
          >
            <Search size={14} />
            <span className="text-xs">Search…</span>
            <kbd
              className="hidden md:inline-block ml-1 px-1.5 py-0.5 text-[10px] rounded font-mono"
              style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
            >
              ⌘K
            </kbd>
          </button>

          {searchOpen && (
            <div
              className="absolute top-full right-0 mt-2 w-80 rounded-xl border shadow-lg overflow-hidden z-50"
              style={{
                backgroundColor: 'var(--surface-base)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <Search size={16} style={{ color: 'var(--text-tertiary)' }} />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chapters, pages…"
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: 'var(--text-primary)' }}
                />
                <kbd
                  className="px-1.5 py-0.5 text-[10px] rounded font-mono"
                  style={{ backgroundColor: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}
                >
                  Esc
                </kbd>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {searchResults.length === 0 && searchQuery.trim() && (
                  <div className="px-4 py-6 text-center text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    No results found
                  </div>
                )}
                {searchResults.map((r) => (
                  <Link
                    key={r.to}
                    to={r.to}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm transition-colors duration-150 hover:opacity-80"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <Search size={14} style={{ color: 'var(--text-tertiary)' }} />
                    {r.label}
                  </Link>
                ))}
                {searchResults.length === 0 && !searchQuery.trim() && (
                  <div className="px-4 py-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    Type to search chapters and pages
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Recall shortcut */}
        <Link
          to="/quick-recall"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium transition-all duration-200 hover:opacity-80"
          style={{
            backgroundColor: 'var(--accent-lavender-soft)',
            color: 'var(--accent-lavender)',
          }}
          title="Quick Recall (R)"
        >
          <BrainCircuit size={16} />
          <span className="hidden lg:inline">Recall</span>
        </Link>

        {/* Theme toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-md transition-colors duration-200 hover:opacity-80"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Settings */}
        <Link
          to="/settings"
          className="p-2 rounded-md transition-colors duration-200 hover:opacity-80"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Settings"
        >
          <Settings size={18} />
        </Link>
      </div>
    </header>
  );
}
