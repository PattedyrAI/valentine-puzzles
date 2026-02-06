import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '../components/layout/PageWrapper';
import PuzzleCard from '../components/common/PuzzleCard';
import { puzzles } from '../config/puzzles';
import { useProgress } from '../hooks/useProgress';
import { DEV_MODE, TOTAL_PUZZLES } from '../config/constants';
import { isPuzzleUnlockedSequential } from '../utils/dateUtils';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
};

const HomePage = () => {
  const { progress, isSolved } = useProgress();
  const allSolved = progress.solved.length === TOTAL_PUZZLES;

  const checkUnlocked = (puzzleId: number): boolean => {
    if (DEV_MODE) return true;
    return isPuzzleUnlockedSequential(puzzleId, progress.solvedAt);
  };

  return (
    <PageWrapper>
      {/* Title */}
      <div className="text-center mb-6">
        <h1
          className="text-2xl md:text-3xl font-semibold pink-glow animate-glow-pulse mb-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Julies Valentinskalender
        </h1>
        <p className="text-rose-300/30 text-xs">
          L&oslash;s alle 7 for &aring; avsl&oslash;re hvor vi skal p&aring; Valentines Day
        </p>
      </div>

      {/* Calendar grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-4 gap-3 mb-8"
      >
        {puzzles.map((puzzle) => (
          <motion.div key={puzzle.id} variants={cardVariants}>
            <PuzzleCard
              puzzle={puzzle}
              isSolved={isSolved(puzzle.id)}
              isUnlocked={checkUnlocked(puzzle.id)}
            />
          </motion.div>
        ))}

        {/* Valentine's heart in the 8th slot */}
        <motion.div
          variants={cardVariants}
          className="flex flex-col items-center justify-center rounded-xl border border-rose-500/15 bg-rose-500/[0.04] aspect-square"
          style={{ boxShadow: '0 0 20px rgba(244,63,94,0.05)' }}
        >
          <span className="text-2xl mb-1">&#10084;&#65039;</span>
          <span className="text-[9px] text-rose-400/40 font-medium">14. feb</span>
        </motion.div>
      </motion.div>

      {/* Rules */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mb-8 text-center space-y-2"
      >
        <h3 className="text-rose-300/40 text-[10px] uppercase tracking-[0.2em] mb-3">
          Slik fungerer det
        </h3>
        <ul className="space-y-1.5 text-rose-200/25 text-xs leading-relaxed">
          <li>Oppgave 1 er allerede &aring;pen &mdash; start n&aring;r du vil.</li>
          <li>N&aring;r du l&oslash;ser en oppgave f&aring;r du et spor, og neste oppgave &aring;pnes etter 24 timer.</li>
          <li>Samle alle 7 sporene for &aring; avsl&oslash;re hvor vi skal p&aring; Valentines Day.</li>
        </ul>
      </motion.div>

      {/* Final reveal button */}
      {allSolved && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Link
            to="/final"
            className="inline-block px-6 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white/80 text-sm no-underline hover:bg-white/[0.10] hover:border-white/[0.12] transition-all duration-200"
          >
            Avsl&oslash;r overraskelsen
          </Link>
        </motion.div>
      )}
    </PageWrapper>
  );
};

export default HomePage;
