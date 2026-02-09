import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight,
  ExternalLink,
  FileText,
  User
} from 'lucide-react';

interface RDynamicContentProps {
  activeSection: string;
}

const RDynamicContent: React.FC<RDynamicContentProps> = ({ activeSection }) => {
  // R&D Committee data - Exact data from website
  const rdCommittee = [
    { sno: 1, name: 'Dr G.Vidya Pradeep Varma', designation: 'Principal', role: 'Chairman', responsibility: 'Over all Supervision and guidance' },
    { sno: 2, name: 'Dr T Satyanarayana', designation: 'Associate Professor', role: 'R&D Dean', responsibility: 'Co-ordinating all the members, Conducting R&D meetings and compiling data' },
    { sno: 3, name: 'Dr D Santha Rao', designation: 'Professor', role: 'member', responsibility: 'Advisor of R&D' },
    { sno: 4, name: 'Dr.P.V.V Satyanarayana', designation: 'Associate Professor', role: 'member', responsibility: 'Monitoring of R&D activities at Mechanical Dept. level' },
    { sno: 5, name: 'Ms M Sowjanya', designation: 'Assistant Professor', role: 'member', responsibility: 'Monitoring of R&D activities at CSE Dept. level' },
    { sno: 6, name: 'Mrs L. Keerthi', designation: 'Assistant Professor', role: 'member', responsibility: 'Monitoring of R&D activities at ECE Dept. level' }
  ];

  // Department Coordinators data - Exact data from website
  const departmentCoordinators = [
    { sno: 1, name: 'Dr P.V.V Satyanarayana', position: 'R&D Department Coordinator', department: 'Mechanical', photo: '/FACULTY/rd-coordinator-1.jpg' },
    { sno: 2, name: 'Dr.M Uday Bhaskar', position: 'R&D Department Coordinator', department: 'BS&H', photo: '/FACULTY/rd-coordinator-2.jpg' },
    { sno: 3, name: 'Ms M Sowjanya', position: 'R&D Department Coordinator', department: 'Computer Science and Engineering', photo: '/FACULTY/rd-coordinator-3.jpg' },
    { sno: 4, name: 'Mrs L. Keerthi', position: 'R&D Department Coordinator', department: 'ECE', photo: '/FACULTY/rd-coordinator-4.jpg' },
    { sno: 5, name: 'Mrs S Jyothi Rani', position: 'R&D Department Coordinator', department: 'EEE', photo: '/FACULTY/rd-coordinator-5.jpg' },
    { sno: 6, name: 'MS.T Rohini', position: 'R&D Department Coordinator', department: 'Civil', photo: '/FACULTY/rd-coordinator-6.jpg' },
    { sno: 7, name: 'Dr. S Kesava Nagu', position: 'R&D Department Coordinator', department: 'MBA', photo: '/FACULTY/rd-coordinator-7.jpg' }
  ];

  // Ph.D Holders data - Exact data from website (19 entries)
  const phdHolders = [
    { sno: 1, name: 'Dr G.V.Pradeep Varma', designation: 'Professor & Principal', experience: 29, department: 'Mechanical' },
    { sno: 2, name: 'Dr D.Santha Rao', designation: 'Professor, HoD & Dean Academics', experience: 24, department: 'Mechanical' },
    { sno: 3, name: 'Dr C.Govinda Rajulu', designation: 'Professor & CE', experience: 25, department: 'Mechanical' },
    { sno: 4, name: 'Dr. Gondi Siva Karuna', designation: 'Associate Professor', experience: 20, department: 'Mechanical' },
    { sno: 5, name: 'Dr. Satyanarayana Tirlangi', designation: 'Associate Professor & R&D Dean', experience: 14, department: 'Mechanical' },
    { sno: 6, name: 'Dr.P.V.V.Satyanarayana', designation: 'Associate Professor', experience: 7, department: 'Mechanical' },
    { sno: 7, name: 'Dr. A S C Tejaswini Kone', designation: 'Associate Professor & HoD', experience: 7, department: 'CSE' },
    { sno: 8, name: 'Dr P.Lalitha Kumari', designation: 'Associate Professor', experience: 10, department: 'CSE' },
    { sno: 9, name: 'DR. Kausar Jahan', designation: 'Associate Professor', experience: 5, department: 'ECE' },
    { sno: 10, name: 'DR. B. Jeevanarao', designation: 'Associate Professor & HoD', experience: 15, department: 'ECE' },
    { sno: 11, name: 'Dr G Madhusudhana Rao', designation: 'Professor', experience: 24, department: 'EEE' },
    { sno: 12, name: 'Dr P Vamsi Krishna', designation: 'Assistant Professor', experience: 2, department: 'EEE' },
    { sno: 13, name: 'Dr. Kannam Naidu Cheepurupalli', designation: 'Professor & HoD', experience: 23, department: 'Civil' },
    { sno: 14, name: 'Dr. K. Dayana', designation: 'Professor', experience: 17, department: 'Civil' },
    { sno: 15, name: 'Dr.Maradana Uday Bhaskar', designation: 'Associate Professor & HoD', experience: 16, department: 'BS&H' },
    { sno: 16, name: 'Dr. Shaik Raziya', designation: 'Associate Professor', experience: 3, department: 'BS&H' },
    { sno: 17, name: 'Dr. Kadimpalli Rajubabu', designation: 'Associate Professor', experience: 3, department: 'MBA' },
    { sno: 18, name: 'Dr. N Nooka Raju', designation: 'Associate Professor', experience: 4, department: 'MBA' },
    { sno: 19, name: 'Dr. S Kesava Nagu', designation: 'Associate Professor', experience: 4, department: 'MBA' }
  ];

  // Ph.D Pursuing data - Exact data from website (26 entries)
  const phdPursuing = [
    { sno: 1, name: 'Mr.Miriyala Ram Babu', designation: 'Assistant Professor', experience: 17, department: 'Mechanical' },
    { sno: 2, name: 'Mr.Raja Ratna Kumar V', designation: 'Assistant Professor', experience: 15, department: 'Mechanical' },
    { sno: 3, name: 'Mr.A Murali Krishna', designation: 'Assistant Professor', experience: 11, department: 'Mechanical' },
    { sno: 4, name: 'Mrs.Korla Chandana', designation: 'Assistant Professor', experience: 8, department: 'Mechanical' },
    { sno: 5, name: 'Mr.Chittiboyina Kiran Kumar', designation: 'Assistant Professor', experience: 7, department: 'Mechanical' },
    { sno: 6, name: 'Mr.Ch Veeru Naidu', designation: 'Assistant Professor', experience: 10, department: 'Mechanical' },
    { sno: 7, name: 'Mr.Kare Jagadeswara Rao', designation: 'Assistant Professor', experience: 6, department: 'Mechanical' },
    { sno: 8, name: 'Mr Peeri Prasad', designation: 'Assistant Professor', experience: 10, department: 'CSE' },
    { sno: 9, name: 'Mrs M.Usha', designation: 'Assistant Professor', experience: 10, department: 'CSE' },
    { sno: 10, name: 'Mrs Shalini Bharide', designation: 'Assistant Professor', experience: 8, department: 'CSE' },
    { sno: 11, name: 'Mr Kalla Vijay', designation: 'Assistant Professor', experience: 8, department: 'CSE' },
    { sno: 12, name: 'Mrs K Prasanna Latha', designation: 'Assistant Professor', experience: 2, department: 'CSE' },
    { sno: 13, name: 'Mrs A Navya', designation: 'Assistant Professor', experience: 8, department: 'CSE' },
    { sno: 14, name: 'Mrs K. Kanthi Kinnera', designation: 'Assistant Professor', experience: 13, department: 'ECE' },
    { sno: 15, name: 'Mr M. Bhaskara Naidu', designation: 'Assistant Professor', experience: 4, department: 'ECE' },
    { sno: 16, name: 'Mrs V. Nookaratnam', designation: 'Assistant Professor', experience: 7, department: 'BS&H' },
    { sno: 17, name: 'Mrs L. Keerthi', designation: 'Assistant Professor', experience: 4, department: 'ECE' },
    { sno: 18, name: 'Mrs T. Malasri', designation: 'Assistant Professor', experience: 7, department: 'ECE' },
    { sno: 19, name: 'Mr M. Hemanth Kumar', designation: 'Assistant Professor', experience: 7, department: 'ECE' },
    { sno: 20, name: 'Mr. Varaprasad .K. S. B', designation: 'Associate Professor & HoD', experience: 14, department: 'EEE' },
    { sno: 21, name: 'Mr D J Tataji', designation: 'Assistant Professor', experience: 12, department: 'EEE' },
    { sno: 22, name: 'Mr T Sreenu', designation: 'Assistant Professor', experience: 14, department: 'EEE' },
    { sno: 23, name: 'Mr Ch B R Srikanth', designation: 'Assistant Professor', experience: 4, department: 'EEE' },
    { sno: 24, name: 'Mr.Chinthapalli Sai Kiran', designation: 'Assistant Professor', experience: 4, department: 'CIVIL' },
    { sno: 25, name: 'Mr. Kusumanchi Jagan', designation: 'Assistant Professor', experience: 6, department: 'CIVIL' },
    { sno: 26, name: 'Mr. K. Bhargav', designation: 'Assistant Professor', experience: 4, department: 'BS&H' }
  ];

  return (
    <Card className="shadow-lg">
      <CardContent className="p-8">
        {/* About R & D Section */}
        {activeSection === 'about' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">About Research & Development</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6">
                At <strong>VIET,</strong> Research & Development (R&D) is the <strong>catalyst for technological breakthroughs and academic brilliance.</strong> It transforms ideas into innovations, simplifies complex concepts, and drives progress toward a smarter future.
              </p>
              <p className="text-gray-700 mb-6">
                R&D <strong>ignites curiosity, fosters critical thinking, and sharpens problem-solving skills,</strong> empowering students and faculty to push boundaries and redefine possibilities. Every discovery fuels enthusiasm, paving the way for excellence in engineering, technology, and beyond.
              </p>
              <p className="text-gray-700 mb-8 font-semibold text-blue-900 text-lg">
                <strong>Innovation starts here—where passion meets research, and ideas shape the future!</strong>
              </p>

              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <h3 className="text-2xl font-semibold text-blue-900 mb-4">Research & Development Cell</h3>
                <p className="text-gray-700 mb-4">
                  The <strong>Research and Development Cell</strong> is dedicated to fostering a vibrant research culture within the college. It actively promotes research in emerging and interdisciplinary fields across Engineering, Technology, Science, and Humanities. By encouraging students and faculty to explore frontier areas, the cell enhances their research capabilities and nurtures future innovators. Through participation in conferences, seminars, workshops, and project competitions, budding technocrats gain valuable experience, paving the way for technological and intellectual advancements.
                </p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold text-green-900 mb-4">Objectives of R&D</h3>
                <p className="text-gray-700 mb-4">
                  The <strong>Research & Development (R&D) Cell</strong> at VIET is committed to fostering a dynamic research culture and innovation-driven learning environment. Our key objectives include:
                </p>
                <ol className="space-y-3 text-gray-700 list-decimal list-inside ml-4">
                  <li><strong>Promoting Research Culture:</strong> Creating awareness and opportunities for R&D among students and faculty across all departments</li>
                  <li><strong>Encouraging Academic Growth:</strong> Motivating faculty to pursue research projects, enhance their expertise, and register for Ph.D. programs.</li>
                  <li><strong>Facilitating Publications:</strong> Inspiring students and staff to publish research papers in reputed national and international journals/conferences.</li>
                  <li><strong>Interdisciplinary Research Support:</strong> Encouraging faculty across Engineering, Science, and Humanities to engage in R&D for professional growth.</li>
                  <li><strong>Collaboration with Leading Agencies:</strong> Undertaking projects with <strong>ISRO, DRDO, CSIR, DST, AICTE, UGC, DBT</strong> and more..</li>
                  <li><strong>Student Research Funding:</strong> Assisting students in securing research grants from <strong>TNSCST, IEI (I), DRDO, TCS, Infosys,</strong> etc.</li>
                  <li><strong>Organizing Knowledge Forums:</strong> Securing funds for <strong>seminars, workshops, and faculty development programs (FDPs)</strong> from funding agencies.</li>
                  <li><strong>Enhancing Research Impact:</strong> Developing strategies to increase faculty success in obtaining external research grants.</li>
                  <li><strong>Building Research Networks:</strong> Strengthening collaborations across faculties, institutes, industries, and government organizations.</li>
                  <li><strong>Industry & Community Engagement:</strong> Partnering with industries, government bodies, and professional organizations to promote impactful research.</li>
                  <li><strong>Attracting Research Talent:</strong> Encouraging and supporting research-driven higher-degree students.</li>
                </ol>
                <p className="text-gray-700 mt-6">
                  At <strong>VIET,</strong> we believe research fuels <strong>innovation, progress, and excellence.</strong> Through our R&D initiatives, we are shaping the future of technology and knowledge. <strong>Let's innovate, collaborate, and lead!</strong>
                </p>
              </div>
            </div>
          </>
        )}

        {/* About Director Section */}
        {activeSection === 'director' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">About Director</h2>
            <div className="prose prose-lg max-w-none">
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-6">
                  Information about the R&D Director will be updated here.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Vision and Mission Section */}
        {activeSection === 'vision-mission' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Vision and Mission</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Vision</h3>
                <p className="text-gray-700 italic">
                  Information about the vision of the R&D cell will be updated here.
                </p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-900 mb-4">Mission</h3>
                <p className="text-gray-700 italic">
                  Information about the mission of the R&D cell will be updated here.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Roles & Responsibilities Section */}
        {activeSection === 'roles-responsibilities' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Roles & Responsibilities</h2>
            <div className="prose prose-lg max-w-none">
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-6">
                  Information about roles and responsibilities will be updated here.
                </p>
              </div>
            </div>
          </>
        )}

        {/* R&D Committee Section */}
        {activeSection === 'committee' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">R&D Committee</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 shadow-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">S.No</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Name of the Staff</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Designation</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Role</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Responsibility</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {rdCommittee.map((member) => (
                    <tr key={member.sno} className="hover:bg-gray-50 transition-colors">
                      <td className="border border-gray-300 px-4 py-3">{member.sno}</td>
                      <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">{member.name}</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">{member.designation}</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">{member.role}</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">{member.responsibility}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Department Coordinators Section */}
        {activeSection === 'department-coordinators' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Research & Development Department Coordinators</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 shadow-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold w-16">S.No</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold w-28">Photo</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Name of the Staff</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Department</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {departmentCoordinators.map((coordinator) => (
                    <tr key={coordinator.sno} className="hover:bg-gray-50 transition-colors">
                      <td className="border border-gray-300 px-4 py-3 text-center">{coordinator.sno}</td>
                      <td className="border border-gray-300 px-4 py-3">
                        <div className="w-24 h-32 bg-gray-200 border-2 border-gray-300 flex items-center justify-center relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
                          <img 
                            src={coordinator.photo} 
                            alt={coordinator.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full flex items-center justify-center absolute inset-0 bg-gray-200" style={{ display: 'none' }}>
                            <User className="w-10 h-10 text-gray-400" />
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">{coordinator.name}</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">{coordinator.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Ph.D Holders Section */}
        {activeSection === 'phd-holders' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">List of Ph.D Holders</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 shadow-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">S.No</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Name of the Faculty</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Designation</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Experience</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Department</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {phdHolders.map((holder) => (
                    <tr key={holder.sno} className="hover:bg-gray-50 transition-colors">
                      <td className="border border-gray-300 px-4 py-3">{holder.sno}</td>
                      <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">{holder.name}</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">{holder.designation}</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">{holder.experience}</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">{holder.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Ph.D Pursuing Section */}
        {activeSection === 'phd-pursuing' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">List of Pursuing (PhD)</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 shadow-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">S.No</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Name of the Faculty</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Designation</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Experience</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Department</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {phdPursuing.map((pursuing) => (
                    <tr key={pursuing.sno} className="hover:bg-gray-50 transition-colors">
                      <td className="border border-gray-300 px-4 py-3">{pursuing.sno}</td>
                      <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">{pursuing.name}</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">{pursuing.designation}</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">{pursuing.experience}</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">{pursuing.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* R&D Policy Section */}
        {activeSection === 'policy' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">R & D Policy</h2>
            <div className="prose prose-lg max-w-none">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <p className="text-gray-700 mb-4 font-medium">
                  Click here to check the demo:
                </p>
                <Button asChild className="mt-4 bg-primary hover:bg-primary/90">
                  <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Click Here
                  </a>
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Journals Section */}
        {activeSection === 'journals' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Journals</h2>
            <div className="prose prose-lg max-w-none">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <p className="text-gray-700 mb-6">
                  Information about journals will be updated here.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Patents Section */}
        {activeSection === 'patents' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Patents</h2>
            <div className="prose prose-lg max-w-none">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <p className="text-gray-700 mb-6">
                  Information about patents will be updated here.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Text Books Section */}
        {activeSection === 'textbooks' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Text Books</h2>
            <div className="prose prose-lg max-w-none">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <p className="text-gray-700 mb-6">
                  Information about text books will be updated here.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Consultancy Services Section */}
        {activeSection === 'consultancy' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Consultancy Services</h2>
            <div className="prose prose-lg max-w-none">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <p className="text-gray-700 mb-6">
                  Information about consultancy services will be updated here.
                </p>
              </div>
            </div>
          </>
        )}

        {/* R&D Facilities Section */}
        {activeSection === 'facilities' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">R&D Facilities</h2>
            <div className="prose prose-lg max-w-none">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <p className="text-gray-700 mb-6">
                  Information about R&D facilities will be updated here.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Research Areas Section */}
        {activeSection === 'research-areas' && (
          <>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Research Areas</h2>
            <div className="prose prose-lg max-w-none">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <p className="text-gray-700 mb-6">
                  Information about research areas will be updated here.
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RDynamicContent;
