import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';
import { pagesAPI } from '@/lib/api';
import AlsoVisitLeaders from '@/components/AlsoVisitLeaders';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const Chairman = () => {
  const [pageContent, setPageContent] = useState<any>(null);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        const page = await pagesAPI.getBySlug('chairman');
        setPageContent(page?.content || null);
      } catch (error) {
        console.error('Error fetching page content:', error);
        setPageContent(null);
      }
    };
    fetchPageContent();
  }, []);

  const designation = pageContent?.profile?.designation || pageContent?.profile?.badge || 'Chairman';
  const name = pageContent?.profile?.name || 'Sri G. Satyanarayana Garu';
  const qualification = pageContent?.profile?.qualification || 'M.Tech, MBA';
  const introText = pageContent?.hero?.description || 'Leadership that drives excellence in technical education.';
  const buttonText = pageContent?.hero?.buttonText || 'Read message';
  const inspirationQuote = pageContent?.inspiration?.quote;
  const inspirationAuthor = pageContent?.inspiration?.author;
  const greetingsText = pageContent?.greetings?.text ?? 'Wish you all the best,';

  // Prefer heroImage (set by admin) over profileImage; filter out empty strings
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

      {/* Hero Section — uses heroImage from admin or fallback */}
      <section
        className="relative min-h-[85vh] md:min-h-[90vh] pt-24 md:pt-28 pb-12 md:pb-16 text-white flex items-center bg-[#5a5a5a] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImageUrl})` }}
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

      {/* Chairman's Message — classy editorial style */}
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
              A message from the Chairman
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-8 font-poppins leading-tight">
              Chairman's Message
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
                    I delightfully welcome you to <strong>Varaha Lakshmi Narasimha Swamy Educational Trust Group of Institutions</strong>, Narava, Visakhapatnam, Andhra Pradesh, India. It is my vision to provide the nation with motivated, responsible and disciplined youth to form a better future. Education is the most powerful weapon which you can use to change the world by creating aspiring professionals with holistic development to contribute to the development of our country. Our experienced and dedicated faculty nurtures and ignites the young minds through strong academics, co-curricular and extra-curricular activities.
                  </p>
                  <p>
                    Globalization and fast changing technologies integrated with modern managerial procedures have added new dimension to the method and scope of professional and technical learning. We expertise our students to master the skills required to become successful professionals and also with the nature of adaptability, flexibility and a high Emotional Quotient such that they can cope and triumph over the turbulent business environments. It is commendable that our institute has modern infrastructure to make it possible for students to update their knowledge and maintaining a balance between modern trends in education and the enduring values of our nation.
                  </p>
                  <p>
                    <strong>VLNS Group of Institutions</strong> has emerged as a proficient modern technical group of educational Institutions in this region of Andhra Pradesh, India by providing quality and meaningful education. Our aim is to make VLNS Group of institution, Visakhapatnam to be named among the top institutions in India. I request all the stakeholders to be part of this journey and to strengthen our resolution to make this institution a preferred global destination for Higher Education.
                  </p>
                  <p>
                    With a sense of pride, I extend a warm invitation to the highly talented generation of today to become a part of the enthusiastic, sincere, knowledgeable and vigorous <strong>VNLS family</strong>.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Swami Vivekananda Quote Section */}
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
              {inspirationQuote ? `"${inspirationQuote}"` : '"Education is the manifestation of the perfection already in man. The ideal of all education, all training, should be this man-making."'}
            </blockquote>
            <cite className="text-base md:text-lg text-slate-600 font-poppins not-italic">
              {inspirationAuthor ? `— ${inspirationAuthor}` : '— Swami Vivekananda'}
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

      <AlsoVisitLeaders currentSlug="chairman" />

      <Footer />
      <ScrollProgressIndicator />
    </div>
  );
};

export default Chairman;
