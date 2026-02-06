import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AFFIRMATIONS = [
  'Du er fantastisk, Julie',
  'Jeg er så heldig',
  'Du gjør verden vakrere',
  'Mitt hjerte er ditt',
  'Du er alt for meg',
  'Hver dag med deg er en gave',
  'Du lyser opp livet mitt',
  'Jeg elsker deg mer for hver dag',
  'Du er sterkere enn du tror',
  'Takk for at du er du',
  'Du fortjener all verdens kjærlighet',
  'Sammen er vi uslåelige',
];

export default function FloatingAffirmations() {
  const [current, setCurrent] = useState<{ text: string; x: number; y: number; id: number } | null>(null);

  const showNext = useCallback(() => {
    const text = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
    const x = 10 + Math.random() * 60;
    const y = 15 + Math.random() * 55;
    setCurrent({ text, x, y, id: Date.now() });
    setTimeout(() => setCurrent(null), 3500);
  }, []);

  useEffect(() => {
    const delay = 6000 + Math.random() * 5000;
    const timer = setTimeout(showNext, delay);
    return () => clearTimeout(timer);
  }, [showNext]);

  useEffect(() => {
    if (current === null) {
      const delay = 8000 + Math.random() * 12000;
      const timer = setTimeout(showNext, delay);
      return () => clearTimeout(timer);
    }
  }, [current, showNext]);

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      <AnimatePresence>
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -15 }}
            transition={{ duration: 0.8, ease: 'easeOut' as const }}
            style={{ left: `${current.x}%`, top: `${current.y}%` }}
            className="absolute font-accent text-rose-300/50 text-lg md:text-xl select-none whitespace-nowrap"
          >
            {current.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
