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

  // Fetch faculty and HODs from API for Civil Engineering department
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
        const civilFaculty = allFaculty.filter((f: FacultyMember) => {
          const dept = (f.department || '').toLowerCase().trim();
          return (
            dept.includes('diploma - civil') ||
            dept.includes('engineering ug - civil') ||
            dept.includes('civil engineering') || dept.includes('civ') ||
            dept === 'civil engineering (civ)' || dept === 'civil engineering'
          );
        });
        const civilHODs = allHODs.filter((h: FacultyMember) => {
          const dept = (h.department || '').toLowerCase().trim();
          return (
            dept.includes('diploma - civil') ||
            dept.includes('engineering ug - civil') ||
            dept.includes('civil engineering') || dept.includes('civ') ||
            dept === 'civil engineering (civ)' || dept === 'civil engineering'
          );
        });
        setFacultyFromAPI(civilFaculty);
        setHODs(civilHODs);
        calculateStats(civilFaculty, civilHODs);
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
    const content = `${program} - ${regulation} Syllabus\n\nDetailed curriculum and course structure.`;
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
                The Department of Civil Engineering was established in 2009 with an initial intake of 120 students. The department introduced a P.G. Programme in Structural Engineering in 2013 with an intake of 36 students. Civil engineering is a professional engineering discipline that deals with the design, construction, and maintenance of the physical and naturally built environment.
              </p>
              <p className="text-gray-700 mb-6">
                The primary focus of the department is to become a center of excellence in the field of Civil Engineering and to create outstanding engineers with advanced teaching techniques and learning aids for undergraduate students. The department provides the right kind of environment for the students to groom themselves for a challenging near future.
              </p>
              <p className="text-gray-700 mb-6">
                Students are not only made experts in technical aspects but also in interpersonal skills, which form a vital ingredient to excel in the fast-paced world. The department has well-equipped laboratories and has established MoUs with various reputed central government and private organizations. Students gain practical experience through field visits to industries, dams, irrigation structures, and construction sites.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-900 mb-4">Want to Join us to pursue your dream?</h3>
              <div className="space-y-3">
                <p className="font-semibold text-green-800">Contact our Admissions Team:</p>
                <p className="text-green-700"><strong>Dr. Kannam Naidu Cheepurupalli</strong></p>
                <div className="flex items-center gap-2 text-green-700">
                  <Phone className="w-4 h-4" />
                  <span>+91-9959617477</span>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <Mail className="w-4 h-4" />
                  <span>civilhod@viet.edu.in</span>
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
                  "To make the students strong in both technical and practical aspects to meet the national and international requirements."
                </p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-900 mb-4">Mission of the Department</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-1 text-green-600" />
                    <span>To facilitate the graduates in acquiring technical exposure to create innovative ideas through a state-of-the-art curriculum and conducive learning environment.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-1 text-green-600" />
                    <span>To provide quality education for a successful career and higher studies in Civil Engineering that emphasizes academic and technical excellence in profession and research, effective communication, teamwork, and leadership to meet the challenges of society.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-1 text-green-600" />
                    <span>To improve the professional skills of the rural students to fulfill the present industry and society requirements.</span>
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
                        <td className="border border-gray-300 px-4 py-2">CIVIL ENGINEERING</td>
                        <td className="border border-gray-300 px-4 py-2">60</td>
                        <td className="border border-gray-300 px-4 py-2">40,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">M.Tech</h3>
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">MASTER OF TECHNOLOGY - M.Tech COURSES</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-blue-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">S.NO</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">M.Tech COURSES</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">NO OF SEATS</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">ANNUAL TUITION FEE (Rs)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">1</td>
                        <td className="border border-gray-300 px-4 py-2">STRUCTURAL ENGINEERING</td>
                        <td className="border border-gray-300 px-4 py-2">36</td>
                        <td className="border border-gray-300 px-4 py-2">50,000</td>
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
                "It gives me immense pleasure to lead the Department of Civil Engineering. Our college is one of the premier institutions, unique like a prism reflecting the manifold shades of learning and co-curricular activities. Visakha Institute of Engineering and Technology is striving hard towards the goal of providing innovative and quality education with high standards to achieve academic excellence."
              </p>
              <p className="text-gray-700 mb-4">
                "The very motto of our department is to provide quality education. The process of learning is extremely important in life. What you learn, how you learn, and where you learn play a crucial role in developing one's intellectual capability, besides career. Hence, on behalf of our Civil Engineering Department, I welcome all of you to VIET."
              </p>
              <p className="text-gray-700 font-semibold">Dr. Kannam Naidu Cheepurupalli</p>
              <p className="text-gray-600 text-sm">24 years of teaching experience</p>
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
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-blue-800 mb-6">UG Curriculum</h3>
              <div className="space-y-6">
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <button 
                    onClick={() => selectProgram('B.Tech Civil Engineering')}
                    className={`w-full text-left p-4 rounded-lg transition-colors mb-4 ${
                      selectedProgram === 'B.Tech Civil Engineering'
                        ? 'bg-primary text-white' 
                        : 'bg-blue-50 hover:bg-blue-100 text-blue-800'
                    }`}
                  >
                    <h4 className="text-lg font-semibold flex items-center justify-between">
                      B.Tech Civil Engineering
                      <ChevronDown className={`w-5 h-5 transition-transform ${selectedProgram === 'B.Tech Civil Engineering' ? 'rotate-180' : ''}`} />
                    </h4>
                  </button>
                  
                  {selectedProgram === 'B.Tech Civil Engineering' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['R19', 'R20', 'R23', 'VR24'].map((reg) => (
                        <button 
                          key={reg}
                          onClick={() => downloadSyllabusPDF('B.Tech Civil Engineering', reg)}
                          className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-blue-800"
                        >
                          <FileText className="w-5 h-5" />
                          <span className="font-medium">{reg}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-blue-800 mb-6">PG Curriculum</h3>
              <div className="space-y-6">
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <button 
                    onClick={() => selectProgram('M.Tech Structural Engineering')}
                    className={`w-full text-left p-4 rounded-lg transition-colors mb-4 ${
                      selectedProgram === 'M.Tech Structural Engineering'
                        ? 'bg-primary text-white' 
                        : 'bg-blue-50 hover:bg-blue-100 text-blue-800'
                    }`}
                  >
                    <h4 className="text-lg font-semibold flex items-center justify-between">
                      M.Tech Structural Engineering
                      <ChevronDown className={`w-5 h-5 transition-transform ${selectedProgram === 'M.Tech Structural Engineering' ? 'rotate-180' : ''}`} />
                    </h4>
                  </button>
                  
                  {selectedProgram === 'M.Tech Structural Engineering' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['R18', 'R20', 'R23', 'R24'].map((reg) => (
                        <button 
                          key={reg}
                          onClick={() => downloadSyllabusPDF('M.Tech Structural Engineering', reg)}
                          className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-blue-800"
                        >
                          <FileText className="w-5 h-5" />
                          <span className="font-medium">{reg}</span>
                        </button>
                      ))}
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
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Technical Excellence</h4>
                      <p className="text-gray-700">Graduates will demonstrate technical competence in civil engineering to solve complex problems and contribute to infrastructure development.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Professional Growth</h4>
                      <p className="text-gray-700">Graduates will exhibit professional growth through continuous learning and leadership roles in the civil engineering profession.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Social Responsibility</h4>
                      <p className="text-gray-700">Graduates will demonstrate ethical behavior and contribute to sustainable infrastructure development for societal well-being.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-green-800 mb-4">Program Specific Outcomes (PSOs)</h3>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                    <div>
                      <h4 className="font-semibold text-green-900 mb-1">Structural Design</h4>
                      <p className="text-gray-700">Apply civil engineering principles to design, analyze, and develop structural systems and infrastructure components.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                    <div>
                      <h4 className="font-semibold text-green-900 mb-1">Construction Management</h4>
                      <p className="text-gray-700">Understand and apply knowledge of construction techniques, project management, and sustainable practices.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-purple-800 mb-4">Program Outcomes (POs)</h3>
              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    {[1,2,3,4,5,6].map((num) => (
                      <div key={num} className="flex items-start gap-2">
                        <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">{num}</span>
                        <span className="text-sm text-gray-700">
                          {num === 1 && 'Engineering Knowledge'}
                          {num === 2 && 'Problem Analysis'}
                          {num === 3 && 'Design/Development of Solutions'}
                          {num === 4 && 'Conduct Investigations'}
                          {num === 5 && 'Modern Tool Usage'}
                          {num === 6 && 'Engineer and Society'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {[7,8,9,10,11,12].map((num) => (
                      <div key={num} className="flex items-start gap-2">
                        <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">{num}</span>
                        <span className="text-sm text-gray-700">
                          {num === 7 && 'Environment and Sustainability'}
                          {num === 8 && 'Ethics'}
                          {num === 9 && 'Individual and Team Work'}
                          {num === 10 && 'Communication'}
                          {num === 11 && 'Project Management'}
                          {num === 12 && 'Life-long Learning'}
                        </span>
                      </div>
                    ))}
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
                        console.error('Image URL:', image.src);
                        console.error('API Base URL:', API_BASE_URL);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                      onLoad={() => {
                        console.log('Successfully loaded gallery image:', image.src);
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

