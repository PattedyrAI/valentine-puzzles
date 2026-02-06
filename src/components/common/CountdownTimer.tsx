interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  time: TimeRemaining | null;
}

const CountdownTimer = ({ time }: CountdownTimerProps) => {
  if (!time) {
    return (
      <p className="text-emerald-400 text-sm">Tilgjengelig n&aring;!</p>
    );
  }

  const segments: { value: number; label: string }[] = [
    { value: time.days, label: 'd' },
    { value: time.hours, label: 't' },
    { value: time.minutes, label: 'm' },
    { value: time.seconds, label: 's' },
  ];

  return (
    <div className="flex items-center justify-center gap-4">
      {segments.map((seg) => (
        <div key={seg.label} className="flex items-baseline gap-0.5">
          <span className="text-lg font-mono text-white/70 tabular-nums">
            {String(seg.value).padStart(2, '0')}
          </span>
          <span className="text-white/25 text-xs">
            {seg.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
