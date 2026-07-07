import { type ReactNode, type CSSProperties } from 'react';
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
    >
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
    </div>
  );
};

export default CampusAutoScrollViewport;
