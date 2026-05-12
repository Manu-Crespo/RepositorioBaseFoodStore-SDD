import { type ReactNode } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

type AnimationVariant = 'fade-in' | 'slide-up' | 'slide-down' | 'scale-in';

interface AnimatedMountProps {
  children: ReactNode;
  variant?: AnimationVariant;
  duration?: number;
  delay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  disabled?: boolean;
}

const animationClasses: Record<AnimationVariant, string> = {
  'fade-in': 'animate-fade-in',
  'slide-up': 'animate-slide-up',
  'slide-down': 'animate-slide-down',
  'scale-in': 'animate-scale-in',
};

/**
 * Wrapper component that applies entrance animation to its children.
 * Respects prefers-reduced-motion automatically.
 *
 * @example
 * ```tsx
 * <AnimatedMount variant="slide-up" delay={100}>
 *   <Card>Content</Card>
 * </AnimatedMount>
 * ```
 */
export function AnimatedMount({
  children,
  variant = 'fade-in',
  delay = 0,
  className = '',
  disabled: explicitDisabled,
}: AnimatedMountProps) {
  const reduced = useReducedMotion();
  const disabled = explicitDisabled ?? reduced;

  const baseClass = animationClasses[variant];
  const animClass = disabled ? '' : baseClass;

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={delay > 0 && !disabled ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
