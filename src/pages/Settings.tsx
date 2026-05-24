import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  BarChart3,
  Keyboard,
  Info,
  AlertTriangle,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { domains } from '@/lib/domainData';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

const settingsTabs = [
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
  { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
  { id: 'about', label: 'About', icon: Info },
];

// ===== Tab 1: Appearance =====

function AppearanceTab() {
  const [codeFontSize, setCodeFontSize] = useState(14);
  const [readingFontSize, setReadingFontSize] = useState(16);

  useEffect(() => {
    const codeSize = localStorage.getItem('kcsa-code-font-size');
    if (codeSize != null) {
      setTimeout(() => setCodeFontSize(parseInt(codeSize, 10)), 0);
    }
    const readSize = localStorage.getItem('kcsa-reading-font-size');
    if (readSize != null) {
      setTimeout(() => setReadingFontSize(parseInt(readSize, 10)), 0);
    }
  }, []);

  const handleCodeFontChange = (size: number) => {
    setCodeFontSize(size);
    localStorage.setItem('kcsa-code-font-size', String(size));
  };

  const handleReadingFontChange = (size: number) => {
    setReadingFontSize(size);
    localStorage.setItem('kcsa-reading-font-size', String(size));
    document.documentElement.style.setProperty('--reading-font-size', `${size}px`);
  };

  return (
    <div className="space-y-8">
      {/* Code Font Size */}
      <div
        className="pt-8"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
          Code Font Size
        </h3>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          Adjust the size of code blocks and inline code
        </p>
        <div className="flex items-center gap-4">
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>12px</span>
          <input
            type="range"
            min={12}
            max={18}
            step={1}
            value={codeFontSize}
            onChange={(e) => handleCodeFontChange(parseInt(e.target.value, 10))}
            className="flex-1 accent-primary"
            style={{ accentColor: 'var(--accent-primary)' }}
          />
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>18px</span>
          <span
            className="text-sm font-semibold ml-2 px-2 py-1 rounded"
            style={{ color: 'var(--accent-primary)', backgroundColor: 'rgba(4,80,54,0.08)' }}
          >
            {codeFontSize}px
          </span>
        </div>
        <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--surface-code)' }}>
          <code
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: `${codeFontSize}px`,
              color: 'var(--text-primary)',
            }}
          >
            apiVersion: v1
            <br />
            kind: Pod
            <br />
            metadata:
            <br />
            &nbsp;&nbsp;name: example
          </code>
        </div>
      </div>

      {/* Reading Font Size */}
      <div
        className="pt-8"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
          Reading Font Size
        </h3>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          Adjust the size of body text
        </p>
        <div className="flex items-center gap-4">
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>14px</span>
          <input
            type="range"
            min={14}
            max={20}
            step={1}
            value={readingFontSize}
            onChange={(e) => handleReadingFontChange(parseInt(e.target.value, 10))}
            className="flex-1"
            style={{ accentColor: 'var(--accent-primary)' }}
          />
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>20px</span>
          <span
            className="text-sm font-semibold ml-2 px-2 py-1 rounded"
            style={{ color: 'var(--accent-primary)', backgroundColor: 'rgba(4,80,54,0.08)' }}
          >
            {readingFontSize}px
          </span>
        </div>
        <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--surface-elevated)' }}>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: `${readingFontSize}px`,
              color: 'var(--text-primary)',
              lineHeight: 1.7,
            }}
          >
            This is a sample paragraph to preview your reading font size. 
            Kubernetes is an open-source container orchestration platform 
            that automates the deployment, scaling, and management of containerized applications.
          </p>
        </div>
      </div>
    </div>
  );
}

// ===== Tab 2: Progress =====

