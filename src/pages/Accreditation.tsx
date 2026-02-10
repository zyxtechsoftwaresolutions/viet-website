import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, FileText, Calendar, Download, ExternalLink, Shield, CheckCircle, Star } from 'lucide-react';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { aicteAffiliationLettersAPI, type AicteLetter } from '@/lib/api';

const Accreditation = () => {
  const [letters, setLetters] = useState<AicteLetter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    aicteAffiliationLettersAPI.getAll().then(setLetters).catch(() => setLetters([])).finally(() => setLoading(false));
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

  const handleLetterClick = (letter: AicteLetter) => {
    if (letter.pdf_url) window.open(letter.pdf_url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <LeaderPageNavbar backHref="/about" />
      
      {/* Hero Section */}
      <section className="pt-56 pb-20 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Accreditation
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              AICTE Year-wise Affiliation Details and Certifications
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <motion.div
        className="container mx-auto px-4 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Accreditation Overview */}
        <motion.section variants={itemVariants} className="mb-16">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                  AICTE Year-wise Affiliation Details
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Visakha Institute of Engineering & Technology has been consistently affiliated with AICTE since 2008, maintaining the highest standards of technical education.
                </p>
              </div>

              {/* Key Statistics */}
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">18 Years</h3>
                  <p className="text-slate-600">Continuous AICTE Affiliation</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">100%</h3>
                  <p className="text-slate-600">Compliance Rate</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Current</h3>
                  <p className="text-slate-600">2025-26 Affiliation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Year-wise Affiliation Documents */}
        <motion.section variants={itemVariants} className="mb-16">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                  Year-wise AICTE Affiliation Letters
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Access the complete collection of AICTE affiliation documents from 2008-09 to 2025-26
                </p>
              </div>

              {/* Affiliation Years Grid: latest = green, others = blue */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {loading ? (
                  <div className="col-span-full text-center py-8 text-slate-500">Loading affiliation letters…</div>
                ) : letters.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-slate-500">No year-wise letters added yet.</div>
                ) : (
                  letters.map((letter, index) => {
                    const isLatest = letter.is_latest;
                    const colorClass = isLatest ? 'from-green-500 to-emerald-600' : 'from-blue-500 to-indigo-600';
                    const isClickable = !!letter.pdf_url;
                    return (
                      <motion.div
                        key={letter.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={isClickable ? { scale: 1.05, y: -5 } : {}}
                        className="group"
                      >
                        <Card
                          className={`h-full shadow-lg transition-all duration-300 border-0 bg-gradient-to-br ${colorClass} text-white ${isClickable ? 'hover:shadow-2xl cursor-pointer' : ''}`}
                          onClick={() => isClickable && handleLetterClick(letter)}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-white/30 transition-colors">
                              <FileText className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">{letter.year}</h3>
                            <Badge
                              variant="secondary"
                              className={`text-xs px-2 py-1 ${isLatest ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
                            >
                              {isLatest ? 'Current' : 'Active'}
                            </Badge>
                            <div className="mt-3 flex justify-center space-x-2">
                              <div className="p-1 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                                <Download className="w-4 h-4 text-white" />
                              </div>
                              <div className="p-1 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                                <ExternalLink className="w-4 h-4 text-white" />
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
                  Benefits of AICTE Accreditation
                </h2>
                <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
                  AICTE accreditation ensures quality education, industry recognition, and enhanced career opportunities for our students.
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
                  Contact us for any questions regarding our AICTE accreditation and affiliation status.
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

export default Accreditation;






















