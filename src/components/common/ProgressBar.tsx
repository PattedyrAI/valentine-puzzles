import { motion } from 'framer-motion';

interface ProgressBarProps {
  solved: number;
  total: number;
}

const ProgressBar = ({ solved, total }: ProgressBarProps) => {
  const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/30 text-xs">
          Fremgang
        </span>
        <span className="text-white/50 text-xs">
          {solved} av {total}
        </span>
      </div>
      <div className="w-full h-1 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-rose-500/70"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' as const }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
