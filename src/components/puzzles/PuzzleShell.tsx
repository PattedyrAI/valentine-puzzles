import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import PageWrapper from '../layout/PageWrapper';
import ClueReveal from '../common/ClueReveal';

interface PuzzleShellProps {
  title: string;
  description: string;
  children: ReactNode;
  puzzleId: number;
  onSolve: () => void;
  isSolved: boolean;
  clue: string;
}

const PuzzleShell = ({
  title,
  description,
  children,
  puzzleId,
  onSolve: _onSolve,
  isSolved,
  clue,
}: PuzzleShellProps) => {
  void _onSolve; // used by parent; passed through for puzzle children

  return (
    <PageWrapper>
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-rose-300/70 hover:text-rose-200 transition-colors text-sm mb-6 no-underline"
      >
        <span>&larr;</span>
        <span>Back to puzzles</span>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl md:text-4xl font-bold text-[#fef3e2] mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {title}
        </h1>
        <p className="text-rose-300/70 text-base leading-relaxed">
          {description}
        </p>
      </div>

      {/* Puzzle content */}
      <div className="relative z-10">{children}</div>

      {/* Clue reveal */}
      {isSolved && <ClueReveal clue={clue} puzzleNumber={puzzleId} />}
    </PageWrapper>
  );
};

export default PuzzleShell;
