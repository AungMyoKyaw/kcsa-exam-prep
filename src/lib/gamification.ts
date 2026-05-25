// Gamification utilities for KCSA Exam Prep App
// All state stored in localStorage

// ── Study Streak ──
const STREAK_KEY = 'study-streak';
const LAST_DATE_KEY = 'last-study-date';

export function getStudyStreak(): number {
  const raw = localStorage.getItem(STREAK_KEY);
  return raw ? parseInt(raw, 10) || 0 : 0;
}

export function getLastStudyDate(): string | null {
  return localStorage.getItem(LAST_DATE_KEY);
}

export function checkAndUpdateStreak(): number {
  const now = new Date();
  const today = now.toDateString();
  const lastDate = getLastStudyDate();

  if (lastDate === today) {
    return getStudyStreak();
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  let streak = getStudyStreak();
  if (lastDate === yesterdayStr) {
    streak += 1;
  } else {
    streak = 1;
  }

  localStorage.setItem(STREAK_KEY, String(streak));
  localStorage.setItem(LAST_DATE_KEY, today);
  return streak;
}

// ── XP / Level System ──
const XP_KEY = 'kcsa-xp';

export interface LevelInfo {
  name: string;
  min: number;
  max: number;
  color: string;
}

export const LEVELS: LevelInfo[] = [
  { name: 'Novice', min: 0, max: 100, color: '#6a737d' },
  { name: 'Apprentice', min: 100, max: 300, color: '#0969da' },
  { name: 'Journeyman', min: 300, max: 600, color: '#1a7f37' },
  { name: 'Expert', min: 600, max: 1000, color: '#8257e5' },
  { name: 'Master', min: 1000, max: Infinity, color: '#cf222e' },
];

export function getXP(): number {
  const raw = localStorage.getItem(XP_KEY);
  return raw ? parseInt(raw, 10) || 0 : 0;
}

export function addXP(amount: number): number {
  const current = getXP();
  const next = current + amount;
  localStorage.setItem(XP_KEY, String(next));
  return next;
}

export function getLevel(xp: number): LevelInfo {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].min) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getNextLevel(xp: number): LevelInfo | null {
  const current = getLevel(xp);
  const idx = LEVELS.indexOf(current);
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}

export function getXPToNext(xp: number): number {
  const next = getNextLevel(xp);
  if (!next) return 0;
  return Math.max(0, next.min - xp);
}

export function getProgressToNext(xp: number): number {
  const current = getLevel(xp);
  const next = getNextLevel(xp);
  if (!next) return 100;
  const range = next.min - current.min;
  const earned = xp - current.min;
  return Math.min(100, Math.round((earned / range) * 100));
}

// XP values
export const XP_VALUES = {
  readSection: 10,
  completeQuiz: 20,
  flashcard: 5,
  dailyChallenge: 15,
  perfectQuiz: 50,
} as const;

// ── Badges ──
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji
  unlockedAt?: string;
}

const BADGES_KEY = 'kcsa-badges';

export const ALL_BADGES: Badge[] = [
  { id: 'first-quiz', name: 'First Quiz Complete', description: 'Completed your first quiz', icon: '🏆' },
  { id: 'port-master', name: 'Port Master', description: 'Answered all port questions correctly', icon: '🔌' },
  { id: 'security-expert', name: 'Security Expert', description: 'Completed all 6 domains', icon: '🛡️' },
  { id: 'perfect-score', name: 'Perfect Score', description: 'Got 100% on a quiz', icon: '⭐' },
  { id: 'daily-streak-7', name: 'Week Warrior', description: 'Studied 7 days in a row', icon: '🔥' },
  { id: 'daily-streak-30', name: 'Monthly Master', description: 'Studied 30 days in a row', icon: '📅' },
  { id: 'flashcard-whiz', name: 'Flashcard Whiz', description: 'Reviewed 50 flashcards', icon: '💡' },
  { id: 'quiz-addict', name: 'Quiz Addict', description: 'Completed 10 quizzes', icon: '🧠' },
];

export function getUnlockedBadges(): Badge[] {
  const raw = localStorage.getItem(BADGES_KEY);
  try {
    const ids: string[] = raw ? JSON.parse(raw) : [];
    return ALL_BADGES.filter((b) => ids.includes(b.id));
  } catch {
    return [];
  }
}

