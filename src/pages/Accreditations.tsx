import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, FileText, Download, ExternalLink, Shield, CheckCircle, Star, Building } from 'lucide-react';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { accreditationsAPI, type AccreditationItem } from '@/lib/api';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  AUTONOMOUS: Building,
  NAAC: Award,
  UGC: Shield,
  ISO: CheckCircle,
  AICTE: Star,
};

const Accreditations = () => {
  const [accreditations, setAccreditations] = useState<AccreditationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    accreditationsAPI.getAll().then(setAccreditations).catch(() => setAccreditations([])).finally(() => setLoading(false));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const getHref = (acc: AccreditationItem) => {
    if (acc.key === 'AICTE') return '/accreditation';
    if (acc.pdf_url) return acc.pdf_url;
    return '#';
  };

  const handleAccreditationClick = (acc: AccreditationItem) => {
    const href = getHref(acc);
    if (href === '#') return;
    if (href === '/accreditation') {
      window.location.href = href;
    } else {
      window.open(href, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <LeaderPageNavbar backHref="/about" />
      
      {/* Hero Section */}
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
                Accreditations
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-sm">
                Accreditations
              </h1>
              <p className="text-lg md:text-xl font-semibold text-white/95">
                Recognized Excellence in Technical Education
              </p>
              <p className="text-base md:text-lg text-white/90 leading-relaxed font-poppins max-w-xl">
                Recognized Excellence in Technical Education and Quality Assurance
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <motion.div
        className="container mx-auto px-4 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        {/* Accreditations Grid */}
        <motion.section variants={itemVariants} className="mb-16">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                  Certifications & Accreditations
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Recognized by leading educational and quality assurance bodies
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <div className="col-span-full text-center py-8 text-slate-500">Loading accreditations…</div>
                ) : (
                  accreditations.map((accreditation, index) => {
                    const IconComponent = ICON_MAP[accreditation.key] ?? Award;
                    const href = getHref(accreditation);
                    const isClickable = href !== '#';
                    return (
                      <motion.div
                        key={accreditation.key}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={isClickable ? { scale: 1.05, y: -5 } : {}}
                        className="group"
                      >
                        <Card 
                          className={`h-full shadow-lg transition-all duration-300 border-0 bg-gradient-to-br ${accreditation.color} text-white ${isClickable ? 'hover:shadow-2xl cursor-pointer' : ''}`}
                          onClick={() => isClickable && handleAccreditationClick(accreditation)}
                        >
                          <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-colors">
                              <img
                                src={accreditation.logo}
                                alt={accreditation.name}
                                className="w-12 h-12 object-contain"
                              />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{accreditation.name}</h3>
                            <p className="text-sm text-white/90 mb-4 leading-relaxed">
                              {accreditation.description}
                            </p>
                            <div className="flex justify-center space-x-2">
                              <div className="p-2 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                                <IconComponent className="w-5 h-5 text-white" />
                              </div>
                              <div className="p-2 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                                <ExternalLink className="w-5 h-5 text-white" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Accreditation Benefits */}
        <motion.section variants={itemVariants} className="mb-16">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-slate-800 to-blue-900 text-white">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Benefits of Our Accreditations
                </h2>
                <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
                  Our accreditations ensure quality education, industry recognition, and enhanced career opportunities for our students.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-200 mb-2">Quality Assurance</h3>
                  <p className="text-sm text-blue-100">Ensures high standards of technical education</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-200 mb-2">Industry Recognition</h3>
                  <p className="text-sm text-blue-100">Widely recognized by employers and industries</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-200 mb-2">Career Opportunities</h3>
                  <p className="text-sm text-blue-100">Enhanced job prospects and placements</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-200 mb-2">Academic Excellence</h3>
                  <p className="text-sm text-blue-100">Continuous improvement in curriculum and teaching</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Contact Information */}
        <motion.section variants={itemVariants}>
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                  For Accreditation Inquiries
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Contact us for any questions regarding our accreditations and certifications.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Contact Information</h3>
                    <ul className="space-y-3 text-slate-600">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span>Email: website@viet.edu.in</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span>Phone: 9959617476, 9959617477</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span>Address: 88th Division, Narava, GVMC, Visakhapatnam</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Verification</h3>
                    <ul className="space-y-3 text-slate-600">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span>Name: P Subba Raju</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span>Contact: 9959617477, 9959617476</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span>Email: vietvsp@gmail.com</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </motion.div>

      <Footer />
      <ScrollProgressIndicator />
    </div>
  );
};

export default Accreditations;
