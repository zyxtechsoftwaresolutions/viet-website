import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Bell,
  BookOpen,
  Building2,
  Calendar,
  Clock,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  Info,
  Mail,
  MapPin,
  Phone,
  ScrollText,
  Shield,
  User,
} from 'lucide-react';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { StickySectionNavBar } from '@/components/AdaptiveSectionNav';

type SectionId =
  | 'examination-cell'
  | 'academic-calendar'
  | 'academic-regulation'
  | 'syllabus'
  | 'time-table'
  | 'circulars'
  | 'results'
  | 'contact';

type NoticeItem = {
  id: number;
  title: string;
  date: string;
  type: string;
  link: string;
  isNew?: boolean;
};

type DocumentRow = {
  title: string;
  href?: string;
};

type ContactPerson = {
  role: string;
  name: string;
  qualification?: string;
  address: string;
  phone: string;
  email: string;
};

const SECTIONS: { id: SectionId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'examination-cell', label: 'Examination Cell', icon: Building2 },
  { id: 'academic-calendar', label: 'Academic Calendar', icon: Calendar },
  { id: 'academic-regulation', label: 'Academic Regulation', icon: FileText },
  { id: 'syllabus', label: 'Syllabus', icon: BookOpen },
  { id: 'time-table', label: 'Time Table', icon: Clock },
  { id: 'circulars', label: 'Circulars', icon: Bell },
  { id: 'results', label: 'Results', icon: Award },
  { id: 'contact', label: 'Contact', icon: Phone },
];

const NOTICE_BOARD: NoticeItem[] = [
  { id: 1, title: 'I M.TECH II SEM REGULAR EXAMINATION RESULTS JULY 2025', date: '18 Jul 2025', type: 'Results', link: '#', isNew: true },
  { id: 2, title: 'I MBA II SEM REGULAR EXAMINATION RESULTS JUNE 2025', date: '15 Jun 2025', type: 'Results', link: '#', isNew: true },
  { id: 3, title: 'I MCA II SEM REGULAR EXAMINATION RESULTS JUNE 2025', date: '15 Jun 2025', type: 'Results', link: '#', isNew: true },
  { id: 4, title: 'I B.TECH II SEM REGULAR EXAMINATION RESULTS MAY 2025', date: '20 May 2025', type: 'Results', link: '#', isNew: true },
  { id: 5, title: 'I B.TECH I SEM SUPPLEMENTARY EXAMINATION RESULTS MAY 2025', date: '18 May 2025', type: 'Results', link: '#', isNew: true },
];

const RESULT_PORTALS = [
  { title: 'B.Tech I Year', subtitle: 'Regular & supplementary results' },
  { title: 'B.Tech II Year', subtitle: 'Regular & supplementary results' },
  { title: 'B.Tech III Year', subtitle: 'Regular & supplementary results' },
  { title: 'B.Tech IV Year', subtitle: 'Regular & supplementary results' },
  { title: 'M.Tech', subtitle: 'Postgraduate examination results' },
  { title: 'MBA', subtitle: 'Management programme results' },
  { title: 'MCA', subtitle: 'Computer applications results' },
  { title: 'JNTU-GV', subtitle: 'University consolidated results' },
];

const CONTACTS: ContactPerson[] = [
  {
    role: 'Chief Superintendent & Principal',
    name: 'Dr. G Vidya Pradeep Varma',
    address: 'VIET (Autonomous), Narava – 530027, Andhra Pradesh, India',
    phone: '',
    email: '',
  },
  {
    role: 'Controller of Examinations (UG & PG)',
    name: 'Dr C. Govinda Rajulu',
    qualification: 'Ph.D., Professor',
    address: 'VIET (Autonomous) Examination Centre, Narava – 530027, Andhra Pradesh, India',
    phone: '+91 9440502945',
    email: 'nt_coe@viet.edu.in',
  },
  {
    role: 'Additional Controller of Examinations (UG & PG)',
    name: 'Mr. Gorle Sunil',
    qualification: 'M.Tech, Assistant Professor',
    address: 'VIET (Autonomous) & Exam Cell In-Charge, JNTU-GV Narava – 530027, Andhra Pradesh, India',
    phone: '+91 8886586022',
    email: 'nt_examcell@vietvsp.com',
  },
  {
    role: 'Additional Controller of Examinations – 2 (UG & PG)',
    name: 'Mr. Kare Jagadeswara Rao',
    qualification: 'M.Tech (Ph.D.), Assistant Professor',
    address: 'VIET (Autonomous) & Exam Cell In-Charge – 2, JNTU-GV Narava – 530027, Andhra Pradesh, India',
    phone: '+91 8500650399',
    email: 'nt_examcell@vietvsp.com',
  },
];

