import { useParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { puzzles } from '../config/puzzles';
import { useProgress } from '../hooks/useProgress';
import { usePuzzleUnlock } from '../hooks/usePuzzleUnlock';
import { useConfetti } from '../hooks/useConfetti';
import PuzzleShell from '../components/puzzles/PuzzleShell';
import LockOverlay from '../components/common/LockOverlay';
import PageWrapper from '../components/layout/PageWrapper';
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
  const { isSolved, markSolved } = useProgress();
  const { isUnlocked } = usePuzzleUnlock(puzzle?.unlockDate ?? '2099-12-31');
  const { fireConfetti } = useConfetti();
  const hasConfettiFired = useRef(false);

  const solved = puzzle ? isSolved(puzzle.id) : false;
  const decodedClue = puzzle ? atob(puzzle.clue) : '';

  // Fire confetti when puzzle becomes solved
  useEffect(() => {
    if (solved && !hasConfettiFired.current) {
      hasConfettiFired.current = true;
      fireConfetti();
    }
  }, [solved, fireConfetti]);

  if (!puzzle) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-[#fef3e2] mb-4">
            Puzzle Not Found
          </h2>
          <p className="text-rose-300/70">
            This puzzle doesn&apos;t exist. Please go back to the home page.
          </p>
        </div>
      </PageWrapper>
    );
  }

  const handleSolve = () => {
    if (!solved) {
      markSolved(puzzle.id, decodedClue);
    }
  };

  const PuzzleComponent = puzzleComponents[puzzle.type];

  return (
    <>
      {!isUnlocked && (
        <LockOverlay unlockDate={puzzle.unlockDate} puzzleTitle={puzzle.title} />
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
    </>
  );
};

export default PuzzlePage;
