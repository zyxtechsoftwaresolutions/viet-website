import { motion } from 'framer-motion';
import { Target, Eye, Award, Users, BookOpen, GraduationCap, Building2, Handshake, Star, TrendingUp, Shield } from 'lucide-react';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const VisionMission = () => {
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

  const goals = [
    {
      icon: Shield,
      title: "NBA Accreditation",
      description: "To seek NBA accreditation for four branches (CSE, ECE, EEE, MECH) by the year 2025",
      color: "from-emerald-500 to-teal-600",
      bgColor: "from-emerald-50 to-teal-50"
    },
    {
      icon: Building2,
      title: "R&D Centers",
      description: "To enhance our abilities establishing R&D centers in VIET campus for CSE, ECE and MECH by the year 2025",
      color: "from-slate-800 to-blue-950",
      bgColor: "from-slate-50 to-blue-100"
    },
    {
      icon: Handshake,
      title: "Permanent Affiliation",
      description: "To get permanent affiliation to our affiliating university",
      color: "from-purple-500 to-violet-600",
      bgColor: "from-purple-50 to-violet-50"
    },
    {
      icon: TrendingUp,
      title: "Government Collaboration",
      description: "To collaborate with government organizations to enhance the R&D",
      color: "from-slate-800 to-blue-950",
      bgColor: "from-slate-50 to-blue-100"
    },
    {
      icon: Star,
      title: "Center of Excellence",
      description: "To become center of excellence in technical education and research and to occupy a place among the most eminent institutions of the nation",
      color: "from-amber-500 to-yellow-600",
      bgColor: "from-amber-50 to-yellow-50"
    }
  ];

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
              Vision & Mission
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              Guiding principles that drive our commitment to excellence in technical education
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
        {/* Vision Section */}
        <motion.section variants={itemVariants} className="mb-16">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-100">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mr-6">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Vision</h2>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border-l-4 border-blue-500">
                <p className="text-lg text-slate-700 leading-relaxed text-justify">
                  To emerge as a <strong>"Centre for Excellence"</strong> offering Technical Education and Research opportunities of very high standards to students, develop the total personality of the individual, and instill high levels of discipline and strive to set global standards, making our students technologically superior and ethically strong, who in turn shall contribute to the advancement of society and humankind.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Mission Section */}
        <motion.section variants={itemVariants} className="mb-16">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-pink-100">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mr-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Mission</h2>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border-l-4 border-purple-500">
                <p className="text-lg text-slate-700 leading-relaxed text-justify">
                  To dedicate and commit ourselves to achieve, sustain and foster unmatched excellence in Technical Education. To this end, we will pursue continuous development of infrastructure and enhance state-of-the-art equipment to provide our students a technologically up-to-date and intellectually inspiring environment of learning, research, creativity, innovation and professional activity and inculcate in them ethical and moral values.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Goals Section */}
        <motion.section variants={itemVariants} className="mb-16">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                  Goals
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Strategic objectives that guide our path towards excellence
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {goals.map((goal, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -8 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className={`h-full shadow-lg hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br ${goal.bgColor} backdrop-blur-sm overflow-hidden relative`}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/10 to-transparent rounded-full translate-y-8 -translate-x-8"></div>
                      
                      <CardContent className="p-8 relative z-10">
                        <div className="text-center">
                          <div className={`w-20 h-20 bg-gradient-to-br ${goal.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300`}>
                            <goal.icon className="w-10 h-10 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-800 mb-4">
                            {goal.title}
                          </h3>
                          <p className="text-slate-600 leading-relaxed text-justify">
                            {goal.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Key Focus Areas */}
        <motion.section variants={itemVariants} className="mb-16">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-slate-800 to-blue-900 text-white">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Our Commitment
                </h2>
                <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                  Dedicated to fostering excellence in technical education and research
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-blue-200">Educational Excellence</h3>
                  <ul className="space-y-2 text-blue-100">
                    <li>• High standards of technical education</li>
                    <li>• State-of-the-art infrastructure</li>
                    <li>• Modern equipment and facilities</li>
                    <li>• Continuous curriculum development</li>
                    <li>• Research and innovation focus</li>
                  </ul>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-blue-200">Student Development</h3>
                  <ul className="space-y-2 text-blue-100">
                    <li>• Total personality development</li>
                    <li>• Ethical and moral values</li>
                    <li>• Technological superiority</li>
                    <li>• Professional skills enhancement</li>
                    <li>• Global standards preparation</li>
                  </ul>
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

export default VisionMission;