export function getBadgeIds(): string[] {
  const raw = localStorage.getItem(BADGES_KEY);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function unlockBadge(id: string): boolean {
  const ids = getBadgeIds();
  if (ids.includes(id)) return false;
  ids.push(id);
  localStorage.setItem(BADGES_KEY, JSON.stringify(ids));
  return true;
}

export function checkBadges(conditions: { portQuestionsRight?: number; completedDomains?: number; perfectQuizzes?: number; flashcardsReviewed?: number; totalQuizzes?: number; streak?: number }) {
  const newBadges: string[] = [];

  if (conditions.totalQuizzes && conditions.totalQuizzes >= 1) {
    if (unlockBadge('first-quiz')) newBadges.push('first-quiz');
  }
  if (conditions.portQuestionsRight && conditions.portQuestionsRight >= 5) {
    if (unlockBadge('port-master')) newBadges.push('port-master');
  }
  if (conditions.completedDomains && conditions.completedDomains >= 6) {
    if (unlockBadge('security-expert')) newBadges.push('security-expert');
  }
  if (conditions.perfectQuizzes && conditions.perfectQuizzes >= 1) {
    if (unlockBadge('perfect-score')) newBadges.push('perfect-score');
  }
  if (conditions.flashcardsReviewed && conditions.flashcardsReviewed >= 50) {
    if (unlockBadge('flashcard-whiz')) newBadges.push('flashcard-whiz');
  }
  if (conditions.totalQuizzes && conditions.totalQuizzes >= 10) {
    if (unlockBadge('quiz-addict')) newBadges.push('quiz-addict');
  }
  if (conditions.streak && conditions.streak >= 7) {
    if (unlockBadge('daily-streak-7')) newBadges.push('daily-streak-7');
  }
  if (conditions.streak && conditions.streak >= 30) {
    if (unlockBadge('daily-streak-30')) newBadges.push('daily-streak-30');
  }

  return newBadges;
}

// ── Daily Challenge ──
const DAILY_CHALLENGE_KEY = 'daily-challenge-date';
const DAILY_ANSWERED_KEY = 'daily-challenge-answered';
const DAILY_CORRECT_KEY = 'daily-challenge-correct';

export function getDailyChallengeDate(): string | null {
  return localStorage.getItem(DAILY_CHALLENGE_KEY);
}

export function isDailyChallengeAnswered(): boolean {
  return localStorage.getItem(DAILY_ANSWERED_KEY) === 'true';
}

export function wasDailyChallengeCorrect(): boolean {
  return localStorage.getItem(DAILY_CORRECT_KEY) === 'true';
}

export function setDailyChallengeAnswered(correct: boolean) {
  localStorage.setItem(DAILY_ANSWERED_KEY, 'true');
  localStorage.setItem(DAILY_CORRECT_KEY, String(correct));
}

export function resetDailyChallengeIfNeeded() {
  const today = new Date().toDateString();
  const saved = getDailyChallengeDate();
  if (saved !== today) {
    localStorage.setItem(DAILY_CHALLENGE_KEY, today);
    localStorage.removeItem(DAILY_ANSWERED_KEY);
    localStorage.removeItem(DAILY_CORRECT_KEY);
  }
}

// ── Beginner Mode ──
const BEGINNER_MODE_KEY = 'kcsa-beginner-mode';

export function getBeginnerMode(): boolean {
  return localStorage.getItem(BEGINNER_MODE_KEY) === 'true';
}

export function setBeginnerMode(enabled: boolean) {
  localStorage.setItem(BEGINNER_MODE_KEY, String(enabled));
}

// ── Continue where left off ──
const LAST_LOCATION_KEY = 'kcsa-last-location';

export function saveLastLocation(path: string) {
  if (path !== '/' && path !== '/settings') {
    localStorage.setItem(LAST_LOCATION_KEY, path);
  }
}

export function getLastLocation(): string | null {
  return localStorage.getItem(LAST_LOCATION_KEY);
}

// ── Quiz Stats ──
const QUIZ_STATS_KEY = 'kcsa-quiz-stats';

interface QuizStats {
  totalQuizzes: number;
  perfectQuizzes: number;
  portQuestionsRight: number;
  flashcardsReviewed: number;
}

export function getQuizStats(): QuizStats {
  const raw = localStorage.getItem(QUIZ_STATS_KEY);
  try {
    return raw ? JSON.parse(raw) : { totalQuizzes: 0, perfectQuizzes: 0, portQuestionsRight: 0, flashcardsReviewed: 0 };
  } catch {
    return { totalQuizzes: 0, perfectQuizzes: 0, portQuestionsRight: 0, flashcardsReviewed: 0 };
  }
}

export function updateQuizStats(updates: Partial<QuizStats>) {
  const stats = getQuizStats();
  const next = { ...stats, ...updates };
  localStorage.setItem(QUIZ_STATS_KEY, JSON.stringify(next));
  return next;
}

// ── Reset Everything ──
export function resetAllProgress() {
  localStorage.removeItem(STREAK_KEY);
  localStorage.removeItem(LAST_DATE_KEY);
  localStorage.removeItem(XP_KEY);
  localStorage.removeItem(BADGES_KEY);
  localStorage.removeItem(DAILY_CHALLENGE_KEY);
  localStorage.removeItem(DAILY_ANSWERED_KEY);
  localStorage.removeItem(DAILY_CORRECT_KEY);
  localStorage.removeItem(BEGINNER_MODE_KEY);
  localStorage.removeItem(LAST_LOCATION_KEY);
  localStorage.removeItem(QUIZ_STATS_KEY);
  localStorage.removeItem('kcsa_read_chapters');
  localStorage.removeItem('kcsa_quiz_scores');
  localStorage.removeItem('kcsa_exam_results');
  localStorage.removeItem('kcsa-domain-progress');
  localStorage.removeItem('kcsa_exam_date');
  localStorage.removeItem('darkMode');
}
