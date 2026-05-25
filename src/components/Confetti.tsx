import { useState, useCallback } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
}

const COLORS = ['#0969da', '#1a7f37', '#8257e5', '#cf222e', '#9a6700', '#54aeff', '#4ac26b', '#c084fc'];

let confettiId = 0;

export function useConfetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [active, setActive] = useState(false);

  const trigger = useCallback(() => {
    const newPieces: ConfettiPiece[] = Array.from({ length: 60 }, () => ({
      id: confettiId++,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random() * 1.5,
      size: 6 + Math.random() * 8,
    }));
    setPieces(newPieces);
    setActive(true);
    setTimeout(() => {
      setActive(false);
      setTimeout(() => setPieces([]), 500);
    }, 3000);
  }, []);

  return { active, pieces, trigger };
}

export default function ConfettiOverlay({ pieces }: { pieces: ConfettiPiece[] }) {
  if (pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute top-0"
          style={{
            left: `${p.x}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `confetti-fall ${p.duration}s ease-out ${p.delay}s forwards`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}
