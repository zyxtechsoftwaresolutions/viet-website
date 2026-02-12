import { useState, useEffect, useRef } from 'react';
import { tickerAPI } from '@/lib/api';

interface TickerItem {
  id: number;
  text: string;
  isActive: boolean;
}

const ScrollingTicker = () => {
  const [items, setItems] = useState<TickerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [duplicateCount, setDuplicateCount] = useState(20); // Default to many duplicates

  useEffect(() => {
    fetchTickerItems();
  }, []);

  useEffect(() => {
    // Calculate how many times to duplicate text to fill the ticker width
    if (!loading && items.length > 0 && containerRef.current && textRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const textWidth = textRef.current.scrollWidth;
      
      if (textWidth > 0 && containerWidth > 0) {
        // Calculate how many duplicates needed to fill at least 2x container width (for seamless loop)
        const minDuplicates = Math.ceil((containerWidth * 2) / textWidth) + 2;
        setDuplicateCount(Math.max(10, minDuplicates)); // Minimum 10 duplicates
      }
    }
  }, [loading, items]);

  const fetchTickerItems = async () => {
    try {
      const data = await tickerAPI.getAll();
      const activeItems = Array.isArray(data)
        ? data.filter((item: TickerItem) => item.isActive !== false && item.text?.trim())
        : [];
      setItems(activeItems);
    } catch (error) {
      console.error('Error fetching ticker items:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Don't render if still loading or no active items with text
  if (loading) {
    return null;
  }

  if (items.length === 0) {
    return null;
  }

  // Combine all active ticker texts with separators
  const tickerTexts = items.map((item) => item.text).filter(Boolean);
  if (tickerTexts.length === 0) {
    return null;
  }

  // Join texts with bullet separator
  const combinedText = tickerTexts.join(' • ');
  // Duplicate many times to ensure it fills the entire ticker width
  const scrollingText = Array(duplicateCount).fill(combinedText).join(' • ');

  return (
    <div className="relative w-full bg-primary text-white overflow-hidden border-b border-primary/20 shadow-md">
      <div className="flex items-center h-10 md:h-12">
        <div className="flex-shrink-0 px-4 md:px-6 bg-primary z-10 border-r border-white/20">
          <span className="text-xs md:text-sm font-semibold uppercase tracking-wider whitespace-nowrap">
            Latest
          </span>
        </div>
        <div ref={containerRef} className="flex-1 overflow-hidden relative h-full">
          <div className="absolute inset-0 flex items-center">
            <div
              ref={textRef}
              className="inline-block whitespace-nowrap animate-scroll-left will-change-transform"
              style={{
                animationDuration: `${Math.max(45, duplicateCount * 4)}s`,
              }}
            >
              <span className="text-xs md:text-sm px-2 text-white font-medium">{scrollingText}</span>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll-left {
          animation: scroll-left linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ScrollingTicker;
