import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnagramPuzzleProps {
  onSolve: () => void;
  isSolved: boolean;
}

interface AnagramWord {
  scrambled: string;
  answer: string;
  hint: string;
}

const WORDS: AnagramWord[] = [
  { scrambled: 'OVEL', answer: 'LOVE', hint: 'The greatest feeling' },
  { scrambled: 'SISK', answer: 'KISS', hint: 'Sealed with a ...' },
  { scrambled: 'THERA', answer: 'HEART', hint: 'It beats for you' },
  { scrambled: 'CNROAEM', answer: 'ROMANCE', hint: 'Candlelight and roses' },
  { scrambled: 'SASPINO', answer: 'PASSION', hint: 'Burning desire' },
];

function shuffleString(str: string): string {
  const arr = str.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const result = arr.join('');
  // Avoid returning the answer by accident
  if (result === str) return shuffleString(str);
  return result;
}

const AnagramPuzzle: React.FC<AnagramPuzzleProps> = ({ onSolve, isSolved }) => {
  const [guesses, setGuesses] = useState<string[]>(WORDS.map(() => ''));
  const [solved, setSolved] = useState<boolean[]>(WORDS.map(() => false));
  const [scrambledDisplay, setScrambledDisplay] = useState<string[]>(
    WORDS.map(w => w.scrambled)
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);

  const handleGuess = useCallback((index: number, value: string) => {
    if (isSolved || solved[index]) return;
    const newGuesses = [...guesses];
    newGuesses[index] = value;
    setGuesses(newGuesses);
  }, [guesses, solved, isSolved]);

  const checkAnswer = useCallback((index: number) => {
    if (isSolved || solved[index]) return;
    const guess = guesses[index].trim().toUpperCase();
    if (guess === WORDS[index].answer) {
      const newSolved = [...solved];
      newSolved[index] = true;
      setSolved(newSolved);

      // Check if all solved
      if (newSolved.every(Boolean)) {
        setTimeout(() => {
          setShowSuccess(true);
          onSolve();
        }, 500);
      }
    } else {
      setShakeIndex(index);
      setTimeout(() => setShakeIndex(null), 600);
    }
  }, [guesses, solved, isSolved, onSolve]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer(index);
    }
  }, [checkAnswer]);

  const shuffleWord = useCallback((index: number) => {
    if (solved[index]) return;
    const newDisplay = [...scrambledDisplay];
    newDisplay[index] = shuffleString(WORDS[index].answer);
    setScrambledDisplay(newDisplay);
  }, [scrambledDisplay, solved]);

  const solvedCount = solved.filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6 w-full max-w-lg"
    >
      <h2 className="text-2xl font-bold text-rose-300">Anagram Puzzle</h2>
      <p className="text-rose-200/70 text-sm text-center">
        Unscramble these romance-themed words. Type your answer and press Enter.
      </p>

      <div className="text-sm text-rose-300/70">
        {solvedCount} / {WORDS.length} words solved
      </div>

      <div className="w-full space-y-4">
        {WORDS.map((word, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-xl border p-4 transition-colors ${
              solved[index]
                ? 'bg-emerald-500/10 border-emerald-400/30'
                : 'bg-white/5 border-rose-400/20'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-rose-200/50 italic">{word.hint}</span>
            </div>

            {/* Scrambled letter tiles */}
            <div className="flex items-center gap-1 mb-3 flex-wrap">
              {scrambledDisplay[index].split('').map((letter, li) => (
                <motion.span
                  key={`${index}-${li}-${letter}`}
                  initial={{ rotateY: 90 }}
                  animate={{ rotateY: 0 }}
                  transition={{ delay: li * 0.05 }}
                  className={`inline-flex items-center justify-center w-9 h-10 rounded-md font-bold text-lg select-none ${
                    solved[index]
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                      : 'bg-rose-500/15 text-rose-200 border border-rose-400/25'
                  }`}
                >
                  {solved[index] ? word.answer[li] : letter}
                </motion.span>
              ))}

              {!solved[index] && (
                <button
                  onClick={() => shuffleWord(index)}
                  className="ml-2 p-1.5 rounded-md bg-rose-500/10 border border-rose-400/20 text-rose-300 hover:bg-rose-500/20 transition-colors text-xs"
                  title="Shuffle letters"
                >
                  Shuffle
                </button>
              )}
            </div>

            {/* Input and check */}
            {!solved[index] && (
              <motion.div
                className="flex gap-2"
                animate={shakeIndex === index ? { x: [0, -8, 8, -8, 8, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <input
                  type="text"
                  value={guesses[index]}
                  onChange={(e) => handleGuess(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  placeholder="Your answer..."
                  maxLength={word.answer.length}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-rose-400/20 text-rose-100 placeholder-rose-300/30 outline-none focus:border-rose-400/50 text-sm uppercase tracking-widest"
                  disabled={isSolved}
                />
                <button
                  onClick={() => checkAnswer(index)}
                  className="px-4 py-2 rounded-lg bg-rose-500/20 border border-rose-400/30 text-rose-300 text-sm hover:bg-rose-500/30 transition-colors"
                >
                  Check
                </button>
              </motion.div>
            )}

            {solved[index] && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-emerald-400 text-sm"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Correct!
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {(showSuccess || isSolved) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-3 px-6 rounded-xl bg-rose-500/20 border border-rose-400/30"
          >
            <p className="text-rose-300 font-semibold text-lg">
              All words unscrambled! You speak the language of love.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AnagramPuzzle;
