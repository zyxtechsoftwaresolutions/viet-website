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
  Code,
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
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [selectedClub, setSelectedClub] = useState<string | null>(null);
  const [selectedSyllabus, setSelectedSyllabus] = useState<{program: string, regulation: string} | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [facultyFromAPI, setFacultyFromAPI] = useState<FacultyMember[]>([]);
  const [hods, setHODs] = useState<FacultyMember[]>([]);
  const [facultyStats, setFacultyStats] = useState({
    total: 0,
    phdHolders: 0,
    mtechFaculty: 0,
    industryExperience: 0
  });

  // Fetch faculty and HODs from API for Computer Science department
  useEffect(() => {
    // Calculate faculty statistics - include HODs and API faculty
    const calculateStats = (apiFaculty: FacultyMember[], hodsData: FacultyMember[]) => {
      // Combine HODs and API faculty
      const allFaculty = [...hodsData, ...apiFaculty];
      
      // Remove duplicates based on name (in case HOD exists in API faculty)
      const uniqueFaculty = allFaculty.filter((faculty, index, self) =>
        index === self.findIndex((f) => f.name.toLowerCase().trim() === faculty.name.toLowerCase().trim())
      );

      // Count statistics
      const total = uniqueFaculty.length;
      const phdHolders = uniqueFaculty.filter(f => {
        const qual = (f.qualification || '').toLowerCase().trim();
        const originalQual = f.qualification || '';
        
        // More comprehensive Ph.D detection - check both lowercase and original case
        const hasPhd = qual.includes('ph.d') || 
                      qual.includes('phd') || 
                      qual.includes('doctor of philosophy') ||
                      qual.includes('ph.d.') ||
                      qual.startsWith('ph.d') ||
                      originalQual.includes('Ph.D') ||
                      originalQual.includes('PhD') ||
                      originalQual.includes('Ph.D.') ||
                      /ph\s*\.?\s*d/i.test(originalQual) ||
                      /ph\s*\.?\s*d/i.test(qual);
        
        if (hasPhd) {
          console.log(`✓ Ph.D detected: ${f.name} - Qualification: "${f.qualification}"`);
        } else {
          console.log(`✗ Ph.D NOT detected: ${f.name} - Qualification: "${f.qualification}"`);
        }
        return hasPhd;
      }).length;
      
      const mtechFaculty = uniqueFaculty.filter(f => {
        const qual = (f.qualification || '').toLowerCase().trim();
        return qual.includes('m.tech') || qual.includes('mtech') || qual.includes('master of technology') || qual.includes('m. tech');
      }).length;

      // Industry experience - check if experience field exists and has value
      const industryExperience = uniqueFaculty.filter(f => {
        return f.experience && f.experience.trim() !== '';
      }).length;

      console.log('Calculated Stats:', { total, phdHolders, mtechFaculty, industryExperience, uniqueFaculty: uniqueFaculty.map(f => ({ name: f.name, qualification: f.qualification })) });

      setFacultyStats({
        total,
        phdHolders,
        mtechFaculty,
        industryExperience
      });
    };

    const fetchFaculty = async () => {
      try {
        const [allFaculty, allHODs] = await Promise.all([
          facultyAPI.getAll(),
          hodsAPI.getAll()
        ]);
        console.log('All faculty fetched:', allFaculty);
        console.log('All HODs fetched:', allHODs);
        
        // Filter faculty for Computer Science departments (both UG and Diploma)
        const cseFaculty = allFaculty.filter((f: FacultyMember) => {
          const dept = (f.department || '').toLowerCase().trim();
          const matches = (
            dept.includes('engineering ug - computer science') ||
            dept.includes('engineering pg - computer science') ||
            dept.includes('diploma - computer science') ||
            dept.includes('computer science') ||
            dept.includes('cse') ||
            dept === 'computer science engineering' ||
            dept === 'computer science and engineering (cse)' ||
            dept.includes('computer science and engineering')
          );
          if (matches) {
            console.log(`Faculty "${f.name}" matched department "${f.department}"`);
          }
          return matches;
        });
        console.log('Filtered CSE faculty:', cseFaculty);
        
        // Filter HODs for Computer Science departments
        const cseHODs = allHODs.filter((h: FacultyMember) => {
          const dept = (h.department || '').toLowerCase().trim();
          return (
            dept.includes('engineering ug - computer science') ||
            dept.includes('engineering pg - computer science') ||
            dept.includes('diploma - computer science') ||
            dept.includes('computer science') ||
            dept.includes('cse') ||
            dept === 'computer science engineering' ||
            dept === 'computer science and engineering (cse)' ||
            dept.includes('computer science and engineering')
          );
        });
        
        setFacultyFromAPI(cseFaculty);
        setHODs(cseHODs);
        // Calculate statistics after fetching
        calculateStats(cseFaculty, cseHODs);
      } catch (error) {
        console.error('Error fetching faculty/HODs:', error);
        setFacultyFromAPI([]);
        setHODs([]);
        // Calculate stats with empty data on error
        calculateStats([], []);
      }
    };

    if (activeSection === 'faculty' || activeSection === 'hod') {
      fetchFaculty();
    } else {
      // Initialize with empty data if not on faculty section
      calculateStats([], []);
    }
  }, [activeSection]);

  const toggleCourse = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  const selectClub = (clubId: string) => {
    setSelectedClub(selectedClub === clubId ? null : clubId);
  };

  const selectSyllabus = (program: string, regulation: string) => {
    setSelectedSyllabus({program, regulation});
  };

  const selectProgram = (program: string) => {
    setSelectedProgram(selectedProgram === program ? null : program);
    setSelectedSyllabus(null); // Reset syllabus selection when program changes
  };

  const downloadSyllabusPDF = (program: string, regulation: string) => {
    // Create a mock PDF download
    const fileName = `${program.replace(/\s+/g, '_')}_${regulation}_Syllabus.pdf`;
    
    // Create a simple text content for the PDF (in real implementation, this would be actual PDF)
    const content = `
${program} - ${regulation} Syllabus

Detailed curriculum and course structure for ${program} under ${regulation} regulation.

Semester-wise Subjects:
- Semester I & II: Mathematics, Physics, Chemistry, Programming in C
- Semester III & IV: Data Structures, Computer Organization, DBMS, Operating Systems
- Semester V & VI: Computer Networks, Web Technologies, AI, Machine Learning
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
    
    // Create and download the file
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
                The Department of Computer Science & Engineering (CSE) offers a four-year Under Graduation (UG) B.Tech degree program with an annual intake of 240 students and offers CSE (Artificial Intelligence & Machine Learning) with annual intake of 60, CSE (Data Science) with annual intake of 60 and CSE (Cyber Security) with an annual intake of 30 students.
              </p>
              <p className="text-gray-700 mb-6">
                Also, it offers a two-year Post Graduation (PG) M.Tech program in Computer Science Engineering with an annual intake of 60.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Why We?</h3>
              <div className="space-y-4 text-gray-700">
                <p>
                  The curriculum of CSE programs usually covers a broad range of topics, ensuring that students gain a comprehensive understanding of both theoretical concepts and practical applications. Courses often include programming languages, Computer architecture, Operating Systems, software engineering concepts, SQL, Oracle Data bases, advanced topics like Artificial Intelligence, Machine Learning, Deep Learning Techniques, real-time applications like Mobile Android Applications, Full Stack Development and many more.
                </p>
                <p>
                  CSE departments typically have specialized laboratories and facilities equipped with state-of-the-art hardware and software resources for research and practical learning. These may include computer labs, networking labs, AI and machine learning labs, and more.
                </p>
                <p>
                  Collaborated with industry partners through Internships, Industry-Sponsored Workshops, Seminars, and Projects. These connections help students gain real-world experience and provide opportunities for networking and career advancement.
                </p>
                <p>
                  Apart From Academics, we engage students with different activities and encourage them to develop social and public speaking skills, leadership qualities, and Soft skills, to showcase their extra-curricular activities of their interest through different clubs and Idea Cell.
                </p>
                <p>
                  We encourage students to pursue their dreams of interest by training them with good trainers to develop and start their start-ups with the support of EISC (Entrepreneurship Innovation Start-up Cell) and COE (Center of Excellence).
                </p>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-900 mb-4">Want to Join us to pursue your dream?</h3>
              <div className="space-y-3">
                <p className="font-semibold text-green-800">Contact our Admissions Team:</p>
                <p className="text-green-700"><strong>Dr.A S C Tejaswini Kone</strong></p>
                <div className="flex items-center gap-2 text-green-700">
                  <Phone className="w-4 h-4" />
                  <span>+91-9959617477, +91-8341111786</span>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <Mail className="w-4 h-4" />
                  <span>admissions@viet.edu.in</span>
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
                  "To become a pioneer in providing high-quality education and research in the area of Computer Science and Engineering."
                </p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-900 mb-4">Mission of the Department</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-1 text-green-600" />
                    <span>Enrich society and advance Computer Science and Engineering by preparing graduates with the knowledge, ability, and skill to become innovators and leaders who are able to contribute to the aspirations of the country and society</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-1 text-green-600" />
                    <span>Benefit humanity through research, creativity, problem-solving, and application development.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-1 text-green-600" />
                    <span>Share knowledge and expertise to benefit the country, region, and beyond while inspiring people to engage in computing fields.</span>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}

        {activeSection === 'courses' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Programs Offered</h2>
            {/* B.Tech Courses */}
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
                        <th className="border border-gray-300 px-4 py-2 text-left">TUITION FEE (Rs)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">1</td>
                        <td className="border border-gray-300 px-4 py-2">CSE</td>
                        <td className="border border-gray-300 px-4 py-2">240</td>
                        <td className="border border-gray-300 px-4 py-2">43,000</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">2</td>
                        <td className="border border-gray-300 px-4 py-2">CSE – AI & ML</td>
                        <td className="border border-gray-300 px-4 py-2">60</td>
                        <td className="border border-gray-300 px-4 py-2">43,000</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">3</td>
                        <td className="border border-gray-300 px-4 py-2">CSE – DATA SCIENCE</td>
                        <td className="border border-gray-300 px-4 py-2">60</td>
                        <td className="border border-gray-300 px-4 py-2">43,000</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">4</td>
                        <td className="border border-gray-300 px-4 py-2">CSE – CYBER SECURITY</td>
                        <td className="border border-gray-300 px-4 py-2">60</td>
                        <td className="border border-gray-300 px-4 py-2">43,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">ENGINEERING COURSES – LATERAL ENTRY (AP ECET-2025)</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-blue-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">S.NO</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">B.TECH COURSES</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">NO OF SEATS</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">TUITION FEE (Rs)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">1</td>
                        <td className="border border-gray-300 px-4 py-2">CSE</td>
                        <td className="border border-gray-300 px-4 py-2">112</td>
                        <td className="border border-gray-300 px-4 py-2">43,000</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">2</td>
                        <td className="border border-gray-300 px-4 py-2">CSE – AI & ML</td>
                        <td className="border border-gray-300 px-4 py-2">17</td>
                        <td className="border border-gray-300 px-4 py-2">43,000</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">3</td>
                        <td className="border border-gray-300 px-4 py-2">CSE – DATA SCIENCE</td>
                        <td className="border border-gray-300 px-4 py-2">33</td>
                        <td className="border border-gray-300 px-4 py-2">43,000</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">4</td>
                        <td className="border border-gray-300 px-4 py-2">CSE – CYBER SECURITY</td>
                        <td className="border border-gray-300 px-4 py-2">32</td>
                        <td className="border border-gray-300 px-4 py-2">43,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* M.Tech Courses */}
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
                        <th className="border border-gray-300 px-4 py-2 text-left">TUITION FEE (Rs)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">2</td>
                        <td className="border border-gray-300 px-4 py-2">CSE</td>
                        <td className="border border-gray-300 px-4 py-2">18</td>
                        <td className="border border-gray-300 px-4 py-2">50,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* MCA Courses */}
            <div>
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">MCA</h3>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">PG COURSES – MCA 2025</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-blue-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">S.NO</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">MCA COURSES</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">NO OF SEATS</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">TUITION FEE (Rs)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">1</td>
                        <td className="border border-gray-300 px-4 py-2">MCA</td>
                        <td className="border border-gray-300 px-4 py-2">180</td>
                        <td className="border border-gray-300 px-4 py-2">35,000</td>
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
            <div className="mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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

            {/* Faculty Section with Images and Resumes */}
            <div>
              <h3 className="text-2xl font-bold text-blue-900 mb-6">Faculty Profiles</h3>
              {facultyFromAPI.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No faculty members found. Please add faculty through the admin panel.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* API-fetched Faculty Members */}
                  {facultyFromAPI.map((faculty) => {
                    const imageSrc = faculty.image ? imgUrl(faculty.image) : '/placeholder.svg';

                    return (
                      <div key={faculty.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="text-center">
                          <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-2 border-cyan-200">
                            <img 
                              src={imageSrc}
                              alt={faculty.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg';
                              }}
                            />
                          </div>
                          <h4 className="text-lg font-semibold text-blue-900 mb-1">{faculty.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{faculty.designation}</p>
                          <p className="text-xs text-gray-500 mb-3">{faculty.qualification}</p>
                          {faculty.experience && (
                            <p className="text-xs text-gray-400 mb-3">Experience: {faculty.experience}</p>
                          )}
                          {faculty.email && (
                            <p className="text-xs text-gray-400 mb-1">
                              <Mail className="w-3 h-3 inline mr-1" />
                              {faculty.email}
                            </p>
                          )}
                          {faculty.resume && (
                            <button 
                              onClick={() => {
                                const resumeUrl = faculty.resume?.startsWith('/') 
                                  ? `${API_BASE_URL}${faculty.resume}`
                                  : `${API_BASE_URL}/${faculty.resume}`;
                                window.open(resumeUrl, '_blank');
                              }}
                              className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-cyan-700 transition-colors flex items-center gap-2 mx-auto mt-3"
                            >
                              <FileText className="w-4 h-4" />
                              View Resume
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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

        {activeSection === 'club-activities' && (
          <>
            {/* Hero Section for Club Activities */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 rounded-2xl mb-8">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative p-8 md:p-12 text-white">
                <div className="max-w-4xl">
                  <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    🎉 Club Activities
                  </h2>
                  <p className="text-xl md:text-2xl text-blue-100 mb-6 leading-relaxed">
                    Where Passion Meets Innovation • Where Dreams Take Flight • Where Memories Are Made
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">✨ 4 Active Clubs</span>
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">🚀 100+ Events</span>
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">🏆 Award Winning</span>
                  </div>
                </div>
              </div>
              {/* Floating Elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full animate-bounce"></div>
            </div>

            {/* Club Cards Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* CODE CRAFTERS */}
              <div 
                className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 transform hover:scale-105 hover:-rotate-1 ${
                  selectedClub === 'code-crafters' ? 'ring-4 ring-blue-400 shadow-2xl scale-105' : 'shadow-xl hover:shadow-2xl'
                }`}
                onClick={() => selectClub('code-crafters')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="relative p-8 text-white">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                      <Code className="w-10 h-10 text-white" />
                    </div>
                  <div>
                      <h4 className="text-2xl font-bold mb-1">CODE CRAFTERS</h4>
                      <p className="text-blue-200 font-medium">💻 Programming & Development</p>
                    </div>
                  </div>
                  <p className="text-blue-100 mb-6 leading-relaxed">
                    A vibrant community of passionate programmers creating innovative solutions and competing in hackathons worldwide.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <span className="bg-white/20 px-3 py-1 rounded-full text-xs">Hackathons</span>
                      <span className="bg-white/20 px-3 py-1 rounded-full text-xs">Open Source</span>
                </div>
                    <ChevronRight className={`w-6 h-6 transition-all duration-300 ${selectedClub === 'code-crafters' ? 'rotate-90 scale-110' : 'group-hover:translate-x-1'}`} />
                  </div>
                </div>
                {/* Animated Background Elements */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-full animate-ping"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/10 rounded-full animate-pulse"></div>
              </div>

              {/* THINKTANKTRIVIA */}
              <div 
                className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 transform hover:scale-105 hover:rotate-1 ${
                  selectedClub === 'thinktanktrivia' ? 'ring-4 ring-green-400 shadow-2xl scale-105' : 'shadow-xl hover:shadow-2xl'
                }`}
                onClick={() => selectClub('thinktanktrivia')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="relative p-8 text-white">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                      <Lightbulb className="w-10 h-10 text-white" />
                </div>
                    <div>
                      <h4 className="text-2xl font-bold mb-1">THINKTANKTRIVIA</h4>
                      <p className="text-green-200 font-medium">🧠 Quiz & Knowledge</p>
                    </div>
                  </div>
                  <p className="text-green-100 mb-6 leading-relaxed">
                    Challenge your intellect with exciting quiz competitions, trivia nights, and knowledge-sharing sessions.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <span className="bg-white/20 px-3 py-1 rounded-full text-xs">Quizzes</span>
                      <span className="bg-white/20 px-3 py-1 rounded-full text-xs">Trivia</span>
                    </div>
                    <ChevronRight className={`w-6 h-6 transition-all duration-300 ${selectedClub === 'thinktanktrivia' ? 'rotate-90 scale-110' : 'group-hover:translate-x-1'}`} />
                  </div>
                </div>
                {/* Animated Background Elements */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-full animate-ping"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/10 rounded-full animate-pulse"></div>
              </div>

              {/* BINARY SPORTS */}
              <div 
                className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 transform hover:scale-105 hover:-rotate-1 ${
                  selectedClub === 'binary-sports' ? 'ring-4 ring-orange-400 shadow-2xl scale-105' : 'shadow-xl hover:shadow-2xl'
                }`}
                onClick={() => selectClub('binary-sports')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-950"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="relative p-8 text-white">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold mb-1">BINARY SPORTS</h4>
                      <p className="text-orange-200 font-medium">⚽ Sports & Fitness</p>
                    </div>
                  </div>
                  <p className="text-orange-100 mb-6 leading-relaxed">
                    Promoting physical fitness and sportsmanship through tournaments, wellness programs, and athletic excellence.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <span className="bg-white/20 px-3 py-1 rounded-full text-xs">Tournaments</span>
                      <span className="bg-white/20 px-3 py-1 rounded-full text-xs">Fitness</span>
                    </div>
                    <ChevronRight className={`w-6 h-6 transition-all duration-300 ${selectedClub === 'binary-sports' ? 'rotate-90 scale-110' : 'group-hover:translate-x-1'}`} />
                  </div>
                </div>
                {/* Animated Background Elements */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-full animate-ping"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/10 rounded-full animate-pulse"></div>
              </div>

              {/* FUSION FANTASIA */}
              <div 
                className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 transform hover:scale-105 hover:rotate-1 ${
                  selectedClub === 'fusion-fantasia' ? 'ring-4 ring-purple-400 shadow-2xl scale-105' : 'shadow-xl hover:shadow-2xl'
                }`}
                onClick={() => selectClub('fusion-fantasia')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-rose-700"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="relative p-8 text-white">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                      <ExternalLink className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold mb-1">FUSION FANTASIA</h4>
                      <p className="text-purple-200 font-medium">🎨 Cultural & Arts</p>
                    </div>
                  </div>
                  <p className="text-purple-100 mb-6 leading-relaxed">
                    Celebrating creativity through cultural events, art exhibitions, music performances, and multimedia projects.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <span className="bg-white/20 px-3 py-1 rounded-full text-xs">Cultural</span>
                      <span className="bg-white/20 px-3 py-1 rounded-full text-xs">Arts</span>
                    </div>
                    <ChevronRight className={`w-6 h-6 transition-all duration-300 ${selectedClub === 'fusion-fantasia' ? 'rotate-90 scale-110' : 'group-hover:translate-x-1'}`} />
                  </div>
                </div>
                {/* Animated Background Elements */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-full animate-ping"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/10 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Club Details Section */}
            {selectedClub && (
              <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-2xl border border-gray-100">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                
                {selectedClub === 'code-crafters' && (
                  <div className="p-8 md:p-12">
                    <div className="text-center mb-12">
                      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full mb-4">
                        <Code className="w-6 h-6" />
                        <span className="font-bold">CODE CRAFTERS</span>
                      </div>
                      <h4 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Programming Excellence Hub
                      </h4>
                      <p className="text-gray-600 text-lg">Where Code Meets Creativity • Where Ideas Become Reality</p>
                    </div>
              <div className="text-center">
                      <p className="text-gray-600">Club details coming soon...</p>
                        </div>
                      </div>
                    )}

                {selectedClub === 'thinktanktrivia' && (
                  <div className="p-8 md:p-12">
                    <div className="text-center mb-12">
                      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-full mb-4">
                        <Lightbulb className="w-6 h-6" />
                        <span className="font-bold">THINKTANKTRIVIA</span>
                  </div>
                      <h4 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
                        Knowledge Powerhouse
                      </h4>
                      <p className="text-gray-600 text-lg">Where Minds Meet • Where Knowledge Grows • Where Champions Are Born</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600">Club details coming soon...</p>
                    </div>
                  </div>
                )}

                {selectedClub === 'binary-sports' && (
                  <div className="p-8 md:p-12">
                    <div className="text-center mb-12">
                      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-700 to-blue-900 text-white px-6 py-3 rounded-full mb-4">
                        <User className="w-6 h-6" />
                        <span className="font-bold">BINARY SPORTS</span>
                      </div>
                      <h4 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-700 to-blue-900 bg-clip-text text-transparent mb-2">
                        Athletic Excellence Center
                      </h4>
                      <p className="text-gray-600 text-lg">Where Champions Train • Where Fitness Meets Fun • Where Victory Begins</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600">Club details coming soon...</p>
                    </div>
                  </div>
                )}

                {selectedClub === 'fusion-fantasia' && (
                  <div className="p-8 md:p-12">
                    <div className="text-center mb-12">
                      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full mb-4">
                        <ExternalLink className="w-6 h-6" />
                        <span className="font-bold">FUSION FANTASIA</span>
                      </div>
                      <h4 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Creative Expression Hub
                      </h4>
                      <p className="text-gray-600 text-lg">Where Art Comes Alive • Where Culture Blooms • Where Dreams Take Shape</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600">Club details coming soon...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {activeSection === 'curriculum' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Syllabus</h2>
            
            {/* UG Curriculum */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-blue-800 mb-6">UG Curriculum</h3>
            <div className="space-y-6">
                {/* B.Tech CSE */}
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <button 
                    onClick={() => selectProgram('B.Tech CSE')}
                    className={`w-full text-left p-4 rounded-lg transition-colors mb-4 ${
                      selectedProgram === 'B.Tech CSE'
                        ? 'bg-blue-600 text-white' 
                        : 'bg-blue-50 hover:bg-blue-100 text-blue-800'
                    }`}
                  >
                    <h4 className="text-lg font-semibold flex items-center justify-between">
                      B.Tech CSE
                      <ChevronDown className={`w-5 h-5 transition-transform ${selectedProgram === 'B.Tech CSE' ? 'rotate-180' : ''}`} />
                    </h4>
                  </button>
                  
                  {selectedProgram === 'B.Tech CSE' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-300">
                      <button 
                        onClick={() => downloadSyllabusPDF('B.Tech CSE', 'R18')}
                        className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-blue-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R19</span>
                      </button>
                      <button 
                        onClick={() => downloadSyllabusPDF('B.Tech CSE', 'R20')}
                        className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-blue-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R20</span>
                      </button>
                      <button 
                        onClick={() => downloadSyllabusPDF('B.Tech CSE', 'R23')}
                        className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-blue-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R23</span>
                      </button>
                      <button 
                        onClick={() => downloadSyllabusPDF('B.Tech CSE', 'R24')}
                        className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-blue-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">VR24</span>
                      </button>
                        </div>
                  )}
                </div>

                {/* B.Tech CSE (AI & ML) */}
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <button 
                    onClick={() => selectProgram('B.Tech CSE (AI & ML)')}
                    className={`w-full text-left p-4 rounded-lg transition-colors mb-4 ${
                      selectedProgram === 'B.Tech CSE (AI & ML)'
                        ? 'bg-green-600 text-white' 
                        : 'bg-green-50 hover:bg-green-100 text-green-800'
                    }`}
                  >
                    <h4 className="text-lg font-semibold flex items-center justify-between">
                      B.Tech CSE (AI & ML)
                      <ChevronDown className={`w-5 h-5 transition-transform ${selectedProgram === 'B.Tech CSE (AI & ML)' ? 'rotate-180' : ''}`} />
                    </h4>
                  </button>
                  
                  {selectedProgram === 'B.Tech CSE (AI & ML)' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-300">
                      <button 
                        onClick={() => downloadSyllabusPDF('B.Tech CSE (AI & ML)', 'R18')}
                        className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-green-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R19</span>
                      </button>
                      <button 
                        onClick={() => downloadSyllabusPDF('B.Tech CSE (AI & ML)', 'R20')}
                        className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-green-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R20</span>
                      </button>
                      <button 
                        onClick={() => downloadSyllabusPDF('B.Tech CSE (AI & ML)', 'R23')}
                        className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-green-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R23</span>
                      </button>
                      <button 
                        onClick={() => downloadSyllabusPDF('B.Tech CSE (AI & ML)', 'R24')}
                        className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-green-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">VR24</span>
                      </button>
                      </div>
                    )}
                  </div>

                {/* B.Tech CSE (Data Science) */}
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <button 
                    onClick={() => selectProgram('B.Tech CSE (Data Science)')}
                    className={`w-full text-left p-4 rounded-lg transition-colors mb-4 ${
                      selectedProgram === 'B.Tech CSE (Data Science)'
                        ? 'bg-purple-600 text-white' 
                        : 'bg-purple-50 hover:bg-purple-100 text-purple-800'
                    }`}
                  >
                    <h4 className="text-lg font-semibold flex items-center justify-between">
                      B.Tech CSE (Data Science)
                      <ChevronDown className={`w-5 h-5 transition-transform ${selectedProgram === 'B.Tech CSE (Data Science)' ? 'rotate-180' : ''}`} />
                    </h4>
                  </button>
                  
                  {selectedProgram === 'B.Tech CSE (Data Science)' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-300">
                      <button 
                        onClick={() => downloadSyllabusPDF('B.Tech CSE (Data Science)', 'R18')}
                        className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-purple-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R19</span>
                      </button>
                      <button 
                        onClick={() => downloadSyllabusPDF('B.Tech CSE (Data Science)', 'R20')}
                        className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-purple-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R20</span>
                      </button>
                      <button 
                        onClick={() => downloadSyllabusPDF('B.Tech CSE (Data Science)', 'R23')}
                        className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-purple-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R23</span>
                      </button>
                      <button 
                        onClick={() => downloadSyllabusPDF('B.Tech CSE (Data Science)', 'R24')}
                        className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-purple-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">VR24</span>
                      </button>
                        </div>
                  )}
                </div>

                {/* B.Tech CSE (Cyber Security) */}
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <button 
                    onClick={() => selectProgram('B.Tech CSE (Cyber Security)')}
                    className={`w-full text-left p-4 rounded-lg transition-colors mb-4 ${
                      selectedProgram === 'B.Tech CSE (Cyber Security)'
                        ? 'bg-orange-600 text-white' 
                        : 'bg-orange-50 hover:bg-orange-100 text-orange-800'
                    }`}
                  >
                    <h4 className="text-lg font-semibold flex items-center justify-between">
                      B.Tech CSE (Cyber Security)
                      <ChevronDown className={`w-5 h-5 transition-transform ${selectedProgram === 'B.Tech CSE (Cyber Security)' ? 'rotate-180' : ''}`} />
                    </h4>
                  </button>
                  
                  {selectedProgram === 'B.Tech CSE (Cyber Security)' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-300">
                      <button 
                        onClick={() => downloadSyllabusPDF('B.Tech CSE (Cyber Security)', 'R18')}
                        className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-orange-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R19</span>
                      </button>
                      <button 
                        onClick={() => downloadSyllabusPDF('B.Tech CSE (Cyber Security)', 'R20')}
                        className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-orange-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R20</span>
                      </button>
                      <button 
                        onClick={() => downloadSyllabusPDF('B.Tech CSE (Cyber Security)', 'R23')}
                        className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-orange-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R23</span>
                      </button>
                      <button 
                        onClick={() => downloadSyllabusPDF('B.Tech CSE (Cyber Security)', 'R24')}
                        className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-orange-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">VR24</span>
                      </button>
                      </div>
                    )}
                </div>
              </div>
                  </div>

            {/* PG Curriculum */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-blue-800 mb-6">PG Curriculum</h3>
              <div className="space-y-6">
                {/* M.Tech CSE */}
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <button 
                    onClick={() => selectProgram('M.Tech CSE')}
                    className={`w-full text-left p-4 rounded-lg transition-colors mb-4 ${
                      selectedProgram === 'M.Tech CSE'
                        ? 'bg-blue-600 text-white' 
                        : 'bg-blue-50 hover:bg-blue-100 text-blue-800'
                    }`}
                  >
                    <h4 className="text-lg font-semibold flex items-center justify-between">
                      M.Tech CSE
                      <ChevronDown className={`w-5 h-5 transition-transform ${selectedProgram === 'M.Tech CSE' ? 'rotate-180' : ''}`} />
                    </h4>
                  </button>
                  
                  {selectedProgram === 'M.Tech CSE' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-300">
                      <button 
                        onClick={() => downloadSyllabusPDF('M.Tech CSE', 'R18')}
                        className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-blue-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R18</span>
                      </button>
                      <button 
                        onClick={() => downloadSyllabusPDF('M.Tech CSE', 'R20')}
                        className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-blue-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R20</span>
                      </button>
                      <button 
                        onClick={() => downloadSyllabusPDF('M.Tech CSE', 'R23')}
                        className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-blue-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R23</span>
                      </button>
                      <button 
                        onClick={() => downloadSyllabusPDF('M.Tech CSE', 'R24')}
                        className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-blue-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R24</span>
                      </button>
                        </div>
                  )}
                </div>

                {/* M.Tech CSE (AI & ML) */}
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <button 
                    onClick={() => selectProgram('M.Tech CSE (AI & ML)')}
                    className={`w-full text-left p-4 rounded-lg transition-colors mb-4 ${
                      selectedProgram === 'M.Tech CSE (AI & ML)'
                        ? 'bg-green-600 text-white' 
                        : 'bg-green-50 hover:bg-green-100 text-green-800'
                    }`}
                  >
                    <h4 className="text-lg font-semibold flex items-center justify-between">
                      M.Tech CSE (AI & ML)
                      <ChevronDown className={`w-5 h-5 transition-transform ${selectedProgram === 'M.Tech CSE (AI & ML)' ? 'rotate-180' : ''}`} />
                    </h4>
                  </button>
                  
                  {selectedProgram === 'M.Tech CSE (AI & ML)' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-300">
                      <button 
                        onClick={() => downloadSyllabusPDF('M.Tech CSE (AI & ML)', 'R18')}
                        className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-green-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R18</span>
                      </button>
                      <button 
                        onClick={() => downloadSyllabusPDF('M.Tech CSE (AI & ML)', 'R20')}
                        className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-green-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R20</span>
                      </button>
                      <button 
                        onClick={() => downloadSyllabusPDF('M.Tech CSE (AI & ML)', 'R23')}
                        className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-green-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R23</span>
                      </button>
                      <button 
                        onClick={() => downloadSyllabusPDF('M.Tech CSE (AI & ML)', 'R24')}
                        className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-green-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R24</span>
                      </button>
                      </div>
                    )}
                  </div>

                {/* M.Tech CSE (Data Science) */}
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <button 
                    onClick={() => selectProgram('M.Tech CSE (Data Science)')}
                    className={`w-full text-left p-4 rounded-lg transition-colors mb-4 ${
                      selectedProgram === 'M.Tech CSE (Data Science)'
                        ? 'bg-purple-600 text-white' 
                        : 'bg-purple-50 hover:bg-purple-100 text-purple-800'
                    }`}
                  >
                    <h4 className="text-lg font-semibold flex items-center justify-between">
                      M.Tech CSE (Data Science)
                      <ChevronDown className={`w-5 h-5 transition-transform ${selectedProgram === 'M.Tech CSE (Data Science)' ? 'rotate-180' : ''}`} />
                    </h4>
                  </button>
                  
                  {selectedProgram === 'M.Tech CSE (Data Science)' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-300">
                      <button 
                        onClick={() => downloadSyllabusPDF('M.Tech CSE (Data Science)', 'R18')}
                        className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-purple-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R18</span>
                      </button>
                      <button 
                        onClick={() => downloadSyllabusPDF('M.Tech CSE (Data Science)', 'R20')}
                        className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-purple-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R20</span>
                      </button>
                      <button 
                        onClick={() => downloadSyllabusPDF('M.Tech CSE (Data Science)', 'R23')}
                        className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-purple-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R23</span>
                      </button>
                      <button 
                        onClick={() => downloadSyllabusPDF('M.Tech CSE (Data Science)', 'R24')}
                        className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-purple-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R24</span>
                      </button>
                </div>
                  )}
              </div>

                {/* M.Tech CSE (Cyber Security) */}
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <button 
                    onClick={() => selectProgram('M.Tech CSE (Cyber Security)')}
                    className={`w-full text-left p-4 rounded-lg transition-colors mb-4 ${
                      selectedProgram === 'M.Tech CSE (Cyber Security)'
                        ? 'bg-orange-600 text-white' 
                        : 'bg-orange-50 hover:bg-orange-100 text-orange-800'
                    }`}
                  >
                    <h4 className="text-lg font-semibold flex items-center justify-between">
                      M.Tech CSE (Cyber Security)
                      <ChevronDown className={`w-5 h-5 transition-transform ${selectedProgram === 'M.Tech CSE (Cyber Security)' ? 'rotate-180' : ''}`} />
                    </h4>
                  </button>
                  
                  {selectedProgram === 'M.Tech CSE (Cyber Security)' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-300">
                      <button 
                        onClick={() => downloadSyllabusPDF('M.Tech CSE (Cyber Security)', 'R18')}
                        className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-orange-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R18</span>
                      </button>
                      <button 
                        onClick={() => downloadSyllabusPDF('M.Tech CSE (Cyber Security)', 'R20')}
                        className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-orange-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R20</span>
                      </button>
                      <button 
                        onClick={() => downloadSyllabusPDF('M.Tech CSE (Cyber Security)', 'R23')}
                        className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-orange-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R23</span>
                      </button>
                      <button 
                        onClick={() => downloadSyllabusPDF('M.Tech CSE (Cyber Security)', 'R24')}
                        className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-orange-800"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">R24</span>
                      </button>
                    </div>
                  )}
                </div>
                </div>
              </div>


            {/* Additional Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Curriculum Information</h4>
              <div className="grid md:grid-cols-2 gap-6">
                  <div>
                  <h5 className="font-semibold text-gray-700 mb-2">Regulation Years:</h5>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• R18 - 2018 Regulation</li>
                    <li>• R20 - 2020 Regulation</li>
                    <li>• R23 - 2023 Regulation</li>
                    <li>• R24 - 2024 Regulation</li>
                    </ul>
                  </div>
                  <div>
                  <h5 className="font-semibold text-gray-700 mb-2">How to Download:</h5>
                  <p className="text-sm text-gray-600">
                    1. Click on any program (B.Tech CSE, M.Tech CSE, etc.) to expand<br/>
                    2. Click on the regulation year (R18, R20, R23, R24) to download the PDF<br/>
                    3. Each regulation contains updated curriculum as per JNTU GV & VIET AUTONOMOUS guidelines.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === 'peo-psos-pos' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">PEOs, PSOs & POs</h2>
            
            {/* Program Educational Objectives (PEOs) */}
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
                      <p className="text-gray-700">Graduates will demonstrate technical competence in computer science and engineering to solve complex problems and contribute to technological advancement.</p>
                  </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Professional Growth</h4>
                      <p className="text-gray-700">Graduates will exhibit professional growth through continuous learning, leadership roles, and contributions to the computing profession.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Social Responsibility</h4>
                      <p className="text-gray-700">Graduates will demonstrate ethical behavior and social responsibility in their professional practice and contribute to societal well-being.</p>
                    </div>
                    </div>
                  </div>
                </div>
              </div>

            {/* Program Specific Outcomes (PSOs) */}
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
                      <h4 className="font-semibold text-green-900 mb-1">Software Development</h4>
                      <p className="text-gray-700">Apply software engineering principles and practices to design, develop, test, and maintain software systems.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                    <div>
                      <h4 className="font-semibold text-green-900 mb-1">System Design</h4>
                      <p className="text-gray-700">Design and analyze computer systems, networks, and databases to meet specific requirements and constraints.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                    <div>
                      <h4 className="font-semibold text-green-900 mb-1">Emerging Technologies</h4>
                      <p className="text-gray-700">Apply knowledge of emerging technologies such as AI, ML, IoT, and cloud computing to solve real-world problems.</p>
                    </div>
                  </div>
                  </div>
                </div>
              </div>

            {/* Program Outcomes (POs) */}
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

        {activeSection === 'projects' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Projects</h2>
            
            {/* Project Statistics */}
            <div className="mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-900">50+</div>
                  <div className="text-sm text-blue-700">Completed Projects</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-900">25+</div>
                  <div className="text-sm text-green-700">Industry Projects</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-900">15+</div>
                  <div className="text-sm text-purple-700">Research Projects</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-900">10+</div>
                  <div className="text-sm text-orange-700">Award Winning</div>
                </div>
              </div>
            </div>

            {/* Featured Projects */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">Featured Projects</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 text-blue-600" />
                    </div>
                  <div>
                      <h4 className="font-semibold text-blue-900">Smart Campus Management System</h4>
                      <p className="text-sm text-gray-600">IoT-based solution for campus automation</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    A comprehensive IoT-based system that manages campus facilities, security, and student services through smart sensors and mobile applications.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">IoT</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Mobile App</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Database</span>
                  </div>
                </div>
                
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 text-green-600" />
                  </div>
                    <div>
                      <h4 className="font-semibold text-green-900">AI-Powered Healthcare Assistant</h4>
                      <p className="text-sm text-gray-600">Machine Learning for medical diagnosis</p>
                </div>
              </div>
                  <p className="text-gray-700 mb-4">
                    An intelligent system that uses machine learning algorithms to assist in medical diagnosis and provide healthcare recommendations.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">AI/ML</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Python</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">TensorFlow</span>
                  </div>
            </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 text-purple-600" />
                    </div>
            <div>
                      <h4 className="font-semibold text-purple-900">Blockchain Voting System</h4>
                      <p className="text-sm text-gray-600">Secure and transparent voting platform</p>
                  </div>
                </div>
                  <p className="text-gray-700 mb-4">
                    A decentralized voting system using blockchain technology to ensure security, transparency, and immutability of votes.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Blockchain</span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Smart Contracts</span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Web3</span>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-900">Cybersecurity Monitoring Tool</h4>
                      <p className="text-sm text-gray-600">Real-time threat detection system</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    An advanced cybersecurity tool that monitors network traffic, detects threats, and provides real-time security alerts.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">Cybersecurity</span>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">Network Security</span>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">Python</span>
                  </div>
                </div>
                  </div>
                </div>

            {/* Project Categories */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">Project Categories</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-blue-900 mb-3">Web Development</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• E-commerce Platforms</li>
                    <li>• Content Management Systems</li>
                    <li>• Social Media Applications</li>
                    <li>• Educational Portals</li>
                    </ul>
                  </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-green-900 mb-3">Mobile Applications</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Android Applications</li>
                    <li>• iOS Applications</li>
                    <li>• Cross-platform Apps</li>
                    <li>• IoT Mobile Controllers</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-purple-900 mb-3">AI & Machine Learning</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Image Recognition Systems</li>
                    <li>• Natural Language Processing</li>
                    <li>• Predictive Analytics</li>
                    <li>• Chatbot Applications</li>
                  </ul>
                </div>
                  </div>
                </div>

            {/* Project Gallery */}
                  <div>
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">Project Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: "Web App", emoji: "🌐" },
                  { title: "Mobile App", emoji: "📱" },
                  { title: "AI Project", emoji: "🤖" },
                  { title: "IoT System", emoji: "🔗" },
                  { title: "Database", emoji: "🗄️" },
                  { title: "Security Tool", emoji: "🔒" },
                  { title: "Game", emoji: "🎮" },
                  { title: "Analytics", emoji: "📊" }
                ].map((item, index) => (
                  <div key={index} className="group relative overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl h-32 cursor-pointer hover:scale-105 transition-transform duration-300">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="relative h-full flex flex-col items-center justify-center text-center p-4">
                      <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{item.emoji}</span>
                      <span className="text-xs font-semibold text-gray-700">{item.title}</span>
                  </div>
                </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeSection === 'placements' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Placements</h2>
            
            {/* Placement Statistics */}
            <div className="mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-900">95%</div>
                  <div className="text-sm text-blue-700">Placement Rate</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-900">50+</div>
                  <div className="text-sm text-green-700">Recruiting Companies</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-900">₹8.5L</div>
                  <div className="text-sm text-purple-700">Highest Package</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-900">₹4.2L</div>
                  <div className="text-sm text-orange-700">Average Package</div>
                </div>
                  </div>
                </div>

            {/* Top Recruiters */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">Top Recruiters</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "TCS", logo: "/RECRUITERS/tcs.png" },
                  { name: "HCL", logo: "/RECRUITERS/hcl-img.png" },
                  { name: "Tech Mahindra", logo: "/RECRUITERS/Tech_Mahindra.png" },
                  { name: "Byju's", logo: "/RECRUITERS/byjus-img.png" },
                  { name: "Novel", logo: "/RECRUITERS/novel-img.png" },
                  { name: "Smart Brains", logo: "/RECRUITERS/smart-brains-img.png" }
                ].map((company, index) => (
                  <div key={index} className="bg-white border rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded-lg flex items-center justify-center">
                      <img src={company.logo} alt={company.name} className="w-12 h-12 object-contain" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">{company.name}</p>
                  </div>
                ))}
                  </div>
                </div>

            {/* Placement Process */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">Placement Process</h3>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-blue-900 mb-3">Pre-Placement Activities</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Resume Building Workshops</li>
                      <li>• Mock Interviews</li>
                      <li>• Technical Skill Assessment</li>
                      <li>• Soft Skills Training</li>
                      <li>• Aptitude Test Preparation</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-blue-900 mb-3">Placement Support</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Industry Expert Sessions</li>
                      <li>• Company-specific Preparation</li>
                      <li>• Career Counseling</li>
                      <li>• Alumni Network Support</li>
                      <li>• Internship Opportunities</li>
                    </ul>
                  </div>
                  </div>
                </div>
              </div>

            {/* Recent Placements */}
            <div>
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">Recent Placements (2025)</h3>
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-blue-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">Student Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">Company</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">Package (LPA)</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">G Manoj</td>
                        <td className="px-4 py-3 text-sm text-gray-700">NETFLIX</td>
                        <td className="px-4 py-3 text-sm text-gray-700">50</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Frontend Developer</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">G Puneeth Reddy</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Microsoft</td>
                        <td className="px-4 py-3 text-sm text-gray-700">30</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Backend Developer</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">E Santhosh</td>
                        <td className="px-4 py-3 text-sm text-gray-700">IRCTC</td>
                        <td className="px-4 py-3 text-sm text-gray-700">25</td>
                        <td className="px-4 py-3 text-sm text-gray-700">UI/UX Developer</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">B Sravani</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Opera</td>
                        <td className="px-4 py-3 text-sm text-gray-700">21</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Database Engineer</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">G Ganesh</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Meta</td>
                        <td className="px-4 py-3 text-sm text-gray-700">30</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Automation Engineer</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">B Satish</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Zohocorp</td>
                        <td className="px-4 py-3 text-sm text-gray-700">25</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Full Stack Developer</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === 'rd' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Research & Development</h2>
            
            {/* R&D Statistics */}
            <div className="mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-900">25+</div>
                  <div className="text-sm text-blue-700">Research Papers</div>
                    </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-900">8</div>
                  <div className="text-sm text-green-700">Ph.D Faculty</div>
                  </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-900">5</div>
                  <div className="text-sm text-purple-700">Ongoing Projects</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-900">3</div>
                  <div className="text-sm text-orange-700">Patents Filed</div>
                </div>
              </div>
            </div>

            {/* Research Areas */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">Research Areas</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-blue-900 mb-3">Artificial Intelligence & Machine Learning</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Deep Learning Applications</li>
                    <li>• Natural Language Processing</li>
                    <li>• Computer Vision</li>
                    <li>• Predictive Analytics</li>
                    <li>• Neural Networks</li>
                  </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-green-900 mb-3">Cybersecurity & Network Security</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Cryptography</li>
                    <li>• Network Intrusion Detection</li>
                    <li>• Blockchain Security</li>
                    <li>• Digital Forensics</li>
                    <li>• Secure Communication</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-purple-900 mb-3">Data Science & Big Data</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Data Mining</li>
                    <li>• Big Data Analytics</li>
                    <li>• Cloud Computing</li>
                    <li>• Distributed Systems</li>
                    <li>• Data Visualization</li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-orange-900 mb-3">Internet of Things (IoT)</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Smart Systems</li>
                    <li>• Sensor Networks</li>
                    <li>• Embedded Systems</li>
                    <li>• Wireless Communication</li>
                    <li>• IoT Security</li>
                  </ul>
                </div>
                </div>
              </div>

            {/* Ongoing Research Projects */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">Ongoing Research Projects</h3>
              <div className="space-y-4">
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900">AI-Powered Smart Agriculture System</h4>
                      <p className="text-sm text-gray-600">Duration: 2023-2025 | Funding: ₹5,00,000</p>
                    </div>
                  </div>
                  <p className="text-gray-700">Developing an intelligent system for precision agriculture using IoT sensors, machine learning algorithms, and mobile applications.</p>
                </div>
                
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-900">Blockchain-based Healthcare Data Management</h4>
                      <p className="text-sm text-gray-600">Duration: 2024-2026 | Funding: ₹7,50,000</p>
                    </div>
                  </div>
                  <p className="text-gray-700">Creating a secure and transparent healthcare data management system using blockchain technology for patient privacy and data integrity.</p>
                </div>
                
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-900">Cybersecurity Framework for Smart Cities</h4>
                      <p className="text-sm text-gray-600">Duration: 2023-2025 | Funding: ₹6,00,000</p>
                    </div>
                  </div>
                  <p className="text-gray-700">Developing a comprehensive cybersecurity framework to protect smart city infrastructure from cyber threats and attacks.</p>
                </div>
              </div>
            </div>

            {/* R&D Coordinator */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">R&D Coordinator</h3>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-blue-900">Dr. G Sita Ratnam</h4>
                    <p className="text-blue-700 font-medium">R&D Coordinator - CSE Department</p>
                    <p className="text-sm text-gray-600">Professor | Ph.D, M.Tech</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Leading research initiatives and coordinating R&D activities in the Computer Science & Engineering department.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Research Publications */}
            <div>
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">Recent Publications</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-800">"Deep Learning Approaches for Medical Image Analysis"</h4>
                      <p className="text-sm text-gray-600">Published in: IEEE Transactions on Medical Imaging, 2024</p>
                      <p className="text-sm text-gray-600">Authors: Dr. A S C Tejaswini Kone, Dr. G Sita Ratnam</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-800">"Blockchain Technology in Supply Chain Management"</h4>
                      <p className="text-sm text-gray-600">Published in: International Journal of Computer Science, 2024</p>
                      <p className="text-sm text-gray-600">Authors: Dr. S Venkata Rao, Dr. P Rajesh Kumar</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-800">"IoT-based Smart Home Security System"</h4>
                      <p className="text-sm text-gray-600">Published in: Journal of Network and Computer Applications, 2024</p>
                      <p className="text-sm text-gray-600">Authors: Dr. R Siva Kumar, Dr. V Satyanarayana</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === 'idea-cell' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Idea Cell</h2>
            
            {/* Idea Cell Overview */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg mb-6">
                <h3 className="text-2xl font-bold mb-4">Innovation & Entrepreneurship Hub</h3>
                <p className="text-lg text-blue-100 mb-4">
                  The Idea Cell is a dynamic platform that fosters innovation, creativity, and entrepreneurial thinking among students. We provide mentorship, resources, and opportunities to transform ideas into reality.
                </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">50+</div>
                    <div className="text-sm text-blue-200">Ideas Submitted</div>
                    </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">15+</div>
                    <div className="text-sm text-blue-200">Startups Launched</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">25+</div>
                    <div className="text-sm text-blue-200">Mentors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">5</div>
                    <div className="text-sm text-blue-200">Awards Won</div>
                  </div>
                </div>
                </div>
              </div>

            {/* Core Activities */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">Core Activities</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-blue-900">Idea Incubation</h4>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Idea submission and evaluation</li>
                    <li>• Feasibility analysis</li>
                    <li>• Market research support</li>
                    <li>• Prototype development</li>
                    <li>• Business plan preparation</li>
                  </ul>
                </div>
                
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-green-900">Mentorship Program</h4>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Industry expert guidance</li>
                    <li>• Alumni mentorship</li>
                    <li>• Faculty support</li>
                    <li>• Peer learning groups</li>
                    <li>• Skill development workshops</li>
                  </ul>
                </div>
                
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-purple-900">Competitions & Events</h4>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Hackathons and coding contests</li>
                    <li>• Business plan competitions</li>
                    <li>• Innovation challenges</li>
                    <li>• Startup pitch events</li>
                    <li>• Tech exhibitions</li>
                  </ul>
                </div>
                
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <ExternalLink className="w-6 h-6 text-orange-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-orange-900">Startup Support</h4>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Funding opportunities</li>
                    <li>• Legal and IP support</li>
                    <li>• Marketing assistance</li>
                    <li>• Networking events</li>
                    <li>• Investor connections</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Success Stories */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">Success Stories</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-blue-900 mb-2">EduTech Solutions</h4>
                  <p className="text-sm text-gray-600 mb-3">Founded by: Rajesh Kumar (2023 Batch)</p>
                <p className="text-gray-700 mb-4">
                    A platform that provides personalized learning experiences using AI and machine learning algorithms. Currently serving 1000+ students across 5 cities.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">EdTech</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">AI/ML</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">₹50L Funding</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-green-900 mb-2">AgriTech Innovations</h4>
                  <p className="text-sm text-gray-600 mb-3">Founded by: Priya Sharma (2022 Batch)</p>
                  <p className="text-gray-700 mb-4">
                    IoT-based smart farming solutions that help farmers optimize crop yield and reduce water usage. Deployed in 50+ farms across Andhra Pradesh.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">IoT</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Agriculture</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">₹25L Revenue</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Idea Cell Coordinator */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">Idea Cell Coordinator</h3>
              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-purple-900">K A Bhavani</h4>
                    <p className="text-purple-700 font-medium">Idea Cell Coordinator - CSE Department</p>
                    <p className="text-sm text-gray-600">Assistant Professor | M.Tech</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Leading innovation initiatives and coordinating Idea Cell activities to foster entrepreneurship and creativity among students.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
                  <div>
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-blue-900">Innovation Hackathon 2024</h4>
                      <p className="text-sm text-gray-600">48-hour coding competition with industry challenges</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600">March 15-17, 2024</p>
                      <p className="text-xs text-gray-500">Prize: ₹1,00,000</p>
                  </div>
                </div>
              </div>

                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-green-900">Startup Pitch Competition</h4>
                      <p className="text-sm text-gray-600">Present your business idea to industry experts</p>
              </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">April 20, 2024</p>
                      <p className="text-xs text-gray-500">Prize: ₹50,000</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-purple-900">Tech Innovation Expo</h4>
                      <p className="text-sm text-gray-600">Showcase your innovative projects and prototypes</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-purple-600">May 10, 2024</p>
                      <p className="text-xs text-gray-500">Exhibition</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === 'hod' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">CSE Department - HoD</h2>
            <div className="text-center py-12">
              <p className="text-gray-600">HoD information will be displayed here</p>
            </div>
          </>
        )}

        {/* Fallback for unknown sections */}
        {!['about', 'vision-mission', 'hod', 'courses', 'curriculum', 'peo-psos-pos', 'faculty', 'projects', 'placements', 'rd', 'idea-cell', 'club-activities', 'gallery', 'alumni'].includes(activeSection) && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Section Not Found</h2>
            <div className="text-center py-12">
              <p className="text-gray-600">Content for section "{activeSection}" is not available.</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DynamicContent;
