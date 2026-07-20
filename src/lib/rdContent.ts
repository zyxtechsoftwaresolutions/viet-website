import type { LucideIcon } from 'lucide-react';
import {
  Award,
  BookOpen,
  Briefcase,
  Building2,
  FileText,
  FlaskConical,
  GraduationCap,
  Image,
  Search,
  Settings,
  Target,
  Users,
} from 'lucide-react';

export type RdSection = {
  id: string;
  title: string;
  shortTitle: string;
  icon: LucideIcon;
};

export const RD_SECTIONS: RdSection[] = [
  { id: 'about', title: 'About R & D', shortTitle: 'About', icon: Building2 },
  { id: 'director', title: 'About Director', shortTitle: 'Director', icon: Users },
  { id: 'vision-mission', title: 'Vision and Mission', shortTitle: 'Vision', icon: Target },
  { id: 'roles-responsibilities', title: 'Roles & Responsibilities', shortTitle: 'Roles', icon: Settings },
  { id: 'committee', title: 'R&D Committee', shortTitle: 'Committee', icon: Users },
  { id: 'department-coordinators', title: 'Department Coordinators', shortTitle: 'Coordinators', icon: Users },
  { id: 'phd-holders', title: 'List of Ph.D Holders', shortTitle: 'PhD Holders', icon: GraduationCap },
  { id: 'phd-pursuing', title: 'List of Pursuing (PhD)', shortTitle: 'PhD Pursuing', icon: GraduationCap },
  { id: 'policy', title: 'R&D Policy', shortTitle: 'Policy', icon: FileText },
  { id: 'journals', title: 'Journals', shortTitle: 'Journals', icon: BookOpen },
  { id: 'patents', title: 'Patents', shortTitle: 'Patents', icon: Award },
  { id: 'textbooks', title: 'Text Books', shortTitle: 'Textbooks', icon: BookOpen },
  { id: 'consultancy', title: 'Consultancy Services', shortTitle: 'Consultancy', icon: Briefcase },
  { id: 'facilities', title: 'R&D Facilities', shortTitle: 'Facilities', icon: FlaskConical },
  { id: 'gallery', title: 'R&D Works Gallery', shortTitle: 'Gallery', icon: Image },
  { id: 'research-areas', title: 'Research Areas', shortTitle: 'Research', icon: Search },
];

export const RD_HERO = {
  badge: 'Innovation · Discovery · Excellence',
  titleLight: 'Research &',
  titleBold: 'Development',
  subtitle:
    'Catalyst for technological breakthroughs and academic brilliance — transforming ideas into innovations that shape the future.',
  stats: [
    { val: '19+', desc: 'Ph.D. Holders' },
    { val: '26', desc: 'Pursuing Ph.D.' },
    { val: '7', desc: 'Dept. Coordinators' },
    { val: '6', desc: 'Committee Members' },
  ],
};

export const rdCommittee = [
  { sno: 1, name: 'Dr G.Vidya Pradeep Varma', designation: 'Principal', role: 'Chairman', responsibility: 'Over all Supervision and guidance' },
  { sno: 2, name: 'Dr T Satyanarayana', designation: 'Associate Professor', role: 'R&D Dean', responsibility: 'Co-ordinating all the members, Conducting R&D meetings and compiling data' },
  { sno: 3, name: 'Dr D Santha Rao', designation: 'Professor', role: 'member', responsibility: 'Advisor of R&D' },
  { sno: 4, name: 'Dr.P.V.V Satyanarayana', designation: 'Associate Professor', role: 'member', responsibility: 'Monitoring of R&D activities at Mechanical Dept. level' },
  { sno: 5, name: 'Ms M Sowjanya', designation: 'Assistant Professor', role: 'member', responsibility: 'Monitoring of R&D activities at CSE Dept. level' },
  { sno: 6, name: 'Mrs L. Keerthi', designation: 'Assistant Professor', role: 'member', responsibility: 'Monitoring of R&D activities at ECE Dept. level' },
];

export const departmentCoordinators = [
  { sno: 1, name: 'Dr P.V.V Satyanarayana', position: 'R&D Department Coordinator', department: 'Mechanical', photo: '/FACULTY/rd-coordinator-1.jpg' },
  { sno: 2, name: 'Dr.M Uday Bhaskar', position: 'R&D Department Coordinator', department: 'BS&H', photo: '/FACULTY/rd-coordinator-2.jpg' },
  { sno: 3, name: 'Ms M Sowjanya', position: 'R&D Department Coordinator', department: 'Computer Science and Engineering', photo: '/FACULTY/rd-coordinator-3.jpg' },
  { sno: 4, name: 'Mrs L. Keerthi', position: 'R&D Department Coordinator', department: 'ECE', photo: '/FACULTY/rd-coordinator-4.jpg' },
  { sno: 5, name: 'Mrs S Jyothi Rani', position: 'R&D Department Coordinator', department: 'EEE', photo: '/FACULTY/rd-coordinator-5.jpg' },
  { sno: 6, name: 'MS.T Rohini', position: 'R&D Department Coordinator', department: 'Civil', photo: '/FACULTY/rd-coordinator-6.jpg' },
  { sno: 7, name: 'Dr. S Kesava Nagu', position: 'R&D Department Coordinator', department: 'MBA', photo: '/FACULTY/rd-coordinator-7.jpg' },
];

