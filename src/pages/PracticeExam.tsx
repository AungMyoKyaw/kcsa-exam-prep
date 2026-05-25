import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  Clock,
  FileQuestion,
  BarChart3,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertTriangle,
  Timer,
  Eye,
  Grid3X3,
  X,
} from 'lucide-react';
import { getShuffledQuestions } from '@/data/examQuestions';
import type { ExamQuestion } from '@/data/examQuestions';
import { domains } from '@/lib/domainData';

const TOTAL_TIME = 90 * 60; // 90 minutes in seconds
const WARNING_TIME = 15 * 60; // 15 minutes in seconds

interface ExamResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpentSeconds: number;
  completedAt: string;
  domainScores: Record<number, { correct: number; total: number }>;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Mode 1: Start Screen
function StartScreen({ onStart }: { onStart: () => void }) {
  const domainDistribution = [
    { domain: 1, count: 8, name: 'Overview of Cloud Native Security' },
    { domain: 2, count: 14, name: 'Cluster Component Security' },
    { domain: 3, count: 14, name: 'Security Fundamentals' },
    { domain: 4, count: 10, name: 'Threat Model' },
    { domain: 5, count: 10, name: 'Platform Security' },
    { domain: 6, count: 4, name: 'Compliance & Frameworks' },
  ];

  return (
    <div className="min-h-[calc(100dvh-60px)] flex flex-col items-center justify-center px-4 py-12">
      <div
        className="text-center mb-10"
      >
        <h1
          className="text-4xl md:text-5xl font-normal mb-3"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          KCSA Practice Exam
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          60 Questions &bull; 90 Minutes &bull; Simulated Environment
        </p>
      </div>

      {/* Info Cards */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[720px] w-full mb-10"
      >
        {[
          { icon: Clock, title: '90 Minutes', desc: 'Same time limit as the real exam. Timer starts when you begin.' },
          { icon: FileQuestion, title: '60 Questions', desc: 'Covers all 6 exam domains weighted by official exam percentages.' },
          { icon: BarChart3, title: 'Detailed Results', desc: 'Get domain-by-domain breakdown with correct answers and explanations.' },
        ].map((card) => (
          <div
            key={card.title}
            className="p-6 rounded-[20px] border"
            style={{
              backgroundColor: 'var(--surface-base)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <card.icon size={40} style={{ color: 'var(--accent-primary)' }} className="mb-4" />
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
              {card.title}
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Domain Distribution */}
      <div
        className="w-full max-w-[600px] mb-10"
      >
        <h3 className="text-sm font-semibold uppercase tracking-[0.06em] mb-4" style={{ color: 'var(--text-tertiary)' }}>
          Domain Distribution
        </h3>
        <div className="space-y-3">
          {domainDistribution.map((d) => {
            const domainInfo = domains.find((dm) => dm.id === d.domain);
            return (
              <div
                key={d.domain}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Domain {d.domain}: {domainInfo?.shortName ?? d.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      ~{d.count} questions
                    </span>
                    <span className="text-xs font-semibold" style={{ color: 'var(--accent-amber)' }}>
                      {domainInfo?.weight}%
                    </span>
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-subtle)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ background: 'var(--accent-gradient)', width: `${domainInfo?.weight ?? 0}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={onStart}
        className="px-10 py-4 rounded-xl text-xl font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
        style={{
          backgroundColor: 'var(--accent-primary)',
          color: '#fff',
          fontFamily: 'var(--font-body)',
        }}
      >
        Start Practice Exam
      </button>

      <p
        className="mt-6 text-sm text-center max-w-md"
        style={{ color: 'var(--text-tertiary)' }}
      >
        This practice exam is designed to simulate the KCSA certification experience.
        Questions are based on official exam objectives and industry best practices.
      </p>
    </div>
  );
}

// Mode 2: Exam In Progress
function ExamInProgress({
  questions,
  onFinish,
}: {
  questions: ExamQuestion[];
  onFinish: (answers: (number | null)[], flagged: boolean[], timeSpent: number) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [flagged, setFlagged] = useState<boolean[]>(new Array(questions.length).fill(false));
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME);
  const [submitted, setSubmitted] = useState<boolean[]>(new Array(questions.length).fill(false));
  const [showReview, setShowReview] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // const [hintRevealed, setHintRevealed] = useState(false);
  // const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer
  const answersRef = useRef(answers);
  const flaggedRef = useRef(flagged);
  const onFinishRef = useRef(onFinish);
  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { flaggedRef.current = flagged; }, [flagged]);
  useEffect(() => { onFinishRef.current = onFinish; }, [onFinish]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current != null) { clearInterval(timerRef.current); }
          onFinishRef.current(answersRef.current, flaggedRef.current, TOTAL_TIME);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current != null) { clearInterval(timerRef.current); }
    };
  }, []);

  const handleFinish = useCallback(() => {
    if (timerRef.current != null) { clearInterval(timerRef.current); }
    onFinish(answers, flagged, TOTAL_TIME - timeRemaining);
  }, [answers, flagged, timeRemaining, onFinish]);

  const handleSelect = useCallback((optionIndex: number) => {
    if (submitted[currentIndex]) {return;}
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);
  }, [submitted, currentIndex, answers]);

  const handleSubmit = useCallback(() => {
    if (answers[currentIndex] === null) {return;}
    const newSubmitted = [...submitted];
    newSubmitted[currentIndex] = true;
    setSubmitted(newSubmitted);
  }, [answers, currentIndex, submitted]);

  const toggleFlag = useCallback((index: number) => {
    const newFlagged = [...flagged];
    newFlagged[index] = !newFlagged[index];
    setFlagged(newFlagged);
  }, [flagged]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '4') {
        const optIndex = parseInt(e.key, 10) - 1;
        if (optIndex < questions[currentIndex].options.length) {
          handleSelect(optIndex);
        }
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFlag(currentIndex);
      } else if (e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N') {
        if (currentIndex < questions.length - 1) {setCurrentIndex((p) => p + 1);}
      } else if (e.key === 'ArrowLeft' || e.key === 'p' || e.key === 'P') {
        if (currentIndex > 0) {setCurrentIndex((p) => p - 1);}
      } else if (e.key === 'Enter') {
        if (!submitted[currentIndex] && answers[currentIndex] !== null) {
          handleSubmit();
        } else if (submitted[currentIndex] && currentIndex < questions.length - 1) {
          setCurrentIndex((p) => p + 1);
        }
      } else if (e.key === 'r' || e.key === 'R') {
        setShowReview(true);
      } else if (e.key === 'Escape') {
        setShowReview(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, answers, submitted, questions, handleSelect, handleSubmit, toggleFlag]);

  const goToQuestion = (index: number) => {
    setCurrentIndex(index);
    setShowReview(false);
  };

  const question = questions[currentIndex];
  const isWarning = timeRemaining <= WARNING_TIME;
  const answeredCount = answers.filter((a) => a !== null).length;

  return (
    <div className="min-h-[calc(100dvh-60px)] flex flex-col">
      {/* Top Bar */}
      <div
        className="sticky top-[60px] z-10 h-[52px] flex items-center justify-between px-4 md:px-8 border-b"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          backdropFilter: 'blur(12px)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          Question {currentIndex + 1} of {questions.length}
        </span>

        <div className={`flex items-center gap-2 font-mono text-lg ${isWarning ? 'animate-pulse' : ''}`}>
          <Timer size={16} style={{ color: isWarning ? 'var(--accent-coral)' : 'var(--text-secondary)' }} />
          <span style={{ color: isWarning ? 'var(--accent-coral)' : 'var(--text-primary)' }}>
            {formatTime(timeRemaining)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFlag(currentIndex)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 min-h-[36px]"
            style={{
              color: flagged[currentIndex] ? 'var(--accent-coral)' : 'var(--text-secondary)',
              backgroundColor: flagged[currentIndex] ? 'rgba(232,122,93,0.1)' : 'transparent',
            }}
          >
            {flagged[currentIndex] ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            <span className="hidden sm:inline">Flag</span>
          </button>
          <button
            onClick={() => setShowReview(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 min-h-[36px]"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Eye size={16} />
            <span className="hidden sm:inline">Review</span>
          </button>
          {sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 min-h-[36px]"
              style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--surface-elevated)' }}
              title="Show sidebar"
            >
              <Grid3X3 size={16} />
              <span className="hidden sm:inline">Menu</span>
            </button>
          )}
          <button
            onClick={() => setShowMobileNav(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 min-h-[36px]"
            style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--surface-elevated)' }}
          >
            <Grid3X3 size={16} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Question Area */}
        <div className="flex-1 p-4 md:p-8">
          {showReview ? (
            <ReviewPanel
              key="review"
              questions={questions}
              answers={answers}
              flagged={flagged}
              onGoTo={goToQuestion}
              onFinish={handleFinish}
              onClose={() => setShowReview(false)}
            />
          ) : (
            <div
              className="max-w-[720px] mx-auto"
            >
              {/* Question Card */}
              <div
                className="rounded-[28px] border p-6 md:p-8"
                style={{
                  backgroundColor: 'var(--surface-base)',
                  borderColor: 'var(--border-subtle)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                }}
              >
                {/* Badges */}
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: 'rgba(4,80,54,0.1)',
                      color: 'var(--accent-primary)',
                    }}
                  >
                    Q{question.id}
                  </span>
                  <span
                    className="text-xs font-medium px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: 'var(--accent-lavender-soft)',
                      color: 'var(--accent-lavender)',
                    }}
                  >
                    Domain {question.domain}: {question.domainName}
                  </span>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded"
                    style={(() => {
                      const backgroundColor = (() => {
                        if (question.difficulty === 'Easy') { return 'rgba(10,123,62,0.1)' }
                        if (question.difficulty === 'Medium') { return 'rgba(242,196,77,0.15)' }
                        return 'rgba(232,122,93,0.1)'
                      })()
                      const color = (() => {
                        if (question.difficulty === 'Easy') { return 'var(--success)' }
                        if (question.difficulty === 'Medium') { return 'var(--warning)' }
                        return 'var(--danger)'
                      })()
                      return { backgroundColor, color }
                    })()}
                  >
                    {question.difficulty}
                  </span>
                </div>

                {/* Question Text */}
                <h2
                  className="text-xl font-semibold mb-4 leading-relaxed"
                  style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
                >
                  {question.question}
                </h2>

                {/* Code Snippet */}
                {question.codeSnippet != null && (
                  <pre
                    className="p-4 rounded-xl mb-6 overflow-x-auto"
                    style={{
                      backgroundColor: 'var(--surface-code)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      color: 'var(--text-primary)',
                    }}
                  >
                    <code>{question.codeSnippet}</code>
                  </pre>
                )}

                {/* Options */}
                <div className="space-y-3 mb-6">
                  {question.options.map((option, i) => {
                    const letter = String.fromCharCode(65 + i);
                    const isSelected = answers[currentIndex] === i;
                    const isSubmitted = submitted[currentIndex];
                    const isCorrect = question.correctAnswer === i;
                    const showCorrect = isSubmitted && isCorrect;
                    const showIncorrect = isSubmitted && isSelected && !isCorrect;

                    return (
                      <button
                        key={i}
                        onClick={() => handleSelect(i)}
                        disabled={isSubmitted}
                        className="w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-200"
                        style={(() => {
                          const borderColor = (() => {
                            if (showCorrect) { return 'var(--accent-sage)' }
                            if (showIncorrect) { return 'var(--accent-coral)' }
                            if (isSelected) { return 'var(--accent-primary)' }
                            return 'var(--border-medium)'
                          })()
                          const backgroundColor = (() => {
                            if (showCorrect) { return 'rgba(163,196,168,0.1)' }
                            if (showIncorrect) { return 'rgba(232,122,93,0.1)' }
                            if (isSelected) { return 'rgba(4,80,54,0.08)' }
                            return 'var(--surface-base)'
                          })()
                          return {
                            borderColor,
                            backgroundColor,
                            opacity: isSubmitted && !isSelected && !isCorrect ? 0.6 : 1,
                            cursor: isSubmitted ? 'default' : 'pointer',
                          }
                        })()}
                        onMouseEnter={(e) => {
                          if (!isSubmitted) {
                            (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-primary)';
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(4,80,54,0.05)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSubmitted) {
                            (e.currentTarget as HTMLElement).style.borderColor = isSelected
                              ? 'var(--accent-primary)'
                              : 'var(--border-medium)';
                            (e.currentTarget as HTMLElement).style.backgroundColor = isSelected
                              ? 'rgba(4,80,54,0.08)'
                              : 'var(--surface-base)';
                          }
                        }}
                      >
                        {/* Radio circle */}
                        <div
                          className="w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center"
                          style={(() => {
                            const borderColor = (() => {
                              if (showCorrect) { return 'var(--accent-sage)' }
                              if (showIncorrect) { return 'var(--accent-coral)' }
                              if (isSelected) { return 'var(--accent-primary)' }
                              return 'var(--border-medium)'
                            })()
                            const backgroundColor = (() => {
                              if (!isSelected && !showCorrect && !showIncorrect) { return 'transparent' }
                              if (showCorrect) { return 'var(--accent-sage)' }
                              if (showIncorrect) { return 'var(--accent-coral)' }
                              return 'var(--accent-primary)'
                            })()
                            return { borderColor, backgroundColor }
                          })()}
                        >
                          {(isSelected || showCorrect || showIncorrect) && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <div className="flex items-start gap-2 flex-1">
                          <span
                            className="font-mono text-sm font-medium flex-shrink-0"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {letter}.
                          </span>
                          <span className="text-sm md:text-base" style={{ color: 'var(--text-primary)' }}>
                            {option}
                          </span>
                        </div>
                        {showCorrect && <CheckCircle2 size={18} style={{ color: 'var(--accent-sage)' }} className="flex-shrink-0 mt-0.5" />}
                        {showIncorrect && <XCircle size={18} style={{ color: 'var(--accent-coral)' }} className="flex-shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {submitted[currentIndex] && (
                  <div
                    className="p-4 rounded-xl border-l-4 mb-6"
                    style={{
                      backgroundColor: 'rgba(4,80,54,0.05)',
                      borderLeftColor: 'var(--accent-sage)',
                    }}
                  >
                    <h4
                      className="text-sm font-semibold mb-2"
                      style={{ color: 'var(--accent-sage)' }}
                    >
                      Explanation
                    </h4>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                      {question.explanation}
                    </p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-40"
                    style={{
                      border: '1px solid var(--border-medium)',
                      color: 'var(--text-primary)',
                      backgroundColor: 'var(--surface-base)',
                    }}
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>

                  {(() => {
                    if (!submitted[currentIndex]) {
                      return (
                        <button
                          onClick={handleSubmit}
                          disabled={answers[currentIndex] === null}
                          className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-40 hover:scale-[1.02] active:scale-[0.98]"
                          style={{
                            backgroundColor: 'var(--accent-primary)',
                            color: '#fff',
                          }}
                        >
                          Submit Answer
                        </button>
                      )
                    }
                    if (currentIndex < questions.length - 1) {
                      return (
                        <button
                          onClick={() => setCurrentIndex((p) => p + 1)}
                          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                          style={{
                            backgroundColor: 'var(--accent-primary)',
                            color: '#fff',
                          }}
                        >
                          Next <ChevronRight size={16} />
                        </button>
                      )
                    }
                    return (
                      <button
                        onClick={handleFinish}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                          backgroundColor: 'var(--accent-coral)',
                          color: '#fff',
                        }}
                      >
                        <Flag size={14} /> Finish Exam
                      </button>
                    )
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Navigation */}
        <div
          className={`hidden lg:block border-l overflow-y-auto transition-all duration-300 ${sidebarCollapsed ? 'w-0 p-0 min-w-0 opacity-0 overflow-hidden' : 'w-[280px] p-4'}`}
          style={{
            backgroundColor: sidebarCollapsed ? 'transparent' : 'var(--surface-base)',
            borderColor: sidebarCollapsed ? 'transparent' : 'var(--border-subtle)',
            maxHeight: 'calc(100dvh - 112px)',
          }}
        >
          {/* Collapse Toggle */}
          <button
            onClick={() => setSidebarCollapsed(true)}
            className="self-end mb-2 p-1 rounded-md transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
            title="Collapse sidebar"
          >
            <X size={16} />
          </button>

          {/* Timer */}
          <div className="mb-4 p-3 rounded-xl" style={{ backgroundColor: 'var(--surface-elevated)' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Time Remaining
              </span>
              <span
                className="font-mono text-lg font-medium"
                style={{ color: isWarning ? 'var(--accent-coral)' : 'var(--accent-primary)' }}
              >
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Progress
              </span>
              <span className="text-xs font-medium" style={{ color: 'var(--accent-primary)' }}>
                {answeredCount}/{questions.length}
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-subtle)' }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / questions.length) * 100}%`, background: 'var(--accent-gradient)' }}
              />
            </div>
          </div>

          {/* Question Grid */}
          <div className="mb-4">
            <span className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>
              Question Grid
            </span>
            <div className="grid grid-cols-10 gap-1">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToQuestion(i)}
                  className="w-full aspect-square rounded-md text-xs font-medium transition-all duration-150 relative"
                  style={{
                    backgroundColor: answers[i] !== null ? 'var(--accent-primary)' : 'var(--surface-elevated)',
                    color: answers[i] !== null ? '#fff' : 'var(--text-secondary)',
                    border:
                      i === currentIndex
                        ? '2px solid var(--accent-primary)'
                        : '1px solid var(--border-subtle)',
                  }}
                >
                  {i + 1}
                  {flagged[i] && (
                    <div
                      className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                      style={{ backgroundColor: 'var(--accent-coral)' }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--accent-primary)' }} />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--surface-elevated)', border: '1px solid var(--border-medium)' }} />
              <span>Unanswered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--accent-coral)' }} />
              <span>Flagged</span>
            </div>
          </div>

          {/* Finish Button */}
          <button
            onClick={handleFinish}
            className="w-full mt-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
            style={{
              border: '1px solid var(--accent-coral)',
              color: 'var(--accent-coral)',
              backgroundColor: 'transparent',
            }}
          >
            Submit Exam
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {showMobileNav && (
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileNav(false)} />
            <div
              className="relative w-full max-h-[80vh] overflow-y-auto rounded-t-2xl p-4"
              style={{
                backgroundColor: 'var(--surface-base)',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Question Navigator
                </h3>
                <button
                  onClick={() => setShowMobileNav(false)}
                  className="p-1.5 rounded-md"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Timer */}
              <div className="mb-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--surface-elevated)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Time Remaining
                  </span>
                  <span
                    className="font-mono text-lg font-medium"
                    style={{ color: isWarning ? 'var(--accent-coral)' : 'var(--accent-primary)' }}
                  >
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Progress
                  </span>
                  <span className="text-xs font-medium" style={{ color: 'var(--accent-primary)' }}>
                    {answeredCount}/{questions.length}
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-subtle)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${(answeredCount / questions.length) * 100}%`, background: 'var(--accent-gradient)' }}
                  />
                </div>
              </div>

              {/* Question Grid */}
              <div className="mb-3">
                <span className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>
                  Question Grid
                </span>
                <div className="grid grid-cols-10 gap-1">
                  {questions.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { goToQuestion(i); setShowMobileNav(false); }}
                      className="w-full aspect-square rounded-md text-xs font-medium transition-all duration-150 relative"
                      style={{
                        backgroundColor: answers[i] !== null ? 'var(--accent-primary)' : 'var(--surface-elevated)',
                        color: answers[i] !== null ? '#fff' : 'var(--text-secondary)',
                        border:
                          i === currentIndex
                            ? '2px solid var(--accent-primary)'
                            : '1px solid var(--border-subtle)',
                      }}
                    >
                      {i + 1}
                      {flagged[i] && (
                        <div
                          className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                          style={{ backgroundColor: 'var(--accent-coral)' }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--accent-primary)' }} />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--surface-elevated)', border: '1px solid var(--border-medium)' }} />
                  <span>Unanswered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--accent-coral)' }} />
                  <span>Flagged</span>
                </div>
              </div>

              <button
                onClick={() => { setShowMobileNav(false); handleFinish(); }}
                className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
                style={{
                  backgroundColor: 'var(--accent-coral)',
                  color: '#fff',
                }}
              >
                Submit Exam
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Review Panel
function ReviewPanel({
  questions,
  answers,
  flagged,
  onGoTo,
  onFinish,
  onClose,
}: {
  questions: ExamQuestion[];
  answers: (number | null)[];
  flagged: boolean[];
  onGoTo: (index: number) => void;
  onFinish: () => void;
  onClose: () => void;
}) {
  const unanswered = answers.filter((a) => a === null).length;
  const flaggedCount = flagged.filter((f) => f).length;

  return (
    <div
      className="max-w-[720px] mx-auto"
    >
      <div
        className="rounded-[28px] border p-6 md:p-8"
        style={{
          backgroundColor: 'var(--surface-base)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <h2
            className="text-2xl font-normal"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Review Your Answers
          </h2>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm transition-colors duration-200"
            style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--surface-elevated)' }}
          >
            Back to Exam
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div
            className="px-4 py-3 rounded-xl flex-1"
            style={{ backgroundColor: 'rgba(242,196,77,0.1)' }}
          >
            <span className="text-2xl font-bold" style={{ color: 'var(--accent-amber)' }}>
              {unanswered}
            </span>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Unanswered
            </p>
          </div>
          <div
            className="px-4 py-3 rounded-xl flex-1"
            style={{ backgroundColor: 'rgba(232,122,93,0.1)' }}
          >
            <span className="text-2xl font-bold" style={{ color: 'var(--accent-coral)' }}>
              {flaggedCount}
            </span>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Flagged
            </p>
          </div>
          <div
            className="px-4 py-3 rounded-xl flex-1"
            style={{ backgroundColor: 'rgba(4,80,54,0.08)' }}
          >
            <span className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>
              {answers.filter((a) => a !== null).length}
            </span>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Answered
            </p>
          </div>
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => onGoTo(i)}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors duration-200"
              style={{
                backgroundColor: 'var(--surface-elevated)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <span
                className="text-sm font-mono font-medium w-8 flex-shrink-0"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                  {q.question}
                </p>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  {answers[i] !== null
                    ? `Selected: ${String.fromCharCode(65 + (answers[i] || 0))}`
                    : 'Not answered'}
                </span>
              </div>
              {flagged[i] && <Flag size={14} style={{ color: 'var(--accent-coral)' }} className="flex-shrink-0" />}
              {answers[i] !== null ? (
                <CheckCircle2 size={14} style={{ color: 'var(--accent-sage)' }} className="flex-shrink-0" />
              ) : (
                <AlertTriangle size={14} style={{ color: 'var(--accent-amber)' }} className="flex-shrink-0" />
              )}
            </button>
          ))}
        </div>

        <button
          onClick={onFinish}
          className="w-full mt-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02]"
          style={{
            backgroundColor: 'var(--accent-coral)',
            color: '#fff',
          }}
        >
          Submit Exam Now
        </button>
      </div>
    </div>
  );
}

// Mode 4: Results Screen
function ResultsScreen({
  questions,
  answers,
  flagged,
  timeSpent,
  onRetake,
}: {
  questions: ExamQuestion[];
  answers: (number | null)[];
  flagged: boolean[];
  timeSpent: number;
  onRetake: () => void;
}) {
  const [showReview, setShowReview] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'correct' | 'incorrect' | 'flagged'>('all');

  const correctCount = questions.reduce((acc, q, i) => {
    return acc + (answers[i] === q.correctAnswer ? 1 : 0);
  }, 0);
  const score = Math.round((correctCount / questions.length) * 100);
  const passed = score >= 75;

  // Domain breakdown
  const domainScores = useMemo(() => {
    const ds: Record<number, { correct: number; total: number; name: string }> = {};
    questions.forEach((q, i) => {
      ds[q.domain] ??= { correct: 0, total: 0, name: q.domainName };
      ds[q.domain].total++;
      if (answers[i] === q.correctAnswer) {
        ds[q.domain].correct++;
      }
    });
    return ds;
  }, [questions, answers]);

  // Weak areas (lowest 3)
  const weakAreas = Object.entries(domainScores)
    .map(([id, data]) => ({ domainId: parseInt(id, 10), ...data, pct: Math.round((data.correct / data.total) * 100) }))
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 3);

  // Save results
  useEffect(() => {
    const result: ExamResult = {
      score,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      timeSpentSeconds: timeSpent,
      completedAt: new Date().toISOString(),
      domainScores: Object.fromEntries(
        Object.entries(domainScores).map(([id, data]) => [id, { correct: data.correct, total: data.total }])
      ),
    };
    const existing = JSON.parse(localStorage.getItem('kcsa-practice-exams') ?? '[]');
    existing.push(result);
    localStorage.setItem('kcsa-practice-exams', JSON.stringify(existing));
  }, [score, questions.length, correctCount, timeSpent, domainScores]);

  if (showReview) {
    const filtered = questions.filter((q, i) => {
      if (reviewFilter === 'correct') {return answers[i] === q.correctAnswer;}
      if (reviewFilter === 'incorrect') {return answers[i] !== q.correctAnswer;}
      if (reviewFilter === 'flagged') {return flagged[i];}
      return true;
    });

    return (
      <div className="min-h-[calc(100dvh-60px)] px-4 py-8">
        <div className="max-w-[900px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1
              className="text-3xl font-normal"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              Question Review
            </h1>
            <button
              onClick={() => setShowReview(false)}
              className="px-4 py-2 rounded-lg text-sm"
              style={{ backgroundColor: 'var(--surface-elevated)', color: 'var(--text-secondary)' }}
            >
              Back to Results
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(['all', 'correct', 'incorrect', 'flagged'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setReviewFilter(f)}
                className="px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors duration-200"
                style={{
                  backgroundColor: reviewFilter === f ? 'var(--accent-primary)' : 'var(--surface-elevated)',
                  color: reviewFilter === f ? '#fff' : 'var(--text-secondary)',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filtered.map((q) => {
              const originalIndex = questions.findIndex((oq) => oq.id === q.id);
              const userAnswer = answers[originalIndex];
              const isCorrect = userAnswer === q.correctAnswer;
              return (
                <div
                  key={q.id}
                  className="p-6 rounded-[20px] border"
                  style={{
                    backgroundColor: 'var(--surface-base)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold px-2 py-1 rounded" style={{ backgroundColor: 'var(--accent-lavender-soft)', color: 'var(--accent-lavender)' }}>
                      Q{q.id}
                    </span>
                    {isCorrect ? (
                      <CheckCircle2 size={16} style={{ color: 'var(--accent-sage)' }} />
                    ) : (
                      <XCircle size={16} style={{ color: 'var(--accent-coral)' }} />
                    )}
                  </div>
                  <p className="text-base font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                    {q.question}
                  </p>
                  <div className="space-y-2 mb-4">
                    {q.options.map((opt, i) => {
                      const isUserChoice = userAnswer === i;
                      const isCorrectOpt = q.correctAnswer === i;
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-2 rounded-lg"
                          style={(() => {
                            const backgroundColor = (() => {
                              if (isCorrectOpt) { return 'rgba(163,196,168,0.1)' }
                              if (isUserChoice && !isCorrect) { return 'rgba(232,122,93,0.1)' }
                              return 'transparent'
                            })()
                            const border = (() => {
                              if (isCorrectOpt) { return '1px solid var(--accent-sage)' }
                              if (isUserChoice && !isCorrect) { return '1px solid var(--accent-coral)' }
                              return '1px solid transparent'
                            })()
                            return { backgroundColor, border }
                          })()}
                        >
                          <span className="font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {String.fromCharCode(65 + i)}.
                          </span>
                          <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                            {opt}
                          </span>
                          {isCorrectOpt && <CheckCircle2 size={14} style={{ color: 'var(--accent-sage)', marginLeft: 'auto' }} />}
                          {isUserChoice && !isCorrect && <XCircle size={14} style={{ color: 'var(--accent-coral)', marginLeft: 'auto' }} />}
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(4,80,54,0.05)' }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--accent-sage)' }}>Explanation</p>
                    <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-60px)] px-4 py-8">
      <div className="max-w-[720px] mx-auto">
        {/* Score Header */}
        <div
          className="text-center mb-10"
        >
          <div
            className="inline-block mb-4"
          >
            <span
              className="px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                backgroundColor: passed ? 'rgba(10,123,62,0.1)' : 'rgba(242,196,77,0.15)',
                color: passed ? 'var(--success)' : 'var(--warning)',
              }}
            >
              {passed ? 'PASSED' : 'NEEDS MORE STUDY'}
            </span>
          </div>

          <h1
            className="text-6xl md:text-7xl font-normal mb-2"
            style={{
              fontFamily: 'var(--font-display)',
              color: passed ? 'var(--accent-primary)' : 'var(--accent-coral)',
            }}
          >
            {score}%
          </h1>

          <p className="text-lg mb-2" style={{ color: 'var(--text-secondary)' }}>
            You answered {correctCount} out of {questions.length} questions correctly
          </p>
          <p className="text-sm font-mono" style={{ color: 'var(--text-tertiary)' }}>
            Time: {formatTime(timeSpent)} / {formatTime(TOTAL_TIME)}
          </p>
        </div>

        {/* Domain Breakdown */}
        <div
          className="mb-8"
        >
          <h2
            className="text-xl font-bold mb-4"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
          >
            Domain Breakdown
          </h2>
          <div className="space-y-4">
            {Object.entries(domainScores).map(([id, data]) => {
              const pct = Math.round((data.correct / data.total) * 100);
              return (
                <div
                  key={id}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      Domain {id}: {data.name}
                    </span>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {data.correct}/{data.total} correct ({pct}%)
                    </span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-subtle)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        background: pct >= 75
                          ? 'linear-gradient(90deg, var(--accent-sage), #5C9B6B)'
                          : 'linear-gradient(90deg, var(--accent-sage) 0%, var(--accent-sage)) var(--accent-coral)',
                        backgroundColor: pct >= 75 ? 'var(--accent-sage)' : 'var(--accent-coral)',
                        width: `${pct}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weak Areas */}
        {weakAreas.some((a) => a.pct < 75) && (
          <div
            className="mb-8 p-5 rounded-[20px] border-l-4"
            style={{
              backgroundColor: 'var(--surface-base)',
              borderColor: 'var(--border-subtle)',
              borderLeftColor: 'var(--accent-coral)',
            }}
          >
            <h3
              className="text-lg font-bold mb-3"
              style={{ color: 'var(--accent-coral)' }}
            >
              Focus Your Study
            </h3>
            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
              These domains need more attention:
            </p>
            <div className="space-y-2">
              {weakAreas.filter((a) => a.pct < 75).map((area) => (
                <div
                  key={area.domainId}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ backgroundColor: 'var(--surface-elevated)' }}
                >
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Domain {area.domainId}: {area.name}
                  </span>
                  <span className="text-sm font-medium" style={{ color: 'var(--accent-coral)' }}>
                    {area.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div
          className="flex flex-wrap gap-3 justify-center"
        >
          <button
            onClick={onRetake}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
            style={{
              border: '1px solid var(--border-medium)',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--surface-base)',
            }}
          >
            <RotateCcw size={16} /> Retake Exam
          </button>
          <button
            onClick={() => setShowReview(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: '#fff',
            }}
          >
            <Eye size={16} /> Review Answers
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== Main Practice Exam Page =====
type ExamMode = 'start' | 'exam' | 'results';

export default function PracticeExam() {
  const [mode, setMode] = useState<ExamMode>('start');
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [flagged, setFlagged] = useState<boolean[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);

  const handleStart = useCallback(() => {
    const shuffled = getShuffledQuestions();
    setQuestions(shuffled);

    setAnswers(new Array(shuffled.length).fill(null));
    setFlagged(new Array(shuffled.length).fill(false));
    setMode('exam');
  }, []);

  const handleFinish = useCallback(
    (finalAnswers: (number | null)[], finalFlagged: boolean[], spent: number) => {
      setAnswers(finalAnswers);
      setFlagged(finalFlagged);
      setTimeSpent(spent);
      setMode('results');
    },
    []
  );

  const handleRetake = useCallback(() => {
    setMode('start');
    setQuestions([]);
    setAnswers([]);
    setFlagged([]);
  }, []);

  return (
    <div>
      {mode === 'start' && (
        <div>
          <StartScreen onStart={handleStart} />
        </div>
      )}
      {mode === 'exam' && (
        <div>
          <ExamInProgress questions={questions} onFinish={handleFinish} />
        </div>
      )}
      {mode === 'results' && (
        <div>
          <ResultsScreen
            questions={questions}
            answers={answers}
            flagged={flagged}
            timeSpent={timeSpent}
            onRetake={handleRetake}
          />
        </div>
      )}
    </div>
  );
}
