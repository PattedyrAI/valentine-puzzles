import { UNLOCK_DELAY_MS } from '../config/constants';

/**
 * Check if a puzzle is unlocked in the sequential system.
 * Puzzle 1 is always unlocked. Others require the previous puzzle
 * to have been solved at least 24 hours ago.
 */
export function isPuzzleUnlockedSequential(
  puzzleId: number,
  solvedAt: Record<number, number>
): boolean {
  if (puzzleId === 1) return true;
  const prevSolvedTime = solvedAt[puzzleId - 1];
  if (!prevSolvedTime) return false;
  return Date.now() >= prevSolvedTime + UNLOCK_DELAY_MS;
}

/**
 * Get the time remaining until a puzzle unlocks sequentially.
 * Returns null if already unlocked or if previous puzzle isn't solved yet.
 */
export function getTimeUntilUnlockSequential(
  puzzleId: number,
  solvedAt: Record<number, number>
): { days: number; hours: number; minutes: number; seconds: number } | null {
  if (puzzleId === 1) return null;
  const prevSolvedTime = solvedAt[puzzleId - 1];
  if (!prevSolvedTime) return null;

  const unlockTime = prevSolvedTime + UNLOCK_DELAY_MS;
  const diff = unlockTime - Date.now();

  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}
