/**
 * Check if a puzzle should be unlocked based on the current date.
 * Compares dates in YYYY-MM-DD format.
 */
export function isPuzzleUnlocked(unlockDate: string): boolean {
  const now = new Date();
  const unlock = new Date(unlockDate + 'T00:00:00');
  return now >= unlock;
}

/**
 * Get the time remaining until a puzzle unlocks.
 * Returns null if the puzzle is already unlocked.
 */
export function getTimeUntilUnlock(
  unlockDate: string
): { days: number; hours: number; minutes: number; seconds: number } | null {
  const now = new Date();
  const unlock = new Date(unlockDate + 'T00:00:00');
  const diff = unlock.getTime() - now.getTime();

  if (diff <= 0) {
    return null;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

/**
 * Format a YYYY-MM-DD date string into a readable format like "February 4".
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });
}
