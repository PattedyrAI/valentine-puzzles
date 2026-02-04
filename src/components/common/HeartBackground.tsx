import { useMemo } from 'react';

interface FloatingHeart {
  id: number;
  left: string;
  size: string;
  animationDuration: string;
  animationDelay: string;
  opacity: number;
}

const HeartBackground = () => {
  const hearts = useMemo<FloatingHeart[]>(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${14 + Math.random() * 20}px`,
      animationDuration: `${8 + Math.random() * 12}s`,
      animationDelay: `${Math.random() * 10}s`,
      opacity: 0.15 + Math.random() * 0.25,
    }));
  }, []);

  return (
    <>
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: var(--heart-opacity);
          }
          90% {
            opacity: var(--heart-opacity);
          }
          100% {
            transform: translateY(-100px) rotate(25deg);
            opacity: 0;
          }
        }
        .floating-heart {
          position: fixed;
          bottom: 0;
          animation-name: floatUp;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {hearts.map((heart) => (
          <span
            key={heart.id}
            className="floating-heart select-none"
            style={{
              left: heart.left,
              fontSize: heart.size,
              animationDuration: heart.animationDuration,
              animationDelay: heart.animationDelay,
              '--heart-opacity': heart.opacity,
              opacity: 0,
            } as React.CSSProperties}
          >
            &#10084;&#65039;
          </span>
        ))}
      </div>
    </>
  );
};

export default HeartBackground;
