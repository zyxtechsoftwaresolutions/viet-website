import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, ShieldCheck, FileText, FlaskConical, Scale,
  Users, ShieldAlert, Briefcase, Handshake, Gavel,
  Heart, Lightbulb, Library, UserCheck, Drama,
  Globe, Trophy, GraduationCap, ClipboardList, Flower2,
  ChevronDown, Calendar, User
} from 'lucide-react';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';

interface Committee {
  id: number;
  name: string;
  coordinator: string;
  frequency: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const committees: Committee[] = [
  { id: 1, name: "Academic Committee", coordinator: "Dr. G Vidya Pradeep Varma", frequency: "Once Per Month", description: "Oversees curriculum development, academic standards, and educational quality enhancement across all departments.", icon: BookOpen },
  { id: 2, name: "Internal Quality Assurance Cell", coordinator: "Mrs. K. Chandana, Associate Professor, ME", frequency: "Twice Per Semester", description: "Ensures continuous quality improvement in teaching, learning, and evaluation processes through systematic monitoring.", icon: ShieldCheck },
  { id: 3, name: "Examination Committee", coordinator: "Dr. K S B Vara Prasad", frequency: "Once Per Month", description: "Manages examination processes, evaluation systems, and academic assessment protocols for the institution.", icon: FileText },
  { id: 4, name: "Research and Development Cell", coordinator: "Dr. K. Sri Ram Vikas, Associate Professor, ME", frequency: "Twice Per Year", description: "Promotes research culture, innovation, and facilitates faculty and student research projects and publications.", icon: FlaskConical },
  { id: 5, name: "Grievance Redressal Committee", coordinator: "Dr. K. Dayana, Associate Professor, ME", frequency: "Once Per Year", description: "Addresses and resolves student and staff grievances in a fair, transparent, and timely manner.", icon: Scale },
  { id: 6, name: "Women Grievance Committee", coordinator: "Dr. K Dayana, Assoc. Prof, ME", frequency: "Twice Per Year", description: "Provides a safe platform for addressing gender-specific issues and ensuring women's welfare on campus.", icon: Users },
  { id: 7, name: "Anti-Ragging Committee", coordinator: "Mr. Ch Veeru Naidu, NSS", frequency: "Once Per Year", description: "Prevents ragging incidents and ensures a safe, respectful campus environment for all students.", icon: ShieldAlert },
  { id: 8, name: "Training & Placement Cell", coordinator: "Dr. A. Tulasee Naidu, HoD, MBA", frequency: "Twice Per Year", description: "Bridges academia and industry, facilitating career opportunities and skill development programs for students.", icon: Briefcase },
  { id: 9, name: "SC/ST/OBC Cell", coordinator: "Dr. K. Dayana, Associate Professor, ME", frequency: "Once Per Year", description: "Ensures equal opportunities and comprehensive support for students from reserved categories.", icon: Handshake },
  { id: 10, name: "Disciplinary Committee", coordinator: "Mr. A. Rishi Kumar, Physical Director, BS&H", frequency: "Once Per Year", description: "Maintains campus discipline and addresses behavioral concerns with fairness and institutional integrity.", icon: Gavel },
  { id: 11, name: "Student Welfare Committee", coordinator: "Dr. Kusuar Jahan, ECE", frequency: "Once Per Year", description: "Focuses on overall student well-being, welfare schemes, and comprehensive support services.", icon: Heart },
  { id: 12, name: "Entrepreneurship Innovation & Startup Centre", coordinator: "Dr. A. Tulasee Naidu, HoD, MBA", frequency: "Once Per Year", description: "Nurtures entrepreneurial mindset and supports student startups and innovation initiatives.", icon: Lightbulb },
  { id: 13, name: "Library Advisory Committee", coordinator: "Mr. K Ramakrishna, Librarian", frequency: "Once Per Year", description: "Enhances library resources, digital collections, and learning support services for the academic community.", icon: Library },
  { id: 14, name: "Central Mentoring-cum-Counselling Committee", coordinator: "Mr. B. Jeevan Rao, HoD ECE", frequency: "Once Per Month", description: "Provides academic and personal guidance through structured mentoring and counseling programs.", icon: UserCheck },
  { id: 15, name: "Cultural Committee", coordinator: "Mr. K. Bhargav, Assistant Professor, BS&H", frequency: "Once Per Year", description: "Organizes cultural events, festivals, and activities celebrating diversity and creativity on campus.", icon: Drama },
  { id: 16, name: "National Service Scheme", coordinator: "Mr. Ch. Veeru Naidu, Asst Professor, ME", frequency: "Once Per Year", description: "Promotes community service, social responsibility, and personality development through NSS activities.", icon: Globe },
  { id: 17, name: "Sports Committee", coordinator: "Mr. A. Rishi Kumar, Physical Director, BS&H", frequency: "Twice Per Year", description: "Encourages sports participation, physical fitness, and organizes inter-collegiate competitions.", icon: Trophy },
  { id: 18, name: "Alumni Committee", coordinator: "Mr. K. Bhargav, Assistant Professor, BS&H", frequency: "Once Per Year", description: "Strengthens alumni network, facilitates engagement, and leverages alumni expertise for student benefit.", icon: GraduationCap },
  { id: 19, name: "Internal Complaint Committee", coordinator: "Dr. A. Tulasee Naidu, HoD, MBA", frequency: "Twice Per Semester", description: "Handles workplace harassment complaints and ensures a safe, dignified environment for all members.", icon: ClipboardList },
  { id: 20, name: "Yoga Instructor", coordinator: "Mrs. K. Chandana, Associate Professor, ME", frequency: "Twice Per Semester", description: "Promotes physical and mental wellness through regular yoga sessions and holistic health practices.", icon: Flower2 },
];

const CommitteesPage: React.FC = () => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <LeaderPageNavbar backHref="/about" />

