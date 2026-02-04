import { Link } from 'react-router-dom';
import type { PuzzleConfig } from '../../types';

interface PuzzleCardProps {
  puzzle: PuzzleConfig;
  isSolved: boolean;
  isUnlocked: boolean;
}

const PuzzleCard = ({ puzzle, isSolved, isUnlocked }: PuzzleCardProps) => {
  const cardContent = (
    <div
      className={`glass-card puzzle-card-hover relative p-5 rounded-2xl transition-all duration-300 ${
        !isUnlocked ? 'opacity-50 grayscale cursor-not-allowed' : ''
      } ${
        isSolved ? 'border-green-500/30' : ''
      } ${
        isUnlocked && !isSolved
          ? 'ring-1 ring-rose-400/40 animate-pulse-slow'
          : ''
      }`}
    >
      {/* Status badge */}
      {isSolved && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">&#10003;</span>
        </div>
      )}
      {!isUnlocked && (
        <div className="absolute top-3 right-3 text-lg">&#128274;</div>
      )}

      {/* Icon */}
      <div className="text-3xl mb-3">{puzzle.icon}</div>

      {/* Title */}
      <h3 className="text-[#fef3e2] font-bold text-base mb-1 leading-tight">
        {puzzle.title}
      </h3>

      {/* Subtitle */}
      <p className="text-rose-300/60 text-xs leading-relaxed">
        {isUnlocked ? puzzle.subtitle : 'Locked'}
      </p>
    </div>
  );

  if (!isUnlocked) {
    return <div className="block">{cardContent}</div>;
  }

  return (
    <Link to={`/puzzle/${puzzle.id}`} className="block no-underline">
      {cardContent}
    </Link>
  );
};

export default PuzzleCard;
