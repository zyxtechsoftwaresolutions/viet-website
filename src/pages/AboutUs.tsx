import { useState, useEffect, useRef, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Award, Users, BookOpen, GraduationCap, Building2, Globe, Heart, Target, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';
import { pagesAPI } from '@/lib/api';

// Animated Stat Component - moved outside to prevent recreation
interface StatType {
  number: string;
  label: string;
  icon: any;
  targetValue: number | string;
  suffix: string;
  isLetter?: boolean;
}

const AnimatedStat = memo(({ stat, index }: { stat: StatType; index: number }) => {
  const [count, setCount] = useState<number | string>(stat.isLetter ? 'D' : 0);
  const hasStartedRef = useRef(false);
  const hasCompletedRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const statRef = useRef(stat);

  // Update stat ref when it changes
  useEffect(() => {
    statRef.current = stat;
  }, [stat]);

  useEffect(() => {
    // Don't run if already started or completed, or if ref is not available
    if (hasStartedRef.current || hasCompletedRef.current || !ref.current) return;
    
    // Don't create observer if one already exists
    if (observerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // Double check - make sure we haven't started and we're intersecting
        if (entry.isIntersecting && !hasStartedRef.current && !hasCompletedRef.current) {
          hasStartedRef.current = true;
          
          // Disconnect observer immediately
          if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
          }
          
          const currentStat = statRef.current;
          
          if (currentStat.isLetter && currentStat.targetValue === 'A') {
            // Animate through NAAC grades: D, C, B, B+, B++, A, A+, A++ and stop at A
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
            // Animate numbers from 0 to target
            const duration = 2000;
            const startTime = Date.now();
            const targetNum = currentStat.targetValue as number;
            const animate = () => {
              // Check if completed before continuing
              if (hasCompletedRef.current) return;
              
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeOutQuart = 1 - Math.pow(1 - progress, 4);
              const current = Math.floor(easeOutQuart * targetNum);
              setCount(current);

              if (progress < 1) {
                animationFrameRef.current = requestAnimationFrame(animate);
              } else {
                setCount(targetNum);
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

    if (ref.current && observerRef.current) {
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
  }, []); // Empty dependency array - only run once on mount

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
        <stat.icon className="w-8 h-8 text-white" />
      </div>
      <div className="text-3xl md:text-4xl font-bold text-[#0a192f] mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {typeof count === 'number' ? count.toLocaleString() : count}{stat.suffix}
      </div>
      <div className="text-sm md:text-base text-gray-600" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {stat.label}
      </div>
    </motion.div>
  );
});

AnimatedStat.displayName = 'AnimatedStat';

const AboutUs = () => {
  const [pageContent, setPageContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        const page = await pagesAPI.getBySlug('about');
        setPageContent(page?.content || null);
      } catch (error) {
        console.error('Error fetching page content:', error);
        setPageContent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPageContent();
  }, []);

  const stats = useMemo(() => [
    { number: '15+', label: 'Programs', icon: BookOpen, targetValue: 15, suffix: '+' },
    { number: '4900+', label: 'Students', icon: Users, targetValue: 4900, suffix: '+' },
    { number: '200+', label: 'Faculty Members', icon: GraduationCap, targetValue: 200, suffix: '+' },
    { number: 'A', label: 'NAAC Grade', icon: Award, targetValue: 'A', suffix: '', isLetter: true },
  ], []);

  // Rankings carousel logos
  const rankingsLogos = [
    { src: '/naac-A-logo.png', alt: 'NAAC A Grade', name: 'NAAC A Grade', description: 'Accredited with A grade by NAAC' },
    { src: '/UGC-logo.png', alt: 'UGC Recognition', name: 'UGC Recognition', description: 'Recognized by University Grants Commission' },
    { src: '/msme-logo.png', alt: 'MSME', name: 'MSME', description: 'Ministry of Micro, Small & Medium Enterprises' },
  ];

  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLogoIndex((prev) => (prev + 1) % rankingsLogos.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [rankingsLogos.length]);

  const nextLogo = () => {
    setCurrentLogoIndex((prev) => (prev + 1) % rankingsLogos.length);
  };

  const prevLogo = () => {
    setCurrentLogoIndex((prev) => (prev - 1 + rankingsLogos.length) % rankingsLogos.length);
  };

  const heroTitle = pageContent?.hero?.title || 'About VIET';
  const heroDescription = pageContent?.hero?.description || 'Visakha Institute of Engineering & Technology - Excellence in Technical Education Since 2008';

  return (
    <div className="min-h-screen bg-slate-100">
      <LeaderPageNavbar backHref="/" />

      {/* Hero Section — About page with background */}
      <section
        className="relative min-h-[85vh] md:min-h-[90vh] pt-24 md:pt-28 pb-12 md:pb-16 text-white flex items-center bg-[#5a5a5a] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/campus-hero.jpg)' }}
      >
        {/* Dark overlay for text readability */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/75 from-40% via-black/50 to-transparent"
          aria-hidden
        />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-2xl">
            <motion.div
              className="space-y-4 md:space-y-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="inline-block px-4 py-1.5 text-sm md:text-base font-bold tracking-[0.2em] text-white uppercase bg-white/20 backdrop-blur-sm border border-white/40 rounded-full">
                About Us
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-sm">
                {heroTitle}
              </h1>
              <p className="text-lg md:text-xl font-semibold text-white/95">
                Excellence in Technical Education
              </p>
              <p className="text-base md:text-lg text-white/90 leading-relaxed font-poppins max-w-xl">
                {heroDescription}
              </p>
              <a
                href="#about-content"
                className="inline-flex items-center px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
              >
                Learn More
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Us Section with Rankings */}
      <section id="about-content" className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-[#0a192f] mb-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              About us
            </h2>
            
            {/* Content wrapper with Rankings floated */}
            <div className="relative">
              {/* Rankings Section - Floated Right, Static - Fixed height */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="float-right ml-8 mb-8 w-full md:w-96 flex-shrink-0"
                style={{ height: '400px' }}
              >
                <h2 className="text-2xl md:text-3xl font-semibold text-[#0a192f] mb-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Rankings
                </h2>
                
                {/* Carousel Container */}
                <div className="relative">
                  <div className="relative h-64 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentLogoIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 flex flex-col items-center justify-center p-6"
                      >
                        <div className="flex-1 flex items-center justify-center mb-4">
                          <img
                            src={rankingsLogos[currentLogoIndex].src}
                            alt={rankingsLogos[currentLogoIndex].alt}
                            className="max-w-full max-h-40 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent && !parent.querySelector('.fallback-text')) {
                                const fallback = document.createElement('div');
                                fallback.className = 'fallback-text text-gray-400 text-lg text-center font-semibold';
                                fallback.textContent = rankingsLogos[currentLogoIndex].name;
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-[#0a192f] mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                            {rankingsLogos[currentLogoIndex].name}
                          </p>
                          <p className="text-xs text-gray-600" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                            {rankingsLogos[currentLogoIndex].description}
                          </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation Arrows */}
                    <button
                      onClick={prevLogo}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-all duration-200 z-10"
                      aria-label="Previous logo"
                    >
                      <ChevronLeft className="w-5 h-5 text-[#0a192f]" />
                    </button>
                    <button
                      onClick={nextLogo}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-all duration-200 z-10"
                      aria-label="Next logo"
                    >
                      <ChevronRight className="w-5 h-5 text-[#0a192f]" />
                    </button>
                  </div>

                  {/* Dots Indicator */}
                  <div className="flex justify-center gap-2 mt-4">
                    {rankingsLogos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentLogoIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentLogoIndex
                            ? 'bg-[#0a192f] w-6'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to logo ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* About Us Text Content - Flows around Rankings */}
              <div className="text-[#0a192f] text-base md:text-lg leading-relaxed" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                {pageContent?.mainContent ? (
                  <>
                    {/* Content flows beside rankings, then continues below after spacer */}
                    <div dangerouslySetInnerHTML={{ __html: pageContent.mainContent }} />
                    {/* Spacer positioned to force text below rankings after ~13 lines */}
                    <div className="hidden md:block rankings-spacer"></div>
                    <div className="clear-both"></div>
                  </>
                ) : (
                  <>
                    {/* First 4 paragraphs - flow beside rankings */}
                    <p className="mb-4">
                      Visakha Institute of Engineering & Technology (VIET) was founded by <strong>"VARAHA LAKSHMI NARASHIMA SWAMY EDUCATIONAL TRUST"</strong> at Narava in 2008. It is located in VISAKHAPATNAM.
                    </p>
                    <p className="mb-4">
                      VIET is affiliated to Jawaharlal Nehru Technological University, Kakinada, Andhra Pradesh. The Institute follows the curriculum as prescribed by the Jawaharlal Nehru Technological University, Kakinada. The academic calendar provided by the University is followed. The academic and other activities are planned for the semester and a calendar of events is prepared by the institute also. At the beginning of the semester the faculty members prepare the lesson plans for their respective subjects. As per the scheduled dates of academic calendar, internal/ end semester examinations for students are conducted in each semester. For the weaker category of students, remedial classes are conducted for different subjects and evaluation of outcome. For the laboratory classes, in addition to the lesson plans, lab manuals are prepared for each subject by the faculty and distributed to the students. Industrial visits are arranged to bridge the gap between theoretical knowledge and Industrial applications.
                    </p>
                    <p className="mb-4">
                      Andhra Pradesh is well known for automotive, power generation industries and Software development centers. All the departments arrange visits to these industries so that the students are exposed to the real world of manufacturing, energy production and latest trends in software and communication technologies. Also, many of the final year projects are supported by the industries. Special lectures are conducted by inviting distinguished faculty engineers from reputed Universities/Institutes and Industries. The institution has also developed various plans for effective monitoring of the curriculum. Details of these processes are as follows: Each department has defined its specific Vision and Mission in tune with the institution's Vision and Mission.
                    </p>
                    <p className="mb-4">
                      Program Education Objectives (PEOs) are developed in consultation with management, faculty members, students, technical staff, stakeholders(alumni, parents, employers etc). These are updated from time to time on the basis of feedback received from various bodies. Each program of the department is elaborated in terms of Program Outcomes which are aligned with graduate attributes. Furthermore Course Outcomes (COs) for every subject taught is formed by individual faculty members.
                    </p>
                    {/* Spacer to force remaining text below rankings */}
                    <div className="hidden md:block rankings-spacer"></div>
                    <div className="clear-both"></div>
                    {/* Remaining content - flows below rankings */}
                    <p className="mb-4">
                      The institution has been consistently recognized for its commitment to quality education and student success. Our campus provides a conducive learning environment with modern infrastructure, well-equipped laboratories, and state-of-the-art facilities that support both academic and extracurricular activities.
                    </p>
                    <p className="mb-4">
                      VIET College has established itself as a premier institution in the region, attracting students from across Andhra Pradesh and neighboring states. Our alumni have made significant contributions in various fields, working with leading multinational corporations, government organizations, and entrepreneurial ventures.
                    </p>
                    <p className="mb-4">
                      The college continues to evolve and adapt to the changing needs of the industry and society. We regularly update our curriculum, enhance our facilities, and strengthen our industry partnerships to ensure that our students receive education that is both relevant and forward-looking. Our commitment to excellence has earned us recognition from various accrediting bodies and industry associations.
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Rankings Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-3 gap-8"
          >
            <div>
              <h3 className="text-xl font-semibold text-[#0a192f] mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Rankings
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                VIET has been recognized as one of the leading institutions of higher learning in Andhra Pradesh, consistently maintaining high standards of academic excellence and student success.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#0a192f] mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Accreditation
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                In 2023, the institution was awarded an A grade by the NAAC, reflecting our commitment to quality education and continuous improvement.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#0a192f] mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Governance
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                The governance structure of Visakha Institute of Engineering & Technology's academic and administrative departments ensures transparency and excellence.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision Section with Block Image */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Image Placeholder */}
              <div className="w-full h-64 md:h-80 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center">
                <Eye className="w-24 h-24 text-slate-400" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-[#0a192f] mb-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Vision
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                {pageContent?.vision || 'Our vision is to be an exemplary institution that thrives on its commitment to the transformative power of value-based education, providing the impetus to develop the expansiveness to harmonize both scientific knowledge and spiritual understanding, to utilize knowledge for societal benefit and contribute to a prosperous and sustainable future for all.'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section with Block Images */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0a192f] mb-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Mission
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed max-w-4xl" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {pageContent?.mission || 'VIET\'s profound mission of providing education for life, and emphasis on excellence-driven research, has shaped VIET as a unique institution.'}
            </p>
          </motion.div>

          {/* Mission Subsections */}
          <div className="space-y-12">
            {/* Education for Life */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-semibold text-[#0a192f] mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Education for Life
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  There are two types of education: education for living and education for life. Studying to become a professional is education for a living, while education for life requires an understanding of the essential human values. At VIET, we believe that education should also impart a culture of the heart, based on enduring values and inner strength.
                </p>
                <p className="text-gray-700 leading-relaxed" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  VIET's culture of education helps to inculcate in our students the right ethos to be rooted in the values of excellence, integrity, and innovation. Endowed with qualities of acceptance, patience, self-confidence, perseverance, and enthusiasm, the benefit of humanity will become foremost in the students' thoughts, words and actions.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Image Placeholder */}
                <div className="w-full h-64 md:h-80 bg-gradient-to-br from-blue-200 to-blue-300 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-24 h-24 text-blue-400" />
                </div>
              </motion.div>
            </div>

            {/* Excellence Driven Research */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="md:order-2"
              >
                {/* Image Placeholder */}
                <div className="w-full h-64 md:h-80 bg-gradient-to-br from-purple-200 to-purple-300 rounded-lg flex items-center justify-center">
                  <Target className="w-24 h-24 text-purple-400" />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="md:order-1"
              >
                <h3 className="text-2xl font-semibold text-[#0a192f] mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Excellence Driven Research
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Our motivation to pursue research is focused on addressing major global problems related to technology, innovation, and sustainable development. We believe that if we could transform excellence from a mere word into a path of action, we would be able to address most of the world's challenges.
                </p>
                <p className="text-gray-700 leading-relaxed" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  If we take this step courageously, then our research and its outcome will have a special impact, spontaneity, and power. This has translated into many latest advancements and innovations that have culminated in greater societal benefit.
                </p>
              </motion.div>
            </div>

            {/* Global Impact */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-semibold text-[#0a192f] mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Global Impact
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  At VIET, we stand united in our mission towards solving globally recognized scientific and societal challenges, including environment, development, and technology. VIET stands at the strategic juncture of two streams of cultures: tradition and innovation.
                </p>
                <p className="text-gray-700 leading-relaxed" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  It is our vision to bring both cultures together to bridge the division through meaningful collaborations with world-class universities and innovative approaches that will benefit the entire planet.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Image Placeholder */}
                <div className="w-full h-64 md:h-80 bg-gradient-to-br from-green-200 to-green-300 rounded-lg flex items-center justify-center">
                  <Globe className="w-24 h-24 text-green-400" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* VIET at a Glance - Statistics */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
              <h2 className="text-3xl md:text-4xl font-semibold text-[#0a192f] mb-12 text-center" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Visakha Institute of Engineering & Technology at a Glance
              </h2>
              <div className="flex flex-wrap justify-center gap-16 md:gap-20 lg:gap-24 xl:gap-32">
                {stats.map((stat, index) => (
                  <AnimatedStat key={index} stat={stat} index={index} />
                ))}
              </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials/Quotes Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-8"
          >
            <div className="bg-white rounded-lg p-6 shadow-md">
              <blockquote className="text-gray-700 italic mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                "{pageContent?.quote?.text || 'Take up one idea, make that one idea your life. Think of it, dream of it, live on that idea. Let the brain, muscles, nerves, every part of your body be full of that idea, and just leave every other idea alone. This is the way to success.'}"
              </blockquote>
              <cite className="text-gray-600 font-semibold" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                — {pageContent?.quote?.author || 'Swami Vivekananda'}
              </cite>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <p className="text-gray-700 mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                VIET has established itself as a premier institution in the region, attracting students from across Andhra Pradesh and neighboring states. Our alumni have made significant contributions in various fields, working with leading multinational corporations, government organizations, and entrepreneurial ventures.
              </p>
              <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                The institution continues to evolve and adapt to the changing needs of the industry and society, regularly updating curriculum, enhancing facilities, and strengthening industry partnerships.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Find Us Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0a192f] mb-8" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Find Us
            </h2>
            <p className="text-gray-700 mb-8 max-w-3xl" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Accredited 'A' by NAAC, Visakha Institute of Engineering & Technology is a multidisciplinary research institution located in Visakhapatnam, Andhra Pradesh, India. The institution's campus is situated at Narava, Visakhapatnam.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-[#0a192f] mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Campus Location
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#0a192f] mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-700" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                        88th Division, Narava,<br />
                        GVMC, Visakhapatnam,<br />
                        Andhra Pradesh 530027,<br />
                        India
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#0a192f] mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-700" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                        +91-9959617476<br />
                        +91-9959617477<br />
                        +91-9550957054
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#0a192f] mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-700" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                        website@viet.edu.in<br />
                        vietvsp@gmail.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Map Placeholder */}
              <div className="bg-gray-200 rounded-lg h-64 md:h-80 flex items-center justify-center">
                <MapPin className="w-16 h-16 text-gray-400" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <ScrollProgressIndicator />
    </div>
  );
};

export default AboutUs;
