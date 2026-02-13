import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BridgertonPuzzleProps {
  onSolve: () => void;
  isSolved: boolean;
}

// Encrypted with Caesar cipher, shift 7
const ENCRYPTED =
  "KLHYLZA QBSPL UVAOPUN DVBSK KLSPNOA TL TVYL AOHU AV DHAJO AOL ULDLZA ZLHZVU VM AOL AVU DPAO FVB";
const PLAINTEXT =
  "DEAREST JULIE NOTHING WOULD DELIGHT ME MORE THAN TO WATCH THE NEWEST SEASON OF THE TON WITH YOU";

const Flourish = () => (
  <div className="flex items-center justify-center gap-3 my-2 select-none">
    <span className="block w-12 h-px bg-amber-400/30" />
    <span className="text-amber-400/50 text-sm">&#10087;</span>
    <span className="block w-12 h-px bg-amber-400/30" />
  </div>
);

export default function BridgertonPuzzle({
  onSolve,
  isSolved,
}: BridgertonPuzzleProps) {
  const [answer, setAnswer] = useState("");
  const [shake, setShake] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const normalize = (s: string) =>
    s.trim().toUpperCase().replace(/\s+/g, " ");

  const isCorrect = normalize(answer) === PLAINTEXT;

  const handleSubmit = () => {
    if (isCorrect && !isSolved) {
      setSubmitted(true);
      onSolve();
    } else if (!isCorrect) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
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
        &laquo;Kj&aelig;re Julie, et kryptisk brev fra Lady Whistledown selv er
        blitt fanget opp. Tyd budskapet og skriv det inn for &aring; bevise at
        du er verdig selskapet.&raquo;
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
          className="text-amber-100/60 text-sm leading-relaxed tracking-wide break-words mt-2 italic"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {ENCRYPTED}
        </p>
      </div>

      {/* Hint toggle */}
      <button
        onClick={() => setShowHint((h) => !h)}
        className="text-amber-400/40 text-xs hover:text-amber-400/70 transition-colors underline underline-offset-2"
      >
        {showHint ? "Skjul hint" : "Trenger du et hint?"}
      </button>
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full rounded-xl bg-amber-400/5 border border-amber-400/10 px-5 py-4 text-center overflow-hidden space-y-2"
          >
            <p
              className="text-amber-300/50 text-xs italic"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Lady Whistledown har ogs&aring; kryptert denne setningen:
            </p>
            <p className="text-amber-200/70 font-mono text-xs tracking-wider">
              SVCL PZ HSS FVB ULLK
            </p>
            <p
              className="text-amber-300/50 text-xs italic"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              ...som betyr:
            </p>
            <p className="text-amber-300/80 font-mono text-xs tracking-wider font-bold">
              LOVE IS ALL YOU NEED
            </p>
            <p
              className="text-amber-300/30 text-[10px] italic mt-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              S&rarr;L, V&rarr;O, C&rarr;V, L&rarr;E, P&rarr;I, Z&rarr;S,
              H&rarr;A, F&rarr;Y, B&rarr;U, U&rarr;N, K&rarr;D
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Answer input */}
      {!isSolved ? (
        <motion.div
          className="w-full rounded-xl bg-white/[0.03] border border-white/[0.06] p-5"
          animate={shake ? { x: [0, -8, 8, -8, 8, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-amber-400/60 font-semibold text-[10px] uppercase tracking-widest mb-3">
            Skriv det dechiffrerte budskapet
          </h3>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Dearest Julie..."
            rows={3}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-amber-100/70 text-sm placeholder:text-white/15 focus:outline-none focus:border-amber-400/30 focus:bg-amber-400/[0.03] transition-colors resize-none"
            style={{ fontFamily: "'Playfair Display', serif" }}
          />
          {shake && (
            <p className="text-red-400/60 text-xs mt-2 text-center italic">
              Det er ikke helt riktig, pr&oslash;v igjen...
            </p>
          )}
        </motion.div>
      ) : (
        <div className="w-full rounded-xl bg-amber-400/10 border border-amber-400/30 p-5">
          <h3 className="text-amber-400/50 font-semibold text-[10px] uppercase tracking-widest mb-1">
            Dechiffrert budskap
          </h3>
          <Flourish />
          <p
            className="text-amber-200/80 text-sm leading-relaxed tracking-wide break-words mt-2 font-bold"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {PLAINTEXT}
          </p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-amber-400/40 text-[10px] mt-3 text-center italic"
          >
            &mdash; Din hengivne, Lady Whistledown
          </motion.p>
        </div>
      )}

      {!isSolved && (
        <motion.button
          onClick={handleSubmit}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-8 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 bg-[#2a2010] border-2 border-[#6a5520] text-amber-300 hover:bg-[#352a15] hover:border-[#8a7030]"
        >
          {submitted ? "Publisert!" : "Publiser sladderen"}
        </motion.button>
      )}
    </div>
  );
}
