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
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.92 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 260, damping: 22 },
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
      <div className="text-center mb-10">
        <h1
          className="text-3xl md:text-4xl font-bold pink-glow animate-glow-pulse mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Julies Valentinskalender
        </h1>
        <p className="text-rose-300/35 text-sm tracking-wide" style={{ fontFamily: "'Lato', sans-serif" }}>
          L&oslash;s alle 7 for &aring; avsl&oslash;re hvor vi skal p&aring; Valentines Day
        </p>
      </div>

      {/* Calendar grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-4 gap-4 mb-12"
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
          className="flex flex-col items-center justify-center rounded-2xl border-[1.5px] border-rose-500/15 bg-rose-500/[0.04] aspect-square"
          style={{ boxShadow: '0 0 24px rgba(244,63,94,0.06)' }}
        >
          <span className="text-3xl mb-1.5">&#10084;&#65039;</span>
          <span className="text-[10px] text-rose-400/40 font-semibold tracking-wide">14. feb</span>
        </motion.div>
      </motion.div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-rose-400/15 to-transparent" />
      </div>

      {/* Rules */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mb-10 text-center"
      >
        <h3
          className="text-rose-300/50 text-[11px] uppercase tracking-[0.25em] font-semibold mb-5"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          Slik fungerer det
        </h3>
        <div className="space-y-3 text-rose-200/30 text-[13px] leading-relaxed" style={{ fontFamily: "'Lato', sans-serif" }}>
          <p>Oppgave 1 er allerede &aring;pen &mdash; start n&aring;r du vil.</p>
          <p>N&aring;r du l&oslash;ser en oppgave f&aring;r du et spor,<br />og neste oppgave &aring;pnes etter 24 timer.</p>
          <p>Samle alle 7 sporene for &aring; avsl&oslash;re<br />hvor vi skal p&aring; Valentines Day.</p>
        </div>
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
            className="inline-block px-8 py-3.5 rounded-2xl bg-rose-500/10 border-[1.5px] border-rose-400/25 text-rose-300 text-sm font-semibold no-underline hover:bg-rose-500/15 hover:border-rose-400/35 transition-all duration-300"
            style={{ boxShadow: '0 0 30px rgba(244,63,94,0.08)' }}
          >
            Avsl&oslash;r overraskelsen
          </Link>
        </motion.div>
      )}
    </PageWrapper>
  );
};

export default HomePage;
