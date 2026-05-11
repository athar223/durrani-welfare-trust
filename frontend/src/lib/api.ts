/**
 * API client for DWT backend.
 * Handles auth, JWT tokens, public/private endpoints.
 */
import axios, { AxiosInstance } from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api/v1';

const TOKEN_KEY = 'dwt_access_token';
const REFRESH_KEY = 'dwt_refresh_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setTokens(access: string, refresh: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      clearTokens();
    }
    return Promise.reject(err);
  }
);

// ==========================================================
// PUBLIC ENDPOINTS (no auth)
// ==========================================================
export const publicApi = {
  getSiteSettings: () => api.get('/site-settings/'),
  getHeroBanners: () => api.get('/hero-banners/'),
  getAboutSections: () => api.get('/about-sections/'),
  getServices: () => api.get('/services/'),
  getNews: (params?: any) => api.get('/news/', { params }),
  getNewsBySlug: (slug: string) => api.get(`/news/${slug}/`),
  getGalleryAlbums: () => api.get('/gallery/'),
  getCampaigns: () => api.get('/campaigns/'),
  submitContact: (data: any) => api.post('/contact-messages/', data),
  subscribeNewsletter: (email: string) => api.post('/newsletter/subscribe/', { email }),
  submitStudentApplication: (data: FormData) =>
    api.post('/student-applications/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  submitVolunteerApplication: (data: FormData) =>
    api.post('/volunteer-applications/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  submitDonation: (data: any) => api.post('/public-donations/', data),
};

// ==========================================================
// AUTH
// ==========================================================
export const authApi = {
  login: async (username: string, password: string) => {
    const res = await api.post('/auth/login/', { username, password });
    setTokens(res.data.access, res.data.refresh);
    return res.data;
  },
  logout: () => {
    clearTokens();
  },
  me: () => api.get('/auth/me/'),
};

// ==========================================================
// Generic CRUD factory - for any resource
// ==========================================================
export function makeResource(basePath: string) {
  return {
    list: (params?: any) => api.get(`${basePath}/`, { params }),
    get: (id: number | string) => api.get(`${basePath}/${id}/`),
    create: (data: any, multipart = false) =>
      api.post(`${basePath}/`, data, multipart ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined),
    update: (id: number | string, data: any, multipart = false) =>
      api.patch(`${basePath}/${id}/`, data, multipart ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined),
    delete: (id: number | string) => api.delete(`${basePath}/${id}/`),
  };
}

// ==========================================================
// ADMIN API - all modules
// ==========================================================
export const adminApi = {
  // Dashboard
  getDashboardStats: () => api.get('/dashboard/stats/'),
  getDashboardChart: () => api.get('/dashboard/chart/'),

  // User management
  users: makeResource('/users'),

  // Existing modules - generic CRUD
  students: makeResource('/students'),
  studentAttendance: makeResource('/student-attendance'),
  staff: makeResource('/staff'),
  staffAttendance: makeResource('/staff-attendance'),
  volunteers: makeResource('/volunteers'),
  drivers: makeResource('/drivers'),
  projects: makeResource('/projects'),
  donations: makeResource('/donations'),
  expenses: makeResource('/expenses'),
  dailyExpenses: makeResource('/daily-expenses'),
  salaries: makeResource('/salaries'),

  // Public submissions (admin review)
  studentApplications: makeResource('/student-applications'),
  approveStudentApp: (id: number, notes?: string) =>
    api.post(`/student-applications/${id}/approve/`, { notes }),
  rejectStudentApp: (id: number, notes?: string) =>
    api.post(`/student-applications/${id}/reject/`, { notes }),

  volunteerApplications: makeResource('/volunteer-applications'),
  approveVolunteerApp: (id: number, notes?: string) =>
    api.post(`/volunteer-applications/${id}/approve/`, { notes }),
  rejectVolunteerApp: (id: number, notes?: string) =>
    api.post(`/volunteer-applications/${id}/reject/`, { notes }),

  publicDonations: makeResource('/public-donations'),
  confirmDonation: (id: number) => api.post(`/public-donations/${id}/confirm/`),
  rejectDonation: (id: number) => api.post(`/public-donations/${id}/reject/`),

  // Contact messages
  contactMessages: makeResource('/contact-messages'),

  // CMS
  siteSettings: {
    get: () => api.get('/site-settings/'),
    update: (data: any, multipart = false) =>
      api.patch('/site-settings/', data, multipart ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined),
  },
  heroBanners: makeResource('/hero-banners'),
  aboutSections: makeResource('/about-sections'),
  cmsServices: makeResource('/services'),
  cmsNews: makeResource('/news'),
  cmsGallery: makeResource('/gallery'),
  cmsCampaigns: makeResource('/campaigns'),
};

export function mediaUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}
