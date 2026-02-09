import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SearchItem {
  name: string;
  href: string;
  category?: string;
  type: 'page' | 'dropdown' | 'submenu';
}

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchItem[]>([]);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build comprehensive search index from all navigation items
  const buildSearchIndex = (): SearchItem[] => {
    const index: SearchItem[] = [];

    // Main navigation items
    const navItems = [
      { name: 'Home', href: '/', type: 'page' as const },
      { name: 'About', href: '/about', type: 'page' as const },
      { name: 'Admissions', href: '#admissions', type: 'page' as const },
      { name: 'Departments', href: '#departments', type: 'page' as const },
      { name: 'Academics', href: '#program-finder', type: 'page' as const },
      { name: 'Examinations', href: '#examinations', type: 'page' as const },
      { name: 'Placements', href: '/placements', type: 'page' as const },
      { name: 'R&D', href: '/research-development', type: 'page' as const },
      { name: 'Research & Development', href: '/research-development', type: 'page' as const },
      { name: 'IQAC', href: '#iqac', type: 'page' as const },
      { name: 'Facilities', href: '#facilities', type: 'page' as const },
    ];

    // About dropdown items
    const aboutItems = [
      { name: 'About US', href: '/about', category: 'About', type: 'dropdown' as const },
      { name: 'Vision & Mission', href: '/vision-mission', category: 'About', type: 'dropdown' as const },
      { name: 'Chairman', href: '/chairman', category: 'About', type: 'dropdown' as const },
      { name: 'Principal', href: '/principal', category: 'About', type: 'dropdown' as const },
      { name: 'Dean Academics', href: '/dean-academics', category: 'About', type: 'dropdown' as const },
      { name: 'Dean Innovation & Student Projects', href: '/dean-innovation', category: 'About', type: 'dropdown' as const },
      { name: 'Dean Innovation', href: '/dean-innovation', category: 'About', type: 'dropdown' as const },
      { name: 'Accreditations', href: '/accreditations', category: 'About', type: 'dropdown' as const },
      { name: 'Organizational Chart', href: '/organizational-chart', category: 'About', type: 'dropdown' as const },
      { name: 'Governing Body', href: '/governing-body', category: 'About', type: 'dropdown' as const },
      { name: 'Grievance Redressal', href: '/grievance-redressal', category: 'About', type: 'dropdown' as const },
      { name: 'Committees', href: '/committees', category: 'About', type: 'dropdown' as const },
      { name: 'Grievance Form', href: '#grievance-form', category: 'About', type: 'dropdown' as const },
    ];

    // Placements items
    const placementsItems = [
      { name: 'Placements', href: '/placements', category: 'Placements', type: 'dropdown' as const },
      { name: 'Placements Cell', href: '/placements-cell', category: 'Placements', type: 'dropdown' as const },
    ];

    // Admissions items
    const admissionsItems = [
      { name: 'Courses Offered', href: '/courses-offered', category: 'Admissions', type: 'dropdown' as const },
      { name: 'Online Admission Form', href: 'https://docs.google.com/forms/d/e/1FAIpQLSfzvrY5qJTPfzBiW1UU1JZAvNAN8qcjv07v6lWSc1Xe0X-wvw/viewform?usp=send_form', category: 'Admissions', type: 'dropdown' as const },
      { name: 'Contact', href: '#contact', category: 'Admissions', type: 'dropdown' as const },
    ];

    // Courses submenu items
    const coursesItems = [
      { name: 'DIPLOMA', href: '/diploma', category: 'Admissions > Courses', type: 'submenu' as const },
      { name: 'B.TECH', href: '/btech', category: 'Admissions > Courses', type: 'submenu' as const },
      { name: 'M.TECH', href: '/mtech', category: 'Admissions > Courses', type: 'submenu' as const },
      { name: 'BBA', href: '/bba', category: 'Admissions > Courses', type: 'submenu' as const },
      { name: 'MBA', href: '/mba', category: 'Admissions > Courses', type: 'submenu' as const },
      { name: 'BCA', href: '/bca', category: 'Admissions > Courses', type: 'submenu' as const },
      { name: 'MCA', href: '/mca', category: 'Admissions > Courses', type: 'submenu' as const },
    ];

    // Diploma submenu items
    const diplomaItems = [
      { name: 'AGRICULTURAL ENGINEERING', href: '/agricultural-engineering', category: 'Departments > Diploma', type: 'submenu' as const },
      { name: 'CIVIL ENGINEERING', href: '/civil-engineering', category: 'Departments > Diploma', type: 'submenu' as const },
      { name: 'COMPUTER ENGINEERING', href: '/computer-engineering', category: 'Departments > Diploma', type: 'submenu' as const },
      { name: 'ELECTRONICS & COMMUNICATIONS ENGINEERING', href: '/electronics-communications-engineering', category: 'Departments > Diploma', type: 'submenu' as const },
      { name: 'ELECTRICAL & ELECTRONICS ENGINEERING', href: '/electrical-electronics-engineering', category: 'Departments > Diploma', type: 'submenu' as const },
      { name: 'MECHANICAL ENGINEERING', href: '/mechanical-engineering', category: 'Departments > Diploma', type: 'submenu' as const },
    ];

    // UG Engineering items
    const ugEngineeringItems = [
      { name: 'Automobile Engineering', href: '/automobile-engineering', category: 'Departments > Engineering > UG', type: 'submenu' as const },
      { name: 'BS & H', href: '/bs-h', category: 'Departments > Engineering > UG', type: 'submenu' as const },
      { name: 'Civil Engineering', href: '/civil-engineering-ug', category: 'Departments > Engineering > UG', type: 'submenu' as const },
      { name: 'Computer Science & Engineering', href: '/programs/engineering/ug/cse', category: 'Departments > Engineering > UG', type: 'submenu' as const },
      { name: 'Computer Science Engineering', href: '/programs/engineering/ug/cse', category: 'Departments > Engineering > UG', type: 'submenu' as const },
      { name: 'CSE', href: '/programs/engineering/ug/cse', category: 'Departments > Engineering > UG', type: 'submenu' as const },
      { name: 'CSE (Data Science)', href: '/programs/engineering/ug/data-science', category: 'Departments > Engineering > UG', type: 'submenu' as const },
      { name: 'CSE (Cyber Security)', href: '/programs/engineering/ug/cyber-security', category: 'Departments > Engineering > UG', type: 'submenu' as const },
      { name: 'CSE (AI & ML)', href: '/programs/engineering/ug/aiml', category: 'Departments > Engineering > UG', type: 'submenu' as const },
      { name: 'Electronics & Communications Engineering', href: '/electronics-communications-engineering-ug', category: 'Departments > Engineering > UG', type: 'submenu' as const },
      { name: 'ECE', href: '/electronics-communications-engineering-ug', category: 'Departments > Engineering > UG', type: 'submenu' as const },
      { name: 'Electrical & Electronics Engineering', href: '/electrical-electronics-engineering-ug', category: 'Departments > Engineering > UG', type: 'submenu' as const },
      { name: 'EEE', href: '/electrical-electronics-engineering-ug', category: 'Departments > Engineering > UG', type: 'submenu' as const },
      { name: 'Mechanical Engineering', href: '/mechanical-engineering-ug', category: 'Departments > Engineering > UG', type: 'submenu' as const },
    ];

    // PG Engineering items
    const pgEngineeringItems = [
      { name: 'CAD/CAM', href: '/cad-cam', category: 'Departments > Engineering > PG', type: 'submenu' as const },
      { name: 'Computer Science & Engineering', href: '/computer-science-engineering-pg', category: 'Departments > Engineering > PG', type: 'submenu' as const },
      { name: 'Power Systems', href: '/power-systems', category: 'Departments > Engineering > PG', type: 'submenu' as const },
      { name: 'Structural Engineering', href: '/structural-engineering', category: 'Departments > Engineering > PG', type: 'submenu' as const },
      { name: 'Thermal Engineering', href: '/thermal-engineering', category: 'Departments > Engineering > PG', type: 'submenu' as const },
      { name: 'VLSI & Embedded systems', href: '/vlsi-embedded-systems', category: 'Departments > Engineering > PG', type: 'submenu' as const },
    ];

    // Management items
    const managementItems = [
      { name: 'BBA', href: '/bba', category: 'Departments > Management', type: 'submenu' as const },
      { name: 'BCA', href: '/bca', category: 'Departments > Management', type: 'submenu' as const },
      { name: 'MBA', href: '/mba', category: 'Departments > Management', type: 'submenu' as const },
      { name: 'MCA', href: '/mca', category: 'Departments > Management', type: 'submenu' as const },
    ];

    // Examinations items
    const examinationsItems = [
      { name: 'UG,PG', href: '/examinations/ug-pg', category: 'Examinations', type: 'dropdown' as const },
      { name: 'UG PG Examinations', href: '/examinations/ug-pg', category: 'Examinations', type: 'dropdown' as const },
      { name: 'Diploma (SBTET)', href: '/examinations/diploma', category: 'Examinations', type: 'dropdown' as const },
    ];

    // Facilities items
    const facilitiesItems = [
      { name: 'Center of Excellence', href: '#center-of-excellence', category: 'Facilities', type: 'dropdown' as const },
      { name: 'Library', href: '/facilities/library', category: 'Facilities', type: 'dropdown' as const },
      { name: 'Digital Library', href: '#digital-library', category: 'Facilities', type: 'submenu' as const },
      { name: 'NSS', href: '/facilities/nss', category: 'Facilities', type: 'dropdown' as const },
      { name: 'Hostel', href: '/facilities/hostel', category: 'Facilities', type: 'dropdown' as const },
      { name: 'Sports', href: '/facilities/sports', category: 'Facilities', type: 'dropdown' as const },
      { name: 'WIFI', href: '#wifi', category: 'Facilities', type: 'dropdown' as const },
      { name: 'Transport', href: '/facilities/transport', category: 'Facilities', type: 'dropdown' as const },
      { name: 'Medical Facility', href: '#medical-facility', category: 'Facilities', type: 'dropdown' as const },
      { name: 'Cafeteria', href: '/facilities/cafeteria', category: 'Facilities', type: 'dropdown' as const },
      { name: 'RO Water Plant', href: '#ro-water-plant', category: 'Facilities', type: 'dropdown' as const },
      { name: 'Green Initiatives', href: '#green-initiatives', category: 'Facilities', type: 'dropdown' as const },
      { name: 'Solar Power Plant', href: '#solar-power-plant', category: 'Facilities', type: 'dropdown' as const },
    ];

    // IQAC items
    const iqacItems = [
      { name: 'Student Satisfactory Survey', href: '/student-satisfactory-survey', category: 'IQAC', type: 'dropdown' as const },
      { name: 'NIRF', href: '/nirf', category: 'IQAC', type: 'dropdown' as const },
      { name: 'NAAC', href: '#naac', category: 'IQAC', type: 'dropdown' as const },
      { name: 'Best Practices', href: '/best-practices', category: 'IQAC', type: 'dropdown' as const },
      { name: 'Feedback Form', href: '/feedback-form', category: 'IQAC', type: 'dropdown' as const },
      { name: 'Institutional Distinctiveness', href: '/institutional-distinctiveness', category: 'IQAC', type: 'dropdown' as const },
      { name: 'Procedures and Policies', href: '/procedures-policies', category: 'IQAC', type: 'dropdown' as const },
      { name: 'IQAC MOM', href: '/iqac-mom', category: 'IQAC', type: 'dropdown' as const },
      { name: 'SSR', href: '/ssr', category: 'IQAC > NAAC', type: 'submenu' as const },
      { name: 'AQAR', href: '/aqar', category: 'IQAC > NAAC', type: 'submenu' as const },
      { name: 'AQAR 2021-2022', href: '/aqar-2021-2022', category: 'IQAC > NAAC > AQAR', type: 'submenu' as const },
      { name: 'AQAR 2022-2023', href: '/aqar-2022-2023', category: 'IQAC > NAAC > AQAR', type: 'submenu' as const },
      { name: 'AQAR 2023-2024', href: '/aqar-2023-2024', category: 'IQAC > NAAC > AQAR', type: 'submenu' as const },
      { name: 'AQAR Reports', href: '/aqar-reports', category: 'IQAC > NAAC', type: 'submenu' as const },
      { name: 'IQAC MOM 2023-2024', href: '/iqac-mom-2023-2024', category: 'IQAC', type: 'submenu' as const },
    ];

    // Combine all items
    index.push(
      ...navItems,
      ...aboutItems,
      ...placementsItems,
      ...admissionsItems,
      ...coursesItems,
      ...diplomaItems,
      ...ugEngineeringItems,
      ...pgEngineeringItems,
      ...managementItems,
      ...examinationsItems,
      ...facilitiesItems,
      ...iqacItems
    );

    return index;
  };

  const searchIndex = buildSearchIndex();

  // Search function
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase().trim();
    const matched = searchIndex.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(lowerQuery);
      const categoryMatch = item.category?.toLowerCase().includes(lowerQuery);
      return nameMatch || categoryMatch;
    });

    // Sort by relevance (exact matches first, then partial matches)
    const sorted = matched.sort((a, b) => {
      const aNameLower = a.name.toLowerCase();
      const bNameLower = b.name.toLowerCase();
      const aExact = aNameLower === lowerQuery;
      const bExact = bNameLower === lowerQuery;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      if (aNameLower.startsWith(lowerQuery) && !bNameLower.startsWith(lowerQuery)) return -1;
      if (!aNameLower.startsWith(lowerQuery) && bNameLower.startsWith(lowerQuery)) return 1;
      return a.name.localeCompare(b.name);
    });

    setResults(sorted.slice(0, 10)); // Limit to 10 results
  };

  useEffect(() => {
    performSearch(searchQuery);
  }, [searchQuery]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
    } else if (e.key === 'Enter' && results.length > 0) {
      handleSelectResult(results[0]);
    }
  };

  // Handle result selection
  const handleSelectResult = (result: SearchItem) => {
    setIsOpen(false);
    setSearchQuery('');

    if (result.href.startsWith('http')) {
      window.open(result.href, '_blank', 'noopener,noreferrer');
    } else if (result.href.startsWith('#')) {
      // Handle hash navigation
      const element = document.querySelector(result.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        navigate('/');
        setTimeout(() => {
          const el = document.querySelector(result.href);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    } else {
      navigate(result.href);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search pages, departments, courses..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10 w-full bg-white/10 dark:bg-slate-800/90 backdrop-blur-sm border-white/20 dark:border-slate-600 text-white dark:text-slate-100 placeholder:text-white/60 dark:placeholder:text-slate-400 focus:bg-white/20 dark:focus:bg-slate-700 focus:border-white/40 dark:focus:border-slate-500"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-border max-h-96 overflow-y-auto z-50"
          >
            {results.map((result, index) => (
              <button
                key={`${result.href}-${index}`}
                onClick={() => handleSelectResult(result)}
                className={cn(
                  "w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
                  "flex items-center justify-between gap-2 border-b border-border last:border-b-0"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground truncate">
                    {result.name}
                  </div>
                  {result.category && (
                    <div className="text-xs text-muted-foreground mt-1 truncate">
                      {result.category}
                    </div>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </button>
            ))}
          </motion.div>
        )}
        {isOpen && searchQuery && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-border p-4 z-50"
          >
            <div className="text-sm text-muted-foreground text-center">
              No results found for "{searchQuery}"
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;

