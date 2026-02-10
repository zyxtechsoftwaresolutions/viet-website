// Use relative URLs in dev (Vite proxy handles it) or use env var if set for production/network access
// Relative URLs work with Vite proxy, so no need to change when network changes
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('admin_token');
};

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
  verify: async () => {
    return apiCall('/auth/verify');
  },
};

// Announcements API
export const announcementsAPI = {
  getAll: () => apiCall('/announcements'),
  create: (data: any) => apiCall('/announcements', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiCall(`/announcements/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiCall(`/announcements/${id}`, {
    method: 'DELETE',
  }),
};

// News API
export const newsAPI = {
  getAll: () => apiCall('/news'),
  create: (data: any) => apiCall('/news', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiCall(`/news/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiCall(`/news/${id}`, {
    method: 'DELETE',
  }),
};

// Ticker API
export const tickerAPI = {
  getAll: () => apiCall('/ticker'),
  create: (data: { text: string; isActive?: boolean }) => apiCall('/ticker', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: { text?: string; isActive?: boolean }) => apiCall(`/ticker/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiCall(`/ticker/${id}`, {
    method: 'DELETE',
  }),
};

// Events API (image = Supabase Storage URL; upload from admin first)
export const eventsAPI = {
  getAll: () => apiCall('/events'),
  create: (data: { title: string; description: string; date: string; time: string; location?: string; link?: string; image?: string | null }) =>
    apiCall('/events', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: { title?: string; description?: string; date?: string; time?: string; location?: string; link?: string; image?: string | null }) =>
    apiCall(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/events/${id}`, { method: 'DELETE' }),
};

// Carousel API (src = Supabase Storage URL)
export const carouselAPI = {
  getAll: () => apiCall('/carousel'),
  create: (data: { src: string; title?: string; subtitle?: string }) =>
    apiCall('/carousel', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: { src?: string; title?: string; subtitle?: string }) =>
    apiCall(`/carousel/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/carousel/${id}`, { method: 'DELETE' }),
};

// Hero Videos API (backend only stores video_url and poster URL; admin uploads to Supabase Storage first)
export const heroVideosAPI = {
  getAll: () => apiCall('/hero-videos'),
  create: (data: { src: string; poster?: string | null; badge?: string; title: string; subtitle: string; buttonText?: string; buttonLink?: string }) => {
    return apiCall('/hero-videos', {
      method: 'POST',
      body: JSON.stringify({
        src: data.src,
        poster: data.poster ?? null,
        badge: data.badge ?? '',
        title: data.title,
        subtitle: data.subtitle,
        buttonText: data.buttonText ?? 'Apply Now',
        buttonLink: data.buttonLink ?? '',
      }),
    });
  },
  update: (id: number, data: { src?: string; poster?: string | null; badge?: string; title?: string; subtitle?: string; buttonText?: string; buttonLink?: string }) => {
    return apiCall(`/hero-videos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  delete: (id: number) => apiCall(`/hero-videos/${id}`, {
    method: 'DELETE',
  }),
};

// Departments API (image = Supabase Storage URL)
export const departmentsAPI = {
  getAll: () => apiCall('/departments'),
  create: (data: { name: string; stream: string; level: string; image?: string | null }) =>
    apiCall('/departments', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: { name?: string; stream?: string; level?: string; image?: string | null }) =>
    apiCall(`/departments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/departments/${id}`, { method: 'DELETE' }),
};

// Department Pages API (editable sections + curriculum with regulations)
export const departmentPagesAPI = {
  getAll: () => apiCall('/department-pages'),
  getBySlug: (slug: string) => apiCall(`/department-pages/${slug}`),
  update: (slug: string, data: { sections?: Record<string, unknown>; curriculum?: { programs: Array<{ name: string; regulations: Array<{ name: string; fileUrl: string; fileName?: string }> }> } }) =>
    apiCall(`/department-pages/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  uploadSyllabus: (slug: string, program: string, regulation: string, fileUrl: string, fileName?: string) =>
    apiCall(`/department-pages/${slug}/curriculum`, {
      method: 'POST',
      body: JSON.stringify({ program, regulation, fileUrl, fileName: fileName || 'syllabus.pdf' }),
    }),
  deleteRegulation: (slug: string, program: string, regulation: string) => {
    const encodedProgram = encodeURIComponent(program);
    const encodedRegulation = encodeURIComponent(regulation);
    return apiCall(`/department-pages/${slug}/curriculum/${encodedProgram}/${encodedRegulation}`, { method: 'DELETE' });
  },
  uploadHeroImage: (slug: string, imageUrl: string) =>
    apiCall(`/department-pages/${slug}/hero-image`, { method: 'POST', body: JSON.stringify({ image: imageUrl }) }),
  uploadAsset: (slug: string, url: string, filename?: string) =>
    apiCall(`/department-pages/${slug}/asset`, { method: 'POST', body: JSON.stringify({ url, filename: filename || 'asset' }) }),
};

// Faculty API (image, resume = Supabase Storage URLs)
export const facultyAPI = {
  getAll: () => apiCall('/faculty'),
  create: (data: { name?: string; designation?: string; qualification?: string; email?: string; phone?: string; experience?: string; department?: string; image?: string | null; resume?: string | null; sortOrder?: number }) =>
    apiCall('/faculty', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: { name?: string; designation?: string; qualification?: string; email?: string; phone?: string; experience?: string; department?: string; image?: string | null; resume?: string | null; sortOrder?: number }) =>
    apiCall(`/faculty/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/faculty/${id}`, { method: 'DELETE' }),
  reorder: (orderUpdates: Array<{ id: number; sortOrder: number }>) =>
    apiCall('/faculty/reorder', { method: 'POST', body: JSON.stringify({ orderUpdates: orderUpdates.map(u => ({ id: u.id, sort_order: u.sortOrder })) }) }),
};

// HOD API (image, resume = Supabase Storage URLs)
export const hodsAPI = {
  getAll: () => apiCall('/hods'),
  create: (data: { name?: string; designation?: string; qualification?: string; email?: string; phone?: string; experience?: string; department?: string; image?: string | null; resume?: string | null; sortOrder?: number }) =>
    apiCall('/hods', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: { name?: string; designation?: string; qualification?: string; email?: string; phone?: string; experience?: string; department?: string; image?: string | null; resume?: string | null; sortOrder?: number }) =>
    apiCall(`/hods/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/hods/${id}`, { method: 'DELETE' }),
  reorder: (orderUpdates: Array<{ id: number; sortOrder: number }>) =>
    apiCall('/hods/reorder', { method: 'POST', body: JSON.stringify({ orderUpdates: orderUpdates.map(u => ({ id: u.id, sort_order: u.sortOrder })) }) }),
};

// Intro Video Settings API
export const introVideoSettingsAPI = {
  get: () => apiCall('/intro-video-settings'),
  update: (data: { video_url?: string | null; is_enabled?: boolean }) =>
    apiCall('/intro-video-settings', { method: 'PUT', body: JSON.stringify(data) }),
  delete: () => apiCall('/intro-video-settings', { method: 'DELETE' }),
};

// Gallery API (src = Supabase Storage URL)
export const galleryAPI = {
  getAll: () => apiCall('/gallery'),
  create: (data: { src: string; alt?: string; department?: string }) =>
    apiCall('/gallery', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/gallery/${id}`, { method: 'DELETE' }),
};

// Home Gallery API (image = Supabase Storage URL)
export const homeGalleryAPI = {
  getAll: () => apiCall('/home-gallery'),
  update: (id: number, data: { image: string }) =>
    apiCall(`/home-gallery/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// Vibe@Viet API
export interface VibeAtVietItem {
  id: number;
  image: string;
  video?: string | null;
  caption: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Vibe@Viet: image/video = Supabase Storage URLs or imageLink/videoLink for external URLs
export const vibeAtVietAPI = {
  getAll: (): Promise<VibeAtVietItem[]> => apiCall('/vibe-at-viet'),
  create: (data: { image?: string | null; imageLink?: string | null; video?: string | null; videoLink?: string | null; caption: string; position?: number }) =>
    apiCall('/vibe-at-viet', { method: 'POST', body: JSON.stringify({ ...data, position: data.position ?? 1 }) }),
  update: (id: number, data: { image?: string | null; imageLink?: string | null; video?: string | null; videoLink?: string | null; caption?: string; order?: number }) =>
    apiCall(`/vibe-at-viet/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/vibe-at-viet/${id}`, { method: 'DELETE' }),
};

// Placement Section (home page) – title, subtitle, stats. Logos = Recruiters.
export const placementSectionAPI = {
  get: () => apiCall('/placement-section'),
  update: (data: {
    title?: string;
    subtitle?: string;
    highestPackageLPA?: number;
    averagePackageLPA?: number;
    totalOffers?: number;
    companiesVisited?: number;
  }) =>
    apiCall('/placement-section', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Placement carousel (src = Supabase Storage URL)
export const placementCarouselAPI = {
  getAll: () => apiCall('/placement-carousel'),
  create: (data: { src: string; title?: string; subtitle?: string }) =>
    apiCall('/placement-carousel', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: { src?: string; title?: string; subtitle?: string }) =>
    apiCall(`/placement-carousel/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/placement-carousel/${id}`, { method: 'DELETE' }),
};

// Recruiters API (logo = Supabase Storage URL)
export const recruitersAPI = {
  getAll: () => apiCall('/recruiters'),
  create: (data: { logo: string; name: string; description?: string }) =>
    apiCall('/recruiters', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: { logo?: string; name?: string; description?: string }) =>
    apiCall(`/recruiters/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/recruiters/${id}`, { method: 'DELETE' }),
};

// Transport Routes API (image = Supabase Storage URL)
export const transportRoutesAPI = {
  getAll: () => apiCall('/transport-routes'),
  create: (data: { name: string; from: string; to: string; stops?: number; time?: string; frequency?: string; busNo: string; driverName: string; driverContactNo: string; seatingCapacity: number; image?: string | null }) =>
    apiCall('/transport-routes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: { name?: string; from?: string; to?: string; stops?: number; time?: string; frequency?: string; busNo?: string; driverName?: string; driverContactNo?: string; seatingCapacity?: number; image?: string | null }) =>
    apiCall(`/transport-routes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/transport-routes/${id}`, { method: 'DELETE' }),
};

// Pages API
export const pagesAPI = {
  getAll: () => apiCall('/pages'),
  getBySlug: (slug: string) => apiCall(`/pages/slug/${slug}`),
  getById: (id: number) => apiCall(`/pages/${id}`),
  create: (data: any) => apiCall('/pages', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: { slug?: string; title?: string; route?: string; category?: string; content?: Record<string, unknown> }) =>
    apiCall(`/pages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/pages/${id}`, {
    method: 'DELETE',
  }),
};

// Accreditations API (main page: AUTONOMOUS, NAAC, UGC, ISO, AICTE – admin uploads PDF per type)
export interface AccreditationItem {
  key: string;
  name: string;
  description: string;
  logo: string;
  pdf_url: string | null;
  color: string;
  sort_order: number;
}
export const accreditationsAPI = {
  getAll: (): Promise<AccreditationItem[]> => apiCall('/accreditations'),
  update: (key: string, data: { name?: string; description?: string; logo?: string; pdf_url?: string | null; color?: string; sort_order?: number }) =>
    apiCall(`/accreditations/${encodeURIComponent(key)}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// AICTE Affiliation Letters API (year-wise; one is_latest = green on public page)
export interface AicteLetter {
  id: number;
  year: string;
  pdf_url: string | null;
  is_latest: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}
export const aicteAffiliationLettersAPI = {
  getAll: (): Promise<AicteLetter[]> => apiCall('/aicte-affiliation-letters'),
  create: (data: { year: string; pdf_url?: string | null; is_latest?: boolean; sort_order?: number }) =>
    apiCall('/aicte-affiliation-letters', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: { year?: string; pdf_url?: string | null; is_latest?: boolean; sort_order?: number }) =>
    apiCall(`/aicte-affiliation-letters/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/aicte-affiliation-letters/${id}`, { method: 'DELETE' }),
};