function SectionHeading({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10">
      <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-3">{label}</p>
      <h2 className="text-2xl md:text-3xl lg:text-[2rem] font-semibold text-slate-900 tracking-tight leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-slate-600 text-base md:text-lg leading-relaxed max-w-4xl">{description}</p>
      )}
      <div className="h-px w-16 bg-slate-300 mt-6" aria-hidden />
    </div>
  );
}

function DocumentTable({ rows, emptyMessage }: { rows: DocumentRow[]; emptyMessage?: string }) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-slate-500 py-6 px-5 bg-slate-50 rounded-lg border border-slate-200">
        {emptyMessage ?? 'Documents will be published here shortly.'}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
      <table className="w-full min-w-[520px]">
        <thead>
          <tr className="bg-slate-900 text-white">
            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Document</th>
            <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider w-36">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {rows.map((row) => (
            <tr key={row.title} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-5 py-4 text-sm font-medium text-slate-800">{row.title}</td>
              <td className="px-5 py-4 text-right">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 border-slate-300 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900"
                  onClick={() => row.href && window.open(row.href, '_blank', 'noopener,noreferrer')}
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocumentGroup({ title, rows, emptyMessage }: { title: string; rows: DocumentRow[]; emptyMessage?: string }) {
  return (
    <div className="mb-10 last:mb-0">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <ScrollText className="w-4 h-4 text-slate-500" aria-hidden />
        {title}
      </h3>
      <DocumentTable rows={rows} emptyMessage={emptyMessage} />
    </div>
  );
}

