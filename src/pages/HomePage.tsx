import { Link } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import ProgressBar from '../components/common/ProgressBar';
import PuzzleCard from '../components/common/PuzzleCard';
import { puzzles } from '../config/puzzles';
import { useProgress } from '../hooks/useProgress';
import { DEV_MODE, TOTAL_PUZZLES } from '../config/constants';

const HomePage = () => {
  const { progress, isSolved } = useProgress();
  const allSolved = progress.solved.length === TOTAL_PUZZLES;

  const isPuzzleUnlocked = (unlockDate: string): boolean => {
    if (DEV_MODE) return true;
    const now = new Date();
    const unlock = new Date(unlockDate + 'T00:00:00');
    return now >= unlock;
  };

  return (
    <PageWrapper>
      {/* Greeting */}
      <div className="text-center mb-10">
        <p className="font-accent text-3xl md:text-4xl text-rose-300 mb-4">
          For Julie,
        </p>
        <h2 className="romantic-gradient-text text-2xl md:text-3xl font-bold mb-4">
          Every Love Story Has Its Clues
        </h2>
        <p className="text-[#fef3e2]/70 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
          I&apos;ve hidden 7 puzzles for you &mdash; each one inspired by something
          we share. Solve them all and piece together the clues to find what
          waits for you on Valentine&apos;s Day.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-10">
        <ProgressBar solved={progress.solved.length} total={TOTAL_PUZZLES} />
      </div>

      {/* Final reveal button */}
      {allSolved && (
        <div className="text-center mb-10">
          <Link
            to="/final"
            className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 text-white font-bold text-lg no-underline shadow-lg shadow-rose-500/30 animate-heartbeat hover:scale-105 transition-transform"
          >
            Reveal Your Valentine&apos;s Surprise!
          </Link>
        </div>
      )}

      {/* Puzzle grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {puzzles.map((puzzle) => (
          <PuzzleCard
            key={puzzle.id}
            puzzle={puzzle}
            isSolved={isSolved(puzzle.id)}
            isUnlocked={isPuzzleUnlocked(puzzle.unlockDate)}
          />
        ))}
      </div>
    </PageWrapper>
  );
};

export default HomePage;