      {/* Hero */}
      <section
        className="relative min-h-[55vh] md:min-h-[90vh] pt-20 md:pt-28 pb-10 md:pb-16 flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #422006 0%, #713f12 35%, #a16207 70%, #ca8a04 100%)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 from-40% via-black/40 to-transparent" aria-hidden />
        <div className="container mx-auto px-4 md:px-10 lg:px-12 relative z-10">
          <motion.div className="max-w-2xl" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="inline-block px-4 py-1.5 text-sm md:text-base font-bold tracking-[0.2em] text-white uppercase bg-white/20 backdrop-blur-sm border border-white/40 rounded-full mb-5">
              Governance & Excellence
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-sm mb-4">
              Institutional Committees
            </h1>
            <p className="text-base md:text-lg text-white/90 leading-relaxed max-w-xl">
              VIET has established various committees to ensure effective governance, quality assurance, and comprehensive student support across all aspects of institutional functioning.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/80 to-transparent" />
          <div className="w-2 h-2 rounded-full bg-amber-300" />
        </div>
      </section>

      {/* Stats Strip */}
      <div className="bg-neutral-950 border-b border-neutral-800">
        <div className="container mx-auto px-4 md:px-10 lg:px-12 py-8 md:py-10">
          <div className="flex flex-wrap justify-center gap-12 md:gap-20">
            {[
              { value: '20', label: 'Active Committees' },
              { value: '100%', label: 'Student Coverage' },
              { value: '24/7', label: 'Support Available' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white tracking-tight">{stat.value}</div>
                <div className="text-xs md:text-sm text-neutral-500 uppercase tracking-widest mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Committees List */}
      <section className="bg-neutral-50">
        <div className="container mx-auto px-4 md:px-10 lg:px-12 py-16 md:py-24">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">All Committees</h2>
            <p className="text-neutral-500 text-sm md:text-base max-w-2xl">
              Each committee operates with defined objectives, ensuring systematic monitoring and improvement of institutional processes.
            </p>
          </div>

          <div className="space-y-3">
            {committees.map((committee, index) => {
              const isOpen = expandedRow === committee.id;
              const Icon = committee.icon;
              return (
                <motion.div
                  key={committee.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.35, delay: index * 0.02 }}
                >
                  <div
                    className={`bg-white border rounded-xl transition-all duration-200 ${
                      isOpen ? 'border-neutral-300 shadow-md' : 'border-neutral-200 hover:border-neutral-300 hover:shadow-sm'
                    }`}
                  >
                    {/* Row */}
                    <button
                      onClick={() => setExpandedRow(isOpen ? null : committee.id)}
                      className="w-full flex items-center gap-4 md:gap-5 px-5 md:px-6 py-4 md:py-5 text-left"
                    >
                      {/* Number */}
                      <span className="text-xs font-semibold text-neutral-400 w-6 text-right flex-shrink-0 tabular-nums">
                        {String(committee.id).padStart(2, '0')}
                      </span>

                      {/* Icon */}
                      <div className={`w-10 h-10 md:w-11 md:h-11 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                        isOpen ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm md:text-[15px] font-semibold text-neutral-900 leading-snug truncate">
                          {committee.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span className="truncate max-w-[180px] sm:max-w-none">{committee.coordinator}</span>
                          </span>
                          <span className="hidden sm:flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {committee.frequency}
                          </span>
                        </div>
                      </div>

                      {/* Frequency badge (mobile) */}
                      <span className="sm:hidden text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full flex-shrink-0">
                        {committee.frequency}
                      </span>

                      {/* Chevron */}
                      <ChevronDown className={`w-4 h-4 text-neutral-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Expanded Content */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                            <div className="ml-[60px] md:ml-[68px] border-t border-neutral-100 pt-4">
                              <p className="text-sm text-neutral-600 leading-relaxed">
                                {committee.description}
                              </p>
                              <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-neutral-500">
                                <span className="flex items-center gap-1.5">
                                  <User className="w-3.5 h-3.5 text-neutral-400" />
                                  {committee.coordinator}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                                  {committee.frequency}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CommitteesPage;
