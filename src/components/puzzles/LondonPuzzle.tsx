import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LondonPuzzleProps {
  onSolve: () => void;
  isSolved: boolean;
}

// 0 = wall, 1 = path, 2 = start, 3 = end
// 19x19 maze — zigzag solution with many dead ends. Verified solvable.
// Solution: (1,1)↓(3,1)→(3,5)↓(5,5)→(5,9)↓(7,9)←(7,5)↓(9,5)←(9,1)↓(11,1)→(11,5)↓(13,5)→(13,9)↓(15,9)→(15,13)↓(17,13)→(17,17)
const MAZE: number[][] = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,2,1,1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,0],
  [0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,0,0,1,0],
  [0,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,0,1,0],
  [0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0,1,0],
  [0,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1,0],
  [0,1,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0],
  [0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1,1,0],
  [0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0],
  [0,1,1,1,1,1,0,1,0,1,0,1,1,1,0,1,0,1,0],
  [0,1,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0],
  [0,1,1,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0],
  [0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,1,0,0,0],
  [0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,0,1,0],
  [0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0],
  [0,1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,0],
  [0,0,0,0,0,1,0,1,0,0,0,0,0,1,0,1,0,1,0],
  [0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,3,0],
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
        <h2 className="text-xl font-bold text-blue-300">London-labyrinten</h2>
        <p className="text-blue-200/60 text-sm mt-1">
          Tower of London &rarr; Big Ben
        </p>
      </div>

      <p className="text-blue-200/70 text-sm text-center">
        En siste kronglete sti, Julie. Klikk p&aring; naboceller eller bruk piltastene
        for &aring; finne veien gjennom.
      </p>

      {isSolved && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ease: [0.4, 0, 0.2, 1] as const }}
          className="px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium"
        >
          Oppgave fullf&oslash;rt!
        </motion.div>
      )}

      <div
        className="glass-card p-3 rounded-xl inline-block"
        role="grid"
        aria-label="London-labyrint"
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
                        ? 'M\u00E5l: Big Ben'
                        : cell === 0
                          ? 'Vegg'
                          : 'Sti'
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
            className="px-6 py-3 rounded-xl bg-[#101828] border-2 border-[#2a4070] text-blue-300 text-sm font-semibold hover:bg-[#152030] hover:border-[#3a5590] transition-all duration-200"
          >
            Tilbakestill
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-blue-200/60 justify-center">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-slate-800 border border-slate-700/50 inline-block" />{' '}
          Bygninger
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-slate-400/20 inline-block" />{' '}
          Gate
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
          Deg
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-blue-300/25 inline-block" />{' '}
          Bes&oslash;kt
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
            <p className="text-blue-300 font-semibold text-sm">
              Du fant veien, Julie. Det gj&oslash;r du alltid.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
