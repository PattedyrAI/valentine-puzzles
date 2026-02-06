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
    <div className="flex-1 flex flex-col items-center px-5 py-8">
      <div className="w-full max-w-lg">
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-white/30 hover:text-rose-300/60 transition-colors text-sm mb-6 no-underline"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span>Tilbake</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <h1
            className="text-2xl md:text-3xl font-bold pink-glow mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {title}
          </h1>
          <p className="text-rose-200/30 text-sm leading-relaxed max-w-sm mx-auto" style={{ fontFamily: "'Lato', sans-serif" }}>
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
