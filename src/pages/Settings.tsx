import { useState, useEffect } from 'react';
import {
  Moon,
  Sun,
  Trash2,
  AlertTriangle,
  Keyboard,
  BookOpen,
  FlaskConical,
  Layers,
  BrainCircuit,
  RotateCcw,
  Calendar,
  CheckCircle2,
  Info,
  Target,
} from 'lucide-react';
import BeginnerModeToggle from '@/components/BeginnerModeToggle';
import { resetAllProgress } from '@/lib/gamification';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  const [examDate, setExamDate] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('kcsa_exam_date') || '';
    }
    return '';
  });

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDateSaved, setShowDateSaved] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  const handleResetProgress = () => {
    resetAllProgress();
    setShowResetConfirm(false);
    window.dispatchEvent(new StorageEvent('storage', { key: 'kcsa_read_chapters' }));
    window.dispatchEvent(new StorageEvent('storage', { key: 'kcsa-domain-progress' }));
    window.location.reload();
  };

  const handleSaveExamDate = () => {
    if (examDate) {
      localStorage.setItem('kcsa_exam_date', examDate);
    } else {
      localStorage.removeItem('kcsa_exam_date');
    }
    setShowDateSaved(true);
    setTimeout(() => setShowDateSaved(false), 2000);
  };

  const daysUntilExam = examDate
    ? Math.max(0, Math.ceil((new Date(examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
        Settings
      </h1>
      <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
        Customize your study experience and manage your data.
      </p>

      {/* Appearance */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Moon size={18} style={{ color: 'var(--accent-primary)' }} />
          Appearance
        </h2>
        <div
          className="rounded-xl border p-4"
          style={{ backgroundColor: 'var(--surface-base)', borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon size={20} style={{ color: 'var(--accent-lavender)' }} />
              ) : (
                <Sun size={20} style={{ color: 'var(--warning)' }} />
              )}
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {darkMode ? 'Dark Mode' : 'Light Mode'}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {darkMode
                    ? 'Easier on the eyes for late-night study sessions.'
                    : 'Clean, high-contrast interface for daytime reading.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode((p) => !p)}
              className="relative w-12 h-6 rounded-full transition-colors duration-200"
              style={{
                backgroundColor: darkMode ? 'var(--accent-lavender)' : 'var(--border-medium)',
              }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
                style={{ transform: darkMode ? 'translateX(26px)' : 'translateX(2px)' }}
              />
            </button>
          </div>

          {/* Beginner Mode Toggle */}
          <div style={{ borderTop: '1px solid var(--border-subtle)' }} className="pt-4">
            <BeginnerModeToggle />
          </div>
        </div>
      </section>

      {/* Exam Date */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Calendar size={18} style={{ color: 'var(--success)' }} />
          Exam Date
        </h2>
        <div
          className="rounded-xl border p-4"
          style={{ backgroundColor: 'var(--surface-base)', borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Target Exam Date
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-opacity-20"
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--accent-primary)',
                } as React.CSSProperties}
              />
            </div>
            <button
              onClick={handleSaveExamDate}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity duration-200 hover:opacity-90"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              Save Date
            </button>
          </div>

          {daysUntilExam !== null && examDate && (
            <div
              className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: daysUntilExam <= 7 ? 'var(--accent-coral)' : 'var(--surface-elevated)',
                color: daysUntilExam <= 7 ? '#fff' : 'var(--text-primary)',
              }}
            >
              <Target size={16} />
              {daysUntilExam === 0
                ? 'Your exam is today. Good luck! 🎯'
                : `${daysUntilExam} day${daysUntilExam !== 1 ? 's' : ''} until your exam.`}
            </div>
          )}

          {showDateSaved && (
            <div
              className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
              style={{ backgroundColor: 'var(--surface-elevated)', color: 'var(--success)' }}
            >
              <CheckCircle2 size={16} />
              Exam date saved.
            </div>
          )}
        </div>
      </section>

      {/* Progress */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <RotateCcw size={18} style={{ color: 'var(--accent-coral)' }} />
          Progress
        </h2>
        <div
          className="rounded-xl border p-4"
          style={{ backgroundColor: 'var(--surface-base)', borderColor: 'var(--border-subtle)' }}
        >
          {!showResetConfirm ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trash2 size={20} style={{ color: 'var(--accent-coral)' }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Reset All Progress
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Clear all chapter reads, quiz scores, exam history, XP, streak, and badges.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border transition-opacity duration-200 hover:opacity-80"
                style={{
                  borderColor: 'var(--accent-coral)',
                  color: 'var(--accent-coral)',
                  backgroundColor: 'transparent',
                }}
              >
                Reset
              </button>
            </div>
          ) : (
            <div className="rounded-lg p-4 border" style={{ backgroundColor: 'var(--accent-coral)', borderColor: 'var(--accent-coral)' }}>
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" style={{ color: '#fff' }} />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1" style={{ color: '#fff' }}>
                    Are you sure?
                  </p>
                  <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    This will permanently delete all your reading progress, quiz scores, XP, streak, badges, and exam results. This cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleResetProgress}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium text-white border border-white/40 transition-opacity duration-200 hover:opacity-80"
                    >
                      Yes, Reset Everything
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-opacity duration-200 hover:opacity-80"
                      style={{ color: '#fff', backgroundColor: 'rgba(255,255,255,0.2)' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Keyboard Shortcuts */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Keyboard size={18} style={{ color: 'var(--warning)' }} />
          Keyboard Shortcuts
        </h2>
        <div
          className="rounded-xl border p-4"
          style={{ backgroundColor: 'var(--surface-base)', borderColor: 'var(--border-subtle)' }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { keys: '⌘ B', desc: 'Toggle sidebar' },
              { keys: '⌘ K', desc: 'Search' },
              { keys: '← / →', desc: 'Navigate flashcards' },
              { keys: 'Space', desc: 'Flip flashcard' },
              { keys: 'Esc', desc: 'Close modal / search' },
            ].map((shortcut) => (
              <div key={shortcut.keys} className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {shortcut.desc}
                </span>
                <kbd
                  className="px-2 py-1 rounded text-xs font-mono"
                  style={{
                    backgroundColor: 'var(--surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {shortcut.keys}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Reference */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <BookOpen size={18} style={{ color: 'var(--accent-primary)' }} />
          Navigation
        </h2>
        <div
          className="rounded-xl border p-4"
          style={{ backgroundColor: 'var(--surface-base)', borderColor: 'var(--border-subtle)' }}
        >
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: BookOpen, label: 'Home', path: '/' },
              { icon: FlaskConical, label: 'Practice Exam', path: '/practice-exam' },
              { icon: BrainCircuit, label: 'Quick Recall', path: '/quick-recall' },
              { icon: Layers, label: 'Cheat Sheet', path: '/cheat-sheet' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.path}
                  href={item.path}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150 hover:opacity-80"
                  style={{
                    backgroundColor: 'var(--surface-elevated)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <Icon size={16} style={{ color: 'var(--text-tertiary)' }} />
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Info size={18} style={{ color: 'var(--text-tertiary)' }} />
          About
        </h2>
        <div
          className="rounded-xl border p-4"
          style={{ backgroundColor: 'var(--surface-base)', borderColor: 'var(--border-subtle)' }}
        >
          <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>KCSA Exam Prep</strong> — A focused study companion for the Kubernetes and Cloud Native Security Associate certification.
          </p>
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            Covers all 6 CNCF KCSA domains with detailed chapters, practice questions, flashcards, and a comprehensive cheat sheet.
          </p>
          <div className="flex flex-wrap gap-2">
            {['React 19', 'TypeScript', 'Tailwind CSS', 'Lucide Icons'].map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  color: 'var(--text-tertiary)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
