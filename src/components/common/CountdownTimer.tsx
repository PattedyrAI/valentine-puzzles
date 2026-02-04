import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [time, setTime] = useState<TimeRemaining | null>(null);

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDate + 'T00:00:00');
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTime(null);
        return;
      }

      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!time) {
    return (
      <p className="text-rose-300 font-bold text-lg">Now available!</p>
    );
  }

  const segments: { value: number; label: string }[] = [
    { value: time.days, label: 'Days' },
    { value: time.hours, label: 'Hours' },
    { value: time.minutes, label: 'Min' },
    { value: time.seconds, label: 'Sec' },
  ];

  return (
    <div className="flex items-center justify-center gap-3">
      {segments.map((seg, i) => (
        <div key={seg.label} className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-bold text-yellow-300 tabular-nums min-w-[2.5rem]">
              {String(seg.value).padStart(2, '0')}
            </span>
            <span className="text-[#fef3e2]/40 text-[10px] uppercase tracking-widest mt-1">
              {seg.label}
            </span>
          </div>
          {i < segments.length - 1 && (
            <span className="text-yellow-500/50 text-xl font-light mb-4">:</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
