import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, GraduationCap, Phone, MessageCircle, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import SearchBar from '@/components/SearchBar';
import { accreditationsAPI, pagesAPI } from '@/lib/api';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isPlacementsDropdownOpen, setIsPlacementsDropdownOpen] = useState(false);
  const [isAdmissionsDropdownOpen, setIsAdmissionsDropdownOpen] = useState(false);
  const [isDepartmentsDropdownOpen, setIsDepartmentsDropdownOpen] = useState(false);
  const [isIQACDropdownOpen, setIsIQACDropdownOpen] = useState(false);
  const [showStatusSubmenu, setShowStatusSubmenu] = useState(false);
  const [isStatusSubmenuToggled, setIsStatusSubmenuToggled] = useState(false);
  const [showNAACSubmenu, setShowNAACSubmenu] = useState(false);
  const [isNAACSubmenuToggled, setIsNAACSubmenuToggled] = useState(false);
  const [showAQARSubmenu, setShowAQARSubmenu] = useState(false);
  const [isAQARSubmenuToggled, setIsAQARSubmenuToggled] = useState(false);
  const [showAQARReportsSubmenu, setShowAQARReportsSubmenu] = useState(false);
  const [isAQARReportsSubmenuToggled, setIsAQARReportsSubmenuToggled] = useState(false);
  const [showIQACMOMSubmenu, setShowIQACMOMSubmenu] = useState(false);
  const [isIQACMOMSubmenuToggled, setIsIQACMOMSubmenuToggled] = useState(false);
  const [showCoursesSubmenu, setShowCoursesSubmenu] = useState(false);
  const [isCoursesSubmenuToggled, setIsCoursesSubmenuToggled] = useState(false);
  const [showDiplomaSubmenu, setShowDiplomaSubmenu] = useState(false);
  const [isDiplomaSubmenuToggled, setIsDiplomaSubmenuToggled] = useState(false);
  const [showEngineeringSubmenu, setShowEngineeringSubmenu] = useState(false);
  const [isEngineeringSubmenuToggled, setIsEngineeringSubmenuToggled] = useState(false);
  const [showUGSubmenu, setShowUGSubmenu] = useState(false);
  const [isUGSubmenuToggled, setIsUGSubmenuToggled] = useState(false);
  const [showPGSubmenu, setShowPGSubmenu] = useState(false);
  const [isPGSubmenuToggled, setIsPGSubmenuToggled] = useState(false);

  // Open admin-managed accreditation PDF (falls back to /accreditations)
  const openAccreditationPdf = async (key: 'AUTONOMOUS' | 'NAAC' | 'UGC' | 'ISO') => {
    try {
      const list = await accreditationsAPI.getAll();
      const item = list.find((a) => a.key === key);
      if (item?.pdf_url) {
        window.open(item.pdf_url, '_blank');
      } else {
        navigate('/accreditations');
      }
    } catch {
      navigate('/accreditations');
    } finally {
      setIsAboutDropdownOpen(false);
      setShowStatusSubmenu(false);
      setIsStatusSubmenuToggled(false);
    }
  };
  const [showManagementSubmenu, setShowManagementSubmenu] = useState(false);
  const [isManagementSubmenuToggled, setIsManagementSubmenuToggled] = useState(false);
  const [isExaminationsDropdownOpen, setIsExaminationsDropdownOpen] = useState(false);
  const [isFacilitiesDropdownOpen, setIsFacilitiesDropdownOpen] = useState(false);
  const [showLibrarySubmenu, setShowLibrarySubmenu] = useState(false);
  const [isLibrarySubmenuToggled, setIsLibrarySubmenuToggled] = useState(false);

  // Custom smooth scroll function that accounts for header height
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Calculate header height based on where we're scrolling TO, not current state
      const elementPosition = element.offsetTop;
      const currentScrollY = window.scrollY;
      
      // If we're scrolling down to the element, use scrolled header height
      // If we're scrolling up to the element, use full header height
      const willBeScrolled = elementPosition > 50;
      const headerHeight = 32 + (willBeScrolled ? 80 : 96); // Top ribbon (32px) + header height
      
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setIsAboutDropdownOpen(false);
        setIsPlacementsDropdownOpen(false);
        setIsAdmissionsDropdownOpen(false);
        setIsDepartmentsDropdownOpen(false);
        setIsIQACDropdownOpen(false);
        setShowStatusSubmenu(false);
        setIsStatusSubmenuToggled(false);
        setShowNAACSubmenu(false);
        setIsNAACSubmenuToggled(false);
        setShowAQARSubmenu(false);
        setIsAQARSubmenuToggled(false);
        setShowAQARReportsSubmenu(false);
        setIsAQARReportsSubmenuToggled(false);
        setShowIQACMOMSubmenu(false);
        setIsIQACMOMSubmenuToggled(false);
        setShowCoursesSubmenu(false);
        setIsCoursesSubmenuToggled(false);
        setShowDiplomaSubmenu(false);
        setIsDiplomaSubmenuToggled(false);
        setShowEngineeringSubmenu(false);
        setIsEngineeringSubmenuToggled(false);
        setShowUGSubmenu(false);
        setIsUGSubmenuToggled(false);
        setShowPGSubmenu(false);
        setIsPGSubmenuToggled(false);
        setShowManagementSubmenu(false);
        setIsManagementSubmenuToggled(false);
        setIsExaminationsDropdownOpen(false);
        setIsFacilitiesDropdownOpen(false);
        setShowLibrarySubmenu(false);
        setIsLibrarySubmenuToggled(false);
      }
    };

    if (isAboutDropdownOpen || isPlacementsDropdownOpen || isAdmissionsDropdownOpen || isDepartmentsDropdownOpen || isIQACDropdownOpen || isExaminationsDropdownOpen || isFacilitiesDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAboutDropdownOpen, isPlacementsDropdownOpen, isIQACDropdownOpen]);

  // Expose banner height to CSS so sections can offset exactly below it
  useEffect(() => {
    const computeBannerHeight = () => {
      const bannerVisible = !isScrolled;
      const isMd = window.innerWidth >= 768;
      const heightPx = bannerVisible ? (isMd ? 96 : 80) : 0; // matches h-20 (80px) / h-24 (96px)
      document.documentElement.style.setProperty('--banner-height', `${heightPx}px`);
      
      // Set ribbon height
      const ribbonHeight = isMd ? 40 : 36; // py-2 = 16px + text height
      document.documentElement.style.setProperty('--ribbon-height', `${ribbonHeight}px`);
      
      // Set total header height (ribbon + banner) - header is positioned at 32px from top
      const totalHeaderHeight = 32 + heightPx;
      document.documentElement.style.setProperty('--total-header-height', `${totalHeaderHeight}px`);
    };
    computeBannerHeight();
    window.addEventListener('resize', computeBannerHeight);
    return () => window.removeEventListener('resize', computeBannerHeight);
  }, [isScrolled]);

  // State for dynamic pages
  const [dynamicPages, setDynamicPages] = useState<any[]>([]);

  // Fetch pages from API
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const pages = await pagesAPI.getAll();
        setDynamicPages(Array.isArray(pages) ? pages : []);
      } catch (error) {
        console.error('Error fetching pages for navigation:', error);
        setDynamicPages([]);
      }
    };
    fetchPages();
  }, []);

  // Build dropdown menus dynamically from API pages
  const getPagesByCategory = (category: string) => {
    return dynamicPages
      .filter(page => page.category === category)
      .map(page => ({
        name: page.title,
        href: page.route,
        hasSubmenu: false
      }));
  };

  // About dropdown menu data - merge static and dynamic
  const staticAboutItems = [
    { name: 'About US', href: '/about' },
    { name: 'Vision & Mission', href: '/vision-mission' },
    { name: 'Chairman', href: '/chairman' },
    { name: 'HR', href: '/hr' },
    { name: 'Principal', href: '/principal' },
    { name: 'Faculty', href: '/faculty' },
    { name: 'Dean Academics', href: '/dean-academics' },
    { name: 'Dean Innovation & Student Projects', href: '/dean-innovation' },
    { name: 'Accreditations', href: '/accreditations', hasSubmenu: false },
    { name: 'Organizational Chart', href: '/organizational-chart' },
    { name: 'Governing Body', href: '/governing-body' },
    { name: 'Grievance Redressal', href: '/grievance-redressal' },
    { name: 'Committees', href: '/committees' },
    { name: 'Grievance Form', href: '#grievance-form' }
  ];
  
  const dynamicAboutItems = getPagesByCategory('About');
  const aboutMenuItems = [...staticAboutItems, ...dynamicAboutItems];

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about', hasDropdown: true },
    { name: 'Admissions', href: '#admissions', hasDropdown: true },
    { name: 'Departments', href: '#departments', hasDropdown: true },
    { name: 'Academics', href: '#program-finder' }, // Redirects to Program Finder section
    { name: 'Examinations', href: '#examinations', hasDropdown: true },
    { name: 'Placements', href: '/placements', hasDropdown: true },
    { name: 'R&D', href: '/research-development' },
    { name: 'IQAC', href: '#iqac', hasDropdown: true },
    { name: 'Facilities', href: '#facilities', hasDropdown: true },
  ];

  // Placements dropdown menu data - merge static and dynamic
  const staticPlacementsItems = [
    { name: 'Placements', href: '/placements' },
    { name: 'Placements Cell', href: '/placements-cell' },
  ];
  const dynamicPlacementsItems = getPagesByCategory('Placements');
  const placementsMenuItems = [...staticPlacementsItems, ...dynamicPlacementsItems];

  // Admissions dropdown menu data
  const admissionsMenuItems = [
    { name: 'Courses Offered', href: '/courses-offered', hasSubmenu: true },
    { name: 'Online Admission Form', href: 'https://docs.google.com/forms/d/e/1FAIpQLSfzvrY5qJTPfzBiW1UU1JZAvNAN8qcjv07v6lWSc1Xe0X-wvw/viewform?usp=send_form' },
    { name: 'Contact', href: '#contact' },
  ];

  // Courses Offered submenu items
  const coursesSubmenuItems = [
    { name: 'DIPLOMA', href: '/diploma' },
    { name: 'B.TECH', href: '/btech' },
    { name: 'M.TECH', href: '/mtech' },
    { name: 'BBA', href: '/bba' },
    { name: 'MBA', href: '/mba' },
    { name: 'BCA', href: '/bca' },
    { name: 'MCA', href: '/mca' },
  ];

  // Departments dropdown menu data
  const departmentsMenuItems = [
    { name: 'DIPLOMA', href: '#diploma', hasSubmenu: true },
    { name: 'ENGINEERING', href: '#engineering', hasSubmenu: true },
    { name: 'MANAGEMENT', href: '#management', hasSubmenu: true },
  ];

  // DIPLOMA submenu items
  const diplomaSubmenuItems = [
    { name: 'AGRICULTURAL ENGINEERING', href: '/agricultural-engineering' },
    { name: 'CIVIL ENGINEERING', href: '/civil-engineering' },
    { name: 'COMPUTER ENGINEERING', href: '/computer-engineering' },
    { name: 'ELECTRONICS & COMMUNICATIONS ENGINEERING', href: '/electronics-communications-engineering' },
    { name: 'ELECTRICAL & ELECTRONICS ENGINEERING', href: '/electrical-electronics-engineering' },
    { name: 'MECHANICAL ENGINEERING', href: '/mechanical-engineering' },
  ];

  // Engineering submenu items
  const engineeringSubmenuItems = [
    { name: 'UNDER GRADUATION (UG)', href: '#ug', hasSubmenu: true },
    { name: 'POST GRADUATION (PG)', href: '#pg', hasSubmenu: true },
  ];

  // UG Engineering submenu items
  const ugEngineeringSubmenuItems = [
    { name: 'Automobile Engineering', href: '/automobile-engineering' },
    { name: 'BS & H', href: '/bs-h' },
    { name: 'Civil Engineering', href: '/civil-engineering-ug' },
    { name: 'Computer Science & Engineering', href: '/programs/engineering/ug/cse' },
    { name: 'CSE (Data Science)', href: '/programs/engineering/ug/data-science' },
    { name: 'CSE (Cyber Security)', href: '/programs/engineering/ug/cyber-security' },
    { name: 'CSE (AI & ML)', href: '/programs/engineering/ug/aiml' },
    { name: 'Electronics & Communications Engineering', href: '/electronics-communications-engineering-ug' },
    { name: 'Electrical & Electronics Engineering', href: '/electrical-electronics-engineering-ug' },
    { name: 'Mechanical Engineering', href: '/mechanical-engineering-ug' },
  ];

  // PG Engineering submenu items
  const pgEngineeringSubmenuItems = [
    { name: 'CAD/CAM', href: '/cad-cam' },
    { name: 'Computer Science & Engineering', href: '/computer-science-engineering-pg' },
    { name: 'Power Systems', href: '/power-systems' },
    { name: 'Structural Engineering', href: '/structural-engineering' },
    { name: 'Thermal Engineering', href: '/thermal-engineering' },
    { name: 'VLSI & Embedded systems', href: '/vlsi-embedded-systems' },
  ];

  // Management submenu items
  const managementSubmenuItems = [
    { name: 'BBA', href: '/bba', category: 'UNDER GRADUATE' },
    { name: 'BCA', href: '/bca', category: 'UNDER GRADUATE' },
    { name: 'MBA', href: '/mba', category: 'POST GRADUATE' },
    { name: 'MCA', href: '/mca', category: 'POST GRADUATE' },
  ];

  // Examinations dropdown menu data - merge static and dynamic
  const staticExaminationsItems = [
    { name: 'UG,PG', href: '/examinations/ug-pg' },
    { name: 'Diploma (SBTET)', href: '/examinations/diploma' },
  ];
  const dynamicExaminationsItems = getPagesByCategory('Examinations');
  const examinationsMenuItems = [...staticExaminationsItems, ...dynamicExaminationsItems];

  // Facilities dropdown menu data
  const facilitiesMenuItems = [
    { name: 'Campus Life', href: '/campus-life' },
    { name: 'Center of Excellence', href: '#center-of-excellence' },
    { name: 'Library', href: '/facilities/library', hasSubmenu: true },
    { name: 'NSS', href: '/facilities/nss' },
    { name: 'Hostel', href: '#hostel' },
    { name: 'Sports', href: '/facilities/sports' },
    { name: 'WIFI', href: '#wifi' },
    { name: 'Transport', href: '/facilities/transport' },
    { name: 'Medical Facility', href: '#medical-facility' },
    { name: 'Cafeteria', href: '/facilities/cafeteria' },
    { name: 'RO Water Plant', href: '#ro-water-plant' },
    { name: 'Green Initiatives', href: '#green-initiatives' },
    { name: 'Solar Power Plant', href: '#solar-power-plant' },
  ];

  // Library submenu items
  const librarySubmenuItems = [
    { name: 'Digital Library', href: '#digital-library' },
  ];

  // IQAC dropdown menu data
  const iqacMenuItems = [
    { name: 'Student Satisfactory Survey', href: '/student-satisfactory-survey' },
    { name: 'NIRF', href: '/nirf' },
    { 
      name: 'NAAC', 
      href: '#naac',
      hasSubmenu: true
    },
    { name: 'Best Practices', href: '/best-practices' },
    { name: 'Feedback Form', href: '/feedback-form' },
    { name: 'Institutional Distinctiveness', href: '/institutional-distinctiveness' },
    { name: 'Procedures and Policies', href: '/procedures-policies' },
    { name: 'IQAC MOM', href: '/iqac-mom', hasSubmenu: true },
  ];

  // NAAC submenu items
  const naacSubmenuItems = [
    { name: 'SSR', href: '/ssr' },
    { name: 'AQAR', href: '/aqar', hasSubmenu: true },
    { name: 'AQAR Reports', href: '/aqar-reports', hasSubmenu: true },
  ];

  // AQAR submenu items
  const aqarSubmenuItems = [
    { name: '2021-2022', href: '/aqar-2021-2022' },
    { name: '2022-2023', href: '/aqar-2022-2023' },
    { name: '2023-2024', href: '/aqar-2023-2024' },
  ];

  // AQAR Reports submenu items
  const aqarReportsSubmenuItems = [
    { name: '2018-2019', href: '/aqar-reports-2018-2019' },
    { name: '2019-2020', href: '/aqar-reports-2019-2020' },
    { name: '2020-2021', href: '/aqar-reports-2020-2021' },
    { name: '2021-2022', href: '/aqar-reports-2021-2022' },
    { name: '2022-2023', href: '/aqar-reports-2022-2023' },
    { name: '2023-2024', href: '/aqar-reports-2023-2024' },
  ];

  // IQAC MOM submenu items
  const iqacMOMSubmenuItems = [
    { name: '2023-2024', href: '/iqac-mom-2023-2024' },
  ];

  const certificationLogos = [
    {
      name: 'NAAC A Grade',
      logo: '/naac-A logo.png',
      url: 'https://www.naac.gov.in/',
      description: 'National Assessment and Accreditation Council - A Grade'
    },
    {
      name: 'UGC',
      logo: '/UGC-logo.png',
      url: 'https://www.ugc.ac.in/',
      description: 'University Grants Commission Recognition'
    },
    {
      name: 'JNTUGV',
      logo: '/jntugv-logo.png',
      url: 'https://jntugv.edu.in/',
      description: 'Jawaharlal Nehru Technological University Gurajada Vizianagaram'
    },
    {
      name: 'AICTE',
      logo: '/AICTE-Logo.png',
      url: 'https://www.aicte-india.org/',
      description: 'All India Council for Technical Education'
    },
    {
      name: 'ISO 9001:2015',
      logo: '/iso-logo.png',
      url: 'https://www.iso.org/iso-9001-quality-management.html',
      description: 'ISO 9001:2015 Quality Management System Certification'
    },
    {
      name: 'MSME',
      logo: '/msme-logo.png',
      url: 'https://msme.gov.in/',
      description: 'Ministry of Micro, Small & Medium Enterprises'
    }
  ];

  return (
    <>
    {/* Top Ribbon */}
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white shadow-lg"
      initial={{ y: -30 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between text-xs md:text-sm">
          {/* Left - Contact Information */}
          <div className="flex items-center space-x-2">
            <Phone className="h-3 w-3 md:h-4 md:w-4" />
            <span>+91-9959617476, +91-9959617477</span>
          </div>

          {/* Separator */}
          <div className="hidden md:block w-px h-4 bg-white/30"></div>

          {/* Middle - Establishment Year */}
          <div className="hidden md:block">
            <span className="font-medium">Since 2008</span>
          </div>

          {/* Middle-Right - Navigation Links */}
          <div className="hidden lg:flex items-center space-x-4">
            <a href="#careers" className="hover:text-yellow-300 transition-colors font-medium">Careers</a>
            <a href="#alumni" className="hover:text-yellow-300 transition-colors font-medium">Alumni</a>
            <a href="#gallery" className="hover:text-yellow-300 transition-colors font-medium">Gallery</a>
            <a href="#student-corner" className="hover:text-yellow-300 transition-colors font-medium">Student Corner</a>
          </div>

          {/* Right - Online Admissions */}
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-3 w-3 md:h-4 md:w-4" />
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSfzvrY5qJTPfzBiW1UU1JZAvNAN8qcjv07v6lWSc1Xe0X-wvw/viewform?usp=send_form" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 transition-colors font-medium">Online Admissions Form</a>
          </div>
        </div>
      </div>
    </motion.div>

    <motion.header
      className={`fixed left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled 
          ? 'glass backdrop-blur-xl border-b border-white/20' 
          : ''
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ top: '32px' }}
    >
      {/* College Name Banner - full-bleed background, height controlled via CSS var */}
      <div className="w-full flex items-center bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 shadow-lg" style={{ height: 'var(--banner-height, 0px)' }}>
        {!isScrolled && (
          <div className="w-full">
            <div className="flex items-center justify-between w-full px-4 md:px-8">
              {/* Left Logo - New VIET Logo (click to home) */}
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex items-center justify-start pl-4 md:pl-8 focus:outline-none focus:ring-2 focus:ring-white/30 rounded"
              >
                <img
                  src="/viet-logo-new.png"
                  alt="Visakha Institute of Engineering & Technology Logo"
                  className="h-16 w-auto md:h-20 object-contain"
                />
              </button>

              {/* Middle Section - Certification Logos */}
              <div className="flex items-center justify-center space-x-2 md:space-x-3 flex-1 px-4 md:px-6">
                <TooltipProvider>
                  {certificationLogos.map((cert, index) => (
                    <Tooltip key={cert.name}>
                      <TooltipTrigger asChild>
                        <motion.a
                          href={cert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-white/20 hover:bg-white hover:shadow-xl transition-all duration-300">
                            <img
                              src={cert.logo}
                              alt={cert.name}
                              className={`h-12 w-12 md:h-14 md:w-14 object-contain ${
                                cert.name === 'UGC' 
                                  ? 'scale-125' 
                                  : ''
                              }`}
                            />
                          </div>
                        </motion.a>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" sideOffset={8}>
                        <p className="text-sm font-medium">{cert.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>

              {/* Search Bar - Top Banner (when not scrolled) */}
              <div className="hidden xl:flex items-center px-4">
                <SearchBar />
              </div>

              {/* College Code - Right */}
              <div className="flex flex-col items-center justify-center h-16 w-16 md:h-20 md:w-20 shrink-0 pr-4 md:pr-8">
                {/* Top half - COLLEGE CODE */}
                <div className="flex flex-col items-center justify-end h-1/2">
                  <span className="text-[10px] md:text-[12px] font-bold text-white/90 leading-tight">COLLEGE</span>
                  <span className="text-[10px] md:text-[12px] font-bold text-white/90 leading-tight mt-1">CODE</span>
                </div>
                {/* Bottom half - VSPT */}
                <div className="flex items-center justify-center h-1/2">
                  <span className="text-xl md:text-2xl font-bold text-yellow-300 drop-shadow-lg">VSPT</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="container mx-auto px-4">

        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo (click to home) */}
          <motion.button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {isScrolled ? (
              <img
                src="/logo-viet.png"
                alt="Visakha Institute of Engineering & Technology Logo"
                className="w-10 h-10 object-contain"
                style={{
                  filter: 'drop-shadow(0 0 0 white) drop-shadow(0 0 0 white) drop-shadow(0 0 0 white) drop-shadow(0 0 0 white) drop-shadow(0 0 0 white) drop-shadow(0 0 0 white) drop-shadow(0 0 0 white) drop-shadow(0 0 0 white)',
                  WebkitFilter: 'drop-shadow(0 0 0 white) drop-shadow(0 0 0 white) drop-shadow(0 0 0 white) drop-shadow(0 0 0 white) drop-shadow(0 0 0 white) drop-shadow(0 0 0 white) drop-shadow(0 0 0 white) drop-shadow(0 0 0 white)'
                }}
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gradient">VIET</span>
              <span className={`text-xs transition-colors duration-300 ${
                isScrolled ? 'text-muted-foreground hover:text-primary' : 'text-white/80'
              }`}>Excellence in Education</span>
            </div>
          </motion.button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <motion.div
                    className="relative dropdown-container"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                  >
                    <button
                      onClick={() => {
                        if (item.name === 'About') {
                          setIsAboutDropdownOpen(!isAboutDropdownOpen);
                          if (!isAboutDropdownOpen) {
                            setIsStatusSubmenuToggled(false);
                            setShowStatusSubmenu(false);
                          }
                          // Close other dropdowns
                          setIsPlacementsDropdownOpen(false);
                          setIsAdmissionsDropdownOpen(false);
                          setIsDepartmentsDropdownOpen(false);
                          setIsIQACDropdownOpen(false);
                          setShowNAACSubmenu(false);
                          setIsNAACSubmenuToggled(false);
                          setShowAQARSubmenu(false);
                          setIsAQARSubmenuToggled(false);
                          setShowAQARReportsSubmenu(false);
                          setIsAQARReportsSubmenuToggled(false);
                          setShowIQACMOMSubmenu(false);
                          setIsIQACMOMSubmenuToggled(false);
                        } else if (item.name === 'Placements') {
                          setIsPlacementsDropdownOpen(!isPlacementsDropdownOpen);
                          // Close other dropdowns
                          setIsAboutDropdownOpen(false);
                          setIsAdmissionsDropdownOpen(false);
                          setIsDepartmentsDropdownOpen(false);
                          setIsIQACDropdownOpen(false);
                          setShowNAACSubmenu(false);
                          setIsNAACSubmenuToggled(false);
                          setShowAQARSubmenu(false);
                          setIsAQARSubmenuToggled(false);
                          setShowAQARReportsSubmenu(false);
                          setIsAQARReportsSubmenuToggled(false);
                          setShowIQACMOMSubmenu(false);
                          setIsIQACMOMSubmenuToggled(false);
                          setShowCoursesSubmenu(false);
                          setIsCoursesSubmenuToggled(false);
                        } else if (item.name === 'Admissions') {
                          setIsAdmissionsDropdownOpen(!isAdmissionsDropdownOpen);
                          // Close other dropdowns
                          setIsAboutDropdownOpen(false);
                          setIsPlacementsDropdownOpen(false);
                          setIsIQACDropdownOpen(false);
                          setShowNAACSubmenu(false);
                          setIsNAACSubmenuToggled(false);
                          setShowAQARSubmenu(false);
                          setIsAQARSubmenuToggled(false);
                          setShowAQARReportsSubmenu(false);
                          setIsAQARReportsSubmenuToggled(false);
                          setShowIQACMOMSubmenu(false);
                          setIsIQACMOMSubmenuToggled(false);
                          setShowCoursesSubmenu(false);
                          setIsCoursesSubmenuToggled(false);
                          setShowDiplomaSubmenu(false);
                          setIsDiplomaSubmenuToggled(false);
                          setShowEngineeringSubmenu(false);
                          setIsEngineeringSubmenuToggled(false);
                          setShowUGSubmenu(false);
                          setIsUGSubmenuToggled(false);
                          setShowPGSubmenu(false);
                          setIsPGSubmenuToggled(false);
                          setShowManagementSubmenu(false);
                          setIsManagementSubmenuToggled(false);
                        } else if (item.name === 'Departments') {
                          setIsDepartmentsDropdownOpen(!isDepartmentsDropdownOpen);
                          // Close other dropdowns
                          setIsAboutDropdownOpen(false);
                          setIsPlacementsDropdownOpen(false);
                          setIsAdmissionsDropdownOpen(false);
                          setIsIQACDropdownOpen(false);
                          setShowNAACSubmenu(false);
                          setIsNAACSubmenuToggled(false);
                          setShowAQARSubmenu(false);
                          setIsAQARSubmenuToggled(false);
                          setShowAQARReportsSubmenu(false);
                          setIsAQARReportsSubmenuToggled(false);
                          setShowIQACMOMSubmenu(false);
                          setIsIQACMOMSubmenuToggled(false);
                          setShowCoursesSubmenu(false);
                          setIsCoursesSubmenuToggled(false);
                          setShowDiplomaSubmenu(false);
                          setIsDiplomaSubmenuToggled(false);
                          setShowEngineeringSubmenu(false);
                          setIsEngineeringSubmenuToggled(false);
                          setShowUGSubmenu(false);
                          setIsUGSubmenuToggled(false);
                          setShowPGSubmenu(false);
                          setIsPGSubmenuToggled(false);
                          setShowManagementSubmenu(false);
                          setIsManagementSubmenuToggled(false);
                        } else if (item.name === 'Examinations') {
                          setIsExaminationsDropdownOpen(!isExaminationsDropdownOpen);
                          // Close other dropdowns
                          setIsAboutDropdownOpen(false);
                          setIsPlacementsDropdownOpen(false);
                          setIsAdmissionsDropdownOpen(false);
                          setIsDepartmentsDropdownOpen(false);
                          setIsIQACDropdownOpen(false);
                          setShowNAACSubmenu(false);
                          setIsNAACSubmenuToggled(false);
                          setShowAQARSubmenu(false);
                          setIsAQARSubmenuToggled(false);
                          setShowAQARReportsSubmenu(false);
                          setIsAQARReportsSubmenuToggled(false);
                          setShowIQACMOMSubmenu(false);
                          setIsIQACMOMSubmenuToggled(false);
                          setShowCoursesSubmenu(false);
                          setIsCoursesSubmenuToggled(false);
                          setShowDiplomaSubmenu(false);
                          setIsDiplomaSubmenuToggled(false);
                          setShowEngineeringSubmenu(false);
                          setIsEngineeringSubmenuToggled(false);
                          setShowUGSubmenu(false);
                          setIsUGSubmenuToggled(false);
                          setShowPGSubmenu(false);
                          setIsPGSubmenuToggled(false);
                          setShowManagementSubmenu(false);
                          setIsManagementSubmenuToggled(false);
                        } else if (item.name === 'Facilities') {
                          setIsFacilitiesDropdownOpen(!isFacilitiesDropdownOpen);
                          // Close other dropdowns
                          setIsAboutDropdownOpen(false);
                          setIsPlacementsDropdownOpen(false);
                          setIsAdmissionsDropdownOpen(false);
                          setIsDepartmentsDropdownOpen(false);
                          setIsIQACDropdownOpen(false);
                          setIsExaminationsDropdownOpen(false);
                          setShowNAACSubmenu(false);
                          setIsNAACSubmenuToggled(false);
                          setShowAQARSubmenu(false);
                          setIsAQARSubmenuToggled(false);
                          setShowAQARReportsSubmenu(false);
                          setIsAQARReportsSubmenuToggled(false);
                          setShowIQACMOMSubmenu(false);
                          setIsIQACMOMSubmenuToggled(false);
                          setShowCoursesSubmenu(false);
                          setIsCoursesSubmenuToggled(false);
                          setShowDiplomaSubmenu(false);
                          setIsDiplomaSubmenuToggled(false);
                          setShowEngineeringSubmenu(false);
                          setIsEngineeringSubmenuToggled(false);
                          setShowUGSubmenu(false);
                          setIsUGSubmenuToggled(false);
                          setShowPGSubmenu(false);
                          setIsPGSubmenuToggled(false);
                          setShowManagementSubmenu(false);
                          setIsManagementSubmenuToggled(false);
                          setShowLibrarySubmenu(false);
                          setIsLibrarySubmenuToggled(false);
                        } else if (item.name === 'IQAC') {
                          setIsIQACDropdownOpen(!isIQACDropdownOpen);
                          if (!isIQACDropdownOpen) {
                            setShowNAACSubmenu(false);
                            setIsNAACSubmenuToggled(false);
                            setShowAQARSubmenu(false);
                            setIsAQARSubmenuToggled(false);
                            setShowAQARReportsSubmenu(false);
                            setIsAQARReportsSubmenuToggled(false);
                            setShowIQACMOMSubmenu(false);
                            setIsIQACMOMSubmenuToggled(false);
                          }
                          // Close other dropdowns
                          setIsAboutDropdownOpen(false);
                          setIsPlacementsDropdownOpen(false);
                          setIsAdmissionsDropdownOpen(false);
                          setShowStatusSubmenu(false);
                          setIsStatusSubmenuToggled(false);
                        }
                      }}
                      className={`transition-colors duration-300 text-sm font-medium relative group px-2 py-1 rounded-md hover:bg-white/10 ${
                        isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80'
                      }`}
                    >
                      {item.name}
                      <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300" />
                    </button>

                    {/* About Dropdown Menu */}
                    {item.name === 'About' && isAboutDropdownOpen && (
                      <div 
                        className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 z-50 overflow-hidden max-h-96 overflow-y-auto"
                        onMouseLeave={() => {
                          if (!isStatusSubmenuToggled) {
                            setIsAboutDropdownOpen(false);
                            setShowStatusSubmenu(false);
                          }
                        }}
                      >
                        <div className="p-1">
                          {aboutMenuItems.map((menuItem, menuIndex) => (
                            <div 
                              key={menuItem.name} 
                              className="relative"
                            >
                              <a
                                href={menuItem.href}
                                className="flex items-center justify-between w-full px-3 py-2 text-xs text-gray-700 hover:bg-gradient-primary hover:text-white rounded-md transition-all duration-200 group"
                                onMouseEnter={() => {
                                  if (menuItem.name === 'Status' && !isStatusSubmenuToggled) {
                                    setShowStatusSubmenu(true);
                                  }
                                }}
                                onMouseLeave={() => {
                                  if (menuItem.name === 'Status' && !isStatusSubmenuToggled) {
                                    setTimeout(() => setShowStatusSubmenu(false), 100);
                                  }
                                }}
                                onClick={(e) => {
                                  if (menuItem.name === 'Status') {
                                    e.preventDefault();
                                    setIsStatusSubmenuToggled(!isStatusSubmenuToggled);
                                    setShowStatusSubmenu(!isStatusSubmenuToggled);
                                  } else if (menuItem.name === 'About US' || menuItem.name === 'Vision & Mission' || menuItem.name === 'Chairman' || menuItem.name === 'HR' || menuItem.name === 'Principal' || menuItem.name === 'Faculty') {
                                    // Let the default link behavior handle navigation
                                    setIsAboutDropdownOpen(false);
                                  }
                                }}
                              >
                                <span className="font-medium">{menuItem.name}</span>
                                {menuItem.hasSubmenu && (
                                  <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors" />
                                )}
                              </a>

                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Placements Dropdown Menu */}
                    {item.name === 'Placements' && isPlacementsDropdownOpen && (
                      <div 
                        className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 z-50 overflow-hidden"
                        onMouseLeave={() => {
                          setIsPlacementsDropdownOpen(false);
                        }}
                      >
                        <div className="p-1">
                          {placementsMenuItems.map((menuItem) => (
                            <button
                              key={menuItem.name}
                              onClick={() => {
                                navigate(menuItem.href);
                                setIsPlacementsDropdownOpen(false);
                              }}
                              className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gradient-primary hover:text-white rounded-md transition-all duration-200 text-left"
                            >
                              <span className="font-medium">{menuItem.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Admissions Dropdown Menu */}
                    {item.name === 'Admissions' && isAdmissionsDropdownOpen && (
                      <div 
                        className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 z-50 overflow-hidden"
                        onMouseLeave={() => {
                          if (!isCoursesSubmenuToggled) {
                            setIsAdmissionsDropdownOpen(false);
                            setShowCoursesSubmenu(false);
                          }
                        }}
                      >
                        <div className="p-1">
                          {admissionsMenuItems.map((menuItem) => (
                            <div key={menuItem.name} className="relative">
                              <a
                                href={menuItem.href}
                                target={menuItem.href.startsWith('http') ? '_blank' : undefined}
                                rel={menuItem.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className="flex items-center justify-between w-full px-3 py-2 text-xs text-gray-700 hover:bg-gradient-primary hover:text-white rounded-md transition-all duration-200 group"
                                onMouseEnter={() => {
                                  if (menuItem.name === 'Courses Offered' && !isCoursesSubmenuToggled) {
                                    setShowCoursesSubmenu(true);
                                  }
                                }}
                                onMouseLeave={() => {
                                  if (menuItem.name === 'Courses Offered' && !isCoursesSubmenuToggled) {
                                    setTimeout(() => setShowCoursesSubmenu(false), 100);
                                  }
                                }}
                                onClick={(e) => {
                                  if (menuItem.name === 'Courses Offered') {
                                    e.preventDefault();
                                    setIsCoursesSubmenuToggled(!isCoursesSubmenuToggled);
                                    setShowCoursesSubmenu(!isCoursesSubmenuToggled);
                                  } else {
                                    if (!menuItem.href.startsWith('http') && !menuItem.href.startsWith('#')) {
                                      navigate(menuItem.href);
                                    }
                                    setIsAdmissionsDropdownOpen(false);
                                    setShowCoursesSubmenu(false);
                                    setIsCoursesSubmenuToggled(false);
                                  }
                                }}
                              >
                                <span className="font-medium">{menuItem.name}</span>
                                {menuItem.hasSubmenu && (
                                  <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors" />
                                )}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Courses Offered Submenu */}
                    {item.name === 'Admissions' && showCoursesSubmenu && (
                      <div 
                        className="absolute w-36 bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl border border-white/20 overflow-hidden z-[99999]"
                        onMouseEnter={() => {
                          if (!isCoursesSubmenuToggled) {
                            setShowCoursesSubmenu(true);
                          }
                        }}
                        onMouseLeave={() => {
                          if (!isCoursesSubmenuToggled) {
                            setShowCoursesSubmenu(false);
                          }
                        }}
                        style={{
                          top: '40px', // Decreased by 10px
                          left: '100%',
                          marginLeft: '138px' // Moved to the right by 10px (from 128px to 138px)
                        }}
                      >
                        <div className="p-1">
                          {coursesSubmenuItems.map((courseItem) => (
                            <a
                              key={courseItem.name}
                              href={courseItem.href}
                              onClick={() => {
                                navigate(courseItem.href);
                                setIsAdmissionsDropdownOpen(false);
                                setShowCoursesSubmenu(false);
                                setIsCoursesSubmenuToggled(false);
                              }}
                              className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gradient-primary hover:text-white rounded-md transition-all duration-200"
                            >
                              {courseItem.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Departments Dropdown Menu */}
                    {item.name === 'Departments' && isDepartmentsDropdownOpen && (
                      <div 
                        className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 z-50 overflow-hidden"
                        onMouseLeave={() => {
                          if (!isDiplomaSubmenuToggled && !isEngineeringSubmenuToggled && !isManagementSubmenuToggled) {
                            setIsDepartmentsDropdownOpen(false);
                            setShowDiplomaSubmenu(false);
                            setShowEngineeringSubmenu(false);
                            setShowManagementSubmenu(false);
                          }
                        }}
                      >
                        <div className="p-1">
                          {departmentsMenuItems.map((menuItem) => (
                            <div key={menuItem.name} className="relative">
                              <a
                                href={menuItem.href}
                                className="flex items-center justify-between w-full px-3 py-2 text-xs text-gray-700 hover:bg-gradient-primary hover:text-white rounded-md transition-all duration-200 group"
                                onMouseEnter={() => {
                                  if (menuItem.name === 'DIPLOMA' && !isDiplomaSubmenuToggled) {
                                    setShowDiplomaSubmenu(true);
                                  } else if (menuItem.name === 'ENGINEERING' && !isEngineeringSubmenuToggled) {
                                    setShowEngineeringSubmenu(true);
                                  } else if (menuItem.name === 'MANAGEMENT' && !isManagementSubmenuToggled) {
                                    setShowManagementSubmenu(true);
                                  }
                                }}
                                onMouseLeave={() => {
                                  if (menuItem.name === 'DIPLOMA' && !isDiplomaSubmenuToggled) {
                                    setTimeout(() => setShowDiplomaSubmenu(false), 100);
                                  } else if (menuItem.name === 'ENGINEERING' && !isEngineeringSubmenuToggled) {
                                    setTimeout(() => setShowEngineeringSubmenu(false), 100);
                                  } else if (menuItem.name === 'MANAGEMENT' && !isManagementSubmenuToggled) {
                                    setTimeout(() => setShowManagementSubmenu(false), 100);
                                  }
                                }}
                                onClick={(e) => {
                                  if (menuItem.name === 'DIPLOMA') {
                                    e.preventDefault();
                                    setIsDiplomaSubmenuToggled(!isDiplomaSubmenuToggled);
                                    setShowDiplomaSubmenu(!isDiplomaSubmenuToggled);
                                    // Close other submenus when DIPLOMA is clicked
                                    setShowEngineeringSubmenu(false);
                                    setIsEngineeringSubmenuToggled(false);
                                    setShowUGSubmenu(false);
                                    setIsUGSubmenuToggled(false);
                                    setShowPGSubmenu(false);
                                    setIsPGSubmenuToggled(false);
                                    setShowManagementSubmenu(false);
                                    setIsManagementSubmenuToggled(false);
                                  } else if (menuItem.name === 'ENGINEERING') {
                                    e.preventDefault();
                                    setIsEngineeringSubmenuToggled(!isEngineeringSubmenuToggled);
                                    setShowEngineeringSubmenu(!isEngineeringSubmenuToggled);
                                    // Close other submenus when ENGINEERING is clicked
                                    setShowDiplomaSubmenu(false);
                                    setIsDiplomaSubmenuToggled(false);
                                    setShowManagementSubmenu(false);
                                    setIsManagementSubmenuToggled(false);
                                  } else if (menuItem.name === 'MANAGEMENT') {
                                    e.preventDefault();
                                    setIsManagementSubmenuToggled(!isManagementSubmenuToggled);
                                    setShowManagementSubmenu(!isManagementSubmenuToggled);
                                    // Close other submenus when MANAGEMENT is clicked
                                    setShowDiplomaSubmenu(false);
                                    setIsDiplomaSubmenuToggled(false);
                                    setShowEngineeringSubmenu(false);
                                    setIsEngineeringSubmenuToggled(false);
                                    setShowUGSubmenu(false);
                                    setIsUGSubmenuToggled(false);
                                    setShowPGSubmenu(false);
                                    setIsPGSubmenuToggled(false);
                                  } else {
                                    setIsDepartmentsDropdownOpen(false);
                                    setShowDiplomaSubmenu(false);
                                    setIsDiplomaSubmenuToggled(false);
                                    setShowEngineeringSubmenu(false);
                                    setIsEngineeringSubmenuToggled(false);
                                    setShowUGSubmenu(false);
                                    setIsUGSubmenuToggled(false);
                                    setShowPGSubmenu(false);
                                    setIsPGSubmenuToggled(false);
                                    setShowManagementSubmenu(false);
                                    setIsManagementSubmenuToggled(false);
                                  }
                                }}
                              >
                                <span className="font-medium">{menuItem.name}</span>
                                {menuItem.hasSubmenu && (
                                  <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors" />
                                )}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* DIPLOMA Submenu */}
                    {item.name === 'Departments' && showDiplomaSubmenu && (
                      <div 
                        className="absolute w-64 bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl border border-white/20 overflow-hidden z-[99999]"
                        onMouseEnter={() => {
                          if (!isDiplomaSubmenuToggled) {
                            setShowDiplomaSubmenu(true);
                          }
                        }}
                        onMouseLeave={() => {
                          if (!isDiplomaSubmenuToggled) {
                            setShowDiplomaSubmenu(false);
                          }
                        }}
                        style={{
                          top: '40px', // Increased by 10px
                          left: '100%',
                          marginLeft: '133px' // Moved to the right by 10px (from 123px to 133px)
                        }}
                      >
                        <div className="p-1">
                          {diplomaSubmenuItems.map((diplomaItem) => (
                            <a
                              key={diplomaItem.name}
                              href={diplomaItem.href}
                              onClick={() => {
                                navigate(diplomaItem.href);
                                setIsDepartmentsDropdownOpen(false);
                                setShowDiplomaSubmenu(false);
                                setIsDiplomaSubmenuToggled(false);
                              }}
                              className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gradient-primary hover:text-white rounded-md transition-all duration-200"
                            >
                              {diplomaItem.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Engineering Submenu */}
                    {item.name === 'Departments' && showEngineeringSubmenu && (
                      <div 
                        className="absolute w-56 bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl border border-white/20 overflow-hidden z-[99999]"
                        onMouseEnter={() => {
                          if (!isEngineeringSubmenuToggled) {
                            setShowEngineeringSubmenu(true);
                          }
                        }}
                        onMouseLeave={() => {
                          if (!isEngineeringSubmenuToggled && !isUGSubmenuToggled && !isPGSubmenuToggled) {
                            setShowEngineeringSubmenu(false);
                            setShowUGSubmenu(false);
                            setShowPGSubmenu(false);
                          }
                        }}
                        style={{
                          top: '82px', // Increased by 30px
                          left: '100%',
                          marginLeft: '133px' // Same alignment as DIPLOMA submenu
                        }}
                      >
                        <div className="p-1">
                          {engineeringSubmenuItems.map((engItem) => (
                            <div key={engItem.name} className="relative">
                              <a
                                href={engItem.href}
                                className="flex items-center justify-between w-full px-3 py-2 text-xs text-gray-700 hover:bg-gradient-primary hover:text-white rounded-md transition-all duration-200 group"
                                onMouseEnter={() => {
                                  if (engItem.name === 'UNDER GRADUATION (UG)' && !isUGSubmenuToggled) {
                                    setShowUGSubmenu(true);
                                  } else if (engItem.name === 'POST GRADUATION (PG)' && !isPGSubmenuToggled) {
                                    setShowPGSubmenu(true);
                                  }
                                }}
                                onMouseLeave={() => {
                                  if (engItem.name === 'UNDER GRADUATION (UG)' && !isUGSubmenuToggled) {
                                    setTimeout(() => setShowUGSubmenu(false), 100);
                                  } else if (engItem.name === 'POST GRADUATION (PG)' && !isPGSubmenuToggled) {
                                    setTimeout(() => setShowPGSubmenu(false), 100);
                                  }
                                }}
                                onClick={(e) => {
                                  if (engItem.name === 'UNDER GRADUATION (UG)') {
                                    e.preventDefault();
                                    setIsUGSubmenuToggled(!isUGSubmenuToggled);
                                    setShowUGSubmenu(!isUGSubmenuToggled);
                                    // Close PG submenu when UG is clicked
                                    setShowPGSubmenu(false);
                                    setIsPGSubmenuToggled(false);
                                  } else if (engItem.name === 'POST GRADUATION (PG)') {
                                    e.preventDefault();
                                    setIsPGSubmenuToggled(!isPGSubmenuToggled);
                                    setShowPGSubmenu(!isPGSubmenuToggled);
                                    // Close UG submenu when PG is clicked
                                    setShowUGSubmenu(false);
                                    setIsUGSubmenuToggled(false);
                                  } else {
                                    setIsDepartmentsDropdownOpen(false);
                                    setShowEngineeringSubmenu(false);
                                    setIsEngineeringSubmenuToggled(false);
                                    setShowUGSubmenu(false);
                                    setIsUGSubmenuToggled(false);
                                    setShowPGSubmenu(false);
                                    setIsPGSubmenuToggled(false);
                                  }
                                }}
                              >
                                <span className="font-medium">{engItem.name}</span>
                                {engItem.hasSubmenu && (
                                  <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors" />
                                )}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* UG Engineering Submenu */}
                    {item.name === 'Departments' && showUGSubmenu && (
                      <div 
                        className="absolute w-64 bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl border border-white/20 overflow-hidden z-[999999]"
                        onMouseEnter={() => {
                          if (!isUGSubmenuToggled) {
                            setShowUGSubmenu(true);
                          }
                        }}
                        onMouseLeave={() => {
                          if (!isUGSubmenuToggled) {
                            setShowUGSubmenu(false);
                          }
                        }}
                        style={{
                          top: '82px', // Same as ENGINEERING submenu top
                          left: '100%',
                          marginLeft: '362px' // Moved to the right by 10px (from 352px to 362px)
                        }}
                      >
                        <div className="p-1">
                          {ugEngineeringSubmenuItems.map((ugItem) => (
                            <a
                              key={ugItem.name}
                              href={ugItem.href}
                              onClick={() => {
                                navigate(ugItem.href);
                                setIsDepartmentsDropdownOpen(false);
                                setShowEngineeringSubmenu(false);
                                setIsEngineeringSubmenuToggled(false);
                                setShowUGSubmenu(false);
                                setIsUGSubmenuToggled(false);
                              }}
                              className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gradient-primary hover:text-white rounded-md transition-all duration-200"
                            >
                              {ugItem.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* PG Engineering Submenu */}
                    {item.name === 'Departments' && showPGSubmenu && (
                      <div 
                        className="absolute w-64 bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl border border-white/20 overflow-hidden z-[999999]"
                        onMouseEnter={() => {
                          if (!isPGSubmenuToggled) {
                            setShowPGSubmenu(true);
                          }
                        }}
                        onMouseLeave={() => {
                          if (!isPGSubmenuToggled) {
                            setShowPGSubmenu(false);
                          }
                        }}
                        style={{
                          top: '82px', // Same as UG submenu top
                          left: '100%',
                          marginLeft: '362px' // Same position as UG submenu
                        }}
                      >
                        <div className="p-1">
                          {pgEngineeringSubmenuItems.map((pgItem) => (
                            <a
                              key={pgItem.name}
                              href={pgItem.href}
                              onClick={() => {
                                navigate(pgItem.href);
                                setIsDepartmentsDropdownOpen(false);
                                setShowEngineeringSubmenu(false);
                                setIsEngineeringSubmenuToggled(false);
                                setShowPGSubmenu(false);
                                setIsPGSubmenuToggled(false);
                              }}
                              className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gradient-primary hover:text-white rounded-md transition-all duration-200"
                            >
                              {pgItem.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Management Submenu */}
                    {item.name === 'Departments' && showManagementSubmenu && (
                      <div 
                        className="absolute w-56 bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl border border-white/20 overflow-hidden z-[99999]"
                        onMouseEnter={() => {
                          if (!isManagementSubmenuToggled) {
                            setShowManagementSubmenu(true);
                          }
                        }}
                        onMouseLeave={() => {
                          if (!isManagementSubmenuToggled) {
                            setShowManagementSubmenu(false);
                          }
                        }}
                        style={{
                          top: '102px', // ENGINEERING submenu top (82px) + 20px
                          left: '100%',
                          marginLeft: '133px' // Same alignment as ENGINEERING submenu
                        }}
                      >
                        <div className="p-0 overflow-hidden">
                          {/* UNDER GRADUATE Section */}
                          <div className="bg-blue-900 text-white px-3 py-2 text-xs font-semibold uppercase">
                            UNDER GRADUATE
                          </div>
                          <div className="p-1">
                            {managementSubmenuItems
                              .filter(item => item.category === 'UNDER GRADUATE')
                              .map((mgmtItem) => (
                                <a
                                  key={mgmtItem.name}
                                  href={mgmtItem.href}
                                  onClick={() => {
                                    navigate(mgmtItem.href);
                                    setIsDepartmentsDropdownOpen(false);
                                    setShowManagementSubmenu(false);
                                    setIsManagementSubmenuToggled(false);
                                  }}
                                  className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gradient-primary hover:text-white rounded-md transition-all duration-200"
                                >
                                  {mgmtItem.name}
                                </a>
                              ))}
                          </div>
                          
                          {/* POST GRADUATE Section */}
                          <div className="bg-blue-900 text-white px-3 py-2 text-xs font-semibold uppercase">
                            POST GRADUATE
                          </div>
                          <div className="p-1">
                            {managementSubmenuItems
                              .filter(item => item.category === 'POST GRADUATE')
                              .map((mgmtItem) => (
                                <a
                                  key={mgmtItem.name}
                                  href={mgmtItem.href}
                                  onClick={() => {
                                    navigate(mgmtItem.href);
                                    setIsDepartmentsDropdownOpen(false);
                                    setShowManagementSubmenu(false);
                                    setIsManagementSubmenuToggled(false);
                                  }}
                                  className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gradient-primary hover:text-white rounded-md transition-all duration-200"
                                >
                                  {mgmtItem.name}
                                </a>
                              ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Examinations Dropdown Menu */}
                    {item.name === 'Examinations' && isExaminationsDropdownOpen && (
                      <div 
                        className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 z-50 overflow-hidden"
                        onMouseLeave={() => {
                          setIsExaminationsDropdownOpen(false);
                        }}
                      >
                        <div className="p-1">
                          {examinationsMenuItems.map((examItem) => (
                            <a
                              key={examItem.name}
                              href={examItem.href}
                              onClick={() => {
                                navigate(examItem.href);
                                setIsExaminationsDropdownOpen(false);
                              }}
                              className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gradient-primary hover:text-white rounded-md transition-all duration-200"
                            >
                              {examItem.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* IQAC Dropdown Menu */}
                    {item.name === 'IQAC' && isIQACDropdownOpen && (
                      <div 
                        className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 z-50 overflow-hidden"
                        onMouseLeave={() => {
                          if (!isNAACSubmenuToggled && !isAQARSubmenuToggled && !isAQARReportsSubmenuToggled && !isIQACMOMSubmenuToggled) {
                            setIsIQACDropdownOpen(false);
                            setShowNAACSubmenu(false);
                            setShowAQARSubmenu(false);
                            setShowAQARReportsSubmenu(false);
                            setShowIQACMOMSubmenu(false);
                          }
                        }}
                      >
                        <div className="p-1">
                          {iqacMenuItems.map((menuItem, menuIndex) => (
                            <div 
                              key={menuItem.name} 
                              className="relative"
                            >
                              <a
                                href={menuItem.href}
                                className="flex items-center justify-between w-full px-3 py-2 text-xs text-gray-700 hover:bg-gradient-primary hover:text-white rounded-md transition-all duration-200 group"
                                onMouseEnter={() => {
                                  if (menuItem.name === 'NAAC' && !isNAACSubmenuToggled) {
                                    setShowNAACSubmenu(true);
                                  } else if (menuItem.name === 'IQAC MOM' && !isIQACMOMSubmenuToggled) {
                                    setShowIQACMOMSubmenu(true);
                                  }
                                }}
                                onMouseLeave={() => {
                                  if (menuItem.name === 'NAAC' && !isNAACSubmenuToggled) {
                                    setTimeout(() => setShowNAACSubmenu(false), 100);
                                  } else if (menuItem.name === 'IQAC MOM' && !isIQACMOMSubmenuToggled) {
                                    setTimeout(() => setShowIQACMOMSubmenu(false), 100);
                                  }
                                }}
                                onClick={(e) => {
                                  if (menuItem.name === 'NAAC') {
                                    e.preventDefault();
                                    setIsNAACSubmenuToggled(!isNAACSubmenuToggled);
                                    setShowNAACSubmenu(!isNAACSubmenuToggled);
                                    // Close IQAC MOM submenu when NAAC is clicked
                                    setShowIQACMOMSubmenu(false);
                                    setIsIQACMOMSubmenuToggled(false);
                                  } else if (menuItem.name === 'IQAC MOM') {
                                    e.preventDefault();
                                    setIsIQACMOMSubmenuToggled(!isIQACMOMSubmenuToggled);
                                    setShowIQACMOMSubmenu(!isIQACMOMSubmenuToggled);
                                    // Close NAAC submenu when IQAC MOM is clicked
                                    setShowNAACSubmenu(false);
                                    setIsNAACSubmenuToggled(false);
                                  } else {
                                    // Close dropdown when other items are clicked
                                    setIsIQACDropdownOpen(false);
                                    setShowNAACSubmenu(false);
                                    setIsNAACSubmenuToggled(false);
                                    setShowIQACMOMSubmenu(false);
                                    setIsIQACMOMSubmenuToggled(false);
                                  }
                                }}
                              >
                                <span className="font-medium">{menuItem.name}</span>
                                {menuItem.hasSubmenu && (
                                  <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors" />
                                )}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* NAAC Submenu */}
                    {item.name === 'IQAC' && showNAACSubmenu && (
                      <div 
                        className="absolute w-40 bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl border border-white/20 overflow-hidden z-[9999]"
                        onMouseEnter={() => {
                          if (!isNAACSubmenuToggled) {
                            setShowNAACSubmenu(true);
                          }
                        }}
                        onMouseLeave={() => {
                          if (!isNAACSubmenuToggled && !isAQARSubmenuToggled && !isAQARReportsSubmenuToggled) {
                            setShowNAACSubmenu(false);
                            setShowAQARSubmenu(false);
                            setShowAQARReportsSubmenu(false);
                          }
                        }}
                        style={{
                          top: '100px', // Position aligned with NAAC item (3rd item, index 2)
                          left: '100%',
                          marginLeft: '-220px'
                        }}
                      >
                        <div className="p-1">
                          {naacSubmenuItems.map((submenuItem) => (
                            <div key={submenuItem.name} className="relative">
                              <a
                                href={submenuItem.href}
                                className="flex items-center justify-between w-full px-3 py-2 text-xs text-gray-700 hover:bg-gradient-primary hover:text-white rounded-md transition-all duration-200 group"
                                onMouseEnter={() => {
                                  if (submenuItem.name === 'AQAR' && !isAQARSubmenuToggled) {
                                    setShowAQARSubmenu(true);
                                  } else if (submenuItem.name === 'AQAR Reports' && !isAQARReportsSubmenuToggled) {
                                    setShowAQARReportsSubmenu(true);
                                  }
                                }}
                                onMouseLeave={() => {
                                  if (submenuItem.name === 'AQAR' && !isAQARSubmenuToggled) {
                                    setTimeout(() => setShowAQARSubmenu(false), 100);
                                  } else if (submenuItem.name === 'AQAR Reports' && !isAQARReportsSubmenuToggled) {
                                    setTimeout(() => setShowAQARReportsSubmenu(false), 100);
                                  }
                                }}
                                onClick={(e) => {
                                  if (submenuItem.name === 'AQAR') {
                                    e.preventDefault();
                                    setIsAQARSubmenuToggled(!isAQARSubmenuToggled);
                                    setShowAQARSubmenu(!isAQARSubmenuToggled);
                                    // Close AQAR Reports submenu when AQAR is clicked
                                    setShowAQARReportsSubmenu(false);
                                    setIsAQARReportsSubmenuToggled(false);
                                  } else if (submenuItem.name === 'AQAR Reports') {
                                    e.preventDefault();
                                    setIsAQARReportsSubmenuToggled(!isAQARReportsSubmenuToggled);
                                    setShowAQARReportsSubmenu(!isAQARReportsSubmenuToggled);
                                    // Close AQAR submenu when AQAR Reports is clicked
                                    setShowAQARSubmenu(false);
                                    setIsAQARSubmenuToggled(false);
                                  } else {
                                    setIsIQACDropdownOpen(false);
                                    setShowNAACSubmenu(false);
                                    setIsNAACSubmenuToggled(false);
                                    setShowAQARSubmenu(false);
                                    setIsAQARSubmenuToggled(false);
                                    setShowAQARReportsSubmenu(false);
                                    setIsAQARReportsSubmenuToggled(false);
                                  }
                                }}
                              >
                                <span>{submenuItem.name}</span>
                                {submenuItem.hasSubmenu && (
                                  <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors rotate-180" />
                                )}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AQAR Submenu */}
                    {item.name === 'IQAC' && showAQARSubmenu && (
                      <div 
                        className="absolute w-36 bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl border border-white/20 overflow-hidden z-[99999]"
                        onMouseEnter={() => {
                          if (!isAQARSubmenuToggled) {
                            setShowAQARSubmenu(true);
                          }
                        }}
                        onMouseLeave={() => {
                          if (!isAQARSubmenuToggled) {
                            setShowAQARSubmenu(false);
                          }
                        }}
                        style={{
                          top: '132px', // Position aligned with AQAR item (2nd item in NAAC submenu: 100px NAAC top + 32px for AQAR item)
                          right: '100%',
                          marginRight: '184px' // Position to the left of NAAC submenu (220px - 40px NAAC width - 16px spacing + 20px additional left)
                        }}
                      >
                        <div className="p-1">
                          {aqarSubmenuItems.map((aqarItem) => (
                            <a
                              key={aqarItem.name}
                              href={aqarItem.href}
                              onClick={() => {
                                setIsIQACDropdownOpen(false);
                                setShowNAACSubmenu(false);
                                setIsNAACSubmenuToggled(false);
                                setShowAQARSubmenu(false);
                                setIsAQARSubmenuToggled(false);
                                setShowAQARReportsSubmenu(false);
                                setIsAQARReportsSubmenuToggled(false);
                              }}
                              className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gradient-primary hover:text-white rounded-md transition-all duration-200"
                            >
                              {aqarItem.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AQAR Reports Submenu */}
                    {item.name === 'IQAC' && showAQARReportsSubmenu && (
                      <div 
                        className="absolute w-36 bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl border border-white/20 overflow-hidden z-[99999]"
                        onMouseEnter={() => {
                          if (!isAQARReportsSubmenuToggled) {
                            setShowAQARReportsSubmenu(true);
                          }
                        }}
                        onMouseLeave={() => {
                          if (!isAQARReportsSubmenuToggled) {
                            setShowAQARReportsSubmenu(false);
                          }
                        }}
                        style={{
                          top: '164px', // Position aligned with AQAR Reports item (3rd item in NAAC submenu: 100px NAAC top + 64px for AQAR Reports item)
                          right: '100%',
                          marginRight: '184px' // Same positioning as AQAR submenu
                        }}
                      >
                        <div className="p-1">
                          {aqarReportsSubmenuItems.map((aqarReportsItem) => (
                            <a
                              key={aqarReportsItem.name}
                              href={aqarReportsItem.href}
                              onClick={() => {
                                setIsIQACDropdownOpen(false);
                                setShowNAACSubmenu(false);
                                setIsNAACSubmenuToggled(false);
                                setShowAQARSubmenu(false);
                                setIsAQARSubmenuToggled(false);
                                setShowAQARReportsSubmenu(false);
                                setIsAQARReportsSubmenuToggled(false);
                              }}
                              className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gradient-primary hover:text-white rounded-md transition-all duration-200"
                            >
                              {aqarReportsItem.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* IQAC MOM Submenu */}
                    {item.name === 'IQAC' && showIQACMOMSubmenu && (
                      <div 
                        className="absolute w-36 bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl border border-white/20 overflow-hidden z-[99999]"
                        onMouseEnter={() => {
                          if (!isIQACMOMSubmenuToggled) {
                            setShowIQACMOMSubmenu(true);
                          }
                        }}
                        onMouseLeave={() => {
                          if (!isIQACMOMSubmenuToggled) {
                            setShowIQACMOMSubmenu(false);
                          }
                        }}
                        style={{
                          top: '260px', // Reduced by 10px
                          left: '100%',
                          marginLeft: '-200px' // Reduced by 40px
                        }}
                      >
                        <div className="p-1">
                          {iqacMOMSubmenuItems.map((iqacMOMItem) => (
                            <a
                              key={iqacMOMItem.name}
                              href={iqacMOMItem.href}
                              onClick={() => {
                                setIsIQACDropdownOpen(false);
                                setShowNAACSubmenu(false);
                                setIsNAACSubmenuToggled(false);
                                setShowIQACMOMSubmenu(false);
                                setIsIQACMOMSubmenuToggled(false);
                              }}
                              className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gradient-primary hover:text-white rounded-md transition-all duration-200"
                            >
                              {iqacMOMItem.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Facilities Dropdown Menu */}
                    {item.name === 'Facilities' && isFacilitiesDropdownOpen && (
                      <div 
                        className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 z-50 overflow-hidden"
                        onMouseLeave={() => {
                          if (!isLibrarySubmenuToggled) {
                            setIsFacilitiesDropdownOpen(false);
                            setShowLibrarySubmenu(false);
                          }
                        }}
                      >
                        <div className="p-1">
                          {facilitiesMenuItems.map((facilityItem) => (
                            <div key={facilityItem.name} className="relative">
                              <a
                                href={facilityItem.href}
                                className="flex items-center justify-between w-full px-3 py-2 text-xs text-gray-700 hover:bg-gradient-primary hover:text-white rounded-md transition-all duration-200 group"
                                onMouseEnter={() => {
                                  if (facilityItem.name === 'Library' && !isLibrarySubmenuToggled) {
                                    setShowLibrarySubmenu(true);
                                  }
                                }}
                                onMouseLeave={() => {
                                  if (facilityItem.name === 'Library' && !isLibrarySubmenuToggled) {
                                    setTimeout(() => setShowLibrarySubmenu(false), 100);
                                  }
                                }}
                                onClick={(e) => {
                                  if (facilityItem.name === 'Library') {
                                    e.preventDefault();
                                    setIsLibrarySubmenuToggled(!isLibrarySubmenuToggled);
                                    setShowLibrarySubmenu(!isLibrarySubmenuToggled);
                                  } else if (facilityItem.href.startsWith('/')) {
                                    e.preventDefault();
                                    navigate(facilityItem.href);
                                    setIsFacilitiesDropdownOpen(false);
                                    setShowLibrarySubmenu(false);
                                    setIsLibrarySubmenuToggled(false);
                                  } else {
                                    setIsFacilitiesDropdownOpen(false);
                                    setShowLibrarySubmenu(false);
                                    setIsLibrarySubmenuToggled(false);
                                  }
                                }}
                              >
                                <span className="font-medium">{facilityItem.name}</span>
                                {facilityItem.hasSubmenu && (
                                  <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors" />
                                )}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Library Submenu */}
                    {item.name === 'Facilities' && showLibrarySubmenu && (
                      <div 
                        className="absolute w-48 bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl border border-white/20 overflow-hidden z-[99999]"
                        onMouseEnter={() => {
                          if (!isLibrarySubmenuToggled) {
                            setShowLibrarySubmenu(true);
                          }
                        }}
                        onMouseLeave={() => {
                          if (!isLibrarySubmenuToggled) {
                            setShowLibrarySubmenu(false);
                          }
                        }}
                        style={{
                          top: '70px', // Increased by another 15px (55px + 15px)
                          left: '100%',
                          marginLeft: '-272px' // Moved right by another 10px (-282px + 10px = -272px)
                        }}
                      >
                        <div className="p-1">
                          {librarySubmenuItems.map((libraryItem) => (
                            <a
                              key={libraryItem.name}
                              href={libraryItem.href}
                              onClick={() => {
                                setIsFacilitiesDropdownOpen(false);
                                setShowLibrarySubmenu(false);
                                setIsLibrarySubmenuToggled(false);
                              }}
                              className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gradient-primary hover:text-white rounded-md transition-all duration-200"
                            >
                              {libraryItem.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Status Submenu - Created from scratch */}
                    {item.name === 'About' && showStatusSubmenu && (
                      <div 
                        className="absolute w-40 bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl border border-white/20 overflow-hidden z-[9999]"
                        onMouseEnter={() => {
                          if (!isStatusSubmenuToggled) {
                            setShowStatusSubmenu(true);
                          }
                        }}
                        onMouseLeave={() => {
                          if (!isStatusSubmenuToggled) {
                            setShowStatusSubmenu(false);
                          }
                        }}
                        style={{
                          top: '260px',
                          left: '100%',
                          marginLeft: '210px'
                        }}
                      >
                        <div className="p-1">
                          <button
                            type="button"
                            onClick={() => openAccreditationPdf('AUTONOMOUS')}
                            className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gradient-primary hover:text-white rounded-md transition-all duration-200"
                          >
                            Autonomous
                          </button>
                          <button
                            type="button"
                            onClick={() => openAccreditationPdf('NAAC')}
                            className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gradient-primary hover:text-white rounded-md transition-all duration-200"
                          >
                            NAAC
                          </button>
                          <button
                            type="button"
                            onClick={() => openAccreditationPdf('UGC')}
                            className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gradient-primary hover:text-white rounded-md transition-all duration-200"
                          >
                            UGC 2F
                          </button>
                          <button
                            type="button"
                            onClick={() => openAccreditationPdf('ISO')}
                            className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gradient-primary hover:text-white rounded-md transition-all duration-200"
                          >
                            ISO
                          </button>
                        </div>
                      </div>
                    )}

                  </motion.div>
                ) : (
                  <motion.button
                    onClick={() => {
                      if (item.name === 'Home') {
                        if (location.pathname === '/') {
                          scrollToSection('home');
                        } else {
                          navigate('/');
                        }
                      } else if (item.name === 'Academics') {
                        if (location.pathname === '/') {
                          scrollToSection('program-finder');
                        } else {
                          navigate('/#program-finder');
                        }
                      } else {
                        // Check if href is a route (starts with /) or a section (starts with #)
                        if (item.href.startsWith('/')) {
                          // It's a route, navigate directly
                          navigate(item.href);
                        } else if (item.href.startsWith('#')) {
                          // It's a section anchor
                          if (location.pathname === '/') {
                            const element = document.querySelector(item.href);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth' });
                            }
                          } else {
                            navigate(`/${item.href}`);
                          }
                        }
                      }
                    }}
                    className={`transition-colors duration-300 text-sm font-medium relative group px-2 py-1 rounded-md hover:bg-white/10 ${
                      isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80'
                    }`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {item.name}
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300" />
                  </motion.button>
                )}
              </div>
            ))}
          </nav>

          {/* Search Bar - Desktop Navigation (visible when scrolled or on lg screens) */}
          <div className={cn("hidden lg:flex items-center px-4", isScrolled ? "xl:flex" : "xl:hidden")}>
            <SearchBar />
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button className="bg-gradient-primary hover-glow text-white border-0">
              LOGIN
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className={`lg:hidden transition-colors duration-300 ${
              isScrolled ? '' : 'text-white hover:text-white/80'
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className={`lg:hidden overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96' : 'max-h-0'
          }`}
          initial={false}
          animate={{
            height: isMobileMenuOpen ? 'auto' : 0,
            opacity: isMobileMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="glass rounded-lg m-4 p-6 space-y-2">
            {/* Search Bar - Mobile */}
            <div className="mb-4 pb-4 border-b border-border">
              <SearchBar />
            </div>
            {navItems.map((item) => (
              <div key={item.name}>
                {item.hasDropdown ? (
                  <div className="space-y-1 mb-2">
                    <div className="text-sm font-semibold text-gray-700 mb-1 px-3">{item.name}</div>
                    {item.name === 'Placements' && placementsMenuItems.map((menuItem) => (
                      <button
                        key={menuItem.name}
                        onClick={() => {
                          navigate(menuItem.href);
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full text-left transition-colors duration-300 text-xs font-medium py-1.5 px-6 rounded-md hover:bg-white/10 text-gray-600"
                      >
                        {menuItem.name}
                      </button>
                    ))}
                    {item.name === 'Admissions' && admissionsMenuItems.map((menuItem) => (
                      <div key={menuItem.name} className="space-y-1">
                        <a
                          href={menuItem.href}
                          target={menuItem.href.startsWith('http') ? '_blank' : undefined}
                          rel={menuItem.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          onClick={(e) => {
                            if (menuItem.name === 'Courses Offered') {
                              e.preventDefault();
                              // Don't navigate, just show submenu
                              return;
                            }
                            if (!menuItem.href.startsWith('http') && !menuItem.href.startsWith('#')) {
                              navigate(menuItem.href);
                            } else if (menuItem.href.startsWith('#')) {
                              navigate('/');
                              setTimeout(() => {
                                const element = document.querySelector(menuItem.href);
                                if (element) {
                                  element.scrollIntoView({ behavior: 'smooth' });
                                }
                              }, 100);
                            }
                            setIsMobileMenuOpen(false);
                          }}
                          className="block w-full text-left transition-colors duration-300 text-xs font-medium py-1.5 px-6 rounded-md hover:bg-white/10 text-gray-600"
                        >
                          {menuItem.name}
                        </a>
                        {menuItem.name === 'Courses Offered' && (
                          <div className="pl-8 space-y-1">
                            {coursesSubmenuItems.map((courseItem) => (
                              <button
                                key={courseItem.name}
                                onClick={() => {
                                  navigate(courseItem.href);
                                  setIsMobileMenuOpen(false);
                                }}
                                className="block w-full text-left transition-colors duration-300 text-xs font-medium py-1.5 px-6 rounded-md hover:bg-white/10 text-gray-400"
                              >
                                {courseItem.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {item.name === 'Departments' && departmentsMenuItems.map((menuItem) => (
                      <div key={menuItem.name} className="space-y-1">
                        <a
                          href={menuItem.href}
                          onClick={(e) => {
                            if (menuItem.name === 'DIPLOMA' || menuItem.name === 'ENGINEERING' || menuItem.name === 'MANAGEMENT') {
                              e.preventDefault();
                              // Don't navigate, just show submenu
                              return;
                            }
                            setIsMobileMenuOpen(false);
                          }}
                          className="block w-full text-left transition-colors duration-300 text-xs font-medium py-1.5 px-6 rounded-md hover:bg-white/10 text-gray-600"
                        >
                          {menuItem.name}
                        </a>
                        {menuItem.name === 'DIPLOMA' && (
                          <div className="pl-8 space-y-1">
                            {diplomaSubmenuItems.map((diplomaItem) => (
                              <button
                                key={diplomaItem.name}
                                onClick={() => {
                                  navigate(diplomaItem.href);
                                  setIsMobileMenuOpen(false);
                                }}
                                className="block w-full text-left transition-colors duration-300 text-xs font-medium py-1.5 px-6 rounded-md hover:bg-white/10 text-gray-400"
                              >
                                {diplomaItem.name}
                              </button>
                            ))}
                          </div>
                        )}
                        {menuItem.name === 'ENGINEERING' && (
                          <div className="pl-8 space-y-1">
                            {engineeringSubmenuItems.map((engItem) => (
                              <div key={engItem.name} className="space-y-1">
                                <a
                                  href={engItem.href}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    // Don't navigate, just show submenu
                                  }}
                                  className="block w-full text-left transition-colors duration-300 text-xs font-medium py-1.5 px-6 rounded-md hover:bg-white/10 text-gray-400"
                                >
                                  {engItem.name}
                                </a>
                                {engItem.name === 'UNDER GRADUATION (UG)' && (
                                  <div className="pl-8 space-y-1">
                                    {ugEngineeringSubmenuItems.map((ugItem) => (
                                      <button
                                        key={ugItem.name}
                                        onClick={() => {
                                          navigate(ugItem.href);
                                          setIsMobileMenuOpen(false);
                                        }}
                                        className="block w-full text-left transition-colors duration-300 text-xs font-medium py-1.5 px-6 rounded-md hover:bg-white/10 text-gray-300"
                                      >
                                        {ugItem.name}
                                      </button>
                                    ))}
                                  </div>
                                )}
                                {engItem.name === 'POST GRADUATION (PG)' && (
                                  <div className="pl-8 space-y-1">
                                    {pgEngineeringSubmenuItems.map((pgItem) => (
                                      <button
                                        key={pgItem.name}
                                        onClick={() => {
                                          navigate(pgItem.href);
                                          setIsMobileMenuOpen(false);
                                        }}
                                        className="block w-full text-left transition-colors duration-300 text-xs font-medium py-1.5 px-6 rounded-md hover:bg-white/10 text-gray-300"
                                      >
                                        {pgItem.name}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        {menuItem.name === 'MANAGEMENT' && (
                          <div className="pl-8 space-y-1">
                            {/* UNDER GRADUATE Section */}
                            <div className="bg-blue-900 text-white px-3 py-2 text-xs font-semibold uppercase rounded-md">
                              UNDER GRADUATE
                            </div>
                            {managementSubmenuItems
                              .filter(item => item.category === 'UNDER GRADUATE')
                              .map((mgmtItem) => (
                                <button
                                  key={mgmtItem.name}
                                  onClick={() => {
                                    navigate(mgmtItem.href);
                                    setIsMobileMenuOpen(false);
                                  }}
                                  className="block w-full text-left transition-colors duration-300 text-xs font-medium py-1.5 px-6 rounded-md hover:bg-white/10 text-gray-400"
                                >
                                  {mgmtItem.name}
                                </button>
                              ))}
                            
                            {/* POST GRADUATE Section */}
                            <div className="bg-blue-900 text-white px-3 py-2 text-xs font-semibold uppercase rounded-md mt-2">
                              POST GRADUATE
                            </div>
                            {managementSubmenuItems
                              .filter(item => item.category === 'POST GRADUATE')
                              .map((mgmtItem) => (
                                <button
                                  key={mgmtItem.name}
                                  onClick={() => {
                                    navigate(mgmtItem.href);
                                    setIsMobileMenuOpen(false);
                                  }}
                                  className="block w-full text-left transition-colors duration-300 text-xs font-medium py-1.5 px-6 rounded-md hover:bg-white/10 text-gray-400"
                                >
                                  {mgmtItem.name}
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {item.name === 'Examinations' && examinationsMenuItems.map((menuItem) => (
                      <button
                        key={menuItem.name}
                        onClick={() => {
                          navigate(menuItem.href);
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full text-left transition-colors duration-300 text-xs font-medium py-1.5 px-6 rounded-md hover:bg-white/10 text-gray-600"
                      >
                        {menuItem.name}
                      </button>
                    ))}
                    {item.name === 'Facilities' && facilitiesMenuItems.map((menuItem) => (
                      <div key={menuItem.name} className="space-y-1">
                        <a
                          href={menuItem.href}
                          onClick={(e) => {
                            if (menuItem.name === 'Library') {
                              e.preventDefault();
                              // Don't navigate, just show submenu
                              return;
                            }
                            if (menuItem.href.startsWith('/')) {
                              e.preventDefault();
                              navigate(menuItem.href);
                            }
                            setIsMobileMenuOpen(false);
                          }}
                          className="block w-full text-left transition-colors duration-300 text-xs font-medium py-1.5 px-6 rounded-md hover:bg-white/10 text-gray-600"
                        >
                          {menuItem.name}
                        </a>
                        {menuItem.name === 'Library' && (
                          <div className="pl-8 space-y-1">
                            {librarySubmenuItems.map((libraryItem) => (
                              <button
                                key={libraryItem.name}
                                onClick={() => {
                                  if (libraryItem.href.startsWith('/')) {
                                    navigate(libraryItem.href);
                                  } else {
                                    navigate('/');
                                    setTimeout(() => {
                                      const element = document.querySelector(libraryItem.href);
                                      if (element) {
                                        element.scrollIntoView({ behavior: 'smooth' });
                                      }
                                    }, 100);
                                  }
                                  setIsMobileMenuOpen(false);
                                }}
                                className="block w-full text-left transition-colors duration-300 text-xs font-medium py-1.5 px-6 rounded-md hover:bg-white/10 text-gray-400"
                              >
                                {libraryItem.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {item.name === 'About' && aboutMenuItems.map((menuItem) => (
                      <button
                        key={menuItem.name}
                        onClick={() => {
                          if (menuItem.href.startsWith('/')) {
                            navigate(menuItem.href);
                          } else {
                            navigate('/');
                            setTimeout(() => {
                              const element = document.querySelector(menuItem.href);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                              }
                            }, 100);
                          }
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full text-left transition-colors duration-300 text-xs font-medium py-1.5 px-6 rounded-md hover:bg-white/10 text-gray-600"
                      >
                        {menuItem.name}
                      </button>
                    ))}
                    {item.name === 'IQAC' && iqacMenuItems.map((menuItem) => (
                      <div key={menuItem.name} className="space-y-1">
                        <button
                          onClick={() => {
                            if (menuItem.name === 'NAAC' || menuItem.name === 'IQAC MOM') {
                              // Don't navigate, just show submenu
                              return;
                            }
                            if (menuItem.href.startsWith('/')) {
                              navigate(menuItem.href);
                            } else {
                              navigate('/');
                              setTimeout(() => {
                                const element = document.querySelector(menuItem.href);
                                if (element) {
                                  element.scrollIntoView({ behavior: 'smooth' });
                                }
                              }, 100);
                            }
                            setIsMobileMenuOpen(false);
                          }}
                          className="block w-full text-left transition-colors duration-300 text-xs font-medium py-1.5 px-6 rounded-md hover:bg-white/10 text-gray-600"
                        >
                          {menuItem.name}
                        </button>
                        {menuItem.name === 'IQAC MOM' && (
                          <div className="pl-8 space-y-1">
                            {iqacMOMSubmenuItems.map((iqacMOMItem) => (
                              <button
                                key={iqacMOMItem.name}
                                onClick={() => {
                                  if (iqacMOMItem.href.startsWith('/')) {
                                    navigate(iqacMOMItem.href);
                                  } else {
                                    navigate('/');
                                    setTimeout(() => {
                                      const element = document.querySelector(iqacMOMItem.href);
                                      if (element) {
                                        element.scrollIntoView({ behavior: 'smooth' });
                                      }
                                    }, 100);
                                  }
                                  setIsMobileMenuOpen(false);
                                }}
                                className="block w-full text-left transition-colors duration-300 text-xs font-medium py-1.5 px-6 rounded-md hover:bg-white/10 text-gray-400"
                              >
                                {iqacMOMItem.name}
                              </button>
                            ))}
                          </div>
                        )}
                        {menuItem.name === 'NAAC' && (
                          <div className="pl-8 space-y-1">
                            {naacSubmenuItems.map((submenuItem) => (
                              <div key={submenuItem.name} className="space-y-1">
                                <button
                                  onClick={() => {
                                    if (submenuItem.name === 'AQAR' || submenuItem.name === 'AQAR Reports') {
                                      // Don't navigate, just show submenu
                                      return;
                                    }
                                    if (submenuItem.href.startsWith('/')) {
                                      navigate(submenuItem.href);
                                    } else {
                                      navigate('/');
                                      setTimeout(() => {
                                        const element = document.querySelector(submenuItem.href);
                                        if (element) {
                                          element.scrollIntoView({ behavior: 'smooth' });
                                        }
                                      }, 100);
                                    }
                                    setIsMobileMenuOpen(false);
                                  }}
                                  className="block w-full text-left transition-colors duration-300 text-xs font-medium py-1.5 px-6 rounded-md hover:bg-white/10 text-gray-500"
                                >
                                  {submenuItem.name}
                                </button>
                                {submenuItem.name === 'AQAR' && (
                                  <div className="pl-8 space-y-1">
                                    {aqarSubmenuItems.map((aqarItem) => (
                                      <button
                                        key={aqarItem.name}
                                        onClick={() => {
                                          if (aqarItem.href.startsWith('/')) {
                                            navigate(aqarItem.href);
                                          } else {
                                            navigate('/');
                                            setTimeout(() => {
                                              const element = document.querySelector(aqarItem.href);
                                              if (element) {
                                                element.scrollIntoView({ behavior: 'smooth' });
                                              }
                                            }, 100);
                                          }
                                          setIsMobileMenuOpen(false);
                                        }}
                                        className="block w-full text-left transition-colors duration-300 text-xs font-medium py-1.5 px-6 rounded-md hover:bg-white/10 text-gray-400"
                                      >
                                        {aqarItem.name}
                                      </button>
                                    ))}
                                  </div>
                                )}
                                {submenuItem.name === 'AQAR Reports' && (
                                  <div className="pl-8 space-y-1">
                                    {aqarReportsSubmenuItems.map((aqarReportsItem) => (
                                      <button
                                        key={aqarReportsItem.name}
                                        onClick={() => {
                                          if (aqarReportsItem.href.startsWith('/')) {
                                            navigate(aqarReportsItem.href);
                                          } else {
                                            navigate('/');
                                            setTimeout(() => {
                                              const element = document.querySelector(aqarReportsItem.href);
                                              if (element) {
                                                element.scrollIntoView({ behavior: 'smooth' });
                                              }
                                            }, 100);
                                          }
                                          setIsMobileMenuOpen(false);
                                        }}
                                        className="block w-full text-left transition-colors duration-300 text-xs font-medium py-1.5 px-6 rounded-md hover:bg-white/10 text-gray-400"
                                      >
                                        {aqarReportsItem.name}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (item.name === 'Home') {
                        if (location.pathname === '/') {
                          scrollToSection('home');
                        } else {
                          navigate('/');
                        }
                      } else if (item.name === 'Academics') {
                        if (location.pathname === '/') {
                          scrollToSection('program-finder');
                        } else {
                          navigate('/#program-finder');
                        }
                      } else {
                        // Check if href is a route (starts with /) or a section (starts with #)
                        if (item.href.startsWith('/')) {
                          // It's a route, navigate directly
                          navigate(item.href);
                        } else if (item.href.startsWith('#')) {
                          // It's a section anchor
                          if (location.pathname === '/') {
                            const element = document.querySelector(item.href);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth' });
                            }
                          } else {
                            navigate(`/${item.href}`);
                          }
                        }
                      }
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left transition-colors duration-300 text-sm font-medium py-2 px-3 rounded-md hover:bg-white/10 ${
                      isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80'
                    }`}
                  >
                    {item.name}
                  </button>
                )}
              </div>
            ))}
            <div className="flex flex-col space-y-2 pt-4 border-t border-border">
              <Button className="bg-gradient-primary text-white border-0 justify-start">
                LOGIN
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
    {/* No spacer; hero starts immediately under header */}
    </>
  );
};

export default Header;