import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, ChevronDown, ChevronUp, ArrowLeft, ArrowRight } from 'lucide-react'

export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

interface QuizCardProps {
  questions: QuizQuestion[]
  domainId: string
}

function useIsDark() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark')
    }
    return false
  })

  if (typeof window !== 'undefined') {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  }

  return isDark
}

export default function QuizCard({ questions, domainId }: QuizCardProps) {
  const isDark = useIsDark()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null))
  const [completed, setCompleted] = useState(false)
  const [score, setScore] = useState(0)

  const currentQuestion = questions[currentIndex]
  const isCorrect = selectedIndex === currentQuestion.correctIndex

  const handleSelect = useCallback((index: number) => {
    if (submitted) return
    setSelectedIndex(index)
  }, [submitted])

  const handleSubmit = useCallback(() => {
    if (selectedIndex === null) return
    setSubmitted(true)
    setShowExplanation(true)

    const newAnswers = [...answers]
    newAnswers[currentIndex] = selectedIndex
    setAnswers(newAnswers)

    if (currentIndex === questions.length - 1) {
      let correctCount = 0
      newAnswers.forEach((ans, idx) => {
        if (ans === questions[idx].correctIndex) correctCount++
      })
      setScore(correctCount)
      setCompleted(true)

      try {
        const stored = localStorage.getItem('kcsa-progress')
        const progress = stored ? JSON.parse(stored) : {}
        progress[`domain${domainId}`] = {
          quizCompleted: true,
          quizScore: correctCount,
          quizTotal: questions.length,
          completedAt: new Date().toISOString(),
        }
        localStorage.setItem('kcsa-progress', JSON.stringify(progress))
      } catch {
        // localStorage not available
      }
    }
  }, [selectedIndex, currentIndex, questions, answers, domainId])

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setSelectedIndex(answers[currentIndex + 1] ?? null)
      setSubmitted(false)
      setShowExplanation(false)
    }
  }, [currentIndex, answers, questions.length])

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setSelectedIndex(answers[currentIndex - 1] ?? null)
      setSubmitted(false)
      setShowExplanation(false)
    }
  }, [currentIndex, answers])

  const handleRestart = useCallback(() => {
    setCurrentIndex(0)
    setSelectedIndex(null)
    setSubmitted(false)
    setShowExplanation(false)
    setAnswers(new Array(questions.length).fill(null))
    setCompleted(false)
    setScore(0)
  }, [questions.length])

  const optionStyles = useMemo(() => {
    return currentQuestion.options.map((_, idx) => {
      if (submitted) {
        if (idx === currentQuestion.correctIndex) {
          return {
            borderColor: 'var(--success)',
            backgroundColor: isDark
              ? 'rgba(61, 217, 160, 0.1)'
              : 'rgba(10, 123, 62, 0.08)',
          }
        } else if (idx === selectedIndex && idx !== currentQuestion.correctIndex) {
          return {
            borderColor: 'var(--danger)',
            backgroundColor: isDark
              ? 'rgba(255, 107, 107, 0.1)'
              : 'rgba(212, 43, 30, 0.08)',
          }
        }
      } else if (idx === selectedIndex) {
        return {
          borderColor: 'var(--accent-primary)',
          backgroundColor: isDark
            ? 'rgba(61, 217, 160, 0.05)'
            : 'rgba(4, 80, 54, 0.05)',
        }
      }
      return {}
    })
  }, [submitted, selectedIndex, currentQuestion, isDark])

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: 'var(--surface-base)',
        border: '1px solid var(--border-subtle)',
        borderTop: '3px solid var(--accent-primary)',
      }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-xs font-semibold uppercase tracking-[0.06em]"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Question {currentIndex + 1} of {questions.length}
          </span>
          {completed && (
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'var(--page-bg)',
              }}
            >
              {score}/{questions.length}
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full mb-4" style={{ backgroundColor: 'var(--border-subtle)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--accent-gradient)' }}
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + (submitted ? 1 : 0)) / questions.length) * 100}%` }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          />
        </div>

        {/* Question */}
        <h3
          className="text-xl font-semibold leading-snug"
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {currentQuestion.question}
        </h3>
      </div>

      {/* Options */}
      <div className="px-6 pb-4 space-y-3">
        <AnimatePresence mode="wait">
          {currentQuestion.options.map((option, idx) => {
            const optStyle = optionStyles[idx] || {}
            const isDimmed = submitted && idx !== selectedIndex && idx !== currentQuestion.correctIndex

            return (
              <motion.button
                key={`${currentIndex}-${idx}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                onClick={() => handleSelect(idx)}
                disabled={submitted}
                className="w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-200 flex items-center gap-3"
                style={{
                  borderColor: 'var(--border-medium)',
                  backgroundColor: 'var(--surface-base)',
                  cursor: submitted ? 'default' : 'pointer',
                  opacity: isDimmed ? 0.6 : 1,
                  ...optStyle,
                }}
                whileHover={!submitted ? { scale: 1.01, borderColor: 'var(--accent-primary)' } : {}}
                whileTap={!submitted ? { scale: 0.99 } : {}}
              >
                {/* Option letter */}
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors duration-200"
                  style={{
                    backgroundColor: submitted && idx === currentQuestion.correctIndex
                      ? 'var(--success)'
                      : submitted && idx === selectedIndex
                        ? 'var(--danger)'
                        : idx === selectedIndex
                          ? 'var(--accent-primary)'
                          : 'var(--surface-elevated)',
                    color: submitted && (idx === currentQuestion.correctIndex || idx === selectedIndex)
                      ? '#fff'
                      : idx === selectedIndex
                        ? '#fff'
                        : 'var(--text-secondary)',
                    border: `1px solid ${submitted && idx === currentQuestion.correctIndex
                      ? 'var(--success)'
                      : submitted && idx === selectedIndex
                        ? 'var(--danger)'
                        : idx === selectedIndex
                          ? 'var(--accent-primary)'
                          : 'var(--border-medium)'}`,
                  }}
                >
                  {submitted && idx === currentQuestion.correctIndex ? (
                    <CheckCircle size={14} />
                  ) : submitted && idx === selectedIndex ? (
                    <XCircle size={14} />
                  ) : (
                    String.fromCharCode(65 + idx)
                  )}
                </span>

                {/* Option text */}
                <span
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {option}
                </span>
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="overflow-hidden"
          >
            <div
              className="mx-6 mb-4 p-4 rounded-xl"
              style={{
                backgroundColor: isCorrect
                  ? (isDark ? 'rgba(61, 217, 160, 0.06)' : 'rgba(10, 123, 62, 0.05)')
                  : (isDark ? 'rgba(255, 107, 107, 0.06)' : 'rgba(212, 43, 30, 0.05)'),
                border: `1px solid ${isCorrect
                  ? (isDark ? 'rgba(61, 217, 160, 0.2)' : 'rgba(10, 123, 62, 0.15)')
                  : (isDark ? 'rgba(255, 107, 107, 0.2)' : 'rgba(212, 43, 30, 0.15)')}`,
              }}
            >
              <button
                onClick={() => setShowExplanation(prev => !prev)}
                className="flex items-center gap-2 mb-2 w-full"
              >
                <span
                  className="text-sm font-semibold"
                  style={{ color: isCorrect ? 'var(--success)' : 'var(--danger)' }}
                >
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
                {showExplanation ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {currentQuestion.explanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer buttons */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          style={{
            color: currentIndex === 0 ? 'var(--text-tertiary)' : 'var(--text-secondary)',
            backgroundColor: 'var(--surface-elevated)',
            opacity: currentIndex === 0 ? 0.5 : 1,
            cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          <ArrowLeft size={16} />
          Previous
        </button>

        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={selectedIndex === null}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: selectedIndex !== null ? 'var(--accent-primary)' : 'var(--border-medium)',
              color: selectedIndex !== null ? '#fff' : 'var(--text-tertiary)',
              cursor: selectedIndex !== null ? 'pointer' : 'not-allowed',
            }}
          >
            Submit Answer
          </button>
        ) : completed ? (
          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: '#fff',
            }}
          >
            Restart Quiz
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
            Next
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </motion.div>
  )
}
