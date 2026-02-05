import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface KpopDemonPuzzleProps {
  onSolve: () => void;
  isSolved: boolean;
}

type GameState = "idle" | "showing" | "input" | "success" | "fail";

interface Attack {
  id: number;
  name: string;
  emoji: string;
  color: string;
  glowColor: string;
  bgColor: string;
  borderColor: string;
}

const ATTACKS: Attack[] = [
  {
    id: 0,
    name: "Fire Strike",
    emoji: "\u{1F525}",
    color: "from-red-500 to-orange-500",
    glowColor: "shadow-red-500/60",
    bgColor: "bg-red-900/40",
    borderColor: "border-red-500/50",
  },
  {
    id: 1,
    name: "Shadow Slash",
    emoji: "\u2694\uFE0F",
    color: "from-purple-500 to-fuchsia-500",
    glowColor: "shadow-purple-500/60",
    bgColor: "bg-purple-900/40",
    borderColor: "border-purple-500/50",
  },
  {
    id: 2,
    name: "Spirit Shield",
    emoji: "\u{1F6E1}\uFE0F",
    color: "from-blue-500 to-cyan-500",
    glowColor: "shadow-blue-500/60",
    bgColor: "bg-blue-900/40",
    borderColor: "border-blue-500/50",
  },
  {
    id: 3,
    name: "Thunder Bolt",
    emoji: "\u26A1",
    color: "from-yellow-400 to-amber-500",
    glowColor: "shadow-yellow-400/60",
    bgColor: "bg-yellow-900/40",
    borderColor: "border-yellow-500/50",
  },
];

const TOTAL_ROUNDS = 7;
const BASE_SEQUENCE_LENGTH = 4;
const FLASH_DURATION = 400;
const FLASH_GAP = 250;

function generateSequence(length: number): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * 4));
}

