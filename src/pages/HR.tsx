import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';
import { pagesAPI } from '@/lib/api';
import AlsoVisitLeaders from '@/components/AlsoVisitLeaders';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const HR = () => {
  const [pageContent, setPageContent] = useState<any>(null);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        const page = await pagesAPI.getBySlug('hr');
        setPageContent(page?.content || null);
      } catch (error) {
        console.error('Error fetching page content:', error);
        setPageContent(null);
      }
    };
    fetchPageContent();
  }, []);

  const designation = pageContent?.profile?.designation || pageContent?.profile?.badge || 'HR';
  const name = pageContent?.profile?.name || 'HR';
  const qualification = pageContent?.profile?.qualification || '';
  const introText = pageContent?.hero?.description || 'Human Resources at VIET — nurturing talent and building a thriving institutional culture.';
  const buttonText = pageContent?.hero?.buttonText || 'Read message';
  const inspirationQuote = pageContent?.inspiration?.quote;
  const inspirationAuthor = pageContent?.inspiration?.author;
  const greetingsText = pageContent?.greetings?.text ?? 'Wish you all the best,';

  const profileImageRaw =
    (pageContent?.heroImage && String(pageContent.heroImage).trim()) ||
    (pageContent?.profileImage && String(pageContent.profileImage).trim()) ||
    null;
  let heroImageUrl: string | null = null;
  if (profileImageRaw) {
    heroImageUrl = profileImageRaw.startsWith('http')
      ? profileImageRaw
      : `${(API_BASE_URL || 'http://localhost:3001').replace(/\/api\/?$/, '')}${profileImageRaw.startsWith('/') ? profileImageRaw : `/${profileImageRaw}`}`;
  }
  if (!heroImageUrl) heroImageUrl = '/chairmanedit.jpeg';

  return (
    <div className="min-h-screen bg-slate-100">
      <LeaderPageNavbar backHref="/about" />

      {/* Hero Section */}
      <section
        className="relative min-h-[85vh] md:min-h-[90vh] pt-24 md:pt-28 pb-12 md:pb-16 text-white flex items-center bg-[#5a5a5a] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImageUrl})` }}
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
              {qualification && (
                <p className="text-lg md:text-xl font-semibold text-white/95">
                  {qualification}
                </p>
              )}
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

      {/* HR Message */}
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
              A message from HR
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-8 font-poppins leading-tight">
              HR Message
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
                    Welcome to the <strong>Human Resources</strong> section of Visakha Institute of Engineering & Technology (VIET). Our HR team is dedicated to fostering a supportive and inclusive environment for all faculty and staff, ensuring that every member of the VIET family can thrive and contribute to our mission of excellence in technical education.
                  </p>
                  <p>
                    We focus on talent development, employee well-being, and building a culture of collaboration and growth. Through structured policies, training programs, and open communication, we aim to make VIET not just a place of work, but a community where everyone can achieve their best.
                  </p>
                  <p>
                    For any HR-related queries, policies, or support, please feel free to reach out to the HR department. We are here to help.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Inspiration Quote Section */}
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
              {inspirationQuote ? `"${inspirationQuote}"` : '"People are your most important asset. Invest in them."'}
            </blockquote>
            <cite className="text-base md:text-lg text-slate-600 font-poppins not-italic">
              {inspirationAuthor ? `— ${inspirationAuthor}` : '— Anonymous'}
            </cite>
          </motion.div>
        </div>
      </section>

      {/* Closing Message */}
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

      <AlsoVisitLeaders currentSlug="hr" />

      <Footer />
      <ScrollProgressIndicator />
    </div>
  );
};

export default HR;
