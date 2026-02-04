import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CrosswordPuzzleProps {
  onSolve: () => void;
  isSolved: boolean;
}

interface CellDef {
  row: number;
  col: number;
  letter: string;
  clueNumber?: number;
}

const GRID_ROWS = 6;
const GRID_COLS = 9;

// Crossword layout:
// ACROSS 1: ROSE       (row 0, cols 0-3)
// ACROSS 3: VALENTINE  (row 2, cols 0-8)
// ACROSS 5: LOVE       (row 4, cols 2-5)
// DOWN 2: EDEN         (col 3, rows 0-3) — intersects ROSE at E(0,3) and VALENTINE at E(2,3)
// DOWN 4: VOW          (col 0, rows 2-4) — intersects VALENTINE at V(2,0)

const CELLS: CellDef[] = [
  // ACROSS 1: ROSE
  { row: 0, col: 0, letter: 'R', clueNumber: 1 },
  { row: 0, col: 1, letter: 'O' },
  { row: 0, col: 2, letter: 'S' },
  { row: 0, col: 3, letter: 'E' },
  // ACROSS 3: VALENTINE
  { row: 2, col: 0, letter: 'V', clueNumber: 3 },
  { row: 2, col: 1, letter: 'A' },
  { row: 2, col: 2, letter: 'L' },
  { row: 2, col: 3, letter: 'E' },
  { row: 2, col: 4, letter: 'N' },
  { row: 2, col: 5, letter: 'T' },
  { row: 2, col: 6, letter: 'I' },
  { row: 2, col: 7, letter: 'N' },
  { row: 2, col: 8, letter: 'E' },
  // ACROSS 5: LOVE
  { row: 4, col: 2, letter: 'L', clueNumber: 5 },
  { row: 4, col: 3, letter: 'O' },
  { row: 4, col: 4, letter: 'V' },
  { row: 4, col: 5, letter: 'E' },
  // DOWN 2: EDEN (col 3, rows 0-3) — (0,3)=E overlaps ROSE, (2,3)=E overlaps VALENTINE
  { row: 1, col: 3, letter: 'D', clueNumber: 2 },
  { row: 3, col: 3, letter: 'N' },
  // DOWN 4: VOW (col 0, rows 2-4) — (2,0)=V overlaps VALENTINE
  { row: 3, col: 0, letter: 'O' },
  { row: 4, col: 0, letter: 'W', clueNumber: 4 },
];

// Build a lookup for the solution and active cells (deduplicating overlaps)
function buildCellMap() {
  const map = new Map<string, CellDef>();
  for (const cell of CELLS) {
    const key = `${cell.row}-${cell.col}`;
    if (!map.has(key)) {
      map.set(key, cell);
    } else if (cell.clueNumber !== undefined) {
      // Merge clue number onto existing cell
      const existing = map.get(key)!;
      if (existing.clueNumber === undefined) {
        map.set(key, { ...existing, clueNumber: cell.clueNumber });
      }
    }
  }
  return map;
}

const CELL_MAP = buildCellMap();
const UNIQUE_CELLS = Array.from(CELL_MAP.values());

// Clue number map
function getClueNumbers(): Map<string, number> {
  const map = new Map<string, number>();
  for (const cell of UNIQUE_CELLS) {
    if (cell.clueNumber !== undefined) {
      map.set(`${cell.row}-${cell.col}`, cell.clueNumber);
    }
  }
  // DOWN 4 starts at (2,0) which already has clueNumber 3; show 4 at (3,0) or note:
  // Actually VOW starts at row 2 col 0 = V, which has clueNumber 3 for VALENTINE.
  // In crosswords, one cell can have two clue numbers. We handle this by adding a secondary label.
  // For simplicity, let's note that clue 4 starts at cell (2,0) alongside clue 3.
  // We store it as "3/4" effectively. Let's just add it:
  map.set('2-0', 3); // already set; we'll handle the double label in rendering
  return map;
}

const CLUE_NUMBERS = getClueNumbers();

