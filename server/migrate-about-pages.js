import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const PAGES_FILE = path.join(DATA_DIR, 'pages.json');

// Read existing pages
async function readPages() {
  try {
    const data = await fs.readFile(PAGES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { pages: [] };
  }
}

// Write pages
async function writePages(pagesData) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(PAGES_FILE, JSON.stringify(pagesData, null, 2), 'utf8');
}

// Get next ID
function getNextId(pages) {
  if (pages.length === 0) return 1;
  return Math.max(...pages.map(p => p.id || 0)) + 1;
}

// About section pages to create
const aboutPages = [
  {
    slug: 'vision-mission',
    title: 'Vision & Mission',
    route: '/vision-mission',
    category: 'About',
    content: {
      hero: {
        title: 'Vision & Mission',
        description: 'Our guiding principles for excellence in education and innovation'
      },
      mainContent: `
        <h2 class="text-2xl font-bold mb-4">Vision</h2>
        <p class="mb-4">To be a premier institute of engineering and technology that nurtures innovation, excellence, and leadership in students, preparing them to meet global challenges and contribute meaningfully to society through quality education and research.</p>
        
        <h2 class="text-2xl font-bold mb-4">Mission</h2>
        <p class="mb-4">To provide world-class technical education through innovative teaching methods, state-of-the-art facilities, and industry partnerships. We are committed to developing competent professionals who can excel in their chosen fields and contribute to technological advancement and social development.</p>
        
        <h2 class="text-2xl font-bold mb-4">Core Values</h2>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>Excellence in Education</li>
          <li>Innovation and Research</li>
          <li>Integrity and Ethics</li>
          <li>Student-Centric Approach</li>
          <li>Industry Collaboration</li>
          <li>Social Responsibility</li>
        </ul>
      `
    }
  },
  {
    slug: 'chairman',
    title: 'Chairman',
    route: '/chairman',
    category: 'About',
    content: {
      hero: {
        title: 'Chairman',
        description: 'Leadership and vision for educational excellence'
      },
      profile: {
        name: 'Sri G. Satyanarayana Garu',
        qualification: 'M.Tech, MBA',
        designation: 'Chairman',
        badge: 'Leadership'
      },
      message: `
        <p class="mb-4">Welcome to Visakha Institute of Engineering & Technology (VIET). As the Chairman of Varaha Lakshmi Narasimha Swamy Educational Trust, I am proud to lead an institution that has been at the forefront of technical education since 2008.</p>
        <p class="mb-4">Our commitment is to provide quality education that prepares students for the challenges of the modern world. We believe in nurturing not just technical skills, but also values, ethics, and leadership qualities in our students.</p>
        <p class="mb-4">VIET has consistently strived for excellence in all aspects of education - from infrastructure to faculty, from curriculum to placements. We are committed to maintaining the highest standards and continuously improving to serve our students better.</p>
        <p class="mb-4">I invite you to be part of our journey towards creating a better future through education.</p>
      `
    }
  },
  {
    slug: 'dean-academics',
    title: 'Dean Academics',
    route: '/dean-academics',
    category: 'About',
    content: {
      hero: {
        title: 'Dean Academics',
        description: 'Excellence in academic planning and curriculum development'
      },
      profile: {
        name: 'Dr. D. Santha Rao',
        qualification: 'Ph.D. (AU.), M.E. (NIT Tiruchirapalli)',
        designation: 'Dean Academics',
        badge: 'Academic Excellence'
      },
      message: `
        <p class="mb-4">As the Dean of Academics, I am committed to ensuring that VIET provides the highest quality of education to our students. Our academic programs are designed to meet industry standards and prepare students for successful careers.</p>
        <p class="mb-4">We focus on outcome-based education (OBE) and continuously update our curriculum to align with technological advancements and industry requirements. Our faculty members are highly qualified and dedicated to student success.</p>
        <p class="mb-4">We emphasize practical learning through well-equipped laboratories, industry visits, and project-based learning. Our goal is to develop competent engineers and professionals who can contribute meaningfully to society.</p>
      `
    }
  },
  {
    slug: 'dean-innovation',
    title: 'Dean Innovation & Student Projects',
    route: '/dean-innovation',
    category: 'About',
    content: {
      hero: {
        title: 'Dean Innovation & Student Projects',
        description: 'Fostering innovation and research excellence'
      },
      profile: {
        name: 'Dr. [Name]',
        qualification: 'Ph.D.',
        designation: 'Dean Innovation & Student Projects',
        badge: 'Innovation'
      },
      message: `
        <p class="mb-4">Innovation and research are at the heart of technical education. As the Dean of Innovation & Student Projects, I am dedicated to fostering a culture of innovation, creativity, and research among our students and faculty.</p>
        <p class="mb-4">We encourage students to work on real-world projects, participate in research activities, and develop innovative solutions to societal problems. Our innovation cell provides support and resources for student projects and startups.</p>
        <p class="mb-4">We believe that hands-on experience through projects and research is essential for developing problem-solving skills and preparing students for successful careers in industry and research.</p>
      `
    }
  },
  {
    slug: 'organizational-chart',
    title: 'Organizational Chart',
    route: '/organizational-chart',
    category: 'About',
    content: {
      hero: {
        title: 'Organizational Chart',
        description: 'Structure and leadership of VIET'
      },
      mainContent: `
        <p class="mb-4">The organizational structure of VIET reflects our commitment to excellence in education and administration. Our leadership team works together to ensure the smooth functioning of all academic and administrative activities.</p>
        <h2 class="text-2xl font-bold mb-4">Leadership Hierarchy</h2>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>Chairman</li>
          <li>Principal</li>
          <li>Dean Academics</li>
          <li>Dean Innovation & Student Projects</li>
          <li>Department Heads</li>
          <li>Faculty Members</li>
        </ul>
        <h2 class="text-2xl font-bold mb-4">Administrative Structure</h2>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>Governing Body</li>
          <li>Academic Council</li>
          <li>Board of Studies</li>
          <li>IQAC (Internal Quality Assurance Cell)</li>
          <li>Various Committees</li>
        </ul>
      `
    }
  },
  {
    slug: 'governing-body',
    title: 'Governing Body',
    route: '/governing-body',
    category: 'About',
    content: {
      hero: {
        title: 'Governing Body',
        description: 'Leadership and governance of VIET'
      },
      mainContent: `
        <p class="mb-4">The Governing Body of VIET is responsible for the overall governance and strategic direction of the institution. It ensures that the institution maintains high standards of education and operates in accordance with regulatory requirements.</p>
        <h2 class="text-2xl font-bold mb-4">Composition</h2>
        <p class="mb-4">The Governing Body consists of eminent personalities from academia, industry, and administration who bring their expertise and experience to guide the institution.</p>
        <h2 class="text-2xl font-bold mb-4">Responsibilities</h2>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>Strategic planning and policy formulation</li>
          <li>Financial oversight and resource management</li>
          <li>Quality assurance and accreditation</li>
          <li>Academic and administrative governance</li>
          <li>Compliance with regulatory requirements</li>
        </ul>
      `
    }
  },
  {
    slug: 'grievance-redressal',
    title: 'Grievance Redressal',
    route: '/grievance-redressal',
    category: 'About',
    content: {
      hero: {
        title: 'Grievance Redressal',
        description: 'Ensuring fair and transparent resolution of grievances'
      },
      mainContent: `
        <p class="mb-4">VIET is committed to providing a fair and transparent mechanism for addressing grievances of students, faculty, and staff. We believe in resolving issues promptly and fairly.</p>
        <h2 class="text-2xl font-bold mb-4">Grievance Redressal Committee</h2>
        <p class="mb-4">The Grievance Redressal Committee is responsible for receiving, investigating, and resolving grievances in a timely and fair manner.</p>
        <h2 class="text-2xl font-bold mb-4">How to File a Grievance</h2>
        <ol class="list-decimal list-inside space-y-2 mb-4">
          <li>Submit a written complaint to the Grievance Redressal Committee</li>
          <li>Include all relevant details and supporting documents</li>
          <li>The committee will acknowledge receipt within 3 working days</li>
          <li>Investigation will be conducted and resolution provided within 15 working days</li>
        </ol>
        <h2 class="text-2xl font-bold mb-4">Contact</h2>
        <p class="mb-4">For any grievances, please contact the Grievance Redressal Committee at the college office or through the online grievance form.</p>
      `
    }
  },
  {
    slug: 'committees',
    title: 'Committees',
    route: '/committees',
    category: 'About',
    content: {
      hero: {
        title: 'Committees',
        description: 'Various committees ensuring smooth functioning of the institution'
      },
      mainContent: `
        <p class="mb-4">VIET has various committees that play a crucial role in the smooth functioning of the institution. These committees are responsible for different aspects of academic and administrative activities.</p>
        <h2 class="text-2xl font-bold mb-4">Key Committees</h2>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li>Academic Council</li>
          <li>Board of Studies</li>
          <li>IQAC (Internal Quality Assurance Cell)</li>
          <li>Grievance Redressal Committee</li>
          <li>Anti-Ragging Committee</li>
          <li>Disciplinary Committee</li>
          <li>Library Committee</li>
          <li>Sports Committee</li>
          <li>Cultural Committee</li>
          <li>Placement Committee</li>
          <li>Research & Development Committee</li>
        </ul>
        <h2 class="text-2xl font-bold mb-4">Functions</h2>
        <p class="mb-4">Each committee has specific functions and responsibilities as defined in the institution's policies. The committees meet regularly to discuss and make decisions on matters within their purview.</p>
      `
    }
  },
  {
    slug: 'accreditations',
    title: 'Accreditations',
    route: '/accreditations',
    category: 'About',
    content: {
      hero: {
        title: 'Accreditations & Recognitions',
        description: 'Quality assurance and institutional recognition'
      },
      mainContent: `
        <p class="mb-4">VIET is proud to be recognized and accredited by various national and international bodies for our commitment to quality education.</p>
        <h2 class="text-2xl font-bold mb-4">Accreditations</h2>
        <ul class="list-disc list-inside space-y-2 mb-4">
          <li><strong>NAAC:</strong> Accredited with 'A' Grade by the National Assessment and Accreditation Council</li>
          <li><strong>UGC:</strong> Recognized by the University Grants Commission</li>
          <li><strong>AICTE:</strong> Approved by the All India Council for Technical Education</li>
          <li><strong>ISO:</strong> Certified with ISO 9001:2015</li>
          <li><strong>JNTUGV:</strong> Affiliated to Jawaharlal Nehru Technological University, Kakinada</li>
        </ul>
        <h2 class="text-2xl font-bold mb-4">Recognition</h2>
        <p class="mb-4">Our accreditations and recognitions reflect our commitment to maintaining high standards of education, infrastructure, and student support services. We continuously work towards improving our quality and meeting the expectations of all stakeholders.</p>
      `
    }
  }
];

async function migrateAboutPages() {
  try {
    console.log('Starting migration of About section pages...');
    
    const pagesData = await readPages();
    const existingSlugs = new Set(pagesData.pages.map(p => p.slug));
    let nextId = getNextId(pagesData.pages);
    let created = 0;
    let skipped = 0;

    for (const page of aboutPages) {
      if (existingSlugs.has(page.slug)) {
        console.log(`Skipping ${page.slug} - already exists`);
        skipped++;
        continue;
      }

      const newPage = {
        id: nextId++,
        ...page,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      pagesData.pages.push(newPage);
      created++;
      console.log(`Created page: ${page.title} (${page.slug})`);
    }

    await writePages(pagesData);
    
    console.log(`\nMigration completed!`);
    console.log(`Created: ${created} pages`);
    console.log(`Skipped: ${skipped} pages (already exist)`);
    console.log(`Total pages: ${pagesData.pages.length}`);
  } catch (error) {
    console.error('Error migrating pages:', error);
    process.exit(1);
  }
}

migrateAboutPages();

