import { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProgress } from '../hooks/useProgress';
import { useConfetti } from '../hooks/useConfetti';
import { puzzles } from '../config/puzzles';
import { TOTAL_PUZZLES } from '../config/constants';
import PageWrapper from '../components/layout/PageWrapper';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

const FinalRevealPage = () => {
  const { progress } = useProgress();
  const { fireConfetti } = useConfetti();
  const allSolved = progress.solved.length === TOTAL_PUZZLES;

  // Fire confetti on mount
  useEffect(() => {
    if (allSolved) {
      fireConfetti();
      const timer = setTimeout(() => fireConfetti(), 1500);
      return () => clearTimeout(timer);
    }
  }, [allSolved, fireConfetti]);

  // Redirect if not all puzzles solved
  if (!allSolved) {
    return <Navigate to="/" replace />;
  }

  // Assemble clues in order
  const orderedClues = puzzles.map((puzzle) => ({
    id: puzzle.id,
    title: puzzle.title,
    icon: puzzle.icon,
    clue: progress.clues[puzzle.id] || atob(puzzle.clue),
  }));

  return (
    <PageWrapper>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-12">
          <p className="font-accent text-3xl md:text-4xl text-rose-300 mb-4">
            Julie, you did it.
          </p>
          <h1 className="romantic-gradient-text text-3xl md:text-4xl font-bold mb-4">
            Every Piece Leads to You
          </h1>
          <p className="text-[#fef3e2]/70 text-base md:text-lg max-w-xl mx-auto">
            You&apos;ve solved every puzzle I made for you.
            Now read the clues together &mdash; they lead somewhere special.
          </p>
        </motion.div>

        {/* Clue cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {orderedClues.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="glass-card p-5 text-left"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-300 text-sm font-bold">
                  {item.id}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-[#fef3e2]/50 text-xs font-medium truncate">
                      {item.title}
                    </span>
                  </div>
                  <p
                    className="text-yellow-300 font-semibold text-sm leading-relaxed"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    &ldquo;{item.clue}&rdquo;
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Final reveal */}
        <motion.div
          variants={itemVariants}
          className="mb-12 py-10 px-6 rounded-3xl border-2 border-yellow-500/40 bg-yellow-900/10"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0, duration: 0.8 }}
            className="text-yellow-400/80 text-xs uppercase tracking-[0.3em] mb-6"
          >
            Your Valentine&apos;s Day Destination
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.5, duration: 0.8, ease: 'easeOut' }}
            className="gold-glow text-3xl md:text-5xl font-bold text-yellow-300 mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Dronningens gate 25, Oslo
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 3.0, duration: 0.6 }}
            className="h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent mb-6 max-w-sm mx-auto"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.3, duration: 0.8 }}
            className="font-accent text-2xl md:text-3xl text-rose-300"
          >
            See you on Valentine&apos;s Day at 18:00, Julie! &#128149;
          </motion.p>
        </motion.div>

        {/* Back link */}
        <motion.div variants={itemVariants}>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-rose-300/70 hover:text-rose-200 transition-colors text-sm no-underline"
          >
            <span>&larr;</span>
            <span>Back to puzzles</span>
          </Link>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
};

export default FinalRevealPage;
