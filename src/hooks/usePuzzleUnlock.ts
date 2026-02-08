import { useState, useEffect, useRef } from 'react';
import { DEV_MODE } from '../config/constants';
import { isPuzzleUnlocked, getTimeUntilUnlock } from '../utils/dateUtils';

interface PuzzleUnlockState {
  isUnlocked: boolean;
  timeRemaining: { days: number; hours: number; minutes: number; seconds: number } | null;
  isPrevSolved: boolean;
}

export function usePuzzleUnlock(
  puzzleId: number,
  solvedAt: Record<number, number>
): PuzzleUnlockState {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [state, setState] = useState<PuzzleUnlockState>(() => {
    if (DEV_MODE) {
      return { isUnlocked: true, timeRemaining: null, isPrevSolved: true };
    }
    const prevSolved = puzzleId === 1 || (puzzleId - 1) in solvedAt;
    return {
      isUnlocked: isPuzzleUnlocked(puzzleId, solvedAt),
      timeRemaining: getTimeUntilUnlock(puzzleId, solvedAt),
      isPrevSolved: prevSolved,
    };
  });

  useEffect(() => {
    if (DEV_MODE) {
      setState({ isUnlocked: true, timeRemaining: null, isPrevSolved: true });
      return;
    }

    const tick = () => {
      const prevSolved = puzzleId === 1 || (puzzleId - 1) in solvedAt;
      const unlocked = isPuzzleUnlocked(puzzleId, solvedAt);
      const remaining = getTimeUntilUnlock(puzzleId, solvedAt);

      setState({ isUnlocked: unlocked, timeRemaining: remaining, isPrevSolved: prevSolved });

      if (unlocked && intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    tick();
    intervalRef.current = setInterval(tick, 1000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [puzzleId, solvedAt]);

  return state;
}
