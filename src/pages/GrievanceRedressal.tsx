import { motion } from 'framer-motion';
import { Shield, Users, AlertTriangle, Heart, UserCheck, BookOpen, Building2, GraduationCap, Target } from 'lucide-react';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const GrievanceRedressal = () => {
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

  const antiRaggingMembers = [
    {
      id: 1,
      name: "Dr.G Vidya Pradeep Varma",
      department: "PRINCIPAL",
      designation: "Chair Person",
      icon: GraduationCap,
      color: "from-blue-500 to-purple-600"
    },
    {
      id: 2,
      name: "Dr K.Dayana",
      department: "MECH",
      designation: "Members",
      icon: UserCheck,
      color: "from-green-500 to-teal-600"
    },
    {
      id: 3,
      name: "Ch.Veeru Naidu",
      department: "NSS",
      designation: "Members",
      icon: Users,
      color: "from-purple-500 to-violet-600"
    },
    {
      id: 4,
      name: "Mr. P.Prasad",
      department: "Principal Diploma College",
      designation: "Members",
      icon: Building2,
      color: "from-slate-800 to-blue-950"
    },
    {
      id: 5,
      name: "K.Rama Krishna",
      department: "LIBRARIAN",
      designation: "Members",
      icon: BookOpen,
      color: "from-indigo-500 to-blue-600"
    },
    {
      id: 6,
      name: "P.Sai Prasana",
      department: "LIBRARIAN",
      designation: "Members",
      icon: BookOpen,
      color: "from-emerald-500 to-green-600"
    },
    {
      id: 7,
      name: "S.Kusaraju",
      department: "PHYSICAL DIRECTOR",
      designation: "Members",
      icon: Shield,
      color: "from-amber-500 to-yellow-600"
    },
    {
      id: 8,
      name: "K.Chandana",
      department: "MECH",
      designation: "Members",
      icon: UserCheck,
      color: "from-rose-500 to-pink-600"
    },
    {
      id: 9,
      name: "P.Ramesh",
      department: "BOYS HOSTEL WARDEN",
      designation: "Boys Hostel warden",
      icon: Building2,
      color: "from-cyan-500 to-blue-600"
    },
    {
      id: 10,
      name: "Prasanna Lakshmi",
      department: "GIRLS HOSTEL WARDEN",
      designation: "Girls Hostel Warden",
      icon: Building2,
      color: "from-lime-500 to-green-600"
    }
  ];

  const womenGrievanceMembers = [
    {
      id: 1,
      name: "Dr.G Vidya Pradeep Varma",
      department: "PRINCIPAL",
      designation: "Chair Person",
      icon: GraduationCap,
      color: "from-blue-500 to-purple-600"
    },
    {
      id: 2,
      name: "Mr.Ch Kannam Naidu",
      department: "CIVIL,HOD",
      designation: "Advisor",
      icon: UserCheck,
      color: "from-green-500 to-teal-600"
    },
    {
      id: 3,
      name: "Dr K.Dayana",
      department: "MECH",
      designation: "Convenor",
      icon: Users,
      color: "from-purple-500 to-violet-600"
    },
    {
      id: 4,
      name: "Y.Priyanka",
      department: "CIVIL",
      designation: "co-convenor",
      icon: Building2,
      color: "from-slate-800 to-blue-950"
    },
    {
      id: 5,
      name: "A S C Tejaaswini Kona",
      department: "CSE",
      designation: "Treasurer",
      icon: BookOpen,
      color: "from-indigo-500 to-blue-600"
    },
    {
      id: 6,
      name: "Dr. SK Razia",
      department: "BS&H",
      designation: "Members",
      icon: Shield,
      color: "from-emerald-500 to-green-600"
    },
    {
      id: 7,
      name: "K.Chandana",
      department: "MECH",
      designation: "Members",
      icon: UserCheck,
      color: "from-amber-500 to-yellow-600"
    },
    {
      id: 8,
      name: "K.Divya",
      department: "MBA",
      designation: "Members",
      icon: Heart,
      color: "from-rose-500 to-pink-600"
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
              Grievance Redressal
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              Ensuring a safe, respectful, and supportive environment for all
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
        {/* Anti Ragging Committee */}
        <motion.section variants={itemVariants} className="mb-16">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-blue-950 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                  Anti Ragging Committee
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Committed to maintaining a ragging-free environment and ensuring student safety
                </p>
              </div>

              {/* Anti Ragging Policy */}
              <div className="bg-gradient-to-br from-slate-50 to-blue-100 rounded-xl p-8 border-l-4 border-slate-700 mb-8">
                <div className="space-y-6 text-slate-700 leading-relaxed">
                  <p className="text-lg">
                    Ragging has ruined countless innocent lives and careers. It is now defined as an act that violates or is perceived to violate an individual student's dignity. Ragging is totally banned in the campus and anyone found guilty of ragging and/or helping ragging is liable to be punished as it is criminal offence. Visakha Institute of Engineering and Technology College ensures strict compliance on the prevention of Ragging in the form.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                        <Shield className="w-6 h-6 text-blue-600 mr-3" />
                        Vision
                      </h3>
                      <p className="text-slate-600 italic">
                        "To build a ragging free environment by instilling the principles of democratic values, tolerance, empathy, compassion and sensitivity to that students become responsible citizens"
                      </p>
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                        <Target className="w-6 h-6 text-green-600 mr-3" />
                        Mission
                      </h3>
                      <p className="text-slate-600 italic">
                        "To create an atmosphere of discipline by passing a clear message that no act of ragging in college premises"
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Anti Ragging Committee Members Table */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Members of the Anti Ragging Committee</h3>
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-slate-700 to-blue-900 text-white">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                              S.No
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                              Name of the Faculty
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                              Department
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                              Designation
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                          {antiRaggingMembers.map((member, index) => (
                            <motion.tr
                              key={member.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ 
                                backgroundColor: 'rgba(239, 68, 68, 0.05)',
                                transition: { duration: 0.2 }
                              }}
                              className="hover:bg-slate-50/50 transition-colors duration-200"
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
                                {member.department}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs px-3 py-1 ${
                                    member.designation.includes('Chair Person') 
                                      ? 'bg-blue-100 text-blue-800 border-blue-200' 
                                      : member.designation.includes('warden')
                                      ? 'bg-green-100 text-green-800 border-green-200'
                                      : 'bg-gray-100 text-gray-800 border-gray-200'
                                  }`}
                                >
                                  {member.designation}
                                </Badge>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Women Grievance Cell */}
        <motion.section variants={itemVariants} className="mb-16">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                  Women Grievance Cell
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Providing a safe and supportive environment for all members of the campus community
                </p>
              </div>

              {/* Women Grievance Policy */}
              <div className="bg-gradient-to-br from-pink-50 to-purple-100 rounded-xl p-8 border-l-4 border-pink-500 mb-8">
                <div className="space-y-6 text-slate-700 leading-relaxed">
                  <p className="text-lg">
                    Education should bring in moral ethical values of well being to learners and every educator and educating institutions should strive hard to bring in the core human values in the process of learning and focus on quality approach to ensure better living with better educated countrymen. Discipline is the bridge between goals and accomplishment ensures strict rules and regulations for students on behalf of discipline committee.
                  </p>
                  
                  <p className="text-lg">
                    In compliance with the directions of the Supreme Court of India to have a special Sexual Harassment Committee as mandatory, the Women's Grievance Cell also functions as Sexual Harassment Committee.
                  </p>
                  
                  <p className="text-lg">
                    It provides confidential and supportive environment for members of the campus community who might likely have been sexually harassed; advises complainant of the informal and formal means of redressal, ensures the fair and timely redressal of sexual harassment complaints. (However so far no instances of sexual harassment have been reported)
                  </p>
                  
                  <p className="text-lg">
                    It provides information regarding counselling and support services on the campus, and promotes awareness about sexual harassment through educational initiatives that encourages and fosters a respectful and safe campus environment.
                  </p>
                </div>
              </div>

              {/* Women Grievance Cell Members Table */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Members of the Women Grievance Cell</h3>
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                              S.No
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                              Name of the Faculty
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                              Department
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                              Designation
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                          {womenGrievanceMembers.map((member, index) => (
                            <motion.tr
                              key={member.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ 
                                backgroundColor: 'rgba(236, 72, 153, 0.05)',
                                transition: { duration: 0.2 }
                              }}
                              className="hover:bg-pink-50/50 transition-colors duration-200"
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
                                {member.department}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs px-3 py-1 ${
                                    member.designation.includes('Chair Person') 
                                      ? 'bg-blue-100 text-blue-800 border-blue-200' 
                                      : member.designation.includes('Advisor')
                                      ? 'bg-purple-100 text-purple-800 border-purple-200'
                                      : member.designation.includes('Convenor')
                                      ? 'bg-green-100 text-green-800 border-green-200'
                                      : member.designation.includes('Treasurer')
                                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                                      : 'bg-gray-100 text-gray-800 border-gray-200'
                                  }`}
                                >
                                  {member.designation}
                                </Badge>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Contact Information */}
        <motion.section variants={itemVariants}>
          <Card className="shadow-xl border-0 bg-gradient-to-br from-slate-800 to-blue-900 text-white">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Contact for Grievances
                </h2>
                <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
                  We are committed to addressing all grievances promptly and ensuring a safe, respectful environment for everyone.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-blue-200 mb-4">Anti-Ragging Contact</h3>
                    <ul className="space-y-2 text-blue-100">
                      <li>• WhatsApp: +91-9494670501</li>
                      <li>• Email: vietvsp@gmail.com</li>
                      <li>• Phone: 9959617477, 9959617476</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-200 mb-4">General Grievances</h3>
                    <ul className="space-y-2 text-blue-100">
                      <li>• Email: website@viet.edu.in</li>
                      <li>• Phone: 9959617476, 9959617477</li>
                      <li>• Address: 88th Division, Narava, GVMC, Visakhapatnam</li>
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

export default GrievanceRedressal;
