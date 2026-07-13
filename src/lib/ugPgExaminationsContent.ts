/** Shared UG & PG Exam Cell CMS shape — used by public page + admin editor. */

export type ExamDocument = {
  id: string;
  title: string;
  href?: string;
};

export type ExamDocumentGroup = {
  id: string;
  title: string;
  documents: ExamDocument[];
  emptyMessage?: string;
};

export type ExamNotice = {
  id: string;
  title: string;
  date: string;
  type: string;
  link: string;
  isNew?: boolean;
};

export type ExamResultPortal = {
  id: string;
  title: string;
  subtitle: string;
  href?: string;
};

export type ExamContact = {
  id: string;
  role: string;
  name: string;
  qualification?: string;
  address: string;
  phone: string;
  email: string;
};

export type ExamStat = {
  value: string;
  label: string;
};

export type ExamSectionMeta = {
  label: string;
  title: string;
  description: string;
};

export type ExamControllerOfExaminations = {
  label: string;
  title: string;
  designation: string;
  name: string;
  qualification: string;
  intro: string;
  image?: string;
  messageLabel: string;
  messageTitle: string;
  message: string;
  phone?: string;
  email?: string;
};

export type UgPgExaminationsContent = {
  hero: {
    badge: string;
    title: string;
    description: string;
    image?: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
  };
  stats: ExamStat[];
  noticesHeading: ExamSectionMeta;
  notices: ExamNotice[];
  resultInstructionsTitle: string;
  resultInstructions: string[];
  controllerOfExaminations: ExamControllerOfExaminations;
  academicCalendar: ExamSectionMeta & { groups: ExamDocumentGroup[] };
  academicRegulation: ExamSectionMeta & { groups: ExamDocumentGroup[] };
  syllabus: ExamSectionMeta & { placeholderText: string; groups: ExamDocumentGroup[] };
  timeTable: ExamSectionMeta & { documents: ExamDocument[] };
  circulars: ExamSectionMeta & { groups: ExamDocumentGroup[] };
  results: ExamSectionMeta & { notice: string; portals: ExamResultPortal[] };
  contacts: ExamSectionMeta & { people: ExamContact[] };
};

export function examUid(prefix = 'ex') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createEmptyNotice(): ExamNotice {
  return {
    id: examUid('notice'),
    title: '',
    date: '',
    type: 'Results',
    link: '#',
    isNew: true,
  };
}

export function createEmptyDocument(): ExamDocument {
  return { id: examUid('doc'), title: '', href: '' };
}

export function createEmptyDocumentGroup(): ExamDocumentGroup {
  return {
    id: examUid('group'),
    title: '',
    documents: [],
    emptyMessage: 'Documents will be published here shortly.',
  };
}

export function createEmptyResultPortal(): ExamResultPortal {
  return { id: examUid('portal'), title: '', subtitle: '', href: '' };
}

export function createEmptyContact(): ExamContact {
  return {
    id: examUid('contact'),
    role: '',
    name: '',
    qualification: '',
    address: '',
    phone: '',
    email: '',
  };
}

export function createEmptyStat(): ExamStat {
  return { value: '', label: '' };
}

