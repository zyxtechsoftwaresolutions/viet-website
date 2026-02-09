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
    const d = await readJsonFile('users');
    return d.users;
  }
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data || [];
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
  const { data, error } = await supabase.from('users').insert(user).select().single();
  if (error) throw error;
  return data;
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
  const { data, error } = await supabase.from('events').insert(item).select().single();
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
    return d.videos;
  }
  const { data, error } = await supabase.from('hero_videos').select('*').order('order');
  if (error) throw error;
  return (data || []).map(row => ({
    ...row,
    id: row.id,
    src: row.src,
    poster: row.poster,
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
    src: item.src,
    poster: item.poster,
    badge: item.badge,
    title: item.title,
    subtitle: item.subtitle,
    button_text: item.buttonText ?? item.button_text ?? 'Apply Now',
    button_link: item.buttonLink ?? item.button_link,
    order: item.order ?? 0
  };
  if (useJsonFallback) {
    const d = await readJsonFile('hero-videos');
    const newItem = { id: Date.now(), ...item, src: dbItem.src, poster: dbItem.poster };
    d.videos.push(newItem);
    await writeJsonFile('hero-videos', d);
    return newItem;
  }
  const { data, error } = await supabase.from('hero_videos').insert(dbItem).select().single();
  if (error) throw error;
  return { ...data, buttonText: data.button_text, buttonLink: data.button_link };
}

export async function updateHeroVideo(id, item) {
  const dbItem = {};
  if (item.src !== undefined) dbItem.src = item.src;
  if (item.poster !== undefined) dbItem.poster = item.poster;
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
  return data ? { ...data, buttonText: data.button_text, buttonLink: data.button_link } : null;
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
  const { data, error } = await supabase.from('departments').update(item).eq('id', id).select().single();
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
    return d.faculty;
  }
  const { data, error } = await supabase.from('faculty').select('*').order('id');
  if (error) throw error;
  return data || [];
}

export async function createFaculty(item) {
  if (useJsonFallback) {
    const d = await readJsonFile('faculty');
    const newItem = { id: Date.now(), ...item };
    d.faculty.push(newItem);
    await writeJsonFile('faculty', d);
    return newItem;
  }
  const { data, error } = await supabase.from('faculty').insert(toSnake(item)).select().single();
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

// ==================== HODs ====================
export async function getHods() {
  if (useJsonFallback) {
    const d = await readJsonFile('hods');
    return d.hods;
  }
  const { data, error } = await supabase.from('hods').select('*').order('id');
  if (error) throw error;
  return data || [];
}

export async function createHod(item) {
  if (useJsonFallback) {
    const d = await readJsonFile('hods');
    const newItem = { id: Date.now(), ...item };
    d.hods.push(newItem);
    await writeJsonFile('hods', d);
    return newItem;
  }
  const { data, error } = await supabase.from('hods').insert(toSnake(item)).select().single();
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
  const { data, error } = await supabase.from('hods').update(item).eq('id', id).select().single();
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

// ==================== GALLERY ====================
export async function getGallery() {
  if (useJsonFallback) {
    const d = await readJsonFile('gallery');
    return d.images;
  }
  const { data, error } = await supabase.from('gallery').select('*').order('id');
  if (error) throw error;
  return (data || []).map(row => ({ ...row, id: row.id, src: row.src, alt: row.alt, department: row.department }));
}

export async function createGalleryItem(item) {
  const dbItem = { src: item.src, alt: item.alt, department: item.department };
  if (useJsonFallback) {
    const d = await readJsonFile('gallery');
    const newItem = { id: Date.now(), ...item };
    d.images.push(newItem);
    await writeJsonFile('gallery', d);
    return newItem;
  }
  const { data, error } = await supabase.from('gallery').insert(dbItem).select().single();
  if (error) throw error;
  return data;
}

export async function deleteGalleryItem(id) {
  if (useJsonFallback) {
    const d = await readJsonFile('gallery');
    d.images = d.images.filter(i => i.id !== parseInt(id));
    await writeJsonFile('gallery', d);
    return;
  }
  const { error } = await supabase.from('gallery').delete().eq('id', id);
  if (error) throw error;
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
  if (item.videoLink !== undefined) dbItem.video_link = item.videoLink;
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
  if (useJsonFallback) {
    const d = await readJsonFile('vibe-at-viet');
    d.items = d.items.filter(i => i.id !== parseInt(id));
    await writeJsonFile('vibe-at-viet', d);
    return;
  }
  const { error } = await supabase.from('vibe_at_viet').delete().eq('id', id);
  if (error) throw error;
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
  if (useJsonFallback) {
    const d = await readJsonFile('pages');
    const idx = d.pages.findIndex(p => p.id === parseInt(id));
    if (idx === -1) return null;
    d.pages[idx] = { ...d.pages[idx], ...item };
    await writeJsonFile('pages', d);
    return d.pages[idx];
  }
  const { data, error } = await supabase.from('pages').update(toSnake(item)).eq('id', id).select().single();
  if (error) throw error;
  return data;
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
