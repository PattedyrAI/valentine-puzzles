import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RiddlePuzzleProps {
  onSolve: () => void;
  isSolved: boolean;
}

interface Riddle {
  question: string;
  acceptedAnswers: string[];
  hintLetter: string;
}

const RIDDLES: Riddle[] = [
  {
    question:
      "I wear a crown but have no kingdom. In Norway, I'm called 'Dronning'. What am I?",
    acceptedAnswers: ["queen", "dronning"],
    hintLetter: "Q",
  },
  {
    question:
      "I'm what you walk through or drive on. In Norwegian, I'm a 'gate'. What am I?",
    acceptedAnswers: ["street", "gate", "road"],
    hintLetter: "S",
  },
  {
    question:
      "Put the Norwegian queen and street together \u2014 what's the first word of your destination?",
    acceptedAnswers: ["dronningens", "dronningens gate"],
    hintLetter: "D",
  },
];

export default function RiddlePuzzle({ onSolve, isSolved }: RiddlePuzzleProps) {
  const [currentRiddle, setCurrentRiddle] = useState(0);
  const [answer, setAnswer] = useState("");
  const [wrongAttempts, setWrongAttempts] = useState<number[]>([0, 0, 0]);
  const [showHint, setShowHint] = useState<boolean[]>([false, false, false]);
  const [shake, setShake] = useState(false);
  const [solvedRiddles, setSolvedRiddles] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const riddle = RIDDLES[currentRiddle];

  const checkAnswer = () => {
    const trimmed = answer.trim().toLowerCase();
    if (!trimmed) return;

    if (riddle.acceptedAnswers.includes(trimmed)) {
      // Correct
      const newSolved = [...solvedRiddles];
      newSolved[currentRiddle] = true;
      setSolvedRiddles(newSolved);
      setFeedback("Correct!");
      setAnswer("");

      setTimeout(() => {
        setFeedback(null);
        if (currentRiddle < 2) {
          setCurrentRiddle(currentRiddle + 1);
        } else {
          // All solved
          onSolve();
        }
      }, 1200);
    } else {
      // Wrong
      const newAttempts = [...wrongAttempts];
      newAttempts[currentRiddle]++;
      setWrongAttempts(newAttempts);

      if (newAttempts[currentRiddle] >= 3) {
        const newHints = [...showHint];
        newHints[currentRiddle] = true;
        setShowHint(newHints);
      }

      setShake(true);
      setFeedback("Not quite... try again!");
      setTimeout(() => {
        setShake(false);
        setFeedback(null);
      }, 800);
      setAnswer("");
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") checkAnswer();
  };

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

      {/* Progress indicators */}
      <div className="flex gap-3">
        {RIDDLES.map((_, i) => (
          <div
            key={i}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${
              solvedRiddles[i]
                ? "bg-amber-400 border-amber-400 text-rose-900"
                : i === currentRiddle
                ? "border-amber-400 text-amber-400 bg-amber-400/10"
                : "border-white/20 text-white/40 bg-white/5"
            }`}
          >
            {solvedRiddles[i] ? "✓" : i + 1}
          </div>
        ))}
      </div>

      {/* Current riddle card */}
      {!isSolved && (
        <motion.div
          key={currentRiddle}
          initial={{ opacity: 0, x: 40 }}
          animate={{
            opacity: 1,
            x: 0,
            rotate: shake ? [0, -2, 2, -2, 2, 0] : 0,
          }}
          transition={{ duration: shake ? 0.4 : 0.5 }}
          className="w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 md:p-8 shadow-xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-amber-400 font-semibold text-xs uppercase tracking-widest">
              Riddle {currentRiddle + 1} of 3
            </span>
          </div>

          <p className="text-rose-100 text-lg md:text-xl leading-relaxed mb-6 italic">
            &ldquo;{riddle.question}&rdquo;
          </p>

          {/* Hint */}
          <AnimatePresence>
            {showHint[currentRiddle] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-4 bg-amber-400/10 border border-amber-400/30 rounded-lg px-4 py-2"
              >
                <p className="text-amber-300 text-sm">
                  Hint: The answer starts with &ldquo;
                  <span className="font-bold font-mono">
                    {riddle.hintLetter}
                  </span>
                  &rdquo;
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input */}
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your answer..."
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-rose-300/40 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 transition-all"
            />
            <motion.button
              onClick={checkAnswer}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-rose-900 font-bold rounded-xl shadow-md shadow-amber-400/20"
            >
              Check
            </motion.button>
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {feedback && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-4 text-center font-semibold ${
                  feedback === "Correct!" ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {feedback}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Wrong attempt counter */}
          {wrongAttempts[currentRiddle] > 0 &&
            !showHint[currentRiddle] && (
              <p className="mt-3 text-rose-400/60 text-xs text-center">
                {3 - wrongAttempts[currentRiddle]} attempt
                {3 - wrongAttempts[currentRiddle] !== 1 ? "s" : ""} until hint
                unlocks
              </p>
            )}
        </motion.div>
      )}

      {/* Completed state */}
      {isSolved && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full backdrop-blur-md bg-amber-400/10 border border-amber-400/30 rounded-2xl p-6 text-center"
        >
          <p className="text-amber-200 text-lg">
            You found the destination:{" "}
            <span className="font-bold text-amber-400">Dronningens Gate</span>
          </p>
        </motion.div>
      )}
    </div>
  );
}
