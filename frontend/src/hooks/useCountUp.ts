import { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface CountUpOptions {
  end: number;
  duration?: number;
  start?: number;
  decimals?: number;
  enabled?: boolean;
}

/**
 * Animates a number counting up from start to end.
 * Disables animation when user prefers reduced motion.
 *
 * @example
 * ```tsx
 * const count = useCountUp({ end: 1500, duration: 500 });
 * return <span>{count}</span>;
 * ```
 */
export function useCountUp({
  end,
  duration = 500,
  start = 0,
  decimals = 0,
  enabled = true,
}: CountUpOptions): number {
  const [current, setCurrent] = useState(start);
  const reduced = useReducedMotion();
  const startTime = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || reduced) {
      setCurrent(end);
      return;
    }

    if (end === start) {
      setCurrent(end);
      return;
    }

    startTime.current = null;
    const range = end - start;

    function animate(timestamp: number) {
      if (startTime.current === null) {
        startTime.current = timestamp;
      }

      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = start + range * eased;

      setCurrent(value);

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      }
    }

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [end, duration, start, enabled, reduced]);

  return Number(current.toFixed(decimals));
}
