import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CipherPuzzleProps {
  onSolve: () => void;
  isSolved: boolean;
}

const ENCRYPTED = "SVCL PZ H QVBYULF AOHA ILNPUZ DPAO H ZPUNSL OLHYAILHA";
const PLAINTEXT = "LOVE IS A JOURNEY THAT BEGINS WITH A SINGLE HEARTBEAT";

function decrypt(text: string, shift: number): string {
  return text
    .split("")
    .map((ch) => {
      if (ch >= "A" && ch <= "Z") {
        const code = ((ch.charCodeAt(0) - 65 - shift + 26) % 26) + 65;
        return String.fromCharCode(code);
      }
      return ch;
    })
    .join("");
}

export default function CipherPuzzle({ onSolve, isSolved }: CipherPuzzleProps) {
  const [shift, setShift] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const decrypted = decrypt(ENCRYPTED, shift);
  const isCorrect = decrypted === PLAINTEXT;

  const handleSubmit = () => {
    if (isCorrect && !isSolved) {
      setSubmitted(true);
      onSolve();
    }
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

      {/* Intro text */}
      <p className="text-rose-200 text-center text-sm md:text-base">
        A secret message has been encrypted using a Caesar cipher. Shift the
        alphabet to reveal the hidden love note.
      </p>

      {/* Encrypted message card */}
      <div className="w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
        <h3 className="text-amber-400 font-semibold text-xs uppercase tracking-widest mb-3">
          Encrypted Message
        </h3>
        <p className="font-mono text-rose-100 text-sm md:text-base leading-relaxed tracking-wide break-words">
          {ENCRYPTED}
        </p>
      </div>

      {/* Shift control */}
      <div className="w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-amber-400 font-semibold text-xs uppercase tracking-widest">
            Shift Value
          </h3>
          <span className="text-white font-mono text-2xl font-bold bg-white/10 px-4 py-1 rounded-lg">
            {shift}
          </span>
        </div>

        {/* Slider */}
        <input
          type="range"
          min={0}
          max={25}
          value={shift}
          onChange={(e) => setShift(parseInt(e.target.value))}
          disabled={isSolved}
          className="w-full h-2 bg-rose-900/50 rounded-lg appearance-none cursor-pointer accent-amber-400"
        />

        {/* Quick buttons */}
        <div className="flex flex-wrap gap-1.5 mt-4 justify-center">
          {Array.from({ length: 26 }, (_, i) => (
            <button
              key={i}
              onClick={() => setShift(i)}
              disabled={isSolved}
              className={`w-8 h-8 rounded-md text-xs font-mono font-bold transition-all ${
                shift === i
                  ? "bg-amber-400 text-rose-900 scale-110 shadow-md shadow-amber-400/40"
                  : "bg-white/10 text-rose-200 hover:bg-white/20"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      {/* Decrypted result */}
      <motion.div
        className={`w-full backdrop-blur-md border rounded-2xl p-6 shadow-xl transition-colors duration-500 ${
          isCorrect
            ? "bg-amber-400/20 border-amber-400/50"
            : "bg-white/10 border-white/20"
        }`}
        animate={isCorrect ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 0.4 }}
      >
        <h3 className="text-amber-400 font-semibold text-xs uppercase tracking-widest mb-3">
          Decrypted Result
        </h3>
        <p
          className={`font-mono text-sm md:text-base leading-relaxed tracking-wide break-words ${
            isCorrect ? "text-amber-200 font-bold" : "text-rose-100"
          }`}
        >
          {decrypted}
        </p>
      </motion.div>

      {/* Submit button */}
      {!isSolved && (
        <motion.button
          onClick={handleSubmit}
          disabled={!isCorrect}
          whileHover={isCorrect ? { scale: 1.05 } : {}}
          whileTap={isCorrect ? { scale: 0.95 } : {}}
          className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 ${
            isCorrect
              ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-rose-900 shadow-lg shadow-amber-400/30 cursor-pointer"
              : "bg-white/10 text-rose-300/50 cursor-not-allowed"
          }`}
        >
          {submitted ? "Submitted!" : "Submit Decoded Message"}
        </motion.button>
      )}
    </div>
  );
}
