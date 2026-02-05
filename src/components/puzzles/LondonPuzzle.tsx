import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LondonPuzzleProps {
  onSolve: () => void;
  isSolved: boolean;
}

// 0 = wall, 1 = path, 2 = start (Tower of London), 3 = end (Big Ben)
// 19x19 maze with many dead ends and twists. Verified solvable.
// Solution path: (1,1)→(5,1)→(5,3)→(3,3)→(3,7)→(5,7)→(5,9)→(9,9)→(9,13)→(17,13)→(17,17)
const MAZE: number[][] = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,2,0,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,0],
  [0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,1,0,1,0],
  [0,1,0,1,1,1,1,1,0,1,0,1,1,1,0,1,1,1,0],
  [0,1,0,1,0,1,0,1,0,0,0,0,0,1,0,0,0,0,0],
  [0,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,0],
  [0,0,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0],
  [0,1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,0],
  [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0],
  [0,1,0,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,0],
  [0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0],
  [0,1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,0],
  [0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0],
  [0,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,0],
  [0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
  [0,1,1,1,0,1,0,1,0,1,1,1,0,1,1,1,1,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
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

export default function LondonPuzzle({ onSolve, isSolved }: LondonPuzzleProps) {
  const [position, setPosition] = useState<[number, number]>(START);
  const [visited, setVisited] = useState<Set<string>>(
    () => new Set([`${START[0]}-${START[1]}`])
  );
  const [showSuccess, setShowSuccess] = useState(false);

  const moveTo = useCallback(
    (row: number, col: number) => {
      if (isSolved) return;
      if (!isWalkable(row, col)) return;
      if (!isAdjacent(position[0], position[1], row, col)) return;

      setPosition([row, col]);
      setVisited((prev) => {
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
    },
    [position, isSolved, onSolve]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isSolved) return;
      const [r, c] = position;
      let nr = r,
        nc = c;
      switch (e.key) {
        case 'ArrowUp':
          nr = r - 1;
          break;
        case 'ArrowDown':
          nr = r + 1;
          break;
        case 'ArrowLeft':
          nc = c - 1;
          break;
        case 'ArrowRight':
          nc = c + 1;
          break;
        default:
          return;
      }
      e.preventDefault();
      if (isWalkable(nr, nc)) {
        moveTo(nr, nc);
      }
    },
    [position, isSolved, moveTo]
  );

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

    if (val === 0) return 'bg-slate-800 border border-slate-700/50';
    if (isPos) return 'bg-red-500 shadow-lg shadow-red-500/50';
    if (isEnd) return 'bg-amber-400/60';
    if (isStart) return 'bg-blue-400/50';
    if (isVisited) return 'bg-blue-300/25';
    return 'bg-slate-400/20';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
      className="flex flex-col items-center gap-5"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-300">London Maze</h2>
        <p className="text-blue-200/60 text-sm mt-1">
          Tower of London → Big Ben
        </p>
      </div>

      <p className="text-blue-200/70 text-sm text-center max-w-sm">
        One last winding path, Julie. Click adjacent cells or use arrow keys
        to find your way through.
      </p>

      {isSolved && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ease: [0.4, 0, 0.2, 1] as const }}
          className="px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium"
        >
          Solved
        </motion.div>
      )}

      <div
        className="glass-card p-3 rounded-xl inline-block"
        role="grid"
        aria-label="London maze grid"
      >
        <div
          className="inline-grid gap-0.5"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
        >
          {MAZE.map((row, ri) =>
            row.map((cell, ci) => {
              const key = `${ri}-${ci}`;
              const isPos = position[0] === ri && position[1] === ci;
              const isStart = ri === START[0] && ci === START[1];
              const isEnd = ri === END[0] && ci === END[1];
              const clickable =
                cell !== 0 && isAdjacent(position[0], position[1], ri, ci);

              return (
                <div
                  key={key}
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-sm flex items-center justify-center text-xs select-none
                    ${getCellStyle(ri, ci)}
                    ${clickable && !isSolved ? 'cursor-pointer hover:ring-1 hover:ring-blue-400/50' : ''}
                    transition-colors duration-150`}
                  onClick={() => clickable && moveTo(ri, ci)}
                  role="gridcell"
                  aria-label={
                    isStart
                      ? 'Start: Tower of London'
                      : isEnd
                        ? 'End: Big Ben'
                        : cell === 0
                          ? 'Wall'
                          : 'Path'
                  }
                >
                  {isPos && (
                    <motion.div
                      layoutId="london-player"
                      className="w-3 h-3 rounded-full bg-red-500 shadow-md border-2 border-red-300"
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 25,
                      }}
                    />
                  )}
                  {isStart && !isPos && (
                    <span className="text-[10px] leading-none" title="Tower of London">
                      🏰
                    </span>
                  )}
                  {isEnd && !isPos && (
                    <span className="text-[10px] leading-none" title="Big Ben">
                      🕐
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex gap-3">
        {!isSolved && (
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm hover:bg-blue-500/30 transition-colors"
          >
            Reset Position
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-blue-200/60 justify-center">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-slate-800 border border-slate-700/50 inline-block" />{' '}
          Buildings
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-slate-400/20 inline-block" />{' '}
          Street
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-blue-400/50 inline-block" />{' '}
          Tower
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-amber-400/60 inline-block" />{' '}
          Big Ben
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-500 border-2 border-red-300 inline-block" />{' '}
          You
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-blue-300/25 inline-block" />{' '}
          Visited
        </span>
      </div>

      <AnimatePresence>
        {(showSuccess || isSolved) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: [0.4, 0, 0.2, 1] as const }}
            className="text-center py-3 px-6 rounded-xl bg-blue-500/20 border border-blue-400/30"
          >
            <p className="text-blue-300 font-semibold text-lg">
              You found your way, Julie. You always do.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
