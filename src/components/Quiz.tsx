import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Award } from 'lucide-react';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizProps {
  questions: QuizQuestion[];
  domainId?: string;
  onComplete: (score: number) => void;
}

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function Quiz({ questions, domainId: _domainId, onComplete }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState<boolean[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);

  const question = questions[currentIndex];
  const isCorrect = selectedIndex === question.correctIndex;

  const handleSubmit = useCallback(() => {
    if (selectedIndex === null) return;
    const correct = selectedIndex === question.correctIndex;
    const newScores = [...scores, correct];
    setScores(newScores);
    setSubmitted(true);
    setShowExplanation(true);
  }, [selectedIndex, question.correctIndex, scores]);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      const finalScore = scores.filter(Boolean).length;
      setFinished(true);
      onComplete(finalScore);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedIndex(null);
      setSubmitted(false);
      setShowExplanation(false);
    }
  }, [currentIndex, questions.length, scores, onComplete]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setSubmitted(false);
    setScores([]);
    setShowExplanation(false);
    setFinished(false);
  }, []);

  if (finished) {
    const finalScore = scores.filter(Boolean).length;
    const percentage = Math.round((finalScore / questions.length) * 100);

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeOutExpo }}
        className="rounded-xl p-8 max-w-[720px] mx-auto"
        style={{
          backgroundColor: 'var(--surface-base)',
          border: '1px solid var(--border-subtle)',
          borderTop: '3px solid var(--accent-primary)',
        }}
      >
        <div className="text-center">
          <Award size={48} style={{ color: 'var(--accent-primary)' }} className="mx-auto mb-4" />
          <h3
            className="text-2xl font-normal mb-2"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Quiz Complete!
          </h3>
          <p className="text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
            You scored{' '}
            <span className="font-bold" style={{ color: 'var(--accent-primary)' }}>
              {finalScore}/{questions.length}
            </span>
          </p>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            {percentage >= 80
              ? 'Excellent! You are well prepared for this domain.'
              : percentage >= 60
              ? 'Good effort! Review the explanations to strengthen your understanding.'
              : 'Keep studying! Review the material and try again.'}
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: '#FFFFFF',
              }}
            >
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
      transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.3 }}
      className="rounded-xl max-w-[720px] mx-auto"
      style={{
        backgroundColor: 'var(--surface-base)',
        border: '1px solid var(--border-subtle)',
        borderTop: '3px solid var(--accent-primary)',
      }}
    >
      <div className="p-6 md:p-8">
        {/* Progress */}
        <div className="flex items-center justify-between mb-6">
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
            {scores.filter(Boolean).length} correct so far
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full mb-6" style={{ backgroundColor: 'var(--surface-elevated)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: 'var(--accent-primary)' }}
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + (submitted ? 1 : 0)) / questions.length) * 100}%` }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
          >
            {/* Question */}
            <h3
              className="text-lg font-semibold mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              {question.question}
            </h3>

            {/* Options */}
            <div className="flex flex-col gap-3 mb-6">
              {question.options.map((option, idx) => {
                let borderColor = 'var(--border-medium)';
                let bgColor = 'var(--surface-base)';
                let textColor = 'var(--text-primary)';

                if (submitted) {
                  if (idx === question.correctIndex) {
                    borderColor = 'var(--accent-sage)';
                    bgColor = 'rgba(163, 196, 168, 0.1)';
                    textColor = 'var(--accent-sage)';
                  } else if (idx === selectedIndex && idx !== question.correctIndex) {
                    borderColor = 'var(--accent-coral)';
                    bgColor = 'rgba(232, 122, 93, 0.1)';
                    textColor = 'var(--accent-coral)';
                  }
                } else if (idx === selectedIndex) {
                  borderColor = 'var(--accent-primary)';
                  bgColor = 'var(--accent-primary)';
                  bgColor = 'rgba(4, 80, 54, 0.08)';
                  textColor = 'var(--accent-primary)';
                }

                return (
                  <motion.button
                    key={idx}
                    onClick={() => !submitted && setSelectedIndex(idx)}
                    disabled={submitted}
                    whileHover={!submitted ? { scale: 1.01 } : {}}
                    whileTap={!submitted ? { scale: 0.99 } : {}}
                    className="flex items-center gap-3 text-left px-4 py-3.5 rounded-xl border transition-all duration-200"
                    style={{
                      borderColor,
                      backgroundColor: bgColor,
                      color: textColor,
                      cursor: submitted ? 'default' : 'pointer',
                      opacity: submitted && idx !== selectedIndex && idx !== question.correctIndex ? 0.6 : 1,
                    }}
                  >
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        backgroundColor: submitted
                          ? idx === question.correctIndex
                            ? 'rgba(163, 196, 168, 0.2)'
                            : idx === selectedIndex
                            ? 'rgba(232, 122, 93, 0.2)'
                            : 'var(--surface-elevated)'
                          : idx === selectedIndex
                          ? 'rgba(4, 80, 54, 0.15)'
                          : 'var(--surface-elevated)',
                        color: textColor,
                      }}
                    >
                      {submitted && idx === question.correctIndex ? (
                        <CheckCircle size={16} />
                      ) : submitted && idx === selectedIndex && idx !== question.correctIndex ? (
                        <XCircle size={16} />
                      ) : (
                        String.fromCharCode(65 + idx)
                      )}
                    </span>
                    <span className="text-sm leading-relaxed">{option}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {submitted && showExplanation && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden mb-6"
                >
                  <div
                    className="rounded-xl p-4"
                    style={{
                      backgroundColor: isCorrect
                        ? 'rgba(163, 196, 168, 0.08)'
                        : 'rgba(232, 122, 93, 0.08)',
                      border: `1px solid ${isCorrect ? 'rgba(163, 196, 168, 0.3)' : 'rgba(232, 122, 93, 0.3)'}`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle size={16} style={{ color: 'var(--accent-sage)' }} />
                      ) : (
                        <XCircle size={16} style={{ color: 'var(--accent-coral)' }} />
                      )}
                      <span
                        className="text-sm font-semibold"
                        style={{
                          color: isCorrect ? 'var(--accent-sage)' : 'var(--accent-coral)',
                        }}
                      >
                        {isCorrect ? 'Correct!' : 'Incorrect'}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                      {question.explanation}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex items-center justify-between">
              {!submitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={selectedIndex === null}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    backgroundColor:
                      selectedIndex !== null ? 'var(--accent-primary)' : 'var(--surface-elevated)',
                    color: selectedIndex !== null ? '#FFFFFF' : 'var(--text-tertiary)',
                    cursor: selectedIndex !== null ? 'pointer' : 'not-allowed',
                  }}
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                    color: '#FFFFFF',
                  }}
                >
                  {currentIndex + 1 >= questions.length ? 'See Results' : 'Next Question'}
                </button>
              )}

              {submitted && (
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="flex items-center gap-1 text-xs font-medium transition-colors duration-200"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {showExplanation ? (
                    <>
                      <ChevronUp size={14} /> Hide Explanation
                    </>
                  ) : (
                    <>
                      <ChevronDown size={14} /> Show Explanation
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
