// App Configuration Constants
export const APP_CONFIG = {
  name: 'Rise Blue Media',
  description: 'Professional web development and digital marketing services',
  author: 'Rise Blue Media',
  keywords: ['web development', 'digital marketing', 'SEO', 'social media', 'branding'],
  url: process.env.NODE_ENV === 'production' 
    ? 'https://riseblue.lovable.app' 
    : 'http://localhost:5173',
  
  // API Configuration
  api: {
    timeout: 10000, // 10 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },
  
  // Cache durations (in milliseconds)
  cache: {
    products: 5 * 60 * 1000, // 5 minutes
    services: 5 * 60 * 1000, // 5 minutes
    userSession: 24 * 60 * 60 * 1000, // 24 hours
  },
  
  // Feature flags
  features: {
    enableTelegramAuth: true,
    enableEmailAuth: true,
    enablePurchaseTracking: true,
    enableAnalytics: process.env.NODE_ENV === 'production',
  }
} as const;

// Validation patterns
export const VALIDATION = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
  }
} as const;

// Error messages
export const ERROR_MESSAGES = {
  network: 'Network error. Please check your connection.',
  generic: 'Something went wrong. Please try again.',
  auth: {
    invalidCredentials: 'Invalid email or password.',
    userNotFound: 'User not found.',
    emailTaken: 'This email is already registered.',
    sessionExpired: 'Your session has expired. Please sign in again.',
  },
  validation: {
    required: 'This field is required.',
    invalidEmail: 'Please enter a valid email address.',
    invalidPhone: 'Please enter a valid phone number.',
    passwordTooShort: `Password must be at least ${VALIDATION.password.minLength} characters.`,
  }
} as const;