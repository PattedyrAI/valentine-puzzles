import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HorsesPuzzleProps {
  onSolve: () => void;
  isSolved: boolean;
}

interface HorsePair {
  breed: string;
  description: string;
}

const PAIRS: HorsePair[] = [
  {
    breed: 'Arabian',
    description: 'Ancient desert breed with a concave profile and naturally high tail set',
  },
  {
    breed: 'Clydesdale',
    description: 'Scottish draft breed with heavy bone and silky leg feathering',
  },
  {
    breed: 'Friesian',
    description: 'Black Dutch warmblood with arched neck and feathered fetlocks',
  },
  {
    breed: 'Fjord',
    description: 'Dun-colored Norwegian breed with a dark dorsal stripe through its mane',
  },
  {
    breed: 'Lipizzaner',
    description: 'Born dark, turns white with age; trained in classical haute \u00E9cole dressage',
  },
  {
    breed: 'Andalusian',
    description: 'Iberian breed prized for collection and known as the Pure Spanish Horse',
  },
  {
    breed: 'Akhal-Teke',
    description: 'Turkmen breed famous for its metallic sheen coat and extreme endurance',
  },
  {
    breed: 'Haflinger',
    description: 'Chestnut Alpine breed from Tyrol with a flaxen mane and compact build',
  },
];

// Shuffle helper using Fisher-Yates
function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Pre-shuffle the descriptions (indices) so breeds and descriptions don't line up
const SHUFFLED_BREEDS = shuffle(PAIRS.map((_, i) => i));
const SHUFFLED_DESCRIPTIONS = shuffle(PAIRS.map((_, i) => i));

const shakeAnimation = {
  x: [0, -8, 8, -6, 6, -3, 3, 0],
  transition: { duration: 0.4, ease: 'easeInOut' as const },
};

export default function HorsesPuzzle({ onSolve, isSolved }: HorsesPuzzleProps) {
  const [selectedBreed, setSelectedBreed] = useState<number | null>(null);
  const [selectedDescription, setSelectedDescription] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrongBreed, setWrongBreed] = useState<number | null>(null);
  const [wrongDescription, setWrongDescription] = useState<number | null>(null);

  const matchCount = matched.size;

  const tryMatch = useCallback(
    (breedIndex: number, descIndex: number) => {
      if (breedIndex === descIndex) {
        // Correct match
        const next = new Set(matched);
        next.add(breedIndex);
        setMatched(next);
        setSelectedBreed(null);
        setSelectedDescription(null);

        if (next.size === PAIRS.length && !isSolved) {
          setTimeout(() => onSolve(), 400);
        }
      } else {
        // Wrong match — shake both
        setWrongBreed(breedIndex);
        setWrongDescription(descIndex);
        setTimeout(() => {
          setWrongBreed(null);
          setWrongDescription(null);
          setSelectedBreed(null);
          setSelectedDescription(null);
        }, 500);
      }
    },
    [matched, isSolved, onSolve],
  );

  const handleBreedClick = useCallback(
    (pairIndex: number) => {
      if (matched.has(pairIndex) || wrongBreed !== null) return;
      setSelectedBreed(pairIndex);
      if (selectedDescription !== null) {
        tryMatch(pairIndex, selectedDescription);
      }
    },
    [matched, selectedDescription, wrongBreed, tryMatch],
  );

  const handleDescriptionClick = useCallback(
    (pairIndex: number) => {
      if (matched.has(pairIndex) || wrongDescription !== null) return;
      setSelectedDescription(pairIndex);
      if (selectedBreed !== null) {
        tryMatch(selectedBreed, pairIndex);
      }
    },
    [matched, selectedBreed, wrongDescription, tryMatch],
  );

  return (
    <div className="space-y-6">
      {/* Solved badge */}
      <AnimatePresence>
        {isSolved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center"
          >
            <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-sm font-semibold text-amber-900 shadow-lg">
              Puzzle Solved!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress counter */}
      <div className="text-center">
        <span className="text-rose-200 text-sm font-medium">
          {matchCount}/{PAIRS.length} matched
        </span>
      </div>

      {/* Instructions */}
      {!isSolved && matchCount < PAIRS.length && (
        <p className="text-center text-rose-300/70 text-sm">
          Click a breed, then click its matching description
        </p>
      )}

      {/* Matching grid */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Breeds column */}
        <div className="flex-1 space-y-3">
          <h3 className="text-emerald-400 font-semibold text-center text-sm uppercase tracking-wider mb-2">
            Breeds
          </h3>
          {SHUFFLED_BREEDS.map((pairIndex) => {
            const pair = PAIRS[pairIndex];
            const isMatched = matched.has(pairIndex);
            const isSelected = selectedBreed === pairIndex;
            const isWrong = wrongBreed === pairIndex;

            return (
              <motion.button
                key={pair.breed}
                onClick={() => handleBreedClick(pairIndex)}
                disabled={isMatched}
                animate={isWrong ? shakeAnimation : {}}
                whileHover={!isMatched ? { scale: 1.02 } : {}}
                whileTap={!isMatched ? { scale: 0.98 } : {}}
                className={`w-full px-4 py-3 rounded-2xl text-left text-sm font-medium transition-colors duration-200
                  backdrop-blur-md border
                  ${
                    isMatched
                      ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.25)]'
                      : isWrong
                        ? 'bg-red-500/20 border-red-400/50 text-red-300'
                        : isSelected
                          ? 'bg-emerald-400/15 border-emerald-400/40 text-white'
                          : 'bg-white/10 border-white/20 text-rose-200 hover:bg-white/15 hover:border-white/30'
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  {isMatched && <span className="text-emerald-400">&#10003;</span>}
                  {pair.breed}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Descriptions column */}
        <div className="flex-1 space-y-3">
          <h3 className="text-emerald-400 font-semibold text-center text-sm uppercase tracking-wider mb-2">
            Descriptions
          </h3>
          {SHUFFLED_DESCRIPTIONS.map((pairIndex) => {
            const pair = PAIRS[pairIndex];
            const isMatched = matched.has(pairIndex);
            const isSelected = selectedDescription === pairIndex;
            const isWrong = wrongDescription === pairIndex;

            return (
              <motion.button
                key={pair.description}
                onClick={() => handleDescriptionClick(pairIndex)}
                disabled={isMatched}
                animate={isWrong ? shakeAnimation : {}}
                whileHover={!isMatched ? { scale: 1.02 } : {}}
                whileTap={!isMatched ? { scale: 0.98 } : {}}
                className={`w-full px-4 py-3 rounded-2xl text-left text-sm transition-colors duration-200
                  backdrop-blur-md border
                  ${
                    isMatched
                      ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.25)]'
                      : isWrong
                        ? 'bg-red-500/20 border-red-400/50 text-red-300'
                        : isSelected
                          ? 'bg-emerald-400/15 border-emerald-400/40 text-white'
                          : 'bg-white/10 border-white/20 text-rose-200 hover:bg-white/15 hover:border-white/30'
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  {isMatched && <span className="text-emerald-400">&#10003;</span>}
                  {pair.description}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
