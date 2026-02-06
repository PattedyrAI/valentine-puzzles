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
    <span className="block w-12 h-px bg-amber-400/30" />
    <span className="text-amber-400/50 text-sm">&#10087;</span>
    <span className="block w-12 h-px bg-amber-400/30" />
  </div>
);

export default function BridgertonPuzzle({ onSolve, isSolved }: BridgertonPuzzleProps) {
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
    <div className="flex flex-col items-center gap-5">
      <AnimatePresence>
        {isSolved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-5 py-2 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-300/80 text-sm font-medium"
          >
            Dechiffrert av selskapet
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-white/40 text-center text-sm italic">
        &laquo;Kj&aelig;re Julie, et kryptisk brev fra Lady Whistledown selv
        er blitt fanget opp. Bare de klokeste kan tyde det.&raquo;
      </p>

      <Flourish />

      {/* Encrypted message */}
      <div className="w-full rounded-xl bg-amber-900/10 border border-amber-400/15 p-5">
        <h3
          className="text-amber-300/70 font-semibold text-center text-sm tracking-wide mb-1"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Lady Whistledowns selskapsavis
        </h3>
        <Flourish />
        <p
          className="text-amber-100/60 text-xs leading-relaxed tracking-wide break-words mt-2 italic"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {ENCRYPTED}
        </p>
      </div>

      {/* Shift control */}
      <div className="w-full rounded-xl bg-white/[0.03] border border-white/[0.06] p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-amber-400/60 font-semibold text-[10px] uppercase tracking-widest">
            Chifferskift
          </h3>
          <span className="text-white/80 font-mono text-xl font-bold bg-amber-400/10 border border-amber-400/20 px-3 py-0.5 rounded-lg">
            {shift}
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={25}
          value={shift}
          onChange={(e) => setShift(parseInt(e.target.value))}
          disabled={isSolved}
          className="w-full h-1.5 bg-white/[0.06] rounded-lg appearance-none accent-amber-400"
        />

        <div className="flex flex-wrap gap-1 mt-3 justify-center">
          {Array.from({ length: 26 }, (_, i) => (
            <button
              key={i}
              onClick={() => setShift(i)}
              disabled={isSolved}
              className={`w-7 h-7 rounded text-[10px] font-mono font-bold transition-all ${
                shift === i
                  ? "bg-amber-400/80 text-black scale-110"
                  : "bg-white/[0.04] text-white/40 hover:bg-amber-400/15"
              } disabled:opacity-40`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      {/* Decoded result */}
      <div
        className={`w-full rounded-xl border p-5 transition-colors duration-500 ${
          isCorrect
            ? "bg-amber-400/10 border-amber-400/30"
            : "bg-white/[0.03] border-white/[0.06]"
        }`}
      >
        <h3 className="text-amber-400/50 font-semibold text-[10px] uppercase tracking-widest mb-1">
          Dechiffrert sladder
        </h3>
        <Flourish />
        <p
          className={`text-xs leading-relaxed tracking-wide break-words mt-2 ${
            isCorrect ? "text-amber-200/80 font-bold" : "text-white/50 italic"
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
            className="text-amber-400/40 text-[10px] mt-3 text-center italic"
          >
            &mdash; Din hengivne, Lady Whistledown
          </motion.p>
        )}
      </div>

      {!isSolved && (
        <motion.button
          onClick={handleSubmit}
          disabled={!isCorrect}
          whileHover={isCorrect ? { scale: 1.05 } : {}}
          whileTap={isCorrect ? { scale: 0.95 } : {}}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
            isCorrect
              ? "bg-amber-400/20 border border-amber-400/30 text-amber-300 hover:bg-amber-400/30"
              : "bg-white/[0.04] border border-white/[0.06] text-white/25"
          }`}
        >
          {submitted ? "Publisert!" : "Publiser sladderen"}
        </motion.button>
      )}
    </div>
  );
}
