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

// Helper function for file uploads
async function uploadFile(endpoint: string, formData: FormData) {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(error.error || 'Upload failed');
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

// Events API (supports optional image upload via FormData)
export const eventsAPI = {
  getAll: () => apiCall('/events'),
  create: (data: { title: string; description: string; date: string; time: string; location?: string; link?: string; image?: string }, imageFile?: File | null) => {
    if (imageFile) {
      const formData = new FormData();
      formData.append('uploadType', 'event');
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('date', data.date);
      formData.append('time', data.time);
      formData.append('location', data.location ?? '');
      formData.append('link', data.link ?? '');
      formData.append('image', imageFile);
      return uploadFile('/events', formData);
    }
    return apiCall('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: (id: number, data: { title?: string; description?: string; date?: string; time?: string; location?: string; link?: string; image?: string }, imageFile?: File | null) => {
    if (imageFile) {
      const formData = new FormData();
      formData.append('uploadType', 'event');
      formData.append('title', data.title ?? '');
      formData.append('description', data.description ?? '');
      formData.append('date', data.date ?? '');
      formData.append('time', data.time ?? '');
      formData.append('location', data.location ?? '');
      formData.append('link', data.link ?? '');
      formData.append('image', imageFile);
      const token = getAuthToken();
      return fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      }).then((res) => {
        if (!res.ok) return res.json().then((err) => { throw new Error(err.error || 'Update failed'); });
        return res.json();
      });
    }
    return apiCall(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  delete: (id: number) => apiCall(`/events/${id}`, {
    method: 'DELETE',
  }),
};

// Carousel API
export const carouselAPI = {
  getAll: () => apiCall('/carousel'),
  create: (file: File, title: string, subtitle: string) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('uploadType', 'carousel');
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    return uploadFile('/carousel', formData);
  },
  update: async (id: number, file: File | null, title: string, subtitle: string) => {
    const formData = new FormData();
    if (file) {
      formData.append('image', file);
    }
    formData.append('uploadType', 'carousel');
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/carousel/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Update failed' }));
      throw new Error(error.error || 'Update failed');
    }
    return response.json();
  },
  delete: (id: number) => apiCall(`/carousel/${id}`, {
    method: 'DELETE',
  }),
};

