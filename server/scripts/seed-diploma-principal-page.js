/**
 * Add diploma-principal page to database (Supabase or pages.json) if missing.
 * Run: node server/scripts/seed-diploma-principal-page.js
 */
import { getPageBySlug, createPage } from '../lib/db.js';

const diplomaPrincipalPage = {
  slug: 'diploma-principal',
  title: 'Diploma Principal',
  route: '/diploma-principal',
  category: 'About',
  content: {
    hero: {
      title: 'Diploma Principal',
      description: 'Leadership in diploma education and skill-based technical training',
      buttonText: 'Read message',
    },
    profile: {
      name: 'Mr. P. Prasad',
      qualification: '',
      designation: 'Diploma Principal',
      badge: 'Diploma Leadership',
    },
    message: `<p>VIET Diploma College is committed to providing quality technical education through SBTET-approved programmes that equip students with practical skills and industry-ready knowledge. Our diploma programmes focus on hands-on learning, laboratory training, and real-world application of engineering concepts.</p>
<p>With excellent infrastructure, experienced faculty, and strong industry connections, we nurture young minds to become competent technicians and engineers who contribute meaningfully to society and the nation's development.</p>
<p><strong>Building skilled professionals for tomorrow!</strong></p>`,
    inspiration: {
      quote:
        'The best way to predict the future is to create it with skill, dedication, and hard work.',
      author: 'Dr. A.P.J. Abdul Kalam',
    },
    greetings: {
      text: 'Wish you all the best,',
    },
  },
};

async function seed() {
  const existing = await getPageBySlug('diploma-principal');
  if (existing) {
    console.log('diploma-principal page already exists — skipping.');
    return;
  }

  const created = await createPage(diplomaPrincipalPage);
  console.log(`✓ Created diploma-principal page (id: ${created.id})`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
