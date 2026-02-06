import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
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
  void _onSolve;

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-8">
      <div className="w-full max-w-md">
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-white/30 hover:text-rose-300/60 transition-colors text-xs mb-8 no-underline"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span>Tilbake</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-xl md:text-2xl font-semibold pink-glow mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {title}
          </h1>
          <p className="text-rose-200/30 text-sm leading-relaxed max-w-sm mx-auto">
            {description}
          </p>
        </div>

        {/* Puzzle */}
        <div className="relative z-10">{children}</div>

        {/* Clue */}
        {isSolved && <ClueReveal clue={clue} puzzleNumber={puzzleId} />}
      </div>
    </div>
  );
};

export default PuzzleShell;
