/**
 * Canonical site pages — seeded on server start if missing from the database.
 * Keeps admin editors and public routes in sync (no "row does not exist" errors).
 */

import { FACILITY_SEED_CONTENT, mergeDedicatedFacilityContent } from './facilitySeedContent.js';

export const SITE_PAGE_SEEDS = [
  // —— About & governance ——
  {
    slug: 'about',
    title: 'About Us',
    route: '/about',
    category: 'About',
    content: {
      hero: { title: 'About VIET', description: 'Visakha Institute of Engineering & Technology' },
      mainContent: '<p>Welcome to VIET. Edit this content in Admin → About Us.</p>',
    },
  },
  {
    slug: 'vision-mission',
    title: 'Vision & Mission',
    route: '/vision-mission',
    category: 'About',
    content: {
      hero: { title: 'Vision & Mission', description: 'Our guiding principles for excellence in education.' },
      mainContent: '<p>Edit vision and mission content here via Admin → All Site Pages.</p>',
    },
  },
  {
    slug: 'organizational-chart',
    title: 'Organizational Chart',
    route: '/organizational-chart',
    category: 'About',
    content: {
      hero: { title: 'Organizational Chart', description: 'Leadership structure at VIET.' },
      mainContent: '<p>Add organizational chart details or embed an image via the admin panel.</p>',
    },
  },
  {
    slug: 'governing-body',
    title: 'Governing Body',
    route: '/governing-body',
    category: 'About',
    content: {
      hero: { title: 'Governing Body', description: 'Members of the VIET governing body.' },
      mainContent: '<p>List governing body members here.</p>',
    },
  },
  {
    slug: 'grievance-redressal',
    title: 'Grievance Redressal',
    route: '/grievance-redressal',
    category: 'About',
    content: {
      hero: { title: 'Grievance Redressal', description: 'How to submit and resolve grievances.' },
      mainContent: '<p>Add grievance redressal policy and contact details.</p>',
    },
  },
  {
    slug: 'committees',
    title: 'Committees',
    route: '/committees',
    category: 'About',
    content: {
      hero: { title: 'Committees', description: 'Institutional committees at VIET.' },
      mainContent: '<p>List committee members and responsibilities.</p>',
    },
  },
  {
    slug: 'hr',
    title: 'Human Resources',
    route: '/hr',
    category: 'About',
    content: {
      hero: { title: 'Human Resources', description: 'HR at VIET' },
      profile: { name: 'HR', designation: 'Human Resources', qualification: '' },
      message: '<p>Edit the HR message in Admin → Authorities.</p>',
    },
  },
  {
    slug: 'chairman',
    title: 'Chairman',
    route: '/chairman',
    category: 'About',
    content: {
      hero: { title: 'Chairman', description: '' },
      profile: { name: 'Chairman', designation: 'Chairman' },
      message: '<p>Edit in Admin → Authorities.</p>',
    },
  },
  {
    slug: 'principal',
    title: 'Principal',
    route: '/principal',
    category: 'About',
    content: {
      hero: { title: 'Principal', description: '' },
      profile: { name: 'Principal', designation: 'Principal' },
      message: '<p>Edit in Admin → Authorities.</p>',
    },
  },
  {
    slug: 'diploma-principal',
    title: 'Diploma Principal',
    route: '/diploma-principal',
    category: 'About',
    content: {
      hero: { title: 'Diploma Principal', description: '' },
      profile: { name: 'Diploma Principal', designation: 'Diploma Principal' },
      message: '<p>Edit in Admin → Authorities.</p>',
    },
  },
  {
    slug: 'dean-academics',
    title: 'Dean Academics',
    route: '/dean-academics',
    category: 'About',
    content: {
      hero: { title: 'Dean Academics', description: '' },
      profile: { name: 'Dean Academics', designation: 'Dean Academics' },
      message: '<p>Edit in Admin → Authorities.</p>',
    },
  },
  {
    slug: 'dean-innovation',
    title: 'Dean Innovation',
    route: '/dean-innovation',
    category: 'About',
    content: {
      hero: { title: 'Dean Innovation', description: '' },
      profile: { name: 'Dean Innovation', designation: 'Dean Innovation' },
      message: '<p>Edit in Admin → Authorities.</p>',
    },
  },
  // —— Placements & campus ——
  {
    slug: 'placements',
    title: 'Placements',
    route: '/placements',
    category: 'Placements',
    content: {
      hero: { title: 'Placements', description: 'Placement excellence at VIET.' },
      mainContent: '<p>Edit placement overview. Recruiter logos: Admin → Recruiters.</p>',
    },
  },
  {
    slug: 'placements-cell',
    title: 'Placements Cell',
    route: '/placements-cell',
    category: 'Placements',
    content: {
      hero: { title: 'Placements Cell', description: 'Training & Placement Cell at VIET.' },
      mainContent: '<p>Edit placements cell content here.</p>',
    },
  },
  {
    slug: 'research-development',
    title: 'Research & Development',
    route: '/research-development',
    category: 'Academics',
    content: {
      hero: { title: 'Research & Development', description: 'R&D at VIET.' },
      mainContent: '<p>Edit R&D content here.</p>',
    },
  },
  {
    slug: 'campus-life',
    title: 'Campus Life',
    route: '/campus-life',
    category: 'Campus',
    content: {
      hero: {
        badge: 'VIET Campus',
        title: 'Campus Life',
        description: 'Where innovation meets inspiration at Visakha Institute of Engineering and Technology',
      },
      mainContent: '<p>Edit campus life photos and content in Admin → Campus Life.</p>',
      // Full highlight photos are hydrated from admin defaults on first edit/save.
      // Seed keeps light payload; public page falls back to built-in defaults until saved.
    },
  },
  {
    slug: 'ug-pg-examinations',
    title: 'UG & PG Examinations',
    route: '/examinations/ug-pg',
    category: 'Examinations',
    content: {
      hero: { title: 'UG & PG Examinations', description: 'Examination information for UG and PG programmes.' },
      mainContent: '<p>Edit examination schedules and notices here.</p>',
    },
  },
  {
    slug: 'diploma-sbtet',
    title: 'Diploma (SBTET)',
    route: '/examinations/diploma',
    category: 'Examinations',
    content: {
      hero: { title: 'Diploma Examinations (SBTET)', description: 'SBTET examination information.' },
      mainContent: '<p>Edit diploma examination content here.</p>',
    },
  },
  // —— Facilities ——
  {
    slug: 'transport',
    title: 'Transport',
    route: '/facilities/transport',
    category: 'Facilities',
    content: {
      hero: {
        badge: 'Facilities',
        title: 'Campus Transport',
        description:
          'VIET provides safe and reliable bus transport for students and staff from various points in and around Visakhapatnam to our campus at Narava.',
      },
      mainContent: `<p>Our College provides safe and comfortable Transport facility with own new Buses from every corner of the city.</p>
<p>Transportation is available for conducting industrial visits, placement drives, and campus activities.</p>`,
      stats: [
        { value: '24+', label: 'Buses' },
        { value: '4+', label: 'Main Routes' },
        { value: 'Visakhapatnam', label: 'Coverage' },
        { value: 'Narava', label: 'Campus' },
      ],
      features: [
        { title: 'Safe & Punctual', description: 'Regular schedules and trained drivers.', icon: 'shield', accent: 'indigo' },
        { title: 'Wide Coverage', description: 'Buses cover major areas in Visakhapatnam.', icon: 'map', accent: 'blue' },
        { title: 'Affordable', description: 'Transport fee is part of the fee structure.', icon: 'payment', accent: 'emerald' },
        { title: 'Comfortable', description: 'Well-maintained buses with adequate seating.', icon: 'bus', accent: 'slate' },
      ],
      tables: {
        'Contact Numbers for Transport': {
          headers: ['Name', 'Contact Number'],
          rows: [['Transport Office', 'Contact via admin']],
        },
      },
    },
  },
  {
    slug: 'library',
    title: 'Library',
    route: '/facilities/library',
    category: 'Facilities',
    content: {
      hero: {
        badge: 'Facilities',
        title: 'Our Library',
        description: 'A place of knowledge, inspiration, and academic excellence.',
      },
      mainContent: '<p>The VIET library offers books, journals, digital resources, and a quiet study environment for students and faculty.</p>',
      features: [
        { title: 'Vast Collection', description: 'Books, journals, and reference materials.', icon: 'star', accent: 'indigo' },
        { title: 'Reading Hall', description: 'Spacious seating for students.', icon: 'star', accent: 'blue' },
        { title: 'Free Wi-Fi', description: 'Internet access for research.', icon: 'star', accent: 'emerald' },
      ],
    },
  },
  {
    slug: 'laboratory',
    title: 'Laboratory',
    route: '/facilities/laboratory',
    category: 'Facilities',
    content: {
      hero: {
        badge: 'Facilities',
        title: 'Our Laboratories',
        description: 'Where theory meets practice — advanced engineering labs.',
      },
      mainContent: '<p>Department-wise laboratories equipped for practical learning and research.</p>',
    },
  },
  {
    slug: 'hostel',
    title: 'Hostel',
    route: '/facilities/hostel',
    category: 'Facilities',
    content: {
      hero: {
        badge: 'Facilities',
        title: 'Our Hostel',
        description: 'A safe, comfortable, and vibrant living environment for students. Home away from home.',
      },
      mainContent: '<p>Separate hostels for men and women with mess, security, and study facilities.</p>',
    },
  },
  {
    slug: 'nss',
    title: 'NSS',
    route: '/facilities/nss',
    category: 'Facilities',
    content: {
      hero: {
        badge: 'Empowering through service',
        title: 'National Service Scheme',
        description:
          "Not Me, But You — Building tomorrow's leaders through community service and social responsibility.",
      },
      mainContent: '<p>NSS unit activities, camps, and community outreach at VIET.</p>',
    },
  },
  {
    slug: 'sports',
    title: 'Sports',
    route: '/facilities/sports',
    category: 'Facilities',
    content: {
      hero: {
        badge: 'Facilities',
        title: 'Sports & Games',
        description:
          'A dedicated indoor sports room, expert PT staff, and a wide range of indoor and outdoor games for fitness and fun.',
      },
      mainContent: '<p>Indoor and outdoor sports facilities for students.</p>',
    },
  },
  {
    slug: 'cafeteria',
    title: 'Cafeteria',
    route: '/facilities/cafeteria',
    category: 'Facilities',
    content: {
      hero: {
        badge: 'Facilities',
        title: 'Cafeteria & Canteen',
        description:
          'A hygienic, spacious cafeteria offering a variety of meals, snacks, and beverages at affordable prices for students and staff.',
      },
      mainContent: '<p>Campus cafeteria serving meals and snacks for students and staff.</p>',
    },
  },
  {
    slug: 'center-of-excellence',
    title: 'Center of Excellence',
    route: '/facilities/center-of-excellence',
    category: 'Facilities',
    content: {
      hero: { badge: 'Facilities', title: 'Center of Excellence', description: 'EISC, COE and innovation labs.' },
      mainContent: '<p>Centers of excellence driving innovation, research, and industry collaboration at VIET.</p>',
    },
  },
  {
    slug: 'wifi',
    title: 'WIFI',
    route: '/facilities/wifi',
    category: 'Facilities',
    content: {
      hero: { badge: 'Facilities', title: 'WIFI', description: 'High-speed internet connectivity across campus.' },
      mainContent: '<p>High-speed Wi-Fi connectivity available for students and faculty throughout the campus.</p>',
    },
  },
  {
    slug: 'medical-facility',
    title: 'Medical Facility',
    route: '/facilities/medical-facility',
    category: 'Facilities',
    content: {
      hero: { badge: 'Facilities', title: 'Medical Facility', description: 'Healthcare services on campus.' },
      mainContent: '<p>On-campus medical facility providing healthcare support for students and staff.</p>',
    },
  },
  {
    slug: 'ro-water-plant',
    title: 'RO Water Plant',
    route: '/facilities/ro-water-plant',
    category: 'Facilities',
    content: {
      hero: { badge: 'Facilities', title: 'RO Water Plant', description: 'Safe drinking water facility.' },
      mainContent: '<p>RO water plant ensuring safe and clean drinking water across the campus.</p>',
    },
  },
  {
    slug: 'green-initiatives',
    title: 'Green Initiatives',
    route: '/facilities/green-initiatives',
    category: 'Facilities',
    content: {
      hero: { badge: 'Facilities', title: 'Green Initiatives', description: 'Eco-friendly campus initiatives.' },
      mainContent: '<p>VIET promotes sustainability through green campus initiatives and environmental awareness.</p>',
    },
  },
  {
    slug: 'solar-power-plant',
    title: 'Solar Power Plant',
    route: '/facilities/solar-power-plant',
    category: 'Facilities',
    content: {
      hero: { badge: 'Facilities', title: 'Solar Power Plant', description: 'Renewable energy on campus.' },
      mainContent: '<p>Solar power plant contributing to renewable energy and sustainable campus operations.</p>',
    },
  },
];