const UGPGExaminations: React.FC = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSection = (searchParams.get('section') as SectionId) || 'examination-cell';
  const [activeSection, setActiveSection] = useState<SectionId>(
    SECTIONS.some((s) => s.id === initialSection) ? initialSection : 'examination-cell'
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const section = searchParams.get('section') as SectionId | null;
    if (section && SECTIONS.some((s) => s.id === section)) {
      setActiveSection(section);
    }
  }, [searchParams]);

  const switchSection = (sectionId: SectionId) => {
    setActiveSection(sectionId);
    setSearchParams({ section: sectionId }, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stats = useMemo(
    () => [
      { value: 'UG & PG', label: 'Programmes Covered' },
      { value: 'Autonomous', label: 'Examination Authority' },
      { value: 'JNTU-GV', label: 'University Affiliation' },
      { value: '24×7', label: 'Results Portal Access' },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <LeaderPageNavbar backHref="/" />

      {/* Hero */}
      <section
        className="relative min-h-[68vh] md:min-h-[72vh] pt-24 md:pt-28 pb-12 md:pb-16 text-white flex items-center bg-slate-900 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/campus-hero.jpg)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 from-30% via-slate-900/80 to-slate-900/50" aria-hidden />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-bold tracking-[0.2em] text-white uppercase bg-white/10 backdrop-blur-sm border border-white/30 rounded-full mb-5">
              <GraduationCap className="w-4 h-4" aria-hidden />
              Examinations
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-sm mb-4">
              Engineering (UG &amp; PG) Examination Cell
            </h1>
            <p className="text-base md:text-lg text-white/90 leading-relaxed max-w-2xl mb-8">
              Official portal for academic calendars, regulations, examination schedules, circulars, and
              result notifications of B.Tech, M.Tech, MBA, and MCA programmes at VIET (Autonomous).
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => switchSection('results')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 text-sm font-semibold rounded-md hover:bg-slate-100 transition-colors"
              >
                <Award className="w-4 h-4" />
                View Results
              </button>
              <button
                type="button"
                onClick={() => switchSection('contact')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white text-sm font-semibold rounded-md border border-white/30 hover:bg-white/20 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Exam Cell Contact
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <div className="bg-slate-950 border-b border-slate-800">
        <div className="container mx-auto px-4 md:px-10 lg:px-12 py-8 md:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-left md:text-center">
                <div className="text-2xl md:text-3xl font-bold text-white tracking-tight">{stat.value}</div>
                <div className="text-[11px] md:text-xs text-slate-400 uppercase tracking-widest mt-1 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <StickySectionNavBar itemCount={SECTIONS.length} ariaLabel="Examination sections">
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activeSection === id}
            onClick={() => switchSection(id)}
            className={cn(
              'flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap shrink-0',
              activeSection === id
                ? 'border-blue-700 text-blue-800'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            )}
          >
            <Icon className="w-4 h-4 shrink-0" aria-hidden />
            {label}
          </button>
        ))}
      </StickySectionNavBar>

      {/* Main content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {activeSection === 'examination-cell' && (
            <section className="py-20 md:py-28 bg-[#fafafa]">
              <div className="container mx-auto px-4 md:px-10 lg:px-12">
                <SectionHeading
                  label="Examination Cell"
                  title="Notice Board & Announcements"
                  description="Latest examination results, schedules, and official notifications published by the UG & PG Examination Cell."
                />

                <div className="mb-10 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-slate-500" />
                    {NOTICE_BOARD.length} active notifications
                  </p>
                  <Badge className="bg-slate-900 text-white hover:bg-slate-800 font-medium tracking-wide">
                    Latest Updates
                  </Badge>
                </div>

                <div className="space-y-3 mb-12">
                  {NOTICE_BOARD.map((notice, index) => (
                    <motion.article
                      key={notice.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        'group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:p-6 bg-white border rounded-xl transition-all',
                        notice.isNew
                          ? 'border-l-4 border-l-blue-700 border-slate-200 shadow-sm hover:shadow-md'
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                            {notice.type}
                          </span>
                          {notice.isNew && (
                            <Badge variant="secondary" className="text-[10px] bg-blue-50 text-blue-800 border-blue-200">
                              New
                            </Badge>
                          )}
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {notice.date}
                          </span>
                        </div>
                        <h3 className="text-sm md:text-base font-semibold text-slate-900 group-hover:text-blue-800 transition-colors leading-snug">
                          {notice.title}
                        </h3>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0 gap-1.5 border-slate-300"
                        onClick={() => window.open(notice.link, '_blank', 'noopener,noreferrer')}
                      >
                        View
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </motion.article>
                  ))}
                </div>

                <div className="p-6 md:p-8 bg-slate-900 text-white rounded-xl border border-slate-800">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-300" />
                    Instructions for Viewing Results
                  </h3>
                  <ol className="space-y-3 text-sm md:text-base text-slate-200 list-decimal list-inside marker:text-blue-300 marker:font-semibold">
                    <li>
                      Click on <strong className="text-white">Student Login</strong> on the results portal.
                    </li>
                    <li>
                      Enter your roll number as both <strong className="text-white">username</strong> and{' '}
                      <strong className="text-white">password</strong> (use CAPITAL letters).
                    </li>
                    <li>
                      Click <strong className="text-white">Login</strong> to access your account.
                    </li>
                    <li>
                      Navigate to <strong className="text-white">Marks Details</strong> to view your examination marks.
                    </li>
                  </ol>
                </div>
              </div>
            </section>
          )}

          {activeSection === 'academic-calendar' && (
            <section className="py-20 md:py-28 bg-white">
              <div className="container mx-auto px-4 md:px-10 lg:px-12">
                <SectionHeading
                  label="Academic Calendar"
                  title="Semester-wise Academic Schedules"
                  description="Download official academic calendars for undergraduate and postgraduate engineering programmes."
                />
                <DocumentGroup
                  title="B.Tech Programmes"
                  rows={[
                    { title: 'Changes in Examination Tab' },
                    { title: 'Academic Calendar' },
                  ]}
                />
                <DocumentGroup title="M.Tech Programmes" rows={[{ title: 'Academic Calendar' }]} />
                <DocumentGroup title="MCA Programmes" rows={[{ title: 'Academic Calendar' }]} />
              </div>
            </section>
          )}

          {activeSection === 'academic-regulation' && (
            <section className="py-20 md:py-28 bg-[#fafafa]">
              <div className="container mx-auto px-4 md:px-10 lg:px-12">
                <SectionHeading
                  label="Academic Regulation"
                  title="Regulatory Framework"
                  description="Autonomous academic regulations governing credit systems, evaluation norms, and promotion rules."
                />
                <DocumentGroup title="M.Tech Programmes" rows={[{ title: 'Academic Regulation' }]} />
                <DocumentGroup
                  title="MBA Programmes"
                  rows={[]}
                  emptyMessage="MBA academic regulations will be published here shortly."
                />
              </div>
            </section>
          )}

          {activeSection === 'syllabus' && (
            <section className="py-20 md:py-28 bg-white">
              <div className="container mx-auto px-4 md:px-10 lg:px-12">
                <SectionHeading
                  label="Syllabus"
                  title="Programme Syllabus"
                  description="Curriculum and syllabus documents for UG and PG engineering programmes."
                />
                <div className="p-8 md:p-10 bg-slate-50 border border-slate-200 rounded-xl text-left">
                  <BookOpen className="w-8 h-8 text-slate-400 mb-4" />
                  <p className="text-slate-600 text-base leading-relaxed max-w-2xl">
                    Syllabus documents for all programmes will be made available here. For department-specific
                    curriculum, please visit the respective programme pages under Departments.
                  </p>
                </div>
              </div>
            </section>
          )}

          {activeSection === 'time-table' && (
            <section className="py-20 md:py-28 bg-[#fafafa]">
              <div className="container mx-auto px-4 md:px-10 lg:px-12">
                <SectionHeading
                  label="Time Table"
                  title="Examination Time Tables"
                  description="Official examination schedules and revisions for current academic sessions."
                />
                <DocumentTable
                  rows={[{ title: 'Changes in Time Table' }, { title: 'Examination Time Table' }]}
                />
              </div>
            </section>
          )}

          {activeSection === 'circulars' && (
            <section className="py-20 md:py-28 bg-white">
              <div className="container mx-auto px-4 md:px-10 lg:px-12">
                <SectionHeading
                  label="Circulars"
                  title="Circulars & Notifications"
                  description="Official examination circulars issued by the Controller of Examinations."
                />
                <DocumentGroup
                  title="B.Tech Circulars"
                  rows={[
                    { title: 'Changes in VIET Web Circular and Notifications Tab' },
                    { title: 'DEO Circulars' },
                  ]}
                />
                <DocumentGroup
                  title="M.Tech Circulars"
                  rows={[]}
                  emptyMessage="M.Tech circulars will be published here shortly."
                />
              </div>
            </section>
          )}

          {activeSection === 'results' && (
            <section className="py-20 md:py-28 bg-[#fafafa]">
              <div className="container mx-auto px-4 md:px-10 lg:px-12">
                <SectionHeading
                  label="Results"
                  title="Examination Results Portal"
                  description="Access semester-wise results for B.Tech, M.Tech, MBA, MCA, and JNTU-GV consolidated results."
                />

                <div className="mb-8 p-5 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 text-left">
                  <Shield className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-900 leading-relaxed">
                    Results are published on the official student portal. Use your roll number in CAPITAL letters as
                    both username and password to log in.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {RESULT_PORTALS.map((portal) => (
                    <button
                      key={portal.title}
                      type="button"
                      className="group text-left p-5 md:p-6 bg-white border border-slate-200 rounded-xl hover:border-slate-400 hover:shadow-md transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center mb-4 group-hover:bg-blue-800 transition-colors">
                        <Award className="w-5 h-5" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-blue-800 transition-colors">
                        {portal.title}
                      </h3>
                      <p className="text-xs text-slate-500 mb-4 leading-relaxed">{portal.subtitle}</p>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 uppercase tracking-wide">
                        View Results
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeSection === 'contact' && (
            <section className="py-20 md:py-28 bg-white">
              <div className="container mx-auto px-4 md:px-10 lg:px-12">
                <SectionHeading
                  label="Contact"
                  title="Examination Cell Officials"
                  description="Reach the Controller of Examinations and examination cell staff for queries related to schedules, results, and certificates."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {CONTACTS.map((person) => (
                    <article
                      key={person.role}
                      className="p-6 md:p-7 bg-[#fafafa] border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all text-left"
                    >
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                            {person.role}
                          </p>
                          <h3 className="text-lg font-semibold text-slate-900 leading-snug">{person.name}</h3>
                          {person.qualification && (
                            <p className="text-sm text-slate-600 mt-0.5">{person.qualification}</p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2.5 text-sm text-slate-600">
                        <p className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                          {person.address}
                        </p>
                        {person.phone && (
                          <p className="flex items-center gap-2">
                            <Phone className="w-4 h-4 shrink-0 text-slate-400" />
                            <a href={`tel:${person.phone.replace(/\s/g, '')}`} className="hover:text-blue-700">
                              {person.phone}
                            </a>
                          </p>
                        )}
                        {person.email && (
                          <p className="flex items-center gap-2">
                            <Mail className="w-4 h-4 shrink-0 text-slate-400" />
                            <a href={`mailto:${person.email}`} className="hover:text-blue-700 break-all">
                              {person.email}
                            </a>
                          </p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}
        </motion.div>
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default UGPGExaminations;
