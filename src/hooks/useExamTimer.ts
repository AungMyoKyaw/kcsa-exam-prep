import { useState, useEffect, useRef, useCallback } from 'react';

export interface ExamTimerState {
  timeRemaining: number;
  totalTime: number;
  isRunning: boolean;
  isWarning: boolean;
  isCritical: boolean;
  formattedTime: string;
  progressPercent: number;
}

export interface ExamTimerActions {
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: (newTotalTime?: number) => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Custom hook for exam countdown timer.
 *
 * Features:
 * - Countdown from a given total time in seconds
 * - Alerts via callback at 15 minutes and 5 minutes remaining
 * - Auto-fire callback when time reaches 0
 * - Pause / resume support
 */
export function useExamTimer(
  totalSeconds: number,
  onTimeUp: () => void,
  onAlert?: (remaining: number) => void
): [ExamTimerState, ExamTimerActions] {
  const [timeRemaining, setTimeRemaining] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTimeUpRef = useRef(onTimeUp);
  const onAlertRef = useRef(onAlert);
  const hasAlerted15Ref = useRef(false);
  const hasAlerted5Ref = useRef(false);
  const hasFiredTimeUpRef = useRef(false);

  useEffect(() => { onTimeUpRef.current = onTimeUp; }, [onTimeUp]);
  useEffect(() => { onAlertRef.current = onAlert; }, [onAlert]);

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clearTimer();
    hasAlerted15Ref.current = false;
    hasAlerted5Ref.current = false;
    hasFiredTimeUpRef.current = false;
    setIsRunning(true);
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsRunning(false);
          if (!hasFiredTimeUpRef.current) {
            hasFiredTimeUpRef.current = true;
            onTimeUpRef.current();
          }
          return 0;
        }
        const next = prev - 1;
        // 15-minute alert (900 seconds)
        if (next <= 900 && next > 899 && !hasAlerted15Ref.current) {
          hasAlerted15Ref.current = true;
          onAlertRef.current?.(900);
        }
        // 5-minute alert (300 seconds)
        if (next <= 300 && next > 299 && !hasAlerted5Ref.current) {
          hasAlerted5Ref.current = true;
          onAlertRef.current?.(300);
        }
        return next;
      });
    }, 1000);
  }, [clearTimer]);

  const pause = useCallback(() => {
    clearTimer();
    setIsRunning(false);
  }, [clearTimer]);

  const resume = useCallback(() => {
    if (timeRemaining > 0 && !isRunning) {
      start();
    }
  }, [timeRemaining, isRunning, start]);

  const reset = useCallback(
    (newTotalTime?: number) => {
      clearTimer();
      hasAlerted15Ref.current = false;
      hasAlerted5Ref.current = false;
      hasFiredTimeUpRef.current = false;
      const nextTotal = newTotalTime ?? totalSeconds;
      setTimeRemaining(nextTotal);
      setIsRunning(false);
    },
    [clearTimer, totalSeconds]
  );

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  const isWarning = timeRemaining <= 15 * 60 && timeRemaining > 5 * 60;
  const isCritical = timeRemaining <= 5 * 60;
  const progressPercent = ((totalSeconds - timeRemaining) / totalSeconds) * 100;

  const state: ExamTimerState = {
    timeRemaining,
    totalTime: totalSeconds,
    isRunning,
    isWarning,
    isCritical,
    formattedTime: formatTime(timeRemaining),
    progressPercent,
  };

  const actions: ExamTimerActions = {
    start,
    pause,
    resume,
    reset,
  };

  return [state, actions];
}

export default useExamTimer;
