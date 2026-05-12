import { useReducedMotion } from './useReducedMotion';

interface StaggerOptions {
  baseDelay?: number;
  staggerDelay?: number;
  disabled?: boolean;
}

/**
 * Returns animation delay and style for staggered entrance animations.
 * Use in lists/grids to create sequential fade-in effects.
 *
 * @example
 * ```tsx
 * {items.map((item, index) => (
 *   <div key={item.id} style={useStaggerAnimation(index)}>
 *     {item.name}
 *   </div>
 * ))}
 * ```
 */
export function useStaggerAnimation(
  index: number,
  options: StaggerOptions = {},
) {
  const {
    baseDelay = 0,
    staggerDelay = 50,
    disabled: explicitDisabled,
  } = options;

  const reduced = useReducedMotion();
  const disabled = explicitDisabled ?? reduced;

  if (disabled) {
    return {
      animation: undefined,
      opacity: 1,
    };
  }

  const delay = baseDelay + index * staggerDelay;

  return {
    animation: `slideUp var(--duration-normal, 250ms) var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1)) ${delay}ms both`,
  };
}
