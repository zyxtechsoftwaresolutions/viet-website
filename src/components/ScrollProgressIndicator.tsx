import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

const ScrollProgressIndicator = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / documentHeight) * 100;
      
      setScrollProgress(progress);
      setIsVisible(scrollTop > 300); // Show after scrolling 300px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <motion.button
            onClick={scrollToTop}
            className="relative w-14 h-14 rounded-full glass backdrop-blur-xl border border-white/20 hover-glow group cursor-pointer overflow-hidden"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {/* Background Circle */}
            <div className="absolute inset-0 bg-gradient-primary opacity-90 rounded-full" />
            
            {/* Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
              <circle
                cx="28"
                cy="28"
                r="26"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="2"
                fill="none"
              />
              <motion.circle
                cx="28"
                cy="28"
                r="26"
                stroke="rgba(255, 255, 255, 0.9)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={163.36} // 2 * PI * 26
                initial={{ strokeDashoffset: 163.36 }}
                animate={{ strokeDashoffset: 163.36 - (163.36 * scrollProgress) / 100 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))'
                }}
              />
            </svg>

            {/* Icon */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              whileHover={{ y: -1 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronUp className="w-5 h-5 text-white drop-shadow-lg" />
            </motion.div>

            {/* Progress Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[8px] font-bold text-white/80 mt-6">
                {Math.round(scrollProgress)}%
              </span>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm" />
          </motion.button>

          {/* Tooltip */}
          <motion.div
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-foreground/90 text-background text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 0, y: 0 }}
            whileHover={{ opacity: 1, y: -2 }}
          >
            Back to top
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground/90" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollProgressIndicator;