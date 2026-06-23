import { useRef, useState, type ReactNode, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  height: number;
  children: ReactNode;
  /** Parent duplicates content when true for seamless loop */
  loop?: boolean;
  duration?: number;
  className?: string;
};

const CampusAutoScrollViewport = ({
  height,
  children,
  loop = false,
  duration = 30,
  className,
}: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const wrapScroll = (el: HTMLDivElement, delta: number) => {
    el.scrollTop += delta;
    const half = el.scrollHeight / 2;
    if (half <= 0) return;
    while (el.scrollTop >= half) el.scrollTop -= half;
    while (el.scrollTop < 0) el.scrollTop += half;
  };

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!hovered || !loop) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();
    wrapScroll(el, e.deltaY);
  };

  if (!loop) {
    return (
      <div
        className={cn('campus-panel-scroll-viewport relative z-[3] overflow-hidden', className)}
        style={{ height, maxHeight: height, minHeight: height }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn('campus-panel-scroll-viewport relative z-[3] overflow-hidden', className)}
      style={{ height, maxHeight: height, minHeight: height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onWheel={onWheel}
    >
      {hovered ? (
        <div
          ref={scrollRef}
          className="campus-panel-scroll-manual h-full overflow-x-hidden overflow-y-auto overscroll-contain"
        >
          {children}
        </div>
      ) : (
        <div
          className="notice-auto-scroll"
          style={
            {
              '--scroll-duration': `${duration}s`,
            } as CSSProperties
          }
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default CampusAutoScrollViewport;