export const phdHolders = [
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
  { sno: 19, name: 'Dr. S Kesava Nagu', designation: 'Associate Professor', experience: 4, department: 'MBA' },
];

export const phdPursuing = [
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
  { sno: 26, name: 'Mr. K. Bhargav', designation: 'Assistant Professor', experience: 4, department: 'BS&H' },
];

export const RD_OBJECTIVES = [
  { title: 'Promoting Research Culture', text: 'Creating awareness and opportunities for R&D among students and faculty across all departments.' },
  { title: 'Encouraging Academic Growth', text: 'Motivating faculty to pursue research projects, enhance their expertise, and register for Ph.D. programs.' },
  { title: 'Facilitating Publications', text: 'Inspiring students and staff to publish research papers in reputed national and international journals/conferences.' },
  { title: 'Interdisciplinary Research Support', text: 'Encouraging faculty across Engineering, Science, and Humanities to engage in R&D for professional growth.' },
  { title: 'Collaboration with Leading Agencies', text: 'Undertaking projects with ISRO, DRDO, CSIR, DST, AICTE, UGC, DBT and more.' },
  { title: 'Student Research Funding', text: 'Assisting students in securing research grants from TNSCST, IEI (I), DRDO, TCS, Infosys, etc.' },
  { title: 'Organizing Knowledge Forums', text: 'Securing funds for seminars, workshops, and faculty development programs (FDPs) from funding agencies.' },
  { title: 'Enhancing Research Impact', text: 'Developing strategies to increase faculty success in obtaining external research grants.' },
  { title: 'Building Research Networks', text: 'Strengthening collaborations across faculties, institutes, industries, and government organizations.' },
  { title: 'Industry & Community Engagement', text: 'Partnering with industries, government bodies, and professional organizations to promote impactful research.' },
  { title: 'Attracting Research Talent', text: 'Encouraging and supporting research-driven higher-degree students.' },
];

export const RD_PARTNERS = ['ISRO', 'DRDO', 'CSIR', 'DST', 'AICTE', 'UGC', 'DBT', 'TNSCST', 'IEI', 'TCS', 'Infosys'];

export type RdHeroStat = { val: string; desc: string };
export type RdHero = {
  badge: string;
  titleLight: string;
  titleBold: string;
  subtitle: string;
  stats: RdHeroStat[];
};

export type RdDirector = {
  name: string;
  designation: string;
  department: string;
  roleLabel: string;
  description: string;
};

export type RdVisionMission = {
  vision: string;
  missionPoints: string[];
};

export type RdRoleItem = {
  role: string;
  desc: string;
};

export type RdPolicy = {
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
};

export type RdSectionCopy = {
  title: string;
  description: string;
};

export type RdGalleryItem = {
  image: string;
  title: string;
  department: string;
};

export type RdPersonWithMeta = {
  sno: number;
  name: string;
  designation: string;
  experience: number;
  department: string;
};

export type RdCoordinator = {
  sno: number;
  name: string;
  position: string;
  department: string;
  photo: string;
};

export type RdCommitteeMember = {
  sno: number;
  name: string;
  designation: string;
  role: string;
  responsibility: string;
};

export type RdContent = {
  hero: RdHero;
  about: {
    introTitle: string;
    introParagraph1: string;
    introParagraph2: string;
    cellTitle: string;
    cellDescription: string;
    tagline: string;
    objectivesTitle: string;
    objectives: { title: string; text: string }[];
    partnersTitle: string;
    partners: string[];
  };
  director: RdDirector;
  visionMission: RdVisionMission;
  roles: RdRoleItem[];
  committee: RdCommitteeMember[];
  coordinators: RdCoordinator[];
  phdHolders: RdPersonWithMeta[];
  phdPursuing: RdPersonWithMeta[];
  policy: RdPolicy;
  journals: RdSectionCopy;
  patents: RdSectionCopy;
  textbooks: RdSectionCopy;
  consultancy: RdSectionCopy;
  facilities: RdSectionCopy;
  researchAreas: string[];
  gallery: RdGalleryItem[];
};

