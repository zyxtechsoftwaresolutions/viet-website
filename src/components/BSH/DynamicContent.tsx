import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  Mail, 
  ExternalLink,
  ChevronRight,
  BookOpen,
  ChevronDown,
  FileText,
  Users,
  Award
} from 'lucide-react';
import { facultyAPI, hodsAPI } from '@/lib/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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

  // Fetch faculty and HODs from API for Basic Science and Humanities department
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
        const [allFaculty, allHODs] = await Promise.all([
          facultyAPI.getAll(),
          hodsAPI.getAll()
        ]);
        const bshFaculty = allFaculty.filter((f: FacultyMember) => {
          const dept = (f.department || '').toLowerCase().trim();
          return (
            dept.includes('engineering ug - basic science') ||
            dept.includes('engineering ug - bsh') ||
            dept.includes('basic science') || dept.includes('humanities') || dept.includes('bsh') ||
            dept.includes('bs&h') || dept === 'basic science and humanities (bs&h)' ||
            dept.includes('basic science and humanities')
          );
        });
        const bshHODs = allHODs.filter((h: FacultyMember) => {
          const dept = (h.department || '').toLowerCase().trim();
          return (
            dept.includes('engineering ug - basic science') ||
            dept.includes('engineering ug - bsh') ||
            dept.includes('basic science') || dept.includes('humanities') || dept.includes('bsh') ||
            dept.includes('bs&h') || dept === 'basic science and humanities (bs&h)' ||
            dept.includes('basic science and humanities')
          );
        });
        setFacultyFromAPI(bshFaculty);
        setHODs(bshHODs);
        calculateStats(bshFaculty, bshHODs);
      } catch (error) {
        console.error('Error fetching faculty/HODs:', error);
        setFacultyFromAPI([]);
        setHODs([]);
        calculateStats([], []);
      }
    };

    if (activeSection === 'faculty' || activeSection === 'hod') {
      fetchFaculty();
    } else {
      calculateStats([], []);
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
                Department of Basic Science & Humanities started functioning from the year 2009 consisting of qualified experienced faculty basic sciences to cater the needs of First Year Engineering classes as well some of the Senior Classes in Engineering. The department comprises sections of Mathematics, Physics, Chemistry, Environmental Sciences, English and Management Sciences which meets the nexus of basic sciences and core engineering domains.
              </p>
              <p className="text-gray-700 mb-6">
                The department has well equipped laboratories to impart practical training to the students in the field of Physics, Chemistry, Computer Programming, Engineering Drawing and Advanced English & Communication Skills.
              </p>
              <p className="text-gray-700 mb-6">
                Department of Basic Sciences & Humanities is a Supporting department to all Engineering branches, MBA department. Here the students are exposed to Basic Sciences like Mathematics, Physics and Chemistry in addition to English and Environmental Science. Department of Basic Sciences & Humanities has well stack of faculty with rich experience and expertise in their select domains. Of them, two are Ph.D's, eight are M. Phils and five are pursuing their Ph.D's.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-900 mb-4">Want to Join us to pursue your dream?</h3>
              <div className="space-y-3">
                <p className="font-semibold text-green-800">Contact our Admissions Team:</p>
                <p className="text-green-700"><strong>Dr. M. Uday Bhaskar</strong></p>
                <div className="flex items-center gap-2 text-green-700">
                  <Phone className="w-4 h-4" />
                  <span>+91-9573500581</span>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <Mail className="w-4 h-4" />
                  <span>bshod@viet.edu.in</span>
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
                <p className="text-gray-700 italic">
                  "To lay a strong foundation for the first year students of the engineering discipline in the area of Applied Sciences and Humanities with a view to make them capable of innovating and inventing engineering solutions and also develop students as capable and responsible citizens of our nation."
                </p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-900 mb-4">Mission of the Department</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-1 text-green-600" />
                    <span><strong>M-1:</strong> To impart knowledge, leading to understanding between engineering and other core areas of Applied Sciences and Humanities.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-1 text-green-600" />
                    <span><strong>M-2:</strong> To strive to inculcate the scientific temper and the spirit of enquiry in the students.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-1 text-green-600" />
                    <span><strong>M-3:</strong> To make students achieve a superior level in communication and presentation skills.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-1 text-green-600" />
                    <span><strong>M-4:</strong> To foster values and ethics and make students responsible citizens of India.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-1 text-green-600" />
                    <span><strong>M-5:</strong> To pursue inter-disciplinary research for the larger good of the society.</span>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}

        {activeSection === 'courses' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Courses Offered</h2>
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">ENGINEERING COURSES (AP EAPCET - 2025)</h3>
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
                      <td className="border border-gray-300 px-4 py-2">CIVIL</td>
                      <td className="border border-gray-300 px-4 py-2">60</td>
                      <td className="border border-gray-300 px-4 py-2">43,000</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">2</td>
                      <td className="border border-gray-300 px-4 py-2">CSE</td>
                      <td className="border border-gray-300 px-4 py-2">240</td>
                      <td className="border border-gray-300 px-4 py-2">43,000</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">3</td>
                      <td className="border border-gray-300 px-4 py-2">CSE – AI & ML</td>
                      <td className="border border-gray-300 px-4 py-2">60</td>
                      <td className="border border-gray-300 px-4 py-2">43,000</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">4</td>
                      <td className="border border-gray-300 px-4 py-2">CSE – DATA SCIENCE</td>
                      <td className="border border-gray-300 px-4 py-2">60</td>
                      <td className="border border-gray-300 px-4 py-2">43,000</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">5</td>
                      <td className="border border-gray-300 px-4 py-2">CSE – CYBER SECURITY</td>
                      <td className="border border-gray-300 px-4 py-2">60</td>
                      <td className="border border-gray-300 px-4 py-2">43,000</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">6</td>
                      <td className="border border-gray-300 px-4 py-2">ECE</td>
                      <td className="border border-gray-300 px-4 py-2">180</td>
                      <td className="border border-gray-300 px-4 py-2">43,000</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">7</td>
                      <td className="border border-gray-300 px-4 py-2">EEE</td>
                      <td className="border border-gray-300 px-4 py-2">60</td>
                      <td className="border border-gray-300 px-4 py-2">43,000</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">8</td>
                      <td className="border border-gray-300 px-4 py-2">MECHANICAL ENGINEERING</td>
                      <td className="border border-gray-300 px-4 py-2">150</td>
                      <td className="border border-gray-300 px-4 py-2">43,000</td>
                    </tr>
                  </tbody>
                </table>
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
                    const imageSrc = hod.image 
                      ? (hod.image.startsWith('/') 
                          ? `${API_BASE_URL}${hod.image}` 
                          : `${API_BASE_URL}/${hod.image}`)
                      : '/placeholder.svg';
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
              <p className="text-gray-700 mb-4">
                "The Basic Sciences and Humanities Department is responsible for providing the best educational space that provides uncompromising infrastructure and challenging research atmosphere. The department has been committed to devise innovative programs that assure the overall development of the student community, equipping them with the advancements in the field of Science. Our duty is extended to preparing them, for the upcoming challenges, diverse work space and social responsibility. We have been formulating and improvising strategies that ensure the quality of education which in turn produces the best generation engineers who are ethically strong and morally responsible."
              </p>
              <p className="text-gray-700 font-semibold">Wish you all the best,</p>
              <p className="text-gray-700">Dr. M. Uday Bhaskar</p>
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
                            src={faculty.image 
                              ? (faculty.image.startsWith('/') 
                                  ? `${API_BASE_URL}${faculty.image}` 
                                  : `${API_BASE_URL}/${faculty.image}`)
                              : '/placeholder.svg'} 
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
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-gray-700">
                The syllabus for Basic Sciences & Humanities courses is designed to support all engineering branches. Detailed syllabus documents are available for Mathematics, Physics, Chemistry, English, and Environmental Sciences.
              </p>
            </div>
          </>
        )}

        {activeSection === 'peo-psos-pos' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">PEO's, PSO's & PO's</h2>
            
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-purple-800 mb-4">Program Outcomes (POs)</h3>
              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">1</span>
                      <span className="text-sm text-gray-700">Engineering Knowledge: Apply the knowledge of mathematics, science, engineering fundamentals, and an engineering specialization to the solution of complex engineering problems.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">2</span>
                      <span className="text-sm text-gray-700">Problem Analysis: Identify, formulate, review research literature, and analyze complex engineering problems reaching substantiated conclusions using first principles of mathematics, natural sciences, and engineering sciences.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">3</span>
                      <span className="text-sm text-gray-700">Design/Development of Solutions: Design solutions for complex engineering problems and design system components or processes that meet the specified needs with appropriate consideration for the public health and safety, and the cultural, societal, and environmental considerations.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">4</span>
                      <span className="text-sm text-gray-700">Conduct Investigations: Use research-based knowledge and research methods including design of experiments, analysis and interpretation of data, and synthesis of the information to provide valid conclusions.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">5</span>
                      <span className="text-sm text-gray-700">Modern Tool Usage: Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools including prediction and modelling to complex engineering activities with an understanding of the limitations.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">6</span>
                      <span className="text-sm text-gray-700">The Engineer and Society: Apply reasoning informed by the contextual knowledge to assess societal, health, safety, legal and cultural issues and the consequent responsibilities relevant to the professional engineering practice.</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">7</span>
                      <span className="text-sm text-gray-700">Environment and Sustainability: Understand the impact of the professional engineering solutions in societal and environmental contexts, and demonstrate the knowledge of, and need for sustainable development.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">8</span>
                      <span className="text-sm text-gray-700">Ethics: Apply ethical principles and commit to professional ethics and responsibilities and norms of the engineering practice.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">9</span>
                      <span className="text-sm text-gray-700">Individual and Team Work: Function effectively as an individual, and as a member or leader in diverse teams, and in multidisciplinary settings.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">10</span>
                      <span className="text-sm text-gray-700">Communication: Communicate effectively on complex engineering activities with the engineering community and with society at large, such as, being able to comprehend and write effective reports and design documentation, make effective presentations, and give and receive clear instructions.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">11</span>
                      <span className="text-sm text-gray-700">Project Management and Finance: Demonstrate knowledge and understanding of the engineering and management principles and apply these to one's own work, as a member and leader in a team, to manage projects and in multidisciplinary environments.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">12</span>
                      <span className="text-sm text-gray-700">Life-long Learning: Recognize the need for, and have the preparation and ability to engage in independent and life-long learning in the broadest context of technological change.</span>
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

