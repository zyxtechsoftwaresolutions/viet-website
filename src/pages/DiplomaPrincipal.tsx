import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import AlsoVisitLeaders from '@/components/AlsoVisitLeaders';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const DiplomaPrincipal = () => {
  const [pageContent, setPageContent] = useState<any>(null);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
        const response = await fetch(`${apiUrl}/pages/slug/diploma-principal`);
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

  const designation = pageContent?.profile?.designation || pageContent?.profile?.badge || 'Diploma Principal';
  const name = pageContent?.profile?.name || 'Mr. P. Prasad';
  const qualification = pageContent?.profile?.qualification || '';
  const introText =
    pageContent?.hero?.description ||
    'Leadership in diploma education and skill-based technical training.';
  const inspirationQuote = pageContent?.inspiration?.quote;
  const inspirationAuthor = pageContent?.inspiration?.author;
  const greetingsText = pageContent?.greetings?.text ?? 'Wish you all the best,';

  return (
    <div className="min-h-screen bg-slate-100 font-poppins">
      <LeaderPageNavbar backHref="/about" />

      <section className="relative text-white bg-[#1a1a1a]">
        <div className="md:hidden relative">
          <img
            src={profileImageSrc || '/chairmanedit.jpeg'}
            alt={name}
            className="w-full h-auto block"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-6 z-10">
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="inline-block px-3 py-1 text-xs font-bold tracking-[0.2em] text-white uppercase bg-white/20 backdrop-blur-sm border border-white/40 rounded-full">
                {designation}
              </p>
              <h1 className="text-2xl font-bold text-white leading-tight drop-shadow-sm">
                {name}
              </h1>
              {qualification && (
                <p className="text-base font-semibold text-white/95">{qualification}</p>
              )}
              <p className="text-sm text-white/90 leading-relaxed font-poppins">{introText}</p>
            </motion.div>
          </div>
        </div>
        <div
          className="hidden md:flex relative min-h-[90vh] pt-28 pb-16 items-center bg-cover bg-center bg-no-repeat"
          style={profileImageSrc ? { backgroundImage: `url(${profileImageSrc})` } : undefined}
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/75 from-40% via-black/50 to-transparent"
            aria-hidden
          />
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <div className="max-w-2xl">
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="inline-block px-4 py-1.5 text-base font-bold tracking-[0.2em] text-white uppercase bg-white/20 backdrop-blur-sm border border-white/40 rounded-full">
                  {designation}
                </p>
                <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-sm">
                  {name}
                </h1>
                {qualification && (
                  <p className="text-xl font-semibold text-white/95">{qualification}</p>
                )}
                <p className="text-lg text-white/90 leading-relaxed font-poppins max-w-xl">
                  {introText}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

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
              A message from the Diploma Principal
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-8 font-poppins leading-tight">
              Diploma Principal&apos;s Message
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
                    VIET Diploma College is committed to providing quality technical education through
                    SBTET-approved programmes that equip students with practical skills and industry-ready
                    knowledge. Our diploma programmes focus on hands-on learning, laboratory training, and
                    real-world application of engineering concepts.
                  </p>
                  <p>
                    With excellent infrastructure, experienced faculty, and strong industry connections,
                    we nurture young minds to become competent technicians and engineers who contribute
                    meaningfully to society and the nation&apos;s development.
                  </p>
                  <p className="text-slate-800 font-semibold">
                    Building skilled professionals for tomorrow!
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

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
              {inspirationQuote
                ? `"${inspirationQuote}"`
                : '"The best way to predict the future is to create it with skill, dedication, and hard work."'}
            </blockquote>
            <cite className="text-base md:text-lg text-slate-600 font-poppins not-italic">
              {inspirationAuthor ? `— ${inspirationAuthor}` : '— Dr. A.P.J. Abdul Kalam'}
            </cite>
          </motion.div>
        </div>
      </section>

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
            <p className="text-lg md:text-xl text-slate-700 font-poppins">{name}</p>
            <p className="text-base md:text-lg text-slate-600 font-poppins mt-2">{designation}</p>
          </motion.div>
        </div>
      </section>

      <AlsoVisitLeaders currentSlug="diploma-principal" />

      <Footer />
    </div>
  );
};

export default DiplomaPrincipal;
