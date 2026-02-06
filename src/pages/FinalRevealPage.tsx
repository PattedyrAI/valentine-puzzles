import { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProgress } from '../hooks/useProgress';
import { useConfetti } from '../hooks/useConfetti';
import { puzzles } from '../config/puzzles';
import { TOTAL_PUZZLES } from '../config/constants';
import PageWrapper from '../components/layout/PageWrapper';

const FinalRevealPage = () => {
  const { progress } = useProgress();
  const { fireConfetti } = useConfetti();
  const allSolved = progress.solved.length === TOTAL_PUZZLES;

  useEffect(() => {
    if (allSolved) {
      fireConfetti();
      const timer = setTimeout(() => fireConfetti(), 1500);
      return () => clearTimeout(timer);
    }
  }, [allSolved, fireConfetti]);

  if (!allSolved) {
    return <Navigate to="/" replace />;
  }

  const orderedClues = puzzles.map((puzzle) => ({
    id: puzzle.id,
    icon: puzzle.icon,
    clue: progress.clues[puzzle.id] || decodeURIComponent(Array.from(atob(puzzle.clue), (c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')),
  }));

  return (
    <PageWrapper>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <p className="font-accent text-2xl pink-glow-strong mb-2">
            Julie, du klarte det.
          </p>
          <h1
            className="text-lg md:text-xl font-semibold pink-glow animate-glow-pulse mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Alle sporene f&oslash;rer til deg
          </h1>
          <p className="text-rose-200/30 text-xs max-w-sm mx-auto">
            Du har l&oslash;st alle oppgavene. Les sporene sammen &mdash; de leder
            et sted spesielt.
          </p>
        </div>

        {/* Clue list */}
        <div className="space-y-1.5 mb-12 max-w-sm mx-auto">
          {orderedClues.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.02] px-4 py-3"
            >
              <span className="text-white/15 text-[10px] font-mono w-3 shrink-0 text-right">
                {item.id}
              </span>
              <span className="text-sm shrink-0">{item.icon}</span>
              <p className="text-rose-300/70 text-xs leading-relaxed">
                {item.clue}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Final reveal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-white/20 text-[10px] uppercase tracking-[0.3em] mb-4">
            Din valentinsdagdestinasjon
          </p>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="text-xl md:text-3xl font-semibold pink-glow-strong mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Dronningens gate 25, Oslo
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 2.0, duration: 0.4 }}
            className="h-px bg-white/[0.06] mb-4 max-w-[200px] mx-auto"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.6 }}
            className="font-accent text-lg pink-glow"
          >
            Vi sees kl. 18:00 den 14. februar, Julie!
          </motion.p>
        </motion.div>

        {/* Back */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors text-xs no-underline"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span>Tilbake</span>
          </Link>
        </div>
      </motion.div>
    </PageWrapper>
  );
};

export default FinalRevealPage;
