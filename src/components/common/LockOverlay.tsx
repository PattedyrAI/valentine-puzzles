import { usePuzzleUnlock } from '../../hooks/usePuzzleUnlock';
import CountdownTimer from './CountdownTimer';

interface LockOverlayProps {
  unlockDate: string;
  puzzleTitle: string;
}

const LockOverlay = ({ unlockDate, puzzleTitle }: LockOverlayProps) => {
  const { isUnlocked } = usePuzzleUnlock(unlockDate);

  if (isUnlocked) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#1a0a2e]/70 backdrop-blur-sm">
      <div className="glass-card max-w-md w-full mx-4 p-8 text-center">
        <div className="text-5xl mb-4">&#128274;</div>
        <h2 className="text-2xl font-bold text-[#fef3e2] mb-2">
          Puzzle Locked
        </h2>
        <p className="text-rose-300/80 mb-6 text-sm">
          &quot;{puzzleTitle}&quot; isn&apos;t available yet.
        </p>
        <p className="text-[#fef3e2]/60 text-xs uppercase tracking-widest mb-3">
          Unlocks in
        </p>
        <CountdownTimer targetDate={unlockDate} />
      </div>
    </div>
  );
};

export default LockOverlay;
