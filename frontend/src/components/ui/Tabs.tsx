import { type ReactNode, useState } from 'react';
import { cn } from '../../shared/utils/cn';
import { AnimatedMount } from './AnimatedMount';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, defaultTab, onChange, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeIndex = tabs.findIndex((t) => t.id === activeTab);

  return (
    <div className={className}>
      {/* Tab bar */}
      <div className="flex border-b border-slate-700 relative" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && handleChange(tab.id)}
            disabled={tab.disabled}
            className={cn(
              'relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-150',
              tab.disabled
                ? 'opacity-40 cursor-not-allowed'
                : tab.id === activeTab
                  ? 'text-amber-400'
                  : 'text-slate-400 hover:text-slate-200',
            )}
            role="tab"
            aria-selected={tab.id === activeTab}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}

        {/* Animated indicator */}
        <div
          className="absolute bottom-0 h-0.5 bg-amber-500 rounded-full transition-all duration-250 ease-out"
          style={{
            width: `${100 / tabs.filter((t) => !t.disabled).length}%`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />
      </div>

      {/* Tab content */}
      <div className="mt-4" role="tabpanel">
        {tabs.map(
          (tab) =>
            tab.id === activeTab && (
              <AnimatedMount key={tab.id} variant="fade-in">
                {tab.content}
              </AnimatedMount>
            ),
        )}
      </div>
    </div>
  );
}
