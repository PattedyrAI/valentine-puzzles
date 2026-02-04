import { useCallback } from 'react';
import confetti from 'canvas-confetti';

export function useConfetti() {
  const fireConfetti = useCallback(() => {
    const heart = confetti.shapeFromPath({
      path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
    });

    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0.4,
      decay: 0.94,
      startVelocity: 20,
      shapes: [heart],
      colors: ['#ff69b4', '#ff1493', '#ff6b81', '#ee5a6f', '#fc5c7d', '#e84393'],
      scalar: 2,
    };

    // Fire from left
    confetti({
      ...defaults,
      particleCount: 50,
      origin: { x: 0.2, y: 0.5 },
    });

    // Fire from right
    confetti({
      ...defaults,
      particleCount: 50,
      origin: { x: 0.8, y: 0.5 },
    });

    // Fire from center after a short delay
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 80,
        origin: { x: 0.5, y: 0.6 },
        startVelocity: 30,
      });
    }, 200);
  }, []);

  return { fireConfetti };
}
