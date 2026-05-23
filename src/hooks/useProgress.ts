import { useState, useEffect, useCallback } from 'react';

export interface ChapterProgress {
  read: boolean;
  scrollPercent: number;
}

interface DomainProgress {
  scrollPercent: number;
  quizCompleted: boolean;
  quizScore?: number;
  lastReadAt?: string;
  chapters?: Record<string, ChapterProgress>;
}

interface ProgressData {
  [domainId: string]: DomainProgress;
}

const STORAGE_KEY = 'kcsa-domain-progress';

function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {};
}

function saveProgress(data: ProgressData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

export function useProgress(domainId: string) {
  const [progress, setProgress] = useState<DomainProgress>(() => {
    const all = loadProgress();
    return all[domainId] || { scrollPercent: 0, quizCompleted: false, chapters: {} };
  });

  const updateScroll = useCallback((chapterIdOrPercent: string | number, maybePercent?: number) => {
    // Support both: updateScroll(percent) and updateScroll(chapterId, percent)
    const chapterId = typeof chapterIdOrPercent === 'string' ? chapterIdOrPercent : 'default';
    const percent = typeof maybePercent === 'number' ? maybePercent : chapterIdOrPercent as number;

    setProgress(prev => {
      const chapters = { ...prev.chapters };
      chapters[chapterId] = {
        ...(chapters[chapterId] || { read: false }),
        scrollPercent: Math.min(100, Math.round(percent as number)),
      };

      const next: DomainProgress = {
        ...prev,
        scrollPercent: Math.min(100, Math.round(percent as number)),
        chapters,
      };

      if (next.scrollPercent >= 90) {
        next.lastReadAt = new Date().toISOString();
        if (chapters[chapterId]) chapters[chapterId].read = true;
      }

      const all = loadProgress();
      all[domainId] = next;
      saveProgress(all);
      return next;
    });
  }, [domainId]);

  const markRead = useCallback((chapterId?: string) => {
    setProgress(prev => {
      const chapters = { ...prev.chapters };
      const id = chapterId || 'default';
      chapters[id] = { ...(chapters[id] || { scrollPercent: 0 }), read: true };

      const next: DomainProgress = {
        ...prev,
        scrollPercent: Math.max(prev.scrollPercent, 90),
        lastReadAt: new Date().toISOString(),
        chapters,
      };

      const all = loadProgress();
      all[domainId] = next;
      saveProgress(all);
      return next;
    });
  }, [domainId]);

  const completeQuiz = useCallback((score: number) => {
    setProgress(prev => {
      const next = { ...prev, quizCompleted: true, quizScore: score };
      const all = loadProgress();
      all[domainId] = next;
      saveProgress(all);
      return next;
    });
  }, [domainId]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        updateScroll((scrollTop / docHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateScroll]);

  return { progress, updateScroll, markRead, completeQuiz };
}