export const DEFAULT_RD_CONTENT: RdContent = {
  hero: RD_HERO,
  about: {
    introTitle: 'Innovation at VIET',
    introParagraph1:
      'At VIET, Research & Development (R&D) is the catalyst for technological breakthroughs and academic brilliance. It transforms ideas into innovations, simplifies complex concepts, and drives progress toward a smarter future.',
    introParagraph2:
      'R&D ignites curiosity, fosters critical thinking, and sharpens problem-solving skills, empowering students and faculty to push boundaries and redefine possibilities.',
    cellTitle: 'Research & Development Cell',
    cellDescription:
      'The Research and Development Cell is dedicated to fostering a vibrant research culture within the college. It actively promotes research in emerging and interdisciplinary fields across Engineering, Technology, Science, and Humanities.',
    tagline: 'Innovation starts here — where passion meets research, and ideas shape the future!',
    objectivesTitle: 'Objectives of R&D',
    objectives: RD_OBJECTIVES,
    partnersTitle: 'Funding & Collaboration Partners',
    partners: RD_PARTNERS,
  },
  director: {
    name: 'Dr T Satyanarayana',
    designation: 'Associate Professor',
    department: 'Mechanical Engineering',
    roleLabel: 'R&D Dean',
    description:
      'Co-ordinating all R&D members, conducting R&D meetings, and compiling institutional research data. Leads the strategic direction of research activities across all departments at VIET.',
  },
  visionMission: {
    vision:
      'To establish VIET as a premier research-driven institution, fostering innovation, interdisciplinary collaboration, and globally recognized academic contributions in engineering and technology.',
    missionPoints: [
      'Promote a vibrant research culture among faculty and students',
      'Facilitate publications, patents, and funded research projects',
      'Strengthen industry-academia partnerships for applied research',
      'Support Ph.D. pursuits and interdisciplinary research initiatives',
    ],
  },
  roles: [
    { role: 'Chairman (Principal)', desc: 'Overall supervision and strategic guidance of all R&D activities.' },
    { role: 'R&D Dean', desc: 'Coordinates committee members, conducts meetings, and compiles institutional research data.' },
    { role: 'R&D Advisor', desc: 'Provides expert advisory support and mentorship for research initiatives.' },
    { role: 'Department Coordinators', desc: 'Monitor and facilitate R&D activities at the departmental level.' },
    { role: 'Faculty Members', desc: 'Lead research projects, mentor students, and publish in reputed journals.' },
    { role: 'Student Researchers', desc: 'Participate in funded projects, competitions, and publication activities.' },
  ],
  committee: rdCommittee,
  coordinators: departmentCoordinators,
  phdHolders,
  phdPursuing,
  policy: {
    title: 'Institutional R&D Policy Document',
    description:
      'Access the official Research & Development policy document outlining guidelines, procedures, and frameworks for research activities at VIET.',
    buttonText: 'View Policy Document',
    buttonUrl: '#',
  },
  journals: {
    title: 'Journal Publications',
    description:
      'Information about journal publications will be updated here. Check back for the latest research outputs from VIET faculty.',
  },
  patents: {
    title: 'Patent Portfolio',
    description:
      'Information about patents will be updated here. This section will showcase innovations protected through intellectual property.',
  },
  textbooks: {
    title: 'Faculty Authored Textbooks',
    description: 'Information about textbooks will be updated here.',
  },
  consultancy: {
    title: 'Consultancy Portfolio',
    description: 'Information about consultancy services will be updated here.',
  },
  facilities: {
    title: 'Research Infrastructure',
    description: 'Information about R&D facilities will be updated here.',
  },
  researchAreas: [
    'Artificial Intelligence & Machine Learning',
    'Renewable Energy & Power Systems',
    'VLSI Design & Embedded Systems',
    'Structural Engineering & Materials',
    'Wireless Communication & Signal Processing',
    'Manufacturing & Thermal Engineering',
    'Data Science & Cloud Computing',
    'Environmental & Water Resources',
    'Management & Entrepreneurship',
  ],
  gallery: [],
};

const toStringList = (value: unknown, fallback: string[]): string[] =>
  Array.isArray(value)
    ? value.map((item) => String(item ?? '').trim()).filter(Boolean)
    : fallback;

const toNumber = (value: unknown, fallback: number) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

