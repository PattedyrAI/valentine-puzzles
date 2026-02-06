import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { PuzzleConfig } from '../../types';

interface PuzzleCardProps {
  puzzle: PuzzleConfig;
  isSolved: boolean;
  isUnlocked: boolean;
}

const THEME_COLORS: Record<string, { border: string; glow: string; bg: string; text: string }> = {
  emerald: { border: 'rgba(52,211,153,0.35)', glow: 'rgba(52,211,153,0.12)', bg: 'rgba(52,211,153,0.08)', text: '#6ee7b7' },
  purple: { border: 'rgba(168,85,247,0.35)', glow: 'rgba(168,85,247,0.12)', bg: 'rgba(168,85,247,0.08)', text: '#c4b5fd' },
  pink: { border: 'rgba(244,114,182,0.35)', glow: 'rgba(244,114,182,0.12)', bg: 'rgba(244,114,182,0.08)', text: '#f9a8d4' },
  amber: { border: 'rgba(251,191,36,0.35)', glow: 'rgba(251,191,36,0.12)', bg: 'rgba(251,191,36,0.08)', text: '#fde68a' },
  yellow: { border: 'rgba(250,204,21,0.35)', glow: 'rgba(250,204,21,0.12)', bg: 'rgba(250,204,21,0.08)', text: '#fef08a' },
  green: { border: 'rgba(74,222,128,0.35)', glow: 'rgba(74,222,128,0.12)', bg: 'rgba(74,222,128,0.08)', text: '#86efac' },
  blue: { border: 'rgba(96,165,250,0.35)', glow: 'rgba(96,165,250,0.12)', bg: 'rgba(96,165,250,0.08)', text: '#93c5fd' },
};

const PuzzleCard = ({ puzzle, isSolved, isUnlocked }: PuzzleCardProps) => {
  const theme = THEME_COLORS[puzzle.theme] || THEME_COLORS.pink;

  const inner = (
    <motion.div
      whileHover={isUnlocked ? { scale: 1.05, y: -3 } : undefined}
      whileTap={isUnlocked ? { scale: 0.97 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative flex flex-col items-center justify-center rounded-2xl aspect-square overflow-hidden p-2"
      style={{
        background: isSolved
          ? theme.bg
          : isUnlocked
            ? 'rgba(255,255,255,0.03)'
            : 'rgba(255,255,255,0.015)',
        border: isSolved
          ? `1.5px solid ${theme.border}`
          : isUnlocked
            ? '1.5px solid rgba(255,255,255,0.10)'
            : '1.5px solid rgba(255,255,255,0.05)',
        boxShadow: isSolved
          ? `0 0 24px ${theme.glow}, inset 0 1px 0 rgba(255,255,255,0.06)`
          : isUnlocked
            ? 'inset 0 1px 0 rgba(255,255,255,0.04)'
            : 'none',
        cursor: isUnlocked ? 'pointer' : 'default',
      }}
    >
      {/* Lock icon for locked puzzles */}
      {!isUnlocked && !isSolved && (
        <div className="flex flex-col items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/[0.12]">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="text-[10px] text-white/[0.12] font-medium tabular-nums">{puzzle.id}</span>
        </div>
      )}

      {/* Solved checkmark badge */}
      {isSolved && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className="absolute top-2.5 right-2.5"
        >
          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: theme.border }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
        </motion.div>
      )}

      {/* Content — visible when unlocked or solved */}
      {(isUnlocked || isSolved) && (
        <>
          <span className="text-3xl mb-2 select-none">{puzzle.icon}</span>
          <span
            className="text-[11px] font-semibold text-center px-1 leading-snug tracking-wide"
            style={{ color: isSolved ? theme.text : 'rgba(255,255,255,0.6)' }}
          >
            {puzzle.title}
          </span>
          <span
            className="absolute bottom-2 text-[9px] font-medium tabular-nums"
            style={{ color: isSolved ? `${theme.text}44` : 'rgba(255,255,255,0.12)' }}
          >
            {puzzle.id}
          </span>
        </>
      )}
    </motion.div>
  );

  if (!isUnlocked) {
    return inner;
  }

  return (
    <Link to={`/puzzle/${puzzle.id}`} className="block no-underline">
      {inner}
    </Link>
  );
};

export default PuzzleCard;