function ProgressTab() {
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetConfirm, setResetConfirm] = useState('');

  // Mock stats (in a real app these would be computed from localStorage)
  const stats = [
    { label: 'Overall Progress', value: '45%', context: '9 of 20 sections completed' },
    { label: 'Quiz Average', value: '82%', context: 'Across all chapter quizzes' },
    { label: 'Practice Exams', value: '2 taken', context: 'Best score: 78%' },
    { label: 'Study Time', value: '12.5 hours', context: 'Estimated from reading progress' },
  ];

  const handleReset = () => {
    if (resetConfirm === 'RESET') {
      localStorage.removeItem('kcsa-progress');
      localStorage.removeItem('kcsa-practice-exams');
      localStorage.removeItem('kcsa-quiz-scores');
      setShowResetDialog(false);
      setResetConfirm('');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: easeOutExpo }}
            className="p-6 rounded-[20px] border"
            style={{ backgroundColor: 'var(--surface-base)', borderColor: 'var(--border-subtle)' }}
          >
            <span
              className="text-xs font-semibold uppercase tracking-[0.06em]"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {stat.label}
            </span>
            <p
              className="text-3xl font-normal mt-2"
              style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-display)' }}
            >
              {stat.value}
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {stat.context}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Domain Progress */}
      <div
        className="pt-8"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <h3
          className="text-xl font-bold mb-4"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          Domain Progress
        </h3>
        <div className="space-y-4">
          {domains.map((domain, i) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {domain.number}: {domain.shortName}
                  </span>
                  <span
                    className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: 'rgba(242,196,77,0.15)', color: 'var(--accent-amber)' }}
                  >
                    {domain.weight}%
                  </span>
                </div>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  3/8 sections &bull; Quiz: 75%
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-subtle)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'var(--accent-gradient)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${35 + i * 5}%` }}
                  transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.1 + i * 0.08 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Reset Section */}
      <div
        className="pt-8 rounded-[20px] p-6"
        style={{
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'rgba(232,122,93,0.04)',
          border: '1px solid rgba(232,122,93,0.2)',
        }}
      >
        <h3
          className="text-xl font-bold mb-2"
          style={{ color: 'var(--accent-coral)' }}
        >
          Reset Progress
        </h3>
        <p className="text-sm mb-4" style={{ color: 'var(--accent-coral)', opacity: 0.8 }}>
          This will delete all reading progress, quiz scores, and practice exam results. 
          This action cannot be undone.
        </p>
        <button
          onClick={() => setShowResetDialog(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
          style={{
            border: '1px solid var(--accent-coral)',
            color: 'var(--accent-coral)',
            backgroundColor: 'transparent',
          }}
        >
          <RotateCcw size={14} /> Reset All Progress
        </button>
      </div>

      {/* Reset Confirmation Dialog */}
      <AnimatePresence>
        {showResetDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {setShowResetDialog(false);}
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: easeOutExpo }}
              className="w-full max-w-md p-6 rounded-[20px]"
              style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle size={24} style={{ color: 'var(--accent-coral)' }} />
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Are you sure?
                </h3>
              </div>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                All your progress will be permanently deleted. Type <strong style={{ color: 'var(--accent-coral)' }}>RESET</strong> to confirm.
              </p>
              <input
                type="text"
                value={resetConfirm}
                onChange={(e) => setResetConfirm(e.target.value)}
                placeholder="Type RESET to confirm"
                className="w-full h-11 px-4 rounded-xl text-sm mb-4 outline-none"
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                }}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowResetDialog(false); setResetConfirm(''); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200"
                  style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--surface-elevated)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  disabled={resetConfirm !== 'RESET'}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-40"
                  style={{
                    backgroundColor: 'var(--accent-coral)',
                    color: '#fff',
                  }}
                >
                  Reset Everything
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ===== Tab 3: Shortcuts =====

