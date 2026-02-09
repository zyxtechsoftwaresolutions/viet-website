import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, TrendingUp, Building2, Award, Users, DollarSign } from 'lucide-react';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Placements = () => {
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // Company logos from old website
  const companyLogos = [
    { name: 'Smart Brains', logo: '/RECRUITERS/smart-brains-img.png' },
    { name: 'HCL', logo: '/RECRUITERS/hcl-img.png' },
    { name: 'Byju\'s', logo: '/RECRUITERS/byjus-img.png' },
    { name: 'Novel Paints', logo: '/RECRUITERS/novel-img.png' },
    { name: 'Tech Mahindra', logo: '/RECRUITERS/Tech_Mahindra.png' },
    { name: 'TCS', logo: '/RECRUITERS/tcs.png' }
  ];

  // Duplicate the company logos array for seamless infinite scrolling
  const duplicatedCompanyLogos = [...companyLogos, ...companyLogos, ...companyLogos];

  // Auto-scroll animation
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    const scrollSpeed = 1.5; // pixels per frame

    const animate = () => {
      if (!isHovered && scrollContainer) {
        // Calculate maxScroll dynamically to handle resize/load changes
        const maxScroll = scrollContainer.scrollWidth / 3; // Divide by 3 because we tripled the content
        
        // Always read the current scroll position from the DOM (this ensures we continue from where we paused)
        let currentScroll = scrollContainer.scrollLeft;
        
        // Increment the scroll position
        currentScroll += scrollSpeed;
        
        // Reset to 0 when we reach the max (seamless loop)
        if (currentScroll >= maxScroll) {
          currentScroll = 0;
        }
        
        // Update the scroll position smoothly
        scrollContainer.scrollLeft = currentScroll;
      }
      animationId = requestAnimationFrame(animate);
    };

    // Small delay to ensure container is fully rendered
    const timeoutId = setTimeout(() => {
      animate();
    }, 100);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      clearTimeout(timeoutId);
    };
  }, [isHovered]);

  // Complete list of companies visited during 2024-2025
  const companies = [
    { sno: 1, name: 'Rinex Technologies', lpa: 10 },
    { sno: 2, name: 'Intellipaat Software Solutions Private Limited', lpa: 9 },
    { sno: 3, name: 'WPG holding Limited', lpa: 7.2 },
    { sno: 4, name: 'Ocean link sea services', lpa: 7 },
    { sno: 5, name: 'Infocepts Technologies', lpa: 7 },
    { sno: 6, name: 'Emipro Technologies Private Limited', lpa: 7 },
    { sno: 7, name: 'Keeves Technologies Private Limited', lpa: 6.4 },
    { sno: 8, name: 'TensorGo Software Private Limited', lpa: 6 },
    { sno: 9, name: 'Capsitech IT Services Private Ltd', lpa: 6 },
    { sno: 10, name: 'Nuvoco Vistas Corporation Limited', lpa: 6 },
    { sno: 11, name: 'Bavis Technologies Private Limited (BavisTech)', lpa: 6 },
    { sno: 12, name: 'MGH Infra', lpa: 5 },
    { sno: 13, name: 'Birla White, a unit of UltraTech Cement Limited', lpa: 5 },
    { sno: 14, name: '24/7 ai', lpa: 5 },
    { sno: 15, name: 'Gritty Tech', lpa: 5 },
    { sno: 16, name: 'Scope T&M Private Limited', lpa: 5 },
    { sno: 17, name: 'Sobha Projects & Trade Pvt. Ltd', lpa: 5 },
    { sno: 18, name: 'Manikaran Power Limited (MPL)', lpa: 4.5 },
    { sno: 19, name: 'Archelos', lpa: 4 },
    { sno: 20, name: 'Park Controls and Communications Private Limited (PCC)', lpa: 3.8 },
    { sno: 21, name: 'Ceyone Marketing Private Limited', lpa: 3.6 },
    { sno: 22, name: 'BSCPL Infrastructure Limited', lpa: 3.6 },
    { sno: 23, name: 'NISSI Engineering Solution Private Limited', lpa: 3.6 },
    { sno: 24, name: 'Control Print Limited', lpa: 3.5 },
    { sno: 25, name: 'Nicco Engineering Services Limited (NESL)', lpa: 3.3 },
    { sno: 26, name: 'Caliber', lpa: 3 },
    { sno: 27, name: 'Steel Strips & Wheels Ltd', lpa: 3 },
    { sno: 28, name: 'Development Bank (DBS) of Singapore Limited', lpa: 3 },
    { sno: 29, name: 'Renault Nissan', lpa: 3 },
    { sno: 30, name: 'Tilicho Labs', lpa: 3 },
    { sno: 31, name: 'Collebra technologies', lpa: 3 },
    { sno: 32, name: 'AXISCADES Technologies', lpa: 3 },
    { sno: 33, name: 'Schneider Electrics', lpa: 3 },
    { sno: 34, name: 'Breaks India (Diploma)', lpa: 2.9 },
    { sno: 35, name: 'Tech Vision', lpa: 2.8 },
    { sno: 36, name: 'Sutherland', lpa: 2.8 },
    { sno: 38, name: 'Siechem Technologies', lpa: 2.6 },
    { sno: 39, name: 'Wind care India Ltd', lpa: 2.5 },
    { sno: 40, name: 'Clari5', lpa: 2.5 },
    { sno: 41, name: 'Tech wizzen', lpa: 2.5 },
    { sno: 42, name: 'Daikin', lpa: 2.5 },
    { sno: 43, name: 'AXILE INDIA PVT LMT', lpa: 2.4 },
    { sno: 44, name: 'Tech sameen', lpa: 2.4 },
    { sno: 45, name: 'Synnnova Gears', lpa: 2.4 },
    { sno: 46, name: 'Yazaki India Private Limited', lpa: 2.4 },
    { sno: 47, name: 'Polman Instruments', lpa: 2.32 },
    { sno: 48, name: 'TVS SFL (Diploma)', lpa: 2.28 },
    { sno: 49, name: 'TVS SFL', lpa: 2.28 },
    { sno: 50, name: 'Roter Lehmann', lpa: 2.22 },
    { sno: 51, name: 'Yokohama Tyres', lpa: 2 },
    { sno: 52, name: 'Q spiders', lpa: 1.2, isStipend: true },
    { sno: 53, name: 'Kodnest', lpa: 1.2, isStipend: true }
  ];

  // Calculate statistics
  const highestPackage = Math.max(...companies.map(c => c.lpa));
  const averagePackage = companies.reduce((sum, c) => sum + c.lpa, 0) / companies.length;
  const totalCompanies = companies.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <LeaderPageNavbar backHref="/" />
      
      {/* Hero Section */}
      <section className="pt-56 pb-20 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Placements
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              Connecting Talent with Opportunity - Building Careers, One Placement at a Time
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
        {/* Statistics Cards */}
        <motion.section variants={itemVariants} className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6 text-center">
                <Building2 className="w-10 h-10 mx-auto mb-3" />
                <div className="text-3xl font-bold mb-2">{totalCompanies}+</div>
                <div className="text-blue-100">Companies Visited</div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-10 h-10 mx-auto mb-3" />
                <div className="text-3xl font-bold mb-2">₹{highestPackage}L</div>
                <div className="text-green-100">Highest Package</div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-10 h-10 mx-auto mb-3" />
                <div className="text-3xl font-bold mb-2">₹{averagePackage.toFixed(1)}L</div>
                <div className="text-purple-100">Average Package</div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6 text-center">
                <Users className="w-10 h-10 mx-auto mb-3" />
                <div className="text-3xl font-bold mb-2">95%</div>
                <div className="text-orange-100">Placement Rate</div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Company Logos Section with Auto-Scroll Animation */}
        <motion.section variants={itemVariants} className="mb-16">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8 text-center">
                Our Top Recruiters
              </h2>
              
              {/* Auto-scrolling container */}
              <div className="relative">
                <div
                  ref={scrollContainerRef}
                  className="flex gap-8 overflow-hidden [&::-webkit-scrollbar]:hidden"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {duplicatedCompanyLogos.map((company, index) => (
                    <motion.div
                      key={`${company.name}-${index}`}
                      className="flex-shrink-0 w-48 h-32 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center p-6 border border-gray-100 hover:border-blue-300"
                      whileHover={{ scale: 1.05, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="max-w-full max-h-20 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Gradient overlays for smooth edges */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-10"></div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Companies Table Section */}
        <motion.section variants={itemVariants} className="mb-16">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-center gap-3 mb-8">
                <Award className="w-8 h-8 text-blue-600" />
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                  List of Companies Visited during 2024-2025
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gradient-to-r from-slate-900 to-blue-900">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">
                            S.No
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                            Name of the Company
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                            LPA*
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {companies.map((company, index) => (
                          <motion.tr
                            key={company.sno}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.01 }}
                            className="hover:bg-blue-50 transition-colors duration-200"
                          >
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {company.sno}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                              {company.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">₹{company.lpa}L</span>
                                {company.isStipend && (
                                  <Badge variant="secondary" className="text-xs">
                                    Stipend
                                  </Badge>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-600">
                <p><strong>*LPA</strong> - Lakhs Per Annum</p>
                <p><strong>#</strong> - Stipend</p>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Placement Cell Information */}
        <motion.section variants={itemVariants}>
          <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="w-8 h-8 text-blue-600" />
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                  Placement Cell
                </h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Our dedicated Placement Cell works tirelessly to bridge the gap between our talented students and leading 
                industry partners. We facilitate campus recruitment drives, industry interactions, and career development 
                programs to ensure our graduates are well-prepared for their professional journey.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Our Mission</h3>
                  <p className="text-gray-700">
                    To provide 100% placement assistance to all eligible students by connecting them with the best 
                    opportunities in the industry.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Our Approach</h3>
                  <p className="text-gray-700">
                    We maintain strong relationships with leading companies across various sectors and organize regular 
                    campus recruitment drives throughout the academic year.
                  </p>
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

export default Placements;

