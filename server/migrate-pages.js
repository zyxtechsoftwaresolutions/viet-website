import fs from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, 'data');

// Extract content from static pages and create initial page data
const pagesData = {
  pages: [
    {
      id: 1,
      slug: 'about',
      title: 'About Us',
      route: '/about',
      category: 'About',
      content: {
        hero: {
          title: 'About VIET College',
          description: 'Visakha Institute of Engineering & Technology - Excellence in Technical Education Since 2008'
        },
        mainContent: `<p>Visakha Institute of Engineering & Technology (VIET) was founded by <strong>"VARAHA LAKSHMI NARASHIMA SWAMY EDUCATIONAL TRUST"</strong> at Narava in 2008. It is located in VISAKHAPATNAM.</p>
<p>VIET is affiliated to Jawaharlal Nehru Technological University, Kakinada, Andhra Pradesh. The Institute follows the curriculum as prescribed by the Jawaharlal Nehru Technological University, Kakinada. The academic calendar provided by the University is followed. The academic and other activities are planned for the semester and a calendar of events is prepared by the institute also. At the beginning of the semester the faculty members prepare the lesson plans for their respective subjects. As per the scheduled dates of academic calendar, internal/ end semester examinations for students are conducted in each semester. For the weaker category of students, remedial classes are conducted for different subjects and evaluation of outcome. For the laboratory classes, in addition to the lesson plans, lab manuals are prepared for each subject by the faculty and distributed to the students. Industrial visits are arranged to bridge the gap between theoretical knowledge and Industrial applications.</p>
<p>Andhra Pradesh is well known for automotive, power generation industries and Software development centers. All the departments arrange visits to these industries so that the students are exposed to the real world of manufacturing, energy production and latest trends in software and communication technologies. Also, many of the final year projects are supported by the industries. Special lectures are conducted by inviting distinguished faculty engineers from reputed Universities/Institutes and Industries. The institution has also developed various plans for effective monitoring of the curriculum. Details of these processes are as follows: Each department has defined its specific Vision and Mission in tune with the institution's Vision and Mission.</p>
<p>Program Education Objectives (PEOs) are developed in consultation with management, faculty members, students, technical staff, stakeholders(alumni, parents, employers etc). These are updated from time to time on the basis of feedback received from various bodies. Each program of the department is elaborated in terms of Program Outcomes which are aligned with graduate attributes. Furthermore Course Outcomes (COs) for every subject taught is formed by individual faculty members.</p>
<p>The institution has been consistently recognized for its commitment to quality education and student success. Our campus provides a conducive learning environment with modern infrastructure, well-equipped laboratories, and state-of-the-art facilities that support both academic and extracurricular activities.</p>
<p>VIET College has established itself as a premier institution in the region, attracting students from across Andhra Pradesh and neighboring states. Our alumni have made significant contributions in various fields, working with leading multinational corporations, government organizations, and entrepreneurial ventures.</p>
<p>The college continues to evolve and adapt to the changing needs of the industry and society. We regularly update our curriculum, enhance our facilities, and strengthen our industry partnerships to ensure that our students receive education that is both relevant and forward-looking. Our commitment to excellence has earned us recognition from various accrediting bodies and industry associations.</p>`,
        achievements: [
          { icon: 'Award', title: 'NAAC A Grade', description: 'Accredited by National Assessment and Accreditation Council' },
          { icon: 'Users', title: '1500+ Students', description: 'Currently enrolled across various programs' },
          { icon: 'BookOpen', title: '15+ Programs', description: 'Diploma, B.Tech, M.Tech, MBA, MCA, BBA, BCA' },
          { icon: 'GraduationCap', title: 'Since 2008', description: '15+ years of excellence in technical education' }
        ],
        vision: 'To be a premier institute of engineering and technology that nurtures innovation, excellence, and leadership in students, preparing them to meet global challenges and contribute meaningfully to society through quality education and research.',
        mission: 'To provide world-class technical education through innovative teaching methods, state-of-the-art facilities, and industry partnerships. We are committed to developing competent professionals who can excel in their chosen fields and contribute to technological advancement and social development.',
        quote: {
          text: '"Take up one idea, make that one idea your life. Think of it, dream of it, live on that idea. Let the brain, muscles, nerves, every part of your body be full of that idea, and just leave every other idea alone. This is the way to success."',
          author: 'Swami Vivekananda'
        },
        institutionalExcellence: 'The institution maintains high standards of academic excellence through continuous monitoring and evaluation. Our faculty members are highly qualified and experienced professionals who are committed to providing quality education and mentoring students for their overall development. We emphasize practical learning through well-equipped laboratories, modern infrastructure, and industry partnerships. Our students are encouraged to participate in research activities, technical competitions, and community service programs to develop their skills and contribute to society. The college has established strong relationships with leading industries and organizations, providing students with excellent placement opportunities and real-world exposure through internships and industrial training programs.'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      slug: 'principal',
      title: 'Principal',
      route: '/principal',
      category: 'About',
      content: {
        hero: {
          title: 'Principal',
          description: 'Leadership in academic excellence and institutional development'
        },
        profile: {
          name: 'Prof. G Vidya Pradeep Varma',
          qualification: 'M.Tech, Ph.D',
          designation: 'Principal',
          badge: 'Academic Leadership'
        },
        message: `<p>VIET is most admired institution for pursuing technical education. The institution aims to provide support to faculty and students to attain the knowledge as well as the skills that they aspire for. The institution also aims at a good governance framework towards improving quality of technical education. VIET enhances existing capacities of the institutions to become dynamic, demand-driven, quality conscious, efficient and forward looking. VIET also aims at aligning with rapid economic and technological developments in new areas both at national and international levels.</p>
<p>Our Institute is located on sprawling area 15 acres campus in the West side of city. Nearby several industries and Visakhapatnam Export Processing Zone (VEPZ), The College has excellent infrastructure, imposing buildings with spacious class rooms, and Laboratories with state of the art technology.</p>
<p>VIET is established in the year 2008. VIET has 1400+ students in diploma in Engineering, 2900+ students in undergraduate and 600+ students in PG. VIET emphasizes on enhancement of Postgraduate education and Research apart from Outcome Based Education (OBE) for undergraduate programs. The mandate is also good governance at all levels focusing on the improvement of the quality of learning, teaching and research outcomes. Good governance focuses on effective leadership, planning, ethics, responsibilities and accountabilities, both within and outside institution. VIET enhances existing capacities of the institutions to become dynamic, demand-driven, quality conscious, efficient and forward looking.</p>
<p>The strategic development plan formulates clear vision, mission, quality policy, core values, institutional strategic goals, strategies, sub strategies and goals. The key performance indicator of SDP is in its successful implementation and evaluation aspects. I have utmost confidence in the institution's human resources and management capability in true implementation. Humbly we say that our college is equipped with a very good library, state of art class – labs and class rooms.</p>
<p>In addition to this our college gives a lot of importance to the physical well-being; hence we take up yoga classes apart from physical activities being carried out by a young physical director. Our motto is to make every student of our college a good citizen with patriotic zeal and build a strong nation with enthusiasm and fervor.</p>
<p><strong>Looking at a future with excellence!</strong></p>`,
        keyPoints: [
          {
            icon: 'Target',
            title: 'Academic Excellence',
            description: 'Ensuring highest standards of academic delivery and student learning outcomes',
            color: 'from-emerald-500 to-teal-600',
            bgColor: 'from-emerald-50 to-teal-50'
          },
          {
            icon: 'BookOpen',
            title: 'Curriculum Development',
            description: 'Continuous improvement of curriculum to meet industry standards and technological advancements',
            color: 'from-blue-500 to-indigo-600',
            bgColor: 'from-blue-50 to-indigo-50'
          },
          {
            icon: 'Users',
            title: 'Faculty Development',
            description: 'Nurturing and developing faculty members to deliver world-class education',
            color: 'from-purple-500 to-violet-600',
            bgColor: 'from-purple-50 to-violet-50'
          },
          {
            icon: 'Building2',
            title: 'Infrastructure Management',
            description: 'Overseeing modern infrastructure and facilities for optimal learning environment',
            color: 'from-orange-500 to-red-600',
            bgColor: 'from-orange-50 to-red-50'
          }
        ]
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 3,
      slug: 'placements',
      title: 'Placements',
      route: '/placements',
      category: 'Placements',
      content: {
        hero: {
          title: 'Placements at VIET',
          description: 'Connecting talent with opportunity'
        },
        mainContent: `<p>VIET has a dedicated placement cell that works tirelessly to ensure our students get the best placement opportunities. We have strong relationships with leading companies across various industries.</p>
<p>Our placement cell organizes campus recruitment drives, industry interactions, and skill development programs to prepare students for successful careers.</p>`,
        statistics: [
          { icon: 'TrendingUp', label: 'Placement Rate', value: '85%+' },
          { icon: 'Building2', label: 'Recruiting Companies', value: '100+' },
          { icon: 'Award', label: 'Highest Package', value: '₹12 LPA' },
          { icon: 'DollarSign', label: 'Average Package', value: '₹4.5 LPA' }
        ],
        companies: [
          { name: 'Smart Brains', logo: '/RECRUITERS/smart-brains-img.png' },
          { name: 'HCL', logo: '/RECRUITERS/hcl-img.png' },
          { name: 'Byju\'s', logo: '/RECRUITERS/byjus-img.png' },
          { name: 'Novel Paints', logo: '/RECRUITERS/novel-img.png' },
          { name: 'Tech Mahindra', logo: '/RECRUITERS/Tech_Mahindra.png' },
          { name: 'TCS', logo: '/RECRUITERS/tcs.png' }
        ]
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
};

async function migratePages() {
  try {
    const filePath = join(DATA_DIR, 'pages.json');
    
    // Check if pages.json already exists
    let existingData = { pages: [] };
    try {
      const existingContent = await fs.readFile(filePath, 'utf-8');
      existingData = JSON.parse(existingContent);
    } catch (error) {
      // File doesn't exist, create new one
      console.log('Creating new pages.json file...');
    }

    // Merge existing pages with new ones (avoid duplicates by slug)
    const existingSlugs = new Set(existingData.pages.map(p => p.slug));
    const newPages = pagesData.pages.filter(p => !existingSlugs.has(p.slug));
    
    if (newPages.length > 0) {
      existingData.pages = [...existingData.pages, ...newPages];
      await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));
      console.log(`✓ Migrated ${newPages.length} pages to pages.json`);
      console.log('Pages migrated:', newPages.map(p => p.slug).join(', '));
    } else {
      console.log('✓ All pages already exist in pages.json');
    }
  } catch (error) {
    console.error('Error migrating pages:', error);
    process.exit(1);
  }
}

migratePages();


