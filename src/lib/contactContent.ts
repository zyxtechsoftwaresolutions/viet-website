export type CollegeContactDetail = {
  label: string;
  value: string;
  href?: string;
};

export type AuthorityContact = {
  role: string;
  name: string;
  slug: string;
  profileHref?: string;
  phone?: string;
  email?: string;
  note?: string;
};

export type KeyContact = {
  title: string;
  person?: string;
  phone?: string;
  email?: string;
  whatsapp?: string[];
  extra?: string;
};

export const COLLEGE_INFO = {
  name: 'Visakha Institute of Engineering & Technology (Autonomous)',
  shortName: 'VIET',
  address: '88th Division, Narava, GVMC, Visakhapatnam, Andhra Pradesh 530027, India',
  phones: ['+91 9959617476', '+91 9550957054', '+91 9959617477'],
  emails: ['website@viet.edu.in', 'vietvsp@gmail.com', 'admissions@viet.edu.in'],
  officeHours: 'Monday – Friday, 9:00 AM – 5:00 PM',
  website: 'https://vietvsp.com',
};

export const MAP_EMBED_URL =
  'https://maps.google.com/maps?q=Visakha+Institute+of+Engineering+and+Technology,+Narava,+Visakhapatnam,+530027&hl=en&z=16&output=embed';

export const MAP_DIRECTIONS_URL =
  'https://www.google.com/maps/dir/?api=1&destination=Visakha+Institute+of+Engineering+and+Technology,+Narava,+Visakhapatnam,+530027';

export const AUTHORITY_CONTACTS: AuthorityContact[] = [
  {
    role: 'Chairman',
    name: 'Sri G. Satyanarayana Garu',
    slug: 'chairman',
    profileHref: '/chairman',
    note: 'Institutional leadership and vision',
  },
  {
    role: 'Principal',
    name: 'Dr. G. Vidya Pradeep Varma',
    slug: 'principal',
    profileHref: '/principal',
    note: 'Academic administration',
  },
  {
    role: 'Diploma Principal',
    name: 'Mr. P. Prasad',
    slug: 'diploma-principal',
    profileHref: '/diploma-principal',
    note: 'Diploma programmes',
  },
  {
    role: 'Dean Academics',
    name: 'Dean Academics',
    slug: 'dean-academics',
    profileHref: '/dean-academics',
    note: 'Curriculum and academic affairs',
  },
  {
    role: 'Dean Innovation',
    name: 'Dean Innovation',
    slug: 'dean-innovation',
    profileHref: '/dean-innovation',
    note: 'Innovation, projects and industry connect',
  },
  {
    role: 'Human Resources',
    name: 'HR',
    slug: 'hr',
    profileHref: '/hr',
    note: 'Faculty and staff administration',
  },
];

export const KEY_CONTACTS: KeyContact[] = [
  {
    title: 'Admissions & Enquiry',
    person: 'P. Subba Raju',
    phone: '+91 9959617476, +91 9550957054, +91 9959617477',
    email: 'vietvsp@gmail.com',
  },
  {
    title: 'Training & Placements',
    person: 'Dendukuri Devi Prasanna Varma',
    phone: '+91 88868 88445',
    email: 'deancdc@viet.edu.in',
  },
  {
    title: 'Grievance Redressal',
    whatsapp: ['+91 9494670501', '+91 9550957054'],
  },
  {
    title: 'Anti-Ragging Helpline',
    extra: 'National helpline: 1800-180-5522',
  },
];