// Hero Videos API
export const heroVideosAPI = {
  getAll: () => apiCall('/hero-videos'),
  create: (videoFile: File, posterFile: File | null, data: { badge?: string; title: string; subtitle: string; buttonText?: string; buttonLink?: string }) => {
    const formData = new FormData();
    formData.append('video', videoFile);
    if (posterFile) {
      formData.append('poster', posterFile);
    }
    formData.append('badge', data.badge || '');
    formData.append('title', data.title);
    formData.append('subtitle', data.subtitle);
    formData.append('buttonText', data.buttonText || 'Apply Now');
    formData.append('buttonLink', data.buttonLink || '');
    const token = getAuthToken();
    return fetch(`${API_BASE_URL}/hero-videos`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(err.error || 'Upload failed');
      }
      return res.json();
    });
  },
  update: async (id: number, videoFile: File | null, posterFile: File | null, data: { badge?: string; title?: string; subtitle?: string; buttonText?: string; buttonLink?: string }) => {
    const formData = new FormData();
    if (videoFile) {
      formData.append('video', videoFile);
    }
    if (posterFile) {
      formData.append('poster', posterFile);
    }
    if (data.badge !== undefined) formData.append('badge', data.badge);
    if (data.title !== undefined) formData.append('title', data.title);
    if (data.subtitle !== undefined) formData.append('subtitle', data.subtitle);
    if (data.buttonText !== undefined) formData.append('buttonText', data.buttonText);
    if (data.buttonLink !== undefined) formData.append('buttonLink', data.buttonLink);
    const token = getAuthToken();
    return fetch(`${API_BASE_URL}/hero-videos/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Update failed' }));
        throw new Error(err.error || 'Update failed');
      }
      return res.json();
    });
  },
  delete: (id: number) => apiCall(`/hero-videos/${id}`, {
    method: 'DELETE',
  }),
};

// Departments API
export const departmentsAPI = {
  getAll: () => apiCall('/departments'),
  create: (data: any, file: File | null) => {
    const formData = new FormData();
    if (file) {
      formData.append('image', file);
    }
    formData.append('uploadType', 'department');
    formData.append('name', data.name);
    formData.append('stream', data.stream);
    formData.append('level', data.level);
    return uploadFile('/departments', formData);
  },
  update: async (id: number, data: any, file: File | null) => {
    const formData = new FormData();
    if (file) {
      formData.append('image', file);
    }
    formData.append('uploadType', 'department');
    formData.append('name', data.name);
    formData.append('stream', data.stream);
    formData.append('level', data.level);
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Update failed' }));
      throw new Error(error.error || 'Update failed');
    }
    return response.json();
  },
  delete: (id: number) => apiCall(`/departments/${id}`, {
    method: 'DELETE',
  }),
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
  uploadSyllabus: (slug: string, program: string, regulation: string, file: File) => {
    const formData = new FormData();
    formData.append('program', program);
    formData.append('regulation', regulation);
    formData.append('syllabus', file);
    const token = getAuthToken();
    return fetch(`${API_BASE_URL}/department-pages/${slug}/curriculum`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(err.error || 'Upload failed');
      }
      return res.json();
    });
  },
  deleteRegulation: (slug: string, program: string, regulation: string) => {
    const encodedProgram = encodeURIComponent(program);
    const encodedRegulation = encodeURIComponent(regulation);
    return apiCall(`/department-pages/${slug}/curriculum/${encodedProgram}/${encodedRegulation}`, {
      method: 'DELETE',
    });
  },
  uploadHeroImage: (slug: string, file: File) => {
    const formData = new FormData();
    formData.append('uploadType', 'department-hero');
    formData.append('image', file);
    const token = getAuthToken();
    return fetch(`${API_BASE_URL}/department-pages/${slug}/hero-image`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(err.error || 'Upload failed');
      }
      return res.json();
    });
  },
  uploadAsset: (slug: string, file: File) => {
    const formData = new FormData();
    formData.append('uploadType', 'department-assets');
    formData.append('file', file);
    const token = getAuthToken();
    return fetch(`${API_BASE_URL}/department-pages/${slug}/asset`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(err.error || 'Upload failed');
      }
      return res.json();
    });
  },
};

// Faculty API
export const facultyAPI = {
  getAll: () => apiCall('/faculty'),
  create: (data: any, imageFile: File | null, resumeFile: File | null) => {
    const formData = new FormData();
    if (imageFile) {
      formData.append('image', imageFile);
    }
    if (resumeFile) {
      formData.append('resume', resumeFile);
    }
    formData.append('uploadType', 'faculty');
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return uploadFile('/faculty', formData);
  },
  update: async (id: number, data: any, imageFile: File | null, resumeFile: File | null) => {
    const formData = new FormData();
    if (imageFile) {
      formData.append('image', imageFile);
    }
    if (resumeFile) {
      formData.append('resume', resumeFile);
    }
    formData.append('uploadType', 'faculty');
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/faculty/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Update failed' }));
      throw new Error(error.error || 'Update failed');
    }
    return response.json();
  },
  delete: (id: number) => apiCall(`/faculty/${id}`, {
    method: 'DELETE',
  }),
};

// HOD API
export const hodsAPI = {
  getAll: () => apiCall('/hods'),
  create: (data: any, imageFile: File | null, resumeFile: File | null) => {
    const formData = new FormData();
    if (imageFile) {
      formData.append('image', imageFile);
    }
    if (resumeFile) {
      formData.append('resume', resumeFile);
    }
    formData.append('uploadType', 'hods');
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return uploadFile('/hods', formData);
  },
  update: async (id: number, data: any, imageFile: File | null, resumeFile: File | null) => {
    const formData = new FormData();
    if (imageFile) {
      formData.append('image', imageFile);
    }
    if (resumeFile) {
      formData.append('resume', resumeFile);
    }
    formData.append('uploadType', 'hods');
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/hods/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Update failed' }));
      throw new Error(error.error || 'Update failed');
    }
    return response.json();
  },
  delete: (id: number) => apiCall(`/hods/${id}`, {
    method: 'DELETE',
  }),
};

// Gallery API
export const galleryAPI = {
  getAll: () => apiCall('/gallery'),
  create: (file: File, alt: string, department: string) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('uploadType', 'gallery');
    formData.append('alt', alt);
    formData.append('department', department);
    return uploadFile('/gallery', formData);
  },
  delete: (id: number) => apiCall(`/gallery/${id}`, {
    method: 'DELETE',
  }),
};

// Home Gallery API
export const homeGalleryAPI = {
  getAll: () => apiCall('/home-gallery'),
  update: async (id: number, file: File | null) => {
    const formData = new FormData();
    if (file) {
      formData.append('image', file);
      formData.append('uploadType', 'home-gallery');
    }
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/home-gallery/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Update failed' }));
      throw new Error(error.error || 'Update failed');
    }
    return response.json();
  },
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

export const vibeAtVietAPI = {
  getAll: (): Promise<VibeAtVietItem[]> => apiCall('/vibe-at-viet'),
  create: async (imageFile: File, videoFile: File | null, caption: string, position: number = 1, videoLink?: string) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('uploadType', 'vibe-at-viet');
    formData.append('caption', caption);
    formData.append('position', String(Math.max(1, Math.min(12, position))));
    if (videoFile) {
      formData.append('video', videoFile);
    } else if (videoLink && videoLink.trim()) {
      formData.append('videoLink', videoLink.trim());
    }
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/vibe-at-viet`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Create failed' }));
      throw new Error(error.error || 'Create failed');
    }
    return response.json();
  },
  update: async (id: number, payload: { imageFile?: File; videoFile?: File; videoLink?: string | null; caption?: string; order?: number }) => {
    const formData = new FormData();
    formData.append('uploadType', 'vibe-at-viet');
    if (payload.caption !== undefined) formData.append('caption', payload.caption);
    if (payload.order !== undefined) formData.append('order', String(payload.order));
    if (payload.imageFile) formData.append('image', payload.imageFile);
    if (payload.videoFile) {
      formData.append('video', payload.videoFile);
    } else if (payload.videoLink !== undefined) {
      if (payload.videoLink === null) {
        formData.append('videoLink', ''); // Clear video
      } else if (payload.videoLink.trim()) {
        formData.append('videoLink', payload.videoLink.trim());
      }
    }
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/vibe-at-viet/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Update failed' }));
      throw new Error(error.error || 'Update failed');
    }
    return response.json();
  },
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