export const normalizeRdContent = (value: unknown): RdContent => {
  const src = (value && typeof value === 'object' ? value : {}) as Partial<RdContent>;
  const about = (src.about || {}) as Partial<RdContent['about']>;
  const director = (src.director || {}) as Partial<RdDirector>;
  const visionMission = (src.visionMission || {}) as Partial<RdVisionMission>;
  const policy = (src.policy || {}) as Partial<RdPolicy>;
  const journals = (src.journals || {}) as Partial<RdSectionCopy>;
  const patents = (src.patents || {}) as Partial<RdSectionCopy>;
  const textbooks = (src.textbooks || {}) as Partial<RdSectionCopy>;
  const consultancy = (src.consultancy || {}) as Partial<RdSectionCopy>;
  const facilities = (src.facilities || {}) as Partial<RdSectionCopy>;
  const gallery = Array.isArray(src.gallery) ? src.gallery : [];

  return {
    ...DEFAULT_RD_CONTENT,
    hero: {
      ...DEFAULT_RD_CONTENT.hero,
      ...(src.hero || {}),
      stats: Array.isArray(src.hero?.stats)
        ? src.hero!.stats.map((item, idx) => ({
            val: String((item as Partial<RdHeroStat>)?.val ?? DEFAULT_RD_CONTENT.hero.stats[idx]?.val ?? ''),
            desc: String((item as Partial<RdHeroStat>)?.desc ?? DEFAULT_RD_CONTENT.hero.stats[idx]?.desc ?? ''),
          }))
        : DEFAULT_RD_CONTENT.hero.stats,
    },
    about: {
      ...DEFAULT_RD_CONTENT.about,
      ...about,
      objectives: Array.isArray(about.objectives)
        ? about.objectives.map((item, idx) => ({
            title: String(item?.title ?? DEFAULT_RD_CONTENT.about.objectives[idx]?.title ?? ''),
            text: String(item?.text ?? DEFAULT_RD_CONTENT.about.objectives[idx]?.text ?? ''),
          }))
        : DEFAULT_RD_CONTENT.about.objectives,
      partners: toStringList(about.partners, DEFAULT_RD_CONTENT.about.partners),
    },
    director: {
      ...DEFAULT_RD_CONTENT.director,
      ...director,
    },
    visionMission: {
      ...DEFAULT_RD_CONTENT.visionMission,
      ...visionMission,
      missionPoints: toStringList(visionMission.missionPoints, DEFAULT_RD_CONTENT.visionMission.missionPoints),
    },
    roles: Array.isArray(src.roles)
      ? src.roles.map((item, idx) => ({
          role: String(item?.role ?? DEFAULT_RD_CONTENT.roles[idx]?.role ?? ''),
          desc: String(item?.desc ?? DEFAULT_RD_CONTENT.roles[idx]?.desc ?? ''),
        }))
      : DEFAULT_RD_CONTENT.roles,
    committee: Array.isArray(src.committee)
      ? src.committee.map((item, idx) => ({
          sno: toNumber(item?.sno, idx + 1),
          name: String(item?.name ?? ''),
          designation: String(item?.designation ?? ''),
          role: String(item?.role ?? ''),
          responsibility: String(item?.responsibility ?? ''),
        }))
      : DEFAULT_RD_CONTENT.committee,
    coordinators: Array.isArray(src.coordinators)
      ? src.coordinators.map((item, idx) => ({
          sno: toNumber(item?.sno, idx + 1),
          name: String(item?.name ?? ''),
          position: String(item?.position ?? ''),
          department: String(item?.department ?? ''),
          photo: String(item?.photo ?? ''),
        }))
      : DEFAULT_RD_CONTENT.coordinators,
    phdHolders: Array.isArray(src.phdHolders)
      ? src.phdHolders.map((item, idx) => ({
          sno: toNumber(item?.sno, idx + 1),
          name: String(item?.name ?? ''),
          designation: String(item?.designation ?? ''),
          experience: toNumber(item?.experience, 0),
          department: String(item?.department ?? ''),
        }))
      : DEFAULT_RD_CONTENT.phdHolders,
    phdPursuing: Array.isArray(src.phdPursuing)
      ? src.phdPursuing.map((item, idx) => ({
          sno: toNumber(item?.sno, idx + 1),
          name: String(item?.name ?? ''),
          designation: String(item?.designation ?? ''),
          experience: toNumber(item?.experience, 0),
          department: String(item?.department ?? ''),
        }))
      : DEFAULT_RD_CONTENT.phdPursuing,
    policy: {
      ...DEFAULT_RD_CONTENT.policy,
      ...policy,
    },
    journals: { ...DEFAULT_RD_CONTENT.journals, ...journals },
    patents: { ...DEFAULT_RD_CONTENT.patents, ...patents },
    textbooks: { ...DEFAULT_RD_CONTENT.textbooks, ...textbooks },
    consultancy: { ...DEFAULT_RD_CONTENT.consultancy, ...consultancy },
    facilities: { ...DEFAULT_RD_CONTENT.facilities, ...facilities },
    researchAreas: toStringList(src.researchAreas, DEFAULT_RD_CONTENT.researchAreas),
    gallery: gallery.map((item: any) => ({
      image: String(item?.image ?? '').trim(),
      title: String(item?.title ?? '').trim(),
      department: String(item?.department ?? '').trim(),
    })),
  };
};
