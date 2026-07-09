import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type AdaptiveSectionNavProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Hint to re-measure when the number of items changes */
  itemCount?: number;
};

/**
 * Horizontal section nav row: centers items when they don't fill the bar,
 * spreads them when there are many / content is wide.
 */
export function AdaptiveSectionNav({
  itemCount,
  className,
  children,
  ...props
}: AdaptiveSectionNavProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [centered, setCentered] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      requestAnimationFrame(() => {
        const node = ref.current;
        if (!node) return;
        setCentered(node.scrollWidth < node.clientWidth - 24);
      });
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);

    return () => observer.disconnect();
  }, [itemCount]);

  return (
    <div
      ref={ref}
      className={cn(
        'flex w-full overflow-x-auto scrollbar-none',
        centered ? 'justify-center gap-2 md:gap-3' : 'justify-between gap-1 md:gap-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type StickySectionNavBarProps = {
  itemCount?: number;
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  ariaLabel?: string;
};

/** Sticky wrapper used on department pages, examinations, grievance, etc. */
export function StickySectionNavBar({
  itemCount,
  children,
  className,
  innerClassName,
  ariaLabel,
}: StickySectionNavBarProps) {
  return (
    <div
      className={cn(
        'bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm',
        className
      )}
    >
      <div className={cn('container mx-auto px-4 md:px-10 lg:px-12', innerClassName)}>
        <AdaptiveSectionNav itemCount={itemCount} role="tablist" aria-label={ariaLabel}>
          {children}
        </AdaptiveSectionNav>
      </div>
    </div>
  );
}