import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface KatseyePuzzleProps {
  onSolve: () => void;
  isSolved: boolean;
}

interface KatseyeWord {
  answer: string;
  hint: string;
  defaultScramble: string;
}

const WORDS: KatseyeWord[] = [
  { answer: 'TOUCH', hint: 'Første singel — et ord for fysisk kontakt', defaultScramble: 'HCUTO' },
  { answer: 'DANIELA', hint: 'Medlem med navn fra en bibelsk dommer', defaultScramble: 'ALIANED' },
  { answer: 'MANON', hint: 'Et palindrom-lignende navn på et medlem født i USA', defaultScramble: 'NOAMN' },
  { answer: 'SOFT SPOT', hint: 'To-ords låt — et sårbart sted i hjertet ditt', defaultScramble: 'FSOT TOPS' },
  { answer: 'DEBUT', hint: 'Øyeblikket de først trådte inn i rampelyset (ikke en sang)', defaultScramble: 'UTEBD' },
  { answer: 'LARA', hint: 'Medlem fra Filippinene med fire bokstaver i navnet', defaultScramble: 'RAAL' },
  { answer: 'MY WAY', hint: 'To-ords låt om uavhengighet og selvstendighet', defaultScramble: 'YM AYW' },
];

function shuffleString(str: string): string {
  const spaceIndices = new Set<number>();
  str.split('').forEach((ch, i) => { if (ch === ' ') spaceIndices.add(i); });

  const letters = str.split('').filter(ch => ch !== ' ');
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }

  const result: string[] = [];
  let li = 0;
  for (let i = 0; i < str.length; i++) {
    if (spaceIndices.has(i)) { result.push(' '); } else { result.push(letters[li]); li++; }
  }

  const out = result.join('');
  if (out.toUpperCase() === str.toUpperCase()) return shuffleString(str);
  return out;
}

export default function KatseyePuzzle({ onSolve, isSolved }: KatseyePuzzleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guess, setGuess] = useState('');
  const [solvedWords, setSolvedWords] = useState<boolean[]>(WORDS.map(() => false));
  const [scrambledLetters, setScrambledLetters] = useState<string[]>(WORDS.map(w => w.defaultScramble));
  const [shaking, setShaking] = useState(false);
  const [flashGreen, setFlashGreen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);

  const solvedCount = solvedWords.filter(Boolean).length;

  const checkAnswer = useCallback(() => {
    if (isSolved || solvedWords[currentIndex]) return;
    const trimmed = guess.trim().toUpperCase();
    if (trimmed === WORDS[currentIndex].answer) {
      const newSolved = [...solvedWords];
      newSolved[currentIndex] = true;
      setSolvedWords(newSolved);
      setGuess('');
      setFlashGreen(true);
      setTimeout(() => setFlashGreen(false), 600);

      if (newSolved.every(Boolean)) {
        setTimeout(() => { setShowSuccess(true); onSolve(); }, 700);
      } else {
        setTimeout(() => {
          const nextUnsolved = newSolved.findIndex((s, i) => !s && i > currentIndex);
          if (nextUnsolved !== -1) { setCurrentIndex(nextUnsolved); }
          else {
            const firstUnsolved = newSolved.findIndex(s => !s);
            if (firstUnsolved !== -1) setCurrentIndex(firstUnsolved);
          }
        }, 800);
      }
    } else {
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
    }
  }, [guess, currentIndex, solvedWords, isSolved, onSolve]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') checkAnswer();
  }, [checkAnswer]);

  const handleShuffle = useCallback(() => {
    if (solvedWords[currentIndex]) return;
    const newScrambled = [...scrambledLetters];
    newScrambled[currentIndex] = shuffleString(WORDS[currentIndex].answer);
    setScrambledLetters(newScrambled);
    setShuffleKey(prev => prev + 1);
  }, [currentIndex, scrambledLetters, solvedWords]);

  const currentWord = WORDS[currentIndex];
  const currentScrambled = scrambledLetters[currentIndex];

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-white/40">
          {solvedCount} / {WORDS.length} l&oslash;st
        </span>
        <div className="flex gap-1.5">
          {WORDS.map((_, i) => (
            <button
              key={i}
              onClick={() => { if (!solvedWords[i] || isSolved) setCurrentIndex(i); }}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                solvedWords[i]
                  ? 'bg-emerald-400 scale-110'
                  : i === currentIndex
                    ? 'bg-pink-400 scale-125'
                    : 'bg-white/15'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Current word card */}
      <AnimatePresence mode="wait">
        {!showSuccess && !isSolved && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: 'easeInOut' as const }}
            className={`w-full rounded-xl border p-5 transition-colors duration-300 ${
              flashGreen
                ? 'bg-emerald-500/10 border-emerald-400/30'
                : 'bg-white/[0.03] border-white/[0.06]'
            }`}
          >
            <p className="text-sm text-white/40 italic mb-4 text-center">
              Hint: {currentWord.hint}
            </p>

            <div className="flex items-center justify-center gap-1.5 mb-4 flex-wrap">
              {currentScrambled.split('').map((letter, li) => (
                letter === ' ' ? (
                  <div key={`${shuffleKey}-space-${li}`} className="w-2.5" />
                ) : (
                  <motion.span
                    key={`${shuffleKey}-${li}-${letter}`}
                    initial={{ rotateY: 90, scale: 0.5 }}
                    animate={{ rotateY: 0, scale: 1 }}
                    transition={{ delay: li * 0.06, duration: 0.3, ease: 'easeOut' as const }}
                    className="inline-flex items-center justify-center w-9 h-10 rounded-lg font-bold text-lg select-none bg-pink-500/15 text-pink-200/80 border border-pink-400/20"
                  >
                    {letter}
                  </motion.span>
                )
              ))}
            </div>

            <div className="flex justify-center mb-4">
              <button
                onClick={handleShuffle}
                className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/50 text-xs hover:bg-white/[0.08] transition-colors"
              >
                Stokk om
              </button>
            </div>

            <motion.div
              className="flex gap-2"
              animate={shaking ? { x: [0, -8, 8, -8, 8, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Skriv svaret ditt..."
                maxLength={currentWord.answer.length + 2}
                className="flex-1 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white/80 placeholder-white/20 outline-none focus:border-pink-400/40 text-sm uppercase tracking-widest"
                disabled={isSolved}
                autoFocus
              />
              <button
                onClick={checkAnswer}
                className="px-4 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/60 text-sm hover:bg-white/[0.10] transition-colors"
              >
                Sjekk
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Solved words */}
      {solvedCount > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full space-y-2">
          <p className="text-xs text-white/25 uppercase tracking-wider text-center">
            L&oslash;ste ord
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {WORDS.map((word, i) =>
              solvedWords[i] ? (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300/80 text-xs font-medium"
                >
                  {word.answer}
                </motion.span>
              ) : null
            )}
          </div>
        </motion.div>
      )}

      {(isSolved || showSuccess) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-3 px-5 rounded-xl bg-pink-500/10 border border-pink-400/20"
        >
          <p className="text-pink-300/80 text-sm font-medium">
            Oppgave fullf&oslash;rt!
          </p>
        </motion.div>
      )}
    </div>
  );
}
