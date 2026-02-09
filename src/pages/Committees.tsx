import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';

interface Committee {
  id: number;
  name: string;
  coordinator: string;
  frequency: string;
  description: string;
  icon: string;
}

const committees: Committee[] = [
  {
    id: 1,
    name: "ACADEMIC COMMITTEE",
    coordinator: "Dr. G Vidya Pradeep Varma",
    frequency: "Once Per Month",
    description: "Oversees curriculum development, academic standards, and educational quality enhancement",
    icon: "📚"
  },
  {
    id: 2,
    name: "INTERNAL QUALITY ASSURANCE CELL",
    coordinator: "Mrs. K. Chandana, Associate Professor, ME",
    frequency: "Twice Per Semester",
    description: "Ensures continuous quality improvement in teaching, learning, and evaluation processes",
    icon: "✓"
  },
  {
    id: 3,
    name: "EXAMINATION COMMITTEE",
    coordinator: "Dr. K S B Vara Prasad",
    frequency: "Once Per Month",
    description: "Manages examination processes, evaluation systems, and academic assessment protocols",
    icon: "📝"
  },
  {
    id: 4,
    name: "RESEARCH AND DEVELOPMENT CELL",
    coordinator: "Dr. K. Sri Ram Vikas, Associate Professor, ME",
    frequency: "Twice Per Year",
    description: "Promotes research culture, innovation, and facilitates faculty and student research projects",
    icon: "🔬"
  },
  {
    id: 5,
    name: "GRIEVANCE REDRESSAL COMMITTEE",
    coordinator: "Dr. K. Dayana, Associate Professor, ME",
    frequency: "Once Per Year",
    description: "Addresses and resolves student and staff grievances in a fair and timely manner",
    icon: "⚖️"
  },
  {
    id: 6,
    name: "WOMEN GRIEVANCE COMMITTEE",
    coordinator: "Dr. K Dayana, Assoc. Prof, ME",
    frequency: "Twice Per Year",
    description: "Provides a safe platform for addressing gender-specific issues and ensuring women's welfare",
    icon: "👥"
  },
  {
    id: 7,
    name: "ANTI-RAGGING COMMITTEE",
    coordinator: "Mr. Ch Veeru Naidu, NSS",
    frequency: "Once Per Year",
    description: "Prevents ragging incidents and ensures a safe, respectful campus environment for all students",
    icon: "🛡️"
  },
  {
    id: 8,
    name: "TRAINING & PLACEMENT CELL",
    coordinator: "Dr. A. Tulasee Naidu, HoD, MBA",
    frequency: "Twice Per Year",
    description: "Bridges academia and industry, facilitating career opportunities and skill development programs",
    icon: "💼"
  },
  {
    id: 9,
    name: "SC/ST/OBC CELL",
    coordinator: "Dr. K. Dayana, Associate Professor, ME",
    frequency: "Once Per Year",
    description: "Ensures equal opportunities and support for students from reserved categories",
    icon: "🤝"
  },
  {
    id: 10,
    name: "DISCIPLINARY COMMITTEE",
    coordinator: "Mr. A. Rishi Kumar, Physical Director, BS&H",
    frequency: "Once Per Year",
    description: "Maintains campus discipline and addresses behavioral concerns with fairness and integrity",
    icon: "⚡"
  },
  {
    id: 11,
    name: "STUDENT WELFARE COMMITTEE",
    coordinator: "Dr. Kusuar Jahan, ECE",
    frequency: "Once Per Year",
    description: "Focuses on overall student well-being, welfare schemes, and support services",
    icon: "💙"
  },
  {
    id: 12,
    name: "ENTREPRENEURSHIP INNOVATION & STARTUP CENTRE",
    coordinator: "Dr. A. Tulasee Naidu, HoD, MBA",
    frequency: "Once Per Year",
    description: "Nurtures entrepreneurial mindset and supports student startups and innovation initiatives",
    icon: "💡"
  },
  {
    id: 13,
    name: "LIBRARY ADVISORY COMMITTEE",
    coordinator: "Mr. K Ramakrishna, Librarian",
    frequency: "Once Per Year",
    description: "Enhances library resources, digital collections, and learning support services",
    icon: "📖"
  },
  {
    id: 14,
    name: "CENTRAL MENTORING-CUM-COUNSELLING COMMITTEE",
    coordinator: "Mr. B. Jeevan Rao, HoD ECE",
    frequency: "Once Per Month",
    description: "Provides academic and personal guidance through structured mentoring and counseling programs",
    icon: "🌟"
  },
  {
    id: 15,
    name: "CULTURAL COMMITTEE",
    coordinator: "Mr. K. Bhargav, Assistant Professor, BS&H",
    frequency: "Once Per Year",
    description: "Organizes cultural events, festivals, and activities celebrating diversity and creativity",
    icon: "🎭"
  },
  {
    id: 16,
    name: "NATIONAL SERVICE SCHEME",
    coordinator: "Mr. Ch. Veeru Naidu, Asst Professor, ME",
    frequency: "Once Per Year",
    description: "Promotes community service, social responsibility, and personality development through NSS activities",
    icon: "🌍"
  },
  {
    id: 17,
    name: "SPORTS COMMITTEE",
    coordinator: "Mr. A. Rishi Kumar, Physical Director, BS&H",
    frequency: "Twice Per Year",
    description: "Encourages sports participation, physical fitness, and organizes inter-collegiate competitions",
    icon: "🏆"
  },
  {
    id: 18,
    name: "ALUMNI COMMITTEE",
    coordinator: "Mr. K. Bhargav, Assistant Professor, BS&H",
    frequency: "Once Per Year",
    description: "Strengthens alumni network, facilitates engagement, and leverages alumni expertise for student benefit",
    icon: "🎓"
  },
  {
    id: 19,
    name: "INTERNAL COMPLAINT COMMITTEE",
    coordinator: "Dr. A. Tulasee Naidu, HoD, MBA",
    frequency: "Twice Per Semester",
    description: "Handles workplace harassment complaints and ensures a safe, dignified environment for all",
    icon: "📋"
  },
  {
    id: 20,
    name: "YOGA INSTRUCTOR",
    coordinator: "Mrs. K. Chandana, Associate Professor, ME",
    frequency: "Twice Per Semester",
    description: "Promotes physical and mental wellness through regular yoga sessions and holistic health practices",
    icon: "🧘"
  }
];

