/**
 * Config for department pages used by the generic department page route.
 * Maps slug (from URL /programs/department/:slug) to filters and back link.
 * Admin Department Pages use the same slugs; labels are in DepartmentPages.tsx DEPARTMENT_SLUGS.
 */

export type DepartmentPageConfig = {
  slug: string;
  backHref: string;
  facultyFilter: (department: string) => boolean;
  galleryFilter: (img: { department?: string }) => boolean;
};

function matchDept(d: string, ...terms: string[]): boolean {
  const lower = (d || '').toLowerCase();
  return terms.some((t) => lower.includes(t.toLowerCase()));
}

/** CSE, CSD, CSC, CSM share faculty across all four department pages. */
function isCSEFamilyDepartment(d: string): boolean {
  const x = (d || '').toLowerCase();
  return (
    ((x.includes('computer science and engineering (cse)') || x === 'cse' ||
      (x.includes('computer science') && x.includes('(cse)') && !x.includes('cyber') && !x.includes('datascience') && !x.includes('machinelearning'))) && !x.includes('(csc)') && !x.includes('(csd)') && !x.includes('(csm)')) ||
    x.includes('cse datascience (csd)') || x.includes('datascience (csd)') || (x.includes('data science') && x.includes('(csd)')) || x === 'csd' ||
    x.includes('cse cybersecurity (csc)') || x.includes('cybersecurity (csc)') || (x.includes('cyber') && x.includes('(csc)')) || x === 'csc' ||
    x.includes('cse machinelearning (csm)') || x.includes('machinelearning (csm)') || (x.includes('machine learning') && x.includes('(csm)')) || (x.includes('aiml') && x.includes('(csm)')) || x === 'csm'
  );
}

