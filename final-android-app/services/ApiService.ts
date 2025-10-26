/**
 * API Service for Dahabiyat Mobile App
 * Connects to https://dahabiyatnilecruise.com
 */

import { API_URL, API_ENDPOINTS } from '../config/environment';

export interface Dahabiya {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  capacity: number;
  cabins: number;
  crew: number;
  pricePerDay: number;
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  mainImage: string;
  gallery?: string[];
  images?: string[];
  features: string[];
  amenities: string[];
  routes: string[];
  highlights: string[];
  specifications?: {
    length?: string;
    width?: string;
    yearBuilt?: string;
    maxSpeed?: string;
  };
  itinerary?: {
    day: number;
    title: string;
    description: string;
    activities: string[];
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  durationDays: number;
  mainImageUrl: string;
  isFeaturedOnHomepage: boolean;
  homepageOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_URL;
    console.log(`🌐 API Service initialized with base URL: ${this.baseURL}`);
  }

  // Try multiple endpoints in sequence until one succeeds
  private async fetchFirstAvailable<T>(paths: string[], options?: RequestInit): Promise<T> {
    let lastError: any = null;
    for (const p of paths) {
      try {
        return await this.fetchWithErrorHandling<T>(p, options);
      } catch (err) {
        lastError = err;
        // continue to next path
      }
    }
    throw lastError ?? new Error('All fallback endpoints failed');
  }

  private async fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const fullUrl = `${this.baseURL}${url}`;
      console.log(`🌐 API Request: ${fullUrl}`);

