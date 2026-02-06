import { motion } from 'framer-motion';

interface ClueRevealProps {
  clue: string;
  puzzleNumber: number;
}

const ClueReveal = ({ clue, puzzleNumber }: ClueRevealProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="mt-10 text-center"
    >
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 max-w-sm mx-auto">
        <p className="text-rose-300/25 text-[10px] uppercase tracking-[0.2em] mb-2">
          Spor #{puzzleNumber}
        </p>
        <p
          className="pink-glow text-base font-medium leading-relaxed"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          &laquo;{clue}&raquo;
        </p>
      </div>
    </motion.div>
  );
};

export default ClueReveal;
