interface ProgressBarProps {
  solved: number;
  total: number;
}

const ProgressBar = ({ solved, total }: ProgressBarProps) => {
  const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[#fef3e2]/70 text-sm font-medium">
          Progress
        </span>
        <span className="text-[#fef3e2] text-sm font-bold">
          {solved}/{total} puzzles solved ({percentage}%)
        </span>
      </div>
      <div className="w-full h-3 rounded-full bg-[#fef3e2]/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-rose-600 via-rose-400 to-pink-400 transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
