import { useCallback, useSyncExternalStore } from 'react';

function getMediaQuery(): MediaQueryList {
  return window.matchMedia('(prefers-reduced-motion: reduce)');
}

function subscribe(callback: () => void) {
  const mql = getMediaQuery();
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
}

function getSnapshot(): boolean {
  return getMediaQuery().matches;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Detects if the user prefers reduced motion.
 * Uses useSyncExternalStore for reactive updates without re-render storms.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Returns animation-safe duration based on reduced motion preference.
 */
export function useSafeDuration() {
  const reduced = useReducedMotion();
  return useCallback(
    (duration: number) => (reduced ? 0 : duration),
    [reduced],
  );
}
