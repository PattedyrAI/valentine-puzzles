import { useParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { puzzles } from '../config/puzzles';
import { useProgress } from '../hooks/useProgress';
import { usePuzzleUnlock } from '../hooks/usePuzzleUnlock';
import { useConfetti } from '../hooks/useConfetti';
import PuzzleShell from '../components/puzzles/PuzzleShell';
import LockOverlay from '../components/common/LockOverlay';
import HorsesPuzzle from '../components/puzzles/HorsesPuzzle';
import KpopDemonPuzzle from '../components/puzzles/KpopDemonPuzzle';
import KatseyePuzzle from '../components/puzzles/KatseyePuzzle';
import BridgertonPuzzle from '../components/puzzles/BridgertonPuzzle';
import WallePuzzle from '../components/puzzles/WallePuzzle';
import GreenDayPuzzle from '../components/puzzles/GreenDayPuzzle';
import LondonPuzzle from '../components/puzzles/LondonPuzzle';

const puzzleComponents: Record<string, React.ComponentType<{ onSolve: () => void; isSolved: boolean }>> = {
  horses_match: HorsesPuzzle,
  kpop_sequence: KpopDemonPuzzle,
  katseye_scramble: KatseyePuzzle,
  bridgerton_cipher: BridgertonPuzzle,
  walle_sort: WallePuzzle,
  greenday_trivia: GreenDayPuzzle,
  london_maze: LondonPuzzle,
};

const PuzzlePage = () => {
  const { id } = useParams<{ id: string }>();
  const puzzleId = Number(id);
  const puzzle = puzzles.find((p) => p.id === puzzleId);
  const { progress, isSolved, markSolved } = useProgress();
  const { isUnlocked, timeRemaining, isPrevSolved } = usePuzzleUnlock(
    puzzle?.id ?? 999,
    progress.solvedAt
  );
  const { fireConfetti } = useConfetti();
  const hasConfettiFired = useRef(false);

  const solved = puzzle ? isSolved(puzzle.id) : false;
  const decodedClue = puzzle ? decodeURIComponent(Array.from(atob(puzzle.clue), (c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')) : '';

  useEffect(() => {
    if (solved && !hasConfettiFired.current) {
      hasConfettiFired.current = true;
      fireConfetti();
    }
  }, [solved, fireConfetti]);

  if (!puzzle) {
    return (
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold pink-glow mb-4">
            Fant ikke oppgaven
          </h2>
          <p className="text-rose-200/30">
            Denne oppgaven finnes ikke. G&aring; tilbake til forsiden.
          </p>
        </div>
      </div>
    );
  }

  const handleSolve = () => {
    if (!solved) {
      markSolved(puzzle.id, decodedClue);
    }
  };

  const PuzzleComponent = puzzleComponents[puzzle.type];

  return (
    <div className="flex-1 flex flex-col">
      {!isUnlocked && (
        <LockOverlay
          puzzleTitle={puzzle.title}
          isPrevSolved={isPrevSolved}
          timeRemaining={timeRemaining}
        />
      )}
      <PuzzleShell
        title={puzzle.title}
        description={puzzle.description}
        puzzleId={puzzle.id}
        onSolve={handleSolve}
        isSolved={solved}
        clue={decodedClue}
      >
        {PuzzleComponent && <PuzzleComponent onSolve={handleSolve} isSolved={solved} />}
      </PuzzleShell>
    </div>
  );
};

export default PuzzlePage;
