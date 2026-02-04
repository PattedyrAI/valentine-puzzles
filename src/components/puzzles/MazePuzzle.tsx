import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MazePuzzleProps {
  onSolve: () => void;
  isSolved: boolean;
}

// 0 = wall, 1 = path, 2 = start, 3 = end
// Heart-shaped maze, 13x13. Verified solvable path exists.
const MAZE: number[][] = [
  [0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0],
  [1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1],
  [2, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1],
  [0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0],
  [0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const ROWS = MAZE.length;
const COLS = MAZE[0].length;

function findCell(value: number): [number, number] {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (MAZE[r][c] === value) return [r, c];
    }
  }
  return [0, 0];
}

const START = findCell(2);
const END = findCell(3);

function isWalkable(row: number, col: number): boolean {
  if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return false;
  return MAZE[row][col] !== 0;
}

function isAdjacent(r1: number, c1: number, r2: number, c2: number): boolean {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
}

const MazePuzzle: React.FC<MazePuzzleProps> = ({ onSolve, isSolved }) => {
  const [position, setPosition] = useState<[number, number]>(START);
  const [visited, setVisited] = useState<Set<string>>(() => new Set([`${START[0]}-${START[1]}`]));
  const [showSuccess, setShowSuccess] = useState(false);

  const moveTo = useCallback((row: number, col: number) => {
    if (isSolved) return;
    if (!isWalkable(row, col)) return;
    if (!isAdjacent(position[0], position[1], row, col)) return;

    setPosition([row, col]);
    setVisited(prev => {
      const next = new Set(prev);
      next.add(`${row}-${col}`);
      return next;
    });

    if (row === END[0] && col === END[1]) {
      setTimeout(() => {
        setShowSuccess(true);
        onSolve();
      }, 300);
    }
  }, [position, isSolved, onSolve]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isSolved) return;
    const [r, c] = position;
    let nr = r, nc = c;
    switch (e.key) {
      case 'ArrowUp': nr = r - 1; break;
      case 'ArrowDown': nr = r + 1; break;
      case 'ArrowLeft': nc = c - 1; break;
      case 'ArrowRight': nc = c + 1; break;
      default: return;
    }
    e.preventDefault();
    if (isWalkable(nr, nc)) {
      moveTo(nr, nc);
    }
  }, [position, isSolved, moveTo]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleReset = () => {
    setPosition(START);
    setVisited(new Set([`${START[0]}-${START[1]}`]));
  };

  const getCellStyle = (row: number, col: number) => {
    const val = MAZE[row][col];
    const isPos = position[0] === row && position[1] === col;
    const isVisited = visited.has(`${row}-${col}`);
    const isStart = row === START[0] && col === START[1];
    const isEnd = row === END[0] && col === END[1];

    if (val === 0) return 'bg-transparent';
    if (isPos) return 'bg-rose-400 shadow-lg shadow-rose-400/50';
    if (isEnd) return 'bg-amber-300/70';
    if (isStart) return 'bg-emerald-400/50';
    if (isVisited) return 'bg-rose-300/30';
    return 'bg-stone-300/20';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6"
    >
      <h2 className="text-2xl font-bold text-rose-300">Heart Maze</h2>
      <p className="text-rose-200/70 text-sm text-center">
        Navigate through the heart to reach the bottom. Click adjacent cells or use arrow keys.
      </p>

      <div
        className="inline-grid gap-0.5"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1.75rem)` }}
      >
        {MAZE.map((row, ri) =>
          row.map((cell, ci) => {
            const key = `${ri}-${ci}`;
            const isPos = position[0] === ri && position[1] === ci;
            const isEnd = ri === END[0] && ci === END[1];
            const clickable = cell !== 0 && isAdjacent(position[0], position[1], ri, ci);

            return (
              <div
                key={key}
                className={`w-7 h-7 rounded-sm flex items-center justify-center text-xs select-none
                  ${getCellStyle(ri, ci)}
                  ${clickable && !isSolved ? 'cursor-pointer hover:ring-1 hover:ring-rose-400/50' : ''}
                  transition-colors duration-150`}
                onClick={() => clickable && moveTo(ri, ci)}
              >
                {isPos && (
                  <div className="w-4 h-4 rounded-full bg-rose-500 shadow-md" />
                )}
                {isEnd && !isPos && (
                  <span className="text-sm">&#10084;</span>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="flex gap-3">
        {!isSolved && (
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg bg-rose-500/20 border border-rose-400/30 text-rose-300 text-sm hover:bg-rose-500/30 transition-colors"
          >
            Reset Position
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-rose-200/60 justify-center">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-emerald-400/50 inline-block" /> Start
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-amber-300/70 inline-block" /> Goal
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-rose-400 inline-block" /> You
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-rose-300/30 inline-block" /> Visited
        </span>
      </div>

      <AnimatePresence>
        {(showSuccess || isSolved) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-3 px-6 rounded-xl bg-rose-500/20 border border-rose-400/30"
          >
            <p className="text-rose-300 font-semibold text-lg">
              You found your way through the heart!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MazePuzzle;
