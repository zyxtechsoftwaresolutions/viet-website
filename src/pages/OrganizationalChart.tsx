import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Building2, UserCheck, Award, BookOpen, Target } from 'lucide-react';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { pagesAPI } from '@/lib/api';
import { imgUrl } from '@/lib/imageUtils';
import {
  DEFAULT_ORGANIZATIONAL_CHART_CONTENT,
  DEFAULT_ORG_CHART_IMAGE,
  normalizeOrganizationalChartContent,
} from '@/lib/organizationalChartContent';

const OrganizationalChart = () => {
  const [content, setContent] = useState(DEFAULT_ORGANIZATIONAL_CHART_CONTENT);

  useEffect(() => {
    const load = async () => {
      try {
        const page = await pagesAPI.getBySlug('organizational-chart');
        setContent(normalizeOrganizationalChartContent(page?.content || null));
      } catch {
        setContent(DEFAULT_ORGANIZATIONAL_CHART_CONTENT);
      }
    };
    load();
  }, []);

  const heroImage = content.hero.heroImage
    ? imgUrl(content.hero.heroImage)
    : '/campus-hero.jpg';
  const chartImage = content.chartImage
    ? imgUrl(content.chartImage)
    : DEFAULT_ORG_CHART_IMAGE;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <LeaderPageNavbar backHref="/about" />

      <section
        className="relative min-h-[55vh] md:min-h-[90vh] pt-20 md:pt-28 pb-10 md:pb-16 text-white flex items-center bg-[#5a5a5a] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
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
                {content.hero.badge || 'Organizational Chart'}
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-sm">
                {content.hero.title}
              </h1>
              <p className="text-lg md:text-xl font-semibold text-white/95">Structure and Hierarchy</p>
              <p className="text-base md:text-lg text-white/90 leading-relaxed max-w-xl">
                {content.hero.description}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <motion.div
        className="container mx-auto px-4 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.section variants={itemVariants} className="mb-16">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                  Organizational Chart
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  The organizational structure and administrative hierarchy of VIET
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-8 border border-slate-200">
                <div className="text-center">
                  <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 inline-block max-w-full">
                    <img
                      src={chartImage}
                      alt={content.chartAlt}
                      className="max-w-full h-auto rounded-lg shadow-md"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section variants={itemVariants} className="mb-16">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserCheck className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                  Key Leadership Positions
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Administrative and academic leadership structure
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-slate-50 to-blue-100">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">Chairman</h3>
                      <p className="text-slate-600">Sri G. Satyanarayana Garu</p>
                      <p className="text-sm text-slate-500">M.Tech, MBA</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-100">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">Principal</h3>
                      <p className="text-slate-600">Prof. G Vidya Pradeep Varma</p>
                      <p className="text-sm text-slate-500">M.Tech, Ph.D</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-violet-100">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Target className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">Dean Academics</h3>
                      <p className="text-slate-600">Dr. D. Santha Rao</p>
                      <p className="text-sm text-slate-500">Ph.D. (AU.), M.E. (NIT Tiruchirapalli)</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-slate-50 to-blue-100">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-blue-950 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">Dean Innovation</h3>
                      <p className="text-slate-600">Dr. Ranga Rao Velamala</p>
                      <p className="text-sm text-slate-500">Ph.D. (AU.), M.Tech. (IT.)</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section variants={itemVariants}>
          <Card className="shadow-xl border-0 bg-gradient-to-br from-slate-800 to-blue-900 text-white">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Administrative Structure</h2>
                <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
                  The organizational chart reflects the hierarchical structure and reporting
                  relationships within Visakha Institute of Engineering & Technology, ensuring
                  effective governance and academic excellence.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-blue-200 mb-4">Governance Structure</h3>
                    <ul className="space-y-2 text-blue-100">
                      <li>• Governing Body</li>
                      <li>• Academic Council</li>
                      <li>• Board of Studies</li>
                      <li>• Finance Committee</li>
                      <li>• Planning & Development Committee</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-200 mb-4">Administrative Departments</h3>
                    <ul className="space-y-2 text-blue-100">
                      <li>• Academic Affairs</li>
                      <li>• Student Affairs</li>
                      <li>• Examination Cell</li>
                      <li>• Placement Cell</li>
                      <li>• Research & Development</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </motion.div>

      <Footer />
    </div>
  );
};

export default OrganizationalChart;
