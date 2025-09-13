// Application constants

// API Configuration
export const API_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MAX_UPLOAD_SIZE: 100 * 1024 * 1024, // 100MB
  REQUEST_TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// File Upload Constants
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const,
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/quicktime'] as const,
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'text/plain', 'application/msword'] as const,
  
  // Image dimensions
  THUMBNAIL_SIZE: { width: 320, height: 180 },
  AVATAR_SIZE: { width: 200, height: 200 },
  BANNER_SIZE: { width: 1920, height: 1080 },
} as const;

// Video Constants
export const VIDEO_CONFIG = {
  DURATION_LIMITS: {
    SHORT: 4 * 60, // 4 minutes
    MEDIUM: 20 * 60, // 20 minutes
  },
  QUALITY_OPTIONS: ['360p', '480p', '720p', '1080p'] as const,
  DEFAULT_QUALITY: '720p',
} as const;

// User Constants
export const USER_CONFIG = {
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 30,
  MIN_PASSWORD_LENGTH: 8,
  MAX_BIO_LENGTH: 500,
  USERNAME_REGEX: /^[a-zA-Z0-9_-]+$/,
} as const;

// Content Moderation
export const MODERATION_CONFIG = {
  MAX_COMMENT_LENGTH: 1000,
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 5000,
  PROFANITY_CHECK: true,
  AUTO_MODERATE: false,
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  TTL: {
    SHORT: 5 * 60, // 5 minutes
    MEDIUM: 30 * 60, // 30 minutes
    LONG: 24 * 60 * 60, // 24 hours
    VERY_LONG: 7 * 24 * 60 * 60, // 7 days
  },
  KEYS: {
    USER_PROFILE: 'user:profile:',
    VIDEO_DETAILS: 'video:details:',
    TRENDING_VIDEOS: 'trending:videos',
    POPULAR_TAGS: 'popular:tags',
  },
} as const;

// Rate Limiting
export const RATE_LIMIT_CONFIG = {
  GLOBAL: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // requests per window
  },
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // login attempts per window
  },
  UPLOAD: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // uploads per hour
  },
  COMMENTS: {
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 50, // comments per window
  },
} as const;

// UI Constants
export const UI_CONFIG = {
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  },
  ANIMATION_DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  Z_INDEX: {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070,
    TOAST: 1080,
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION: 'Please check your input and try again.',
  FILE_TOO_LARGE: 'File is too large. Please choose a smaller file.',
  INVALID_FILE_TYPE: 'Invalid file type. Please choose a supported format.',
  RATE_LIMITED: 'Too many requests. Please try again later.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Successfully created!',
  UPDATED: 'Successfully updated!',
  DELETED: 'Successfully deleted!',
  UPLOADED: 'Successfully uploaded!',
  SAVED: 'Successfully saved!',
  SENT: 'Successfully sent!',
} as const;

// App Metadata
export const APP_METADATA = {
  NAME: 'Your App Name',
  DESCRIPTION: 'Your app description',
  VERSION: '1.0.0',
  AUTHOR: 'Your Name',
  KEYWORDS: ['video', 'platform', 'sharing'],
  SOCIAL: {
    TWITTER: '@yourapp',
    GITHUB: 'https://github.com/yourusername/yourapp',
  },
} as const;

// Third-party Service Keys
export const EXTERNAL_SERVICES = {
  GOOGLE_ANALYTICS: 'analytics',
  SENTRY: 'error-tracking',
  STRIPE: 'payments',
  CLOUDINARY: 'media-storage',
} as const;