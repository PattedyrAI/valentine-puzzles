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
  { answer: 'TOUCH', hint: 'First single — a five-letter word for physical contact', defaultScramble: 'HCUTO' },
  { answer: 'DANIELA', hint: 'Member whose name shares roots with a biblical judge', defaultScramble: 'ALIANED' },
  { answer: 'MANON', hint: 'A palindrome-like name of a member born in the USA', defaultScramble: 'NOAMN' },
  { answer: 'SOFT SPOT', hint: 'Two-word track — a vulnerable place in your heart', defaultScramble: 'FSOT TOPS' },
  { answer: 'DEBUT', hint: "The moment they first stepped into the spotlight (not a song)", defaultScramble: 'UTEBD' },
  { answer: 'LARA', hint: 'Member from the Philippines with a four-letter name', defaultScramble: 'RAAL' },
  { answer: 'MY WAY', hint: 'Two-word empowerment anthem about independence', defaultScramble: 'YM AYW' },
];

function shuffleString(str: string): string {
  // Preserve spaces in their positions
  const spaceIndices = new Set<number>();
  str.split('').forEach((ch, i) => {
    if (ch === ' ') spaceIndices.add(i);
  });

  const letters = str.split('').filter(ch => ch !== ' ');
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }

  // Re-insert spaces
  const result: string[] = [];
  let li = 0;
  for (let i = 0; i < str.length; i++) {
    if (spaceIndices.has(i)) {
      result.push(' ');
    } else {
      result.push(letters[li]);
      li++;
    }
  }

  const out = result.join('');
  // Avoid returning the original answer
  if (out.toUpperCase() === str.toUpperCase()) return shuffleString(str);
  return out;
}

export default function KatseyePuzzle({ onSolve, isSolved }: KatseyePuzzleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guess, setGuess] = useState('');
  const [solvedWords, setSolvedWords] = useState<boolean[]>(WORDS.map(() => false));
  const [scrambledLetters, setScrambledLetters] = useState<string[]>(
    WORDS.map(w => w.defaultScramble)
  );
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
        setTimeout(() => {
          setShowSuccess(true);
          onSolve();
        }, 700);
      } else {
        // Move to next unsolved word
        setTimeout(() => {
          const nextUnsolved = newSolved.findIndex((s, i) => !s && i > currentIndex);
          if (nextUnsolved !== -1) {
            setCurrentIndex(nextUnsolved);
          } else {
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
    if (e.key === 'Enter') {
      checkAnswer();
    }
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6 w-full max-w-lg"
    >
      <h2 className="text-2xl font-bold text-pink-300">In the Spotlight</h2>
      <p className="text-pink-200/70 text-sm text-center">
        These letters are all mixed up. Unscramble each word &mdash; you know these by heart, Julie.
      </p>

      {/* Progress indicator */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-pink-300/70">
          {solvedCount} / {WORDS.length} words solved
        </span>
        <div className="flex gap-1.5">
          {WORDS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (!solvedWords[i] || isSolved) setCurrentIndex(i);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                solvedWords[i]
                  ? 'bg-emerald-400 scale-110'
                  : i === currentIndex
                    ? 'bg-pink-400 scale-125'
                    : 'bg-pink-400/30'
              }`}
              title={`Word ${i + 1}`}
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
            className={`w-full rounded-2xl border p-6 transition-colors duration-300 ${
              flashGreen
                ? 'bg-emerald-500/15 border-emerald-400/40'
                : 'bg-white/5 border-pink-400/20'
            }`}
          >
            {/* Hint */}
            <p className="text-sm text-pink-200/60 italic mb-4 text-center">
              Hint: {currentWord.hint}
            </p>

            {/* Scrambled letter tiles */}
            <div className="flex items-center justify-center gap-2 mb-5 flex-wrap">
              {currentScrambled.split('').map((letter, li) => (
                letter === ' ' ? (
                  <div key={`${shuffleKey}-space-${li}`} className="w-3" />
                ) : (
                  <motion.span
                    key={`${shuffleKey}-${li}-${letter}`}
                    initial={{ rotateY: 90, scale: 0.5 }}
                    animate={{ rotateY: 0, scale: 1 }}
                    transition={{ delay: li * 0.06, duration: 0.3, ease: 'easeOut' as const }}
                    className="inline-flex items-center justify-center w-10 h-11 rounded-lg font-bold text-xl select-none bg-pink-500/20 text-pink-200 border border-pink-400/30"
                  >
                    {letter}
                  </motion.span>
                )
              ))}
            </div>

            {/* Shuffle button */}
            <div className="flex justify-center mb-4">
              <button
                onClick={handleShuffle}
                className="px-4 py-1.5 rounded-lg bg-fuchsia-500/15 border border-fuchsia-400/25 text-fuchsia-300 text-sm hover:bg-fuchsia-500/25 transition-colors"
              >
                Shuffle
              </button>
            </div>

            {/* Input and check */}
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
                placeholder="Type your answer..."
                maxLength={currentWord.answer.length + 2}
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-pink-400/20 text-pink-100 placeholder-pink-300/30 outline-none focus:border-pink-400/50 text-sm uppercase tracking-widest"
                disabled={isSolved}
                autoFocus
              />
              <button
                onClick={checkAnswer}
                className="px-4 py-2 rounded-lg bg-pink-500/20 border border-pink-400/30 text-pink-300 text-sm hover:bg-pink-500/30 transition-colors"
              >
                Check
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Solved words summary */}
      {solvedCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full space-y-2"
        >
          <p className="text-xs text-pink-300/50 uppercase tracking-wider text-center">
            Solved Words
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {WORDS.map((word, i) =>
              solvedWords[i] ? (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/25 text-emerald-300 text-sm font-medium"
                >
                  {word.answer}
                </motion.span>
              ) : null
            )}
          </div>
        </motion.div>
      )}

      {/* Already solved badge */}
      {isSolved && !showSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-3 px-6 rounded-xl bg-pink-500/20 border border-pink-400/30"
        >
          <p className="text-pink-300 font-semibold text-lg">
            Puzzle Complete!
          </p>
        </motion.div>
      )}

      {/* Success message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-4 px-6 rounded-xl bg-pink-500/20 border border-pink-400/30"
          >
            <p className="text-pink-300 font-semibold text-lg">
              Every word in its place. Just like you, Julie.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
