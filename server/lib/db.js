/**
 * Database layer - Supabase backend
 * Replaces JSON file storage with Supabase PostgreSQL
 */
import { supabase } from './supabase.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');

// Fallback: Use JSON files when Supabase is not configured
const useJsonFallback = !supabase;

// Convert camelCase keys to snake_case for Supabase (PostgreSQL columns)
const SNAKE_MAP = {
  createdAt: 'created_at', updatedAt: 'updated_at', isExternal: 'is_external',
  busNo: 'bus_no', driverName: 'driver_name', driverContactNo: 'driver_contact_no',
  seatingCapacity: 'seating_capacity', buttonText: 'button_text', buttonLink: 'button_link',
  highestPackageLPA: 'highest_package_lpa', averagePackageLPA: 'average_package_lpa',
  totalOffers: 'total_offers', companiesVisited: 'companies_visited',
  videoLink: 'video_link', isActive: 'is_active',
  pdfUrl: 'pdf_url', isLatest: 'is_latest', sortOrder: 'sort_order',
  videoUrl: 'video_url', isEnabled: 'is_enabled',
  allowedSections: 'allowed_sections',
};
function toSnake(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    const key = SNAKE_MAP[k] ?? k;
    out[key] = v;
  }
  return out;
}

async function readJsonFile(filename) {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

async function writeJsonFile(filename, data) {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// ==================== USERS ====================
export async function getUsers() {
  if (useJsonFallback) {
    try {
      const d = await readJsonFile('users');
      return Array.isArray(d.users) ? d.users : [];
    } catch (e) {
      console.error('Failed to read users.json:', e.message);
      return [];
    }
  }
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      console.error('Supabase users error:', error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error('Supabase users query failed:', e.message);
    return [];
  }
}

export async function findUserByUsernameOrEmail(username) {
  const users = await getUsers();
  return users.find(u => u.username === username || u.email === username);
}

export async function createUser(user) {
  if (useJsonFallback) {
    const d = await readJsonFile('users');
    const newUser = { id: Date.now(), ...user };
    d.users.push(newUser);
    await writeJsonFile('users', d);
    return newUser;
  }
  const { data, error } = await supabase.from('users').insert(toSnake(user)).select().single();
  if (error) throw error;
  return { ...data, allowed_sections: data.allowed_sections ?? [], allowedSections: data.allowed_sections ?? [] };
}

export async function getUserById(id) {
  const users = await getUsers();
  return users.find(u => String(u.id) === String(id));
}

export async function updateUser(id, updates) {
  if (useJsonFallback) {
    const d = await readJsonFile('users');
    const idx = d.users.findIndex(u => String(u.id) === String(id));
    if (idx === -1) return null;
    const allowedSections = updates.allowed_sections ?? updates.allowedSections;
    if (allowedSections !== undefined) {
      d.users[idx].allowed_sections = Array.isArray(allowedSections) ? allowedSections : [];
      d.users[idx].allowedSections = d.users[idx].allowed_sections;
    }
    if (updates.password !== undefined) d.users[idx].password = updates.password;
    if (updates.username !== undefined) d.users[idx].username = updates.username;
    if (updates.email !== undefined) d.users[idx].email = updates.email;
    if (updates.role !== undefined) d.users[idx].role = updates.role;
    await writeJsonFile('users', d);
    return d.users[idx];
  }
  const payload = {};
  if (updates.allowed_sections !== undefined) payload.allowed_sections = updates.allowed_sections;
  if (updates.allowedSections !== undefined) payload.allowed_sections = updates.allowedSections;
  if (updates.password !== undefined) payload.password = updates.password;
  if (updates.username !== undefined) payload.username = updates.username;
  if (updates.email !== undefined) payload.email = updates.email;
  if (updates.role !== undefined) payload.role = updates.role;
  if (Object.keys(payload).length === 0) return getUserById(id);
  const { data, error } = await supabase.from('users').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteUser(id) {
  if (useJsonFallback) {
    const d = await readJsonFile('users');
    const before = d.users.length;
    d.users = d.users.filter(u => String(u.id) !== String(id));
    if (d.users.length === before) return false;
    await writeJsonFile('users', d);
    return true;
  }
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// ==================== ANNOUNCEMENTS ====================
export async function getAnnouncements() {
  if (useJsonFallback) {
    const d = await readJsonFile('announcements');
    return d.announcements;
  }
  const { data, error } = await supabase.from('announcements').select('*').order('id', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createAnnouncement(item) {
  if (useJsonFallback) {
    const d = await readJsonFile('announcements');
    const newItem = { id: Date.now(), ...item };
    d.announcements.push(newItem);
    await writeJsonFile('announcements', d);
    return newItem;
  }
  const { data, error } = await supabase.from('announcements').insert(toSnake(item)).select().single();
  if (error) throw error;
  return data;
}

export async function updateAnnouncement(id, item) {
  if (useJsonFallback) {
    const d = await readJsonFile('announcements');
    const idx = d.announcements.findIndex(a => a.id === parseInt(id));
    if (idx === -1) return null;
    d.announcements[idx] = { ...d.announcements[idx], ...item };
    await writeJsonFile('announcements', d);
    return d.announcements[idx];
  }
  const { data, error } = await supabase.from('announcements').update(toSnake(item)).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteAnnouncement(id) {
  if (useJsonFallback) {
    const d = await readJsonFile('announcements');
    d.announcements = d.announcements.filter(a => a.id !== parseInt(id));
    await writeJsonFile('announcements', d);
    return;
  }
  const { error } = await supabase.from('announcements').delete().eq('id', id);
  if (error) throw error;
}

// ==================== NEWS ====================
export async function getNews() {
  if (useJsonFallback) {
    const d = await readJsonFile('news');
    return d.news;
  }
  const { data, error } = await supabase.from('news').select('*').order('id', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createNews(item) {
  if (useJsonFallback) {
    const d = await readJsonFile('news');
    const newItem = { id: Date.now(), ...item };
    d.news.push(newItem);
    await writeJsonFile('news', d);
    return newItem;
  }
  const { data, error } = await supabase.from('news').insert(toSnake(item)).select().single();
  if (error) throw error;
  return data;
}

export async function updateNews(id, item) {
  if (useJsonFallback) {
    const d = await readJsonFile('news');
    const idx = d.news.findIndex(n => n.id === parseInt(id));
    if (idx === -1) return null;
    d.news[idx] = { ...d.news[idx], ...item };
    await writeJsonFile('news', d);
    return d.news[idx];
  }
  const { data, error } = await supabase.from('news').update(toSnake(item)).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteNews(id) {
  if (useJsonFallback) {
    const d = await readJsonFile('news');
    d.news = d.news.filter(n => n.id !== parseInt(id));
    await writeJsonFile('news', d);
    return;
  }
  const { error } = await supabase.from('news').delete().eq('id', id);
  if (error) throw error;
}

// ==================== TICKER ====================
export async function getTicker() {
  if (useJsonFallback) {
    const d = await readJsonFile('ticker');
    return d.items;
  }
  const { data, error } = await supabase.from('ticker').select('*').order('id');
  if (error) throw error;
  return data || [];
}

export async function createTickerItem(item) {
  if (useJsonFallback) {
    const d = await readJsonFile('ticker');
    const newItem = { id: Date.now(), ...item };
    d.items.push(newItem);
    await writeJsonFile('ticker', d);
    return newItem;
  }
  const { data, error } = await supabase.from('ticker').insert(toSnake(item)).select().single();
  if (error) throw error;
  return data;
}

export async function updateTickerItem(id, item) {
  if (useJsonFallback) {
    const d = await readJsonFile('ticker');
    const idx = d.items.findIndex(i => i.id === parseInt(id));
    if (idx === -1) return null;
    d.items[idx] = { ...d.items[idx], ...item };
    await writeJsonFile('ticker', d);
    return d.items[idx];
  }
  const { data, error } = await supabase.from('ticker').update(toSnake(item)).eq('id', id).select().maybeSingle();
  if (error) throw error;
  return data;
}

export async function deleteTickerItem(id) {
  if (useJsonFallback) {
    const d = await readJsonFile('ticker');
    d.items = d.items.filter(i => i.id !== parseInt(id));
    await writeJsonFile('ticker', d);
    return;
  }
  const { error } = await supabase.from('ticker').delete().eq('id', id);
  if (error) throw error;
}

// ==================== EVENTS ====================
export async function getEvents() {
  if (useJsonFallback) {
    const d = await readJsonFile('events');
    return d.events;
  }
  const { data, error } = await supabase.from('events').select('*').order('date', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createEvent(item) {
  if (useJsonFallback) {
    const d = await readJsonFile('events');
    const newItem = { id: Date.now(), ...item };
    d.events.push(newItem);
    await writeJsonFile('events', d);
    return newItem;
  }
  const { data, error } = await supabase.from('events').insert(toSnake(item)).select().single();
  if (error) throw error;
  return data;
}

export async function updateEvent(id, item) {
  if (useJsonFallback) {
    const d = await readJsonFile('events');
    const idx = d.events.findIndex(e => e.id === parseInt(id));
    if (idx === -1) return null;
    d.events[idx] = { ...d.events[idx], ...item };
    await writeJsonFile('events', d);
    return d.events[idx];
  }
  const { data, error } = await supabase.from('events').update(toSnake(item)).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteEvent(id) {
  if (useJsonFallback) {
    const d = await readJsonFile('events');
    d.events = d.events.filter(e => e.id !== parseInt(id));
    await writeJsonFile('events', d);
    return;
  }
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) throw error;
}

// ==================== TRANSPORT ROUTES ====================
export async function getTransportRoutes() {
  if (useJsonFallback) {
    const d = await readJsonFile('transport-routes');
    return d.routes;
  }
  const { data, error } = await supabase.from('transport_routes').select('*').order('id');
  if (error) throw error;
  return (data || []).map(r => ({
    ...r,
    busNo: r.bus_no,
    driverName: r.driver_name,
    driverContactNo: r.driver_contact_no,
    seatingCapacity: r.seating_capacity
  }));
}

export async function createTransportRoute(item) {
  if (useJsonFallback) {
    const d = await readJsonFile('transport-routes');
    const newItem = { id: Date.now(), ...item };
    d.routes.push(newItem);
    await writeJsonFile('transport-routes', d);
    return newItem;
  }
  const dbItem = {
    name: item.name,
    from: item.from,
    to: item.to,
    stops: item.stops,
    time: item.time,
    frequency: item.frequency,
    bus_no: item.busNo ?? item.bus_no,
    driver_name: item.driverName ?? item.driver_name,
    driver_contact_no: item.driverContactNo ?? item.driver_contact_no,
    seating_capacity: item.seatingCapacity ?? item.seating_capacity,
    image: item.image
  };
  const { data, error } = await supabase.from('transport_routes').insert(dbItem).select().single();
  if (error) throw error;
  return { ...data, busNo: data.bus_no, driverName: data.driver_name, driverContactNo: data.driver_contact_no, seatingCapacity: data.seating_capacity };
}

export async function updateTransportRoute(id, item) {
  if (useJsonFallback) {
    const d = await readJsonFile('transport-routes');
    const idx = d.routes.findIndex(r => r.id === parseInt(id));
    if (idx === -1) return null;
    d.routes[idx] = { ...d.routes[idx], ...item };
    await writeJsonFile('transport-routes', d);
    return d.routes[idx];
  }
  const dbItem = {};
  if (item.name !== undefined) dbItem.name = item.name;
  if (item.from !== undefined) dbItem.from = item.from;
  if (item.to !== undefined) dbItem.to = item.to;
  if (item.stops !== undefined) dbItem.stops = item.stops;
  if (item.time !== undefined) dbItem.time = item.time;
  if (item.frequency !== undefined) dbItem.frequency = item.frequency;
  if (item.busNo !== undefined) dbItem.bus_no = item.busNo;
  if (item.driverName !== undefined) dbItem.driver_name = item.driverName;
  if (item.driverContactNo !== undefined) dbItem.driver_contact_no = item.driverContactNo;
  if (item.seatingCapacity !== undefined) dbItem.seating_capacity = item.seatingCapacity;
  if (item.image !== undefined) dbItem.image = item.image;
  const { data, error } = await supabase.from('transport_routes').update(dbItem).eq('id', id).select().single();
  if (error) throw error;
  return data ? { ...data, busNo: data.bus_no, driverName: data.driver_name, driverContactNo: data.driver_contact_no, seatingCapacity: data.seating_capacity } : null;
}

export async function deleteTransportRoute(id) {
  if (useJsonFallback) {
    const d = await readJsonFile('transport-routes');
    d.routes = d.routes.filter(r => r.id !== parseInt(id));
    await writeJsonFile('transport-routes', d);
    return;
  }
  const { error } = await supabase.from('transport_routes').delete().eq('id', id);
  if (error) throw error;
}

// ==================== CAROUSEL ====================
export async function getCarousel() {
  if (useJsonFallback) {
    const d = await readJsonFile('carousel');
    return d.images;
  }
  const { data, error } = await supabase.from('carousel').select('*').order('id');
  if (error) throw error;
  return (data || []).map(row => ({ ...row, id: row.id, src: row.src, title: row.title, subtitle: row.subtitle }));
}

export async function createCarouselItem(item) {
  if (useJsonFallback) {
    const d = await readJsonFile('carousel');
    const newItem = { id: d.images.length ? Math.max(...d.images.map(i => i.id)) + 1 : 1, ...item };
    d.images.push(newItem);
    await writeJsonFile('carousel', d);
    return newItem;
  }
  const { data, error } = await supabase.from('carousel').insert(item).select().single();
  if (error) throw error;
  return data;
}

export async function updateCarouselItem(id, item) {
  if (useJsonFallback) {
    const d = await readJsonFile('carousel');
    const idx = d.images.findIndex(i => i.id === parseInt(id));
    if (idx === -1) return null;
    d.images[idx] = { ...d.images[idx], ...item };
    await writeJsonFile('carousel', d);
    return d.images[idx];
  }
  const { data, error } = await supabase.from('carousel').update(toSnake(item)).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteCarouselItem(id) {
  if (useJsonFallback) {
    const d = await readJsonFile('carousel');
    d.images = d.images.filter(i => i.id !== parseInt(id));
    await writeJsonFile('carousel', d);
    return;
  }
  const { error } = await supabase.from('carousel').delete().eq('id', id);
  if (error) throw error;
}

// ==================== PLACEMENT CAROUSEL ====================
export async function getPlacementCarousel() {
  if (useJsonFallback) {
    const d = await readJsonFile('placement-carousel');
    return d.images;
  }
  const { data, error } = await supabase.from('placement_carousel').select('*').order('id');
  if (error) throw error;
  return (data || []).map(row => ({ ...row, id: row.id, src: row.src, title: row.title, subtitle: row.subtitle }));
}

export async function createPlacementCarouselItem(item) {
  if (useJsonFallback) {
    const d = await readJsonFile('placement-carousel');
    const newItem = { id: Date.now(), ...item };
    d.images.push(newItem);
    await writeJsonFile('placement-carousel', d);
    return newItem;
  }
  const { data, error } = await supabase.from('placement_carousel').insert(toSnake(item)).select().single();
  if (error) throw error;
  return data;
}

export async function updatePlacementCarouselItem(id, item) {
  if (useJsonFallback) {
    const d = await readJsonFile('placement-carousel');
    const idx = d.images.findIndex(i => i.id === parseInt(id));
    if (idx === -1) return null;
    d.images[idx] = { ...d.images[idx], ...item };
    await writeJsonFile('placement-carousel', d);
    return d.images[idx];
  }
  const { data, error } = await supabase.from('placement_carousel').update(item).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deletePlacementCarouselItem(id) {
  if (useJsonFallback) {
    const d = await readJsonFile('placement-carousel');
    d.images = d.images.filter(i => i.id !== parseInt(id));
    await writeJsonFile('placement-carousel', d);
    return;
  }
  const { error } = await supabase.from('placement_carousel').delete().eq('id', id);
  if (error) throw error;
}

// ==================== HERO VIDEOS ====================
export async function getHeroVideos() {
  if (useJsonFallback) {
    const d = await readJsonFile('hero-videos');
    const list = Array.isArray(d.videos) ? d.videos : [];
    return list.slice().sort((a, b) => (Number(a.order) ?? 0) - (Number(b.order) ?? 0));
  }
  const { data, error } = await supabase.from('hero_videos').select('*').order('order', { ascending: true });
  if (error) throw error;
  return (data || []).map(row => ({
    ...row,
    id: row.id,
    src: row.src,
    poster: row.poster,
    mobileSrc: row.mobile_src,
    mobilePoster: row.mobile_poster,
    badge: row.badge,
    title: row.title,
    subtitle: row.subtitle,
    buttonText: row.button_text,
    buttonLink: row.button_link,
    order: row.order
  }));
}

export async function createHeroVideo(item) {
  const dbItem = {
    src: item.src ?? '',
    poster: item.poster,
    mobile_src: item.mobileSrc ?? item.mobile_src ?? null,
    mobile_poster: item.mobilePoster ?? item.mobile_poster ?? null,
    badge: item.badge,
    title: item.title,
    subtitle: item.subtitle,
    button_text: item.buttonText ?? item.button_text ?? '',
    button_link: item.buttonLink ?? item.button_link,
    order: item.order ?? 0
  };
  if (useJsonFallback) {
    const d = await readJsonFile('hero-videos');
    const list = Array.isArray(d.videos) ? d.videos : [];
    const order = item.order != null ? Number(item.order) : list.length;
    const newItem = { id: Date.now(), ...item, src: dbItem.src, poster: dbItem.poster, order };
    list.push(newItem);
    d.videos = list;
    await writeJsonFile('hero-videos', d);
    return newItem;
  }
  const { data, error } = await supabase.from('hero_videos').insert(dbItem).select().single();
  if (error) throw error;
  return {
    ...data,
    buttonText: data.button_text,
    buttonLink: data.button_link,
    mobileSrc: data.mobile_src,
    mobilePoster: data.mobile_poster,
  };
}

export async function updateHeroVideo(id, item) {
  const dbItem = {};
  if (item.src !== undefined) dbItem.src = item.src;
  if (item.poster !== undefined) dbItem.poster = item.poster;
  if (item.mobileSrc !== undefined) dbItem.mobile_src = item.mobileSrc;
  if (item.mobilePoster !== undefined) dbItem.mobile_poster = item.mobilePoster;
  if (item.badge !== undefined) dbItem.badge = item.badge;
  if (item.title !== undefined) dbItem.title = item.title;
  if (item.subtitle !== undefined) dbItem.subtitle = item.subtitle;
  if (item.buttonText !== undefined) dbItem.button_text = item.buttonText;
  if (item.buttonLink !== undefined) dbItem.button_link = item.buttonLink;
  if (item.order !== undefined) dbItem.order = item.order;
  if (useJsonFallback) {
    const d = await readJsonFile('hero-videos');
    const idx = d.videos.findIndex(v => v.id === parseInt(id));
    if (idx === -1) return null;
    d.videos[idx] = { ...d.videos[idx], ...item };
    await writeJsonFile('hero-videos', d);
    return d.videos[idx];
  }
  const { data, error } = await supabase.from('hero_videos').update(dbItem).eq('id', id).select().single();
  if (error) throw error;
  return data
    ? {
        ...data,
        buttonText: data.button_text,
        buttonLink: data.button_link,
        mobileSrc: data.mobile_src,
        mobilePoster: data.mobile_poster,
      }
    : null;
}

export async function deleteHeroVideo(id) {
  if (useJsonFallback) {
    const d = await readJsonFile('hero-videos');
    d.videos = d.videos.filter(v => v.id !== parseInt(id));
    await writeJsonFile('hero-videos', d);
    return;
  }
  const { error } = await supabase.from('hero_videos').delete().eq('id', id);
  if (error) throw error;
}

export async function reorderHeroVideos(orderUpdates) {
  if (!Array.isArray(orderUpdates) || orderUpdates.length === 0) {
    return getHeroVideos();
  }
  if (useJsonFallback) {
    const d = await readJsonFile('hero-videos');
    orderUpdates.forEach(({ id, order }) => {
      const idx = d.videos.findIndex((v) => v.id === parseInt(id, 10));
      if (idx !== -1) {
        d.videos[idx].order = order;
      }
    });
    await writeJsonFile('hero-videos', d);
    return getHeroVideos();
  }
  const promises = orderUpdates.map(({ id, order }) =>
    supabase.from('hero_videos').update({ order }).eq('id', id)
  );
  const results = await Promise.all(promises);
  const failed = results.find((r) => r.error);
  if (failed?.error) throw failed.error;
  return getHeroVideos();
}

// ==================== DEPARTMENTS ====================
export async function getDepartments() {
  if (useJsonFallback) {
    const d = await readJsonFile('departments');
    return d.departments;
  }
  const { data, error } = await supabase.from('departments').select('*').order('id');
  if (error) throw error;
  return data || [];
}

export async function createDepartment(item) {
  if (useJsonFallback) {
    const d = await readJsonFile('departments');
    const newItem = { id: d.departments.length ? Math.max(...d.departments.map(x => x.id)) + 1 : 1, ...item };
    d.departments.push(newItem);
    await writeJsonFile('departments', d);
    return newItem;
  }
  const { data, error } = await supabase.from('departments').insert(toSnake(item)).select().single();
  if (error) throw error;
  return data;
}

export async function updateDepartment(id, item) {
  if (useJsonFallback) {
    const d = await readJsonFile('departments');
    const idx = d.departments.findIndex(x => x.id === parseInt(id));
    if (idx === -1) return null;
    d.departments[idx] = { ...d.departments[idx], ...item };
    await writeJsonFile('departments', d);
    return d.departments[idx];
  }
  const { data, error } = await supabase.from('departments').update(toSnake(item)).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteDepartment(id) {
  if (useJsonFallback) {
    const d = await readJsonFile('departments');
    d.departments = d.departments.filter(x => x.id !== parseInt(id));
    await writeJsonFile('departments', d);
    return;
  }
  const { error } = await supabase.from('departments').delete().eq('id', id);
  if (error) throw error;
}

// ==================== FACULTY ====================
export async function getFaculty() {
  if (useJsonFallback) {
    const d = await readJsonFile('faculty');
    const faculty = Array.isArray(d.faculty) ? d.faculty : [];
    // Sort by sort_order (desc), then designation, then name
    return faculty.sort((a, b) => {
      const soA = Number(a.sort_order ?? a.sortOrder ?? 0);
      const soB = Number(b.sort_order ?? b.sortOrder ?? 0);
      if (soB !== soA) return soB - soA;
      const desA = String(a.designation ?? '').toLowerCase();
      const desB = String(b.designation ?? '').toLowerCase();
      if (desA !== desB) {
        // Principal first, then HOD, then others
        if (desA.includes('principal') && !desB.includes('principal')) return -1;
        if (!desA.includes('principal') && desB.includes('principal')) return 1;
        if ((desA.includes('hod') || desA.includes('head')) && !(desB.includes('hod') || desB.includes('head'))) return -1;
        if (!(desA.includes('hod') || desA.includes('head')) && (desB.includes('hod') || desB.includes('head'))) return 1;
        return desA.localeCompare(desB);
      }
      return String(a.name ?? '').localeCompare(String(b.name ?? ''));
    });
  }
  const { data, error } = await supabase
    .from('faculty')
    .select('*')
    .order('sort_order', { ascending: false })
    .order('designation')
    .order('name');
  if (error) throw error;
  return data || [];
}

export async function createFaculty(item) {
  if (useJsonFallback) {
    const d = await readJsonFile('faculty');
    const faculty = Array.isArray(d.faculty) ? d.faculty : [];
    // Assign default sort_order based on designation if not provided
    let sortOrder = item.sort_order ?? item.sortOrder ?? 0;
    if (sortOrder === 0) {
      const des = String(item.designation ?? '').toLowerCase();
      if (des.includes('principal')) sortOrder = 1000;
      else if (des.includes('hod') || des.includes('head')) sortOrder = 500;
    }
    const newItem = { id: Date.now(), ...item, sort_order: sortOrder, sortOrder };
    faculty.push(newItem);
    d.faculty = faculty;
    await writeJsonFile('faculty', d);
    return newItem;
  }
  // Assign default sort_order based on designation if not provided
  const payload = { ...item };
  if (!payload.sort_order && !payload.sortOrder) {
    const des = String(item.designation ?? '').toLowerCase();
    if (des.includes('principal')) payload.sort_order = 1000;
    else if (des.includes('hod') || des.includes('head')) payload.sort_order = 500;
    else payload.sort_order = 0;
  }
  const { data, error } = await supabase.from('faculty').insert(toSnake(payload)).select().single();
  if (error) throw error;
  return data;
}

export async function updateFaculty(id, item) {
  if (useJsonFallback) {
    const d = await readJsonFile('faculty');
    const idx = d.faculty.findIndex(f => f.id === parseInt(id));
    if (idx === -1) return null;
    d.faculty[idx] = { ...d.faculty[idx], ...item };
    await writeJsonFile('faculty', d);
    return d.faculty[idx];
  }
  const { data, error } = await supabase.from('faculty').update(toSnake(item)).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteFaculty(id) {
  if (useJsonFallback) {
    const d = await readJsonFile('faculty');
    d.faculty = d.faculty.filter(f => f.id !== parseInt(id));
    await writeJsonFile('faculty', d);
    return;
  }
  const { error } = await supabase.from('faculty').delete().eq('id', id);
  if (error) throw error;
}

export async function reorderFaculty(orderUpdates) {
  // orderUpdates is an array of { id, sort_order }
  if (useJsonFallback) {
    const d = await readJsonFile('faculty');
    const updates = Array.isArray(orderUpdates) ? orderUpdates : [];
    updates.forEach(({ id, sort_order }) => {
      const idx = d.faculty.findIndex(f => f.id === parseInt(id));
      if (idx !== -1) {
        d.faculty[idx].sort_order = sort_order;
        d.faculty[idx].sortOrder = sort_order; // Also update camelCase for consistency
      }
    });
    await writeJsonFile('faculty', d);
    return d.faculty;
  }
  // Batch update using Supabase
  const updates = Array.isArray(orderUpdates) ? orderUpdates : [];
  const promises = updates.map(({ id, sort_order }) =>
    supabase.from('faculty').update({ sort_order }).eq('id', id)
  );
  const results = await Promise.all(promises);
  const errors = results.filter(r => r.error);
  if (errors.length > 0) {
    throw new Error(`Failed to update some faculty: ${errors.map(e => e.error.message).join(', ')}`);
  }
  return await getFaculty();
}

// ==================== HODs ====================
export async function getHods() {
  if (useJsonFallback) {
    const d = await readJsonFile('hods');
    const hods = Array.isArray(d.hods) ? d.hods : [];
    // Sort by sort_order (desc), then designation, then name
    return hods.sort((a, b) => {
      const soA = Number(a.sort_order ?? a.sortOrder ?? 0);
      const soB = Number(b.sort_order ?? b.sortOrder ?? 0);
      if (soB !== soA) return soB - soA;
      const desA = String(a.designation ?? '').toLowerCase();
      const desB = String(b.designation ?? '').toLowerCase();
      if (desA !== desB) {
        // Principal first, then HOD, then others
        if (desA.includes('principal') && !desB.includes('principal')) return -1;
        if (!desA.includes('principal') && desB.includes('principal')) return 1;
        if ((desA.includes('hod') || desA.includes('head')) && !(desB.includes('hod') || desB.includes('head'))) return -1;
        if (!(desA.includes('hod') || desA.includes('head')) && (desB.includes('hod') || desB.includes('head'))) return 1;
        return desA.localeCompare(desB);
      }
      return String(a.name ?? '').localeCompare(String(b.name ?? ''));
    });
  }
  const { data, error } = await supabase
    .from('hods')
    .select('*')
    .order('sort_order', { ascending: false })
    .order('designation')
    .order('name');
  if (error) throw error;
  return data || [];
}

export async function createHod(item) {
  if (useJsonFallback) {
    const d = await readJsonFile('hods');
    const hods = Array.isArray(d.hods) ? d.hods : [];
    // Assign default sort_order based on designation if not provided
    let sortOrder = item.sort_order ?? item.sortOrder ?? 0;
    if (sortOrder === 0) {
      const des = String(item.designation ?? '').toLowerCase();
      if (des.includes('principal')) sortOrder = 1000;
      else if (des.includes('hod') || des.includes('head')) sortOrder = 500;
    }
    const newItem = { id: Date.now(), ...item, sort_order: sortOrder, sortOrder };
    hods.push(newItem);
    d.hods = hods;
    await writeJsonFile('hods', d);
    return newItem;
  }
  // Assign default sort_order based on designation if not provided
  const payload = { ...item };
  if (!payload.sort_order && !payload.sortOrder) {
    const des = String(item.designation ?? '').toLowerCase();
    if (des.includes('principal')) payload.sort_order = 1000;
    else if (des.includes('hod') || des.includes('head')) payload.sort_order = 500;
    else payload.sort_order = 0;
  }
  const { data, error } = await supabase.from('hods').insert(toSnake(payload)).select().single();
  if (error) throw error;
  return data;
}

export async function updateHod(id, item) {
  if (useJsonFallback) {
    const d = await readJsonFile('hods');
    const idx = d.hods.findIndex(h => h.id === parseInt(id));
    if (idx === -1) return null;
    d.hods[idx] = { ...d.hods[idx], ...item };
    await writeJsonFile('hods', d);
    return d.hods[idx];
  }
  const { data, error } = await supabase.from('hods').update(toSnake(item)).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteHod(id) {
  if (useJsonFallback) {
    const d = await readJsonFile('hods');
    d.hods = d.hods.filter(h => h.id !== parseInt(id));
    await writeJsonFile('hods', d);
    return;
  }
  const { error } = await supabase.from('hods').delete().eq('id', id);
  if (error) throw error;
}

export async function reorderHods(orderUpdates) {
  // orderUpdates is an array of { id, sort_order }
  if (useJsonFallback) {
    const d = await readJsonFile('hods');
    const updates = Array.isArray(orderUpdates) ? orderUpdates : [];
    updates.forEach(({ id, sort_order }) => {
      const idx = d.hods.findIndex(h => h.id === parseInt(id));
      if (idx !== -1) {
        d.hods[idx].sort_order = sort_order;
        d.hods[idx].sortOrder = sort_order; // Also update camelCase for consistency
      }
    });
    await writeJsonFile('hods', d);
    return d.hods;
  }
  // Batch update using Supabase
  const updates = Array.isArray(orderUpdates) ? orderUpdates : [];
  const promises = updates.map(({ id, sort_order }) =>
    supabase.from('hods').update({ sort_order }).eq('id', id)
  );
  const results = await Promise.all(promises);
  const errors = results.filter(r => r.error);
  if (errors.length > 0) {
    throw new Error(`Failed to update some HODs: ${errors.map(e => e.error.message).join(', ')}`);
  }
  return await getHods();
}

// ==================== GALLERY ====================
const DEFAULT_GALLERY_FILE = {
  settings: {
    hero: {
      badge: 'Campus Life',
      title: 'Gallery',
      description: 'Browse photos from campus events, celebrations, and student activities at VIET.',
      heroImage: '/campus-hero.jpg',
    },
    eventsSectionLabel: 'Events',
    eventsSectionTitle: 'Browse by event',
  },
  events: [],
  images: [],
};

function normalizeGalleryStore(raw) {
  const base = raw && typeof raw === 'object' ? raw : {};
  const images = Array.isArray(base.images) ? base.images : [];
  const settings = {
    ...DEFAULT_GALLERY_FILE.settings,
    ...(base.settings || {}),
    hero: {
      ...DEFAULT_GALLERY_FILE.settings.hero,
      ...(base.settings?.hero || {}),
    },
  };

  let events = Array.isArray(base.events) ? base.events : [];
  const needsLegacyEventMigration = !Array.isArray(base.events) && images.length > 0;
  if (needsLegacyEventMigration) {
    const names = [...new Set(images.map((i) => i.eventName || i.alt).filter(Boolean))];
    events = names.map((name, idx) => {
      const related = images.filter((i) => (i.eventName || i.alt) === name);
      const stableId =
        related.length > 0 && related[0].id != null ? Number(related[0].id) : Date.now() + idx;
      return {
        id: stableId,
        name,
        badge: '',
        description: '',
        order: idx,
      };
    });
  }

  const normalizedImages = images.map((img, idx) => {
    const eventName = img.eventName || img.alt || '';
    let eventId = img.eventId != null ? Number(img.eventId) : undefined;
    if (!eventId && eventName) {
      const match = events.find((e) => e.name === eventName);
      if (match) eventId = match.id;
    }
    return {
      ...img,
      eventId,
      eventName,
      caption: img.caption || img.alt || '',
      order: img.order != null ? Number(img.order) : idx,
    };
  });

  events = events
    .map((e, idx) => ({
      id: Number(e.id) || Date.now() + idx,
      name: String(e.name || ''),
      badge: String(e.badge || ''),
      description: String(e.description || ''),
      order: e.order != null ? Number(e.order) : idx,
    }))
    .sort((a, b) => a.order - b.order);

  return { settings, events, images: normalizedImages };
}

async function readGalleryStore() {
  const raw = await readJsonFile('gallery');
  const normalized = normalizeGalleryStore(raw);
  if (!Array.isArray(raw?.events) && Array.isArray(raw?.images) && raw.images.length > 0) {
    await writeJsonFile('gallery', normalized);
  }
  return normalized;
}

async function writeGalleryStore(store) {
  const normalized = normalizeGalleryStore(store);
  await writeJsonFile('gallery', normalized);
  return normalized;
}

export async function getGalleryPage() {
  return readGalleryStore();
}

export async function getGallery() {
  const store = await readGalleryStore();
  return store.images;
}

export async function updateGallerySettings(settings) {
  const store = await readGalleryStore();
  store.settings = {
    ...store.settings,
    ...settings,
    hero: { ...store.settings.hero, ...(settings?.hero || {}) },
  };
  return writeGalleryStore(store);
}

export async function createGalleryEvent(event) {
  const store = await readGalleryStore();
  const newEvent = {
    id: Date.now(),
    name: String(event.name || '').trim(),
    badge: String(event.badge || ''),
    description: String(event.description || ''),
    order: event.order != null ? Number(event.order) : store.events.length,
  };
  if (!newEvent.name) throw new Error('Event name is required');
  store.events.push(newEvent);
  await writeGalleryStore(store);
  return newEvent;
}

export async function updateGalleryEvent(id, patch) {
  const store = await readGalleryStore();
  const idx = store.events.findIndex((e) => Number(e.id) === Number(id));
  if (idx === -1) return null;
  const prevName = store.events[idx].name;
  store.events[idx] = {
    ...store.events[idx],
    ...patch,
    id: store.events[idx].id,
    name: patch.name != null ? String(patch.name).trim() : store.events[idx].name,
  };
  if (patch.name && patch.name !== prevName) {
    const eventId = Number(store.events[idx].id);
    store.images = store.images.map((img) =>
      Number(img.eventId) === eventId ? { ...img, eventName: store.events[idx].name } : img
    );
  }
  await writeGalleryStore(store);
  return store.events[idx];
}

export async function deleteGalleryEvent(id) {
  const store = await readGalleryStore();
  const eventId = Number(id);
  const target = store.events.find((e) => Number(e.id) === eventId);
  const eventName = target?.name;
  store.events = store.events.filter((e) => Number(e.id) !== eventId);
  store.images = store.images.filter((img) => {
    if (Number(img.eventId) === eventId) return false;
    if (eventName && img.eventName === eventName) return false;
    if (eventName && !img.eventId && img.alt === eventName) return false;
    return true;
  });
  await writeGalleryStore(store);
}

export async function createGalleryItem(item) {
  const store = await readGalleryStore();
  let eventName = item.eventName ? String(item.eventName).trim() : '';
  let eventId = item.eventId != null ? Number(item.eventId) : undefined;
  if (eventId) {
    const ev = store.events.find((e) => e.id === eventId);
    if (ev) eventName = ev.name;
  } else if (eventName) {
    let ev = store.events.find((e) => e.name === eventName);
    if (!ev) {
      ev = {
        id: Date.now(),
        name: eventName,
        badge: '',
        description: '',
        order: store.events.length,
      };
      store.events.push(ev);
      eventId = ev.id;
    } else {
      eventId = ev.id;
    }
  }

  const eventPhotos = store.images.filter((img) => img.eventId === eventId);
  const newItem = {
    id: Date.now(),
    src: item.src,
    alt: item.alt || item.caption || eventName || 'Gallery image',
    department: item.department || '',
    eventId,
    eventName,
    caption: item.caption || item.alt || '',
    order: item.order != null ? Number(item.order) : eventPhotos.length,
    createdAt: new Date().toISOString(),
  };
  store.images.push(newItem);
  await writeGalleryStore(store);
  return newItem;
}

export async function deleteGalleryItem(id) {
  const store = await readGalleryStore();
  const targetId = Number(id);
  store.images = store.images.filter((i) => Number(i.id) !== targetId);
  await writeGalleryStore(store);
}

// ==================== PLACEMENT SECTION ====================
export async function getPlacementSection() {
  if (useJsonFallback) {
    const d = await readJsonFile('placement-section');
    return d;
  }
  const { data, error } = await supabase.from('placement_section').select('*').limit(1).single();
  if (error) throw error;
  return data ? {
    title: data.title,
    subtitle: data.subtitle,
    highestPackageLPA: parseFloat(data.highest_package_lpa),
    averagePackageLPA: parseFloat(data.average_package_lpa),
    totalOffers: data.total_offers,
    companiesVisited: data.companies_visited
  } : null;
}

export async function updatePlacementSection(item) {
  const dbItem = {};
  if (item.title !== undefined) dbItem.title = item.title;
  if (item.subtitle !== undefined) dbItem.subtitle = item.subtitle;
  if (item.highestPackageLPA !== undefined) dbItem.highest_package_lpa = item.highestPackageLPA;
  if (item.averagePackageLPA !== undefined) dbItem.average_package_lpa = item.averagePackageLPA;
  if (item.totalOffers !== undefined) dbItem.total_offers = item.totalOffers;
  if (item.companiesVisited !== undefined) dbItem.companies_visited = item.companiesVisited;
  if (useJsonFallback) {
    const d = await readJsonFile('placement-section');
    const updated = { ...d, ...item };
    await writeJsonFile('placement-section', updated);
    return updated;
  }
  const { data, error } = await supabase.from('placement_section').update(dbItem).eq('id', 1).select().single();
  if (error) throw error;
  return data ? { ...data, highestPackageLPA: data.highest_package_lpa, averagePackageLPA: data.average_package_lpa, totalOffers: data.total_offers, companiesVisited: data.companies_visited } : null;
}

// ==================== RECRUITERS ====================
export async function getRecruiters() {
  if (useJsonFallback) {
    const d = await readJsonFile('recruiters');
    return d.recruiters;
  }
  const { data, error } = await supabase.from('recruiters').select('*').order('id');
  if (error) throw error;
  return data || [];
}

export async function createRecruiter(item) {
  if (useJsonFallback) {
    const d = await readJsonFile('recruiters');
    const newItem = { id: Date.now(), ...item };
    d.recruiters.push(newItem);
    await writeJsonFile('recruiters', d);
    return newItem;
  }
  const { data, error } = await supabase.from('recruiters').insert(toSnake(item)).select().single();
  if (error) throw error;
  return data;
}

export async function updateRecruiter(id, item) {
  if (useJsonFallback) {
    const d = await readJsonFile('recruiters');
    const idx = d.recruiters.findIndex(r => r.id === parseInt(id));
    if (idx === -1) return null;
    d.recruiters[idx] = { ...d.recruiters[idx], ...item };
    await writeJsonFile('recruiters', d);
    return d.recruiters[idx];
  }
  const { data, error } = await supabase.from('recruiters').update(toSnake(item)).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteRecruiter(id) {
  if (useJsonFallback) {
    const d = await readJsonFile('recruiters');
    d.recruiters = d.recruiters.filter(r => r.id !== parseInt(id));
    await writeJsonFile('recruiters', d);
    return;
  }
  const { error } = await supabase.from('recruiters').delete().eq('id', id);
  if (error) throw error;
}

// ==================== HOME GALLERY ====================
export async function getHomeGallery() {
  if (useJsonFallback) {
    const d = await readJsonFile('home-gallery');
    return d.images;
  }
  const { data, error } = await supabase.from('home_gallery').select('*').order('order');
  if (error) throw error;
  return (data || []).map(row => ({ ...row, id: row.id, image: row.image, order: row.order }));
}

export async function createHomeGalleryItem(item) {
  if (useJsonFallback) {
    const d = await readJsonFile('home-gallery');
    const newItem = { id: Date.now(), ...item };
    d.images.push(newItem);
    await writeJsonFile('home-gallery', d);
    return newItem;
  }
  const { data, error } = await supabase.from('home_gallery').insert(toSnake(item)).select().single();
  if (error) throw error;
  return data;
}

export async function updateHomeGalleryItem(id, item) {
  if (useJsonFallback) {
    const d = await readJsonFile('home-gallery');
    const idx = d.images.findIndex(i => i.id === parseInt(id));
    if (idx === -1) return null;
    d.images[idx] = { ...d.images[idx], ...item };
    await writeJsonFile('home-gallery', d);
    return d.images[idx];
  }
  const dbItem = {};
  if (item.image !== undefined) dbItem.image = item.image;
  if (item.order !== undefined) dbItem.order = item.order;
  const { data, error } = await supabase.from('home_gallery').update(dbItem).eq('id', id).select().single();
  if (error) throw error;
  return data ? { ...data, image: data.image, order: data.order } : null;
}

// ==================== VIBE AT VIET ====================

/** Map stored order (0-based) to grid slot index. Position N is stored as order N-1. */
function vibeOrderToSlotIndex(order) {
  if (order >= 0 && order <= 10) return order;
  if (order === 11) return 9;
  if (order === 12) return 10;
  return Math.max(0, Math.min(10, order));
}

/** Remove other items at the same grid position (exact order match). */
export async function clearVibeAtVietSlot(targetOrder, exceptId = null) {
  const items = await getVibeAtViet();
  for (const item of items) {
    if (exceptId != null && String(item.id) === String(exceptId)) continue;
    if ((item.order ?? 0) === targetOrder) {
      await deleteVibeAtVietItem(item.id);
    }
  }
}

export async function getVibeAtViet() {
  if (useJsonFallback) {
    const d = await readJsonFile('vibe-at-viet');
    return d.items;
  }
  const { data, error } = await supabase.from('vibe_at_viet').select('*').order('order');
  if (error) throw error;
  return (data || []).map(row => ({
    ...row,
    id: row.id,
    image: row.image,
    video: row.video || row.video_link,
    caption: row.caption,
    order: row.order
  }));
}

export async function createVibeAtVietItem(item) {
  const dbItem = {
    image: item.image,
    video: item.video,
    video_link: item.videoLink || item.video_link,
    caption: item.caption,
    order: item.order ?? 0
  };
  if (useJsonFallback) {
    const d = await readJsonFile('vibe-at-viet');
    const newItem = { id: d.items.length ? Math.max(...d.items.map(i => i.id)) + 1 : 1, ...item };
    d.items.push(newItem);
    await writeJsonFile('vibe-at-viet', d);
    return newItem;
  }
  const { data, error } = await supabase.from('vibe_at_viet').insert(dbItem).select().single();
  if (error) throw error;
  return { ...data, video: data.video || data.video_link };
}

export async function updateVibeAtVietItem(id, item) {
  const dbItem = {};
  if (item.image !== undefined) dbItem.image = item.image;
  if (item.video !== undefined) dbItem.video = item.video;
  if (item.videoLink !== undefined) {
    dbItem.video_link = item.videoLink;
    if (item.video === undefined) dbItem.video = item.videoLink;
  }
  if (item.caption !== undefined) dbItem.caption = item.caption;
  if (item.order !== undefined) dbItem.order = item.order;
  if (useJsonFallback) {
    const d = await readJsonFile('vibe-at-viet');
    const idx = d.items.findIndex(i => i.id === parseInt(id));
    if (idx === -1) return null;
    d.items[idx] = { ...d.items[idx], ...item };
    await writeJsonFile('vibe-at-viet', d);
    return d.items[idx];
  }
  const { data, error } = await supabase.from('vibe_at_viet').update(dbItem).eq('id', id).select().single();
  if (error) throw error;
  return data ? { ...data, video: data.video || data.video_link } : null;
}

export async function deleteVibeAtVietItem(id) {
  const numericId = parseInt(id, 10);
  if (Number.isNaN(numericId)) {
    throw new Error('Invalid item id');
  }
  if (useJsonFallback) {
    const d = await readJsonFile('vibe-at-viet');
    const before = d.items.length;
    d.items = d.items.filter(i => i.id !== numericId);
    if (d.items.length === before) {
      throw new Error('Item not found');
    }
    await writeJsonFile('vibe-at-viet', d);
    return;
  }
  const { data, error } = await supabase
    .from('vibe_at_viet')
    .delete()
    .eq('id', numericId)
    .select('id');
  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error('Item not found or could not be deleted');
  }
}

// ==================== PAGES ====================
export async function getPages() {
  if (useJsonFallback) {
    const d = await readJsonFile('pages');
    return d.pages;
  }
  const { data, error } = await supabase.from('pages').select('*').order('id');
  if (error) throw error;
  return data || [];
}

export async function getPageBySlug(slug) {
  if (useJsonFallback) {
    const d = await readJsonFile('pages');
    return d.pages.find(p => p.slug === slug);
  }
  const { data, error } = await supabase.from('pages').select('*').eq('slug', slug).single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getPageById(id) {
  if (useJsonFallback) {
    const d = await readJsonFile('pages');
    return d.pages.find(p => p.id === parseInt(id));
  }
  const { data, error } = await supabase.from('pages').select('*').eq('id', id).single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createPage(item) {
  if (useJsonFallback) {
    const d = await readJsonFile('pages');
    const newItem = { id: Date.now(), ...item };
    d.pages.push(newItem);
    await writeJsonFile('pages', d);
    return newItem;
  }
  const { data, error } = await supabase.from('pages').insert(toSnake(item)).select().single();
  if (error) throw error;
  return data;
}

export async function updatePage(id, item) {
  const { id: _omitId, ...rest } = item || {};
  if (useJsonFallback) {
    const d = await readJsonFile('pages');
    const idx = d.pages.findIndex(p => p.id === parseInt(id));
    if (idx === -1) return null;
    d.pages[idx] = { ...d.pages[idx], ...rest };
    await writeJsonFile('pages', d);
    return d.pages[idx];
  }
  const { data, error } = await supabase.from('pages').update(toSnake(rest)).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function upsertPageBySlug(slug, item) {
  const existing = await getPageBySlug(slug);
  if (existing) {
    return updatePage(existing.id, item);
  }
  return createPage({ slug, ...item });
}

export async function deletePage(id) {
  if (useJsonFallback) {
    const d = await readJsonFile('pages');
    d.pages = d.pages.filter(p => p.id !== parseInt(id));
    await writeJsonFile('pages', d);
    return;
  }
  const { error } = await supabase.from('pages').delete().eq('id', id);
  if (error) throw error;
}

// ==================== DEPARTMENT PAGES ====================
export async function getDepartmentPages() {
  if (useJsonFallback) {
    const d = await readJsonFile('department-pages');
    return d.pages;
  }
  const { data, error } = await supabase.from('department_pages').select('*');
  if (error) throw error;
  const pages = {};
  (data || []).forEach(row => {
    pages[row.slug] = {
      slug: row.slug,
      sections: row.sections || {},
      curriculum: row.curriculum || { programs: [] }
    };
  });
  return pages;
}

export async function getDepartmentPageBySlug(slug) {
  if (useJsonFallback) {
    const d = await readJsonFile('department-pages');
    return d.pages?.[slug] || null;
  }
  const { data, error } = await supabase.from('department_pages').select('*').eq('slug', slug).single();
  if (error && error.code !== 'PGRST116') throw error;
  return data ? { slug: data.slug, sections: data.sections || {}, curriculum: data.curriculum || { programs: [] } } : null;
}

export async function upsertDepartmentPage(slug, item) {
  if (useJsonFallback) {
    const d = await readJsonFile('department-pages');
    if (!d.pages) d.pages = {};
    d.pages[slug] = { slug, ...item };
    await writeJsonFile('department-pages', d);
    return d.pages[slug];
  }
  const { data, error } = await supabase.from('department_pages')
    .upsert({ slug, sections: item.sections || {}, curriculum: item.curriculum || { programs: [] } }, { onConflict: 'slug' })
    .select()
    .single();
  if (error) throw error;
  return data ? { slug: data.slug, sections: data.sections, curriculum: data.curriculum } : null;
}

// ==================== ACCREDITATIONS (main page: AUTONOMOUS, NAAC, UGC, ISO, AICTE) ====================
const DEFAULT_ACCREDITATIONS = [
  { key: 'AUTONOMOUS', name: 'AUTONOMOUS', description: 'UGC Autonomous Status Confirmation', logo: '/logo-viet.png', pdfUrl: null, color: 'from-slate-800 to-blue-950', sortOrder: 1 },
  { key: 'NAAC', name: 'NAAC A Grade', description: 'National Assessment and Accreditation Council', logo: '/naac-A-logo.png', pdfUrl: null, color: 'from-green-500 to-emerald-600', sortOrder: 2 },
  { key: 'UGC', name: 'UGC Recognition', description: 'University Grants Commission Recognition', logo: '/UGC-logo.png', pdfUrl: null, color: 'from-purple-500 to-violet-600', sortOrder: 3 },
  { key: 'ISO', name: 'ISO 9001:2015', description: 'International Organization for Standardization', logo: '/iso-logo.png', pdfUrl: null, color: 'from-slate-800 to-blue-950', sortOrder: 4 },
  { key: 'AICTE', name: 'AICTE Approved', description: 'All India Council for Technical Education', logo: '/AICTE-Logo.png', pdfUrl: null, color: 'from-cyan-500 to-blue-600', sortOrder: 5 },
];

export async function getAccreditations() {
  if (useJsonFallback) {
    try {
      const d = await readJsonFile('accreditations');
      const items = Array.isArray(d.items) ? d.items : [];
      if (items.length === 0) return DEFAULT_ACCREDITATIONS.map(a => ({ key: a.key, name: a.name, description: a.description, logo: a.logo, pdf_url: a.pdfUrl, color: a.color, sort_order: a.sortOrder }));
      return items.map(a => ({ key: a.key, name: a.name, description: a.description, logo: a.logo, pdf_url: a.pdfUrl ?? a.pdf_url, color: a.color, sort_order: a.sort_order ?? a.sortOrder }));
    } catch (e) {
      return DEFAULT_ACCREDITATIONS.map(a => ({ ...a, pdf_url: a.pdfUrl }));
    }
  }
  const { data, error } = await supabase.from('accreditations').select('*').order('sort_order');
  if (error) throw error;
  return (data || []).map(row => ({
    key: row.key,
    name: row.name,
    description: row.description,
    logo: row.logo,
    pdf_url: row.pdf_url,
    color: row.color,
    sort_order: row.sort_order,
  }));
}

export async function updateAccreditation(key, item) {
  const payload = {};
  if (item.name !== undefined) payload.name = item.name;
  if (item.description !== undefined) payload.description = item.description;
  if (item.logo !== undefined) payload.logo = item.logo;
  if (item.pdf_url !== undefined) payload.pdf_url = item.pdf_url;
  if (item.color !== undefined) payload.color = item.color;
  if (item.sort_order !== undefined) payload.sort_order = item.sort_order;
  payload.updated_at = new Date().toISOString();

  if (useJsonFallback) {
    const d = await readJsonFile('accreditations');
    const items = Array.isArray(d.items) && d.items.length > 0
      ? d.items
      : DEFAULT_ACCREDITATIONS.map(a => ({ key: a.key, name: a.name, description: a.description, logo: a.logo, pdf_url: a.pdfUrl, color: a.color, sort_order: a.sortOrder }));
    const idx = items.findIndex(a => a.key === key);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...payload, key };
    d.items = items;
    await writeJsonFile('accreditations', d);
    return items[idx];
  }
  const { data, error } = await supabase.from('accreditations').update(payload).eq('key', key).select().single();
  if (error) throw error;
  return data ? { ...data, pdf_url: data.pdf_url } : null;
}

// ==================== AICTE AFFILIATION LETTERS (year-wise; one is_latest = green) ====================
export async function getAicteAffiliationLetters() {
  if (useJsonFallback) {
    try {
      const d = await readJsonFile('aicte-affiliation-letters');
      const letters = Array.isArray(d.letters) ? d.letters : [];
      // Latest first, then sort_order desc, then year desc
      return letters.sort((a, b) => {
        const la = a.is_latest ? 1 : 0;
        const lb = b.is_latest ? 1 : 0;
        if (lb !== la) return lb - la;
        const soA = Number(a.sort_order ?? 0);
        const soB = Number(b.sort_order ?? 0);
        if (soB !== soA) return soB - soA;
        return String(b.year ?? '').localeCompare(String(a.year ?? ''));
      });
    } catch (e) {
      return [];
    }
  }
  const { data, error } = await supabase
    .from('aicte_affiliation_letters')
    .select('*')
    .order('is_latest', { ascending: false })
    .order('sort_order', { ascending: false })
    .order('year', { ascending: false });
  if (error) throw error;
  return (data || []).map(row => ({
    id: row.id,
    year: row.year,
    pdf_url: row.pdf_url,
    is_latest: row.is_latest,
    sort_order: row.sort_order,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
}

export async function createAicteAffiliationLetter(item) {
  const payload = { year: item.year, pdf_url: item.pdf_url ?? null, is_latest: item.is_latest ?? false, sort_order: item.sort_order ?? 0 };
  if (useJsonFallback) {
    const d = await readJsonFile('aicte-affiliation-letters');
    const letters = Array.isArray(d.letters) ? d.letters : [];
    const newItem = { id: Date.now(), ...payload, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    letters.push(newItem);
    d.letters = letters;
    await writeJsonFile('aicte-affiliation-letters', d);
    return newItem;
  }
  const { data, error } = await supabase.from('aicte_affiliation_letters').insert(toSnake(payload)).select().single();
  if (error) throw error;
  return data ? { ...data, pdf_url: data.pdf_url, is_latest: data.is_latest } : null;
}

export async function updateAicteAffiliationLetter(id, item) {
  const payload = { updated_at: new Date().toISOString() };
  if (item.year !== undefined) payload.year = item.year;
  if (item.pdf_url !== undefined) payload.pdf_url = item.pdf_url;
  if (item.sort_order !== undefined) payload.sort_order = item.sort_order;
  if (item.is_latest === true) {
    payload.is_latest = true;
    // Unset others (so only one is latest)
    if (useJsonFallback) {
      const d = await readJsonFile('aicte-affiliation-letters');
      const letters = Array.isArray(d.letters) ? d.letters : [];
      letters.forEach(l => { l.is_latest = l.id === parseInt(id); });
      const idx = letters.findIndex(l => l.id === parseInt(id));
      if (idx !== -1) letters[idx] = { ...letters[idx], ...item, ...payload };
      d.letters = letters;
      await writeJsonFile('aicte-affiliation-letters', d);
      return letters[idx];
    }
    await supabase.from('aicte_affiliation_letters').update({ is_latest: false });
  } else if (item.is_latest !== undefined) {
    payload.is_latest = item.is_latest;
  }

  if (useJsonFallback) {
    const d = await readJsonFile('aicte-affiliation-letters');
    const letters = Array.isArray(d.letters) ? d.letters : [];
    const idx = letters.findIndex(l => l.id === parseInt(id));
    if (idx === -1) return null;
    letters[idx] = { ...letters[idx], ...item, ...payload };
    d.letters = letters;
    await writeJsonFile('aicte-affiliation-letters', d);
    return letters[idx];
  }
  const { data, error } = await supabase.from('aicte_affiliation_letters').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data ? { ...data, pdf_url: data.pdf_url, is_latest: data.is_latest } : null;
}

export async function deleteAicteAffiliationLetter(id) {
  if (useJsonFallback) {
    const d = await readJsonFile('aicte-affiliation-letters');
    d.letters = (Array.isArray(d.letters) ? d.letters : []).filter(l => l.id !== parseInt(id));
    await writeJsonFile('aicte-affiliation-letters', d);
    return;
  }
  const { error } = await supabase.from('aicte_affiliation_letters').delete().eq('id', id);
  if (error) throw error;
}

// ==================== INTRO VIDEO SETTINGS ====================
export async function getIntroVideoSettings() {
  if (useJsonFallback) {
    try {
      const d = await readJsonFile('intro-video-settings');
      return d.settings || { id: 1, video_url: null, is_enabled: false };
    } catch (e) {
      return { id: 1, video_url: null, is_enabled: false };
    }
  }
  const { data, error } = await supabase
    .from('intro_video_settings')
    .select('*')
    .eq('id', 1)
    .single();
  if (error) {
    // If table doesn't exist or no row, return default
    if (error.code === 'PGRST116') {
      return { id: 1, video_url: null, is_enabled: false };
    }
    throw error;
  }
  return data || { id: 1, video_url: null, is_enabled: false };
}

export async function updateIntroVideoSettings(item) {
  const payload = {
    updated_at: new Date().toISOString(),
  };
  if (item.video_url !== undefined) payload.video_url = item.video_url;
  if (item.is_enabled !== undefined) payload.is_enabled = item.is_enabled;

  if (useJsonFallback) {
    const d = await readJsonFile('intro-video-settings');
    d.settings = { id: 1, ...(d.settings || {}), ...payload };
    await writeJsonFile('intro-video-settings', d);
    return d.settings;
  }
  // Upsert (insert or update) since we only have one row
  const { data, error } = await supabase
    .from('intro_video_settings')
    .upsert({ id: 1, ...payload }, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ==================== EXPLORE PATH VIDEO SETTINGS ====================
export async function getExplorePathVideoSettings() {
  if (useJsonFallback) {
    try {
      const d = await readJsonFile('explore-path-video-settings');
      return d.settings || { id: 1, video_url: null };
    } catch (e) {
      return { id: 1, video_url: null };
    }
  }
  const { data, error } = await supabase
    .from('explore_path_video_settings')
    .select('*')
    .eq('id', 1)
    .single();
  if (error) {
    if (error.code === 'PGRST116' || error.code === '42P01') {
      return { id: 1, video_url: null };
    }
    throw error;
  }
  return data || { id: 1, video_url: null };
}

export async function updateExplorePathVideoSettings(item) {
  const payload = {
    updated_at: new Date().toISOString(),
  };
  if (item.video_url !== undefined) payload.video_url = item.video_url;

  if (useJsonFallback) {
    const d = await readJsonFile('explore-path-video-settings');
    d.settings = { id: 1, ...(d.settings || {}), ...payload };
    await writeJsonFile('explore-path-video-settings', d);
    return d.settings;
  }
  const { data, error } = await supabase
    .from('explore_path_video_settings')
    .upsert({ id: 1, ...payload }, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ==================== FACULTY SETTINGS ====================
const FACULTY_HERO_KEYS = ['hero_badge', 'hero_title', 'hero_subtitle', 'hero_background_image'];

const FACULTY_SETTINGS_DEFAULTS = {
  id: 1,
  sort_by: 'custom',
  hero_badge: 'Faculty',
  hero_title: 'Faculty',
  hero_subtitle: 'Our faculty across all departments and streams.',
  hero_background_image: null,
};

function coalesceSetting(dbVal, jsonVal, defaultVal) {
  if (dbVal !== undefined && dbVal !== null && dbVal !== '') return dbVal;
  if (jsonVal !== undefined && jsonVal !== null && jsonVal !== '') return jsonVal;
  return defaultVal;
}

function mergeFacultySettings(fromDb, jsonSettings) {
  const merged = {
    ...FACULTY_SETTINGS_DEFAULTS,
    ...fromDb,
    sort_by: fromDb.sort_by ?? jsonSettings.sort_by ?? FACULTY_SETTINGS_DEFAULTS.sort_by,
    hero_badge: coalesceSetting(fromDb.hero_badge, jsonSettings.hero_badge, FACULTY_SETTINGS_DEFAULTS.hero_badge),
    hero_title: coalesceSetting(fromDb.hero_title, jsonSettings.hero_title, FACULTY_SETTINGS_DEFAULTS.hero_title),
    hero_subtitle: coalesceSetting(fromDb.hero_subtitle, jsonSettings.hero_subtitle, FACULTY_SETTINGS_DEFAULTS.hero_subtitle),
    hero_background_image: coalesceSetting(
      fromDb.hero_background_image,
      jsonSettings.hero_background_image,
      FACULTY_SETTINGS_DEFAULTS.hero_background_image
    ),
  };
  return merged;
}

async function readFacultySettingsJson() {
  try {
    const d = await readJsonFile('faculty-settings');
    return d.settings || {};
  } catch {
    return {};
  }
}

async function writeFacultySettingsJson(updates) {
  const d = await readJsonFile('faculty-settings').catch(() => ({ settings: { id: 1 } }));
  d.settings = { id: 1, ...(d.settings || {}), ...updates };
  await writeJsonFile('faculty-settings', d);
  return d.settings;
}

async function syncJsonHeroToDbIfNeeded(fromDb, jsonSettings) {
  if (!fromDb || fromDb.hero_badge === undefined) return;
  const syncPayload = { updated_at: new Date().toISOString() };
  for (const key of FACULTY_HERO_KEYS) {
    const dbVal = fromDb[key];
    const jsonVal = jsonSettings[key];
    if ((dbVal === undefined || dbVal === null || dbVal === '') && jsonVal) {
      syncPayload[key] = jsonVal;
    }
  }
  if (Object.keys(syncPayload).length <= 1) return;
  await supabase.from('faculty_settings').update(syncPayload).eq('id', 1);
}

export async function getFacultySettings() {
  const jsonSettings = await readFacultySettingsJson();
  if (useJsonFallback) {
    return { ...FACULTY_SETTINGS_DEFAULTS, ...jsonSettings };
  }
  try {
    const { data, error } = await supabase
      .from('faculty_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (error) {
      if (error.code === 'PGRST116' || error.code === '42P01') {
        return { ...FACULTY_SETTINGS_DEFAULTS, ...jsonSettings };
      }
      throw error;
    }
    const fromDb = data || {};
    await syncJsonHeroToDbIfNeeded(fromDb, jsonSettings).catch(() => {});
    return mergeFacultySettings(fromDb, jsonSettings);
  } catch (e) {
    return { ...FACULTY_SETTINGS_DEFAULTS, ...jsonSettings };
  }
}

export async function updateFacultySettings(item) {
  const updatedAt = new Date().toISOString();
  const heroUpdates = {};
  for (const key of FACULTY_HERO_KEYS) {
    if (item[key] !== undefined) heroUpdates[key] = item[key];
  }

  if (useJsonFallback) {
    const settings = await writeFacultySettingsJson({
      updated_at: updatedAt,
      ...(item.sort_by !== undefined ? { sort_by: item.sort_by } : {}),
      ...heroUpdates,
    });
    return settings;
  }

  const dbPayload = { id: 1, updated_at: updatedAt };
  if (item.sort_by !== undefined) dbPayload.sort_by = item.sort_by;
  Object.assign(dbPayload, heroUpdates);

  let { data, error } = await supabase
    .from('faculty_settings')
    .upsert(dbPayload, { onConflict: 'id' })
    .select()
    .single();

  if (error?.code === 'PGRST204') {
    if (Object.keys(heroUpdates).length > 0) {
      await writeFacultySettingsJson(heroUpdates);
    }
    const sortPayload = { id: 1, updated_at: updatedAt };
    if (item.sort_by !== undefined) sortPayload.sort_by = item.sort_by;
    ({ data, error } = await supabase
      .from('faculty_settings')
      .upsert(sortPayload, { onConflict: 'id' })
      .select()
      .single());
  }
  if (error) throw error;

  const jsonSettings = await readFacultySettingsJson();
  return mergeFacultySettings(data || {}, jsonSettings);
}

// ==================== VISITOR COUNT ====================
function getTodayDateKey() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
}

function normalizeVisitorStats(raw = {}) {
  const today = getTodayDateKey();
  const count = typeof raw.count === 'number' ? raw.count : 0;
  const todayCount =
    raw.todayDate === today && typeof raw.todayCount === 'number' ? raw.todayCount : 0;
  return { count, todayCount, todayDate: raw.todayDate === today ? raw.todayDate : today };
}

export async function getVisitorCount() {
  if (useJsonFallback) {
    try {
      const d = await readJsonFile('visitor-count');
      const stats = normalizeVisitorStats(d);
      return { count: stats.count, todayCount: stats.todayCount };
    } catch (e) {
      return { count: 0, todayCount: 0 };
    }
  }
  try {
    const { data, error } = await supabase
      .from('visitor_count')
      .select('count, today_count, today_date')
      .eq('id', 1)
      .single();
    if (error) {
      if (error.code === 'PGRST116' || error.code === '42P01') return { count: 0, todayCount: 0 };
      throw error;
    }
    const today = getTodayDateKey();
    const count = data ? Number(data.count) || 0 : 0;
    const todayCount =
      data?.today_date === today && typeof data.today_count === 'number'
        ? Number(data.today_count) || 0
        : 0;
    return { count, todayCount };
  } catch (e) {
    return { count: 0, todayCount: 0 };
  }
}

export async function incrementVisitorCount() {
  if (useJsonFallback) {
    try {
      const d = await readJsonFile('visitor-count');
      const today = getTodayDateKey();
      if (d.todayDate !== today) {
        d.todayDate = today;
        d.todayCount = 0;
      }
      d.count = (typeof d.count === 'number' ? d.count : 0) + 1;
      d.todayCount = (typeof d.todayCount === 'number' ? d.todayCount : 0) + 1;
      await writeJsonFile('visitor-count', d);
      return { count: d.count, todayCount: d.todayCount };
    } catch (e) {
      return { count: 0, todayCount: 0 };
    }
  }
  try {
    const today = getTodayDateKey();
    const { data: current, error: fetchErr } = await supabase
      .from('visitor_count')
      .select('count, today_count, today_date')
      .eq('id', 1)
      .single();
    if (fetchErr || !current) return { count: 0, todayCount: 0 };
    const newCount = Number(current.count) + 1;
    const newTodayCount =
      current.today_date === today ? Number(current.today_count || 0) + 1 : 1;
    const { data, error } = await supabase
      .from('visitor_count')
      .update({
        count: newCount,
        today_count: newTodayCount,
        today_date: today,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)
      .select()
      .single();
    if (error) throw error;
    return {
      count: data ? Number(data.count) : newCount,
      todayCount: data ? Number(data.today_count) : newTodayCount,
    };
  } catch (e) {
    return { count: 0, todayCount: 0 };
  }
}

// ==================== ADMISSION POPUP SETTINGS ====================
function isMissingTableError(error) {
  if (!error) return false;
  const msg = String(error.message || '');
  return (
    error.code === 'PGRST116' ||
    error.code === '42P01' ||
    error.code === 'PGRST205' ||
    msg.includes('Could not find the table')
  );
}

const DEFAULT_ADMISSION_POPUP_SETTINGS = {
  id: 1,
  is_enabled: true,
  title: 'Admissions Open 2025–26',
  subtitle: 'Share your details and our admissions team will contact you shortly.',
  delay_seconds: 2,
  images: [],
  spreadsheet_url: null,
  sheets_webhook_url: null,
};

export async function getAdmissionPopupSettings() {
  if (useJsonFallback) {
    try {
      const d = await readJsonFile('admission-popup-settings');
      return { ...DEFAULT_ADMISSION_POPUP_SETTINGS, ...(d.settings || {}) };
    } catch (e) {
      return { ...DEFAULT_ADMISSION_POPUP_SETTINGS };
    }
  }
  const { data, error } = await supabase
    .from('admission_popup_settings')
    .select('*')
    .eq('id', 1)
    .single();
  if (error) {
    if (isMissingTableError(error)) {
      return { ...DEFAULT_ADMISSION_POPUP_SETTINGS };
    }
    throw error;
  }
  return data || { ...DEFAULT_ADMISSION_POPUP_SETTINGS };
}

export async function updateAdmissionPopupSettings(item) {
  const payload = {
    updated_at: new Date().toISOString(),
  };
  if (item.is_enabled !== undefined) payload.is_enabled = Boolean(item.is_enabled);
  if (item.title !== undefined) payload.title = String(item.title || '').trim();
  if (item.subtitle !== undefined) payload.subtitle = String(item.subtitle || '').trim();
  if (item.delay_seconds !== undefined) {
    const delay = parseInt(item.delay_seconds, 10);
    payload.delay_seconds = Number.isFinite(delay) ? Math.min(Math.max(delay, 0), 30) : 2;
  }
  if (item.spreadsheet_url !== undefined) {
    payload.spreadsheet_url = item.spreadsheet_url ? String(item.spreadsheet_url).trim() : null;
  }
  if (item.sheets_webhook_url !== undefined) {
    payload.sheets_webhook_url = item.sheets_webhook_url ? String(item.sheets_webhook_url).trim() : null;
  }
  if (item.images !== undefined) {
    payload.images = Array.isArray(item.images)
      ? item.images.map((url) => String(url || '').trim()).filter(Boolean)
      : [];
  }

  if (useJsonFallback) {
    const d = await readJsonFile('admission-popup-settings');
    d.settings = { id: 1, ...DEFAULT_ADMISSION_POPUP_SETTINGS, ...(d.settings || {}), ...payload };
    await writeJsonFile('admission-popup-settings', d);
    return d.settings;
  }
  const { data, error } = await supabase
    .from('admission_popup_settings')
    .upsert({ id: 1, ...payload }, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ==================== ADMISSION LEADS ====================
export async function getAdmissionLeads() {
  if (useJsonFallback) {
    const d = await readJsonFile('admission-leads');
    const leads = Array.isArray(d.leads) ? d.leads : [];
    return leads.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
  const { data, error } = await supabase
    .from('admission_leads')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    if (isMissingTableError(error)) return [];
    throw error;
  }
  return data || [];
}

export async function createAdmissionLead(item) {
  const payload = {
    name: String(item.name || '').trim(),
    mobile: String(item.mobile || '').trim(),
    email: item.email ? String(item.email).trim() : null,
    program: item.program ? String(item.program).trim() : null,
    qualification: item.qualification ? String(item.qualification).trim() : null,
    city: item.city ? String(item.city).trim() : null,
    district: item.district ? String(item.district).trim() : null,
    message: item.message ? String(item.message).trim() : null,
    source: item.source ? String(item.source).trim() : 'popup',
    created_at: new Date().toISOString(),
  };

  if (useJsonFallback) {
    const d = await readJsonFile('admission-leads');
    const leads = Array.isArray(d.leads) ? d.leads : [];
    const id = leads.length > 0 ? Math.max(...leads.map((l) => l.id)) + 1 : 1;
    const lead = { id, ...payload };
    leads.unshift(lead);
    await writeJsonFile('admission-leads', { leads });
    return lead;
  }
  const { data, error } = await supabase
    .from('admission_leads')
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteAdmissionLead(id) {
  if (useJsonFallback) {
    const d = await readJsonFile('admission-leads');
    d.leads = (Array.isArray(d.leads) ? d.leads : []).filter((l) => l.id !== parseInt(id));
    await writeJsonFile('admission-leads', d);
    return;
  }
  const { error } = await supabase.from('admission_leads').delete().eq('id', id);
  if (error) throw error;
}
