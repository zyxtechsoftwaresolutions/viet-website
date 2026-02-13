import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Plus, ChevronRight, Phone, Mail, MapPin } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const AmritaStyleHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPastVideoSection, setIsPastVideoSection] = useState(false);
  const [isAdmissionsHovered, setIsAdmissionsHovered] = useState(false);
  
  // Departments 3-column state
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  // Program Data Structure (same as Program Finder)
  const programData = {
    diploma: [
      { name: 'Agriculture Engineering', href: '/agricultural-engineering', description: 'Learn modern farming techniques, irrigation systems, and agricultural machinery for sustainable agriculture.' },
      { name: 'Civil Engineering', href: '/civil-engineering', description: 'Foundation in construction, surveying, and infrastructure development for building projects.' },
      { name: 'Computer Science Engineering', href: '/computer-engineering', description: 'Core programming, hardware fundamentals, and software development skills for IT careers.' },
      { name: 'Electronics & Communications Engineering', href: '/electronics-communications-engineering', description: 'Study electronic circuits, communication systems, and signal processing technologies.' },
      { name: 'Electrical & Electronics Engineering', href: '/electrical-electronics-engineering', description: 'Master electrical systems, power generation, and electronic device applications.' },
      { name: 'Mechanical Engineering', href: '/mechanical-engineering', description: 'Design and manufacturing of machines, thermal systems, and mechanical components.' }
    ],
    engineering: {
      ug: [
        { name: 'Automobile Engineering (AME)', href: '/automobile-engineering', description: 'Design, develop, and manufacture automobiles including cars, trucks, and motorcycles with focus on modern automotive technologies.' },
        { name: 'Basic Science & Humanities (BS&H)', href: '/bs-h', description: 'Strong foundation in physics, chemistry, mathematics, and communication skills essential for all engineering disciplines.' },
        { name: 'Civil Engineering (CIV)', href: '/civil-engineering-ug', description: 'Plan, design, and construct infrastructure projects including buildings, bridges, roads, and water systems.' },
        { name: 'Computer Science & Engineering (CSE)', href: '/programs/engineering/ug/cse', description: 'Comprehensive study of programming, algorithms, databases, and software development for the digital age.' },
        { name: 'CSE - Data Science (CSD)', href: '/programs/engineering/ug/data-science', description: 'Specialize in big data analytics, machine learning, and data-driven decision making for business intelligence.' },
        { name: 'CSE - Cyber Security (CSC)', href: '/programs/engineering/ug/cyber-security', description: 'Protect digital assets with expertise in network security, ethical hacking, and information security management.' },
        { name: 'CSE - AI & Machine Learning (CSM)', href: '/programs/engineering/ug/aiml', description: 'Build intelligent systems using artificial intelligence, deep learning, and neural network technologies.' },
        { name: 'Electronics & Communication Engineering (ECE)', href: '/electronics-communications-engineering-ug', description: 'Design electronic systems, communication networks, and embedded systems for modern technology applications.' },
        { name: 'Electrical & Electronics Engineering (EEE)', href: '/electrical-electronics-engineering-ug', description: 'Master power systems, electrical machines, and renewable energy technologies for sustainable power solutions.' },
        { name: 'Mechanical Engineering (Mech)', href: '/mechanical-engineering-ug', description: 'Design and analyze mechanical systems, thermal equipment, and manufacturing processes for industry applications.' }
      ],
      pg: [
        { name: 'CAD/CAM', href: '/mtech', description: 'Advanced computer-aided design and manufacturing techniques for precision engineering and automation.' },
        { name: 'Computer Science & Engineering (CSE)', href: '/mtech', description: 'Advanced research in algorithms, distributed systems, and cutting-edge software technologies.' },
        { name: 'Power Systems', href: '/mtech', description: 'Specialize in power generation, transmission, distribution, and smart grid technologies.' },
        { name: 'Structural Engineering', href: '/mtech', description: 'Advanced analysis and design of complex structures including high-rise buildings and bridges.' },
        { name: 'Thermal Engineering', href: '/mtech', description: 'Study heat transfer, thermodynamics, and energy systems for efficient thermal management.' },
        { name: 'VLSI & Embedded Systems', href: '/mtech', description: 'Design integrated circuits and embedded systems for electronics and semiconductor industry.' }
      ]
    },
    management: {
      ug: [
        { name: 'BBA (Bachelor of Business Administration)', href: '/bba', description: 'Develop business acumen, leadership skills, and management expertise for corporate careers.' },
        { name: 'BCA (Bachelor of Computer Applications)', href: '/bca', description: 'Build strong programming and IT skills for software development and application design.' }
      ],
      pg: [
        { name: 'MBA (Master of Business Administration)', href: '/mba', description: 'Advanced management education with specializations in marketing, finance, HR, and operations.' },
        { name: 'MCA (Master of Computer Applications)', href: '/mca', description: 'Advanced software development, system design, and IT project management for tech leadership.' }
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

  // Reset selections when stream changes - auto-select level for Engineering/Management
  const handleStreamSelect = (stream: string) => {
    setSelectedStream(stream);
    // Auto-select Undergraduate for Engineering and Management so user doesn't see empty column 3
    if (stream === 'engineering' || stream === 'management') {
      setSelectedLevel('ug');
    } else {
      setSelectedLevel(null);
    }
  };

  // Auto-select Diploma when Departments tab is opened so user doesn't see empty columns
  useEffect(() => {
    if (activeNavItem === 'departments') {
      // Auto-select first stream (Diploma) when Departments tab is opened
      setSelectedStream('diploma');
      setSelectedLevel(null);
    } else {
      // Reset when switching away from departments
      setSelectedStream(null);
      setSelectedLevel(null);
    }
  }, [activeNavItem]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      // Detect if past video section (assuming video section is approximately viewport height)
      // Adjust this value based on your actual video section height
      const videoSectionHeight = window.innerHeight;
      setIsPastVideoSection(window.scrollY > videoSectionHeight);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveNavItem(null);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
      // Open About by default when menu opens
      setActiveNavItem('about');
    } else {
      const scrollY = document.body.style.top;
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    return () => {
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
    { name: 'FACULTY', href: '#faculty' },
    { name: 'CAMPUS LIFE', href: '/campus-life' },
    { name: 'PRAGNA', href: 'https://pragna.info/' },
    { name: 'HAPPENINGS', href: '#happenings' },
  ];

  const topRibbonRightLinksBeforeLogin = [
    { name: 'CONTACT', href: '#contact' },
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
    { name: 'Facilities', id: 'facilities' },
    { name: 'IQAC', id: 'iqac' },
    { name: 'Governance', href: '/governing-body' },
    { name: 'Research', href: '/research-development' },
    { name: 'Students', href: '/page/students' },
    { name: 'Linkages', href: '/page/linkages' },
    { name: 'Global', href: '/page/global' },
    { name: 'Infrastructure', href: '/page/infrastructure' },
    { name: 'Finance', href: '/page/finance' },
    { name: 'Quality', href: '/iqac' },
    { name: 'Disclosures', href: '/page/disclosures' },
    { name: 'Directions', href: '/page/directions' },
    { name: 'Exam Cell', href: '/examinations/ug-pg' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Online Payment', href: '/page/online-payment' },
    { name: 'Contact us', href: '#contact' },
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
      columns: [
        { title: 'Computer Science & Engineering', description: 'CSE, Data Science, AI & ML, Cyber Security', link: '/programs/engineering/ug/cse' },
        { title: 'Electronics & Communication', description: 'ECE department with modern labs', link: '/electronics-communications-engineering-ug' },
        { title: 'Electrical & Electronics', description: 'EEE department programs', link: '/electrical-electronics-engineering-ug' },
        { title: 'Mechanical Engineering', description: 'Mechanical engineering programs', link: '/mechanical-engineering-ug' },
        { title: 'Civil Engineering', description: 'Civil engineering programs', link: '/civil-engineering-ug' },
        { title: 'Automobile Engineering', description: 'Automobile engineering programs', link: '/automobile-engineering' },
        { title: 'Basic Sciences & Humanities', description: 'BS&H department', link: '/bs-h' },
      ]
    },
    facilities: {
      title: 'Facilities',
      description: 'World-class infrastructure and facilities to support holistic development of students.',
      knowMoreLink: '#facilities',
      columns: [
        { title: 'Campus Life', description: 'Experience life at VIET - events, clubs, and culture', link: '/campus-life' },
        { title: 'Center of Excellence', description: 'EISC, COE and innovation labs', link: '#center-of-excellence' },
        { title: 'Library', description: 'Digital and physical library resources', link: '/facilities/library' },
        { title: 'Digital Library', description: 'Online resources and e-learning', link: '#digital-library' },
        { title: 'Laboratories', description: 'State-of-the-art labs and equipment', link: '/facilities/laboratory' },
        { title: 'NSS', description: 'National Service Scheme activities', link: '/facilities/nss' },
        { title: 'Hostel', description: 'Comfortable accommodation facilities', link: '/facilities/hostel' },
        { title: 'Sports', description: 'Sports facilities and activities', link: '/facilities/sports' },
        { title: 'WIFI', description: 'High-speed internet connectivity', link: '#wifi' },
        { title: 'Transport', description: 'College transport services', link: '/facilities/transport' },
        { title: 'Medical Facility', description: 'Healthcare services on campus', link: '#medical-facility' },
        { title: 'Cafeteria', description: 'Food and dining facilities', link: '/facilities/cafeteria' },
        { title: 'RO Water Plant', description: 'Safe drinking water facility', link: '#ro-water-plant' },
        { title: 'Green Initiatives', description: 'Eco-friendly campus initiatives', link: '#green-initiatives' },
        { title: 'Solar Power Plant', description: 'Renewable energy on campus', link: '#solar-power-plant' },
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
      // For hash links, navigate to home page first if not already there
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

  return (
    <>
      {/* Minimal Floating Header - ONLY visible when menu is CLOSED */}
      <AnimatePresence>
        {!isMenuOpen && (
          <motion.header
            className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between px-4 py-2 transition-all duration-300"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Logo - wipe animation from right to left on scroll */}
            <motion.div 
              className="flex items-center cursor-pointer"
              onClick={() => handleNavigation('/')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Full logo container - visible when not scrolled */}
              <motion.div 
                className="rounded-lg overflow-hidden bg-transparent border-2 border-white p-2"
                initial={false}
                animate={{
                  width: isScrolled ? 0 : 'auto',
                  opacity: isScrolled ? 0 : 1,
                  padding: isScrolled ? 0 : '8px',
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                <img
                  src="/viet-logo-new.png"
                  alt="VIET Logo"
                  className="h-12 md:h-14 w-auto object-contain"
                />
              </motion.div>
              
              {/* Mini logo container - visible when scrolled, with glass effect */}
              <motion.div
                className="rounded-full overflow-hidden bg-white/10 backdrop-blur-md p-1.5 border-0 shadow-md"
                style={{
                  backdropFilter: 'blur(10px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                }}
                initial={false}
                animate={{
                  width: isScrolled ? 'auto' : 0,
                  opacity: isScrolled ? 1 : 0,
                  padding: isScrolled ? '6px' : 0,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                <img
                  src="/logo-viet.png"
                  alt="VIET Logo"
                  className="h-11 md:h-12 w-auto object-contain"
                />
              </motion.div>
            </motion.div>

            {/* Right Side - Admissions + Menu Button */}
            <div className="flex items-center gap-3">
              {/* Admissions Button with hover animation */}
              <motion.button
                onClick={handleAdmissionsClick}
                onMouseEnter={() => setIsAdmissionsHovered(true)}
                onMouseLeave={() => setIsAdmissionsHovered(false)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 border-2",
                  isPastVideoSection 
                    ? cn(
                        isAdmissionsHovered 
                          ? "bg-white text-[#1e3a8a] border-[#1e3a8a]" 
                          : "bg-primary text-white border-primary"
                      )
                    : cn(
                        "backdrop-blur-md",
                        isAdmissionsHovered 
                          ? "bg-white/20 text-white border-white/40 shadow-lg" 
                          : "bg-white/10 text-white border-white/30 shadow-md"
                      )
                )}
                style={!isPastVideoSection ? {
                  backdropFilter: 'blur(10px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                } : {}}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ 
                    rotate: isAdmissionsHovered ? 90 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Plus className={cn(
                    "w-4 h-4 transition-colors duration-300",
                    isPastVideoSection 
                      ? (isAdmissionsHovered ? "text-[#1e3a8a]" : "text-white")
                      : "text-white"
                  )} />
                </motion.div>
                <span className="hidden sm:inline">Admissions</span>
              </motion.button>

              {/* Menu Button */}
              <motion.button
                onClick={() => setIsMenuOpen(true)}
                className={cn(
                  "flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 text-white border-2",
                  isPastVideoSection
                    ? "bg-gray-800 hover:bg-gray-700 border-gray-800"
                    : "border-white/30 backdrop-blur-md bg-white/10 hover:bg-white/20 hover:border-white/40 shadow-md hover:shadow-lg"
                )}
                style={!isPastVideoSection ? {
                  backdropFilter: 'blur(10px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                } : {}}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Menu className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Fullscreen Menu Overlay - Pure BLACK background like Amrita */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[9999] flex flex-col"
            style={{ backgroundColor: '#000000' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Top Ribbon - On pure BLACK background with top padding */}
            <div className="text-white flex-shrink-0 pt-4 pb-1 safe-area-top" style={{ backgroundColor: '#000000' }}>
              <div className="w-full px-4 md:px-8">
                <div className="flex flex-wrap items-center justify-between gap-2 py-2">
                  {/* Left Links - hidden on mobile */}
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
                  {/* Right Links - wrap on mobile, smaller tap targets */}
                  <div className="flex flex-wrap items-center justify-end gap-2 md:gap-3 lg:gap-5 ml-auto min-h-[44px]">
                    {topRibbonRightLinksBeforeLogin.map((link) => (
                      <button
                        key={link.name}
                        onClick={() => handleNavigation(link.href)}
                        className="hover:text-yellow-300 transition-colors font-medium tracking-wider text-[11px] lg:text-xs uppercase py-2 px-1.5 -my-1 -mx-1 rounded touch-manipulation"
                        style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                      >
                        {link.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area - White Card centered on BLACK */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden" style={{ backgroundColor: '#000000' }}>
              <div className="flex-1 min-h-0 px-2 sm:px-4 md:px-8 py-2 overflow-hidden flex flex-col">
                <motion.div 
                  className="bg-white rounded-xl md:rounded-[20px] h-full min-h-0 flex flex-col overflow-hidden shadow-2xl"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.05 }}
                >
                  {/* Inner Header with Logo and Navigation - stacked on mobile for clarity */}
                  <div className="px-3 sm:px-4 md:px-8 py-3 md:py-4 flex-shrink-0 border-b border-gray-100 md:border-b-0">
                    {/* Mobile: row 1 = logo + admissions + close. Row 2 = scrollable nav tabs */}
                    <div className="flex flex-col gap-3 md:gap-0 md:flex-row md:items-start md:gap-4">
                      <div className="flex items-center justify-between gap-2 min-h-[44px]">
                        {/* Logo */}
                        <motion.div 
                          className="bg-transparent border-2 border-[#1e3a8a] p-1.5 md:p-2 md:border-white rounded-lg md:rounded-xl cursor-pointer flex-shrink-0 touch-manipulation"
                          onClick={() => {
                            setIsMenuOpen(false);
                            handleNavigation('/');
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <img
                            src="/viet-logo-new.png"
                            alt="VIET Logo"
                            className="h-9 md:h-12 w-auto object-contain"
                          />
                        </motion.div>

                        {/* Admissions + Close - visible on all screens */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <motion.button
                            onClick={handleAdmissionsClick}
                            onMouseEnter={() => setIsAdmissionsHovered(true)}
                            onMouseLeave={() => setIsAdmissionsHovered(false)}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-full font-semibold text-sm transition-all duration-300 border-2 backdrop-blur-md touch-manipulation min-h-[44px]",
                              isAdmissionsHovered 
                                ? "bg-white/20 text-white border-white/40 shadow-lg" 
                                : "bg-white/10 text-white border-white/30 shadow-md"
                            )}
                            style={{
                              backdropFilter: 'blur(10px) saturate(180%)',
                              WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                            }}
                          >
                            <motion.div
                              animate={{ rotate: isAdmissionsHovered ? 90 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Plus className={cn(
                                "w-4 h-4 transition-colors duration-300",
                                isAdmissionsHovered ? "text-[#1e3a8a]" : "text-white"
                              )} />
                            </motion.div>
                            <span className="hidden sm:inline">Admissions</span>
                          </motion.button>

                          <button
                            onClick={() => {
                              setIsMenuOpen(false);
                              setActiveNavItem(null);
                            }}
                            className="flex items-center justify-center w-10 h-10 min-w-[44px] min-h-[44px] rounded-full text-white border-2 border-white/30 backdrop-blur-md bg-white/10 hover:bg-white/20 hover:border-white/40 shadow-md hover:shadow-lg transition-all duration-300 touch-manipulation"
                            style={{
                              backdropFilter: 'blur(10px) saturate(180%)',
                              WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                            }}
                            aria-label="Close menu"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Navigation Tabs - horizontal scroll on mobile, wrap on desktop */}
                      <div className="flex-1 min-w-0 overflow-x-auto overflow-y-hidden scrollbar-hide -mx-3 px-3 md:mx-0 md:px-0 md:overflow-visible flex md:flex-wrap items-center gap-1.5 md:gap-2 pb-1 md:pb-0" style={{ WebkitOverflowScrolling: 'touch' }}>
                        {mainNavItems.map((item) =>
                          item.href ? (
                            <button
                              key={item.name}
                              onClick={() => handleNavigation(item.href!)}
                              className="px-2.5 py-2.5 md:py-1.5 rounded-md text-xs md:text-sm font-medium text-gray-600 hover:text-[#1e3a8a] hover:bg-gray-100 transition-all whitespace-nowrap flex-shrink-0 touch-manipulation min-h-[44px] md:min-h-0"
                              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                            >
                              {item.name}
                            </button>
                          ) : (
                            <button
                              key={item.id}
                              onClick={() => setActiveNavItem(activeNavItem === item.id ? null : item.id!)}
                              className={cn(
                                "px-2.5 py-2.5 md:py-1.5 rounded-md text-xs md:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 touch-manipulation min-h-[44px] md:min-h-0",
                                activeNavItem === item.id
                                  ? "text-[#0a192f] bg-blue-50 border-b-2 border-[#1e3a8a]"
                                  : "text-gray-600 hover:text-[#1e3a8a] hover:bg-gray-100 border-b-2 border-transparent"
                              )}
                              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                            >
                              {item.name}
                              {activeNavItem === item.id && (
                                <span className="ml-0.5 text-[#1e3a8a]">•</span>
                              )}
                            </button>
                          )
                        )}
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
                          {/* Custom 3-Column Layout for Departments - stacked on mobile */}
                          {activeNavItem === 'departments' ? (
                            <div className="px-4 py-4 md:px-12 md:py-11 h-full overflow-y-auto">
                              <div className="flex flex-col md:flex-row h-full gap-4 md:gap-0">
                                {/* Column 1 - Stream Selection */}
                                <div className="w-full md:w-48 md:border-r border-gray-200 flex-shrink-0 md:pr-4">
                                  <h4 className="text-[#0d47a1] font-semibold text-sm mb-2 md:mb-4 px-2 md:px-4 border-l-2 border-transparent"
                                      style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                    {selectedStream ? streamOptions.find(s => s.id === selectedStream)?.name : 'Stream'}
                                  </h4>
                                  <div className="flex flex-wrap gap-1 md:block md:space-y-1">
                                    {streamOptions.map((stream) => (
                                      <button
                                        key={stream.id}
                                        onClick={() => handleStreamSelect(stream.id)}
                                        className={cn(
                                          "text-left px-3 py-2.5 md:px-4 rounded-lg md:rounded-none md:border-l-2 text-sm transition-all duration-200 touch-manipulation min-h-[44px] md:min-h-0",
                                          selectedStream === stream.id
                                            ? "text-[#0d47a1] border-[#0d47a1] bg-blue-50/50 font-medium md:border-l-2"
                                            : "text-gray-700 border-transparent hover:text-[#0d47a1] hover:bg-gray-50"
                                        )}
                                        style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                                      >
                                        {stream.name}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Column 2 - Level Selection (only for Engineering & Management) */}
                                <div className={cn(
                                  "w-full md:w-48 md:border-r border-gray-200 flex-shrink-0 transition-all duration-300 md:pr-4",
                                  (selectedStream === 'diploma' || !selectedStream) ? "opacity-60 md:opacity-30" : "opacity-100"
                                )}>
                                  {selectedStream && selectedStream !== 'diploma' && (
                                    <>
                                      <h4 className="text-[#0d47a1] font-semibold text-sm mb-2 md:mb-4 px-2 md:px-4"
                                          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                        {selectedLevel ? getLevelOptions().find(l => l.id === selectedLevel)?.name : 'Level'}
                                      </h4>
                                      <div className="flex flex-wrap gap-1 md:block md:space-y-1">
                                        {getLevelOptions().map((level) => (
                                          <button
                                            key={level.id}
                                            onClick={() => setSelectedLevel(level.id)}
                                            className={cn(
                                              "text-left px-3 py-2.5 md:px-4 rounded-lg md:rounded-none md:border-l-2 text-sm transition-all duration-200 touch-manipulation min-h-[44px] md:min-h-0",
                                              selectedLevel === level.id
                                                ? "text-[#0d47a1] border-[#0d47a1] bg-blue-50/50 font-medium md:border-l-2"
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
                                  {selectedStream === 'diploma' && (
                                    <div className="px-2 md:px-4 py-2 text-sm text-gray-400 italic">
                                      No level selection needed
                                    </div>
                                  )}
                                </div>

                                {/* Column 3 - Courses/Departments */}
                                <div className="flex-1 min-h-0 pl-0 md:pl-8 overflow-y-auto">
                                  {getCourses().length > 0 ? (
                                    <>
                                      <h4 className="text-gray-500 text-xs uppercase tracking-wider mb-3 md:mb-4"
                                          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                        {selectedStream === 'diploma' ? 'Diploma Courses' : 
                                         selectedStream === 'engineering' ? (selectedLevel === 'ug' ? 'B.Tech Programs' : 'M.Tech Programs') :
                                         selectedStream === 'management' ? (selectedLevel === 'ug' ? 'UG Programs' : 'PG Programs') : 'Select a stream'}
                                      </h4>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-4 md:gap-y-5">
                                        {getCourses().map((course, index) => (
                                          <motion.button
                                            key={course.name}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            onClick={() => handleNavigation(course.href)}
                                            className="text-left group py-3 pr-4 rounded-lg active:bg-gray-50 touch-manipulation min-h-[48px] md:min-h-0 md:py-2 md:rounded-none"
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
                                    <div className="flex items-center justify-center py-8 md:py-0 md:h-full text-gray-400 text-sm">
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
                            /* Default Layout for other sections */
                            <div className="px-4 py-4 md:px-12 md:py-11 overflow-y-auto">
                              <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                                {/* Left Column - Title & Description */}
                                <div className="md:w-1/4 md:border-r border-gray-200 md:pr-10 pb-6 md:pb-0 border-b md:border-b-0 flex-shrink-0">
                                  <h3 
                                    className="text-base md:text-xl text-[#0a192f] mb-2 md:mb-3 leading-tight"
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
                                  <p className="text-sm text-gray-600 leading-relaxed mb-4 md:mb-5" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                    {subMenuData[activeNavItem].description}
                                  </p>
                                  <button
                                    onClick={() => handleNavigation(subMenuData[activeNavItem].knowMoreLink)}
                                    className="inline-flex items-center gap-2 text-[#1e3a8a] hover:text-[#0a192f] font-medium text-sm transition-colors group touch-manipulation min-h-[44px]"
                                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                                  >
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    Know More
                                  </button>
                                </div>

                                {/* Right Section - Links Grid - 1 col on small mobile, 2 on larger */}
                                <div className="flex-1 min-w-0">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 gap-x-4 md:gap-x-7 md:gap-y-5">
                                    {subMenuData[activeNavItem].columns.map((col, index) => (
                                      <motion.button
                                        key={col.title}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.02 }}
                                        onClick={() => handleNavigation(col.link)}
                                        className="text-left group p-3 rounded-lg hover:bg-gray-50 active:bg-gray-50 transition-colors touch-manipulation min-h-[48px]"
                                        style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                                      >
                                        <h4 className="text-sm font-semibold text-gray-800 group-hover:text-[#1e3a8a] transition-colors flex items-center gap-1.5">
                                          {col.title}
                                          <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                        </h4>
                                        {col.description && (
                                          <p className="text-xs text-gray-500 mt-1.5 group-hover:text-gray-600 transition-colors line-clamp-2 leading-relaxed">
                                            {col.description}
                                          </p>
                                        )}
                                      </motion.button>
                                    ))}
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

              {/* Quick Contact Info at Bottom - On BLACK background */}
              <div className="flex-shrink-0 py-3 md:py-4 safe-area-bottom" style={{ backgroundColor: '#000000' }}>
                <div className="px-4 md:px-8">
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-10 text-xs md:text-sm text-gray-400">
                    <a href="tel:+919959617476" className="flex items-center gap-2 hover:text-white transition-colors py-2 touch-manipulation min-h-[44px]">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      +91-9959617476
                    </a>
                    <a href="mailto:info@vfriengg.com" className="flex items-center gap-2 hover:text-white transition-colors py-2 touch-manipulation min-h-[44px]">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      info@vfriengg.com
                    </a>
                    <span className="hidden sm:flex items-center gap-2 py-2">
                      <MapPin className="w-4 h-4" />
                      Narava, Visakhapatnam
                    </span>
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

export default AmritaStyleHeader;
