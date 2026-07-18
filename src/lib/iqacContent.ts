/**
 * IQAC page content model — stored in the `pages` table (slug: "iqac").
 * Public page and admin editor both normalize through this module so the
 * page always renders even before the admin saves anything.
 */

export type IqacDocItem = {
  title: string;
  year: string;
  size: string;
  latest: boolean;
  fileUrl: string;
};

export type IqacDocGroup = {
  category: string;
  label: string;
  tag: string;
  items: IqacDocItem[];
};

export type IqacMember = {
  name: string;
  role: string;
  dept: string;
  initials: string;
};

export type IqacStat = {
  val: string;
  desc: string;
};

export type IqacContent = {
  hero: {
    badge: string;
    titleLight: string;
    titleBold: string;
    subtitle: string;
    stats: IqacStat[];
  };
  documentsIntro: string;
  documents: IqacDocGroup[];
  contactNotice: {
    email: string;
    location: string;
  };
  committeeIntro: string;
  committee: IqacMember[];
  about: {
    heading: string;
    paragraphs: string[];
    coreFunctions: string[];
    contact: {
      address: string;
      phone: string;
      email: string;
      hours: string;
    };
  };
};

export function initialsFromName(name: string): string {
  return name
    .replace(/^(dr|prof|mr|mrs|ms|smt|shri)\.?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '—';
}

export const DEFAULT_IQAC_CONTENT: IqacContent = {
  hero: {
    badge: 'Est. 2004 · NAAC Accredited',
    titleLight: 'Internal Quality',
    titleBold: 'Assurance Cell',
    subtitle:
      'A dedicated institutional unit fostering continuous improvement across academic, administrative, and research functions in alignment with NAAC & UGC standards.',
    stats: [
      { val: 'A+', desc: 'NAAC Grade' },
      { val: '47', desc: 'NIRF Rank 2024' },
      { val: '20+', desc: 'Years Active' },
      { val: '100%', desc: 'Compliance Rate' },
    ],
  },
  documentsIntro: 'Official documents submitted to regulatory bodies. All files are in PDF format.',
  documents: [
    {
      category: 'NAAC',
      label: 'National Assessment & Accreditation',
      tag: 'NAAC',
      items: [
        { title: 'Self Study Report (SSR) 2024', size: '4.2 MB', year: '2024', latest: true, fileUrl: '' },
        { title: 'Grade Certificate', size: '1.1 MB', year: '2023', latest: false, fileUrl: '' },
        { title: 'Peer Team Report', size: '2.8 MB', year: '2023', latest: false, fileUrl: '' },
        { title: 'Accreditation Certificate', size: '0.9 MB', year: '2022', latest: false, fileUrl: '' },
      ],
    },
    {
      category: 'NIRF',
      label: 'National Institutional Ranking Framework',
      tag: 'NIRF',
      items: [
        { title: 'Ranking Submission Data 2024', size: '3.0 MB', year: '2024', latest: true, fileUrl: '' },
        { title: 'Ranking Submission Data 2023', size: '2.7 MB', year: '2023', latest: false, fileUrl: '' },
        { title: 'Ranking Submission Data 2022', size: '2.5 MB', year: '2022', latest: false, fileUrl: '' },
      ],
    },
    {
      category: 'AQAR',
      label: 'Annual Quality Assurance Report',
      tag: 'AQAR',
      items: [
        { title: 'AQAR 2023–24', size: '5.1 MB', year: '2024', latest: true, fileUrl: '' },
        { title: 'AQAR 2022–23', size: '4.8 MB', year: '2023', latest: false, fileUrl: '' },
        { title: 'AQAR 2021–22', size: '4.4 MB', year: '2022', latest: false, fileUrl: '' },
        { title: 'AQAR 2020–21', size: '4.0 MB', year: '2021', latest: false, fileUrl: '' },
      ],
    },
    {
      category: 'Feedback',
      label: 'Stakeholder Feedback Reports',
      tag: 'FBK',
      items: [
        { title: 'Student Feedback Analysis 2024', size: '2.1 MB', year: '2024', latest: true, fileUrl: '' },
        { title: 'Faculty Feedback Report 2024', size: '1.8 MB', year: '2024', latest: false, fileUrl: '' },
        { title: 'Alumni Feedback 2023', size: '1.5 MB', year: '2023', latest: false, fileUrl: '' },
      ],
    },
    {
      category: 'Action Taken Reports',
      label: 'ATR on Stakeholder Feedback',
      tag: 'ATR',
      items: [
        { title: 'ATR on Student Feedback 2024', size: '1.2 MB', year: '2024', latest: true, fileUrl: '' },
        { title: 'ATR on Faculty Feedback 2024', size: '1.0 MB', year: '2024', latest: false, fileUrl: '' },
        { title: 'ATR on Alumni Feedback 2023', size: '0.9 MB', year: '2023', latest: false, fileUrl: '' },
      ],
    },
    {
      category: 'Minutes of Meetings',
      label: 'IQAC Governing Body Proceedings',
      tag: 'MOM',
      items: [
        { title: 'IQAC Meeting – March 2024', size: '0.8 MB', year: '2024', latest: true, fileUrl: '' },
        { title: 'IQAC Meeting – December 2023', size: '0.7 MB', year: '2023', latest: false, fileUrl: '' },
        { title: 'IQAC Meeting – September 2023', size: '0.7 MB', year: '2023', latest: false, fileUrl: '' },
      ],
    },
  ],
  contactNotice: {
    email: 'iqac@viet.edu.in',
    location: 'Admin Block, Room 104',
  },
  committeeIntro: 'Constituted per UGC & NAAC norms for the academic year 2024–25.',
  committee: [
    { name: 'Dr. Rajesh Kumar', role: 'Director / IQAC Coordinator', dept: "Principal's Office", initials: 'RK' },
    { name: 'Prof. Anita Sharma', role: 'Member', dept: 'Dept. of Computer Science', initials: 'AS' },
    { name: 'Dr. S. Venkata Rao', role: 'Member', dept: 'Dept. of Electronics', initials: 'VR' },
    { name: 'Mrs. Priya Nair', role: 'Member – Administrative', dept: 'Admin Office', initials: 'PN' },
    { name: 'Mr. Arun Patel', role: 'External Member', dept: 'Industry Representative', initials: 'AP' },
    { name: 'Ms. Kavitha Reddy', role: 'Student Representative', dept: 'Final Year – CSE', initials: 'KR' },
  ],
  about: {
    heading: 'About the Cell',
    paragraphs: [
      'The IQAC was established in 2004 as a post-accreditation quality sustenance measure in accordance with NAAC guidelines. It functions as the nodal agency for all quality-related initiatives within the institution.',
      'Its mandate is to develop a system for conscious, consistent, and catalytic improvement in the overall performance of the institution through internalization of best practices.',
    ],
    coreFunctions: [
      'Develop and apply quality benchmarks for all programmes',
      'Facilitate learner-centric environment for quality education',
      'Collect, document and analyse data on institutional quality',
      'Organise seminars on quality-related themes and best practices',
      'Prepare Annual Quality Assurance Reports (AQAR)',
    ],
    contact: {
      address: 'Admin Block, Room 104\nVIET Campus, Narava, Visakhapatnam – 530 027',
      phone: '+91 891 279 0404',
      email: 'iqac@viet.edu.in',
      hours: 'Mon – Sat, 9:30 AM – 4:30 PM',
    },
  },
};

function asString(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback;
}

function asBool(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function normalizeStat(raw: unknown): IqacStat | null {
  if (!raw || typeof raw !== 'object') return null;
  const s = raw as Record<string, unknown>;
  return { val: asString(s.val, ''), desc: asString(s.desc, '') };
}

function normalizeDocItem(raw: unknown): IqacDocItem | null {
  if (!raw || typeof raw !== 'object') return null;
  const i = raw as Record<string, unknown>;
  return {
    title: asString(i.title, ''),
    year: asString(i.year, ''),
    size: asString(i.size, ''),
    latest: asBool(i.latest, false),
    fileUrl: asString(i.fileUrl, ''),
  };
}

function normalizeDocGroup(raw: unknown): IqacDocGroup | null {
  if (!raw || typeof raw !== 'object') return null;
  const g = raw as Record<string, unknown>;
  const items = Array.isArray(g.items)
    ? (g.items.map(normalizeDocItem).filter(Boolean) as IqacDocItem[])
    : [];
  return {
    category: asString(g.category, ''),
    label: asString(g.label, ''),
    tag: asString(g.tag, ''),
    items,
  };
}

function normalizeMember(raw: unknown): IqacMember | null {
  if (!raw || typeof raw !== 'object') return null;
  const m = raw as Record<string, unknown>;
  const name = asString(m.name, '');
  return {
    name,
    role: asString(m.role, ''),
    dept: asString(m.dept, ''),
    initials: asString(m.initials, '') || initialsFromName(name),
  };
}

/** Merge saved (possibly partial/legacy) content with defaults. */
export function normalizeIqacContent(raw: unknown): IqacContent {
  const d = DEFAULT_IQAC_CONTENT;
  if (!raw || typeof raw !== 'object') return d;
  const c = raw as Record<string, unknown>;
  const hero = (c.hero && typeof c.hero === 'object' ? c.hero : {}) as Record<string, unknown>;
  const notice = (c.contactNotice && typeof c.contactNotice === 'object' ? c.contactNotice : {}) as Record<string, unknown>;
  const about = (c.about && typeof c.about === 'object' ? c.about : {}) as Record<string, unknown>;
  const aboutContact = (about.contact && typeof about.contact === 'object' ? about.contact : {}) as Record<string, unknown>;

  const heroStats = Array.isArray(hero.stats)
    ? (hero.stats.map(normalizeStat).filter(Boolean) as IqacStat[])
    : [];
  const documents = Array.isArray(c.documents)
    ? (c.documents.map(normalizeDocGroup).filter(Boolean) as IqacDocGroup[])
    : [];
  const committee = Array.isArray(c.committee)
    ? (c.committee.map(normalizeMember).filter(Boolean) as IqacMember[])
    : [];

  return {
    hero: {
      badge: asString(hero.badge, d.hero.badge),
      titleLight: asString(hero.titleLight, d.hero.titleLight),
      titleBold: asString(hero.titleBold, d.hero.titleBold),
      subtitle: asString(hero.subtitle, d.hero.subtitle),
      stats: heroStats.length > 0 ? heroStats : d.hero.stats,
    },
    documentsIntro: asString(c.documentsIntro, d.documentsIntro),
    documents: documents.length > 0 ? documents : d.documents,
    contactNotice: {
      email: asString(notice.email, d.contactNotice.email),
      location: asString(notice.location, d.contactNotice.location),
    },
    committeeIntro: asString(c.committeeIntro, d.committeeIntro),
    committee: committee.length > 0 ? committee : d.committee,
    about: {
      heading: asString(about.heading, d.about.heading),
      paragraphs:
        Array.isArray(about.paragraphs) && about.paragraphs.length > 0
          ? about.paragraphs.filter((p): p is string => typeof p === 'string')
          : d.about.paragraphs,
      coreFunctions:
        Array.isArray(about.coreFunctions) && about.coreFunctions.length > 0
          ? about.coreFunctions.filter((f): f is string => typeof f === 'string')
          : d.about.coreFunctions,
      contact: {
        address: asString(aboutContact.address, d.about.contact.address),
        phone: asString(aboutContact.phone, d.about.contact.phone),
        email: asString(aboutContact.email, d.about.contact.email),
        hours: asString(aboutContact.hours, d.about.contact.hours),
      },
    },
  };
}
