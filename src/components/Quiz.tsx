import { useState, useCallback } from 'react';
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
    if (selectedIndex === null) {return;}
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
      <div
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
            {(() => {
              if (percentage >= 80) { return 'Excellent! You are well prepared for this domain.' }
              if (percentage >= 60) { return 'Good effort! Review the explanations to strengthen your understanding.' }
              return 'Keep studying! Review the material and try again.'
            })()}
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
      </div>
    );
  }

  return (
    <div
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
          <div
            className="h-full rounded-full"
            style={{ 
              backgroundColor: 'var(--accent-primary)',
              width: `${((currentIndex + (submitted ? 1 : 0)) / questions.length) * 100}%`,
            }}
          />
        </div>

        <div>
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
                bgColor = 'rgba(4, 80, 54, 0.08)';
                textColor = 'var(--accent-primary)';
              }

              return (
                <button
                  key={idx}
                  onClick={() => !submitted && setSelectedIndex(idx)}
                  disabled={submitted}
                  className="flex items-center gap-3 text-left px-4 py-4 rounded-xl border transition-all duration-200 min-h-[56px]"
                  style={{
                    borderColor,
                    backgroundColor: bgColor,
                    color: textColor,
                    cursor: submitted ? 'default' : 'pointer',
                    opacity: submitted && idx !== selectedIndex && idx !== question.correctIndex ? 0.6 : 1,
                  }}
                >
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: (() => {
                        if (submitted && idx === question.correctIndex) { return 'rgba(163, 196, 168, 0.2)' }
                        if (submitted && idx === selectedIndex) { return 'rgba(232, 122, 93, 0.2)' }
                        if (submitted) { return 'var(--surface-elevated)' }
                        if (idx === selectedIndex) { return 'rgba(4, 80, 54, 0.15)' }
                        return 'var(--surface-elevated)'
                      })(),
                      color: textColor,
                    }}
                  >
                    {(() => {
                      if (submitted && idx === question.correctIndex) { return <CheckCircle size={16} /> }
                      if (submitted && idx === selectedIndex && idx !== question.correctIndex) { return <XCircle size={16} /> }
                      return String.fromCharCode(65 + idx)
                    })()}
                  </span>
                  <span className="text-sm md:text-base leading-relaxed">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {submitted && showExplanation && (
            <div className="overflow-hidden mb-6">
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
            </div>
          )}

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
        </div>
      </div>
    </div>
  );
}
