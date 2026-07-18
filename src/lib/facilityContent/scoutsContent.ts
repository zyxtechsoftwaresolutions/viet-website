import { asString, asStringArray, normalizeHero, type FacilityHero } from './helpers';
import { normalizeLeaderProfile, type FacilityLeaderProfile } from './leaderProfile';

export type ScoutsEvent = { image: string; title: string; caption: string };

export type ScoutsContent = {
  hero: FacilityHero;
  about: { label: string; title: string; paragraphs: string[] };
  eventsSection: { label: string; title: string; description: string };
  events: ScoutsEvent[];
  activities: string[];
  leader: FacilityLeaderProfile;
};

export const DEFAULT_SCOUTS_CONTENT: ScoutsContent = {
  hero: {
    badge: 'Facilities',
    title: 'Scouts & Guides',
    description:
      'Building character, confidence, leadership, and a spirit of service through scouting activities at VIET.',
    heroImage: '',
    video: '',
  },
  about: {
    label: 'About',
    title: 'Scouting at VIET',
    paragraphs: [
      'The Scouts and Guides unit at VIET encourages students to become responsible citizens through discipline, teamwork, outdoor learning, and community service.',
      'Students participate in camps, awareness drives, service programmes, leadership activities, and skill-building events that nurture confidence and social responsibility.',
    ],
  },
  eventsSection: {
    label: 'Events & activities',
    title: 'Scouts in Action',
    description: 'Highlights from camps, service programmes, celebrations, and leadership activities.',
  },
  events: [
    { image: '/GALLERY/section2.jpg', title: 'Community Service', caption: 'Serving society together' },
    { image: '/GALLERY/section3.jpg', title: 'Scouting Camp', caption: 'Learning through outdoor activities' },
    { image: '/GALLERY/bg1.jpg', title: 'Leadership Activities', caption: 'Building confidence and teamwork' },
  ],
  activities: [
    'Community service and awareness drives',
    'Scouting camps and outdoor activities',
    'First-aid and emergency preparedness',
    'Leadership and team-building programmes',
    'Environmental conservation initiatives',
    'National and institutional celebrations',
  ],
  leader: {
    label: 'Leadership',
    title: 'Scouts Leader',
    name: 'Scouts Coordinator',
    designation: 'Scouts & Guides Unit Leader',
    qualification: '',
    intro: 'Guiding students through service, discipline, and leadership.',
    image: '',
    message:
      'Our Scouts and Guides unit provides students with opportunities to develop practical skills, a service mindset, and the confidence to lead with responsibility.',
    phone: '',
    email: 'admissions@viet.edu.in',
  },
};

function normalizeEvents(value: unknown, fallback: ScoutsEvent[]): ScoutsEvent[] {
  if (!Array.isArray(value) || value.length === 0) return fallback;
  return value.map((item: any, index) => ({
    image: asString(item?.image, fallback[index]?.image ?? ''),
    title: asString(item?.title, fallback[index]?.title ?? ''),
    caption: asString(item?.caption, fallback[index]?.caption ?? ''),
  }));
}

export function normalizeScoutsContent(raw: unknown): ScoutsContent {
  const d = DEFAULT_SCOUTS_CONTENT;
  const c = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const about = c.about && typeof c.about === 'object' ? (c.about as Record<string, unknown>) : {};
  const eventsSection =
    c.eventsSection && typeof c.eventsSection === 'object'
      ? (c.eventsSection as Record<string, unknown>)
      : {};

  return {
    hero: normalizeHero(c.hero, d.hero),
    about: {
      label: asString(about.label, d.about.label),
      title: asString(about.title, d.about.title),
      paragraphs: asStringArray(about.paragraphs, d.about.paragraphs),
    },
    eventsSection: {
      label: asString(eventsSection.label, d.eventsSection.label),
      title: asString(eventsSection.title, d.eventsSection.title),
      description: asString(eventsSection.description, d.eventsSection.description),
    },
    events: normalizeEvents(c.events, d.events),
    activities: asStringArray(c.activities, d.activities),
    leader: normalizeLeaderProfile(c.leader, d.leader),
  };
}
