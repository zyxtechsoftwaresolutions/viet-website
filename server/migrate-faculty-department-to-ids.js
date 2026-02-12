/**
 * Migration: Populate department_pages.sections.faculty.facultyIds from existing faculty.department
 * Run after applying 010_faculty_department_nullable.sql
 * Usage: node -r dotenv/config server/migrate-faculty-department-to-ids.js
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_ANON_KEY). Check .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Faculty filter logic (matches departmentPageConfig + DepartmentPageTemplate)
function matchDept(d, ...terms) {
  const lower = (d || '').toLowerCase();
  return terms.some((t) => lower.includes(t.toLowerCase()));
}

function isCSEFamilyDepartment(d) {
  const x = (d || '').toLowerCase();
  return (
    ((x.includes('computer science and engineering (cse)') || x === 'cse' ||
      (x.includes('computer science') && x.includes('(cse)') && !x.includes('cyber') && !x.includes('datascience') && !x.includes('machinelearning'))) && !x.includes('(csc)') && !x.includes('(csd)') && !x.includes('(csm)')) ||
    x.includes('cse datascience (csd)') || x.includes('datascience (csd)') || (x.includes('data science') && x.includes('(csd)')) || x === 'csd' ||
    x.includes('cse cybersecurity (csc)') || x.includes('cybersecurity (csc)') || (x.includes('cyber') && x.includes('(csc)')) || x === 'csc' ||
    x.includes('cse machinelearning (csm)') || x.includes('machinelearning (csm)') || (x.includes('machine learning') && x.includes('(csm)')) || (x.includes('aiml') && x.includes('(csm)')) || x === 'csm'
  );
}

const SLUG_TO_FILTER = {
  'diploma-agriculture': (d) => matchDept(d, 'agriculture'),
  'diploma-civil': (d) => matchDept(d, 'civil') && (matchDept(d, 'diploma') || !matchDept(d, 'engineering ug', 'b.tech')),
  'diploma-cse': (d) => matchDept(d, 'computer') && (matchDept(d, 'diploma') || matchDept(d, 'computer science engineering')),
  'diploma-ece': (d) => matchDept(d, 'ece', 'electronics') && (matchDept(d, 'diploma') || matchDept(d, 'communications')),
  'diploma-eee': (d) => matchDept(d, 'eee', 'electrical') && (matchDept(d, 'diploma') || matchDept(d, 'electrical & electronics')),
  'diploma-mechanical': (d) => matchDept(d, 'mechanical') && (matchDept(d, 'diploma') || !matchDept(d, 'engineering ug', 'm.tech', 'b.tech')),
  'pg-cadcam': (d) => matchDept(d, 'cad', 'cam', 'cadcam'),
  'pg-cse': (d) => matchDept(d, 'cse', 'computer science') && matchDept(d, 'pg', 'm.tech', 'postgraduate'),
  'pg-power-systems': (d) => matchDept(d, 'power system'),
  'pg-structural': (d) => matchDept(d, 'structural'),
  'pg-thermal': (d) => matchDept(d, 'thermal'),
  'pg-vlsi': (d) => matchDept(d, 'vlsi', 'embedded'),
  'management-bba': (d) => matchDept(d, 'bba', 'business administration'),
  'management-bca': (d) => matchDept(d, 'bca', 'computer applications'),
  'management-mba': (d) => matchDept(d, 'mba', 'business administration'),
  'management-mca': (d) => matchDept(d, 'mca', 'computer applications'),
  'cse': isCSEFamilyDepartment,
  'cyber-security': isCSEFamilyDepartment,
  'data-science': isCSEFamilyDepartment,
  'aiml': isCSEFamilyDepartment,
  'ece': (d) => {
    const x = (d || '').toLowerCase().trim();
    const hasEce = x.includes('electronics') && x.includes('communication');
    const hasEee = x.includes('electrical') && x.includes('electronics');
    return (hasEce && !hasEee) || x === 'ece' || x.includes('electronics and communication');
  },
  'eee': (d) => {
    const x = (d || '').toLowerCase().trim();
    const hasEee = x.includes('electrical') && x.includes('electronics');
    const hasEce = x.includes('electronics') && x.includes('communication');
    return (hasEee && !hasEce) || x === 'eee' || x.includes('electrical and electronics');
  },
  'civil': (d) => matchDept(d, 'civil'),
  'mechanical': (d) => matchDept(d, 'mechanical'),
  'automobile': (d) => matchDept(d, 'automobile', 'ame'),
  'bsh': (d) => matchDept(d, 'bsh', 'basic science', 'humanities'),
};

async function main() {
  const { data: faculty, error: fe } = await supabase.from('faculty').select('id, department');
  if (fe) {
    console.error('Failed to fetch faculty:', fe.message);
    process.exit(1);
  }
  const facultyList = faculty || [];

  const { data: pages, error: pe } = await supabase.from('department_pages').select('slug, sections');
  if (pe) {
    console.error('Failed to fetch department_pages:', pe.message);
    process.exit(1);
  }
  const pagesList = pages || [];

  const slugToFacultyIds = {};
  for (const slug of Object.keys(SLUG_TO_FILTER)) {
    slugToFacultyIds[slug] = new Set();
  }

  for (const f of facultyList) {
    const dept = f.department || '';
    if (!dept.trim()) continue;
    for (const [slug, filterFn] of Object.entries(SLUG_TO_FILTER)) {
      if (filterFn(dept)) {
        slugToFacultyIds[slug].add(f.id);
      }
    }
  }

  for (const page of pagesList) {
    const slug = page.slug;
    if (!SLUG_TO_FILTER[slug]) continue;
    const sections = page.sections || {};
    const facultySection = sections.faculty || {};
    const ids = Array.from(slugToFacultyIds[slug] || []).sort((a, b) => a - b);
    const newSections = {
      ...sections,
      faculty: { ...facultySection, content: facultySection.content || '', facultyIds: ids },
    };
    const { error } = await supabase.from('department_pages').update({ sections: newSections }).eq('slug', slug);
    if (error) {
      console.error(`Failed to update ${slug}:`, error.message);
    } else {
      console.log(`${slug}: assigned ${ids.length} faculty`);
    }
  }

  // Set faculty.department to null for all (optional - keeps data for reference during transition)
  console.log('Migration complete. Faculty department column is now nullable.');
}

main().catch(console.error);