const DEPRECATED_PAGE_SLUGS = ['digital-library'];

function mergeSeedContent(existing = {}, seed = {}) {
  const out = { ...seed, ...existing };
  out.hero = { ...(seed.hero || {}), ...(existing.hero || {}) };
  for (const key of ['stats', 'features', 'gallery']) {
    const ex = existing[key];
    const sd = seed[key];
    if ((!Array.isArray(ex) || ex.length === 0) && Array.isArray(sd) && sd.length > 0) {
      out[key] = sd;
    }
  }
  if (!existing.mainContent && seed.mainContent) {
    out.mainContent = seed.mainContent;
  }
  if (!existing.mapEmbed && seed.mapEmbed) {
    out.mapEmbed = seed.mapEmbed;
  }
  return out;
}

export async function seedMissingSitePages(db) {
  for (const slug of DEPRECATED_PAGE_SLUGS) {
    try {
      const existing = await db.getPageBySlug(slug);
      if (existing?.id) {
        await db.deletePage(existing.id);
        console.log(`[pages] Removed deprecated page: ${slug}`);
      }
    } catch (err) {
      console.warn(`[pages] Could not remove deprecated ${slug}:`, err?.message || err);
    }
  }

  let created = 0;
  let skipped = 0;
  for (const seed of SITE_PAGE_SEEDS) {
    try {
      const existing = await db.getPageBySlug(seed.slug);
      const dedicatedSeed = FACILITY_SEED_CONTENT[seed.slug];
      const seedContent = dedicatedSeed || seed.content || {};

      if (existing) {
        const merged = dedicatedSeed
          ? mergeDedicatedFacilityContent(existing.content || {}, dedicatedSeed)
          : mergeSeedContent(existing.content || {}, seed.content || {});
        const changed = JSON.stringify(merged) !== JSON.stringify(existing.content || {});
        if (changed) {
          await db.updatePage(existing.id, { content: merged });
          console.log(`[pages] Merged seed content into: ${seed.slug}`);
        }
        skipped += 1;
        continue;
      }
      await db.createPage({
        slug: seed.slug,
        title: seed.title,
        route: seed.route,
        category: seed.category,
        content: seedContent,
      });
      created += 1;
      console.log(`[pages] Seeded: ${seed.slug}`);
    } catch (err) {
      console.warn(`[pages] Could not seed ${seed.slug}:`, err?.message || err);
    }
  }
  return { created, skipped, total: SITE_PAGE_SEEDS.length };
}