function ShortcutsTab() {
  const shortcutGroups = [
    {
      title: 'Global Shortcuts',
      shortcuts: [
        { keys: ['Ctrl/Cmd', 'K'], action: 'Focus search input' },
        { keys: ['Ctrl/Cmd', 'B'], action: 'Toggle sidebar' },
        { keys: ['Ctrl/Cmd', 'Shift', 'L'], action: 'Toggle sidebar' },
        { keys: ['?'], action: 'Show keyboard shortcuts help' },
        { keys: ['Esc'], action: 'Close modal / search / sidebar' },
      ],
    },
    {
      title: 'Reading Shortcuts',
      shortcuts: [
        { keys: ['→'], action: 'Next chapter' },
        { keys: ['←'], action: 'Previous chapter' },
        { keys: ['↑ / ↓'], action: 'Scroll content' },
      ],
    },
    {
      title: 'Practice Exam Shortcuts',
      shortcuts: [
        { keys: ['1 – 4'], action: 'Select option A/B/C/D' },
        { keys: ['F'], action: 'Flag current question' },
        { keys: ['→ / N'], action: 'Next question' },
        { keys: ['← / P'], action: 'Previous question' },
        { keys: ['Enter'], action: 'Submit answer / go to next' },
        { keys: ['R'], action: 'Open review screen' },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {shortcutGroups.map((group, gi) => (
        <motion.div
          key={group.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: gi * 0.1, duration: 0.4, ease: easeOutExpo }}
        >
          <h3
            className="text-lg font-bold mb-4"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
          >
            {group.title}
          </h3>
          <div
            className="rounded-[20px] border overflow-hidden"
            style={{ backgroundColor: 'var(--surface-base)', borderColor: 'var(--border-subtle)' }}
          >
            {group.shortcuts.map((s, i) => (
              <motion.div
                key={s.action}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: gi * 0.1 + i * 0.04 }}
                className="flex items-center gap-4 px-5 py-3 transition-colors duration-150 hover:bg-[var(--surface-elevated)]"
                style={{
                  borderBottom: i < group.shortcuts.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                }}
              >
                <div className="flex items-center gap-1.5 flex-shrink-0 min-w-[180px]">
                  {s.keys.map((key, ki) => (
                    <span key={ki} className="flex items-center gap-1.5">
                      <kbd
                        className="px-2 py-1 rounded-md text-xs font-medium font-mono"
                        style={{
                          backgroundColor: 'var(--surface-elevated)',
                          border: '1px solid var(--border-medium)',
                          borderBottom: '2px solid var(--border-medium)',
                          color: 'var(--text-primary)',
                          boxShadow: '0 1px 0 var(--border-medium)',
                        }}
                      >
                        {key}
                      </kbd>
                      {ki < s.keys.length - 1 && (
                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>+</span>
                      )}
                    </span>
                  ))}
                </div>
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  {s.action}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ===== Tab 4: About =====

function AboutTab() {
  const resources = [
    { name: 'Official KCSA Exam Page (Linux Foundation)', url: 'https://training.linuxfoundation.org/certification/kubernetes-and-cloud-native-security-associate-kcsa/' },
    { name: 'CNCF Curriculum Repository (GitHub)', url: 'https://github.com/cncf/curriculum' },
    { name: 'Kubernetes Documentation', url: 'https://kubernetes.io/docs/' },
    { name: 'Kubernetes Security Documentation', url: 'https://kubernetes.io/docs/concepts/security/' },
    { name: 'NSA/CISA Kubernetes Hardening Guide', url: 'https://media.defense.gov/2022/Aug/29/2003066362/-1/-1/0/CTR_KUBERNETES_HARDENING_GUIDANCE_1.2_20220829.PDF' },
    { name: 'CIS Kubernetes Benchmark', url: 'https://www.cisecurity.org/benchmark/kubernetes' },
  ];

  return (
    <div className="space-y-8">
      {/* Book Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: easeOutExpo }}
      >
        <h3
          className="text-xl font-bold mb-3"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          About This Book
        </h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-primary)' }}>
          An interactive, comprehensive study guide for the Kubernetes and Cloud Native Security 
          Associate (KCSA) certification exam. Built to cover every domain, every concept, and 
          every detail you need to pass.
        </p>
        <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span>
            Version: <code className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--surface-code)' }}>v1.0</code>
          </span>
          <span>Last Updated: January 2025</span>
        </div>
      </motion.div>

      {/* Exam Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4, ease: easeOutExpo }}
        className="pt-6"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <h3
          className="text-xl font-bold mb-4"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          About the KCSA Exam
        </h3>
        <div
          className="rounded-[20px] border overflow-hidden"
          style={{ backgroundColor: 'var(--surface-base)', borderColor: 'var(--border-subtle)' }}
        >
          {[
            { label: 'Exam Name', value: 'Kubernetes and Cloud Native Security Associate' },
            { label: 'Issuing Organization', value: 'Cloud Native Computing Foundation (CNCF) / Linux Foundation' },
            { label: 'Format', value: 'Multiple choice, online proctored' },
            { label: 'Duration', value: '90 minutes' },
            { label: 'Questions', value: '~60' },
            { label: 'Passing Score', value: '75%' },
            { label: 'Validity', value: '2 years' },
            { label: 'Price', value: '~$250 USD (check Linux Foundation for current pricing)' },
            { label: 'Prerequisites', value: 'None (Kubernetes knowledge strongly recommended)' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-4 px-5 py-3"
              style={{
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <span className="text-xs font-semibold uppercase tracking-wider w-36 flex-shrink-0 pt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                {item.label}
              </span>
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                {item.value}
              </span>
            </div>
          ))}
          <div className="flex items-start gap-4 px-5 py-3">
            <span className="text-xs font-semibold uppercase tracking-wider w-36 flex-shrink-0 pt-0.5" style={{ color: 'var(--text-tertiary)' }}>
              Official Curriculum
            </span>
            <a
              href="https://github.com/cncf/curriculum"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm inline-flex items-center gap-1 transition-colors duration-200"
              style={{ color: 'var(--accent-primary)' }}
            >
              github.com/cncf/curriculum
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </motion.div>

      {/* Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: easeOutExpo }}
        className="pt-6"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <h3
          className="text-xl font-bold mb-4"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          Additional Resources
        </h3>
        <div className="space-y-2">
          {resources.map((res, i) => (
            <motion.a
              key={res.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.04 }}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl border text-sm transition-all duration-200 hover:scale-[1.01]"
              style={{
                backgroundColor: 'var(--surface-base)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--accent-primary)',
              }}
            >
              <ExternalLink size={14} className="flex-shrink-0" />
              <span className="font-medium">{res.name}</span>
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="pt-6"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          This book is an independent study guide and is not affiliated with or endorsed by the 
          CNCF, Linux Foundation, or Kubernetes project. Kubernetes&reg; is a registered trademark 
          of The Linux Foundation. All content is based on publicly available exam objectives and 
          industry best practices.
        </p>
      </motion.div>
    </div>
  );
}

// ===== Main Settings Page =====

export default function Settings() {
  const [activeTab, setActiveTab] = useState('appearance');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'appearance': return <AppearanceTab />;
      case 'progress': return <ProgressTab />;
      case 'shortcuts': return <ShortcutsTab />;
      case 'about': return <AboutTab />;
      default: return null;
    }
  };

  return (
    <div className="min-h-[calc(100dvh-60px)] px-4 py-8 md:px-8">
      <div className="max-w-[800px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="mb-8"
        >
          <h1
            className="text-4xl md:text-5xl font-normal"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Settings
          </h1>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: easeOutExpo, delay: 0.1 }}
          className="mb-8 overflow-x-auto"
        >
          <div className="flex gap-2 pb-2">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200"
                style={{
                  backgroundColor: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--surface-elevated)',
                  color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
                  border: activeTab === tab.id ? 'none' : '1px solid var(--border-subtle)',
                }}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
