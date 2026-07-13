import React, { useEffect, useState } from 'react';
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
import { pagesAPI } from '@/lib/api';
import { imgUrl } from '@/lib/imageUtils';
import {
  DEFAULT_UG_PG_EXAMINATIONS_CONTENT,
  normalizeUgPgExaminationsContent,
  type ExamDocument,
  type UgPgExaminationsContent,
} from '@/lib/ugPgExaminationsContent';

type SectionId =
  | 'examination-cell'
  | 'controller-of-examinations'
  | 'academic-calendar'
  | 'academic-regulation'
  | 'syllabus'
  | 'time-table'
  | 'circulars'
  | 'results'
  | 'contact';

const SECTIONS: { id: SectionId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'examination-cell', label: 'Examination Cell', icon: Building2 },
  { id: 'controller-of-examinations', label: 'Controller of Examinations', icon: User },
  { id: 'academic-calendar', label: 'Academic Calendar', icon: Calendar },
  { id: 'academic-regulation', label: 'Academic Regulation', icon: FileText },
  { id: 'syllabus', label: 'Syllabus', icon: BookOpen },
  { id: 'time-table', label: 'Time Table', icon: Clock },
  { id: 'circulars', label: 'Circulars', icon: Bell },
  { id: 'results', label: 'Results', icon: Award },
  { id: 'contact', label: 'Contact', icon: Phone },
];

const SLUG = 'ug-pg-examinations';

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

