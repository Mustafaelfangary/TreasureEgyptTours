/**
 * Environment Configuration for Dahabiyat Mobile App
 * PRODUCTION ONLY - Always connects to https://dahabiyatnilecruise.com
 */

export interface Environment {
  name: string;
  apiUrl: string;
  websiteUrl: string;
  debug: boolean;
  timeout: number;
}

const productionEnvironment: Environment = {
  name: 'Production',
  apiUrl: 'https://www.dahabiyatnilecruise.com',
  websiteUrl: 'https://www.dahabiyatnilecruise.com',
  debug: false,
  timeout: 20000,
};

// Always use production environment
export const currentEnvironment = productionEnvironment;

// Export individual values for convenience
export const {
  apiUrl: API_URL,
  websiteUrl: WEBSITE_URL,
  debug: DEBUG_MODE,
  timeout: REQUEST_TIMEOUT,
} = currentEnvironment;

// API endpoints
export const API_ENDPOINTS = {
  // Authentication (Mobile-specific endpoints)
  LOGIN: '/api/mobile/auth/login',
  REGISTER: '/api/mobile/auth/register',
  RESET_PASSWORD: '/api/auth/reset-password',
  
  // Dahabiyas
  DAHABIYAS: '/api/dahabiyas',
  DAHABIYA_DETAIL: (id: string) => `/api/dahabiyas/${id}`,
  
  // Packages
  PACKAGES: '/api/packages',
  PACKAGE_DETAIL: (id: string) => `/api/packages/${id}`,
  
  // Bookings
  BOOKINGS: '/api/bookings',
  USER_BOOKINGS: '/api/bookings',
  AVAILABILITY: '/api/availability',
  
  // Content
  WEBSITE_CONTENT: '/api/website-content',
  GALLERY: '/api/gallery',
  BLOGS: '/api/blogs',
  ITINERARIES: '/api/itineraries',
  SCHEDULE_AND_RATES: '/api/schedule-and-rates',
  ABOUT: '/api/about',
  PAGE: (slug: string) => `/api/pages/${slug}`,
  
  // Static assets
  IMAGES: '/images',
  LOGO: '/images/logo.png',
};

// App configuration
export const APP_CONFIG = {
  NAME: 'Dahabiyat Nile Cruise',
  VERSION: '3.0.0',
  BUNDLE_ID: 'com.dahabiyat.nilecruise',
  SCHEME: 'dahabiyat',
  
  // Ocean Blue Theme Colors
  COLORS: {
    PRIMARY: '#10b981', // emerald-500
    SECONDARY: '#ecfdf5', // pale-green-50
    BACKGROUND: '#ecfdf5',
    TEXT: '#003d7a', // deep-blue to match web text on light bg
    TEXT_SECONDARY: '#0f172a',
    ERROR: '#dc2626',
    SUCCESS: '#10b981',
    WARNING: '#003d7a',
    GOLD: '#FFD700',
  },
  
  // Timeouts
  TIMEOUTS: {
    API_REQUEST: REQUEST_TIMEOUT,
    IMAGE_LOAD: 10000,
    SPLASH_SCREEN: 2000,
  },
  
  // Features
  FEATURES: {
    OFFLINE_MODE: false,
    PUSH_NOTIFICATIONS: true,
    ANALYTICS: !DEBUG_MODE,
    CRASH_REPORTING: !DEBUG_MODE,
  },
};

console.log(`🌍 Environment: ${currentEnvironment.name}`);
console.log(`🔗 API URL: ${currentEnvironment.apiUrl}`);

export default currentEnvironment;