      const response = await fetch(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'DahabiyatMobileApp/3.0.0',
          ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
          ...options?.headers,
        },
        ...options,
      });

      console.log(`📊 API Response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error Response: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`✅ API Success for ${url}`);
      return data;
    } catch (error) {
      console.error(`❌ API Error for ${url}:`, error);
      throw error;
    }
  }

  // Authentication
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    return this.fetchWithErrorHandling(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<{ token: string; user: User }> {
    return this.fetchWithErrorHandling(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Dahabiyas
  async getDahabiyas(): Promise<Dahabiya[]> {
    return this.fetchWithErrorHandling<Dahabiya[]>(API_ENDPOINTS.DAHABIYAS);
  }

  async getDahabiya(id: string): Promise<Dahabiya> {
    return this.fetchWithErrorHandling<Dahabiya>(API_ENDPOINTS.DAHABIYA_DETAIL(id));
  }

  // Packages
  async getPackages(): Promise<Package[]> {
    return this.fetchWithErrorHandling<Package[]>(API_ENDPOINTS.PACKAGES);
  }

  async getPackage(id: string): Promise<Package> {
    return this.fetchWithErrorHandling<Package>(API_ENDPOINTS.PACKAGE_DETAIL(id));
  }

  // Bookings
  async createBooking(bookingData: any): Promise<any> {
    return this.fetchWithErrorHandling(API_ENDPOINTS.BOOKINGS, {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  // Gallery
  async getGallery(): Promise<any[]> {
    return this.fetchFirstAvailable<any[]>([
      API_ENDPOINTS.GALLERY,
      '/gallery',
      '/api/photos',
    ]);
  }

  // Blogs
  async getBlogs(): Promise<any[]> {
    return this.fetchFirstAvailable<any[]>([
      API_ENDPOINTS.BLOGS,
      '/blogs',
      '/api/posts',
    ]);
  }

  // Website Content
  async getWebsiteContent(): Promise<any> {
    return this.fetchWithErrorHandling<any>(API_ENDPOINTS.WEBSITE_CONTENT);
  }

  // ========== ADMIN: CRUD and Upload Helpers ==========
  // Dahabiyas
  async createDahabiya(payload: Partial<Dahabiya>): Promise<Dahabiya> {
    return this.fetchWithErrorHandling<Dahabiya>(API_ENDPOINTS.DAHABIYAS, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateDahabiya(id: string, payload: Partial<Dahabiya>): Promise<Dahabiya> {
    return this.fetchWithErrorHandling<Dahabiya>(API_ENDPOINTS.DAHABIYA_DETAIL(id), {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async deleteDahabiya(id: string): Promise<{ success: boolean }> {
    return this.fetchWithErrorHandling<{ success: boolean }>(API_ENDPOINTS.DAHABIYA_DETAIL(id), {
      method: 'DELETE',
    });
  }

  // Packages
  async createPackage(payload: Partial<Package>): Promise<Package> {
    return this.fetchWithErrorHandling<Package>(API_ENDPOINTS.PACKAGES, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updatePackage(id: string, payload: Partial<Package>): Promise<Package> {
    return this.fetchWithErrorHandling<Package>(API_ENDPOINTS.PACKAGE_DETAIL(id), {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async deletePackage(id: string): Promise<{ success: boolean }> {
    return this.fetchWithErrorHandling<{ success: boolean }>(API_ENDPOINTS.PACKAGE_DETAIL(id), {
      method: 'DELETE',
    });
  }

  // Blogs (generic API)
  async createBlog(payload: any): Promise<any> {
    return this.fetchWithErrorHandling<any>(API_ENDPOINTS.BLOGS, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateBlog(id: string, payload: any): Promise<any> {
    return this.fetchWithErrorHandling<any>(`${API_ENDPOINTS.BLOGS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async deleteBlog(id: string): Promise<{ success: boolean }> {
    return this.fetchWithErrorHandling<{ success: boolean }>(`${API_ENDPOINTS.BLOGS}/${id}`, {
      method: 'DELETE',
    });
  }

  // Gallery upload (multipart/form-data)
  async uploadGalleryImage(fileUri: string, fileName: string): Promise<any> {
    const form = new FormData();
    // @ts-ignore React Native FormData file shape
    form.append('image', { uri: fileUri, name: fileName, type: 'image/jpeg' });
    const fullUrl = `${this.baseURL}${API_ENDPOINTS.GALLERY}`;
    const resp = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
      body: form,
    });
    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(`HTTP error! status: ${resp.status} - ${errorText}`);
    }
    return resp.json();
  }

  // Itineraries (generic)
  async createItinerary(payload: any): Promise<any> {
    return this.fetchWithErrorHandling<any>(API_ENDPOINTS.ITINERARIES, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateItinerary(id: string, payload: any): Promise<any> {
    return this.fetchWithErrorHandling<any>(`${API_ENDPOINTS.ITINERARIES}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async deleteItinerary(id: string): Promise<{ success: boolean }> {
    return this.fetchWithErrorHandling<{ success: boolean }>(`${API_ENDPOINTS.ITINERARIES}/${id}`, {
      method: 'DELETE',
    });
  }

  // Schedule & Rates, About
  async updateScheduleAndRates(payload: any): Promise<any> {
    return this.fetchWithErrorHandling<any>(API_ENDPOINTS.SCHEDULE_AND_RATES, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async updateAbout(payload: any): Promise<any> {
    return this.fetchWithErrorHandling<any>(API_ENDPOINTS.ABOUT, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  // Itineraries
  async getItineraries(): Promise<any[]> {
    return this.fetchFirstAvailable<any[]>([
      API_ENDPOINTS.ITINERARIES,
      '/api/routes',
      '/itineraries',
    ]);
  }

  // Schedule & Rates
  async getScheduleAndRates(): Promise<any> {
    return this.fetchFirstAvailable<any>([
      API_ENDPOINTS.SCHEDULE_AND_RATES,
      '/api/rates',
      '/api/pricing',
      '/schedule-and-rates',
    ]);
  }

  // About
  async getAbout(): Promise<any> {
    return this.fetchFirstAvailable<any>([
      API_ENDPOINTS.ABOUT,
      '/api/page/about',
      '/api/pages/about',
      '/about',
    ]);
  }

  // Generic page by slug (fallback helper)
  async getPage(slug: string): Promise<any> {
    return this.fetchWithErrorHandling<any>(API_ENDPOINTS.PAGE(slug));
  }

  // Contact
  async submitContact(contactData: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }): Promise<{ success: boolean; message: string }> {
    return this.fetchWithErrorHandling('/api/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }
}

export const apiService = new ApiService();
export default apiService;
