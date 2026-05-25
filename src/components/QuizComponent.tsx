import { useState, useCallback, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Check, X, RotateCcw, ChevronDown, Square, CheckSquare, Eye } from 'lucide-react';
import {
  addXP,
  XP_VALUES,
  updateQuizStats,
  checkBadges,
  getQuizStats,
  getStudyStreak,
} from '@/lib/gamification';
import ConfettiOverlay, { useConfetti } from '@/components/Confetti';
import { useKeyboardShortcuts, KeyBadge } from '@/hooks/useKeyboardShortcuts';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number | number[];
  explanation: string;
  type?: 'single' | 'multiple';
}

interface QuizComponentProps {
  questions: QuizQuestion[];
  domainId: string;
}

function arraysEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort((x, y) => x - y);
  const sortedB = [...b].sort((x, y) => x - y);
  return sortedA.every((val, i) => val === sortedB[i]);
}

export default function QuizComponent({ questions, domainId }: QuizComponentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);
  const [hintRevealed, setHintRevealed] = useState(false);
  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { pieces, trigger } = useConfetti();

  const currentQuestion = questions[currentIndex];
  const isMulti = currentQuestion.type === 'multiple';
  const correctAnswers = Array.isArray(currentQuestion.correctIndex)
    ? currentQuestion.correctIndex
    : [currentQuestion.correctIndex];

  const handleSelect = useCallback((index: number) => {
    if (submitted) return;
    if (isMulti) {
      setSelectedIndices((prev) => {
        if (prev.includes(index)) {
          return prev.filter((i) => i !== index);
        }
        return [...prev, index];
      });
    } else {
      setSelectedIndices([index]);
    }
  }, [submitted, isMulti]);

  const isCorrect = useCallback(() => {
    if (selectedIndices.length === 0) return false;
    return arraysEqual(selectedIndices, correctAnswers);
  }, [selectedIndices, correctAnswers]);

  const handleSubmit = useCallback(() => {
    if (selectedIndices.length === 0) return;
    if (submitted) return; // prevent re-submitting and double-counting score
    setSubmitted(true);
    setShowExplanation(true);
    const newAnswered = new Set(answeredQuestions);
    newAnswered.add(currentIndex);
    setAnsweredQuestions(newAnswered);
    if (isCorrect()) {
      setScore((prev) => prev + 1);
    }
  }, [selectedIndices, currentIndex, answeredQuestions, isCorrect, submitted]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedIndices([]);
      setSubmitted(false);
      setShowExplanation(false);
    } else {
      // Score already includes the current question if it was submitted in handleSubmit
      // Don't double-count here
      const finalScore = score;
      const percentage = Math.round((finalScore / questions.length) * 100);
      setQuizComplete(true);
      // Save score to localStorage
      const key = `quiz-score-${domainId}`;
      localStorage.setItem(key, JSON.stringify({
        score: finalScore,
        total: questions.length,
        completedAt: new Date().toISOString(),
      }));

      // Award XP and check badges
      if (!xpAwarded) {
        const xp = percentage === 100 ? XP_VALUES.perfectQuiz : XP_VALUES.completeQuiz;
        addXP(xp);
        const stats = getQuizStats();
        const newStats = updateQuizStats({
          totalQuizzes: stats.totalQuizzes + 1,
          perfectQuizzes: stats.perfectQuizzes + (percentage === 100 ? 1 : 0),
        });
        checkBadges({
          totalQuizzes: newStats.totalQuizzes,
          perfectQuizzes: newStats.perfectQuizzes,
          streak: getStudyStreak(),
        });
        setXpAwarded(true);

        if (percentage >= 80) {
          trigger();
        }
      }
    }
  }, [currentIndex, questions.length, domainId, score, selectedIndices, correctAnswers, xpAwarded, trigger]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelectedIndices([]);
      setSubmitted(false);
      setShowExplanation(false);
    }
  }, [currentIndex]);

  const handleRetake = useCallback(() => {
    setCurrentIndex(0);
    setSelectedIndices([]);
    setSubmitted(false);
    setScore(0);
    setAnsweredQuestions(new Set());
    setShowExplanation(false);
    setQuizComplete(false);
    setXpAwarded(false);
    setHintRevealed(false);
    if (hintTimeoutRef.current) {
      clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = null;
    }
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    '1': () => { if (!submitted && currentQuestion.options.length > 0) handleSelect(0); },
    '2': () => { if (!submitted && currentQuestion.options.length > 1) handleSelect(1); },
    '3': () => { if (!submitted && currentQuestion.options.length > 2) handleSelect(2); },
    '4': () => { if (!submitted && currentQuestion.options.length > 3) handleSelect(3); },
    'enter': () => {
      if (!submitted && selectedIndices.length > 0) {
        handleSubmit();
      } else if (submitted) {
        handleNext();
      }
    },
    'space': () => {
      if (!submitted && selectedIndices.length > 0) {
        handleSubmit();
      } else if (submitted) {
        handleNext();
      }
    },
    '?': () => {
      if (submitted) return;
      setHintRevealed(true);
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = setTimeout(() => setHintRevealed(false), 2000);
    },
    'escape': () => {
      setShowExplanation(false);
      setHintRevealed(false);
      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current);
        hintTimeoutRef.current = null;
      }
    },
  });

  // Cleanup hint timeout on unmount
  useEffect(() => {
    return () => {
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    };
  }, []);

  if (quizComplete) {
    const finalScore = score;
    const percentage = Math.round((finalScore / questions.length) * 100);
    const isPassing = percentage >= 75;
    const isPerfect = percentage === 100;

    return (
      <>
        <ConfettiOverlay pieces={pieces} />
        <div
          className="rounded-xl p-8 max-w-[720px] mx-auto"
          style={{
            backgroundColor: 'var(--surface-base)',
            border: '1px solid var(--border-subtle)',
            borderTop: `3px solid ${isPerfect ? 'var(--warning)' : 'var(--accent-primary)'}`,
          }}
        >
          <div className="text-center">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{
                backgroundColor: isPassing
                  ? 'rgba(163,196,168,0.15)'
                  : 'rgba(232,122,93,0.15)',
              }}
            >
              {isPassing ? (
                <Check size={32} style={{ color: 'var(--accent-sage)' }} />
              ) : (
                <RotateCcw size={32} style={{ color: 'var(--accent-coral)' }} />
              )}
            </div>

            <h3
              className="text-xl font-semibold mb-2"
              style={{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)',
              }}
            >
              {isPerfect ? '🎉 Perfect Score!' : 'Quiz Complete!'}
            </h3>

            <div className="flex items-center justify-center gap-3 mb-4">
              <span
                className="text-4xl font-bold"
                style={{ color: 'var(--accent-primary)' }}
              >
                {finalScore}/{questions.length}
              </span>
              <span
                className="text-lg"
                style={{ color: 'var(--text-secondary)' }}
              >
                ({percentage}%)
              </span>
            </div>

            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-2"
              style={{
                backgroundColor: isPassing
                  ? 'rgba(163,196,168,0.15)'
                  : 'rgba(232,122,93,0.15)',
              }}
            >
              <span
                className="text-sm font-medium"
                style={{
                  color: isPassing ? 'var(--accent-sage)' : 'var(--accent-coral)',
                }}
              >
                {isPerfect
                  ? 'Incredible! You nailed every question!'
                  : isPassing
                  ? 'Passing score! Great job!'
                  : "Keep studying - you'll get there!"}
              </span>
            </div>

            {!xpAwarded && (
              <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>
                +{isPerfect ? XP_VALUES.perfectQuiz : XP_VALUES.completeQuiz} XP earned
              </p>
            )}

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleRetake}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-90"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: 'var(--surface-base)',
                }}
              >
                <RotateCcw size={16} />
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Partial feedback calculation
  const correctSelected = selectedIndices.filter((s) => correctAnswers.includes(s)).length;
  const incorrectSelected = selectedIndices.filter((s) => !correctAnswers.includes(s)).length;
  const totalCorrect = correctAnswers.length;
  const isPartial = submitted && correctSelected > 0 && !isCorrect();

  return (
    <div
      className="rounded-xl max-w-[720px] mx-auto"
      style={{
        backgroundColor: 'var(--surface-base)',
        border: '1px solid var(--border-subtle)',
        borderTop: `3px solid var(--accent-primary)`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Question {currentIndex + 1} of {questions.length}
        </span>
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: 'rgba(4,80,54,0.08)',
            color: 'var(--accent-primary)',
          }}
        >
          Score: {score}/{answeredQuestions.size + (submitted ? 0 : 0)}
        </span>
      </div>

      {/* Question */}
      <div className="px-6 pt-6 pb-4">
        <h3
          key={currentQuestion.id}
          className="text-lg font-semibold leading-relaxed"
          style={{ color: 'var(--text-primary)' }}
        >
          {currentQuestion.question}
        </h3>
        {isMulti && (
          <p className="text-sm mt-1 font-medium" style={{ color: 'var(--accent-coral)' }}>
            Select ALL that apply
          </p>
        )}
      </div>

      {/* Options */}
      <div className="px-6 pb-4 space-y-2.5">
        <div
          key={currentQuestion.id}
          className="space-y-2.5"
        >
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedIndices.includes(index);
            const isCorrectOption = correctAnswers.includes(index);
            const showCorrect = submitted && isCorrectOption;
            const showIncorrect = submitted && isSelected && !isCorrectOption;
            const showMissed = submitted && isCorrectOption && !isSelected;
            const showHint = hintRevealed && isCorrectOption;

            let borderColor = 'var(--border-medium)';
            let bgColor = 'var(--surface-base)';

            if (showCorrect) {
              borderColor = 'var(--accent-sage)';
              bgColor = 'rgba(163,196,168,0.1)';
            } else if (showIncorrect) {
              borderColor = 'var(--accent-coral)';
              bgColor = 'rgba(232,122,93,0.1)';
            } else if (showMissed) {
              borderColor = 'var(--accent-sage)';
              bgColor = 'rgba(163,196,168,0.05)';
            } else if (showHint) {
              borderColor = 'var(--warning)';
              bgColor = 'rgba(242,196,77,0.1)';
            } else if (isSelected && !submitted) {
              borderColor = 'var(--accent-primary)';
              bgColor = 'rgba(4,80,54,0.08)';
            }

            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={submitted}
                className="w-full flex items-start gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200"
                style={{
                  border: `1.5px solid ${borderColor}`,
                  backgroundColor: bgColor,
                  cursor: submitted ? 'default' : 'pointer',
                  opacity: (submitted && !isSelected && !isCorrectOption) || (hintRevealed && !isCorrectOption) ? 0.6 : 1,
                }}
              >
                <div
                  className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center mt-0.5 text-xs font-semibold"
                  style={{
                    backgroundColor: (() => {
                      if (showCorrect) { return 'var(--accent-sage)' }
                      if (showIncorrect) { return 'var(--accent-coral)' }
                      if (showMissed) { return 'rgba(163,196,168,0.3)' }
                      if (showHint) { return 'var(--warning)' }
                      if (isSelected) { return 'var(--accent-primary)' }
                      return 'var(--surface-elevated)'
                    })(),
                    color: isSelected || showCorrect || showIncorrect || showHint
                      ? '#fff'
                      : showMissed
                      ? 'var(--accent-sage)'
                      : 'var(--text-secondary)',
                    border: `1px solid ${(() => {
                      if (showCorrect) { return 'var(--accent-sage)' }
                      if (showIncorrect) { return 'var(--accent-coral)' }
                      if (showMissed) { return 'var(--accent-sage)' }
                      if (showHint) { return 'var(--warning)' }
                      if (isSelected) { return 'var(--accent-primary)' }
                      return 'var(--border-medium)'
                    })()}`,
                  }}
                >
                  {(() => {
                    if (showCorrect) { return <Check size={14} /> }
                    if (showIncorrect) { return <X size={14} /> }
                    if (showMissed) { return <Check size={14} /> }
                    if (showHint) { return <Eye size={14} /> }
                    if (isSelected) {
                      return isMulti ? <CheckSquare size={14} /> : <Check size={14} />;
                    }
                    return isMulti ? <Square size={14} /> : String.fromCharCode(65 + index);
                  })()}
                </div>
                <span
                  className="text-sm leading-relaxed flex-1"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {option}
                </span>
                {!submitted && !isMulti && index < 4 && (
                  <KeyBadge>{index + 1}</KeyBadge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Partial feedback */}
      {isPartial && (
        <div className="px-6 pb-2">
          <div
            className="rounded-lg px-4 py-2 text-sm font-medium"
            style={{
              backgroundColor: 'rgba(232,122,93,0.1)',
              color: 'var(--accent-coral)',
              border: '1px solid rgba(232,122,93,0.2)',
            }}
          >
            You got {correctSelected}/{totalCorrect} correct
            {incorrectSelected > 0 && ` (${incorrectSelected} wrong answer${incorrectSelected > 1 ? 's' : ''} selected)`}
          </div>
        </div>
      )}

      {/* Explanation */}
      {submitted && (
        <div className="overflow-hidden">
          <div
            className="mx-6 mb-4 rounded-lg px-4 py-3"
            style={{
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center justify-between w-full"
            >
              <span
                className="text-sm font-semibold"
                style={{ color: 'var(--accent-primary)' }}
              >
                Explanation
              </span>
              <div>
                <ChevronDown size={16} style={{ color: 'var(--text-secondary)' }} />
              </div>
            </button>
            {showExplanation && (
              <div className="overflow-hidden">
                <p
                  className="text-sm leading-relaxed pt-3"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {currentQuestion.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            color: 'var(--text-secondary)',
            backgroundColor: 'var(--surface-elevated)',
          }}
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={selectedIndices.length === 0}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: '#fff',
            }}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: '#fff',
            }}
          >
            {currentIndex === questions.length - 1 ? 'See Results' : 'Next'}
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
