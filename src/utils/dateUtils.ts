import { PUZZLE_UNLOCK_DATES } from '../config/constants';

const MONTH_NAMES_NO = [
  'januar', 'februar', 'mars', 'april', 'mai', 'juni',
  'juli', 'august', 'september', 'oktober', 'november', 'desember',
];

/** Parse "YYYY-MM-DD" to local midnight Date */
function parseUnlockDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Check if a puzzle is unlocked based on calendar date.
 * Puzzle 1 is always unlocked.
 * Others require: the date has arrived AND the previous puzzle is solved.
 */
export function isPuzzleUnlocked(
  puzzleId: number,
  solvedAt: Record<number, number>
): boolean {
  if (puzzleId === 1) return true;
  const dateStr = PUZZLE_UNLOCK_DATES[puzzleId];
  if (!dateStr) return false;
  const prevSolved = (puzzleId - 1) in solvedAt;
  if (!prevSolved) return false;
  return Date.now() >= parseUnlockDate(dateStr).getTime();
}

/**
 * Get time remaining until a puzzle's unlock date.
 * Returns null if already unlocked or if previous puzzle isn't solved yet.
 */
export function getTimeUntilUnlock(
  puzzleId: number,
  solvedAt: Record<number, number>
): { days: number; hours: number; minutes: number; seconds: number } | null {
  if (puzzleId === 1) return null;
  const dateStr = PUZZLE_UNLOCK_DATES[puzzleId];
  if (!dateStr) return null;
  const prevSolved = (puzzleId - 1) in solvedAt;
  if (!prevSolved) return null;

  const diff = parseUnlockDate(dateStr).getTime() - Date.now();
  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

/** Returns Norwegian date display like "8. februar" for a puzzle's unlock date. */
export function getUnlockDateDisplay(puzzleId: number): string | null {
  const dateStr = PUZZLE_UNLOCK_DATES[puzzleId];
  if (!dateStr) return null;
  const date = parseUnlockDate(dateStr);
  return `${date.getDate()}. ${MONTH_NAMES_NO[date.getMonth()]}`;
}
