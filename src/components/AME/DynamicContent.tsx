import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Mail, 
  ExternalLink,
  ChevronRight,
  User,
  Lightbulb,
  BookOpen,
  ChevronDown,
  FileText,
  Users,
  Award
} from 'lucide-react';
import { facultyAPI, hodsAPI } from '@/lib/api';

import { imgUrl } from '@/lib/imageUtils';

interface DynamicContentProps {
  activeSection: string;
  galleryImages: Array<{ src: string; alt: string }>;
  openImageModal: (src: string) => void;
}

interface FacultyMember {
  id: number;
  name: string;
  designation: string;
  qualification: string;
  email?: string;
  phone?: string;
  experience?: string;
  department?: string;
  image?: string;
  resume?: string;
}

const DynamicContent: React.FC<DynamicContentProps> = ({ 
  activeSection, 
  galleryImages, 
  openImageModal 
}) => {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [facultyFromAPI, setFacultyFromAPI] = useState<FacultyMember[]>([]);
  const [hods, setHODs] = useState<FacultyMember[]>([]);
  const [facultyStats, setFacultyStats] = useState({
    total: 0,
    phdHolders: 0,
    mtechFaculty: 0,
    industryExperience: 0
  });

  // Fetch faculty and HODs from API for Automobile Engineering department
  useEffect(() => {
    const calculateStats = (apiFaculty: FacultyMember[], hodsData: FacultyMember[]) => {
      const allFaculty = [...hodsData, ...apiFaculty];
      const uniqueFaculty = allFaculty.filter((faculty, index, self) =>
        index === self.findIndex((f) => f.name.toLowerCase().trim() === faculty.name.toLowerCase().trim())
      );

      const total = uniqueFaculty.length;
      const phdHolders = uniqueFaculty.filter(f => {
        const qual = (f.qualification || '').toLowerCase().trim();
        const originalQual = f.qualification || '';
        const hasPhd = qual.includes('ph.d') || qual.includes('phd') || qual.includes('doctor of philosophy') ||
                      qual.includes('ph.d.') || qual.startsWith('ph.d') || originalQual.includes('Ph.D') ||
                      originalQual.includes('PhD') || originalQual.includes('Ph.D.') ||
                      /ph\s*\.?\s*d/i.test(originalQual) || /ph\s*\.?\s*d/i.test(qual);
        return hasPhd;
      }).length;
      
      const mtechFaculty = uniqueFaculty.filter(f => {
        const qual = (f.qualification || '').toLowerCase().trim();
        return qual.includes('m.tech') || qual.includes('mtech') || qual.includes('master of technology') || qual.includes('m. tech');
      }).length;

      const industryExperience = uniqueFaculty.filter(f => {
        return f.experience && f.experience.trim() !== '';
      }).length;

      setFacultyStats({ total, phdHolders, mtechFaculty, industryExperience });
    };

    const fetchFaculty = async () => {
      try {
        const allFaculty = await facultyAPI.getAll();
        const ameFaculty = allFaculty.filter((f: FacultyMember) => {
          const dept = (f.department || '').toLowerCase().trim();
          return (
            dept.includes('engineering ug - automobile') ||
            dept.includes('automobile engineering') || dept.includes('ame') ||
            dept === 'automobile engineering (ame)' || dept.includes('automobile')
          );
        });
        setFacultyFromAPI(ameFaculty);
        calculateStats(ameFaculty);
      } catch (error) {
        console.error('Error fetching faculty:', error);
        setFacultyFromAPI([]);
        calculateStats([]);
      }
    };

    if (activeSection === 'faculty') {
      fetchFaculty();
    } else {
      calculateStats([]);
    }
  }, [activeSection]);

  const selectProgram = (program: string) => {
    setSelectedProgram(selectedProgram === program ? null : program);
  };

  const downloadSyllabusPDF = (program: string, regulation: string) => {
    const fileName = `${program.replace(/\s+/g, '_')}_${regulation}_Syllabus.pdf`;
    const content = `
${program} - ${regulation} Syllabus

Detailed curriculum and course structure for ${program} under ${regulation} regulation.

Semester-wise Subjects:
- Semester I & II: Mathematics, Physics, Chemistry, Engineering Drawing
- Semester III & IV: Thermodynamics, Fluid Mechanics, Automotive Components
- Semester V & VI: Vehicle Dynamics, Engine Technology, Transmission Systems
- Semester VII & VIII: Advanced Topics, Industry Internship, Project Work

Course Details:
- Duration: 4 Years (8 Semesters)
- Total Credits: 160 Credits
- Theory Subjects: 45+ Subjects
- Laboratory Subjects: 25+ Labs

Special Features:
- Industry-aligned curriculum
- Hands-on laboratory sessions
- Project-based learning
- Internship opportunities
- Industry expert sessions

This is a sample syllabus document for ${program} under ${regulation} regulation.
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-8">
        {activeSection === 'about' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">About the Department</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6">
                The Department of Automobile Engineering was established in 2008 with a mission to prepare highly competent automobile engineers for global automotive industries through an innovative, industry-oriented curriculum, intensive practical training, and industry exposure. The department focuses on areas such as Automotive Design, Automotive Electronics, and Automotive Service.
              </p>
              <p className="text-gray-700 mb-6">
                Major research interests include Hybrid and Electric Vehicle Technologies, Vehicle Design & Performance Optimization, and Vehicle Maintenance. The department has state-of-the-art laboratories including Two and Three Wheeler's Lab, Refrigeration and Air Conditioning Lab, Automobile Engine Lab, Vehicle Maintenance and Garage Practice Lab, and Automobile Component Design Lab.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Why Choose Automobile Engineering?</h3>
              <div className="space-y-4 text-gray-700">
                <p>
                  The curriculum covers a broad range of topics including vehicle dynamics, engine technology, transmission systems, automotive electronics, and modern automotive technologies ensuring students gain comprehensive understanding of both theoretical concepts and practical applications.
                </p>
                <p>
                  The department has specialized laboratories equipped with state-of-the-art equipment including test rigs, exhaust gas analyzers, dynamometers, wheel balancing machines, and diagnostic tools for research and practical learning.
                </p>
                <p>
                  Collaborated with industry partners through internships, industry-sponsored workshops, seminars, and projects. These connections help students gain real-world experience and provide opportunities for networking and career advancement.
                </p>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-900 mb-4">Want to Join us to pursue your dream?</h3>
              <div className="space-y-3">
                <p className="font-semibold text-green-800">Contact our Admissions Team:</p>
                <p className="text-green-700"><strong>Mr. K. Jagadeeswa Rao</strong></p>
                <div className="flex items-center gap-2 text-green-700">
                  <Phone className="w-4 h-4" />
                  <span>+91-9959617477, +91-9959617476</span>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <Mail className="w-4 h-4" />
                  <span>amehod@viet.edu.in</span>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <ExternalLink className="w-4 h-4" />
                  <span>www.viet.edu.in</span>
                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === 'vision-mission' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Vision and Mission</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Vision of the Department</h3>
                <p className="text-gray-700 italic text-justify">
                  "To be a renowned learning center in the field of Automobile Engineering contributing towards the development of society."
                </p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-900 mb-4">Mission of the Department</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-1 text-green-600" />
                    <span>Teaching regular practices and updating new technologies through the utilization of software tools and sophisticated teaching aids.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-1 text-green-600" />
                    <span>Organizing guest lectures, workshops, seminars, and conferences.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-1 text-green-600" />
                    <span>Bridging the gap between industry and college through frequent industrial visits.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-1 text-green-600" />
                    <span>Carrying out research and development projects.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-1 text-green-600" />
                    <span>Developing entrepreneurial skills through internships and case studies.</span>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}

        {activeSection === 'courses' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Programs Offered</h2>
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">B.Tech</h3>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">ENGINEERING COURSES (AP EAPCET - 2025)</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-blue-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">S.NO</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">B.TECH COURSES</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">NO OF SEATS</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">ANNUAL TUITION FEE (Rs)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">1</td>
                        <td className="border border-gray-300 px-4 py-2">AUTOMOBILE ENGINEERING</td>
                        <td className="border border-gray-300 px-4 py-2">60</td>
                        <td className="border border-gray-300 px-4 py-2">43,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === 'faculty' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Faculty</h2>
            
            {/* Faculty Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-900">{facultyStats.total}{facultyStats.total >= 10 ? '+' : ''}</div>
                <div className="text-sm text-blue-700">Total Faculty</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-900">{facultyStats.phdHolders}</div>
                <div className="text-sm text-green-700">Ph.D Holders</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-900">{facultyStats.mtechFaculty}</div>
                <div className="text-sm text-purple-700">M.Tech Faculty</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-900">{facultyStats.industryExperience}</div>
                <div className="text-sm text-orange-700">Industry Experience</div>
              </div>
            </div>

            {/* Head of the Department Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-blue-900 mb-6">Head of the Department</h3>
              {hods.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No HODs found. HODs will appear here once added through the admin panel.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {hods.map((hod) => {
                    const imageSrc = hod.image ? imgUrl(hod.image) : '/placeholder.svg';
                    return (
                      <div key={hod.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="text-center">
                          <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-2 border-blue-200">
                            <img 
                              src={imageSrc}
                              alt={hod.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg';
                              }}
                            />
                          </div>
                          <h4 className="text-xl font-semibold text-blue-900 mb-1">{hod.name}</h4>
                          <p className="text-sm text-gray-600 mb-1">{hod.designation}</p>
                          {hod.qualification && (
                            <p className="text-xs text-gray-500 mb-3">{hod.qualification}</p>
                          )}
                          {hod.experience && (
                            <p className="text-xs text-gray-500 mb-3">Experience: {hod.experience}</p>
                          )}
                          <div className="flex flex-col gap-2 text-sm text-gray-700">
                            {hod.email && (
                              <div className="flex items-center justify-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span>{hod.email}</span>
                              </div>
                            )}
                            {hod.phone && (
                              <div className="flex items-center justify-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span>{hod.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <h4 className="text-lg font-semibold text-blue-900 mb-2">HoD Message</h4>
              <p className="text-gray-700 italic text-justify">
                "Mechanical Engineering is a versatile and evergreen branch of engineering. It is a distinct honor for me to serve as Head of the Mechanical Engineering Department. The department started its journey in 2009. Our department has a team of highly qualified and experienced faculty with good infrastructure and lab facilities. We are striving hard continuously to improve upon the quality of education and to maintain our position of leadership in engineering and technology."
              </p>
            </div>

            {/* Faculty Section with Images and Resumes */}
            <div>
              <h3 className="text-2xl font-bold text-blue-900 mb-6">Faculty Profiles</h3>
              {facultyFromAPI.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No faculty members found. Faculty members will appear here once added through the admin panel.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {facultyFromAPI.map((faculty) => (
                    <div key={faculty.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="text-center">
                        <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-2 border-blue-200">
                          <img 
                            src={faculty.image ? imgUrl(faculty.image) : '/placeholder.svg'} 
                            alt={faculty.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                        </div>
                        <h4 className="text-lg font-semibold text-blue-900 mb-1">{faculty.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{faculty.designation}</p>
                        {faculty.qualification && (
                          <p className="text-xs text-gray-500 mb-1">{faculty.qualification}</p>
                        )}
                        {faculty.experience && (
                          <p className="text-xs text-gray-500 mb-3">Experience: {faculty.experience}</p>
                        )}
                        {faculty.email && (
                          <div className="flex items-center justify-center gap-2 text-xs text-gray-600 mb-1">
                            <Mail className="w-3 h-3" />
                            <span>{faculty.email}</span>
                          </div>
                        )}
                        {faculty.phone && (
                          <div className="flex items-center justify-center gap-2 text-xs text-gray-600 mb-3">
                            <Phone className="w-3 h-3" />
                            <span>{faculty.phone}</span>
                          </div>
                        )}
                        {faculty.resume && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => window.open(faculty.resume, '_blank')}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Resume
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeSection === 'curriculum' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Syllabus</h2>
            
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-blue-800 mb-6">UG Curriculum</h3>
              <div className="space-y-6">
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <button 
                    onClick={() => selectProgram('B.Tech Automobile Engineering')}
                    className={`w-full text-left p-4 rounded-lg transition-colors mb-4 ${
                      selectedProgram === 'B.Tech Automobile Engineering'
                        ? 'bg-primary text-white' 
                        : 'bg-blue-50 hover:bg-blue-100 text-blue-800'
                    }`}
                  >
                    <h4 className="text-lg font-semibold flex items-center justify-between">
                      B.Tech Automobile Engineering
                      <ChevronDown className={`w-5 h-5 transition-transform ${selectedProgram === 'B.Tech Automobile Engineering' ? 'rotate-180' : ''}`} />
                    </h4>
                  </button>
                  
                  {selectedProgram === 'B.Tech Automobile Engineering' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-300">
                      <button 
                        onClick={() => downloadSyllabusPDF('B.Tech Automobile Engineering', 'R18')}
                        className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-blue-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R18</span>
                      </button>
                      <button 
                        onClick={() => downloadSyllabusPDF('B.Tech Automobile Engineering', 'R20')}
                        className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-blue-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R20</span>
                      </button>
                      <button 
                        onClick={() => downloadSyllabusPDF('B.Tech Automobile Engineering', 'R23')}
                        className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-blue-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R23</span>
                      </button>
                      <button 
                        onClick={() => downloadSyllabusPDF('B.Tech Automobile Engineering', 'R24')}
                        className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-blue-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R24</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === 'peo-psos-pos' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">PEOs, PSOs & POs</h2>
            
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">Program Educational Objectives (PEOs)</h3>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  The Program Educational Objectives (PEOs) describe the career and professional accomplishments that the program is preparing graduates to achieve within a few years of graduation.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Technical Excellence</h4>
                      <p className="text-gray-700">Graduates will demonstrate technical competence in automobile engineering to solve complex problems and contribute to technological advancement in the automotive industry.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Professional Growth</h4>
                      <p className="text-gray-700">Graduates will exhibit professional growth through continuous learning, leadership roles, and contributions to the automotive profession.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Social Responsibility</h4>
                      <p className="text-gray-700">Graduates will demonstrate ethical behavior and social responsibility in their professional practice and contribute to societal well-being through sustainable automotive solutions.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-green-800 mb-4">Program Specific Outcomes (PSOs)</h3>
              <div className="bg-green-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  Program Specific Outcomes (PSOs) are statements that describe what students are expected to know and be able to do by the time of graduation.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                    <div>
                      <h4 className="font-semibold text-green-900 mb-1">Automotive Design</h4>
                      <p className="text-gray-700">Apply automotive engineering principles to design, analyze, and develop vehicle systems and components.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                    <div>
                      <h4 className="font-semibold text-green-900 mb-1">Vehicle Technology</h4>
                      <p className="text-gray-700">Understand and apply knowledge of vehicle dynamics, engine technology, and modern automotive systems.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                    <div>
                      <h4 className="font-semibold text-green-900 mb-1">Emerging Technologies</h4>
                      <p className="text-gray-700">Apply knowledge of emerging technologies such as electric vehicles, hybrid systems, and autonomous vehicles to solve real-world problems.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-purple-800 mb-4">Program Outcomes (POs)</h3>
              <div className="bg-purple-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  Program Outcomes (POs) are statements that describe what students are expected to know and be able to do by the time of graduation.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">1</span>
                      <span className="text-sm text-gray-700">Engineering Knowledge</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">2</span>
                      <span className="text-sm text-gray-700">Problem Analysis</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">3</span>
                      <span className="text-sm text-gray-700">Design/Development of Solutions</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">4</span>
                      <span className="text-sm text-gray-700">Conduct Investigations</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">5</span>
                      <span className="text-sm text-gray-700">Modern Tool Usage</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">6</span>
                      <span className="text-sm text-gray-700">Engineer and Society</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">7</span>
                      <span className="text-sm text-gray-700">Environment and Sustainability</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">8</span>
                      <span className="text-sm text-gray-700">Ethics</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">9</span>
                      <span className="text-sm text-gray-700">Individual and Team Work</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">10</span>
                      <span className="text-sm text-gray-700">Communication</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">11</span>
                      <span className="text-sm text-gray-700">Project Management</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">12</span>
                      <span className="text-sm text-gray-700">Life-long Learning</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === 'gallery' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Gallery & Media</h2>
            {galleryImages.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No gallery images found. Images will appear here once added through the admin panel.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryImages.map((image, index) => (
                  <div 
                    key={index}
                    className="h-32 rounded-lg overflow-hidden cursor-pointer group bg-gray-100"
                    onClick={() => openImageModal(image.src)}
                  >
                    <img 
                      src={image.src} 
                      alt={image.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        console.error('Failed to load gallery image:', image.src);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeSection === 'placements' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Placements</h2>
            <div className="text-center py-12">
              <Button variant="outline" size="lg">
                <ExternalLink className="w-4 h-4 mr-2" />
                Click here for Placements
              </Button>
            </div>
          </>
        )}

        {activeSection === 'projects' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Projects</h2>
            <div className="text-center py-12">
              <p className="text-gray-600">Project information will be updated soon.</p>
            </div>
          </>
        )}

        {activeSection === 'rd' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">R&D</h2>
            <div className="text-center py-12">
              <p className="text-gray-600">Research and Development information will be updated soon.</p>
            </div>
          </>
        )}

        {activeSection === 'alumni' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Alumni</h2>
            <div className="text-center py-12">
              <Button variant="outline" size="lg">
                <ExternalLink className="w-4 h-4 mr-2" />
                Click here for Alumni
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DynamicContent;

