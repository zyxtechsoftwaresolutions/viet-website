import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Construction, Home } from 'lucide-react';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';

type ComingSoonPageProps = {
  title: string;
};

const ComingSoonPage = ({ title }: ComingSoonPageProps) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <LeaderPageNavbar backHref="/" />

      <section className="py-20 md:py-28 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <p className="text-7xl md:text-8xl font-bold text-slate-200 select-none" aria-hidden>
              404
            </p>
            <div className="flex justify-center mb-6 -mt-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center">
                <Construction className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-3">
              {title}
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-4">
              Coming Soon
            </h1>
            <div className="h-px w-16 bg-indigo-400 mx-auto mb-6" aria-hidden />
            <p className="text-slate-600 text-[1.0625rem] md:text-lg leading-relaxed mb-10">
              We&apos;re working on this page. Please check back soon — content for{' '}
              <span className="font-medium text-slate-800">{title}</span> will be available here.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg"
            >
              <Home className="h-5 w-5" />
              Back to Home
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ComingSoonPage;