const CommitteesPage: React.FC = () => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <LeaderPageNavbar backHref="/about" />
      <ScrollProgressIndicator />

      {/* Hero Section — Chairman-style spacing */}
      <section
        className="relative min-h-[85vh] md:min-h-[90vh] pt-24 md:pt-28 pb-12 md:pb-16 flex items-center overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #422006 0%, #713f12 35%, #a16207 70%, #ca8a04 100%)',
        }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/60 from-40% via-black/40 to-transparent"
          aria-hidden
        />
        <div className="container mx-auto px-4 md:px-10 lg:px-12 relative z-10">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="inline-block px-4 py-1.5 text-sm md:text-base font-bold tracking-[0.2em] text-white uppercase bg-white/20 backdrop-blur-sm border border-white/40 rounded-full mb-5">
              Governance & Excellence
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-sm mb-4">
              Institutional Committees
            </h1>
            <p className="text-base md:text-lg text-white/90 leading-relaxed font-poppins max-w-xl">
              VIET has established various committees to ensure effective governance, quality assurance, and comprehensive student support across all aspects of institutional functioning.
            </p>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/80 to-transparent"></div>
          <div className="w-2 h-2 rounded-full bg-amber-300"></div>
        </div>
      </section>

      <div className="committees-page">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600;700&display=swap');

          .committees-page {
            min-height: 100vh;
            background: linear-gradient(to bottom, #f8f9fc 0%, #ffffff 100%);
            padding: 60px 0;
          }

          .content-wrapper {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 24px;
          }

          .hero-section {
            text-align: center;
            margin-bottom: 60px;
            animation: fadeInUp 0.8s ease-out;
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .hero-badge {
            display: inline-block;
            padding: 8px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 50px;
            font-family: 'Inter', sans-serif;
            font-size: 0.813rem;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 20px;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          }

          .hero-title {
            font-family: 'Playfair Display', serif;
            font-size: 3.5rem;
            font-weight: 900;
            background: linear-gradient(135deg, #1a1a2e 0%, #667eea 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin: 0 0 20px 0;
            line-height: 1.2;
            letter-spacing: -1px;
          }

          .hero-subtitle {
            font-family: 'Inter', sans-serif;
            font-size: 1.125rem;
            color: #4a5568;
            max-width: 800px;
            margin: 0 auto 40px;
            line-height: 1.8;
            font-weight: 400;
          }

          .stats-container {
            display: flex;
            justify-content: center;
            gap: 60px;
            margin: 50px 0;
            flex-wrap: wrap;
          }

          .stat-item {
            text-align: center;
            animation: fadeInUp 0.8s ease-out;
          }

          .stat-item:nth-child(2) {
            animation-delay: 0.1s;
          }

          .stat-item:nth-child(3) {
            animation-delay: 0.2s;
          }

          .stat-number {
            font-family: 'Playfair Display', serif;
            font-size: 3rem;
            font-weight: 900;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1;
            margin-bottom: 8px;
          }

          .stat-label {
            font-family: 'Inter', sans-serif;
            font-size: 0.875rem;
            color: #718096;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
          }

          .info-section {
            background: white;
            border-radius: 20px;
            padding: 48px;
            margin-bottom: 50px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
            animation: fadeInUp 1s ease-out 0.3s backwards;
          }

          .info-title {
            font-family: 'Playfair Display', serif;
            font-size: 2rem;
            font-weight: 700;
            color: #1a202c;
            margin-bottom: 32px;
            text-align: center;
          }

          .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 28px;
          }

          .info-card {
            padding: 28px;
            background: #f7fafc;
            border-radius: 12px;
            border-left: 4px solid #667eea;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .info-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
          }

          .info-card h3 {
            font-family: 'Inter', sans-serif;
            font-size: 1.125rem;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 12px;
          }

          .info-card p {
            font-family: 'Inter', sans-serif;
            font-size: 0.938rem;
            color: #4a5568;
            line-height: 1.7;
            margin: 0;
          }

          .table-container {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
            border: 1px solid #e2e8f0;
            animation: fadeInUp 1s ease-out 0.5s backwards;
          }

          .committees-table {
            width: 100%;
            border-collapse: collapse;
          }

          .committees-table thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }

          .committees-table thead th {
            padding: 20px 24px;
            text-align: left;
            font-family: 'Inter', sans-serif;
            font-size: 0.875rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .committees-table tbody tr {
            border-bottom: 1px solid #e2e8f0;
            transition: all 0.3s ease;
            cursor: pointer;
          }

          .committees-table tbody tr:hover {
            background: #f7fafc;
          }

          .committees-table tbody tr.expanded {
            background: #eef2ff;
          }

          .committees-table tbody td {
            padding: 20px 24px;
            font-family: 'Inter', sans-serif;
            color: #2d3748;
          }

          .committee-icon-cell {
            width: 60px;
            text-align: center;
          }

          .table-icon {
            font-size: 1.75rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
            border-radius: 12px;
            transition: transform 0.3s ease;
          }

          .committees-table tbody tr:hover .table-icon {
            transform: scale(1.1);
          }

          .committee-number {
            font-size: 0.75rem;
            font-weight: 700;
            color: #667eea;
            background: #eef2ff;
            padding: 4px 10px;
            border-radius: 12px;
            display: inline-block;
            margin-bottom: 6px;
          }

          .committee-name-cell {
            font-weight: 600;
            color: #1a202c;
            font-size: 0.938rem;
          }

          .coordinator-cell {
            color: #4a5568;
            font-size: 0.875rem;
          }

          .frequency-badge {
            display: inline-block;
            padding: 6px 14px;
            background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
            color: #667eea;
            border-radius: 20px;
            font-size: 0.813rem;
            font-weight: 600;
            border: 1px solid rgba(102, 126, 234, 0.2);
          }

          .expand-icon {
            font-size: 1.25rem;
            color: #667eea;
            transition: transform 0.3s ease;
          }

          .committees-table tbody tr.expanded .expand-icon {
            transform: rotate(180deg);
          }

          .expanded-content {
            padding: 0;
          }

          .expanded-inner {
            padding: 24px;
            background: #f8fafc;
            border-top: 2px solid #667eea;
          }

          .description-text {
            font-family: 'Inter', sans-serif;
            font-size: 0.938rem;
            color: #4a5568;
            line-height: 1.7;
            margin: 0;
          }

          @media (max-width: 1024px) {
            .hero-title {
              font-size: 2.75rem;
            }

            .committees-table {
              font-size: 0.875rem;
            }

            .committees-table thead th,
            .committees-table tbody td {
              padding: 16px 20px;
            }
          }

          @media (max-width: 768px) {
            .committees-page {
              padding: 40px 0;
            }

            .content-wrapper {
              padding: 0 16px;
            }

            .hero-title {
              font-size: 2.25rem;
            }

            .hero-subtitle {
              font-size: 1rem;
            }

            .stat-number {
              font-size: 2.25rem;
            }

            .stats-container {
              gap: 40px;
            }

            .info-section {
              padding: 32px 24px;
            }

            .info-grid {
              grid-template-columns: 1fr;
            }

            .table-container {
              overflow-x: auto;
            }

            .committees-table {
              min-width: 800px;
            }
          }

          @media (max-width: 480px) {
            .hero-title {
              font-size: 1.875rem;
            }

            .hero-badge {
              font-size: 0.75rem;
              padding: 6px 16px;
            }

            .info-section {
              padding: 24px 20px;
            }

            .committees-table thead th,
            .committees-table tbody td {
              padding: 12px 16px;
            }
          }
        `}</style>

        <div className="content-wrapper">
          <div className="hero-section">
            <div className="hero-badge">Governance & Excellence</div>
            <h1 className="hero-title">Institutional Committees</h1>
            <p className="hero-subtitle">
              VIET has established various committees to ensure effective governance, 
              quality assurance, and comprehensive student support across all aspects 
              of institutional functioning.
            </p>
            
            <div className="stats-container">
              <div className="stat-item">
                <div className="stat-number">20</div>
                <div className="stat-label">Active Committees</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">Student Coverage</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support Available</div>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h2 className="info-title">Our Commitment to Excellence</h2>
            <div className="info-grid">
              <div className="info-card">
                <h3>Quality Assurance</h3>
                <p>
                  Each committee operates with clearly defined objectives, ensuring systematic 
                  monitoring and continuous improvement of institutional processes and student outcomes.
                </p>
              </div>
              <div className="info-card">
                <h3>Student-Centric Approach</h3>
                <p>
                  From academic support to welfare initiatives, our committees work collaboratively 
                  to create a nurturing environment that promotes holistic development.
                </p>
              </div>
              <div className="info-card">
                <h3>Transparent Governance</h3>
                <p>
                  Regular meetings and structured frameworks ensure accountability, enabling 
                  timely resolution of issues and effective implementation of institutional policies.
                </p>
              </div>
            </div>
          </div>

          <div className="table-container">
            <table className="committees-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Committee Name</th>
                  <th>Coordinator</th>
                  <th>Meeting Frequency</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {committees.map((committee) => (
                  <React.Fragment key={committee.id}>
                    <tr 
                      className={expandedRow === committee.id ? 'expanded' : ''}
                      onClick={() => toggleRow(committee.id)}
                    >
                      <td className="committee-icon-cell">
                        <span className="table-icon">{committee.icon}</span>
                      </td>
                      <td>
                        <div className="committee-number">#{committee.id}</div>
                        <div className="committee-name-cell">{committee.name}</div>
                      </td>
                      <td className="coordinator-cell">{committee.coordinator}</td>
                      <td>
                        <span className="frequency-badge">{committee.frequency}</span>
                      </td>
                      <td style={{ textAlign: 'center', width: '50px' }}>
                        <span className="expand-icon">▼</span>
                      </td>
                    </tr>
                    {expandedRow === committee.id && (
                      <tr className="expanded">
                        <td colSpan={5} className="expanded-content">
                          <div className="expanded-inner">
                            <p className="description-text">{committee.description}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CommitteesPage;
