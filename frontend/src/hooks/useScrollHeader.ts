import { useState, useEffect, useRef } from 'react';

interface ScrollHeaderOptions {
  threshold?: number;
  enabled?: boolean;
}

interface ScrollHeaderState {
  isScrolled: boolean;
  scrollY: number;
}

/**
 * Tracks scroll position and returns whether the page has scrolled past a threshold.
 * Useful for scroll-aware headers that change style when scrolled.
 *
 * @example
 * ```tsx
 * const { isScrolled } = useScrollHeader({ threshold: 50 });
 * return (
 *   <header className={isScrolled ? 'shadow-md py-2' : 'py-4'}>
 * ```
 */
export function useScrollHeader({
  threshold = 50,
  enabled = true,
}: ScrollHeaderOptions = {}): ScrollHeaderState {
  const [state, setState] = useState<ScrollHeaderState>({
    isScrolled: false,
    scrollY: 0,
  });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    function handleScroll() {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }

      rafId.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        setState({
          isScrolled: scrollY > threshold,
          scrollY,
        });
      });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [threshold, enabled]);

  return state;
}
