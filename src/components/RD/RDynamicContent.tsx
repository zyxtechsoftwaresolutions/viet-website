import { useMemo, useState } from 'react';
import type { ElementType, FC, ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  BookOpen,
  Briefcase,
  FileText,
  FlaskConical,
  Lightbulb,
  Search,
  Sparkles,
  Target,
  User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  type RdContent,
} from '@/lib/rdContent';

interface RDynamicContentProps {
  activeSection: string;
  content: RdContent;
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.4 },
};

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
      <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">
        {label}
      </p>
      <h2 className="text-2xl md:text-3xl lg:text-[2rem] font-semibold text-slate-900 tracking-tight leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-slate-600 text-base md:text-lg leading-relaxed max-w-4xl">
          {description}
        </p>
      )}
      <div className="h-px w-16 bg-primary mt-6" aria-hidden />
    </div>
  );
}

function roleBadgeClass(role: string) {
  const r = role.toLowerCase();
  if (r.includes('chair')) return 'bg-primary/10 text-primary border-primary/20';
  if (r.includes('dean')) return 'bg-slate-800 text-white border-slate-700';
  if (r.includes('advisor')) return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
}

function DataTable({
  columns,
  rows,
}: {
  columns: { key: string; label: string; className?: string }[];
  rows: Record<string, ReactNode>[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="bg-slate-900 text-white">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider',
                  col.className
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {rows.map((row, i) => (
            <motion.tr
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.4) }}
              className="hover:bg-slate-50/80 transition-colors"
            >
              {columns.map((col) => (
                <td key={col.key} className={cn('px-5 py-4 text-sm text-slate-700', col.className)}>
                  {row[col.key]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PlaceholderCard({
  icon: Icon,
  title,
  description,
}: {
  icon: ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 md:p-10 text-center">
      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mx-auto mb-5">
        <Icon className="w-7 h-7 text-slate-400" aria-hidden />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto leading-relaxed">{description}</p>
    </div>
  );
}

const RDynamicContent: FC<RDynamicContentProps> = ({ activeSection, content }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  const departments = useMemo(() => {
    const unique = Array.from(
      new Set(content.coordinators.map((c) => c.department).filter(Boolean))
    );
    return ['All', ...unique];
  }, [content.coordinators]);

  const coordinatorsFiltered = useMemo(() => {
    if (selectedDepartment === 'All') return content.coordinators;
    return content.coordinators.filter((c) => c.department === selectedDepartment);
  }, [content.coordinators, selectedDepartment]);

  return (
    <motion.div key={activeSection} {...fadeUp}>
      {/* ── ABOUT ── */}
      {activeSection === 'about' && (
        <div>
          <SectionHeading
            label="Overview"
            title="About Research & Development"
            description="At VIET, Research & Development is the catalyst for technological breakthroughs and academic brilliance."
          />

          <div className="grid lg:grid-cols-2 gap-6 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-primary" aria-hidden />
                </div>
                  <h3 className="text-lg font-semibold text-slate-900">{content.about.introTitle}</h3>
              </div>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>{content.about.introParagraph1}</p>
                <p>{content.about.introParagraph2}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-6 md:p-8 text-white shadow-lg"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" aria-hidden />
                </div>
                  <h3 className="text-lg font-semibold">{content.about.cellTitle}</h3>
              </div>
              <p className="text-white/75 leading-relaxed text-sm md:text-base">
                {content.about.cellDescription}
              </p>
              <p className="text-primary font-semibold mt-6 text-sm md:text-base">
                {content.about.tagline}
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-5">{content.about.objectivesTitle}</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {content.about.objectives.map((obj, i) => (
                <motion.div
                  key={obj.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(i * 0.04, 0.3) }}
                  className="flex gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:border-primary/30 hover:shadow-md transition-all group"
                >
                  <span className="text-xs font-bold text-slate-400 group-hover:text-primary tabular-nums pt-0.5 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 mb-1">{obj.title}</p>
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{obj.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8"
          >
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase mb-4">
              {content.about.partnersTitle}
            </p>
            <div className="flex flex-wrap gap-2">
              {content.about.partners.map((partner) => (
                <span
                  key={partner}
                  className="px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-colors"
                >
                  {partner}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* ── DIRECTOR ── */}
      {activeSection === 'director' && (
        <div>
          <SectionHeading
            label="Leadership"
            title="About Director"
            description="The R&D Dean leads research initiatives, coordinates committee activities, and drives institutional research excellence."
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-lg"
          >
            <div className="h-2 bg-gradient-to-r from-primary via-orange-400 to-primary" aria-hidden />
            <div className="p-8 md:p-10 flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-24 h-24 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0">
                <User className="w-10 h-10 text-primary" aria-hidden />
              </div>
              <div>
                <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
                  {content.director.roleLabel}
                </Badge>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">{content.director.name}</h3>
                <p className="text-sm text-slate-500 mb-4">
                  {content.director.designation} · {content.director.department}
                </p>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  {content.director.description}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── VISION & MISSION ── */}
      {activeSection === 'vision-mission' && (
        <div>
          <SectionHeading label="Purpose" title="Vision and Mission" />
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-5">
                <Target className="w-6 h-6 text-primary" aria-hidden />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Vision</h3>
              <p className="text-slate-600 leading-relaxed italic">
                {content.visionMission.vision}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6 text-primary" aria-hidden />
              </div>
              <h3 className="text-xl font-bold mb-4">Mission</h3>
              <ul className="space-y-3 text-white/80 text-sm md:text-base leading-relaxed">
                {content.visionMission.missionPoints.map((point, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-primary shrink-0">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      )}

      {/* ── ROLES ── */}
      {activeSection === 'roles-responsibilities' && (
        <div>
          <SectionHeading
            label="Governance"
            title="Roles & Responsibilities"
            description="The R&D cell operates through a structured framework of leadership, coordination, and departmental oversight."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.roles.map((item, i) => (
              <motion.div
                key={item.role}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-slate-200 bg-white p-5 hover:border-primary/30 hover:shadow-md transition-all"
              >
                <h4 className="text-sm font-bold text-slate-900 mb-2">{item.role}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ── COMMITTEE ── */}
      {activeSection === 'committee' && (
        <div>
          <SectionHeading
            label="Governance"
            title="R&D Committee"
            description="Constituted to oversee and guide all research and development activities across the institution."
          />
          <DataTable
            columns={[
              { key: 'sno', label: 'S.No', className: 'w-14 tabular-nums font-medium text-slate-500' },
              { key: 'name', label: 'Name', className: 'font-semibold text-slate-900' },
              { key: 'designation', label: 'Designation' },
              { key: 'role', label: 'Role' },
              { key: 'responsibility', label: 'Responsibility' },
            ]}
            rows={content.committee.map((m) => ({
              sno: m.sno,
              name: m.name,
              designation: m.designation,
              role: (
                <Badge variant="secondary" className={cn('text-xs font-medium border', roleBadgeClass(m.role))}>
                  {m.role}
                </Badge>
              ),
              responsibility: m.responsibility,
            }))}
          />
        </div>
      )}

      {/* ── COORDINATORS ── */}
      {activeSection === 'department-coordinators' && (
        <div>
          <SectionHeading
            label="Department Network"
            title="Research & Development Department Coordinators"
            description="Faculty coordinators who monitor and facilitate R&D activities within their respective departments."
          />

          <div className="mb-6 flex flex-wrap gap-2">
            {departments.map((dept) => {
              const isActive = selectedDepartment === dept;
              return (
                <motion.button
                  key={dept}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedDepartment(dept)}
                  className={[
                    'px-3 py-2 rounded-full border text-xs font-semibold transition-colors whitespace-nowrap',
                    isActive
                      ? 'bg-primary/10 border-primary/30 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900',
                  ].join(' ')}
                >
                  {dept}
                </motion.button>
              );
            })}
          </div>

          {/* Masonry-ish animated grid via CSS columns */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
            {coordinatorsFiltered.map((coord, i) => (
              <motion.article
                key={coord.sno}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.03, 0.3), duration: 0.45 }}
                className="break-inside-avoid mb-5 group relative rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                  <img
                    src={coord.photo}
                    alt={coord.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-slate-900/20 to-transparent opacity-80" />

                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary/95 text-white border-0 text-[10px]">{coord.department}</Badge>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-sm font-bold text-white leading-snug mb-1">{coord.name}</h3>
                    <p className="text-xs text-white/80">{coord.position}</p>
                  </div>

                  {/* Hover highlight */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none bg-gradient-to-r from-primary/15 via-transparent to-primary/15"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      )}

      {/* ── PHD HOLDERS ── */}
      {activeSection === 'phd-holders' && (
        <div>
          <SectionHeading
            label="Faculty Excellence"
            title="List of Ph.D Holders"
            description={`${content.phdHolders.length} faculty members with doctoral qualifications across multiple departments.`}
          />
          <DataTable
            columns={[
              { key: 'sno', label: 'S.No', className: 'w-14 tabular-nums font-medium text-slate-500' },
              { key: 'name', label: 'Faculty Name', className: 'font-semibold text-slate-900' },
              { key: 'designation', label: 'Designation' },
              { key: 'experience', label: 'Experience (Yrs)', className: 'tabular-nums' },
              { key: 'department', label: 'Department' },
            ]}
            rows={content.phdHolders.map((h) => ({
              sno: h.sno,
              name: h.name,
              designation: h.designation,
              experience: h.experience,
              department: (
                <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700 border-slate-200">
                  {h.department}
                </Badge>
              ),
            }))}
          />
        </div>
      )}

      {/* ── PHD PURSUING ── */}
      {activeSection === 'phd-pursuing' && (
        <div>
          <SectionHeading
            label="Growing Scholars"
            title="List of Pursuing (PhD)"
            description={`${content.phdPursuing.length} faculty members currently pursuing doctoral research.`}
          />
          <DataTable
            columns={[
              { key: 'sno', label: 'S.No', className: 'w-14 tabular-nums font-medium text-slate-500' },
              { key: 'name', label: 'Faculty Name', className: 'font-semibold text-slate-900' },
              { key: 'designation', label: 'Designation' },
              { key: 'experience', label: 'Experience (Yrs)', className: 'tabular-nums' },
              { key: 'department', label: 'Department' },
            ]}
            rows={content.phdPursuing.map((p) => ({
              sno: p.sno,
              name: p.name,
              designation: p.designation,
              experience: p.experience,
              department: (
                <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700 border-slate-200">
                  {p.department}
                </Badge>
              ),
            }))}
          />
        </div>
      )}

      {/* ── POLICY ── */}
      {activeSection === 'policy' && (
        <div>
          <SectionHeading label="Documentation" title="R & D Policy" />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-200 bg-white p-8 md:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="w-7 h-7 text-primary" aria-hidden />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{content.policy.title}</h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-4">
                {content.policy.description}
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <a href={content.policy.buttonUrl || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {content.policy.buttonText}
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── JOURNALS ── */}
      {activeSection === 'journals' && (
        <div>
          <SectionHeading label="Publications" title="Journals" description="Faculty and student publications in reputed national and international journals." />
          <PlaceholderCard icon={BookOpen} title={content.journals.title} description={content.journals.description} />
        </div>
      )}

      {/* ── PATENTS ── */}
      {activeSection === 'patents' && (
        <div>
          <SectionHeading label="Intellectual Property" title="Patents" description="Patents filed and granted by VIET faculty and researchers." />
          <PlaceholderCard icon={Award} title={content.patents.title} description={content.patents.description} />
        </div>
      )}

      {/* ── TEXTBOOKS ── */}
      {activeSection === 'textbooks' && (
        <div>
          <SectionHeading label="Publications" title="Text Books" description="Textbooks authored by VIET faculty members." />
          <PlaceholderCard icon={BookOpen} title={content.textbooks.title} description={content.textbooks.description} />
        </div>
      )}

      {/* ── CONSULTANCY ── */}
      {activeSection === 'consultancy' && (
        <div>
          <SectionHeading label="Industry Connect" title="Consultancy Services" description="Expert consultancy services offered by VIET faculty to industry and government organizations." />
          <PlaceholderCard icon={Briefcase} title={content.consultancy.title} description={content.consultancy.description} />
        </div>
      )}

      {/* ── FACILITIES ── */}
      {activeSection === 'facilities' && (
        <div>
          <SectionHeading label="Infrastructure" title="R&D Facilities" description="State-of-the-art laboratories and research infrastructure supporting innovation." />
          <PlaceholderCard icon={FlaskConical} title={content.facilities.title} description={content.facilities.description} />
        </div>
      )}

      {/* ── RESEARCH AREAS ── */}
      {activeSection === 'research-areas' && (
        <div>
          <SectionHeading label="Focus Areas" title="Research Areas" description="Key interdisciplinary research domains pursued at VIET." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.researchAreas.map((area, i) => (
              <motion.div
                key={area}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                  <Search className="w-4 h-4 text-white" aria-hidden />
                </div>
                <p className="text-sm font-medium text-slate-800 leading-snug">{area}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RDynamicContent;
