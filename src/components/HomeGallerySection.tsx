import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { homeGalleryAPI } from '@/lib/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Default gallery layout positions - exactly 8 images as per HTML structure
const defaultGalleryLayout = [
  { id: 1, x1: 2, x2: 6, y1: 1, y2: 4, image: '/placeholder.svg' },
  { id: 2, x1: 6, x2: 8, y1: 2, y2: 4, image: '/placeholder.svg' },
  { id: 3, x1: 1, x2: 4, y1: 4, y2: 7, image: '/placeholder.svg' },
  { id: 4, x1: 4, x2: 7, y1: 4, y2: 7, image: '/placeholder.svg' },
  { id: 5, x1: 7, x2: 9, y1: 4, y2: 6, image: '/placeholder.svg' },
  { id: 6, x1: 2, x2: 4, y1: 7, y2: 9, image: '/placeholder.svg' },
  { id: 7, x1: 4, x2: 7, y1: 7, y2: 10, image: '/placeholder.svg' },
  { id: 8, x1: 7, x2: 10, y1: 6, y2: 9, image: '/placeholder.svg' },
];

const HomeGallerySection: React.FC = () => {
  const [galleryImages, setGalleryImages] = useState(defaultGalleryLayout);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(0.4);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLUListElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const lockedScrollPosition = useRef<number>(0);
  const accumulatedScroll = useRef<number>(0);
  const animationCompleted = useRef<boolean>(false); // Track if animation was completed

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await homeGalleryAPI.getAll();
        if (data && Array.isArray(data) && data.length === 8) {
          // Map the fetched data to the layout structure, maintaining order
          const sortedData = [...data].sort((a, b) => (a.order || 0) - (b.order || 0));
          const mappedImages = defaultGalleryLayout.map((layout, index) => ({
            ...layout,
            image: sortedData[index]?.image || layout.image,
          }));
          setGalleryImages(mappedImages);
        } else if (data && Array.isArray(data)) {
          // If we have data but not exactly 8, map what we have
          const sortedData = [...data].sort((a, b) => (a.order || 0) - (b.order || 0));
          const mappedImages = defaultGalleryLayout.map((layout, index) => ({
            ...layout,
            image: sortedData[index]?.image || layout.image,
          }));
          setGalleryImages(mappedImages);
        }
      } catch (error) {
        console.error('Error fetching home gallery:', error);
        // Keep default images on error
      }
    };

    fetchGallery();
  }, []);

  // Scroll locking and animation
  useEffect(() => {
    if (!containerRef.current || !galleryRef.current || !sectionRef.current) return;

    const ANIMATION_DISTANCE = 1500; // Total scroll distance needed to complete animation (in pixels)
    const MIN_SCALE = 0.35; // Starting scale - calculated to fit at max scale
    const MAX_SCALE = 1; // Final scale
    const TOTAL_ROTATION = 360; // Full 360 degree rotation

    const updateAnimation = () => {
      if (!galleryRef.current) return;

      const progress = accumulatedScroll.current / ANIMATION_DISTANCE;
      const clampedProgress = Math.max(0, Math.min(1, progress));
      
      setScrollProgress(clampedProgress);

      // Calculate rotation and scale
      const newRotation = clampedProgress * TOTAL_ROTATION;
      const newScale = MIN_SCALE + (clampedProgress * (MAX_SCALE - MIN_SCALE));

      setRotation(newRotation);
      setScale(newScale);

      // Apply transforms
      galleryRef.current.style.transform = `scale(${newScale}) rotate(${newRotation}deg)`;
      
      // Update all images with counter-rotation
      const images = galleryRef.current.querySelectorAll('img');
      images.forEach((img) => {
        (img as HTMLImageElement).style.transform = `translate(-50%, -50%) rotate(${-newRotation}deg)`;
      });
    };

    const handleWheel = (e: WheelEvent) => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;
      const sectionHeight = rect.height;

      // Section should be fully entered before locking
      // Lock when section top is at or below 10% of viewport (section is fully visible)
      // and section is still visible (bottom is above 90% of viewport)
      const lockStartThreshold = windowHeight * 0.1; // Lock when section top reaches 10% from top
      const lockEndThreshold = windowHeight * 0.9; // Stop locking when section bottom goes below 90%
      
      // Check if section is completely entered (top is below lock threshold)
      const isSectionFullyEntered = sectionTop <= lockStartThreshold && sectionBottom > lockEndThreshold;
      const isSectionAbove = sectionBottom < lockStartThreshold; // Section above lock zone
      const isSectionBelow = sectionTop > lockEndThreshold; // Section below lock zone

      // Reset state when section is completely out of lock zone
      if (isSectionAbove) {
        // Scrolled back up past section - unlock always, never lock again if animation was completed
        if (isScrollLocked) {
          setIsScrollLocked(false);
        }
        // Only reset animation if it wasn't completed
        if (!animationCompleted.current && (accumulatedScroll.current > 0 || isScrollLocked)) {
          accumulatedScroll.current = 0;
          updateAnimation();
        }
        return; // Don't interfere with scrolling
      }

      if (isSectionBelow) {
        // Scrolled past section going down - unlock always
        if (isScrollLocked) {
          setIsScrollLocked(false);
        }
        return; // Don't interfere with scrolling
      }

      // Section is fully entered and in lock zone - handle animation
      if (isSectionFullyEntered) {
        // If animation was already completed, NEVER lock again - allow free scrolling
        if (animationCompleted.current) {
          if (isScrollLocked) {
            setIsScrollLocked(false);
          }
          return; // Allow normal scrolling
        }

        const currentProgress = accumulatedScroll.current / ANIMATION_DISTANCE;
        const isAnimationComplete = currentProgress >= 1;

        // If animation is already complete, don't lock scroll - allow normal scrolling
        if (isAnimationComplete) {
          if (isScrollLocked) {
            setIsScrollLocked(false);
          }
          return;
        }

        // Only lock if scrolling down (positive deltaY)
        // If scrolling up while in lock zone, allow it to unlock
        if (e.deltaY < 0) {
          // Scrolling up - unlock and allow
          if (isScrollLocked) {
            setIsScrollLocked(false);
          }
          return;
        }

        // Lock scroll and animate - section is fully entered and scrolling down
        e.preventDefault();
        e.stopPropagation();
        
        if (!isScrollLocked) {
          setIsScrollLocked(true);
          lockedScrollPosition.current = window.scrollY;
        }

        // Accumulate scroll delta (positive for down scroll)
        accumulatedScroll.current += e.deltaY * 0.5; // Slow down scroll speed
        accumulatedScroll.current = Math.max(0, Math.min(accumulatedScroll.current, ANIMATION_DISTANCE));

        updateAnimation();

        // If animation just completed, mark it and unlock
        if (accumulatedScroll.current >= ANIMATION_DISTANCE) {
          animationCompleted.current = true;
          setTimeout(() => {
            setIsScrollLocked(false);
          }, 100);
        }

        // Maintain scroll position
        if (Math.abs(window.scrollY - lockedScrollPosition.current) > 5) {
          window.scrollTo({
            top: lockedScrollPosition.current,
            behavior: 'auto'
          });
        }
      }
    };

    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;
      
      const lockStartThreshold = windowHeight * 0.1;
      const lockEndThreshold = windowHeight * 0.9;

      const isAboveSection = sectionBottom < lockStartThreshold;
      const isBelowSection = sectionTop > lockEndThreshold;
      const isSectionFullyEntered = sectionTop <= lockStartThreshold && sectionBottom > lockEndThreshold;

      // Reset state when section is completely out of lock zone
      if (isAboveSection) {
        // Scrolled back up - unlock always
        if (isScrollLocked) {
          setIsScrollLocked(false);
        }
        // Only reset animation if it wasn't completed
        if (!animationCompleted.current && accumulatedScroll.current > 0) {
          accumulatedScroll.current = 0;
          updateAnimation();
        }
      } else if (isBelowSection) {
        // Scrolled past section - unlock always
        if (isScrollLocked) {
          setIsScrollLocked(false);
        }
      }

      // Only maintain scroll lock if section is fully entered AND animation not completed
      if (isScrollLocked && !animationCompleted.current) {
        if (!isSectionFullyEntered) {
          // Section moved out of lock zone, unlock
          setIsScrollLocked(false);
        } else {
          // Maintain locked scroll position
          if (Math.abs(window.scrollY - lockedScrollPosition.current) > 5) {
            window.scrollTo({
              top: lockedScrollPosition.current,
              behavior: 'auto'
            });
          }
        }
      } else if (isScrollLocked && animationCompleted.current) {
        // Animation was completed, force unlock
        setIsScrollLocked(false);
      }
    };

    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial update
    updateAnimation();

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isScrollLocked, galleryImages]);

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Side - GALLERY Text */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-firlest" style={{ letterSpacing: '0.12em' }}>
              GALLERY
            </h2>
            <p className="text-xl text-gray-600">
              Explore the vibrant life and achievements at VIET through our visual gallery
            </p>
          </div>

          {/* Right Side - Image Gallery */}
          <div className="relative w-full overflow-visible" ref={containerRef}>
            <div className="home-gallery-container">
              <ul className="home-gallery-grid" ref={galleryRef}>
                {galleryImages.map((item) => (
                  <li
                    key={item.id}
                    style={{
                      gridColumn: `${item.x1} / ${item.x2}`,
                      gridRow: `${item.y1} / ${item.y2}`,
                    }}
                  >
                    <img
                      src={item.image.startsWith('/') ? `${API_BASE_URL}${item.image}` : item.image}
                      alt={`Gallery image ${item.id}`}
                      data-rotation={-rotation}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .home-gallery-container {
          position: relative;
          width: 100%;
          min-height: 600px;
          height: 80vh;
          max-height: 800px;
          overflow: hidden; /* Hidden to prevent overflow at max scale */
          border-radius: 16px;
          background: hsl(0 0% 95% / 0.5);
          perspective: 1000px;
          display: flex;
          align-items: center;
          justify-content: center;
          /* Ensure container can accommodate max scale */
          padding: 2rem;
          box-sizing: border-box;
        }

        .home-gallery-grid {
          /* Calculate tile size based on container - ensure it fits at scale 1 */
          --container-width: min(90vw, 600px);
          --container-padding: 2rem;
          --available-width: calc(var(--container-width) - var(--container-padding) * 2);
          /* At max scale (1), grid should fit: 9 tiles + 8 gaps */
          --tile-size: calc(var(--available-width) / 9.5);
          --big-tile-size: calc(var(--tile-size) * 3);
          
          list-style-type: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 1vmin;
          grid-template: repeat(9, var(--tile-size)) / repeat(9, var(--tile-size));
          position: relative;
          transform: scale(0.35) rotate(0deg); /* Starting scale - calculated to fit at scale 1 */
          transform-origin: center center;
          transition: transform 0.05s linear; /* Smooth animation */
          width: calc(var(--tile-size) * 9);
          height: calc(var(--tile-size) * 9);
          will-change: transform;
        }

        .home-gallery-grid li {
          padding: 0;
          position: relative;
          background: hsl(0 0% 85% / 0.3);
          max-inline-size: 100%;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .home-gallery-grid li:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          z-index: 10;
        }

        .home-gallery-grid li img {
          height: 200%;
          min-width: 200%;
          aspect-ratio: 1;
          object-fit: cover;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          transition: transform 0.1s ease-out;
          will-change: transform;
        }

        @media (max-width: 1024px) {
          .home-gallery-container {
            min-height: 500px;
            height: 70vh;
            max-height: 600px;
            --container-width: min(85vw, 500px);
          }
        }

        @media (max-width: 768px) {
          .home-gallery-container {
            min-height: 400px;
            height: 60vh;
            max-height: 500px;
            --container-width: min(80vw, 400px);
          }
        }
      `}</style>
    </section>
  );
};

export default HomeGallerySection;