export const DEFAULT_UG_PG_EXAMINATIONS_CONTENT: UgPgExaminationsContent = {
  hero: {
    badge: 'Examinations',
    title: 'Engineering (UG & PG) Examination Cell',
    description:
      'Official portal for academic calendars, regulations, examination schedules, circulars, and result notifications of B.Tech, M.Tech, MBA, and MCA programmes at VIET (Autonomous).',
    image: '/campus-hero.jpg',
    primaryCtaLabel: 'View Results',
    secondaryCtaLabel: 'Exam Cell Contact',
  },
  stats: [
    { value: 'UG & PG', label: 'Programmes Covered' },
    { value: 'Autonomous', label: 'Examination Authority' },
    { value: 'JNTU-GV', label: 'University Affiliation' },
    { value: '24×7', label: 'Results Portal Access' },
  ],
  noticesHeading: {
    label: 'Examination Cell',
    title: 'Notice Board & Announcements',
    description:
      'Latest examination results, schedules, and official notifications published by the UG & PG Examination Cell.',
  },
  notices: [
    {
      id: 'notice-1',
      title: 'I M.TECH II SEM REGULAR EXAMINATION RESULTS JULY 2025',
      date: '18 Jul 2025',
      type: 'Results',
      link: '#',
      isNew: true,
    },
    {
      id: 'notice-2',
      title: 'I MBA II SEM REGULAR EXAMINATION RESULTS JUNE 2025',
      date: '15 Jun 2025',
      type: 'Results',
      link: '#',
      isNew: true,
    },
    {
      id: 'notice-3',
      title: 'I MCA II SEM REGULAR EXAMINATION RESULTS JUNE 2025',
      date: '15 Jun 2025',
      type: 'Results',
      link: '#',
      isNew: true,
    },
    {
      id: 'notice-4',
      title: 'I B.TECH II SEM REGULAR EXAMINATION RESULTS MAY 2025',
      date: '20 May 2025',
      type: 'Results',
      link: '#',
      isNew: true,
    },
    {
      id: 'notice-5',
      title: 'I B.TECH I SEM SUPPLEMENTARY EXAMINATION RESULTS MAY 2025',
      date: '18 May 2025',
      type: 'Results',
      link: '#',
      isNew: true,
    },
  ],
  resultInstructionsTitle: 'Instructions for Viewing Results',
  resultInstructions: [
    'Click on Student Login on the results portal.',
    'Enter your roll number as both username and password (use CAPITAL letters).',
    'Click Login to access your account.',
    'Navigate to Marks Details to view your examination marks.',
  ],
  controllerOfExaminations: {
    label: 'Leadership',
    title: 'Controller of Examinations',
    designation: 'Controller of Examinations (UG & PG)',
    name: 'Dr C. Govinda Rajulu',
    qualification: 'Ph.D., Professor',
    intro: 'Leading the autonomous examination system with integrity, transparency, and academic excellence.',
    image: '',
    messageLabel: 'A message from the Controller of Examinations',
    messageTitle: "Controller's Message",
    message:
      'The Examination Cell at VIET (Autonomous) is committed to conducting fair, transparent, and well-organized examinations for all undergraduate and postgraduate programmes. We strive to uphold academic standards while supporting students through clear communication of schedules, regulations, and results.',
    phone: '+91 9440502945',
    email: 'nt_coe@viet.edu.in',
  },
  academicCalendar: {
    label: 'Academic Calendar',
    title: 'Semester-wise Academic Schedules',
    description: 'Download official academic calendars for undergraduate and postgraduate engineering programmes.',
    groups: [
      {
        id: 'cal-btech',
        title: 'B.Tech Programmes',
        documents: [
          { id: 'cal-btech-1', title: 'Changes in Examination Tab', href: '' },
          { id: 'cal-btech-2', title: 'Academic Calendar', href: '' },
        ],
      },
      {
        id: 'cal-mtech',
        title: 'M.Tech Programmes',
        documents: [{ id: 'cal-mtech-1', title: 'Academic Calendar', href: '' }],
      },
      {
        id: 'cal-mca',
        title: 'MCA Programmes',
        documents: [{ id: 'cal-mca-1', title: 'Academic Calendar', href: '' }],
      },
    ],
  },
  academicRegulation: {
    label: 'Academic Regulation',
    title: 'Regulatory Framework',
    description: 'Autonomous academic regulations governing credit systems, evaluation norms, and promotion rules.',
    groups: [
      {
        id: 'reg-mtech',
        title: 'M.Tech Programmes',
        documents: [{ id: 'reg-mtech-1', title: 'Academic Regulation', href: '' }],
      },
      {
        id: 'reg-mba',
        title: 'MBA Programmes',
        documents: [],
        emptyMessage: 'MBA academic regulations will be published here shortly.',
      },
    ],
  },
  syllabus: {
    label: 'Syllabus',
    title: 'Programme Syllabus',
    description: 'Curriculum and syllabus documents for UG and PG engineering programmes.',
    placeholderText:
      'Syllabus documents for all programmes will be made available here. For department-specific curriculum, please visit the respective programme pages under Departments.',
    groups: [],
  },
  timeTable: {
    label: 'Time Table',
    title: 'Examination Time Tables',
    description: 'Official examination schedules and revisions for current academic sessions.',
    documents: [
      { id: 'tt-1', title: 'Changes in Time Table', href: '' },
      { id: 'tt-2', title: 'Examination Time Table', href: '' },
    ],
  },
  circulars: {
    label: 'Circulars',
    title: 'Circulars & Notifications',
    description: 'Official examination circulars issued by the Controller of Examinations.',
    groups: [
      {
        id: 'circ-btech',
        title: 'B.Tech Circulars',
        documents: [
          { id: 'circ-btech-1', title: 'Changes in VIET Web Circular and Notifications Tab', href: '' },
          { id: 'circ-btech-2', title: 'DEO Circulars', href: '' },
        ],
      },
      {
        id: 'circ-mtech',
        title: 'M.Tech Circulars',
        documents: [],
        emptyMessage: 'M.Tech circulars will be published here shortly.',
      },
    ],
  },
  results: {
    label: 'Results',
    title: 'Examination Results Portal',
    description: 'Access semester-wise results for B.Tech, M.Tech, MBA, MCA, and JNTU-GV consolidated results.',
    notice:
      'Results are published on the official student portal. Use your roll number in CAPITAL letters as both username and password to log in.',
    portals: [
      { id: 'portal-1', title: 'B.Tech I Year', subtitle: 'Regular & supplementary results', href: '' },
      { id: 'portal-2', title: 'B.Tech II Year', subtitle: 'Regular & supplementary results', href: '' },
      { id: 'portal-3', title: 'B.Tech III Year', subtitle: 'Regular & supplementary results', href: '' },
      { id: 'portal-4', title: 'B.Tech IV Year', subtitle: 'Regular & supplementary results', href: '' },
      { id: 'portal-5', title: 'M.Tech', subtitle: 'Postgraduate examination results', href: '' },
      { id: 'portal-6', title: 'MBA', subtitle: 'Management programme results', href: '' },
      { id: 'portal-7', title: 'MCA', subtitle: 'Computer applications results', href: '' },
      { id: 'portal-8', title: 'JNTU-GV', subtitle: 'University consolidated results', href: '' },
    ],
  },
  contacts: {
    label: 'Contact',
    title: 'Examination Cell Officials',
    description:
      'Reach the Controller of Examinations and examination cell staff for queries related to schedules, results, and certificates.',
    people: [
      {
        id: 'contact-1',
        role: 'Chief Superintendent & Principal',
        name: 'Dr. G Vidya Pradeep Varma',
        address: 'VIET (Autonomous), Narava – 530027, Andhra Pradesh, India',
        phone: '',
        email: '',
      },
      {
        id: 'contact-2',
        role: 'Controller of Examinations (UG & PG)',
        name: 'Dr C. Govinda Rajulu',
        qualification: 'Ph.D., Professor',
        address: 'VIET (Autonomous) Examination Centre, Narava – 530027, Andhra Pradesh, India',
        phone: '+91 9440502945',
        email: 'nt_coe@viet.edu.in',
      },
      {
        id: 'contact-3',
        role: 'Additional Controller of Examinations (UG & PG)',
        name: 'Mr. Gorle Sunil',
        qualification: 'M.Tech, Assistant Professor',
        address: 'VIET (Autonomous) & Exam Cell In-Charge, JNTU-GV Narava – 530027, Andhra Pradesh, India',
        phone: '+91 8886586022',
        email: 'nt_examcell@vietvsp.com',
      },
      {
        id: 'contact-4',
        role: 'Additional Controller of Examinations – 2 (UG & PG)',
        name: 'Mr. Kare Jagadeswara Rao',
        qualification: 'M.Tech (Ph.D.), Assistant Professor',
        address: 'VIET (Autonomous) & Exam Cell In-Charge – 2, JNTU-GV Narava – 530027, Andhra Pradesh, India',
        phone: '+91 8500650399',
        email: 'nt_examcell@vietvsp.com',
      },
    ],
  },
};

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asBool(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function normalizeDocument(raw: unknown, index: number): ExamDocument {
  const row = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  return {
    id: asString(row.id, `doc-${index}`),
    title: asString(row.title),
    href: asString(row.href),
  };
}

function normalizeDocumentGroup(raw: unknown, index: number): ExamDocumentGroup {
  const row = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const docs = Array.isArray(row.documents) ? row.documents : Array.isArray(row.rows) ? row.rows : [];
  return {
    id: asString(row.id, `group-${index}`),
    title: asString(row.title),
    documents: docs.map((d, i) => normalizeDocument(d, i)),
    emptyMessage: typeof row.emptyMessage === 'string' ? row.emptyMessage : undefined,
  };
}

function normalizeSectionMeta(
  raw: unknown,
  fallback: ExamSectionMeta
): ExamSectionMeta {
  const row = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  return {
    label: asString(row.label, fallback.label),
    title: asString(row.title, fallback.title),
    description: asString(row.description, fallback.description),
  };
}

export function normalizeUgPgExaminationsContent(raw: unknown): UgPgExaminationsContent {
  const d = DEFAULT_UG_PG_EXAMINATIONS_CONTENT;
  if (!raw || typeof raw !== 'object') return structuredClone(d);
  const c = raw as Record<string, unknown>;
  const heroRaw = (c.hero && typeof c.hero === 'object' ? c.hero : {}) as Record<string, unknown>;

  const notices = Array.isArray(c.notices)
    ? c.notices.map((item, index) => {
        const n = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
        return {
          id: asString(n.id, `notice-${index}`),
          title: asString(n.title),
          date: asString(n.date),
          type: asString(n.type, 'Results'),
          link: asString(n.link, '#'),
          isNew: asBool(n.isNew, false),
        } satisfies ExamNotice;
      })
    : d.notices;

  const stats = Array.isArray(c.stats)
    ? c.stats.map((item) => {
        const s = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
        return { value: asString(s.value), label: asString(s.label) };
      })
    : d.stats;

  const resultInstructions = Array.isArray(c.resultInstructions)
    ? c.resultInstructions.map((x) => asString(x)).filter(Boolean)
    : d.resultInstructions;

  const normalizeGroupedSection = (
    key: 'academicCalendar' | 'academicRegulation' | 'circulars',
    fallback: ExamSectionMeta & { groups: ExamDocumentGroup[] }
  ) => {
    const sectionRaw = (c[key] && typeof c[key] === 'object' ? c[key] : {}) as Record<string, unknown>;
    const meta = normalizeSectionMeta(sectionRaw, fallback);
    const groups = Array.isArray(sectionRaw.groups)
      ? sectionRaw.groups.map((g, i) => normalizeDocumentGroup(g, i))
      : fallback.groups;
    return { ...meta, groups };
  };

  const syllabusRaw = (c.syllabus && typeof c.syllabus === 'object' ? c.syllabus : {}) as Record<string, unknown>;
  const timeTableRaw = (c.timeTable && typeof c.timeTable === 'object' ? c.timeTable : {}) as Record<string, unknown>;
  const resultsRaw = (c.results && typeof c.results === 'object' ? c.results : {}) as Record<string, unknown>;
  const contactsRaw = (c.contacts && typeof c.contacts === 'object' ? c.contacts : {}) as Record<string, unknown>;
  const coeRaw = (
    c.controllerOfExaminations && typeof c.controllerOfExaminations === 'object'
      ? c.controllerOfExaminations
      : {}
  ) as Record<string, unknown>;

  return {
    hero: {
      badge: asString(heroRaw.badge, d.hero.badge),
      title: asString(heroRaw.title, d.hero.title),
      description: asString(heroRaw.description, d.hero.description),
      image: asString(heroRaw.image, d.hero.image || '') || undefined,
      primaryCtaLabel: asString(heroRaw.primaryCtaLabel, d.hero.primaryCtaLabel),
      secondaryCtaLabel: asString(heroRaw.secondaryCtaLabel, d.hero.secondaryCtaLabel),
    },
    stats,
    noticesHeading: normalizeSectionMeta(c.noticesHeading, d.noticesHeading),
    notices,
    resultInstructionsTitle: asString(c.resultInstructionsTitle, d.resultInstructionsTitle),
    resultInstructions,
    controllerOfExaminations: {
      label: asString(coeRaw.label, d.controllerOfExaminations.label),
      title: asString(coeRaw.title, d.controllerOfExaminations.title),
      designation: asString(coeRaw.designation, d.controllerOfExaminations.designation),
      name: asString(coeRaw.name, d.controllerOfExaminations.name),
      qualification: asString(coeRaw.qualification, d.controllerOfExaminations.qualification),
      intro: asString(coeRaw.intro, d.controllerOfExaminations.intro),
      image: asString(coeRaw.image, d.controllerOfExaminations.image || '') || undefined,
      messageLabel: asString(coeRaw.messageLabel, d.controllerOfExaminations.messageLabel),
      messageTitle: asString(coeRaw.messageTitle, d.controllerOfExaminations.messageTitle),
      message: asString(coeRaw.message, d.controllerOfExaminations.message),
      phone: asString(coeRaw.phone, d.controllerOfExaminations.phone || '') || undefined,
      email: asString(coeRaw.email, d.controllerOfExaminations.email || '') || undefined,
    },
    academicCalendar: normalizeGroupedSection('academicCalendar', d.academicCalendar),
    academicRegulation: normalizeGroupedSection('academicRegulation', d.academicRegulation),
    syllabus: {
      ...normalizeSectionMeta(syllabusRaw, d.syllabus),
      placeholderText: asString(syllabusRaw.placeholderText, d.syllabus.placeholderText),
      groups: Array.isArray(syllabusRaw.groups)
        ? syllabusRaw.groups.map((g, i) => normalizeDocumentGroup(g, i))
        : d.syllabus.groups,
    },
    timeTable: {
      ...normalizeSectionMeta(timeTableRaw, d.timeTable),
      documents: Array.isArray(timeTableRaw.documents)
        ? timeTableRaw.documents.map((doc, i) => normalizeDocument(doc, i))
        : d.timeTable.documents,
    },
    circulars: normalizeGroupedSection('circulars', d.circulars),
    results: {
      ...normalizeSectionMeta(resultsRaw, d.results),
      notice: asString(resultsRaw.notice, d.results.notice),
      portals: Array.isArray(resultsRaw.portals)
        ? resultsRaw.portals.map((item, index) => {
            const p = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
            return {
              id: asString(p.id, `portal-${index}`),
              title: asString(p.title),
              subtitle: asString(p.subtitle),
              href: asString(p.href),
            };
          })
        : d.results.portals,
    },
    contacts: {
      ...normalizeSectionMeta(contactsRaw, d.contacts),
      people: Array.isArray(contactsRaw.people)
        ? contactsRaw.people.map((item, index) => {
            const p = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
            return {
              id: asString(p.id, `contact-${index}`),
              role: asString(p.role),
              name: asString(p.name),
              qualification: asString(p.qualification) || undefined,
              address: asString(p.address),
              phone: asString(p.phone),
              email: asString(p.email),
            };
          })
        : d.contacts.people,
    },
  };
}