const configs: Record<string, DepartmentPageConfig> = {
  // Diploma
  'diploma-agriculture': {
    slug: 'diploma-agriculture',
    backHref: '/btech',
    facultyFilter: (d) => matchDept(d, 'agriculture'),
    galleryFilter: (img) => matchDept(img.department || '', 'agriculture', 'diploma'),
  },
  'diploma-civil': {
    slug: 'diploma-civil',
    backHref: '/btech',
    facultyFilter: (d) => matchDept(d, 'civil') && (matchDept(d, 'diploma') || !matchDept(d, 'engineering ug', 'b.tech')),
    galleryFilter: (img) => matchDept(img.department || '', 'civil', 'diploma'),
  },
  'diploma-cse': {
    slug: 'diploma-cse',
    backHref: '/btech',
    facultyFilter: (d) => matchDept(d, 'computer') && (matchDept(d, 'diploma') || matchDept(d, 'computer science engineering')),
    galleryFilter: (img) => matchDept(img.department || '', 'computer', 'cse', 'diploma'),
  },
  'diploma-ece': {
    slug: 'diploma-ece',
    backHref: '/btech',
    facultyFilter: (d) => matchDept(d, 'ece', 'electronics') && (matchDept(d, 'diploma') || matchDept(d, 'communications')),
    galleryFilter: (img) => matchDept(img.department || '', 'ece', 'electronics', 'diploma'),
  },
  'diploma-eee': {
    slug: 'diploma-eee',
    backHref: '/btech',
    facultyFilter: (d) => matchDept(d, 'eee', 'electrical') && (matchDept(d, 'diploma') || matchDept(d, 'electrical & electronics')),
    galleryFilter: (img) => matchDept(img.department || '', 'eee', 'electrical', 'diploma'),
  },
  'diploma-mechanical': {
    slug: 'diploma-mechanical',
    backHref: '/btech',
    facultyFilter: (d) => matchDept(d, 'mechanical') && (matchDept(d, 'diploma') || !matchDept(d, 'engineering ug', 'm.tech', 'b.tech')),
    galleryFilter: (img) => matchDept(img.department || '', 'mechanical', 'diploma'),
  },
  // Engineering PG
  'pg-cadcam': {
    slug: 'pg-cadcam',
    backHref: '/btech',
    facultyFilter: (d) => matchDept(d, 'cad', 'cam', 'cadcam'),
    galleryFilter: (img) => matchDept(img.department || '', 'cad', 'cam', 'pg', 'm.tech'),
  },
  'pg-cse': {
    slug: 'pg-cse',
    backHref: '/btech',
    facultyFilter: (d) => matchDept(d, 'cse', 'computer science') && matchDept(d, 'pg', 'm.tech', 'postgraduate'),
    galleryFilter: (img) => matchDept(img.department || '', 'cse', 'computer', 'pg', 'm.tech'),
  },
  'pg-power-systems': {
    slug: 'pg-power-systems',
    backHref: '/btech',
    facultyFilter: (d) => matchDept(d, 'power system'),
    galleryFilter: (img) => matchDept(img.department || '', 'power', 'pg', 'm.tech'),
  },
  'pg-structural': {
    slug: 'pg-structural',
    backHref: '/btech',
    facultyFilter: (d) => matchDept(d, 'structural'),
    galleryFilter: (img) => matchDept(img.department || '', 'structural', 'pg', 'm.tech'),
  },
  'pg-thermal': {
    slug: 'pg-thermal',
    backHref: '/btech',
    facultyFilter: (d) => matchDept(d, 'thermal'),
    galleryFilter: (img) => matchDept(img.department || '', 'thermal', 'pg', 'm.tech'),
  },
  'pg-vlsi': {
    slug: 'pg-vlsi',
    backHref: '/btech',
    facultyFilter: (d) => matchDept(d, 'vlsi', 'embedded'),
    galleryFilter: (img) => matchDept(img.department || '', 'vlsi', 'embedded', 'pg', 'm.tech'),
  },
  // Management
  'management-bba': {
    slug: 'management-bba',
    backHref: '/btech',
    facultyFilter: (d) => matchDept(d, 'bba', 'business administration'),
    galleryFilter: (img) => matchDept(img.department || '', 'bba', 'management', 'business'),
  },
  'management-bca': {
    slug: 'management-bca',
    backHref: '/btech',
    facultyFilter: (d) => matchDept(d, 'bca', 'computer applications'),
    galleryFilter: (img) => matchDept(img.department || '', 'bca', 'management', 'computer applications'),
  },
  'management-mba': {
    slug: 'management-mba',
    backHref: '/btech',
    facultyFilter: (d) => matchDept(d, 'mba', 'business administration'),
    galleryFilter: (img) => matchDept(img.department || '', 'mba', 'management', 'business'),
  },
  'management-mca': {
    slug: 'management-mca',
    backHref: '/btech',
    facultyFilter: (d) => matchDept(d, 'mca', 'computer applications'),
    galleryFilter: (img) => matchDept(img.department || '', 'mca', 'management', 'computer applications'),
  },
  // Engineering UG (used by DepartmentPageTemplate + migration)
  // CSE family: CSE, CSD, CSC, CSM share faculty across all four pages
  'cse': {
    slug: 'cse',
    backHref: '/btech',
    facultyFilter: isCSEFamilyDepartment,
    galleryFilter: (img) => matchDept(img.department || '', 'computer science', 'cse', 'engineering ug - computer'),
  },
  'cyber-security': {
    slug: 'cyber-security',
    backHref: '/btech',
    facultyFilter: isCSEFamilyDepartment,
    galleryFilter: (img) => matchDept(img.department || '', 'cyber', 'csc'),
  },
  'data-science': {
    slug: 'data-science',
    backHref: '/btech',
    facultyFilter: isCSEFamilyDepartment,
    galleryFilter: (img) => matchDept(img.department || '', 'data science', 'csd'),
  },
  'aiml': {
    slug: 'aiml',
    backHref: '/btech',
    facultyFilter: isCSEFamilyDepartment,
    galleryFilter: (img) => matchDept(img.department || '', 'aiml', 'csm', 'machine learning'),
  },
  'ece': {
    slug: 'ece',
    backHref: '/btech',
    facultyFilter: (d) => {
      const x = (d || '').toLowerCase().trim();
      const hasEce = x.includes('electronics') && x.includes('communication');
      const hasEee = x.includes('electrical') && x.includes('electronics');
      return (hasEce && !hasEee) || x === 'ece' || x.includes('electronics and communication');
    },
    galleryFilter: (img) => matchDept(img.department || '', 'ece', 'electronics', 'communication'),
  },
  'eee': {
    slug: 'eee',
    backHref: '/btech',
    facultyFilter: (d) => {
      const x = (d || '').toLowerCase().trim();
      const hasEee = x.includes('electrical') && x.includes('electronics');
      const hasEce = x.includes('electronics') && x.includes('communication');
      return (hasEee && !hasEce) || x === 'eee' || x.includes('electrical and electronics');
    },
    galleryFilter: (img) => matchDept(img.department || '', 'eee', 'electrical'),
  },
  'civil': {
    slug: 'civil',
    backHref: '/btech',
    facultyFilter: (d) => matchDept(d, 'civil'),
    galleryFilter: (img) => matchDept(img.department || '', 'civil'),
  },
  'mechanical': {
    slug: 'mechanical',
    backHref: '/btech',
    facultyFilter: (d) => matchDept(d, 'mechanical'),
    galleryFilter: (img) => matchDept(img.department || '', 'mechanical'),
  },
  'automobile': {
    slug: 'automobile',
    backHref: '/btech',
    facultyFilter: (d) => matchDept(d, 'automobile', 'ame'),
    galleryFilter: (img) => matchDept(img.department || '', 'automobile', 'ame'),
  },
  'bsh': {
    slug: 'bsh',
    backHref: '/btech',
    facultyFilter: (d) => matchDept(d, 'bsh', 'basic science', 'humanities'),
    galleryFilter: (img) => matchDept(img.department || '', 'bsh', 'basic science', 'humanities'),
  },
};

