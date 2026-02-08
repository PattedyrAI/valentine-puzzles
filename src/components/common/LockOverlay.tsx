import CountdownTimer from './CountdownTimer';

interface LockOverlayProps {
  puzzleTitle: string;
  isPrevSolved: boolean;
  timeRemaining: { days: number; hours: number; minutes: number; seconds: number } | null;
  unlockDateDisplay?: string | null;
}

const LockOverlay = ({ puzzleTitle, isPrevSolved, timeRemaining, unlockDateDisplay }: LockOverlayProps) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#0a0a0a]/90 backdrop-blur-sm">
      <div className="max-w-xs w-full mx-6 p-6 text-center rounded-xl border border-white/[0.06] bg-white/[0.02]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fb7185" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-40">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <h2 className="text-sm font-semibold pink-glow mb-1">
          L&aring;st
        </h2>
        <p className="text-rose-200/25 mb-5 text-xs">
          &laquo;{puzzleTitle}&raquo; er ikke tilgjengelig enn&aring;.
        </p>

        {isPrevSolved ? (
          <>
            <p className="text-white/20 text-[10px] uppercase tracking-widest mb-3">
              {unlockDateDisplay ? `Åpner ${unlockDateDisplay}` : 'Åpner om'}
            </p>
            <CountdownTimer time={timeRemaining} />
          </>
        ) : (
          <p className="text-white/25 text-xs">
            L&oslash;s forrige oppgave f&oslash;rst.
          </p>
        )}
      </div>
    </div>
  );
};

export default LockOverlay;
