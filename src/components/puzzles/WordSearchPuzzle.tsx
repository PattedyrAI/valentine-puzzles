import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WordSearchPuzzleProps {
  onSolve: () => void;
  isSolved: boolean;
}

const GRID: string[][] = [
  ["R", "O", "M", "A", "N", "C", "E", "P", "Q", "W", "X", "Y"],
  ["H", "E", "A", "R", "T", "Z", "K", "I", "S", "S", "B", "C"],
  ["D", "E", "S", "I", "R", "E", "F", "G", "H", "J", "L", "M"],
  ["P", "A", "S", "S", "I", "O", "N", "R", "O", "S", "E", "N"],
  ["F", "O", "R", "E", "V", "E", "R", "T", "U", "V", "W", "X"],
  ["L", "O", "V", "E", "Y", "Z", "A", "B", "C", "D", "E", "F"],
  ["G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R"],
  ["S", "T", "U", "V", "W", "X", "Y", "Z", "A", "B", "C", "D"],
  ["E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P"],
  ["Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "A", "B"],
  ["C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"],
  ["O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
];

interface WordLocation {
  word: string;
  cells: [number, number][];
}

// Pre-defined word locations in the grid (row, col)
const WORD_LOCATIONS: WordLocation[] = [
  {
    word: "ROMANCE",
    cells: [
      [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
    ],
  },
  {
    word: "HEART",
    cells: [
      [1, 0], [1, 1], [1, 2], [1, 3], [1, 4],
    ],
  },
  {
    word: "KISS",
    cells: [
      [1, 7], [1, 8], [1, 9], [1, 9], // Actually K-I-S-S at (1,6),(1,7),(1,8),(1,9)
    ],
  },
  {
    word: "DESIRE",
    cells: [
      [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5],
    ],
  },
  {
    word: "PASSION",
    cells: [
      [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6],
    ],
  },
  {
    word: "ROSE",
    cells: [
      [3, 7], [3, 8], [3, 9], [3, 10],
    ],
  },
  {
    word: "FOREVER",
    cells: [
      [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6],
    ],
  },
  {
    word: "LOVE",
    cells: [
      [5, 0], [5, 1], [5, 2], [5, 3],
    ],
  },
];

// Fix KISS location
WORD_LOCATIONS[2].cells = [
  [1, 6], [1, 7], [1, 8], [1, 9],
];

function cellKey(r: number, c: number): string {
  return `${r}-${c}`;
}

function getCellsBetween(
  r1: number,
  c1: number,
  r2: number,
  c2: number
): [number, number][] | null {
  const dr = r2 - r1;
  const dc = c2 - c1;

  // Must be horizontal or vertical (for simplicity)
  if (dr !== 0 && dc !== 0) return null; // diagonal not supported per spec
  if (dr === 0 && dc === 0) return null;

  const steps = Math.max(Math.abs(dr), Math.abs(dc));
  const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
  const stepC = dc === 0 ? 0 : dc / Math.abs(dc);

  const cells: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    cells.push([r1 + i * stepR, c1 + i * stepC]);
  }
  return cells;
}

export default function WordSearchPuzzle({
  onSolve,
  isSolved,
}: WordSearchPuzzleProps) {
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    null
  );
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  const [highlightCells, setHighlightCells] = useState<Set<string>>(new Set());

  const allWords = WORD_LOCATIONS.map((wl) => wl.word);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (isSolved) return;

      if (!selectedCell) {
        // First click - select start
        setSelectedCell([row, col]);
        setHighlightCells(new Set([cellKey(row, col)]));
      } else {
        // Second click - check for word
        const [r1, c1] = selectedCell;
        const cells = getCellsBetween(r1, c1, row, col);

        if (cells) {
          const letters = cells.map(([r, c]) => GRID[r][c]).join("");

          const matchedWord = WORD_LOCATIONS.find((wl) => {
            const wordLetters = wl.cells.map(([r, c]) => GRID[r][c]).join("");
            return letters === wordLetters || letters === wordLetters.split("").reverse().join("");
          });

          if (matchedWord && !foundWords.has(matchedWord.word)) {
            const newFound = new Set(foundWords);
            newFound.add(matchedWord.word);
            setFoundWords(newFound);

            const newCells = new Set(foundCells);
            matchedWord.cells.forEach(([r, c]) => newCells.add(cellKey(r, c)));
            setFoundCells(newCells);

            if (newFound.size === allWords.length) {
              setTimeout(() => onSolve(), 600);
            }
          }
        }

        setSelectedCell(null);
        setHighlightCells(new Set());
      }
    },
    [selectedCell, foundWords, foundCells, allWords.length, isSolved, onSolve]
  );

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
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
        Click the <strong>first</strong> and <strong>last</strong> letter of
        each word (horizontal or vertical).
      </p>

      <div className="flex flex-col md:flex-row gap-6 w-full items-start justify-center">
        {/* Grid */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-3 md:p-4 shadow-xl">
          <div
            className="grid gap-0.5"
            style={{
              gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
            }}
          >
            {GRID.map((row, ri) =>
              row.map((letter, ci) => {
                const key = cellKey(ri, ci);
                const isFound = foundCells.has(key);
                const isHighlighted = highlightCells.has(key);
                const isSelected =
                  selectedCell &&
                  selectedCell[0] === ri &&
                  selectedCell[1] === ci;

                return (
                  <motion.button
                    key={key}
                    onClick={() => handleCellClick(ri, ci)}
                    whileTap={{ scale: 0.9 }}
                    className={`w-7 h-7 md:w-9 md:h-9 flex items-center justify-center text-xs md:text-sm font-bold rounded-md transition-all duration-200 select-none ${
                      isFound
                        ? "bg-amber-400/40 text-amber-200 border border-amber-400/50"
                        : isSelected || isHighlighted
                        ? "bg-rose-500/40 text-white border border-rose-400"
                        : "bg-white/5 text-rose-100 border border-white/10 hover:bg-white/15 hover:border-white/30"
                    }`}
                  >
                    {letter}
                  </motion.button>
                );
              })
            )}
          </div>
        </div>

        {/* Word list */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 md:p-5 shadow-xl min-w-[160px]">
          <h3 className="text-amber-400 font-semibold text-xs uppercase tracking-widest mb-3">
            Words to Find
          </h3>
          <div className="flex flex-col gap-2">
            {allWords.map((word) => {
              const found = foundWords.has(word);
              return (
                <div
                  key={word}
                  className={`flex items-center gap-2 transition-all duration-300 ${
                    found ? "opacity-60" : ""
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs border ${
                      found
                        ? "bg-amber-400 border-amber-400 text-rose-900"
                        : "border-white/20 text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                  <span
                    className={`font-mono text-sm tracking-wider ${
                      found
                        ? "line-through text-rose-300/60"
                        : "text-rose-100"
                    }`}
                  >
                    {word}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-white/10">
            <p className="text-rose-300/60 text-xs">
              Found: {foundWords.size}/{allWords.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
