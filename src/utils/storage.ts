import type { Progress } from '../types';

const STORAGE_KEY = 'valentine-progress';

const DEFAULT_PROGRESS: Progress = {
  solved: [],
  clues: {},
};

/**
 * Retrieve the current progress from localStorage.
 * Returns default progress if nothing is stored or data is invalid.
 */
export function getProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS, clues: {} };
    const parsed = JSON.parse(raw) as Progress;
    return {
      solved: Array.isArray(parsed.solved) ? parsed.solved : [],
      clues: parsed.clues && typeof parsed.clues === 'object' ? parsed.clues : {},
    };
  } catch {
    return { ...DEFAULT_PROGRESS, clues: {} };
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
 * Returns the updated progress.
 */
export function markPuzzleSolved(puzzleId: number, clue: string): Progress {
  const progress = getProgress();

  if (!progress.solved.includes(puzzleId)) {
    progress.solved.push(puzzleId);
    progress.solved.sort((a, b) => a - b);
  }

  progress.clues[puzzleId] = clue;
  saveProgress(progress);
  return progress;
}

/**
 * Reset all progress, clearing localStorage.
 */
export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