// Track cells that have two clue numbers
const DOUBLE_CLUE_CELLS: Record<string, number[]> = {
  '2-0': [3, 4],
};

const ACROSS_CLUES = [
  { number: 1, clue: 'Red flower of love', length: 4 },
  { number: 3, clue: 'February 14th celebration', length: 9 },
  { number: 5, clue: 'Warm feeling in your chest', length: 4 },
];

const DOWN_CLUES = [
  { number: 2, clue: 'Garden of ___', length: 4 },
  { number: 4, clue: 'A promise sealed with a ring', length: 3 },
];

const CrosswordPuzzle: React.FC<CrosswordPuzzleProps> = ({ onSolve, isSolved }) => {
  const [grid, setGrid] = useState<Record<string, string>>(() => {
    const g: Record<string, string> = {};
    for (const cell of UNIQUE_CELLS) {
      g[`${cell.row}-${cell.col}`] = '';
    }
    return g;
  });
  const [focusedCell, setFocusedCell] = useState<string | null>(null);
  const [direction, setDirection] = useState<'across' | 'down'>('across');
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const isActiveCell = useCallback((row: number, col: number) => {
    return CELL_MAP.has(`${row}-${col}`);
  }, []);

  const getOrderedCells = useCallback(() => {
    const cells = [...UNIQUE_CELLS];
    cells.sort((a, b) => a.row !== b.row ? a.row - b.row : a.col - b.col);
    return cells;
  }, []);

  const findNextCell = useCallback((row: number, col: number, dir: 'across' | 'down') => {
    if (dir === 'across') {
      for (let c = col + 1; c < GRID_COLS; c++) {
        if (isActiveCell(row, c)) return `${row}-${c}`;
      }
    } else {
      for (let r = row + 1; r < GRID_ROWS; r++) {
        if (isActiveCell(r, col)) return `${r}-${col}`;
      }
    }
    const ordered = getOrderedCells();
    const idx = ordered.findIndex(c => c.row === row && c.col === col);
    if (idx < ordered.length - 1) return `${ordered[idx + 1].row}-${ordered[idx + 1].col}`;
    return null;
  }, [isActiveCell, getOrderedCells]);

  const findPrevCell = useCallback((row: number, col: number, dir: 'across' | 'down') => {
    if (dir === 'across') {
      for (let c = col - 1; c >= 0; c--) {
        if (isActiveCell(row, c)) return `${row}-${c}`;
      }
    } else {
      for (let r = row - 1; r >= 0; r--) {
        if (isActiveCell(r, col)) return `${r}-${col}`;
      }
    }
    return null;
  }, [isActiveCell]);

  useEffect(() => {
    if (focusedCell && inputRefs.current[focusedCell]) {
      inputRefs.current[focusedCell]?.focus();
    }
  }, [focusedCell]);

  const checkSolution = useCallback((currentGrid: Record<string, string>) => {
    for (const cell of UNIQUE_CELLS) {
      const key = `${cell.row}-${cell.col}`;
      if (currentGrid[key]?.toUpperCase() !== cell.letter) return false;
    }
    return true;
  }, []);

  const handleCellInput = useCallback((row: number, col: number, value: string) => {
    if (isSolved) return;
    const key = `${row}-${col}`;
    const letter = value.slice(-1).toUpperCase();
    setGrid(prev => {
      const next = { ...prev, [key]: letter };
      if (checkSolution(next) && !isSolved) {
        setTimeout(() => {
          setShowSuccess(true);
          onSolve();
        }, 300);
      }
      return next;
    });
    if (letter) {
      const next = findNextCell(row, col, direction);
      if (next) setFocusedCell(next);
    }
  }, [isSolved, direction, findNextCell, onSolve, checkSolution]);

  const handleKeyDown = useCallback((row: number, col: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !grid[`${row}-${col}`]) {
      const prev = findPrevCell(row, col, direction);
      if (prev) {
        setGrid(g => ({ ...g, [prev]: '' }));
        setFocusedCell(prev);
      }
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      const next = findNextCell(row, col, 'across');
      if (next) setFocusedCell(next);
      setDirection('across');
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      const prev = findPrevCell(row, col, 'across');
      if (prev) setFocusedCell(prev);
      setDirection('across');
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      const next = findNextCell(row, col, 'down');
      if (next) setFocusedCell(next);
      setDirection('down');
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      const prev = findPrevCell(row, col, 'down');
      if (prev) setFocusedCell(prev);
      setDirection('down');
      e.preventDefault();
    } else if (e.key === 'Tab') {
      setDirection(d => d === 'across' ? 'down' : 'across');
      e.preventDefault();
    }
  }, [grid, direction, findNextCell, findPrevCell]);

  const handleCellClick = useCallback((row: number, col: number) => {
    const key = `${row}-${col}`;
    if (focusedCell === key) {
      setDirection(d => d === 'across' ? 'down' : 'across');
    }
    setFocusedCell(key);
  }, [focusedCell]);

  const getCellClueLabel = (row: number, col: number): string => {
    const key = `${row}-${col}`;
    if (DOUBLE_CLUE_CELLS[key]) {
      return DOUBLE_CLUE_CELLS[key].join('/');
    }
    const num = CLUE_NUMBERS.get(key);
    return num !== undefined ? String(num) : '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6"
    >
      <h2 className="text-2xl font-bold text-rose-300">Crossword Puzzle</h2>
      <p className="text-rose-200/70 text-sm">
        Fill in the love-themed crossword. Arrow keys to navigate, Tab to switch direction.
      </p>

      {/* Grid */}
      <div
        className="inline-grid gap-0"
        style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 2.5rem)` }}
      >
        {Array.from({ length: GRID_ROWS }, (_, row) =>
          Array.from({ length: GRID_COLS }, (_, col) => {
            const key = `${row}-${col}`;
            const active = isActiveCell(row, col);
            const clueLabel = getCellClueLabel(row, col);
            const isFocused = focusedCell === key;
            const cellValue = grid[key] || '';

            return (
              <div
                key={key}
                className={`relative w-10 h-10 border ${
                  active
                    ? `${isFocused ? 'border-rose-400 z-10' : 'border-rose-800/40'} ${isSolved ? 'bg-rose-100' : 'bg-[#fdf6ec]'} cursor-pointer`
                    : 'bg-transparent border-transparent'
                }`}
                onClick={() => active && handleCellClick(row, col)}
              >
                {clueLabel && (
                  <span className="absolute top-0 left-0.5 text-[0.5rem] leading-none text-rose-500 font-bold select-none">
                    {clueLabel}
                  </span>
                )}
                {active && (
                  <input
                    ref={(el) => { inputRefs.current[key] = el; }}
                    type="text"
                    maxLength={1}
                    value={cellValue}
                    readOnly={isSolved}
                    onChange={(e) => handleCellInput(row, col, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(row, col, e)}
                    onFocus={() => setFocusedCell(key)}
                    className={`w-full h-full text-center text-lg font-bold uppercase bg-transparent outline-none caret-rose-400 ${
                      isSolved ? 'text-rose-600' : 'text-gray-800'
                    }`}
                    aria-label={`Cell row ${row + 1} column ${col + 1}`}
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Clues */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl text-sm">
        <div>
          <h3 className="font-semibold text-rose-300 mb-2">Across</h3>
          <ul className="space-y-1">
            {ACROSS_CLUES.map(c => (
              <li key={c.number} className="text-rose-200/80">
                <span className="font-bold text-rose-300 mr-1">{c.number}.</span>
                {c.clue} ({c.length})
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-rose-300 mb-2">Down</h3>
          <ul className="space-y-1">
            {DOWN_CLUES.map(c => (
              <li key={c.number} className="text-rose-200/80">
                <span className="font-bold text-rose-300 mr-1">{c.number}.</span>
                {c.clue} ({c.length})
              </li>
            ))}
          </ul>
        </div>
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
              Crossword complete! Words of love unlocked.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CrosswordPuzzle;
