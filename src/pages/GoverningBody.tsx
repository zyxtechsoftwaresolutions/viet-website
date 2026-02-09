import { motion } from 'framer-motion';
import { Users, UserCheck, Award, Building2, GraduationCap, Shield, BookOpen } from 'lucide-react';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const GoverningBody = () => {
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

  const governingBodyMembers = [
    {
      id: 1,
      name: "Sri. G. Satyanarayana",
      designation: "Chairman, VLNSET",
      role: "Chairperson",
      icon: Award,
      color: "from-blue-500 to-purple-600",
      bgColor: "from-blue-50 to-purple-50"
    },
    {
      id: 2,
      name: "Sri P. Subbaraju",
      designation: "Vice - Chairman, VLNSET",
      role: "Member",
      icon: UserCheck,
      color: "from-green-500 to-teal-600",
      bgColor: "from-green-50 to-teal-50"
    },
    {
      id: 3,
      name: "Sri. B. Bhaskar Rao",
      designation: "Director, VLNSET",
      role: "Member",
      icon: Building2,
      color: "from-purple-500 to-violet-600",
      bgColor: "from-purple-50 to-violet-50"
    },
    {
      id: 4,
      name: "Dr. G.V. Pradeep Varma",
      designation: "Principal, VIET",
      role: "Member",
      icon: GraduationCap,
      color: "from-slate-800 to-blue-950",
      bgColor: "from-slate-50 to-blue-100"
    },
    {
      id: 5,
      name: "Dr. G. J. Nagaraju",
      designation: "Asst. Prof of Physics and HOD, CEV-JNTUGV",
      role: "Member (University Nominee)",
      icon: BookOpen,
      color: "from-indigo-500 to-blue-600",
      bgColor: "from-indigo-50 to-blue-50"
    },
    {
      id: 6,
      name: "Dr.K V Ramana",
      designation: "Principal,GICE-SBTET",
      role: "Member (SBTET Nominee)",
      icon: Shield,
      color: "from-emerald-500 to-green-600",
      bgColor: "from-emerald-50 to-green-50"
    },
    {
      id: 7,
      name: "Dr.K Satyanarayana",
      designation: "Guest Lecturers in law colleges,Practicing as advocate, Addl. SP (RTD)",
      role: "Special Invitee",
      icon: Users,
      color: "from-amber-500 to-yellow-600",
      bgColor: "from-amber-50 to-yellow-50"
    },
    {
      id: 8,
      name: "Dr. K Venkata Krishna Rao",
      designation: "Asst Prof, Dept of CSE, NIT Warangal",
      role: "Special Invitee",
      icon: Users,
      color: "from-rose-500 to-pink-600",
      bgColor: "from-rose-50 to-pink-50"
    },
    {
      id: 9,
      name: "Dr.D. Santha Rao",
      designation: "Dean Academics - VIET",
      role: "Member",
      icon: GraduationCap,
      color: "from-cyan-500 to-blue-600",
      bgColor: "from-cyan-50 to-blue-50"
    },
    {
      id: 10,
      name: "Varma Dendukuri",
      designation: "DEAN CDC",
      role: "Member",
      icon: Building2,
      color: "from-lime-500 to-green-600",
      bgColor: "from-lime-50 to-green-50"
    },
    {
      id: 11,
      name: "Dr T. Satyanarayana",
      designation: "Dean R & D, VIET",
      role: "Member",
      icon: BookOpen,
      color: "from-violet-500 to-purple-600",
      bgColor: "from-violet-50 to-purple-50"
    },
    {
      id: 12,
      name: "Dr A S C Tejaswini Kone",
      designation: "HoD CSE, VIET",
      role: "Member",
      icon: Shield,
      color: "from-sky-500 to-cyan-600",
      bgColor: "from-sky-50 to-cyan-50"
    },
    {
      id: 13,
      name: "Sri. B. Jeevan Rao (Ph.D)",
      designation: "HoD ECE, Vice-Principal, VIET",
      role: "Member",
      icon: UserCheck,
      color: "from-fuchsia-500 to-pink-600",
      bgColor: "from-fuchsia-50 to-pink-50"
    },
    {
      id: 14,
      name: "Sri. P. Prasada Rao (Ph.D)",
      designation: "Principal, Polytechnic-VIET",
      role: "Member",
      icon: Award,
      color: "from-emerald-500 to-teal-600",
      bgColor: "from-emerald-50 to-teal-50"
    },
    {
      id: 15,
      name: "Sri. CH.B.R.Srikanth (Ph.D)",
      designation: "IQAC Co-Ordinator",
      role: "Member",
      icon: BookOpen,
      color: "from-orange-500 to-amber-600",
      bgColor: "from-orange-50 to-amber-50"
    }
  ];

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
                Governing Body
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-sm">
                Governing Body
              </h1>
              <p className="text-lg md:text-xl font-semibold text-white/95">
                Leadership and Governance Structure
              </p>
              <p className="text-base md:text-lg text-white/90 leading-relaxed font-poppins max-w-xl">
                Leadership and governance structure of Visakha Institute of Engineering & Technology
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
        {/* Governing Body Introduction */}
        <motion.section variants={itemVariants} className="mb-16">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                  Governing Body Members
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  The governing body consists of distinguished members from academia, industry, and administration who guide the strategic direction and governance of VIET.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Governing Body Members Table */}
        <motion.section variants={itemVariants} className="mb-16">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-800 to-blue-900 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                        S.No
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                        Designation
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {governingBodyMembers.map((member, index) => (
                      <motion.tr
                        key={member.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ 
                          backgroundColor: 'rgba(59, 130, 246, 0.05)',
                          transition: { duration: 0.2 }
                        }}
                        className="hover:bg-blue-50/50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 bg-gradient-to-br ${member.color} rounded-full flex items-center justify-center mr-3`}>
                              <span className="text-white text-xs font-bold">{member.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                          {member.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {member.designation}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge 
                            variant="secondary" 
                            className={`text-xs px-3 py-1 ${
                              member.role.includes('Chairperson') 
                                ? 'bg-blue-100 text-blue-800 border-blue-200' 
                                : member.role.includes('Special Invitee')
                                ? 'bg-purple-100 text-purple-800 border-purple-200'
                                : member.role.includes('Nominee')
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : 'bg-gray-100 text-gray-800 border-gray-200'
                            }`}
                          >
                            {member.role}
                          </Badge>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Governing Body Structure */}
        <motion.section variants={itemVariants} className="mb-16">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-slate-800 to-blue-900 text-white">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Governing Body Structure
                </h2>
                <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
                  The governing body is composed of members representing various stakeholders including management, academia, university nominees, and special invitees from industry and legal fields.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-200 mb-2">Chairperson</h3>
                  <p className="text-sm text-blue-100">1 Member</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserCheck className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-200 mb-2">Members</h3>
                  <p className="text-sm text-blue-100">9 Members</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-200 mb-2">Nominees</h3>
                  <p className="text-sm text-blue-100">2 Members</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-200 mb-2">Special Invitees</h3>
                  <p className="text-sm text-blue-100">2 Members</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Key Responsibilities */}
        <motion.section variants={itemVariants}>
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                  Key Responsibilities
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  The governing body plays a crucial role in the strategic direction and governance of the institution
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Strategic Governance</h3>
                  <ul className="space-y-3 text-slate-600">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Policy formulation and strategic planning</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Academic and administrative oversight</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Financial management and resource allocation</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Quality assurance and accreditation</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Institutional Development</h3>
                  <ul className="space-y-3 text-slate-600">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Infrastructure development and expansion</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Faculty recruitment and development</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Industry partnerships and collaborations</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Research and innovation initiatives</span>
                    </li>
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

export default GoverningBody;
