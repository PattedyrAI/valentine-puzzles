import { motion } from 'framer-motion';

interface ClueRevealProps {
  clue: string;
  puzzleNumber: number;
}

const ClueReveal = ({ clue, puzzleNumber }: ClueRevealProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      className="mt-8 p-6 rounded-2xl border border-yellow-500/30 bg-yellow-900/10 text-center"
    >
      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="text-yellow-400/80 text-xs uppercase tracking-[0.2em] mb-3"
      >
        Clue #{puzzleNumber}
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="gold-glow text-xl md:text-2xl font-bold text-yellow-300"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        &ldquo;{clue}&rdquo;
      </motion.p>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="mt-4 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"
      />
    </motion.div>
  );
};

export default ClueReveal;
