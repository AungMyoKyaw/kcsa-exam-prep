import { useEffect, useState } from 'react';
import { Lightbulb, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { examQuestions } from '@/data/examQuestions';
import {
  resetDailyChallengeIfNeeded,
  isDailyChallengeAnswered,
  wasDailyChallengeCorrect,
  setDailyChallengeAnswered,
  addXP,
  XP_VALUES,
  checkBadges,
  getStudyStreak,
} from '@/lib/gamification';

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getDailyQuestionIndex(): number {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return Math.floor(seededRandom(seed) * examQuestions.length);
}

export default function DailyChallenge() {
  const [question] = useState(() => examQuestions[getDailyQuestionIndex()]);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [xpEarned, setXpEarned] = useState(false);

  useEffect(() => {
    resetDailyChallengeIfNeeded();
    setAnswered(isDailyChallengeAnswered());
    setCorrect(wasDailyChallengeCorrect());
  }, []);

  const handleAnswer = (index: number) => {
    if (answered) return;
    setSelectedIndex(index);
    const isCorrect = index === question.correctAnswer;
    setCorrect(isCorrect);
    setAnswered(true);
    setDailyChallengeAnswered(isCorrect);
    if (!xpEarned) {
      addXP(isCorrect ? XP_VALUES.dailyChallenge : Math.floor(XP_VALUES.dailyChallenge / 2));
      setXpEarned(true);
      checkBadges({ streak: getStudyStreak() });
    }
  };

  return (
    <div
      className="rounded-xl border p-5"
      style={{
        backgroundColor: 'var(--surface-base)',
        borderColor: 'var(--border-subtle)',
        borderTop: '3px solid var(--warning)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: 'rgba(154, 103, 0, 0.1)' }}
        >
          <Lightbulb size={16} style={{ color: 'var(--warning)' }} />
        </div>
        <div>
          <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Question of the Day
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            New challenge every 24 hours
          </p>
        </div>
        {answered && (
          <div className="ml-auto">
            {correct ? (
              <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
            ) : (
              <XCircle size={18} style={{ color: 'var(--accent-coral)' }} />
            )}
          </div>
        )}
      </div>

      <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
        {question.question}
      </p>

      <div className="flex flex-col gap-2">
        {question.options.map((option, idx) => {
          let bg = 'var(--surface-base)';
          let border = 'var(--border-subtle)';
          let color = 'var(--text-primary)';

          if (answered) {
            if (idx === question.correctAnswer) {
              bg = 'rgba(163, 196, 168, 0.1)';
              border = 'var(--accent-sage)';
              color = 'var(--accent-sage)';
            } else if (idx === selectedIndex && idx !== question.correctAnswer) {
              bg = 'rgba(232, 122, 93, 0.1)';
              border = 'var(--accent-coral)';
              color = 'var(--accent-coral)';
            }
          } else if (idx === selectedIndex) {
            border = 'var(--accent-primary)';
            bg = 'rgba(4, 80, 54, 0.05)';
          }

          return (
            <button
              key={idx}
              disabled={answered}
              onClick={() => handleAnswer(idx)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left text-sm transition-all duration-200"
              style={{ backgroundColor: bg, borderColor: border, color, cursor: answered ? 'default' : 'pointer' }}
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: answered && idx === question.correctAnswer ? 'var(--accent-sage)' : 'var(--surface-elevated)', color: answered && idx === question.correctAnswer ? '#fff' : 'inherit' }}
              >
                {answered && idx === question.correctAnswer ? (
                  <CheckCircle2 size={14} />
                ) : answered && idx === selectedIndex && idx !== question.correctAnswer ? (
                  <XCircle size={14} />
                ) : (
                  String.fromCharCode(65 + idx)
                )}
              </span>
              <span>{option}</span>
              <ChevronRight size={14} className="ml-auto flex-shrink-0" style={{ opacity: 0.5 }} />
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          className="mt-3 p-3 rounded-lg text-sm"
          style={{
            backgroundColor: correct ? 'rgba(163, 196, 168, 0.08)' : 'rgba(232, 122, 93, 0.08)',
            border: `1px solid ${correct ? 'rgba(163, 196, 168, 0.3)' : 'rgba(232, 122, 93, 0.3)'}`,
            color: 'var(--text-secondary)',
          }}
        >
          {question.explanation}
        </div>
      )}
    </div>
  );
}
