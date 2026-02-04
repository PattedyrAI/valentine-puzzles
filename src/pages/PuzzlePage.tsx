import { useParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { puzzles } from '../config/puzzles';
import { useProgress } from '../hooks/useProgress';
import { usePuzzleUnlock } from '../hooks/usePuzzleUnlock';
import { useConfetti } from '../hooks/useConfetti';
import PuzzleShell from '../components/puzzles/PuzzleShell';
import LockOverlay from '../components/common/LockOverlay';
import PageWrapper from '../components/layout/PageWrapper';
import CipherPuzzle from '../components/puzzles/CipherPuzzle';
import RiddlePuzzle from '../components/puzzles/RiddlePuzzle';
import WordSearchPuzzle from '../components/puzzles/WordSearchPuzzle';
import MemoryMatchPuzzle from '../components/puzzles/MemoryMatchPuzzle';
import SudokuPuzzle from '../components/puzzles/SudokuPuzzle';
import CrosswordPuzzle from '../components/puzzles/CrosswordPuzzle';
import MazePuzzle from '../components/puzzles/MazePuzzle';
import AnagramPuzzle from '../components/puzzles/AnagramPuzzle';
import TriviaPuzzle from '../components/puzzles/TriviaPuzzle';
import JigsawPuzzle from '../components/puzzles/JigsawPuzzle';

const puzzleComponents: Record<string, React.ComponentType<{ onSolve: () => void; isSolved: boolean }>> = {
  cipher: CipherPuzzle,
  riddle: RiddlePuzzle,
  wordsearch: WordSearchPuzzle,
  memory: MemoryMatchPuzzle,
  sudoku: SudokuPuzzle,
  crossword: CrosswordPuzzle,
  maze: MazePuzzle,
  anagram: AnagramPuzzle,
  trivia: TriviaPuzzle,
  jigsaw: JigsawPuzzle,
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
