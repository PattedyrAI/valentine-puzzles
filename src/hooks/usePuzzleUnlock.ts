import { useState, useEffect } from 'react';
import { DEV_MODE } from '../config/constants';
import { isPuzzleUnlocked, getTimeUntilUnlock } from '../utils/dateUtils';

interface PuzzleUnlockState {
  isUnlocked: boolean;
  timeRemaining: { days: number; hours: number; minutes: number; seconds: number } | null;
}

export function usePuzzleUnlock(unlockDate: string): PuzzleUnlockState {
  const [state, setState] = useState<PuzzleUnlockState>(() => {
    if (DEV_MODE) {
      return { isUnlocked: true, timeRemaining: null };
    }
    return {
      isUnlocked: isPuzzleUnlocked(unlockDate),
      timeRemaining: getTimeUntilUnlock(unlockDate),
    };
  });

  useEffect(() => {
    if (DEV_MODE || isPuzzleUnlocked(unlockDate)) {
      setState({ isUnlocked: true, timeRemaining: null });
      return;
    }

    const interval = setInterval(() => {
      const unlocked = isPuzzleUnlocked(unlockDate);
      const remaining = getTimeUntilUnlock(unlockDate);

      setState({
        isUnlocked: unlocked,
        timeRemaining: remaining,
      });

      if (unlocked) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [unlockDate]);

  return state;
}
