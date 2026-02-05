import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BridgertonPuzzleProps {
  onSolve: () => void;
  isSolved: boolean;
}

const ENCRYPTED =
  "TLHYLZA YLHKLY AOL KBRL OHZ MPUHSSF MVBUK OPZ KBJOLZZ HUK AOL AVU OHZ ZAPTYLK OLY OLHYA";
const PLAINTEXT =
  "DEAREST READER THE DUKE HAS FINALLY FOUND HIS DUCHESS AND THE TON HAS STIRRED HER HEART";
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

const Flourish = () => (
  <div className="flex items-center justify-center gap-3 my-2 select-none">
    <span className="block w-12 h-px bg-amber-400/50" />
    <span className="text-amber-400/70 text-sm">&#10087;</span>
    <span className="block w-12 h-px bg-amber-400/50" />
  </div>
);

export default function BridgertonPuzzle({
  onSolve,
  isSolved,
}: BridgertonPuzzleProps) {
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
            className="bg-gradient-to-r from-amber-400 to-yellow-500 text-rose-900 font-bold px-6 py-2 rounded-full shadow-lg text-lg"
          >
            &#10003; Decoded by the Ton
          </motion.div>
        )}
      </AnimatePresence>

      {/* Intro text */}
      <p className="text-rose-200 text-center text-sm md:text-base italic">
        &ldquo;Dearest Julie, a cryptic note has been intercepted from Lady Whistledown
        herself. Only the cleverest of the ton can decode it. Will you be the one?&rdquo;
      </p>

      <Flourish />

      {/* Parchment / encrypted message card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
        className="w-full backdrop-blur-md bg-amber-900/20 border border-amber-400/30 rounded-2xl p-6 shadow-xl"
      >
        <h3
          className="text-amber-300 font-semibold text-center text-base md:text-lg tracking-wide mb-1"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Lady Whistledown&rsquo;s Society Papers
        </h3>
        <Flourish />
        <p
          className="text-amber-100/90 text-sm md:text-base leading-relaxed tracking-wide break-words mt-3 italic"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {ENCRYPTED}
        </p>
      </motion.div>

      {/* Shift control */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] as const }}
        className="w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-amber-400 font-semibold text-xs uppercase tracking-widest">
            Cipher Shift
          </h3>
          <span className="text-white font-mono text-2xl font-bold bg-amber-400/15 border border-amber-400/30 px-4 py-1 rounded-lg">
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
          className="w-full h-2 bg-amber-900/50 rounded-lg appearance-none cursor-pointer accent-amber-400"
        />

        {/* Quick-select buttons */}
        <div className="flex flex-wrap gap-1.5 mt-4 justify-center">
          {Array.from({ length: 26 }, (_, i) => (
            <button
              key={i}
              onClick={() => setShift(i)}
              disabled={isSolved}
              className={`w-8 h-8 rounded-md text-xs font-mono font-bold transition-all ${
                shift === i
                  ? "bg-amber-400 text-rose-900 scale-110 shadow-md shadow-amber-400/40"
                  : "bg-white/10 text-rose-200 hover:bg-amber-400/20 hover:text-amber-200"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {i}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Decoded result card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={
          isCorrect
            ? { opacity: 1, y: 0, scale: [1, 1.02, 1] }
            : { opacity: 1, y: 0 }
        }
        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
        className={`w-full backdrop-blur-md border rounded-2xl p-6 shadow-xl transition-colors duration-500 ${
          isCorrect
            ? "bg-gradient-to-br from-amber-400/20 to-yellow-300/10 border-amber-400/50"
            : "bg-white/10 border-white/20"
        }`}
      >
        <h3 className="text-amber-400 font-semibold text-xs uppercase tracking-widest mb-1">
          Decoded Gossip
        </h3>
        <Flourish />
        <p
          className={`text-sm md:text-base leading-relaxed tracking-wide break-words mt-2 ${
            isCorrect
              ? "text-amber-200 font-bold"
              : "text-rose-100/80 italic"
          }`}
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {decrypted}
        </p>
        {isCorrect && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-amber-400/70 text-xs mt-3 text-center italic"
          >
            &mdash; Yours Truly, Lady Whistledown
          </motion.p>
        )}
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
          style={
            isCorrect ? { fontFamily: "'Playfair Display', serif" } : undefined
          }
        >
          {submitted ? "Published!" : "Publish the Gossip"}
        </motion.button>
      )}
    </div>
  );
}