function DocumentTable({ rows, emptyMessage }: { rows: ExamDocument[]; emptyMessage?: string }) {
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
            <tr key={row.id || row.title} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-5 py-4 text-sm font-medium text-slate-800">{row.title}</td>
              <td className="px-5 py-4 text-right">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 border-slate-300 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900"
                  disabled={!row.href}
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

function DocumentGroup({
  title,
  rows,
  emptyMessage,
}: {
  title: string;
  rows: ExamDocument[];
  emptyMessage?: string;
}) {
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
  const [content, setContent] = useState<UgPgExaminationsContent>(DEFAULT_UG_PG_EXAMINATIONS_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const section = searchParams.get('section') as SectionId | null;
    if (section && SECTIONS.some((s) => s.id === section)) {
      setActiveSection(section);
    }
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const page = await pagesAPI.getBySlug(SLUG);
        if (!active) return;
        if (page?.content) {
          setContent(normalizeUgPgExaminationsContent(page.content));
        } else {
          setContent(structuredClone(DEFAULT_UG_PG_EXAMINATIONS_CONTENT));
        }
      } catch {
        if (active) setContent(structuredClone(DEFAULT_UG_PG_EXAMINATIONS_CONTENT));
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const switchSection = (sectionId: SectionId) => {
    setActiveSection(sectionId);
    setSearchParams({ section: sectionId }, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const heroImage = content.hero.image ? imgUrl(content.hero.image) : '/campus-hero.jpg';

  return (
    <div className="min-h-screen bg-slate-100">
      <LeaderPageNavbar backHref="/" />

      <section
        className="relative min-h-[68vh] md:min-h-[72vh] pt-24 md:pt-28 pb-12 md:pb-16 text-white flex items-center bg-slate-900 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
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
              {content.hero.badge}
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-sm mb-4">
              {content.hero.title}
            </h1>
            <p className="text-base md:text-lg text-white/90 leading-relaxed max-w-2xl mb-8">
              {content.hero.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => switchSection('results')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 text-sm font-semibold rounded-md hover:bg-slate-100 transition-colors"
              >
                <Award className="w-4 h-4" />
                {content.hero.primaryCtaLabel}
              </button>
              <button
                type="button"
                onClick={() => switchSection('contact')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white text-sm font-semibold rounded-md border border-white/30 hover:bg-white/20 transition-colors"
              >
                <Phone className="w-4 h-4" />
                {content.hero.secondaryCtaLabel}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="bg-slate-950 border-b border-slate-800">
        <div className="container mx-auto px-4 md:px-10 lg:px-12 py-8 md:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {content.stats.map((stat) => (
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

      {loading ? (
        <div className="py-24 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-800" />
        </div>
      ) : (
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
                    label={content.noticesHeading.label}
                    title={content.noticesHeading.title}
                    description={content.noticesHeading.description}
                  />

                  <div className="mb-10 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-slate-500" />
                      {content.notices.length} active notifications
                    </p>
                    <Badge className="bg-slate-900 text-white hover:bg-slate-800 font-medium tracking-wide">
                      Latest Updates
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-12">
                    {content.notices.map((notice, index) => (
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
                          onClick={() => window.open(notice.link || '#', '_blank', 'noopener,noreferrer')}
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
                      {content.resultInstructionsTitle}
                    </h3>
                    <ol className="space-y-3 text-sm md:text-base text-slate-200 list-decimal list-inside marker:text-blue-300 marker:font-semibold">
                      {content.resultInstructions.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'controller-of-examinations' && (
              <section className="py-20 md:py-28 bg-white">
                <div className="container mx-auto px-4 md:px-10 lg:px-12">
                  <SectionHeading
                    label={content.controllerOfExaminations.label}
                    title={content.controllerOfExaminations.title}
                  />

                  <div className="grid lg:grid-cols-[minmax(0,18rem)_1fr] gap-10 lg:gap-14 items-start">
                    <div className="text-left">
                      <div className="aspect-[3/4] w-full max-w-xs overflow-hidden rounded-xl bg-slate-100 border border-slate-200 shadow-sm mb-5">
                        {content.controllerOfExaminations.image ? (
                          <img
                            src={imgUrl(content.controllerOfExaminations.image)}
                            alt={content.controllerOfExaminations.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <User className="w-16 h-16" />
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        {content.controllerOfExaminations.designation}
                      </p>
                      <h3 className="text-2xl font-semibold text-slate-900 leading-snug mb-1">
                        {content.controllerOfExaminations.name}
                      </h3>
                      {content.controllerOfExaminations.qualification && (
                        <p className="text-base text-slate-600 mb-3">
                          {content.controllerOfExaminations.qualification}
                        </p>
                      )}
                      {content.controllerOfExaminations.intro && (
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">
                          {content.controllerOfExaminations.intro}
                        </p>
                      )}
                      <div className="space-y-2 text-sm text-slate-600">
                        {content.controllerOfExaminations.phone && (
                          <p className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <a
                              href={`tel:${content.controllerOfExaminations.phone.replace(/\s/g, '')}`}
                              className="hover:text-blue-700"
                            >
                              {content.controllerOfExaminations.phone}
                            </a>
                          </p>
                        )}
                        {content.controllerOfExaminations.email && (
                          <p className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <a
                              href={`mailto:${content.controllerOfExaminations.email}`}
                              className="hover:text-blue-700 break-all"
                            >
                              {content.controllerOfExaminations.email}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-left">
                      <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-3">
                        {content.controllerOfExaminations.messageLabel}
                      </p>
                      <h3 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight mb-6 leading-tight">
                        {content.controllerOfExaminations.messageTitle}
                      </h3>
                      <div className="h-px w-16 bg-slate-300 mb-8" aria-hidden />
                      <div className="text-slate-600 text-[1.0625rem] md:text-lg leading-[1.85] text-justify whitespace-pre-wrap">
                        {content.controllerOfExaminations.message}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'academic-calendar' && (
              <section className="py-20 md:py-28 bg-white">
                <div className="container mx-auto px-4 md:px-10 lg:px-12">
                  <SectionHeading
                    label={content.academicCalendar.label}
                    title={content.academicCalendar.title}
                    description={content.academicCalendar.description}
                  />
                  {content.academicCalendar.groups.map((group) => (
                    <DocumentGroup
                      key={group.id}
                      title={group.title}
                      rows={group.documents}
                      emptyMessage={group.emptyMessage}
                    />
                  ))}
                </div>
              </section>
            )}

            {activeSection === 'academic-regulation' && (
              <section className="py-20 md:py-28 bg-[#fafafa]">
                <div className="container mx-auto px-4 md:px-10 lg:px-12">
                  <SectionHeading
                    label={content.academicRegulation.label}
                    title={content.academicRegulation.title}
                    description={content.academicRegulation.description}
                  />
                  {content.academicRegulation.groups.map((group) => (
                    <DocumentGroup
                      key={group.id}
                      title={group.title}
                      rows={group.documents}
                      emptyMessage={group.emptyMessage}
                    />
                  ))}
                </div>
              </section>
            )}

            {activeSection === 'syllabus' && (
              <section className="py-20 md:py-28 bg-white">
                <div className="container mx-auto px-4 md:px-10 lg:px-12">
                  <SectionHeading
                    label={content.syllabus.label}
                    title={content.syllabus.title}
                    description={content.syllabus.description}
                  />
                  {content.syllabus.groups.length > 0 ? (
                    content.syllabus.groups.map((group) => (
                      <DocumentGroup
                        key={group.id}
                        title={group.title}
                        rows={group.documents}
                        emptyMessage={group.emptyMessage}
                      />
                    ))
                  ) : (
                    <div className="p-8 md:p-10 bg-slate-50 border border-slate-200 rounded-xl text-left">
                      <BookOpen className="w-8 h-8 text-slate-400 mb-4" />
                      <p className="text-slate-600 text-base leading-relaxed max-w-2xl">
                        {content.syllabus.placeholderText}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeSection === 'time-table' && (
              <section className="py-20 md:py-28 bg-[#fafafa]">
                <div className="container mx-auto px-4 md:px-10 lg:px-12">
                  <SectionHeading
                    label={content.timeTable.label}
                    title={content.timeTable.title}
                    description={content.timeTable.description}
                  />
                  <DocumentTable rows={content.timeTable.documents} />
                </div>
              </section>
            )}

            {activeSection === 'circulars' && (
              <section className="py-20 md:py-28 bg-white">
                <div className="container mx-auto px-4 md:px-10 lg:px-12">
                  <SectionHeading
                    label={content.circulars.label}
                    title={content.circulars.title}
                    description={content.circulars.description}
                  />
                  {content.circulars.groups.map((group) => (
                    <DocumentGroup
                      key={group.id}
                      title={group.title}
                      rows={group.documents}
                      emptyMessage={group.emptyMessage}
                    />
                  ))}
                </div>
              </section>
            )}

            {activeSection === 'results' && (
              <section className="py-20 md:py-28 bg-[#fafafa]">
                <div className="container mx-auto px-4 md:px-10 lg:px-12">
                  <SectionHeading
                    label={content.results.label}
                    title={content.results.title}
                    description={content.results.description}
                  />

                  <div className="mb-8 p-5 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 text-left">
                    <Shield className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-900 leading-relaxed">{content.results.notice}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {content.results.portals.map((portal) => (
                      <button
                        key={portal.id}
                        type="button"
                        className="group text-left p-5 md:p-6 bg-white border border-slate-200 rounded-xl hover:border-slate-400 hover:shadow-md transition-all"
                        onClick={() => portal.href && window.open(portal.href, '_blank', 'noopener,noreferrer')}
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
                    label={content.contacts.label}
                    title={content.contacts.title}
                    description={content.contacts.description}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {content.contacts.people.map((person) => (
                      <article
                        key={person.id}
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
      )}

      <Footer />
    </div>
  );
};

export default UGPGExaminations;
