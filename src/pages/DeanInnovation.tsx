import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';
import { pagesAPI } from '@/lib/api';
import AlsoVisitLeaders from '@/components/AlsoVisitLeaders';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const DeanInnovation = () => {
  const [pageContent, setPageContent] = useState<any>(null);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        const page = await pagesAPI.getBySlug('dean-innovation');
        setPageContent(page?.content || null);
      } catch (error) {
        console.error('Error fetching page content:', error);
        setPageContent(null);
      }
    };
    fetchPageContent();
  }, []);

  const profileImageRaw = pageContent?.profileImage || pageContent?.heroImage;
  const profileImageSrc = profileImageRaw
    ? profileImageRaw.startsWith('/')
      ? `${API_BASE_URL}${profileImageRaw}`
      : profileImageRaw.startsWith('http')
        ? profileImageRaw
        : `${API_BASE_URL}/${profileImageRaw}`
    : null;

  const designation = pageContent?.profile?.designation || 'Dean Innovation & Student Projects';
  const name = pageContent?.profile?.name || 'Dr. Ranga Rao Velamala';
  const qualification = pageContent?.profile?.qualification || 'Ph.D. (AU.), M.Tech. (IT.)';
  const introText = pageContent?.hero?.description || 'Driving innovation and fostering student creativity.';

  return (
    <div className="min-h-screen bg-slate-100">
      <LeaderPageNavbar backHref="/about" />

      {/* Hero Section — image as full background */}
      <section
        className="relative min-h-[85vh] md:min-h-[90vh] pt-24 md:pt-28 pb-12 md:pb-16 text-white flex items-center bg-[#5a5a5a] bg-cover bg-center bg-no-repeat"
        style={profileImageSrc ? { backgroundImage: `url(${profileImageSrc})` } : undefined}
      >
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
                {designation}
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-sm">
                {name}
              </h1>
              <p className="text-lg md:text-xl font-semibold text-white/95">
                {qualification}
              </p>
              <p className="text-base md:text-lg text-white/90 leading-relaxed font-poppins max-w-xl">
                {introText}
              </p>
              <a
                href="#message"
                className="inline-flex items-center px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
              >
                Read message
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dean's Message — classy editorial style */}
      <section id="message" className="py-20 md:py-28 bg-[#fafafa]">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-4 font-poppins">
              A message from the Dean (Innovation & Student Projects)
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-8 font-poppins leading-tight">
              Dean's Message
            </h2>
            <div className="h-px w-16 bg-slate-300 mb-10" aria-hidden />
            <div className="text-slate-600 font-poppins text-[1.0625rem] md:text-lg leading-[1.85]">
              {pageContent?.message ? (
                <div
                  dangerouslySetInnerHTML={{ __html: pageContent.message }}
                  className="message-content [&_p]:mb-6 [&_p:last-child]:mb-0 [&_strong]:text-slate-800 [&_strong]:font-semibold"
                />
              ) : (
                <>
                  <p>
                    As a Dean (Innovation & Student Projects), I'm delighted to welcome you all to our esteemed academic community. We're committed to provide a world-class education that equips with the technical skills, knowledge, and mind-set needed to excel in the field of engineering, Management and Computer applications.
                  </p>
                  <p>
                    VIET provides a perfect platform for achieving your goals whether you are passionate about innovative solutions, research or technical expertise. VIET fosters a culture of innovation and entrepreneurship, encouraging students to explore their creativity and develop innovative solutions to complex problems.
                  </p>
                  <p>
                    With access to ideas labs, entrepreneurship programs, and mentorship opportunities, VIET empowers you to turn your ideas into reality and become the future leaders.
                  </p>
                  <p className="text-slate-800 font-semibold">
                    Wishing you all success in future endeavors.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <AlsoVisitLeaders currentSlug="dean-innovation" />

      <Footer />
      <ScrollProgressIndicator />
    </div>
  );
};

export default DeanInnovation;