export default function KpopDemonPuzzle({
  onSolve,
  isSolved,
}: KpopDemonPuzzleProps) {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [round, setRound] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [clickedButton, setClickedButton] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
  }, []);

  useEffect(() => {
    return () => clearTimeouts();
  }, [clearTimeouts]);

  const playSequence = useCallback(
    (seq: number[]) => {
      clearTimeouts();
      setGameState("showing");
      setActiveButton(null);
      setMessage("");

      seq.forEach((attackId, index) => {
        const showTimeout = setTimeout(() => {
          setActiveButton(attackId);
        }, index * (FLASH_DURATION + FLASH_GAP));

        const hideTimeout = setTimeout(() => {
          setActiveButton(null);
        }, index * (FLASH_DURATION + FLASH_GAP) + FLASH_DURATION);

        timeoutRefs.current.push(showTimeout, hideTimeout);
      });

      const finishTimeout = setTimeout(() => {
        setGameState("input");
        setPlayerInput([]);
        setMessage("Your turn! Repeat the combo!");
      }, seq.length * (FLASH_DURATION + FLASH_GAP));

      timeoutRefs.current.push(finishTimeout);
    },
    [clearTimeouts]
  );

  const startBattle = useCallback(() => {
    const seqLength = BASE_SEQUENCE_LENGTH;
    const seq = generateSequence(seqLength);
    setRound(1);
    setSequence(seq);
    setPlayerInput([]);
    playSequence(seq);
  }, [playSequence]);

  const startRound = useCallback(
    (roundNum: number) => {
      const seqLength = BASE_SEQUENCE_LENGTH + (roundNum - 1);
      const seq = generateSequence(seqLength);
      setSequence(seq);
      setPlayerInput([]);
      playSequence(seq);
    },
    [playSequence]
  );

  const handleAttack = useCallback(
    (attackId: number) => {
      if (gameState !== "input" || isSolved) return;

      setClickedButton(attackId);
      setTimeout(() => setClickedButton(null), 200);

      const newInput = [...playerInput, attackId];
      setPlayerInput(newInput);

      const currentIndex = newInput.length - 1;

      if (newInput[currentIndex] !== sequence[currentIndex]) {
        setGameState("fail");
        setMessage("Demon wins! Try again...");

        const retryTimeout = setTimeout(() => {
          playSequence(sequence);
        }, 1500);
        timeoutRefs.current.push(retryTimeout);
        return;
      }

      if (newInput.length === sequence.length) {
        if (round >= TOTAL_ROUNDS) {
          setGameState("success");
          setMessage("Victory! The demon is defeated!");
          onSolve();
        } else {
          setGameState("success");
          setMessage(`Round ${round} cleared! Prepare for the next wave...`);

          const nextRound = round + 1;
          const nextTimeout = setTimeout(() => {
            setRound(nextRound);
            startRound(nextRound);
          }, 1800);
          timeoutRefs.current.push(nextTimeout);
        }
      }
    },
    [
      gameState,
      isSolved,
      playerInput,
      sequence,
      round,
      onSolve,
      playSequence,
      startRound,
    ]
  );

  const progressDots = sequence.length > 0 && gameState === "input"
    ? sequence.map((_, i) => {
        if (i < playerInput.length) return "correct";
        return "pending";
      })
    : [];

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      {/* Solved badge */}
      <AnimatePresence>
        {isSolved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-purple-400 to-fuchsia-500 text-white font-bold px-6 py-2 rounded-full shadow-lg text-lg"
          >
            ✓ Demon Defeated!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header area */}
      <div className="text-center">
        <p className="text-purple-300/70 text-sm font-accent tracking-wide mb-1">
          전투 시작! — Battle Start!
        </p>
        {gameState !== "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-purple-200 text-lg font-semibold"
          >
            Round{" "}
            <span className="text-purple-400 font-bold">{round}</span>
            <span className="text-purple-400/60">/{TOTAL_ROUNDS}</span>
          </motion.div>
        )}
      </div>

      {/* Start button */}
      <AnimatePresence>
        {gameState === "idle" && !isSolved && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center gap-4"
          >
            <p className="text-purple-200/80 text-center text-sm max-w-xs">
              A demon has appeared! Memorize its attack pattern and
              counter with the same combo to survive all 7 waves. You&apos;ve got this, Julie.
            </p>
            <motion.button
              onClick={startBattle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-purple-500/30 border border-purple-400/30"
            >
              Start Battle
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attack grid */}
      {(gameState !== "idle" || isSolved) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" as const }}
          className="grid grid-cols-2 gap-4 w-full max-w-xs"
        >
          {ATTACKS.map((attack) => {
            const isFlashing = activeButton === attack.id;
            const isClicked = clickedButton === attack.id;
            const isDisabled =
              gameState === "showing" || gameState === "idle" || isSolved;

            return (
              <motion.button
                key={attack.id}
                onClick={() => handleAttack(attack.id)}
                disabled={isDisabled}
                animate={{
                  scale: isFlashing ? 1.15 : isClicked ? 1.1 : 1,
                }}
                transition={{
                  duration: isFlashing ? 0.3 : 0.15,
                  ease: "easeOut" as const,
                }}
                className={`
                  relative aspect-square rounded-full flex flex-col items-center justify-center
                  border-2 transition-colors duration-200
                  ${attack.bgColor} ${attack.borderColor}
                  ${
                    isDisabled && !isFlashing
                      ? "opacity-60 cursor-not-allowed"
                      : "cursor-pointer hover:opacity-90"
                  }
                  ${
                    isFlashing
                      ? `shadow-2xl ${attack.glowColor} border-white/60 !opacity-100`
                      : ""
                  }
                  ${isClicked ? `shadow-lg ${attack.glowColor}` : ""}
                `}
              >
                {isFlashing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    exit={{ opacity: 0 }}
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${attack.color} blur-sm`}
                  />
                )}
                <span className="text-4xl md:text-5xl relative z-10">
                  {attack.emoji}
                </span>
                <span className="text-[10px] mt-1 text-white/60 font-semibold uppercase tracking-wider relative z-10">
                  {attack.name}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      )}

      {/* Progress dots */}
      {progressDots.length > 0 && (
        <div className="flex gap-2 justify-center flex-wrap">
          {progressDots.map((status, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`w-3 h-3 rounded-full ${
                status === "correct"
                  ? "bg-purple-400"
                  : "bg-white/20 border border-white/30"
              }`}
            />
          ))}
        </div>
      )}

      {/* Message area */}
      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" as const }}
            className={`text-center font-semibold text-sm px-4 py-2 rounded-xl backdrop-blur-md ${
              gameState === "fail"
                ? "text-red-300 bg-red-900/30 border border-red-500/30"
                : gameState === "success"
                ? "text-purple-200 bg-purple-900/30 border border-purple-400/30"
                : "text-purple-200/80"
            }`}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
