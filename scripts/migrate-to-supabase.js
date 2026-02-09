#!/usr/bin/env node
/**
 * Migration script: JSON files → Supabase
 * Run after setting SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
 * Usage: node scripts/migrate-to-supabase.js
 */
import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../server/data');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function readJson(filename) {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    if (e.code === 'ENOENT') return null;
    throw e;
  }
}

function toSnake(obj) {
  const map = {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    isExternal: 'is_external',
    busNo: 'bus_no',
    driverName: 'driver_name',
    driverContactNo: 'driver_contact_no',
    seatingCapacity: 'seating_capacity',
    buttonText: 'button_text',
    buttonLink: 'button_link',
    highestPackageLPA: 'highest_package_lpa',
    averagePackageLPA: 'average_package_lpa',
    totalOffers: 'total_offers',
    companiesVisited: 'companies_visited',
  };
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    const key = map[k] || k;
    out[key] = v;
  }
  return out;
}

async function migrate() {
  console.log('Starting migration to Supabase...\n');

  // 1. Users
  const usersData = await readJson('users');
  if (usersData?.users?.length) {
    for (const u of usersData.users) {
      const row = toSnake(u);
      delete row.id;
      const { error } = await supabase.from('users').upsert(row, { onConflict: 'email' });
      if (error) console.warn('Users:', error.message);
    }
    console.log('✓ Users migrated');
  }

  // 2. Announcements
  const annData = await readJson('announcements');
  if (annData?.announcements?.length) {
    const rows = annData.announcements.map(a => {
      const r = toSnake(a);
      delete r.id;
      return r;
    });
    const { error } = await supabase.from('announcements').insert(rows);
    if (error) console.warn('Announcements:', error.message);
    else console.log('✓ Announcements migrated');
  }

  // 3. News
  const newsData = await readJson('news');
  if (newsData?.news?.length) {
    const rows = newsData.news.map(n => {
      const r = toSnake(n);
      delete r.id;
      return r;
    });
    const { error } = await supabase.from('news').insert(rows);
    if (error) console.warn('News:', error.message);
    else console.log('✓ News migrated');
  }

  // 4. Ticker
  const tickerData = await readJson('ticker');
  if (tickerData?.items?.length) {
    const rows = tickerData.items.map(i => {
      const r = toSnake(i);
      delete r.id;
      return r;
    });
    const { error } = await supabase.from('ticker').insert(rows);
    if (error) console.warn('Ticker:', error.message);
    else console.log('✓ Ticker migrated');
  }

  // 5. Events
  const eventsData = await readJson('events');
  if (eventsData?.events?.length) {
    const rows = eventsData.events.map(e => {
      const r = toSnake(e);
      delete r.id;
      return r;
    });
    const { error } = await supabase.from('events').insert(rows);
    if (error) console.warn('Events:', error.message);
    else console.log('✓ Events migrated');
  }

  // 6. Transport routes
  const transportData = await readJson('transport-routes');
  if (transportData?.routes?.length) {
    const rows = transportData.routes.map(r => {
      const row = toSnake(r);
      delete row.id;
      row.bus_no = row.bus_no ?? r.busNo;
      row.driver_name = row.driver_name ?? r.driverName;
      row.driver_contact_no = row.driver_contact_no ?? r.driverContactNo;
      row.seating_capacity = row.seating_capacity ?? r.seatingCapacity;
      return row;
    });
    const { error } = await supabase.from('transport_routes').insert(rows);
    if (error) console.warn('Transport routes:', error.message);
    else console.log('✓ Transport routes migrated');
  }

  // 7. Carousel
  const carouselData = await readJson('carousel');
  if (carouselData?.images?.length) {
    const rows = carouselData.images.map(i => {
      const r = toSnake(i);
      delete r.id;
      return r;
    });
    const { error } = await supabase.from('carousel').insert(rows);
    if (error) console.warn('Carousel:', error.message);
    else console.log('✓ Carousel migrated');
  }

  // 8. Placement carousel
  const pcData = await readJson('placement-carousel');
  if (pcData?.images?.length) {
    const rows = pcData.images.map(i => {
      const r = toSnake(i);
      delete r.id;
      return r;
    });
    const { error } = await supabase.from('placement_carousel').insert(rows);
    if (error) console.warn('Placement carousel:', error.message);
    else console.log('✓ Placement carousel migrated');
  }

  // 9. Hero videos
  const hvData = await readJson('hero-videos');
  if (hvData?.videos?.length) {
    const rows = hvData.videos.map(v => {
      const r = toSnake(v);
      delete r.id;
      r.button_text = r.button_text ?? v.buttonText ?? 'Apply Now';
      r.button_link = r.button_link ?? v.buttonLink;
      r.order = r.order ?? v.order ?? 0;
      return r;
    });
    const { error } = await supabase.from('hero_videos').insert(rows);
    if (error) console.warn('Hero videos:', error.message);
    else console.log('✓ Hero videos migrated');
  }

  // 10. Departments
  const deptData = await readJson('departments');
  if (deptData?.departments?.length) {
    const rows = deptData.departments.map(d => {
      const r = toSnake(d);
      delete r.id;
      return r;
    });
    const { error } = await supabase.from('departments').insert(rows);
    if (error) console.warn('Departments:', error.message);
    else console.log('✓ Departments migrated');
  }

  // 11. Faculty
  const facultyData = await readJson('faculty');
  if (facultyData?.faculty?.length) {
    const rows = facultyData.faculty.map(f => {
      const r = toSnake(f);
      delete r.id;
      return r;
    });
    const { error } = await supabase.from('faculty').insert(rows);
    if (error) console.warn('Faculty:', error.message);
    else console.log('✓ Faculty migrated');
  }

  // 12. HODs
  const hodsData = await readJson('hods');
  if (hodsData?.hods?.length) {
    const rows = hodsData.hods.map(h => {
      const r = toSnake(h);
      delete r.id;
      return r;
    });
    const { error } = await supabase.from('hods').insert(rows);
    if (error) console.warn('HODs:', error.message);
    else console.log('✓ HODs migrated');
  }

  // 13. Gallery
  const galleryData = await readJson('gallery');
  if (galleryData?.images?.length) {
    const rows = galleryData.images.map(i => {
      const r = toSnake(i);
      delete r.id;
      return r;
    });
    const { error } = await supabase.from('gallery').insert(rows);
    if (error) console.warn('Gallery:', error.message);
    else console.log('✓ Gallery migrated');
  }

  // 14. Placement section (update existing or insert)
  const psData = await readJson('placement-section');
  if (psData) {
    const row = toSnake(psData);
    const { data: existing } = await supabase.from('placement_section').select('id').limit(1).single();
    if (existing) {
      const { error } = await supabase.from('placement_section').update(row).eq('id', existing.id);
      if (error) console.warn('Placement section:', error.message);
    } else {
      const { error } = await supabase.from('placement_section').insert(row);
      if (error) console.warn('Placement section:', error.message);
    }
    console.log('✓ Placement section migrated');
  }

  // 15. Recruiters
  const recData = await readJson('recruiters');
  if (recData?.recruiters?.length) {
    const rows = recData.recruiters.map(r => {
      const row = toSnake(r);
      delete row.id;
      return row;
    });
    const { error } = await supabase.from('recruiters').insert(rows);
    if (error) console.warn('Recruiters:', error.message);
    else console.log('✓ Recruiters migrated');
  }

  // 16. Home gallery
  const hgData = await readJson('home-gallery');
  if (hgData?.images?.length) {
    const rows = hgData.images.map((i, idx) => {
      const r = toSnake(i);
      delete r.id;
      r.order = r.order ?? idx;
      return r;
    });
    const { error } = await supabase.from('home_gallery').insert(rows);
    if (error) console.warn('Home gallery:', error.message);
    else console.log('✓ Home gallery migrated');
  }

  // 17. Vibe at VIET
  const vibeData = await readJson('vibe-at-viet');
  if (vibeData?.items?.length) {
    const rows = vibeData.items.map(i => {
      const r = toSnake(i);
      delete r.id;
      return r;
    });
    const { error } = await supabase.from('vibe_at_viet').insert(rows);
    if (error) console.warn('Vibe at VIET:', error.message);
    else console.log('✓ Vibe at VIET migrated');
  }

  // 18. Pages (only columns that exist: slug, title, route, category, content, created_at, updated_at)
  const pagesData = await readJson('pages');
  if (pagesData?.pages?.length) {
    const allowedKeys = ['slug', 'title', 'route', 'category', 'content', 'created_at', 'updated_at'];
    const rows = pagesData.pages.map(p => {
      const r = toSnake(p);
      delete r.id;
      delete r.data;
      delete r.upload_type;
      return Object.fromEntries(Object.entries(r).filter(([k]) => allowedKeys.includes(k)));
    });
    const { error } = await supabase.from('pages').upsert(rows, { onConflict: 'slug' });
    if (error) console.warn('Pages:', error.message);
    else console.log('✓ Pages migrated');
  }

  // 19. Department pages
  const dpData = await readJson('department-pages');
  if (dpData?.pages && Object.keys(dpData.pages).length) {
    for (const [slug, page] of Object.entries(dpData.pages)) {
      const { error } = await supabase.from('department_pages').upsert(
        { slug, sections: page.sections || {}, curriculum: page.curriculum || { programs: [] } },
        { onConflict: 'slug' }
      );
      if (error) console.warn(`Department page ${slug}:`, error.message);
    }
    console.log('✓ Department pages migrated');
  }

  console.log('\nMigration complete. Next: upload files from public/uploads to Supabase Storage (uploads bucket).');
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});
