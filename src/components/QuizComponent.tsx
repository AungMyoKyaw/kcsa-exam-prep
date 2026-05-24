import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, X, RotateCcw, ChevronDown } from 'lucide-react';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizComponentProps {
  questions: QuizQuestion[];
  domainId: string;
}

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function QuizComponent({ questions, domainId }: QuizComponentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleSelect = useCallback((index: number) => {
    if (submitted) {return;}
    setSelectedIndex(index);
  }, [submitted]);

  const handleSubmit = useCallback(() => {
    if (selectedIndex === null) {return;}
    setSubmitted(true);
    setShowExplanation(true);
    const newAnswered = new Set(answeredQuestions);
    newAnswered.add(currentIndex);
    setAnsweredQuestions(newAnswered);
    if (selectedIndex === currentQuestion.correctIndex) {
      setScore((prev) => prev + 1);
    }
  }, [selectedIndex, currentIndex, currentQuestion.correctIndex, answeredQuestions]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedIndex(null);
      setSubmitted(false);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
      // Save score to localStorage
      const key = `quiz-score-${domainId}`;
      localStorage.setItem(key, JSON.stringify({
        score: score + (selectedIndex === currentQuestion.correctIndex ? 1 : 0),
        total: questions.length,
        completedAt: new Date().toISOString(),
      }));
    }
  }, [currentIndex, questions.length, domainId, score, selectedIndex, currentQuestion.correctIndex]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelectedIndex(null);
      setSubmitted(false);
      setShowExplanation(false);
    }
  }, [currentIndex]);

  const handleRetake = useCallback(() => {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setSubmitted(false);
    setScore(0);
    setAnsweredQuestions(new Set());
    setShowExplanation(false);
    setQuizComplete(false);
  }, []);

  if (quizComplete) {
    const finalScore = score;
    const percentage = Math.round((finalScore / questions.length) * 100);
    const isPassing = percentage >= 75;

    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeOutExpo }}
        className="rounded-xl p-8 max-w-[720px] mx-auto"
        style={{
          backgroundColor: 'var(--surface-base)',
          border: '1px solid var(--border-subtle)',
          borderTop: `3px solid var(--accent-primary)`,
        }}
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.2 }}
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
          </motion.div>

          <h3
            className="text-xl font-semibold mb-2"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            Quiz Complete!
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
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
              {isPassing
                ? 'Passing score! Great job!'
                : 'Keep studying - you\'ll get there!'}
            </span>
          </div>

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
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: easeOutExpo }}
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
        <AnimatePresence mode="wait">
          <motion.h3
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
            className="text-lg font-semibold leading-relaxed"
            style={{ color: 'var(--text-primary)' }}
          >
            {currentQuestion.question}
          </motion.h3>
        </AnimatePresence>
      </div>

      {/* Options */}
      <div className="px-6 pb-4 space-y-2.5">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2.5"
          >
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedIndex === index;
              const isCorrect = index === currentQuestion.correctIndex;
              const showCorrect = submitted && isCorrect;
              const showIncorrect = submitted && isSelected && !isCorrect;

              let borderColor = 'var(--border-medium)';
              let bgColor = 'var(--surface-base)';

              if (showCorrect) {
                borderColor = 'var(--accent-sage)';
                bgColor = 'rgba(163,196,168,0.1)';
              } else if (showIncorrect) {
                borderColor = 'var(--accent-coral)';
                bgColor = 'rgba(232,122,93,0.1)';
              } else if (isSelected && !submitted) {
                borderColor = 'var(--accent-primary)';
                bgColor = 'rgba(4,80,54,0.08)';
              }

              return (
                <motion.button
                  key={index}
                  onClick={() => handleSelect(index)}
                  disabled={submitted}
                  className="w-full flex items-start gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200"
                  style={{
                    border: `1.5px solid ${borderColor}`,
                    backgroundColor: bgColor,
                    cursor: submitted ? 'default' : 'pointer',
                    opacity: submitted && !isSelected && !isCorrect ? 0.6 : 1,
                  }}
                  whileHover={!submitted ? { scale: 1.01, borderColor: 'var(--accent-primary)' } : {}}
                  whileTap={!submitted ? { scale: 0.99 } : {}}
                >
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 text-xs font-semibold"
                    style={{
                      backgroundColor: (() => {
                        if (showCorrect) { return 'var(--accent-sage)' }
                        if (showIncorrect) { return 'var(--accent-coral)' }
                        if (isSelected) { return 'var(--accent-primary)' }
                        return 'var(--surface-elevated)'
                      })(),
                      color: isSelected || showCorrect || showIncorrect
                        ? '#fff'
                        : 'var(--text-secondary)',
                      border: `1px solid ${(() => {
                        if (showCorrect) { return 'var(--accent-sage)' }
                        if (showIncorrect) { return 'var(--accent-coral)' }
                        if (isSelected) { return 'var(--accent-primary)' }
                        return 'var(--border-medium)'
                      })()}`,
                    }}
                  >
                    {(() => {
                      if (showCorrect) { return <Check size={14} /> }
                      if (showIncorrect) { return <X size={14} /> }
                      return String.fromCharCode(65 + index)
                    })()}
                  </div>
                  <span
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {option}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: easeOutExpo }}
            className="overflow-hidden"
          >
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
                <motion.div
                  animate={{ rotate: showExplanation ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={16} style={{ color: 'var(--text-secondary)' }} />
                </motion.div>
              </button>
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p
                      className="text-sm leading-relaxed pt-3"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {currentQuestion.explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            disabled={selectedIndex === null}
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
    </motion.div>
  );
}
