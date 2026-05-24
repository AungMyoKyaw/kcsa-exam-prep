import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Zap,
  RotateCcw,
  Filter,
  Keyboard,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { quickRecallCards, quickRecallCategories } from '@/data/quickRecallData';

export default function QuickRecall() {
  const [category, setCategory] = useState<string>('All');
  const [shuffled, setShuffled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const filteredCards = useMemo(() => {
    const base =
      category === 'All'
        ? quickRecallCards
        : quickRecallCards.filter((c) => c.category === category);
    if (shuffled) {
      const shuffledCopy = [...base];
      for (let i = shuffledCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledCopy[i], shuffledCopy[j]] = [shuffledCopy[j], shuffledCopy[i]];
      }
      return shuffledCopy;
    }
    return base;
  }, [category, shuffled]);

  const card = filteredCards[currentIndex];
  const total = filteredCards.length;

  const goNext = useCallback(() => {
    if (currentIndex < total - 1) {
      setFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, total]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const toggleFlip = useCallback(() => {
    setFlipped((prev) => !prev);
  }, []);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setFlipped(false);
  }, []);

  useEffect(() => {
    reset();
  }, [category, shuffled, reset]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') {
        e.preventDefault();
        toggleFlip();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [toggleFlip, goNext, goPrev]);

  return (
    <div
      className="min-h-[calc(100dvh-56px)] flex flex-col"
      style={{ backgroundColor: 'var(--surface-base)' }}
    >
      {/* Header */}
      <div className="px-4 py-4 md:px-8 md:py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 max-w-[900px] mx-auto">
          <div className="flex items-center gap-2">
            <Zap size={20} style={{ color: 'var(--accent-amber)' }} />
            <h1
              className="text-xl font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              Quick Recall
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category filter */}
            <div className="flex items-center gap-2">
              <Filter size={14} style={{ color: 'var(--text-tertiary)' }} />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger
                  className="h-8 text-sm w-[160px]"
                  style={{
                    backgroundColor: 'var(--surface-elevated)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {quickRecallCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Shuffle toggle */}
            <div className="flex items-center gap-2">
              <Shuffle size={14} style={{ color: 'var(--text-tertiary)' }} />
              <Switch
                checked={shuffled}
                onCheckedChange={setShuffled}
                className="data-[state=checked]:bg-[var(--accent-primary)]"
              />
              <span
                className="text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                Shuffle
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-6">
        <div className="w-full max-w-[720px]">
          {/* Progress */}
          <div className="flex items-center justify-between mb-4">
            <span
              className="text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              Card {currentIndex + 1} of {total}
            </span>
            <div
              className="flex-1 mx-4 h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: 'var(--border-subtle)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${total > 0 ? ((currentIndex + 1) / total) * 100 : 0}%`,
                  backgroundColor: 'var(--accent-primary)',
                }}
              />
            </div>
            <button
              onClick={reset}
              className="flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: 'var(--accent-primary)' }}
              title="Reset to start"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>

          {/* Flashcard */}
          <div
            className="relative cursor-pointer select-none"
            style={{ perspective: '1000px' }}
            onClick={toggleFlip}
            role="button"
            tabIndex={0}
            aria-label="Flashcard. Press space to flip."
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFlip();
              }
            }}
          >
            <div
              key={card?.id ?? 'empty'}
              className="relative"
            >
              {/* Front */}
              {!flipped && (
                <div
                  className="rounded-xl p-8 md:p-12 min-h-[320px] flex flex-col items-center justify-center text-center"
                  style={{
                    backgroundColor: 'var(--surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <span
                    className="text-xs font-semibold uppercase tracking-[0.06em] mb-6 px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: 'var(--surface-base)',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {card?.category ?? '—'}
                  </span>
                  <p
                    className="text-xl md:text-2xl font-medium leading-relaxed"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {card?.front ?? 'No cards available'}
                  </p>
                  <p
                    className="text-sm mt-8"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    Click or press Space to flip
                  </p>
                </div>
              )}

              {/* Back */}
              {flipped && (
                <div
                  className="rounded-xl p-8 md:p-12 min-h-[320px] flex flex-col items-center justify-center text-center"
                  style={{
                    backgroundColor: 'var(--surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <span
                    className="text-xs font-semibold uppercase tracking-[0.06em] mb-6 px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: 'var(--accent-lavender-soft)',
                      color: 'var(--accent-lavender)',
                    }}
                  >
                    Answer
                  </span>
                  <p
                    className="text-xl md:text-2xl font-medium leading-relaxed"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {card?.back ?? '—'}
                  </p>
                  {card?.hint && (
                    <div
                      className="mt-6 px-4 py-3 rounded-lg text-sm max-w-[90%]"
                      style={{
                        backgroundColor: 'rgba(130, 87, 229, 0.08)',
                        color: 'var(--accent-lavender)',
                        borderLeft: '3px solid var(--accent-lavender)',
                      }}
                    >
                      <span className="font-semibold">Hint:</span> {card.hint}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--surface-elevated)]"
              style={{
                backgroundColor: 'var(--surface-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <ChevronLeft size={16} />
              Prev
            </button>

            <button
              onClick={toggleFlip}
              className="px-6 py-2.5 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: '#fff',
              }}
            >
              {flipped ? 'Show Front' : 'Flip Card'}
            </button>

            <button
              onClick={goNext}
              disabled={currentIndex >= total - 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--surface-elevated)]"
              style={{
                backgroundColor: 'var(--surface-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Keyboard hint */}
          <div
            className="flex items-center justify-center gap-4 mt-4 text-xs"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <span className="flex items-center gap-1">
              <Keyboard size={12} />
              Space: Flip
            </span>
            <span>← →: Navigate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
