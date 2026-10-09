import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

const phrases = [
  'My comfort',
  'My angel',
  'My world',
  'My heart',
  'My home',
  'My sunshine',
  'My safe place',
  'My sweetest joy',
  'My favorite person',
  'My brightest star',
  'My forever',
  'My everything',
];

interface Bubble {
  id: number;
  phrase: string;
  startX: number;
  startY: number;
  travelX: number;
  travelY: number;
  duration: number;
}

export function RomanticBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const nextId = useRef(0);
  const nextCorner = useRef(0);
  const nextPhrase = useRef(0);

  const spawnBubble = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const margin = 110;
    const corner = nextCorner.current % 4;
    nextCorner.current += 1;

    const routes = [
      { startX: -margin, startY: -margin, endX: width + margin, endY: height + margin },
      { startX: width + margin, startY: -margin, endX: -margin, endY: height + margin },
      { startX: -margin, startY: height + margin, endX: width + margin, endY: -margin },
      { startX: width + margin, startY: height + margin, endX: -margin, endY: -margin },
    ];
    const route = routes[corner];
    const phrase = phrases[nextPhrase.current % phrases.length];
    nextPhrase.current += 1;
    const bubble: Bubble = {
      id: nextId.current,
      phrase,
      startX: route.startX + (Math.random() - 0.5) * 100,
      startY: route.startY + (Math.random() - 0.5) * 100,
      travelX: route.endX - route.startX,
      travelY: route.endY - route.startY,
      duration: 13 + Math.random() * 5,
    };
    nextId.current += 1;

    setBubbles((current) => (current.length < 5 ? [...current, bubble] : current));
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const initialTimeout = window.setTimeout(spawnBubble, 900);
    const interval = window.setInterval(spawnBubble, 3200);

    return () => {
      window.clearTimeout(initialTimeout);
      window.clearInterval(interval);
    };
  }, [spawnBubble]);

  const removeBubble = useCallback((id: number) => {
    setBubbles((current) => current.filter((bubble) => bubble.id !== id));
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          initial={{ x: bubble.startX, y: bubble.startY, opacity: 0 }}
          animate={{
            x: bubble.travelX,
            y: bubble.travelY,
            opacity: [0, 0.82, 0.82, 0],
          }}
          transition={{
            duration: bubble.duration,
            ease: 'linear',
            opacity: { duration: bubble.duration, times: [0, 0.12, 0.82, 1], ease: 'linear' },
          }}
          onAnimationComplete={() => removeBubble(bubble.id)}
          className="absolute whitespace-nowrap rounded-full border border-amber-100/25 bg-slate-950/45 px-4 py-2 text-xs font-medium tracking-wide text-amber-100/90 shadow-[0_0_24px_rgba(251,191,36,0.12)] backdrop-blur-sm sm:text-sm"
        >
          {bubble.phrase}
        </motion.div>
      ))}
    </div>
  );
}
