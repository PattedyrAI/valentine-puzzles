import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WallePuzzleProps {
  onSolve: () => void;
  isSolved: boolean;
}

interface Item {
  id: string;
  emoji: string;
  name: string;
  bin: BinType;
}

type BinType = "plants" | "treasures" | "recycling";

const ALL_ITEMS: Item[] = [
  { id: "rose", emoji: "\u{1F339}", name: "Rose", bin: "plants" },
  { id: "sunflower", emoji: "\u{1F33B}", name: "Sunflower", bin: "plants" },
  { id: "oak-leaf", emoji: "\u{1F343}", name: "Oak Leaf", bin: "plants" },
  { id: "daisy", emoji: "\u{1F33C}", name: "Daisy", bin: "plants" },
  { id: "diamond-ring", emoji: "\u{1F48D}", name: "Diamond Ring", bin: "treasures" },
  { id: "music-box", emoji: "\u{1F3B5}", name: "Music Box", bin: "treasures" },
  { id: "rubiks-cube", emoji: "\u{1F9CA}", name: "Rubik's Cube", bin: "treasures" },
  { id: "spork", emoji: "\u{1F944}", name: "Spork", bin: "treasures" },
  { id: "tin-can", emoji: "\u{1F96B}", name: "Tin Can", bin: "recycling" },
  { id: "old-boot", emoji: "\u{1F462}", name: "Old Boot", bin: "recycling" },
  { id: "newspaper", emoji: "\u{1F4F0}", name: "Newspaper", bin: "recycling" },
  { id: "plastic-bottle", emoji: "\u{1F9F4}", name: "Plastic Bottle", bin: "recycling" },
];

const BINS: { type: BinType; label: string; color: string; borderColor: string; bgColor: string }[] = [
  {
    type: "plants",
    label: "EVE's Plants",
    color: "text-green-400",
    borderColor: "border-green-500",
    bgColor: "bg-green-500/20",
  },
  {
    type: "treasures",
    label: "WALL-E's Treasures",
    color: "text-amber-400",
    borderColor: "border-amber-500",
    bgColor: "bg-amber-500/20",
  },
  {
    type: "recycling",
    label: "Axiom Recycling",
    color: "text-blue-400",
    borderColor: "border-blue-500",
    bgColor: "bg-blue-500/20",
  },
];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function WallePuzzle({ onSolve, isSolved }: WallePuzzleProps) {
  const [pool, setPool] = useState<Item[]>(() => shuffleArray([...ALL_ITEMS]));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sortedCount, setSortedCount] = useState(0);
  const [binContents, setBinContents] = useState<Record<BinType, Item[]>>({
    plants: [],
    treasures: [],
    recycling: [],
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [shakingId, setShakingId] = useState<string | null>(null);
  const [flyingItem, setFlyingItem] = useState<{ item: Item; bin: BinType } | null>(null);
  const solvedRef = useRef(false);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleItemClick = useCallback(
    (id: string) => {
      if (isSolved || flyingItem) return;
      setSelectedId((prev) => (prev === id ? null : id));
      setErrorMsg(null);
    },
    [isSolved, flyingItem]
  );

  const handleBinClick = useCallback(
    (binType: BinType) => {
      if (isSolved || !selectedId || flyingItem) return;

      const item = pool.find((i) => i.id === selectedId);
      if (!item) return;

      if (item.bin === binType) {
        // Correct placement
        setFlyingItem({ item, bin: binType });
        setPool((prev) => prev.filter((i) => i.id !== item.id));
        setSelectedId(null);
        setErrorMsg(null);

        // After animation, add to bin
        setTimeout(() => {
          setBinContents((prev) => ({
            ...prev,
            [binType]: [...prev[binType], item],
          }));
          setFlyingItem(null);
          const newCount = sortedCount + 1;
          setSortedCount(newCount);

          if (newCount === 12 && !solvedRef.current) {
            solvedRef.current = true;
            setTimeout(() => onSolve(), 400);
          }
        }, 400);
      } else {
        // Wrong bin
        setShakingId(item.id);
        setErrorMsg("Beep boop! Try another bin");

        if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
        errorTimerRef.current = setTimeout(() => {
          setShakingId(null);
          setErrorMsg(null);
        }, 1200);
      }
    },
    [isSolved, selectedId, pool, flyingItem, sortedCount, onSolve]
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.h2
          className="text-2xl font-bold text-yellow-400 font-accent"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Directive: Sort!
        </motion.h2>
        <p className="text-yellow-200/70 text-sm">
          Everything belongs somewhere, Julie. Help find the right place for each one.
        </p>
        <div className="text-amber-400 font-semibold text-lg">
          {sortedCount}/12 sorted
        </div>
      </div>

      {/* Solved badge */}
      {isSolved && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500 text-yellow-300 font-semibold">
            Directive complete!
          </span>
        </motion.div>
      )}

      {/* Error message */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-red-400 text-sm font-medium"
          >
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Item pool */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        <AnimatePresence>
          {pool.map((item) => (
            <motion.button
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: shakingId === item.id ? [0, -6, 6, -6, 6, 0] : 0,
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{
                duration: shakingId === item.id ? 0.4 : 0.25,
                ease: "easeOut" as const,
              }}
              onClick={() => handleItemClick(item.id)}
              disabled={isSolved}
              className={`
                flex flex-col items-center gap-1 p-3 rounded-xl
                bg-white/10 backdrop-blur-sm cursor-pointer
                transition-colors duration-150
                ${
                  selectedId === item.id
                    ? "border-2 border-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.4)]"
                    : "border-2 border-white/10 hover:border-yellow-400/50"
                }
              `}
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-xs text-white/80 leading-tight text-center">
                {item.name}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Flying item animation */}
      <AnimatePresence>
        {flyingItem && (
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0.7, scale: 0.6, y: 40 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeIn" as const }}
            className="fixed pointer-events-none z-50 text-3xl"
            style={{ top: "50%", left: "50%" }}
          >
            {flyingItem.item.emoji}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bins */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {BINS.map((bin) => (
          <motion.button
            key={bin.type}
            whileHover={selectedId ? { scale: 1.03 } : {}}
            whileTap={selectedId ? { scale: 0.97 } : {}}
            onClick={() => handleBinClick(bin.type)}
            disabled={isSolved || !selectedId}
            className={`
              rounded-2xl p-4 min-h-[140px] flex flex-col
              border-2 border-dashed transition-all duration-200
              ${bin.borderColor} ${bin.bgColor}
              ${
                selectedId && !isSolved
                  ? "cursor-pointer hover:shadow-lg"
                  : "cursor-default opacity-80"
              }
            `}
          >
            <span className={`font-semibold text-sm mb-2 ${bin.color}`}>
              {bin.label}
            </span>
            <div className="flex flex-wrap gap-1 flex-1">
              {binContents[bin.type].map((item) => (
                <motion.span
                  key={item.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="text-lg"
                  title={item.name}
                >
                  {item.emoji}
                </motion.span>
              ))}
            </div>
            <span className="text-xs text-white/40 mt-1">
              {binContents[bin.type].length}/4
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
