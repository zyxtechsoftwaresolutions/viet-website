import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, Plus, ChevronRight, Phone, Mail, MapPin } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import SearchBar from '@/components/SearchBar';

interface LeaderPageNavbarProps {
  backHref?: string;
}

const LeaderPageNavbar = ({ backHref = '/about' }: LeaderPageNavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBackHovered, setIsBackHovered] = useState(false);
  const [isNaacHovered, setIsNaacHovered] = useState(false);
  
  // Departments 3-column state
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  // Ref to track if we're programmatically setting stream/level (prevents useEffect override)
  const isProgrammaticSelection = useRef(false);

  // Program Data Structure — Diploma, Engineering PG, Management use /programs/department/:slug (editable in Admin → Department Pages)
  const programData = {
    diploma: [
      { name: 'Civil Engineering', href: '/programs/department/diploma-civil', description: 'Foundation in construction, surveying, and infrastructure development for building projects.' },
      { name: 'Computer Science Engineering', href: '/programs/department/diploma-cse', description: 'Core programming, hardware fundamentals, and software development skills for IT careers.' },
      { name: 'Electronics & Communications Engineering', href: '/programs/department/diploma-ece', description: 'Study electronic circuits, communication systems, and signal processing technologies.' },
      { name: 'Electrical & Electronics Engineering', href: '/programs/department/diploma-eee', description: 'Master electrical systems, power generation, and electronic device applications.' },
      { name: 'Mechanical Engineering', href: '/programs/department/diploma-mechanical', description: 'Design and manufacturing of machines, thermal systems, and mechanical components.' }
    ],
    engineering: {
      ug: [
        { name: 'Automobile Engineering (AME)', href: '/programs/engineering/ug/ame', description: 'Design, develop, and manufacture automobiles including cars, trucks, and motorcycles with focus on modern automotive technologies.' },
        { name: 'Basic Science & Humanities (BS&H)', href: '/programs/engineering/ug/bsh', description: 'Strong foundation in physics, chemistry, mathematics, and communication skills essential for all engineering disciplines.' },
        { name: 'Civil Engineering (CIVIL)', href: '/programs/engineering/ug/civil', description: 'Plan, design, and construct infrastructure projects including buildings, bridges, roads, and water systems.' },
        { name: 'Computer Science & Engineering (CSE)', href: '/programs/engineering/ug/cse', description: 'Comprehensive study of programming, algorithms, databases, and software development for the digital age.' },
        { name: 'CSE - Data Science (CSD)', href: '/programs/engineering/ug/data-science', description: 'Specialize in big data analytics, machine learning, and data-driven decision making for business intelligence.' },
        { name: 'CSE - Cyber Security (CSC)', href: '/programs/engineering/ug/cyber-security', description: 'Protect digital assets with expertise in network security, ethical hacking, and information security management.' },
        { name: 'CSE - AI & Machine Learning (CSM)', href: '/programs/engineering/ug/aiml', description: 'Build intelligent systems using artificial intelligence, deep learning, and neural network technologies.' },
        { name: 'Electronics & Communication Engineering (ECE)', href: '/programs/engineering/ug/ece', description: 'Design electronic systems, communication networks, and embedded systems for modern technology applications.' },
        { name: 'Electrical & Electronics Engineering (EEE)', href: '/programs/engineering/ug/eee', description: 'Master power systems, electrical machines, and renewable energy technologies for sustainable power solutions.' },
        { name: 'Mechanical Engineering (Mech)', href: '/programs/engineering/ug/mechanical', description: 'Design and analyze mechanical systems, thermal equipment, and manufacturing processes for industry applications.' }
      ],
      pg: [
        { name: 'CAD/CAM', href: '/programs/department/pg-cadcam', description: 'Advanced computer-aided design and manufacturing techniques for precision engineering and automation.' },
        { name: 'Computer Science & Engineering (CSE)', href: '/programs/department/pg-cse', description: 'Advanced research in algorithms, distributed systems, and cutting-edge software technologies.' },
        { name: 'Power Systems', href: '/programs/department/pg-power-systems', description: 'Specialize in power generation, transmission, distribution, and smart grid technologies.' },
        { name: 'Structural Engineering', href: '/programs/department/pg-structural', description: 'Advanced analysis and design of complex structures including high-rise buildings and bridges.' },
        { name: 'Thermal Engineering', href: '/programs/department/pg-thermal', description: 'Study heat transfer, thermodynamics, and energy systems for efficient thermal management.' },
        { name: 'VLSI & Embedded Systems', href: '/programs/department/pg-vlsi', description: 'Design integrated circuits and embedded systems for electronics and semiconductor industry.' }
      ]
    },
    management: {
      ug: [
        { name: 'BBA (Bachelor of Business Administration)', href: '/programs/department/management-bba', description: 'Develop business acumen, leadership skills, and management expertise for corporate careers.' },
        { name: 'BCA (Bachelor of Computer Applications)', href: '/programs/department/management-bca', description: 'Build strong programming and IT skills for software development and application design.' }
      ],
      pg: [
        { name: 'MBA (Master of Business Administration)', href: '/programs/department/management-mba', description: 'Advanced management education with specializations in marketing, finance, HR, and operations.' },
        { name: 'MCA (Master of Computer Applications)', href: '/programs/department/management-mca', description: 'Advanced software development, system design, and IT project management for tech leadership.' }
      ]
    }
  };

  // Stream options
  const streamOptions = [
    { id: 'diploma', name: 'Diploma' },
    { id: 'engineering', name: 'Engineering' },
    { id: 'management', name: 'Management' }
  ];

  // Get level options based on stream
  const getLevelOptions = () => {
    if (selectedStream === 'engineering') {
      return [
        { id: 'ug', name: 'Undergraduate' },
        { id: 'pg', name: 'Postgraduate' }
      ];
    }
    if (selectedStream === 'management') {
      return [
        { id: 'ug', name: 'Undergraduate' },
        { id: 'pg', name: 'Postgraduate' }
      ];
    }
    return [];
  };

  // Get courses based on stream and level
  const getCourses = () => {
    if (selectedStream === 'diploma') {
      return programData.diploma;
    }
    if (selectedStream === 'engineering' && selectedLevel) {
      return programData.engineering[selectedLevel as keyof typeof programData.engineering] || [];
    }
    if (selectedStream === 'management' && selectedLevel) {
      return programData.management[selectedLevel as keyof typeof programData.management] || [];
    }
    return [];
  };

  // Reset selections when stream changes
  const handleStreamSelect = (stream: string) => {
    setSelectedStream(stream);
    if (stream === 'engineering' || stream === 'management') {
      setSelectedLevel('ug');
    } else {
      setSelectedLevel(null);
    }
  };

  // Auto-select Diploma when Departments tab is opened (only if no stream is already selected)
  useEffect(() => {
    if (activeNavItem === 'departments') {
      // Only auto-select diploma if we're not programmatically setting it
      if (!isProgrammaticSelection.current && !selectedStream) {
        setSelectedStream('diploma');
        setSelectedLevel(null);
      }
      // Reset the flag after useEffect runs
      isProgrammaticSelection.current = false;
    } else {
      setSelectedStream(null);
      setSelectedLevel(null);
      isProgrammaticSelection.current = false;
    }
  }, [activeNavItem]);

  // Optimized scroll detection with requestAnimationFrame and proper cleanup
  useEffect(() => {
    let rafId: number | null = null;
    let ticking = false;
    
    const updateScrollState = () => {
      if (location.pathname !== '/') {
        // For non-home pages: simple scroll threshold
        setIsScrolled(window.scrollY > 50);
      } else {
        // For home page: check ticker section intersection or fallback to scroll position
        const tickerEl = document.getElementById('ticker-section');
        if (tickerEl) {
          const rect = tickerEl.getBoundingClientRect();
          setIsScrolled(rect.top <= 10);
        } else {
          // Fallback: trigger when scroll passes video height (100vh)
          setIsScrolled(window.scrollY >= window.innerHeight - 80);
        }
      }
      ticking = false;
    };
    
    const handleScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };
    
    // Initial check
    updateScrollState();
    
    // Use passive scroll listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // For home page, also use IntersectionObserver if ticker exists
    let observer: IntersectionObserver | null = null;
    if (location.pathname === '/') {
      const tickerEl = document.getElementById('ticker-section');
      if (tickerEl) {
        observer = new IntersectionObserver(
          ([e]) => {
            setIsScrolled(e.isIntersecting);
          },
          { threshold: 0, rootMargin: '-10px 0px 0px 0px' }
        );
        observer.observe(tickerEl);
      }
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      if (observer) {
        observer.disconnect();
      }
    };
  }, [location.pathname]);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveNavItem(null);
  }, [location.pathname]);

  // Prevent body scroll when menu is open (deferred so open animation isn't interrupted)
  useEffect(() => {
    let scrollLockTimer: ReturnType<typeof setTimeout> | undefined;

    if (isMenuOpen) {
      setActiveNavItem('about');
      scrollLockTimer = setTimeout(() => {
        const scrollY = window.scrollY;
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = `-${scrollY}px`;
      }, 80);
    } else {
      const scrollY = document.body.style.top;
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }

    return () => {
      if (scrollLockTimer) clearTimeout(scrollLockTimer);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isMenuOpen]);

  // Top ribbon quick links (SCHOOLS removed per request)
  const ECAP_URL = 'https://webprosindia.com/viet/Default.aspx?ReturnUrl=%2fviet';
  const CAMU_STAFF_URL = 'https://camu.in/';
  const CAMU_STUDENT_URL = 'https://www.mycamu.co.in/#/';

  const topRibbonLeftLinks = [
    { name: 'ALUMNI', href: '#alumni' },
    { name: 'FACULTY', href: '/faculty' },
    { name: 'CAMPUS LIFE', href: '/campus-life' },
    { name: 'PRAGNA', href: 'https://pragna.info/' },
    { name: 'HAPPENINGS', href: '#happenings' },
  ];

  const topRibbonRightLinksBeforeLogin = [
    { name: 'CONTACT', href: '/contact' },
    { name: 'Student Login', href: CAMU_STUDENT_URL },
    { name: 'Staff Login', href: CAMU_STAFF_URL },
    { name: 'ECAP Login', href: ECAP_URL },
  ];

  // Main navigation: mega-menu tabs (id) + link-only tabs (href) beside them
  const mainNavItems: { name: string; id?: string; href?: string }[] = [
    { name: 'Home', href: '/' },
    { name: 'About', id: 'about' },
    { name: 'Academics', id: 'academics' },
    { name: 'Departments', id: 'departments' },
    { name: 'Exam Cell', href: '/examinations/ug-pg' },
    { name: 'IQAC', id: 'iqac' },
    { name: 'Governance', href: '/governing-body' },
    { name: 'Research', href: '/research-development' },
    { name: 'Facilities', id: 'facilities' },
    { name: 'Infrastructure', href: '/page/infrastructure' },
    { name: 'Finance', href: '/page/finance' },
    { name: 'Quality', href: '/iqac' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Online Payment', href: '/page/online-payment' },
    { name: 'Contact us', href: '/contact' },
  ];

  // Submenu data for each main nav item
  const subMenuData: Record<string, {
    title: string;
    description: string;
    knowMoreLink: string;
    columns: Array<{
      title: string;
      description?: string;
      link: string;
    }>;
  }> = {
    about: {
      title: 'About Visakha Institute of Engineering & Technology (A)',
      description: 'VIET is a premier engineering institution accredited with NAAC \'A\' Grade, committed to providing quality technical education since 2008.',
      knowMoreLink: '/about',
      columns: [
        { title: 'About Us', description: 'Learn more about VIET and our journey', link: '/about' },
        { title: 'Vision & Mission', description: 'Our guiding principles and goals for excellence in education', link: '/vision-mission' },
        { title: 'Chairman', description: 'Message from our visionary leader', link: '/chairman' },
        { title: 'Principal', description: 'Leadership and academic excellence', link: '/principal' },
        { title: 'Diploma Principal', description: 'Diploma college leadership', link: '/diploma-principal' },
        { title: 'Dean Academics', description: 'Academic administration and curriculum', link: '/dean-academics' },
        { title: 'Dean Innovation', description: 'Innovation and student projects', link: '/dean-innovation' },
        { title: 'HR', description: 'Human Resources and institutional culture', link: '/hr' },
        { title: 'Faculty', description: 'Our faculty across all departments', link: '/faculty' },
        { title: 'Accreditations', description: 'NAAC A Grade, AICTE approved, UGC recognized', link: '/accreditations' },
        { title: 'Governing Body', description: 'Institutional governance structure', link: '/governing-body' },
        { title: 'Organizational Chart', description: 'Administrative structure', link: '/organizational-chart' },
        { title: 'Committees', description: 'Various institutional committees', link: '/committees' },
        { title: 'Grievance Redressal', description: 'Student and staff grievance mechanism', link: '/grievance-redressal' },
      ]
    },
    academics: {
      title: 'Academics & Programs',
      description: 'Explore our wide range of undergraduate, postgraduate, and diploma programs designed to shape future leaders.',
      knowMoreLink: '#program-finder',
      columns: [
        { title: 'Diploma Programs', description: 'SBTET approved diploma courses', link: '/examinations/diploma' },
        { title: 'B.Tech Programs', description: 'Undergraduate engineering programs', link: '/btech' },
        { title: 'M.Tech Programs', description: 'Postgraduate engineering programs', link: '/mtech' },
        { title: 'BBA', description: 'Bachelor of Business Administration', link: '/bba' },
        { title: 'MBA', description: 'Master of Business Administration', link: '/mba' },
        { title: 'BCA', description: 'Bachelor of Computer Applications', link: '/bca' },
        { title: 'MCA', description: 'Master of Computer Applications', link: '/mca' },
        { title: 'Examinations', description: 'UG, PG examination details', link: '/examinations/ug-pg' },
      ]
    },
    departments: {
      title: 'Departments',
      description: 'Our departments are equipped with state-of-the-art facilities and experienced faculty.',
      knowMoreLink: '#departments',
      columns: []
    },
    facilities: {
      title: 'Facilities',
      description: 'World-class infrastructure and facilities to support holistic development of students.',
      knowMoreLink: '#facilities',
      columns: [
        { title: 'Campus Life', description: 'Experience life at VIET - events, clubs, and culture', link: '/campus-life' },
        { title: 'Center of Excellence', description: 'EISC, COE and innovation labs', link: '/facilities/center-of-excellence' },
        { title: 'Library', description: 'Digital and physical library resources', link: '/facilities/library' },
        { title: 'Laboratories', description: 'State-of-the-art labs and equipment', link: '/facilities/laboratory' },
        { title: 'NSS', description: 'National Service Scheme activities', link: '/facilities/nss' },
        { title: 'Hostel', description: 'Comfortable accommodation facilities', link: '/facilities/hostel' },
        { title: 'Sports', description: 'Sports facilities and activities', link: '/facilities/sports' },
        { title: 'WIFI', description: 'High-speed internet connectivity', link: '/facilities/wifi' },
        { title: 'Transport', description: 'College transport services', link: '/facilities/transport' },
        { title: 'Medical Facility', description: 'Healthcare services on campus', link: '/facilities/medical-facility' },
        { title: 'Cafeteria', description: 'Food and dining facilities', link: '/facilities/cafeteria' },
        { title: 'RO Water Plant', description: 'Safe drinking water facility', link: '/facilities/ro-water-plant' },
        { title: 'Green Initiatives', description: 'Eco-friendly campus initiatives', link: '/facilities/green-initiatives' },
        { title: 'Solar Power Plant', description: 'Renewable energy on campus', link: '/facilities/solar-power-plant' },
      ]
    },
    iqac: {
      title: 'Internal Quality Assurance Cell',
      description: 'IQAC ensures quality enhancement through continuous improvement initiatives.',
      knowMoreLink: '/iqac',
      columns: [
        { title: 'AQAR 2023-2024', description: 'Annual Quality Assurance Report', link: '/aqar-2023-2024' },
        { title: 'AQAR 2022-2023', description: 'Annual Quality Assurance Report', link: '/aqar-2022-2023' },
        { title: 'AQAR 2021-2022', description: 'Annual Quality Assurance Report', link: '/aqar-2021-2022' },
        { title: 'NIRF', description: 'National Institutional Ranking Framework', link: '/nirf' },
        { title: 'SSR', description: 'Self Study Report', link: '/ssr' },
        { title: 'Best Practices', description: 'Institutional best practices', link: '/best-practices' },
        { title: 'Feedback', description: 'Stakeholder feedback mechanism', link: '/feedback-form' },
      ]
    },
  };

  const handleNavigation = (href: string) => {
    setIsMenuOpen(false);
    setActiveNavItem(null);
    
    if (href.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(href.substring(1));
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const element = document.getElementById(href.substring(1));
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (href.startsWith('http://') || href.startsWith('https://')) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      window.scrollTo(0, 0);
      navigate(href);
    }
  };

  const handleAdmissionsClick = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSfzvrY5qJTPfzBiW1UU1JZAvNAN8qcjv07v6lWSc1Xe0X-wvw/viewform?usp=send_form', '_blank');
  };

  const handleVsptClick = () => {
    document.getElementById('ticker-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(backHref);
    }
  };

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  const homeNavChipClass =
    'h-12 sm:h-14 md:h-16 lg:h-[4.25rem] px-2.5 sm:px-3 rounded-xl glass-panel-dark border border-white/25';

  const homeLogoChipClass =
    'h-12 sm:h-14 md:h-16 lg:h-[4.25rem] px-2.5 sm:px-3 rounded-xl glass-panel-dark-logo';

  const homeMenuBtnClass =
    'h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 lg:h-[3.25rem] lg:w-[3.25rem] rounded-xl glass-panel-dark border border-white/25';

  const menuEase = [0.22, 1, 0.36, 1] as const;
  const menuTransition = { duration: 0.5, ease: menuEase };

  return (
    <>
      {/* Minimal Floating Header - ONLY visible when menu is CLOSED */}
      <AnimatePresence>
        {!isMenuOpen && (
          <motion.header
            className="fixed top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-50 flex items-center justify-between gap-3 px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-300 pointer-events-none"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.25, ease: menuEase }}
          >
            {/* Logo — tap/click goes to home */}
            <motion.div 
              className="flex items-center shrink-0 cursor-pointer pointer-events-auto"
              onClick={() => handleNavigation('/')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Full logo container - visible when not scrolled */}
              <motion.div 
                className={cn(
                  'flex items-center justify-center',
                  isHomePage ? homeLogoChipClass : 'rounded-xl overflow-hidden glass-panel-dark px-2 py-1 sm:px-2.5 sm:py-1.5'
                )}
                initial={false}
                animate={{
                  width: isScrolled ? 0 : 'auto',
                  opacity: isScrolled ? 0 : 1,
                  padding: isScrolled ? 0 : undefined,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                <img
                  src="/viet-logo-new.png"
                  alt="VIET Logo"
                  className={cn(
                    'w-auto object-contain',
                    isHomePage ? 'h-10 sm:h-12 md:h-14 lg:h-[3.75rem]' : 'h-9 sm:h-11 md:h-12 lg:h-14'
                  )}
                  width={140}
                  height={48}
                  loading="eager"
                  fetchpriority="high"
                  decoding="async"
                />
              </motion.div>
              
              {/* Mini logo container - visible when scrolled */}
              <motion.div
                className={cn(
                  'overflow-hidden flex items-center justify-center',
                  isHomePage
                    ? cn(homeNavChipClass, 'rounded-full')
                    : 'rounded-full glass-panel p-1 sm:p-1.5'
                )}
                initial={false}
                animate={{
                  width: isScrolled ? 'auto' : 0,
                  opacity: isScrolled ? 1 : 0,
                  padding: isScrolled ? undefined : 0,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                <img
                  src="/logo-viet.png"
                  alt="VIET Logo"
                  className={cn(
                    'w-auto object-contain',
                    isHomePage ? 'h-9 sm:h-11 md:h-12' : 'h-9 md:h-10'
                  )}
                  width={90}
                  height={36}
                  loading="eager"
                  fetchpriority="high"
                  decoding="async"
                />
              </motion.div>
            </motion.div>

            {/* Right Side - NAAC + Back/College Code + Menu Button */}
            <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 pointer-events-auto shrink-0">
              {/* NAAC Grade A — official badge image */}
              {isHomePage && (
                <motion.a
                  href="https://www.naac.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setIsNaacHovered(true)}
                  onMouseLeave={() => setIsNaacHovered(false)}
                  className={cn(
                    'hidden sm:flex items-center justify-center shrink-0 transition-all duration-300 touch-manipulation',
                    isNaacHovered && 'scale-[1.03]'
                  )}
                  whileTap={{ scale: 0.95 }}
                  aria-label="NAAC Grade A Accredited"
                >
                  <img
                    src="/naac-a-grade-icon.png"
                    alt="NAAC Grade A Accredited"
                    className="h-14 sm:h-16 md:h-[4.25rem] lg:h-20 w-auto object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </motion.a>
              )}

              {/* Back (inner pages) / College Code VSPT (home) */}
              <motion.button
                onClick={isHomePage ? handleVsptClick : handleBackClick}
                onMouseEnter={() => setIsBackHovered(true)}
                onMouseLeave={() => setIsBackHovered(false)}
                className={cn(
                  'flex items-center justify-center gap-1.5 font-semibold text-xs sm:text-sm transition-all duration-300 touch-manipulation',
                  isHomePage
                    ? cn(
                        homeNavChipClass,
                        'min-w-[4.75rem] sm:min-w-[6.25rem]',
                        isBackHovered && 'scale-[1.03] shadow-[0_0_20px_rgba(225,115,26,0.45)]'
                      )
                    : cn(
                        'px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border-2',
                        isScrolled
                          ? isBackHovered
                            ? "bg-white text-primary border-primary"
                            : "bg-primary text-white border-primary"
                          : cn(
                              "glass-panel border-white/25",
                              isBackHovered
                                ? "bg-white/20 text-white shadow-lg"
                                : "bg-white/10 text-white shadow-md"
                            )
                      )
                )}
                whileTap={{ scale: 0.95 }}
              >
                {!isHomePage && (
                  <ArrowLeft
                    className={cn(
                      "w-4 h-4 transition-colors duration-300",
                      isScrolled ? (isBackHovered ? "text-primary" : "text-white") : "text-white"
                    )}
                  />
                )}
                {isHomePage ? (
                  <div className="flex flex-col items-center leading-none">
                    <span className="text-[7px] sm:text-[8px] font-bold text-white/80 tracking-[0.08em] uppercase">College Code</span>
                    <span className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-300 drop-shadow-md tracking-wider animate-text-blink">VSPT</span>
                  </div>
                ) : (
                  <span>Back</span>
                )}
              </motion.button>

              {/* Menu Button — dark glass, modern asymmetric hamburger */}
              <motion.button
                onClick={() => setIsMenuOpen(true)}
                className={cn(
                  'flex items-center justify-center text-white touch-manipulation shrink-0 transition-all duration-300 hover:bg-white/15 hover:border-white/40',
                  isHomePage
                    ? homeMenuBtnClass
                    : cn(
                        'w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-white/25',
                        isScrolled
                          ? 'bg-primary text-white border-primary shadow-md hover:brightness-110'
                          : 'glass-panel-dark hover:bg-white/15'
                      ),
                  isScrolled && !isHomePage && 'shadow-md'
                )}
                whileTap={{ scale: 0.92 }}
                aria-label="Open menu"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="w-5 h-5 sm:w-[1.35rem] sm:h-[1.35rem]"
                  aria-hidden
                >
                  <line x1="5" y1="7" x2="19" y2="7" />
                  <line x1="5" y1="12" x2="15" y2="12" />
                  <line x1="5" y1="17" x2="19" y2="17" />
                </svg>
              </motion.button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Fullscreen Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[9999] flex flex-col"
            style={{ backgroundColor: '#000000' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: menuEase }}
          >
            {/* Top Ribbon - hidden on mobile */}
            <motion.div
              className="text-white flex-shrink-0 pt-4 pb-1 hidden md:block"
              style={{ backgroundColor: '#000000' }}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...menuTransition, delay: 0.05 }}
            >
              <div className="w-full px-4 md:px-8">
                <div className="flex items-center justify-between py-2">
                  <div className="hidden md:flex items-center gap-3 lg:gap-5">
                    {topRibbonLeftLinks.map((link) => (
                      <button
                        key={link.name}
                        onClick={() => handleNavigation(link.href)}
                        className="hover:text-yellow-300 transition-colors font-medium tracking-wider text-[11px] lg:text-xs uppercase"
                        style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                      >
                        {link.name}
                      </button>
                    ))}
                  </div>
                  <div className="hidden md:flex items-center justify-center flex-1 mx-4 lg:mx-6 max-w-[280px]">
                    <SearchBar />
                  </div>
                  <div className="flex items-center gap-3 lg:gap-5">
                    {topRibbonRightLinksBeforeLogin.map((link) => (
                      <button
                        key={link.name}
                        onClick={() => handleNavigation(link.href)}
                        className="hover:text-yellow-300 transition-colors font-medium tracking-wider text-[11px] lg:text-xs uppercase"
                        style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                      >
                        {link.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-0" style={{ backgroundColor: '#000000' }}>
              {/* MOBILE LAYOUT (<md) - Vertical accordion navigation */}
              <motion.div
                className="md:hidden flex-1 flex flex-col min-h-0 overflow-hidden"
                initial={{ opacity: 0, y: 28, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ ...menuTransition, delay: 0.08 }}
              >
                {/* Mobile Header - Logo + Admissions + Close */}
                <div className="flex items-center justify-between px-4 pt-4 pb-3 flex-shrink-0 safe-area-top">
                  <motion.div
                    className="border-2 border-[#E1731A] p-1.5 rounded-lg cursor-pointer flex-shrink-0 touch-manipulation"
                    style={{ backgroundColor: '#E1731A' }}
                    onClick={() => { setIsMenuOpen(false); handleNavigation('/'); }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img src="/viet-logo-new.png" alt="VIET Logo" className="h-8 w-auto object-contain" loading="lazy" decoding="async" />
                  </motion.div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAdmissionsClick}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs border-2 border-[#E1731A] text-white touch-manipulation min-h-[40px] admissions-btn-glow"
                      style={{ backgroundColor: '#E1731A' }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Admissions
                    </button>
                    <button
                      onClick={() => { setIsMenuOpen(false); setActiveNavItem(null); }}
                      className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#E1731A] text-white touch-manipulation"
                      style={{ backgroundColor: '#E1731A' }}
                      aria-label="Close menu"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Mobile Search Bar */}
                <div className="px-4 pb-3 flex-shrink-0">
                  <SearchBar />
                </div>

                {/* Mobile Navigation - Vertical Accordion */}
                <div className="flex-1 overflow-y-auto px-4 pb-4" style={{ WebkitOverflowScrolling: 'touch' }}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                    {mainNavItems.map((item) => (
                      <div key={item.name} className="border-b border-gray-100 last:border-b-0">
                        {item.href ? (
                          <button
                            onClick={() => handleNavigation(item.href!)}
                            className="w-full flex items-center justify-between px-5 py-4 text-left text-[15px] font-medium text-gray-800 active:bg-gray-50 touch-manipulation"
                            style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                          >
                            {item.name}
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => setActiveNavItem(activeNavItem === item.id ? null : item.id!)}
                              className={cn(
                                "w-full flex items-center justify-between px-5 py-4 text-left text-[15px] font-medium touch-manipulation transition-colors",
                                activeNavItem === item.id
                                  ? "text-[#E1731A] bg-orange-50/50"
                                  : "text-gray-800 active:bg-gray-50"
                              )}
                              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                            >
                              {item.name}
                              <motion.div
                                animate={{ rotate: activeNavItem === item.id ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronRight className={cn(
                                  "w-4 h-4 transition-colors",
                                  activeNavItem === item.id ? "text-[#E1731A]" : "text-gray-400"
                                )} />
                              </motion.div>
                            </button>
                            {/* Expandable submenu */}
                            <AnimatePresence>
                              {activeNavItem === item.id && subMenuData[item.id!] && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                                  className="overflow-hidden"
                                >
                                  {item.id === 'departments' ? (
                                    <div className="px-4 pb-4 space-y-3">
                                      {/* Stream pills */}
                                      <div className="flex gap-2 flex-wrap">
                                        {streamOptions.map((stream) => (
                                          <button
                                            key={stream.id}
                                            onClick={() => handleStreamSelect(stream.id)}
                                            className={cn(
                                              "px-3 py-1.5 rounded-full text-xs font-semibold transition-all touch-manipulation",
                                              selectedStream === stream.id
                                                ? "bg-[#E1731A] text-white"
                                                : "bg-gray-100 text-gray-600 active:bg-gray-200"
                                            )}
                                          >
                                            {stream.name}
                                          </button>
                                        ))}
                                      </div>
                                      {/* Level pills (for engineering/management) */}
                                      {selectedStream && selectedStream !== 'diploma' && (
                                        <div className="flex gap-2">
                                          {getLevelOptions().map((level) => (
                                            <button
                                              key={level.id}
                                              onClick={() => setSelectedLevel(level.id)}
                                              className={cn(
                                                "px-3 py-1.5 rounded-full text-xs font-medium transition-all touch-manipulation",
                                                selectedLevel === level.id
                                                  ? "bg-[#0d47a1] text-white"
                                                  : "bg-blue-50 text-[#0d47a1] active:bg-blue-100"
                                              )}
                                            >
                                              {level.name}
                                            </button>
                                          ))}
                                        </div>
                                      )}
                                      {/* Course list */}
                                      <div className="space-y-1">
                                        {getCourses().map((course) => (
                                          <button
                                            key={course.name}
                                            onClick={() => handleNavigation(course.href)}
                                            className="w-full flex items-center justify-between px-3 py-2.5 text-left rounded-lg active:bg-gray-50 touch-manipulation"
                                          >
                                            <span className="text-sm text-gray-700 font-medium">{course.name}</span>
                                            <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="px-4 pb-4 space-y-1">
                                      {subMenuData[item.id!].columns.map((col) => {
                                        const handleMobileAcademicsClick = () => {
                                          if (item.id === 'academics') {
                                            isProgrammaticSelection.current = true;
                                            if (col.title === 'Diploma Programs') {
                                              setSelectedStream('diploma');
                                              setSelectedLevel(null);
                                              setActiveNavItem('departments');
                                            } else if (col.title === 'B.Tech Programs') {
                                              setSelectedStream('engineering');
                                              setSelectedLevel('ug');
                                              setActiveNavItem('departments');
                                            } else if (col.title === 'M.Tech Programs') {
                                              setSelectedStream('engineering');
                                              setSelectedLevel('pg');
                                              setActiveNavItem('departments');
                                            } else if (col.title === 'BBA' || col.title === 'BCA') {
                                              setSelectedStream('management');
                                              setSelectedLevel('ug');
                                              setActiveNavItem('departments');
                                            } else if (col.title === 'MBA' || col.title === 'MCA') {
                                              setSelectedStream('management');
                                              setSelectedLevel('pg');
                                              setActiveNavItem('departments');
                                            } else {
                                              isProgrammaticSelection.current = false;
                                              handleNavigation(col.link);
                                            }
                                          } else {
                                            handleNavigation(col.link);
                                          }
                                        };
                                        return (
                                          <button
                                            key={col.title}
                                            onClick={handleMobileAcademicsClick}
                                            className="w-full flex items-center justify-between px-3 py-2.5 text-left rounded-lg active:bg-gray-50 touch-manipulation"
                                          >
                                            <span className="text-sm text-gray-700 font-medium">{col.title}</span>
                                            <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Mobile Quick Links - Login buttons */}
                  <div className="mt-4 bg-white/5 rounded-2xl p-4 space-y-2">
                    {topRibbonRightLinksBeforeLogin.map((link) => (
                      <button
                        key={link.name}
                        onClick={() => handleNavigation(link.href)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-white/80 active:text-white rounded-lg active:bg-white/5 touch-manipulation"
                        style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                      >
                        {link.name}
                        <ChevronRight className="w-4 h-4 text-white/40" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Contact Footer */}
                <div className="flex-shrink-0 px-4 py-3 safe-area-bottom" style={{ backgroundColor: '#000000' }}>
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                    <a href="tel:+919959617476" className="flex items-center gap-1.5 touch-manipulation min-h-[40px]">
                      <Phone className="w-3.5 h-3.5" />
                      +91-9959617476
                    </a>
                    <a href="mailto:vietvsp@gmail.com" className="flex items-center gap-1.5 touch-manipulation min-h-[40px]">
                      <Mail className="w-3.5 h-3.5" />
                      vietvsp@gmail.com
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* DESKTOP LAYOUT (md+) - Original horizontal tab navigation */}
              <div className="hidden md:flex flex-1 flex-col min-h-0">
                <div className="flex-1 px-4 md:px-8 py-2 overflow-hidden">
                  <motion.div 
                    className="bg-white rounded-[20px] h-full flex flex-col overflow-hidden shadow-2xl"
                    initial={{ opacity: 0, y: 32, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.98 }}
                    transition={{ ...menuTransition, delay: 0.1 }}
                  >
                    {/* Inner Header with Logo and Navigation */}
                    <div className="px-4 md:px-8 py-4 flex-shrink-0">
                      <div className="flex items-start gap-3 md:gap-4">
                        <motion.div 
                          className="border-2 border-[#E1731A] p-2 md:p-2.5 rounded-xl cursor-pointer flex-shrink-0"
                          style={{ backgroundColor: '#E1731A' }}
                          onClick={() => { setIsMenuOpen(false); handleNavigation('/'); }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <img src="/viet-logo-new.png" alt="VIET Logo" width={120} height={48} loading="lazy" decoding="async" className="h-10 md:h-12 w-auto object-contain" />
                        </motion.div>

                        {/* Navigation Tabs */}
                        <div className="flex-1 min-w-0 flex flex-wrap items-center gap-1.5 md:gap-2">
                          {mainNavItems.map((item) =>
                            item.href ? (
                              <button
                                key={item.name}
                                onClick={() => handleNavigation(item.href!)}
                                className="px-2.5 py-1.5 rounded-md text-xs md:text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-100 transition-all whitespace-nowrap"
                                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                              >
                                {item.name}
                              </button>
                            ) : (
                              <button
                                key={item.id}
                                onClick={() => setActiveNavItem(activeNavItem === item.id ? null : item.id!)}
                                className={cn(
                                  "px-2.5 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all whitespace-nowrap",
                                  activeNavItem === item.id
                                    ? "text-[#0a192f] bg-primary/10 border-b-2 border-primary"
                                    : "text-gray-600 hover:text-primary hover:bg-gray-100 border-b-2 border-transparent"
                                )}
                                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                              >
                                {item.name}
                                {activeNavItem === item.id && (
                                  <span className="ml-0.5 text-primary">•</span>
                                )}
                              </button>
                            )
                          )}
                        </div>

                        {/* Admissions + Close */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <motion.button
                            onClick={handleAdmissionsClick}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 border-2 border-[#E1731A] shadow-md text-white admissions-btn-glow"
                            style={{ backgroundColor: '#E1731A' }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Plus className="w-4 h-4" style={{ color: 'white' }} />
                            <span>Admissions</span>
                          </motion.button>
                          <button
                            onClick={() => { setIsMenuOpen(false); setActiveNavItem(null); }}
                            className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#E1731A] shadow-md hover:opacity-90 transition-all duration-300 text-white"
                            style={{ backgroundColor: '#E1731A' }}
                          >
                            <X className="w-5 h-5" style={{ color: 'white' }} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200" />

                    {/* Mega Menu Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto">
                      <AnimatePresence mode="wait">
                        {activeNavItem && subMenuData[activeNavItem] && (
                          <motion.div
                            key={activeNavItem}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="h-full"
                          >
                            {activeNavItem === 'departments' ? (
                              <div className="px-8 md:px-12 py-9 md:py-11 h-full">
                                <div className="flex h-full gap-0">
                                  <div className="w-48 border-r border-gray-200 flex-shrink-0">
                                    <h4 className="text-[#0d47a1] font-semibold text-sm mb-4 px-4 border-l-2 border-transparent"
                                        style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                      {selectedStream ? streamOptions.find(s => s.id === selectedStream)?.name : ''}
                                    </h4>
                                    <div className="space-y-1">
                                      {streamOptions.map((stream) => (
                                        <button
                                          key={stream.id}
                                          onClick={() => handleStreamSelect(stream.id)}
                                          className={cn(
                                            "w-full text-left px-4 py-2.5 text-sm transition-all duration-200 border-l-2",
                                            selectedStream === stream.id
                                              ? "text-primary border-primary bg-primary/10 font-medium"
                                              : "text-gray-700 border-transparent hover:text-[#0d47a1] hover:bg-gray-50"
                                          )}
                                          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                                        >
                                          {stream.name}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  <div className={cn(
                                    "w-48 border-r border-gray-200 flex-shrink-0 transition-all duration-300",
                                    (selectedStream === 'diploma' || !selectedStream) ? "opacity-30" : "opacity-100"
                                  )}>
                                    {selectedStream && selectedStream !== 'diploma' && (
                                      <>
                                        <h4 className="text-[#0d47a1] font-semibold text-sm mb-4 px-4"
                                            style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                          {selectedLevel ? getLevelOptions().find(l => l.id === selectedLevel)?.name : ''}
                                        </h4>
                                        <div className="space-y-1">
                                          {getLevelOptions().map((level) => (
                                            <button
                                              key={level.id}
                                              onClick={() => setSelectedLevel(level.id)}
                                              className={cn(
                                                "w-full text-left px-4 py-2.5 text-sm transition-all duration-200 border-l-2",
                                                selectedLevel === level.id
                                                  ? "text-primary border-primary bg-primary/10 font-medium"
                                                  : "text-gray-700 border-transparent hover:text-[#0d47a1] hover:bg-gray-50"
                                              )}
                                              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                                            >
                                              {level.name}
                                            </button>
                                          ))}
                                        </div>
                                      </>
                                    )}
                                  </div>

                                  <div className="flex-1 pl-6 md:pl-8 overflow-y-auto">
                                    {getCourses().length > 0 ? (
                                      <>
                                        <h4 className="text-gray-500 text-xs uppercase tracking-wider mb-4"
                                            style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                          {selectedStream === 'diploma' ? 'Diploma Courses' : 
                                           selectedStream === 'engineering' ? (selectedLevel === 'ug' ? 'B.Tech Programs' : 'M.Tech Programs') :
                                           selectedStream === 'management' ? (selectedLevel === 'ug' ? 'UG Programs' : 'PG Programs') : 'Select a stream'}
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
                                          {getCourses().map((course, index) => (
                                            <motion.button
                                              key={course.name}
                                              initial={{ opacity: 0, x: 10 }}
                                              animate={{ opacity: 1, x: 0 }}
                                              transition={{ delay: index * 0.03 }}
                                              onClick={() => handleNavigation(course.href)}
                                              className="text-left group py-2 pr-4"
                                              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                                            >
                                              <h5 className="text-sm font-medium text-gray-800 group-hover:text-[#0d47a1] transition-colors mb-1">
                                                {course.name}
                                              </h5>
                                              {course.description && (
                                                <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors line-clamp-2 leading-relaxed">
                                                  {course.description}
                                                </p>
                                              )}
                                            </motion.button>
                                          ))}
                                        </div>
                                      </>
                                    ) : (
                                      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                                        {!selectedStream 
                                          ? 'Select a stream to view courses' 
                                          : selectedStream !== 'diploma' && !selectedLevel 
                                            ? 'Select a level to view courses'
                                            : 'No courses available'}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="px-8 md:px-12 py-9 md:py-11">
                                <div className="flex flex-col md:flex-row gap-8 md:gap-10">
                                  <div className="md:w-1/4 md:border-r border-gray-200 md:pr-10 pb-6 md:pb-0 border-b md:border-b-0 flex-shrink-0">
                                    <h3 
                                      className="text-lg md:text-xl text-[#0a192f] mb-3 leading-tight"
                                      style={{ 
                                        fontFamily: activeNavItem === 'about' 
                                          ? "'Anton', sans-serif" 
                                          : "'Cinzel', 'Times New Roman', Georgia, serif",
                                        fontWeight: activeNavItem === 'about' ? 400 : 700,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.01em'
                                      }}
                                    >
                                      {subMenuData[activeNavItem].title}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed mb-5" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                      {subMenuData[activeNavItem].description}
                                    </p>
                                    <button
                                      onClick={() => handleNavigation(subMenuData[activeNavItem].knowMoreLink)}
                                      className="inline-flex items-center gap-2 text-primary hover:text-[#0a192f] font-medium text-sm transition-colors group"
                                      style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                                    >
                                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                      Know More
                                    </button>
                                  </div>

                                  <div className="flex-1">
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-4 md:gap-x-7 md:gap-y-5">
                                      {subMenuData[activeNavItem].columns.map((col, index) => {
                                        const handleAcademicsClick = () => {
                                          if (activeNavItem === 'academics') {
                                            isProgrammaticSelection.current = true;
                                            if (col.title === 'Diploma Programs') {
                                              setSelectedStream('diploma');
                                              setSelectedLevel(null);
                                              setActiveNavItem('departments');
                                            } else if (col.title === 'B.Tech Programs') {
                                              setSelectedStream('engineering');
                                              setSelectedLevel('ug');
                                              setActiveNavItem('departments');
                                            } else if (col.title === 'M.Tech Programs') {
                                              setSelectedStream('engineering');
                                              setSelectedLevel('pg');
                                              setActiveNavItem('departments');
                                            } else if (col.title === 'BBA' || col.title === 'BCA') {
                                              setSelectedStream('management');
                                              setSelectedLevel('ug');
                                              setActiveNavItem('departments');
                                            } else if (col.title === 'MBA' || col.title === 'MCA') {
                                              setSelectedStream('management');
                                              setSelectedLevel('pg');
                                              setActiveNavItem('departments');
                                            } else {
                                              isProgrammaticSelection.current = false;
                                              handleNavigation(col.link);
                                            }
                                          } else {
                                            handleNavigation(col.link);
                                          }
                                        };

                                        return (
                                          <motion.button
                                            key={col.title}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.02 }}
                                            onClick={handleAcademicsClick}
                                            className="text-left group p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                            style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                                          >
                                            <h4 className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors flex items-center gap-1.5">
                                              {col.title}
                                              <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                            </h4>
                                            {col.description && (
                                              <p className="text-xs text-gray-500 mt-1.5 group-hover:text-gray-600 transition-colors line-clamp-2 leading-relaxed">
                                                {col.description}
                                              </p>
                                            )}
                                          </motion.button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </div>

                {/* Quick Contact Info at Bottom */}
                <div className="flex-shrink-0 py-4" style={{ backgroundColor: '#000000' }}>
                  <div className="px-4 md:px-8">
                    <div className="flex flex-wrap items-center justify-center gap-5 md:gap-10 text-sm text-gray-400">
                      <a href="tel:+919959617476" className="flex items-center gap-2 hover:text-white transition-colors">
                        <Phone className="w-4 h-4" />
                        +91-9959617476
                      </a>
                      <a href="mailto:vietvsp@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
                        <Mail className="w-4 h-4" />
                        vietvsp@gmail.com
                      </a>
                      <span className="hidden sm:flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Narava, Visakhapatnam
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LeaderPageNavbar;
