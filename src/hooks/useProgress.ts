import { useState, useCallback } from 'react';
import type { Progress } from '../types';
import {
  getProgress,
  markPuzzleSolved as storageMark,
  resetProgress as storageReset,
} from '../utils/storage';

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(getProgress);

  const markSolved = useCallback((puzzleId: number, clue: string) => {
    const updated = storageMark(puzzleId, clue);
    setProgress(updated);
  }, []);

  const resetAll = useCallback(() => {
    storageReset();
    setProgress({ solved: [], clues: {}, solvedAt: {} });
  }, []);

  const isSolved = useCallback(
    (puzzleId: number): boolean => {
      return progress.solved.includes(puzzleId);
    },
    [progress.solved]
  );

  return {
    progress,
    markSolved,
    resetProgress: resetAll,
    isSolved,
  };
}
