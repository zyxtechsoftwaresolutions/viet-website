import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const LEADER_NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Vision & Mission', href: '/vision-mission' },
  { name: 'Chairman', href: '/chairman' },
  { name: 'Principal', href: '/principal' },
  { name: 'Dean Academics', href: '/dean-academics' },
  { name: 'Dean Innovation', href: '/dean-innovation' },
  { name: 'Accreditations', href: '/accreditations' },
  { name: 'Organizational Chart', href: '/organizational-chart' },
  { name: 'Governing Body', href: '/governing-body' },
  { name: 'Contact', href: '/about#contact' },
];

interface LeaderPageBarProps {
  /** Back button goes to /about by default */
  backHref?: string;
}

const LeaderPageBar = ({ backHref = '/about' }: LeaderPageBarProps) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleNav = (href: string) => {
    setIsMenuOpen(false);
    navigate(href);
  };

  const glassButtonClass = isScrolled
    ? 'bg-slate-800/95 text-white border-slate-700 hover:bg-slate-700'
    : 'bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:border-white/40';

  return (
    <>
      {/* Fixed top bar - no ribbons, minimal */}
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-3 md:py-4 transition-all duration-300',
          isScrolled ? 'leader-page-bar-scrolled shadow-lg' : 'bg-transparent'
        )}
        style={isScrolled ? { 
          backgroundColor: '#1e293b',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          backgroundImage: 'none'
        } : {
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none'
        }}
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* Left: Full logo (transforms to mini when scrolled) */}
        <motion.div
          className="flex items-center cursor-pointer"
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Full logo - visible when not scrolled */}
          <motion.div
            className="overflow-hidden"
            initial={false}
            animate={{
              width: isScrolled ? 0 : 'auto',
              opacity: isScrolled ? 0 : 1,
              marginRight: isScrolled ? 0 : 8,
            }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            <img
              src="/viet-logo-new.png"
              alt="VIET Logo"
              className="h-11 md:h-12 w-auto object-contain"
            />
          </motion.div>
          {/* Mini logo - visible when scrolled */}
          <motion.div
            className="overflow-hidden rounded-full flex items-center justify-center"
            initial={false}
            animate={{
              width: isScrolled ? 'auto' : 0,
              opacity: isScrolled ? 1 : 0,
              padding: isScrolled ? 6 : 0,
            }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            <img
              src="/logo-viet.png"
              alt="VIET"
              className="h-9 md:h-10 w-auto object-contain"
            />
          </motion.div>
        </motion.div>

        {/* Right: Back + Menu buttons */}
        <div className="flex items-center gap-2 md:gap-3">
          <motion.button
            onClick={() => (window.history.length > 1 ? navigate(-1) : handleNav(backHref))}
            className={cn(
              'flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-full font-semibold text-sm border-2 transition-all duration-300',
              glassButtonClass
            )}
            style={!isScrolled ? { backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' } : {}}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </motion.button>

          <motion.button
            onClick={() => setIsMenuOpen(true)}
            className={cn(
              'flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full border-2 transition-all duration-300',
              glassButtonClass
            )}
            style={!isScrolled ? { backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' } : {}}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.header>

      {/* Fullscreen menu overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-slate-900 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-white/10">
              <button
                type="button"
                onClick={() => { handleNav('/'); setIsMenuOpen(false); }}
                className="focus:outline-none focus:ring-2 focus:ring-white/30 rounded"
              >
                <img 
                  src="/viet-logo-new.png" 
                  alt="VIET" 
                  className="h-10 w-auto"
                  width={120}
                  height={40}
                  loading="eager"
                  decoding="async"
                  fetchpriority="high"
                />
              </button>
              <motion.button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-full text-white hover:bg-white/10 transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 md:px-8 py-8">
              <ul className="space-y-1">
                {LEADER_NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <button
                      onClick={() => handleNav(link.href)}
                      className="w-full text-left px-4 py-3 rounded-lg text-white/90 hover:bg-white/10 hover:text-white font-medium transition-colors font-poppins"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LeaderPageBar;
