import { useMemo } from 'react';

interface FloatingHeart {
  id: number;
  left: string;
  scale: number;
  animationDuration: string;
  animationDelay: string;
  opacity: number;
  color: string;
  swayAmount: number;
}

const HEART_COLORS = ['#ff0040', '#ff2060', '#ff4080', '#e0003a', '#cc0030', '#ff1a53', '#ff336b'];

// 8-bit pixel heart as a grid — each row is a bitmask of filled pixels
// Renders on an 11x10 grid
const PIXEL_ROWS = [
  [0,1,1,0,0,0,0,1,1,0,0],
  [1,1,1,1,0,0,1,1,1,1,0],
  [1,1,1,1,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1,1,1,1,0],
  [0,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,1,1,1,1,0,0,0],
  [0,0,0,1,1,1,1,0,0,0,0],
  [0,0,0,0,1,1,0,0,0,0,0],
];

const HeartBackground = () => {
  const hearts = useMemo<FloatingHeart[]>(() => {
    return Array.from({ length: 65 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      scale: 0.4 + Math.random() * 2.0,
      animationDuration: `${6 + Math.random() * 20}s`,
      animationDelay: `${Math.random() * 18}s`,
      opacity: 0.06 + Math.random() * 0.28,
      color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
      swayAmount: 15 + Math.random() * 50,
    }));
  }, []);

  return (
    <>
      <style>{`
        @keyframes floatUpSway {
          0% {
            transform: translateY(100vh) translateX(0px);
            opacity: 0;
          }
          10% {
            opacity: var(--heart-opacity);
          }
          25% {
            transform: translateY(75vh) translateX(var(--sway-amount));
          }
          50% {
            transform: translateY(50vh) translateX(calc(var(--sway-amount) * -0.7));
          }
          75% {
            transform: translateY(25vh) translateX(var(--sway-amount));
          }
          90% {
            opacity: var(--heart-opacity);
          }
          100% {
            transform: translateY(-100px) translateX(calc(var(--sway-amount) * -0.5));
            opacity: 0;
          }
        }
        .floating-pixel-heart {
          position: fixed;
          bottom: 0;
          animation-name: floatUpSway;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          image-rendering: pixelated;
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {hearts.map((heart) => (
          <svg
            key={heart.id}
            className="floating-pixel-heart"
            width={11 * 3 * heart.scale}
            height={9 * 3 * heart.scale}
            viewBox="0 0 11 9"
            shapeRendering="crispEdges"
            style={{
              left: heart.left,
              animationDuration: heart.animationDuration,
              animationDelay: heart.animationDelay,
              '--heart-opacity': heart.opacity,
              '--sway-amount': `${heart.swayAmount}px`,
              opacity: 0,
            } as React.CSSProperties}
          >
            {PIXEL_ROWS.map((row, y) =>
              row.map((pixel, x) =>
                pixel ? (
                  <rect
                    key={`${y}-${x}`}
                    x={x}
                    y={y}
                    width={1}
                    height={1}
                    fill={heart.color}
                  />
                ) : null
              )
            )}
          </svg>
        ))}
      </div>
    </>
  );
};

export default HeartBackground;
