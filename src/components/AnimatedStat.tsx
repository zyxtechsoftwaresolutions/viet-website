import { useState, useEffect, useRef, memo } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

export type PlacementStatTheme = 'highest' | 'average' | 'offers' | 'companies';

export interface AnimatedStatConfig {
  label: string;
  icon: LucideIcon;
  targetValue: number | string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  isLetter?: boolean;
  theme?: PlacementStatTheme;
  backgroundImage?: string;
}
interface AnimatedStatProps {
  stat: AnimatedStatConfig;
  index?: number;
  variant?: 'glance' | 'placement-card' | 'placement-lpu';
}

function useAnimatedCount(stat: AnimatedStatConfig) {
  const [count, setCount] = useState<number | string>(stat.isLetter ? 'D' : 0);
  const hasStartedRef = useRef(false);
  const hasCompletedRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const statRef = useRef(stat);

  useEffect(() => {
    statRef.current = stat;
  }, [stat]);

  useEffect(() => {
    if (hasStartedRef.current || hasCompletedRef.current || !ref.current) return;
    if (observerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasStartedRef.current && !hasCompletedRef.current) {
          hasStartedRef.current = true;

          if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
          }

          const currentStat = statRef.current;

          if (currentStat.isLetter && currentStat.targetValue === 'A') {
            const naacGrades = ['D', 'C', 'B', 'B+', 'B++', 'A', 'A+', 'A++', 'A'];
            let currentIndex = 0;
            intervalRef.current = setInterval(() => {
              setCount(naacGrades[currentIndex]);
              currentIndex++;
              if (currentIndex >= naacGrades.length) {
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;
                }
                setCount('A');
                hasCompletedRef.current = true;
              }
            }, 2000 / naacGrades.length);
          } else if (typeof currentStat.targetValue === 'number') {
            const duration = 2000;
            const startTime = Date.now();
            const targetNum = currentStat.targetValue;
            const decimals = currentStat.decimals ?? 0;

            const animate = () => {
              if (hasCompletedRef.current) return;

              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeOutQuart = 1 - Math.pow(1 - progress, 4);
              const current = easeOutQuart * targetNum;

              if (decimals > 0) {
                setCount(current.toFixed(decimals));
              } else {
                setCount(Math.floor(current));
              }

              if (progress < 1) {
                animationFrameRef.current = requestAnimationFrame(animate);
              } else {
                setCount(decimals > 0 ? targetNum.toFixed(decimals) : targetNum);
                animationFrameRef.current = null;
                hasCompletedRef.current = true;
              }
            };
            animate();
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px' }
    );

    if (ref.current) {
      observerRef.current.observe(ref.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, []);

  const displayValue =
    typeof count === 'number'
      ? `${stat.prefix ?? ''}${count.toLocaleString()}${stat.suffix ?? ''}`
      : `${stat.prefix ?? ''}${count}${stat.suffix ?? ''}`;

  return { ref, displayValue };
}

const AnimatedStat = memo(({ stat, index = 0, variant = 'glance' }: AnimatedStatProps) => {
  const { ref, displayValue } = useAnimatedCount(stat);
  const Icon = stat.icon;

  if (variant === 'placement-lpu') {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: index * 0.1 }}
        className="placement-stat-circle"
      >
        <div className="placement-stat-circle__inner">
          <div
            className="placement-stat-circle__value"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {displayValue}
          </div>
          <div
            className="placement-stat-circle__label"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {stat.label}
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === 'placement-card') {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
        className="placement-stat-card"
      >
        <div className="placement-stat-card__icon" aria-hidden>
          <Icon className="w-7 h-7 text-white" strokeWidth={1.75} />
        </div>
        <div
          className="placement-stat-card__value"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          {displayValue}
        </div>
        <div
          className="placement-stat-card__label"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          {stat.label}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="text-center"
    >
      <div className="w-16 h-16 bg-[#0a192f] rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-white" aria-hidden />
      </div>
      <div
        className="text-3xl md:text-4xl font-bold text-[#0a192f] mb-2"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        {displayValue}
      </div>
      <div className="text-sm md:text-base text-gray-600" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {stat.label}
      </div>
    </motion.div>
  );
});

AnimatedStat.displayName = 'AnimatedStat';

export default AnimatedStat;
