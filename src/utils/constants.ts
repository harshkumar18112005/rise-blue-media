// API Constants
export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  SERVICES: '/services',
  AUTH: '/auth',
} as const;

// Cache durations (in milliseconds)
export const CACHE_DURATIONS = {
  PRODUCTS: 5 * 60 * 1000, // 5 minutes
  SERVICES: 5 * 60 * 1000, // 5 minutes
  USER_PROFILE: 10 * 60 * 1000, // 10 minutes
} as const;

// Performance constants
export const PERFORMANCE = {
  DEBOUNCE_DELAY: 300,
  THROTTLE_LIMIT: 100,
  IMAGE_LAZY_LOAD_THRESHOLD: 0.1,
} as const;

// Validation patterns
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: 'An unexpected error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  AUTH_FAILED: 'Authentication failed. Please try again.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  REQUIRED_FIELD: 'This field is required.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully signed in!',
  LOGOUT_SUCCESS: 'Successfully signed out!',
  PROFILE_UPDATED: 'Profile updated successfully!',
} as const;