export function getDepartmentPageConfig(slug: string): DepartmentPageConfig | null {
  return configs[slug] ?? null;
}

export function getAllDepartmentPageSlugs(): string[] {
  return Object.keys(configs);
}

/** Display name for gallery/back link (e.g. "Civil Engineering (Diploma)") */
const displayNames: Record<string, string> = {
  'diploma-agriculture': 'Agriculture Engineering (Diploma)',
  'diploma-civil': 'Civil Engineering (Diploma)',
  'diploma-cse': 'Computer Science Engineering (Diploma)',
  'diploma-ece': 'Electronics & Communications (Diploma)',
  'diploma-eee': 'Electrical & Electronics (Diploma)',
  'diploma-mechanical': 'Mechanical Engineering (Diploma)',
  'pg-cadcam': 'CAD/CAM (M.Tech)',
  'pg-cse': 'Computer Science & Engineering (M.Tech)',
  'pg-power-systems': 'Power Systems (M.Tech)',
  'pg-structural': 'Structural Engineering (M.Tech)',
  'pg-thermal': 'Thermal Engineering (M.Tech)',
  'pg-vlsi': 'VLSI & Embedded Systems (M.Tech)',
  'management-bba': 'BBA',
  'management-bca': 'BCA',
  'management-mba': 'MBA',
  'management-mca': 'MCA',
};

export function getDepartmentDisplayName(slug: string): string {
  return displayNames[slug] || 'Gallery';
}

/** Return department page URL for a programme (stream, level, name) from DisciplinesSection / departments API */
export function getProgrammeHref(stream: string, level: string, name: string): string {
  const s = (stream || '').toUpperCase();
  const l = (level || '').toLowerCase();
  const n = (name || '').toLowerCase();

  if (s === 'DIPLOMA') {
    if (n.includes('agriculture')) return '/programs/department/diploma-agriculture';
    if (n.includes('civil')) return '/programs/department/diploma-civil';
    if (n.includes('computer') && n.includes('science')) return '/programs/department/diploma-cse';
    if (n.includes('ece') || (n.includes('electronics') && n.includes('communication'))) return '/programs/department/diploma-ece';
    if (n.includes('eee') || (n.includes('electrical') && n.includes('electronics'))) return '/programs/department/diploma-eee';
    if (n.includes('mechanical')) return '/programs/department/diploma-mechanical';
  }

  if (s === 'ENGINEERING' && (l.includes('pg') || l.includes('m.tech'))) {
    if (n.includes('cad') || n.includes('cam')) return '/programs/department/pg-cadcam';
    if (n.includes('computer') && n.includes('cse')) return '/programs/department/pg-cse';
    if (n.includes('power')) return '/programs/department/pg-power-systems';
    if (n.includes('structural')) return '/programs/department/pg-structural';
    if (n.includes('thermal')) return '/programs/department/pg-thermal';
    if (n.includes('vlsi') || n.includes('embedded')) return '/programs/department/pg-vlsi';
  }

  if (s === 'MANAGEMENT') {
    if (n.includes('bba')) return '/programs/department/management-bba';
    if (n.includes('bca')) return '/programs/department/management-bca';
    if (n.includes('mba')) return '/programs/department/management-mba';
    if (n.includes('mca')) return '/programs/department/management-mca';
  }

  // Engineering UG — existing routes
  if (s === 'ENGINEERING' && (l.includes('ug') || l.includes('b.tech'))) {
    if (n.includes('automobile') || n.includes('ame')) return '/programs/engineering/ug/ame';
    if (n.includes('basic science') || n.includes('bs&h') || n.includes('bsh')) return '/programs/engineering/ug/bsh';
    if (n.includes('civil')) return '/programs/engineering/ug/civil';
    if (n.includes('computer science') && n.includes('cse') && !n.includes('data') && !n.includes('cyber') && !n.includes('machine') && !n.includes('ai')) return '/programs/engineering/ug/cse';
    if (n.includes('data science') || n.includes('csd')) return '/programs/engineering/ug/data-science';
    if (n.includes('cyber') || n.includes('csc')) return '/programs/engineering/ug/cyber-security';
    if (n.includes('machine learning') || n.includes('aiml') || n.includes('csm') || n.includes('ai & ml')) return '/programs/engineering/ug/aiml';
    if (n.includes('ece') || (n.includes('electronics') && n.includes('communication'))) return '/programs/engineering/ug/ece';
    if (n.includes('eee') || (n.includes('electrical') && n.includes('electronics'))) return '/programs/engineering/ug/eee';
    if (n.includes('mechanical')) return '/programs/engineering/ug/mechanical';
  }

  return '#';
}
