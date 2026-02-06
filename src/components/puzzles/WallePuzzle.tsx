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
  { id: "sunflower", emoji: "\u{1F33B}", name: "Solsikke", bin: "plants" },
  { id: "oak-leaf", emoji: "\u{1F343}", name: "Eikeblad", bin: "plants" },
  { id: "daisy", emoji: "\u{1F33C}", name: "Tusenfryd", bin: "plants" },
  { id: "diamond-ring", emoji: "\u{1F48D}", name: "Diamantring", bin: "treasures" },
  { id: "music-box", emoji: "\u{1F3B5}", name: "Musikkboks", bin: "treasures" },
  { id: "rubiks-cube", emoji: "\u{1F9CA}", name: "Rubiks kube", bin: "treasures" },
  { id: "spork", emoji: "\u{1F944}", name: "Gaffelskje", bin: "treasures" },
  { id: "tin-can", emoji: "\u{1F96B}", name: "Blikkboks", bin: "recycling" },
  { id: "old-boot", emoji: "\u{1F462}", name: "Gammel st\u00F8vel", bin: "recycling" },
  { id: "newspaper", emoji: "\u{1F4F0}", name: "Avis", bin: "recycling" },
  { id: "plastic-bottle", emoji: "\u{1F9F4}", name: "Plastflaske", bin: "recycling" },
];

const BINS: { type: BinType; label: string; color: string; borderColor: string; bgColor: string }[] = [
  { type: "plants", label: "EVEs planter", color: "text-green-400/80", borderColor: "border-green-500/30", bgColor: "bg-green-500/10" },
  { type: "treasures", label: "WALL-Es skatter", color: "text-amber-400/80", borderColor: "border-amber-500/30", bgColor: "bg-amber-500/10" },
  { type: "recycling", label: "Axiom-gjenvinning", color: "text-blue-400/80", borderColor: "border-blue-500/30", bgColor: "bg-blue-500/10" },
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
  const [binContents, setBinContents] = useState<Record<BinType, Item[]>>({ plants: [], treasures: [], recycling: [] });
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
        setFlyingItem({ item, bin: binType });
        setPool((prev) => prev.filter((i) => i.id !== item.id));
        setSelectedId(null);
        setErrorMsg(null);

        setTimeout(() => {
          setBinContents((prev) => ({ ...prev, [binType]: [...prev[binType], item] }));
          setFlyingItem(null);
          const newCount = sortedCount + 1;
          setSortedCount(newCount);
          if (newCount === 12 && !solvedRef.current) {
            solvedRef.current = true;
            setTimeout(() => onSolve(), 400);
          }
        }, 400);
      } else {
        setShakingId(item.id);
        setErrorMsg("Biip buup! Pr\u00F8v en annen boks");
        if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
        errorTimerRef.current = setTimeout(() => { setShakingId(null); setErrorMsg(null); }, 1200);
      }
    },
    [isSolved, selectedId, pool, flyingItem, sortedCount, onSolve]
  );

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="text-white/40 text-sm font-medium">
          {sortedCount}/12 sortert
        </div>
      </div>

      {isSolved && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <span className="inline-block px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-300/80 text-sm font-medium">
            Direktiv fullf&oslash;rt!
          </span>
        </motion.div>
      )}

      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-red-400/70 text-xs font-medium"
          >
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Item pool */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
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
              transition={{ duration: shakingId === item.id ? 0.4 : 0.25, ease: "easeOut" as const }}
              onClick={() => handleItemClick(item.id)}
              disabled={isSolved}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-150 ${
                selectedId === item.id
                  ? "bg-[#252015] border-2 border-yellow-400/70 shadow-[0_0_16px_rgba(250,204,21,0.2)]"
                  : "bg-[#161820] border-2 border-[#3a3d50] hover:border-yellow-400/40"
              }`}
            >
              <span className="text-xl">{item.emoji}</span>
              <span className="text-[10px] text-white/50 leading-tight text-center">{item.name}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {BINS.map((bin) => (
          <motion.button
            key={bin.type}
            whileHover={selectedId ? { scale: 1.02 } : {}}
            whileTap={selectedId ? { scale: 0.98 } : {}}
            onClick={() => handleBinClick(bin.type)}
            disabled={isSolved || !selectedId}
            className={`rounded-2xl p-4 min-h-[120px] flex flex-col border-2 border-dashed transition-all duration-200 ${bin.borderColor} ${bin.bgColor} ${
              selectedId && !isSolved ? "hover:shadow-lg hover:border-solid" : "opacity-70"
            }`}
          >
            <span className={`font-medium text-xs mb-2 ${bin.color}`}>{bin.label}</span>
            <div className="flex flex-wrap gap-1 flex-1">
              {binContents[bin.type].map((item) => (
                <motion.span
                  key={item.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="text-base"
                  title={item.name}
                >
                  {item.emoji}
                </motion.span>
              ))}
            </div>
            <span className="text-[10px] text-white/25 mt-1">
              {binContents[bin.type].length}/4
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
