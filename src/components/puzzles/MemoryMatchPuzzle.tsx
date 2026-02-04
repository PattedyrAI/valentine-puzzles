import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MemoryMatchPuzzleProps {
  onSolve: () => void;
  isSolved: boolean;
}

const EMOJIS = ["💕", "❤️", "🌹", "💋", "🥰", "😘", "💝", "🔥"];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createDeck(): Card[] {
  const pairs = [...EMOJIS, ...EMOJIS];
  const shuffled = shuffleArray(pairs);
  return shuffled.map((emoji, i) => ({
    id: i,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));
}

export default function MemoryMatchPuzzle({
  onSolve,
  isSolved,
}: MemoryMatchPuzzleProps) {
  const [cards, setCards] = useState<Card[]>(() => createDeck());
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [allMatched, setAllMatched] = useState(false);
  const [mathAnswer, setMathAnswer] = useState("");
  const [mathFeedback, setMathFeedback] = useState<string | null>(null);
  const lockRef = useRef(false);

  const handleFlip = useCallback(
    (id: number) => {
      if (lockRef.current || isSolved || allMatched) return;

      const card = cards.find((c) => c.id === id);
      if (!card || card.isFlipped || card.isMatched) return;

      if (flippedIds.length >= 2) return;

      const newCards = cards.map((c) =>
        c.id === id ? { ...c, isFlipped: true } : c
      );
      setCards(newCards);

      const newFlipped = [...flippedIds, id];
      setFlippedIds(newFlipped);

      if (newFlipped.length === 2) {
        setMoves((m) => m + 1);
        lockRef.current = true;

        const [firstId, secondId] = newFlipped;
        const first = newCards.find((c) => c.id === firstId)!;
        const second = newCards.find((c) => c.id === secondId)!;

        if (first.emoji === second.emoji) {
          // Match found
          setTimeout(() => {
            setCards((prev) => {
              const updated = prev.map((c) =>
                c.id === firstId || c.id === secondId
                  ? { ...c, isMatched: true }
                  : c
              );
              if (updated.every((c) => c.isMatched)) {
                setAllMatched(true);
              }
              return updated;
            });
            setFlippedIds([]);
            lockRef.current = false;
          }, 500);
        } else {
          // No match - flip back
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === firstId || c.id === secondId
                  ? { ...c, isFlipped: false }
                  : c
              )
            );
            setFlippedIds([]);
            lockRef.current = false;
          }, 1000);
        }
      }
    },
    [cards, flippedIds, isSolved, allMatched]
  );

  const checkMathAnswer = () => {
    if (mathAnswer.trim() === "25") {
      setMathFeedback("Correct!");
      onSolve();
    } else {
      setMathFeedback("Not quite... try again!");
      setMathAnswer("");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto">
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

      {/* Move counter */}
      <div className="text-rose-200 text-sm">
        Moves: <span className="text-amber-400 font-bold">{moves}</span>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-4 gap-3 w-full max-w-sm">
        {cards.map((card) => {
          const isRevealed = card.isFlipped || card.isMatched;

          return (
            <motion.button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              className="aspect-square relative"
              style={{ perspective: "600px" }}
              whileTap={!isRevealed ? { scale: 0.95 } : {}}
            >
              <motion.div
                className="w-full h-full relative"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: isRevealed ? 180 : 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {/* Front (face down) */}
                <div
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-rose-800 to-rose-900 border-2 border-rose-600/50 flex items-center justify-center shadow-lg"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <span className="text-rose-400/40 text-2xl">?</span>
                </div>

                {/* Back (face up) */}
                <div
                  className={`absolute inset-0 rounded-xl flex items-center justify-center shadow-lg border-2 ${
                    card.isMatched
                      ? "bg-amber-400/20 border-amber-400/50"
                      : "bg-white/10 border-white/20"
                  }`}
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <span className="text-3xl md:text-4xl">{card.emoji}</span>
                </div>
              </motion.div>
            </motion.button>
          );
        })}
      </div>

      {/* Math puzzle after all cards matched */}
      <AnimatePresence>
        {allMatched && !isSolved && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl text-center"
          >
            <h3 className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">
              Final Challenge
            </h3>
            <p className="text-rose-100 text-lg mb-4">
              Great memory! Now tell me:{" "}
              <span className="text-amber-300 font-semibold">
                What is the house number? (Hint: 20 + 5 = ?)
              </span>
            </p>

            <div className="flex gap-3 justify-center">
              <input
                type="text"
                inputMode="numeric"
                value={mathAnswer}
                onChange={(e) => setMathAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && checkMathAnswer()}
                placeholder="?"
                className="w-24 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-center text-xl font-bold placeholder-rose-300/40 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30"
              />
              <motion.button
                onClick={checkMathAnswer}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-rose-900 font-bold rounded-xl shadow-md"
              >
                Submit
              </motion.button>
            </div>

            <AnimatePresence>
              {mathFeedback && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`mt-3 font-semibold ${
                    mathFeedback === "Correct!"
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }`}
                >
                  {mathFeedback}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
