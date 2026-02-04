import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SudokuPuzzleProps {
  onSolve: () => void;
  isSolved: boolean;
}

const SOLUTION: number[][] = [
  [1, 2, 5, 6],
  [5, 6, 1, 2],
  [2, 1, 6, 5],
  [6, 5, 2, 1],
];

// 0 means empty (player must fill in)
const GIVEN_MASK: number[][] = [
  [1, 0, 1, 0],
  [0, 1, 0, 1],
  [1, 0, 1, 0],
  [0, 1, 0, 1],
];

const VALID_DIGITS = [1, 2, 5, 6];

function initializeGrid(): (number | null)[][] {
  return SOLUTION.map((row, ri) =>
    row.map((val, ci) => (GIVEN_MASK[ri][ci] ? val : null))
  );
}

function isGivenCell(row: number, col: number): boolean {
  return GIVEN_MASK[row][col] === 1;
}

function getConflicts(grid: (number | null)[][]): Set<string> {
  const conflicts = new Set<string>();

  // Check rows
  for (let r = 0; r < 4; r++) {
    for (let c1 = 0; c1 < 4; c1++) {
      for (let c2 = c1 + 1; c2 < 4; c2++) {
        if (grid[r][c1] !== null && grid[r][c1] === grid[r][c2]) {
          if (!isGivenCell(r, c1)) conflicts.add(`${r}-${c1}`);
          if (!isGivenCell(r, c2)) conflicts.add(`${r}-${c2}`);
        }
      }
    }
  }

  // Check columns
  for (let c = 0; c < 4; c++) {
    for (let r1 = 0; r1 < 4; r1++) {
      for (let r2 = r1 + 1; r2 < 4; r2++) {
        if (grid[r1][c] !== null && grid[r1][c] === grid[r2][c]) {
          if (!isGivenCell(r1, c)) conflicts.add(`${r1}-${c}`);
          if (!isGivenCell(r2, c)) conflicts.add(`${r2}-${c}`);
        }
      }
    }
  }

  // Check 2x2 boxes
  for (let boxR = 0; boxR < 2; boxR++) {
    for (let boxC = 0; boxC < 2; boxC++) {
      const cells: [number, number][] = [];
      for (let r = boxR * 2; r < boxR * 2 + 2; r++) {
        for (let c = boxC * 2; c < boxC * 2 + 2; c++) {
          cells.push([r, c]);
        }
      }
      for (let i = 0; i < cells.length; i++) {
        for (let j = i + 1; j < cells.length; j++) {
          const [r1, c1] = cells[i];
          const [r2, c2] = cells[j];
          if (grid[r1][c1] !== null && grid[r1][c1] === grid[r2][c2]) {
            if (!isGivenCell(r1, c1)) conflicts.add(`${r1}-${c1}`);
            if (!isGivenCell(r2, c2)) conflicts.add(`${r2}-${c2}`);
          }
        }
      }
    }
  }

  return conflicts;
}

function checkSolved(grid: (number | null)[][]): boolean {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] !== SOLUTION[r][c]) return false;
    }
  }
  return true;
}

export default function SudokuPuzzle({
  onSolve,
  isSolved,
}: SudokuPuzzleProps) {
  const [grid, setGrid] = useState<(number | null)[][]>(() => initializeGrid());
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    null
  );

  const conflicts = getConflicts(grid);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (isSolved || isGivenCell(row, col)) return;
      setSelectedCell([row, col]);
    },
    [isSolved]
  );

  const handleDigitInput = useCallback(
    (digit: number) => {
      if (!selectedCell || isSolved) return;
      const [r, c] = selectedCell;
      if (isGivenCell(r, c)) return;

      const newGrid = grid.map((row) => [...row]);
      newGrid[r][c] = digit;
      setGrid(newGrid);

      if (checkSolved(newGrid)) {
        setTimeout(() => onSolve(), 400);
      }
    },
    [selectedCell, grid, isSolved, onSolve]
  );

  const handleClear = useCallback(() => {
    if (!selectedCell || isSolved) return;
    const [r, c] = selectedCell;
    if (isGivenCell(r, c)) return;

    const newGrid = grid.map((row) => [...row]);
    newGrid[r][c] = null;
    setGrid(newGrid);
  }, [selectedCell, grid, isSolved]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      {/* Solved badge */}
      <AnimatePresence>
        {isSolved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-bold px-6 py-2 rounded-full shadow-lg text-lg"
          >
            ✓ Solved!
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-rose-200 text-center text-sm">
        Fill the grid using only{" "}
        <span className="text-amber-400 font-bold">1, 2, 5, 6</span>. Each
        digit appears once per row, column, and 2x2 box.
      </p>

      {/* Grid */}
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 shadow-xl">
        <div className="grid grid-cols-4 gap-0 border-2 border-amber-400/60 rounded-lg overflow-hidden">
          {grid.map((row, ri) =>
            row.map((val, ci) => {
              const given = isGivenCell(ri, ci);
              const isSelected =
                selectedCell &&
                selectedCell[0] === ri &&
                selectedCell[1] === ci;
              const hasConflict = conflicts.has(`${ri}-${ci}`);

              // Box borders
              const borderRight = ci === 1 ? "border-r-2 border-r-amber-400/40" : "";
              const borderBottom = ri === 1 ? "border-b-2 border-b-amber-400/40" : "";

              return (
                <motion.button
                  key={`${ri}-${ci}`}
                  onClick={() => handleCellClick(ri, ci)}
                  whileTap={!given ? { scale: 0.9 } : {}}
                  className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center text-2xl md:text-3xl font-bold border border-white/10 transition-all duration-200 ${borderRight} ${borderBottom} ${
                    isSelected
                      ? "bg-rose-500/30 ring-2 ring-rose-400"
                      : given
                      ? "bg-white/5"
                      : "bg-white/[0.02] hover:bg-white/10"
                  } ${
                    hasConflict
                      ? "text-red-400"
                      : given
                      ? "text-amber-400"
                      : "text-white"
                  } ${given ? "cursor-default" : "cursor-pointer"}`}
                >
                  {val ?? ""}
                </motion.button>
              );
            })
          )}
        </div>
      </div>

      {/* Digit buttons */}
      {!isSolved && (
        <div className="flex gap-3">
          {VALID_DIGITS.map((digit) => (
            <motion.button
              key={digit}
              onClick={() => handleDigitInput(digit)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-400/40 text-amber-300 text-xl md:text-2xl font-bold hover:bg-amber-400/30 transition-all shadow-md"
            >
              {digit}
            </motion.button>
          ))}
          <motion.button
            onClick={handleClear}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white/10 border border-white/20 text-rose-300 text-lg font-bold hover:bg-white/20 transition-all shadow-md"
          >
            ✕
          </motion.button>
        </div>
      )}
    </div>
  );
}