// Placement carousel (student images) – shown in placement section below stats.
export const placementCarouselAPI = {
  getAll: () => apiCall('/placement-carousel'),
  create: (file: File, title: string, subtitle: string) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('uploadType', 'placement-carousel');
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    return uploadFile('/placement-carousel', formData);
  },
  update: async (id: number, file: File | null, title: string, subtitle: string) => {
    const formData = new FormData();
    if (file) formData.append('image', file);
    formData.append('uploadType', 'placement-carousel');
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/placement-carousel/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Update failed' }));
      throw new Error(err.error || 'Update failed');
    }
    return response.json();
  },
  delete: (id: number) => apiCall(`/placement-carousel/${id}`, { method: 'DELETE' }),
};

// Recruiters API
export const recruitersAPI = {
  getAll: () => apiCall('/recruiters'),
  create: (file: File, name: string, description: string) => {
    const formData = new FormData();
    formData.append('logo', file);
    formData.append('uploadType', 'recruiter');
    formData.append('name', name);
    formData.append('description', description);
    return uploadFile('/recruiters', formData);
  },
  update: async (id: number, file: File | null, name: string, description: string) => {
    const formData = new FormData();
    if (file) {
      formData.append('logo', file);
    }
    formData.append('uploadType', 'recruiter');
    formData.append('name', name);
    formData.append('description', description);
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/recruiters/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Update failed' }));
      throw new Error(error.error || 'Update failed');
    }
    return response.json();
  },
  delete: (id: number) => apiCall(`/recruiters/${id}`, {
    method: 'DELETE',
  }),
};

// Transport Routes API (bus routes with image upload)
export const transportRoutesAPI = {
  getAll: () => apiCall('/transport-routes'),
  create: (data: { name: string; from: string; to: string; stops?: number; time?: string; frequency?: string; busNo: string; driverName: string; driverContactNo: string; seatingCapacity: number }, imageFile: File | null) => {
    const formData = new FormData();
    formData.append('uploadType', 'transport-routes');
    formData.append('name', data.name);
    formData.append('from', data.from);
    formData.append('to', data.to);
    formData.append('stops', String(data.stops ?? 0));
    formData.append('time', data.time ?? '');
    formData.append('frequency', data.frequency ?? 'Morning & Evening');
    formData.append('busNo', data.busNo);
    formData.append('driverName', data.driverName);
    formData.append('driverContactNo', data.driverContactNo);
    formData.append('seatingCapacity', String(data.seatingCapacity ?? 0));
    if (imageFile) formData.append('image', imageFile);
    return uploadFile('/transport-routes', formData);
  },
  update: async (id: number, data: { name?: string; from?: string; to?: string; stops?: number; time?: string; frequency?: string; busNo?: string; driverName?: string; driverContactNo?: string; seatingCapacity?: number }, imageFile: File | null) => {
    const formData = new FormData();
    formData.append('uploadType', 'transport-routes');
    formData.append('name', data.name ?? '');
    formData.append('from', data.from ?? '');
    formData.append('to', data.to ?? '');
    formData.append('stops', String(data.stops ?? 0));
    formData.append('time', data.time ?? '');
    formData.append('frequency', data.frequency ?? '');
    formData.append('busNo', data.busNo ?? '');
    formData.append('driverName', data.driverName ?? '');
    formData.append('driverContactNo', data.driverContactNo ?? '');
    formData.append('seatingCapacity', String(data.seatingCapacity ?? 0));
    if (imageFile) formData.append('image', imageFile);
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/transport-routes/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Update failed' }));
      throw new Error(err.error || 'Update failed');
    }
    return response.json();
  },
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
  update: async (id: number, data: any, images?: { [key: string]: File }) => {
    const formData = new FormData();
    formData.append('uploadType', 'page');
    formData.append('data', JSON.stringify(data));
    
    if (images) {
      Object.keys(images).forEach(key => {
        if (images[key]) {
          formData.append(`image_${key}`, images[key]);
        }
      });
    }
    
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/pages/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Update failed' }));
      throw new Error(error.error || 'Update failed');
    }
    return response.json();
  },
  delete: (id: number) => apiCall(`/pages/${id}`, {
    method: 'DELETE',
  }),
};

