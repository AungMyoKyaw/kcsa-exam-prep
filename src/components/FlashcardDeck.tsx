import { useState, useCallback } from 'react';
import { Eye, Brain, RotateCcw, ChevronRight, Lightbulb } from 'lucide-react';

interface FlashcardItem {
  front: string;
  back: string;
  hint?: string;
}

interface FlashcardDeckProps {
  title: string;
  subtitle?: string;
  cards: FlashcardItem[];
}

export default function FlashcardDeck({ title, subtitle, cards }: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const currentCard = cards[currentIndex];

  const handleFlip = useCallback(() => {
    setFlipped((prev) => !prev);
  }, []);

  const handleNext = useCallback(() => {
    setFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length)
    }, 150)
  }, [cards.length])

  const handlePrev = useCallback(() => {
    setFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length)
    }, 150)
  }, [cards.length])

  return (
    <div
      className="rounded-xl overflow-hidden my-6"
      style={{
        backgroundColor: 'var(--surface-base)',
        border: '1px solid var(--border-subtle)',
        borderTop: '3px solid var(--accent-lavender)',
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center gap-3"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(130,87,229,0.1)' }}
        >
          <Brain size={16} style={{ color: 'var(--accent-lavender)' }} />
        </div>
        <div>
          <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h4>
          {subtitle && (
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              {subtitle}
            </p>
          )}
        </div>
        <div className="ml-auto text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
          {currentIndex + 1} / {cards.length}
        </div>
      </div>

      {/* Card */}
      <div className="px-5 py-6">
        <div
          className="relative cursor-pointer select-none"
          onClick={handleFlip}
          style={{ perspective: '800px' }}
        >
          <div
            className="rounded-xl px-6 py-8 text-center transition-all duration-300"
            style={{
              backgroundColor: flipped ? 'rgba(130,87,229,0.06)' : 'var(--surface-elevated)',
              border: '1.5px solid var(--border-subtle)',
              minHeight: '140px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {!flipped ? (
              <>
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs mb-3"
                  style={{ backgroundColor: 'rgba(130,87,229,0.08)', color: 'var(--accent-lavender)' }}
                >
                  <Eye size={12} />
                  Click to reveal
                </div>
                <p className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>
                  {currentCard.front}
                </p>
                {currentCard.hint && (
                  <p className="text-xs mt-3" style={{ color: 'var(--text-tertiary)' }}>
                    Hint: {currentCard.hint}
                  </p>
                )}
              </>
            ) : (
              <>
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs mb-3"
                  style={{ backgroundColor: 'rgba(163,196,168,0.12)', color: 'var(--accent-sage)' }}
                >
                  <Lightbulb size={12} />
                  Answer
                </div>
                <p className="text-lg font-semibold" style={{ color: 'var(--accent-primary)' }}>
                  {currentCard.back}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <button
          onClick={handlePrev}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{ backgroundColor: 'var(--surface-elevated)', color: 'var(--text-secondary)' }}
        >
          <ChevronRight size={14} className="rotate-180" />
          Prev
        </button>

        <button
          onClick={() => {
            setFlipped(false);
            setCurrentIndex(0);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <RotateCcw size={12} />
          Reset
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{ backgroundColor: 'var(--surface-elevated)', color: 'var(--text-secondary)' }}
        >
          Next
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
