import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SNOOPY_GIF = 'https://media.giphy.com/media/J93sVmfYBtsRi/giphy.gif';

export default function SnoopyDance() {
  const [visible, setVisible] = useState<{ x: number; y: number; id: number } | null>(null);

  const showSnoopy = useCallback(() => {
    const x = 5 + Math.random() * 70;
    const y = 20 + Math.random() * 50;
    setVisible({ x, y, id: Date.now() });
    setTimeout(() => setVisible(null), 4000);
  }, []);

  useEffect(() => {
    const delay = 15000 + Math.random() * 20000;
    const timer = setTimeout(showSnoopy, delay);
    return () => clearTimeout(timer);
  }, [showSnoopy]);

  useEffect(() => {
    if (visible === null) {
      const delay = 25000 + Math.random() * 35000;
      const timer = setTimeout(showSnoopy, delay);
      return () => clearTimeout(timer);
    }
  }, [visible, showSnoopy]);

  return (
    <div className="fixed inset-0 pointer-events-none z-15 overflow-hidden">
      <AnimatePresence>
        {visible && (
          <motion.div
            key={visible.id}
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 0.85, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.6, rotate: 10 }}
            transition={{ duration: 0.6, ease: 'easeOut' as const }}
            style={{ left: `${visible.x}%`, top: `${visible.y}%` }}
            className="absolute"
          >
            <img
              src={SNOOPY_GIF}
              alt="Snoopy dancing"
              className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
