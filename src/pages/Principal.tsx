import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';
import { pagesAPI } from '@/lib/api';
import AlsoVisitLeaders from '@/components/AlsoVisitLeaders';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const Principal = () => {
  const [pageContent, setPageContent] = useState<any>(null);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        // Fetch without auth token for public pages
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
        const response = await fetch(`${API_BASE_URL}/pages/slug/principal`);
        if (response.ok) {
          const page = await response.json();
          setPageContent(page?.content || null);
        } else {
          console.error('Error fetching page content:', response.status);
          setPageContent(null);
        }
      } catch (error) {
        console.error('Error fetching page content:', error);
        setPageContent(null);
      }
    };
    fetchPageContent();
  }, []);

  // Prefer heroImage (set by admin) over profileImage; filter out empty strings
  const profileImageRaw =
    (pageContent?.heroImage && String(pageContent.heroImage).trim()) ||
    (pageContent?.profileImage && String(pageContent.profileImage).trim()) ||
    null;
  let profileImageSrc: string | null = null;
  if (profileImageRaw) {
    if (profileImageRaw.startsWith('http')) {
      profileImageSrc = profileImageRaw;
    } else {
      const baseUrl = (API_BASE_URL || 'http://localhost:3001').replace(/\/api\/?$/, '');
      const cleanPath = profileImageRaw.startsWith('/') ? profileImageRaw : `/${profileImageRaw}`;
      profileImageSrc = `${baseUrl}${cleanPath}`;
    }
  }

  const designation = pageContent?.profile?.designation || pageContent?.profile?.badge || 'Principal';
  const name = pageContent?.profile?.name || 'Prof. G Vidya Pradeep Varma';
  const qualification = pageContent?.profile?.qualification || 'M.Tech, Ph.D';
  const introText = pageContent?.hero?.description || 'Leadership in academic excellence and institutional development.';
  const buttonText = pageContent?.hero?.buttonText || 'Read message';
  const inspirationQuote = pageContent?.inspiration?.quote;
  const inspirationAuthor = pageContent?.inspiration?.author;
  const greetingsText = pageContent?.greetings?.text ?? 'Wish you all the best,';

  return (
    <div className="min-h-screen bg-slate-100">
      <LeaderPageNavbar backHref="/about" />

      {/* Hero Section — principal image as full background */}
      <section
        className="relative min-h-[85vh] md:min-h-[90vh] pt-24 md:pt-28 pb-12 md:pb-16 text-white flex items-center bg-[#5a5a5a] bg-cover bg-center bg-no-repeat"
        style={profileImageSrc ? { backgroundImage: `url(${profileImageSrc})` } : undefined}
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
                {buttonText}
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Principal's Message — classy editorial style */}
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
              A message from the Principal
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-8 font-poppins leading-tight">
              Principal's Message
            </h2>
            <div className="h-px w-16 bg-slate-300 mb-10" aria-hidden />
            <div className="text-slate-600 font-poppins text-[1.0625rem] md:text-lg leading-[1.85] text-justify">
              {pageContent?.message ? (
                <div
                  dangerouslySetInnerHTML={{ __html: pageContent.message }}
                  className="message-content [&_p]:mb-6 [&_p:last-child]:mb-0 [&_strong]:text-slate-800 [&_strong]:font-semibold"
                />
              ) : (
                <>
                  <p>
                    VIET is most admired institution for pursuing technical education. The institution aims to provide support to faculty and students to attain the knowledge as well as the skills that they aspire for. The institution also aims at a good governance framework towards improving quality of technical education.
                  </p>
                  <p>
                    Our Institute is located on sprawling area 15 acres campus in the West side of city. Nearby several industries and Visakhapatnam Export Processing Zone (VEPZ), The College has excellent infrastructure, imposing buildings with spacious class rooms, and Laboratories with state of the art technology.
                  </p>
                  <p>
                    VIET is established in the year 2008. VIET has 1400+ students in diploma in Engineering, 2900+ students in undergraduate and 600+ students in PG. VIET emphasizes on enhancement of Postgraduate education and Research apart from Outcome Based Education (OBE) for undergraduate programs.
                  </p>
                  <p className="text-slate-800 font-semibold">
                    Looking at a future with excellence!
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Inspiration — different quote from Chairman page */}
      <section className="py-20 md:py-28 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-block px-6 py-2 mb-6 text-xs md:text-sm font-semibold tracking-[0.2em] text-slate-500 uppercase border border-slate-300 rounded-full">
              Inspiration
            </div>
            <blockquote className="text-xl md:text-2xl lg:text-3xl font-medium italic text-slate-800 leading-relaxed mb-6 font-poppins max-w-3xl mx-auto">
              {inspirationQuote ? `"${inspirationQuote}"` : '"The purpose of education is to make good human beings with skill and expertise. Enlightened human beings can be created by teachers."'}
            </blockquote>
            <cite className="text-base md:text-lg text-slate-600 font-poppins not-italic">
              {inspirationAuthor ? `— ${inspirationAuthor}` : '— Dr. A.P.J. Abdul Kalam'}
            </cite>
          </motion.div>
        </div>
      </section>

      {/* Closing Message — Wish you all the best */}
      <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-xl md:text-2xl font-semibold text-slate-800 mb-4 font-poppins">
              {greetingsText}
            </p>
            <p className="text-lg md:text-xl text-slate-700 font-poppins">
              {name}
            </p>
            <p className="text-base md:text-lg text-slate-600 font-poppins mt-2">
              {designation}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Also Visit */}
      <AlsoVisitLeaders currentSlug="principal" />

      <Footer />
      <ScrollProgressIndicator />
    </div>
  );
};

export default Principal;
