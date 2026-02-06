import type { Progress } from '../types';

const STORAGE_KEY = 'valentine-progress';

const DEFAULT_PROGRESS: Progress = {
  solved: [],
  clues: {},
  solvedAt: {},
};

/**
 * Retrieve the current progress from localStorage.
 * Returns default progress if nothing is stored or data is invalid.
 */
export function getProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS, clues: {}, solvedAt: {} };
    const parsed = JSON.parse(raw) as Progress;
    return {
      solved: Array.isArray(parsed.solved) ? parsed.solved : [],
      clues: parsed.clues && typeof parsed.clues === 'object' ? parsed.clues : {},
      solvedAt: parsed.solvedAt && typeof parsed.solvedAt === 'object' ? parsed.solvedAt : {},
    };
  } catch {
    return { ...DEFAULT_PROGRESS, clues: {}, solvedAt: {} };
  }
}

/**
 * Save progress to localStorage.
 */
export function saveProgress(progress: Progress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

/**
 * Mark a puzzle as solved and store its decoded clue.
 * Records the solve timestamp for sequential unlock tracking.
 * Returns the updated progress.
 */
export function markPuzzleSolved(puzzleId: number, clue: string): Progress {
  const progress = getProgress();

  if (!progress.solved.includes(puzzleId)) {
    progress.solved.push(puzzleId);
    progress.solved.sort((a, b) => a - b);
  }

  progress.clues[puzzleId] = clue;

  if (!progress.solvedAt[puzzleId]) {
    progress.solvedAt[puzzleId] = Date.now();
  }

  saveProgress(progress);
  return progress;
}

/**
 * Migrate old progress data to include solvedAt timestamps.
 * Backfills timestamps for already-solved puzzles so they remain unlocked.
 */
export function migrateProgress(): void {
  const progress = getProgress();
  let needsSave = false;

  for (const id of progress.solved) {
    if (!progress.solvedAt[id]) {
      // Backfill with a timestamp far enough in the past that the next puzzle is already unlocked
      progress.solvedAt[id] = Date.now() - 25 * 60 * 60 * 1000; // 25 hours ago
      needsSave = true;
    }
  }

  if (needsSave) {
    saveProgress(progress);
  }
}

/**
 * Reset all progress, clearing localStorage.
 */
export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
