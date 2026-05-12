import {
  type ReactNode,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { cn } from '../../shared/utils/cn';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  variant?: 'default' | 'danger' | 'success';
  disabled?: boolean;
  separator?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

export function Dropdown({
  trigger,
  items,
  align = 'left',
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        close();
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, close]);

  return (
    <div ref={dropdownRef} className={cn('relative inline-block', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger}
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-1 min-w-[180px] py-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl shadow-black/20',
            align === 'right' ? 'right-0' : 'left-0',
            reduced ? '' : 'animate-fade-in',
          )}
          role="menu"
        >
          {items.map((item, idx) => (
            <div key={idx}>
              {item.separator && idx > 0 && (
                <div className="my-1 border-t border-slate-700" />
              )}
              <button
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick();
                    close();
                  }
                }}
                disabled={item.disabled}
                className={cn(
                  'flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors duration-150',
                  item.disabled
                    ? 'opacity-40 cursor-not-allowed'
                    : item.variant === 'danger'
                      ? 'text-red-400 hover:bg-red-900/30'
                      : item.variant === 'success'
                        ? 'text-emerald-400 hover:bg-emerald-900/30'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-slate-100',
                )}
                role="menuitem"
              >
                {item.icon && (
                  <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>
                )}
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
