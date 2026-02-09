import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';
import { 
  FileText, 
  Calendar, 
  BookOpen, 
  Clock, 
  Bell, 
  Award, 
  Phone, 
  Mail, 
  MapPin,
  User,
  Building,
  Download,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UGPGExaminations: React.FC = () => {
  const [activeSection, setActiveSection] = useState('examination-cell');
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Handle URL parameter for section
  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, [searchParams]);

  const sections = useMemo(() => [
    { id: 'examination-cell', title: 'Examination Cell', icon: Building },
    { id: 'academic-calendar', title: 'Academic Calendar', icon: Calendar },
    { id: 'academic-regulation', title: 'Academic Regulation', icon: FileText },
    { id: 'syllabus', title: 'Syllabus', icon: BookOpen },
    { id: 'time-table', title: 'Time Table', icon: Clock },
    { id: 'circulars', title: 'Circulars & Notification', icon: Bell },
    { id: 'results', title: 'Results', icon: Award },
    { id: 'contact', title: 'Contact Us', icon: Phone },
  ], []);

  const switchSection = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  // Notice Board Items
  const noticeBoardItems = [
    {
      id: 1,
      title: 'I M.TECH II SEM REGULAR EXAMINATION RESULTS JULY 2025',
      date: '2025-07-18',
      type: 'results',
      link: '#',
      isNew: true
    },
    {
      id: 2,
      title: 'I MBA II SEM REGULAR EXAMINATION RESULTS JUNE 2025',
      date: '2025-06-15',
      type: 'results',
      link: '#',
      isNew: true
    },
    {
      id: 3,
      title: 'I MCA II SEM REGULAR EXAMINATION RESULTS JUNE 2025',
      date: '2025-06-15',
      type: 'results',
      link: '#',
      isNew: true
    },
    {
      id: 4,
      title: 'I B.TECH II SEM REGULAR EXAMINATION RESULTS MAY 2025',
      date: '2025-05-20',
      type: 'results',
      link: '#',
      isNew: true
    },
    {
      id: 5,
      title: 'I B.TECH I SEM SUPPLEMENTARY EXAMINATION RESULTS MAY 2025',
      date: '2025-05-18',
      type: 'results',
      link: '#',
      isNew: true
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <LeaderPageNavbar backHref="/" />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16 pt-56">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Engg (UG, PG) Examination Cell
            </h1>
            <p className="text-xl text-blue-100">
              Examination Management System
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Table of Contents */}
          <div className="lg:w-1/4">
            <div className="sticky top-24 z-10">
              <Card className="shadow-lg">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-3 text-blue-900">Table of Contents</h3>
                  <nav className="space-y-1">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <button
                          key={section.id}
                          onClick={() => switchSection(section.id)}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 text-left rounded-lg transition-colors ${
                            activeSection === section.id
                              ? 'bg-blue-100 text-blue-900 font-medium'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="text-xs leading-tight">{section.title}</span>
                        </button>
                      );
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <AnimatePresence mode="wait">
              {activeSection === 'examination-cell' && (
                <motion.div
                  key="examination-cell"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-lg mb-6">
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                        <Building className="w-6 h-6" />
                        Examination Cell
                      </h2>

                      {/* Notice Board Section */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-blue-600" />
                            Notice Board
                          </h3>
                          <Badge className="bg-slate-700 text-white animate-pulse">
                            Latest Updates
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <AnimatePresence>
                            {noticeBoardItems.map((notice, index) => (
                              <motion.div
                                key={notice.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.1, duration: 0.3 }}
                                className="relative"
                              >
                                <Card className={`border-l-4 ${
                                  notice.isNew 
                                    ? 'border-l-slate-600 bg-slate-50/50 shadow-md hover:shadow-lg' 
                                    : 'border-l-blue-500 bg-white hover:shadow-md'
                                } transition-all duration-300 cursor-pointer group`}>
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                          {notice.isNew && (
                                            <motion.div
                                              animate={{ scale: [1, 1.2, 1] }}
                                              transition={{ duration: 2, repeat: Infinity }}
                                            >
                                              <AlertCircle className="w-4 h-4 text-slate-600" />
                                            </motion.div>
                                          )}
                                          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                                            {notice.type}
                                          </span>
                                          {notice.isNew && (
                                            <Badge className="bg-slate-700 text-white text-xs px-2 py-0.5">
                                              NEW
                                            </Badge>
                                          )}
                                        </div>
                                        <h4 className="font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                                          {notice.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                          <Calendar className="w-3 h-3" />
                                          {notice.date}
                                        </p>
                                      </div>
                                      <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        whileTap={{ scale: 0.95 }}
                                      >
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="flex items-center gap-1"
                                          onClick={() => window.open(notice.link, '_blank')}
                                        >
                                          View
                                          <ExternalLink className="w-3 h-3" />
                                        </Button>
                                      </motion.div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Instructions Section */}
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
                        <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                          <Info className="w-5 h-5" />
                          Instructions for Viewing Results
                        </h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                          <li>Click on <strong>"Student Login"</strong></li>
                          <li>Enter your Roll Number as both your <strong>username</strong> and <strong>password</strong> (ensure they are in CAPITAL letters).</li>
                          <li>Click on <strong>"Login"</strong> to access your results.</li>
                          <li>Once logged in, navigate to the <strong>"Marks Details"</strong> section to view your marks.</li>
                        </ol>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeSection === 'academic-calendar' && (
                <motion.div
                  key="academic-calendar"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-lg mb-6">
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                        <Calendar className="w-6 h-6" />
                        Academic Calendar
                      </h2>

                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Calendar for B.Tech</h3>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300">
                              <thead>
                                <tr className="bg-blue-100">
                                  <th className="border border-gray-300 px-4 py-2 text-left">Document</th>
                                  <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="hover:bg-gray-50">
                                  <td className="border border-gray-300 px-4 py-2">Changes in Examination Tab</td>
                                  <td className="border border-gray-300 px-4 py-2">
                                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                                      <Download className="w-4 h-4" />
                                      Download
                                    </Button>
                                  </td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                  <td className="border border-gray-300 px-4 py-2">Academic Calendar</td>
                                  <td className="border border-gray-300 px-4 py-2">
                                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                                      <Download className="w-4 h-4" />
                                      Download
                                    </Button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Calendar for M.Tech</h3>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300">
                              <thead>
                                <tr className="bg-blue-100">
                                  <th className="border border-gray-300 px-4 py-2 text-left">Document</th>
                                  <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="hover:bg-gray-50">
                                  <td className="border border-gray-300 px-4 py-2">Academic Calendar</td>
                                  <td className="border border-gray-300 px-4 py-2">
                                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                                      <Download className="w-4 h-4" />
                                      Download
                                    </Button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Calendar for MCA</h3>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300">
                              <thead>
                                <tr className="bg-blue-100">
                                  <th className="border border-gray-300 px-4 py-2 text-left">Document</th>
                                  <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="hover:bg-gray-50">
                                  <td className="border border-gray-300 px-4 py-2">Academic Calendar</td>
                                  <td className="border border-gray-300 px-4 py-2">
                                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                                      <Download className="w-4 h-4" />
                                      Download
                                    </Button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeSection === 'academic-regulation' && (
                <motion.div
                  key="academic-regulation"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-lg mb-6">
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                        <FileText className="w-6 h-6" />
                        Academic Regulation
                      </h2>

                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Regulation for M.Tech</h3>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300">
                              <thead>
                                <tr className="bg-blue-100">
                                  <th className="border border-gray-300 px-4 py-2 text-left">Document</th>
                                  <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="hover:bg-gray-50">
                                  <td className="border border-gray-300 px-4 py-2">Academic Regulation</td>
                                  <td className="border border-gray-300 px-4 py-2">
                                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                                      <Download className="w-4 h-4" />
                                      Download
                                    </Button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Regulation for MBA</h3>
                          <p className="text-gray-600">Regulations coming soon...</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeSection === 'syllabus' && (
                <motion.div
                  key="syllabus"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-lg mb-6">
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                        <BookOpen className="w-6 h-6" />
                        Syllabus
                      </h2>
                      <p className="text-gray-600">Syllabus information will be available here.</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeSection === 'time-table' && (
                <motion.div
                  key="time-table"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-lg mb-6">
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                        <Clock className="w-6 h-6" />
                        Time Table
                      </h2>

                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-blue-100">
                              <th className="border border-gray-300 px-4 py-2 text-left">Document</th>
                              <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="hover:bg-gray-50">
                              <td className="border border-gray-300 px-4 py-2">Changes in Time Table</td>
                              <td className="border border-gray-300 px-4 py-2">
                                <Button variant="outline" size="sm" className="flex items-center gap-1">
                                  <Download className="w-4 h-4" />
                                  Download
                                </Button>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="border border-gray-300 px-4 py-2">Time Table</td>
                              <td className="border border-gray-300 px-4 py-2">
                                <Button variant="outline" size="sm" className="flex items-center gap-1">
                                  <Download className="w-4 h-4" />
                                  Download
                                </Button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeSection === 'circulars' && (
                <motion.div
                  key="circulars"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-lg mb-6">
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                        <Bell className="w-6 h-6" />
                        Circulars & Notification
                      </h2>

                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">Circulars B.Tech</h3>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300">
                              <thead>
                                <tr className="bg-blue-100">
                                  <th className="border border-gray-300 px-4 py-2 text-left">Document</th>
                                  <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="hover:bg-gray-50">
                                  <td className="border border-gray-300 px-4 py-2">Changes in VIET web circular and notifications Tab</td>
                                  <td className="border border-gray-300 px-4 py-2">
                                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                                      <Download className="w-4 h-4" />
                                      Download
                                    </Button>
                                  </td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                  <td className="border border-gray-300 px-4 py-2">Deo Circulars</td>
                                  <td className="border border-gray-300 px-4 py-2">
                                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                                      <Download className="w-4 h-4" />
                                      Download
                                    </Button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">Circulars M.Tech</h3>
                          <p className="text-gray-600">Circulars coming soon...</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeSection === 'results' && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-lg mb-6">
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                        <Award className="w-6 h-6" />
                        Results
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-2">B.Tech I Year Results New</h3>
                            <Button className="w-full">View Results</Button>
                          </CardContent>
                        </Card>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-2">B.Tech II Year Results New</h3>
                            <Button className="w-full">View Results</Button>
                          </CardContent>
                        </Card>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-2">B.Tech III Year Results New</h3>
                            <Button className="w-full">View Results</Button>
                          </CardContent>
                        </Card>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-2">B.Tech IV Year Results New</h3>
                            <Button className="w-full">View Results</Button>
                          </CardContent>
                        </Card>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-2">M.Tech Results: New</h3>
                            <Button className="w-full">View Results</Button>
                          </CardContent>
                        </Card>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-2">MBA Results New</h3>
                            <Button className="w-full">View Results</Button>
                          </CardContent>
                        </Card>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-2">MCA Results New</h3>
                            <Button className="w-full">View Results</Button>
                          </CardContent>
                        </Card>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-2">JNTU K Results New</h3>
                            <Button className="w-full">View Results</Button>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeSection === 'contact' && (
                <motion.div
                  key="contact"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-lg mb-6">
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                        <Phone className="w-6 h-6" />
                        Contact Exam Cell
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-bold text-lg">CHIEF SUPERINTENDENT & PRINCIPAL</h3>
                                <p className="text-sm text-gray-600">DR. G V PRADEEP VARMA</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-50 to-green-100">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-bold text-lg">Controller of Examination (UG& PG)</h3>
                                <p className="text-sm text-gray-600">Dr C. GOVINDA RAJULU, Ph.D. PROFESSOR</p>
                              </div>
                            </div>
                            <div className="space-y-2 text-sm">
                              <p className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                VIET (AUTONOMOUS) Examination Center NARAVA- 530027, Andhra Pradesh, India
                              </p>
                              <p className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                +91 9440502945
                              </p>
                              <p className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                nt_coe@viet.edu.in
                              </p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-bold text-lg">Additional Controller of Examinations (UG&PG)</h3>
                                <p className="text-sm text-gray-600">Mr. GORLE SUNIL, M.Tech, ASSISTANT PROFESSOR</p>
                              </div>
                            </div>
                            <div className="space-y-2 text-sm">
                              <p className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                VIET (AUTONOMOUS) & EXAMCELL IN-CHARGE JNTUGV NARAVA- 530027, Andhra Pradesh, India
                              </p>
                              <p className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                +91 8886586022
                              </p>
                              <p className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                nt_examcell@vietvsp.com
                              </p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-bold text-lg">Additional Controller of Examinations-2 (UG&PG)</h3>
                                <p className="text-sm text-gray-600">Mr. KARE JAGADESWARA RAO, M.Tech (Ph. D), ASSISTANT PROFESSOR</p>
                              </div>
                            </div>
                            <div className="space-y-2 text-sm">
                              <p className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                VIET (AUTONOMOUS) & EXAMCELL IN-CHARGE-2 JNTUGV NARAVA- 530027, Andhra Pradesh, India
                              </p>
                              <p className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                +91 8500650399
                              </p>
                              <p className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                nt_examcell@vietvsp.com
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer />
      <ScrollProgressIndicator />
    </div>
  );
};

export default UGPGExaminations;











