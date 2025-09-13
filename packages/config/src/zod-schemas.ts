import { z } from 'zod';
import { USER_CONFIG, MODERATION_CONFIG, UPLOAD_CONFIG } from './constants';

// Common schemas
export const idSchema = z.string().min(1, 'ID is required');
export const emailSchema = z.string().email('Invalid email address');
export const urlSchema = z.string().url('Invalid URL');
export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number');

// Pagination schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

export const sortOrderSchema = z.enum(['asc', 'desc']).default('desc');

// User schemas
export const createUserSchema = z.object({
  email: emailSchema,
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  username: z
    .string()
    .min(USER_CONFIG.MIN_USERNAME_LENGTH, `Username must be at least ${USER_CONFIG.MIN_USERNAME_LENGTH} characters`)
    .max(USER_CONFIG.MAX_USERNAME_LENGTH, `Username must be at most ${USER_CONFIG.MAX_USERNAME_LENGTH} characters`)
    .regex(USER_CONFIG.USERNAME_REGEX, 'Username can only contain letters, numbers, hyphens, and underscores'),
  password: z.string().min(USER_CONFIG.MIN_PASSWORD_LENGTH, `Password must be at least ${USER_CONFIG.MIN_PASSWORD_LENGTH} characters`),
  bio: z.string().max(USER_CONFIG.MAX_BIO_LENGTH).optional(),
  avatar: urlSchema.optional(),
});

export const updateUserSchema = createUserSchema.partial().omit({ password: true });

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(USER_CONFIG.MIN_PASSWORD_LENGTH, `Password must be at least ${USER_CONFIG.MIN_PASSWORD_LENGTH} characters`),
  confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Auth schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});

export const registerSchema = createUserSchema.extend({
  confirmPassword: z.string().min(1, 'Password confirmation is required'),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(USER_CONFIG.MIN_PASSWORD_LENGTH, `Password must be at least ${USER_CONFIG.MIN_PASSWORD_LENGTH} characters`),
  confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Video schemas
export const createVideoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(MODERATION_CONFIG.MAX_TITLE_LENGTH),
  description: z.string().max(MODERATION_CONFIG.MAX_DESCRIPTION_LENGTH).optional(),
  url: urlSchema,
  thumbnail: urlSchema.optional(),
  duration: z.number().positive('Duration must be positive'),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed').optional(),
  category: z.string().optional(),
  isPublic: z.boolean().default(true),
});

export const updateVideoSchema = createVideoSchema.partial();

export const videoFilterSchema = z.object({
  category: z.string().optional(),
  duration: z.enum(['short', 'medium', 'long']).optional(),
  sortBy: z.enum(['newest', 'oldest', 'popular', 'trending']).default('newest'),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }).optional(),
});

export const searchVideoSchema = paginationSchema.extend({
  query: z.string().optional(),
  filters: videoFilterSchema.optional(),
});

// Comment schemas
export const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(MODERATION_CONFIG.MAX_COMMENT_LENGTH),
  videoId: idSchema,
  parentId: idSchema.optional(),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(MODERATION_CONFIG.MAX_COMMENT_LENGTH),
});

// Playlist schemas
export const createPlaylistSchema = z.object({
  name: z.string().min(1, 'Playlist name is required').max(100),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().default(true),
});

export const updatePlaylistSchema = createPlaylistSchema.partial();

export const addToPlaylistSchema = z.object({
  playlistId: idSchema,
  videoId: idSchema,
});

// File upload schemas
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  type: z.enum(['image', 'video', 'document']),
}).refine((data) => {
  const { file, type } = data;
  
  // Check file size
  if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
    return false;
  }
  
  // Check file type
  if (type === 'image' && !UPLOAD_CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
    return false;
  }
  
  if (type === 'video' && !UPLOAD_CONFIG.ALLOWED_VIDEO_TYPES.includes(file.type as any)) {
    return false;
  }
  
  if (type === 'document' && !UPLOAD_CONFIG.ALLOWED_DOCUMENT_TYPES.includes(file.type as any)) {
    return false;
  }
  
  return true;
}, {
  message: 'Invalid file type or size',
});

// Contact/Support schemas
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(100),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
});

// Settings schemas
export const notificationSettingsSchema = z.object({
  email: z.object({
    comments: z.boolean().default(true),
    likes: z.boolean().default(true),
    follows: z.boolean().default(true),
    uploads: z.boolean().default(false),
  }),
  push: z.object({
    comments: z.boolean().default(true),
    likes: z.boolean().default(false),
    follows: z.boolean().default(true),
    uploads: z.boolean().default(false),
  }),
});

export const privacySettingsSchema = z.object({
  profileVisibility: z.enum(['public', 'private']).default('public'),
  showEmail: z.boolean().default(false),
  showActivity: z.boolean().default(true),
  allowMessages: z.boolean().default(true),
});

// Admin schemas
export const moderateContentSchema = z.object({
  contentId: idSchema,
  action: z.enum(['approve', 'reject', 'flag']),
  reason: z.string().optional(),
});

export const banUserSchema = z.object({
  userId: idSchema,
  reason: z.string().min(10, 'Ban reason must be at least 10 characters'),
  duration: z.enum(['1d', '7d', '30d', 'permanent']).default('7d'),
});

// Analytics schemas
export const analyticsQuerySchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  metrics: z.array(z.enum(['views', 'likes', 'comments', 'shares', 'subscribers'])),
  groupBy: z.enum(['day', 'week', 'month']).default('day'),
});

// Webhook schemas
export const webhookSchema = z.object({
  url: urlSchema,
  events: z.array(z.string()),
  secret: z.string().min(16, 'Webhook secret must be at least 16 characters'),
  active: z.boolean().default(true),
});

// API Key schemas
export const createApiKeySchema = z.object({
  name: z.string().min(1, 'API key name is required').max(50),
  permissions: z.array(z.enum(['read', 'write', 'admin'])),
  expiresAt: z.date().optional(),
});

// Export all schemas for easy importing
export const schemas = {
  // Common
  id: idSchema,
  email: emailSchema,
  url: urlSchema,
  phone: phoneSchema,
  pagination: paginationSchema,
  sortOrder: sortOrderSchema,
  
  // User
  createUser: createUserSchema,
  updateUser: updateUserSchema,
  changePassword: changePasswordSchema,
  
  // Auth
  login: loginSchema,
  register: registerSchema,
  forgotPassword: forgotPasswordSchema,
  resetPassword: resetPasswordSchema,
  
  // Video
  createVideo: createVideoSchema,
  updateVideo: updateVideoSchema,
  videoFilter: videoFilterSchema,
  searchVideo: searchVideoSchema,
  
  // Comment
  createComment: createCommentSchema,
  updateComment: updateCommentSchema,
  
  // Playlist
  createPlaylist: createPlaylistSchema,
  updatePlaylist: updatePlaylistSchema,
  addToPlaylist: addToPlaylistSchema,
  
  // Upload
  fileUpload: fileUploadSchema,
  
  // Contact
  contact: contactSchema,
  
  // Settings
  notificationSettings: notificationSettingsSchema,
  privacySettings: privacySettingsSchema,
  
  // Admin
  moderateContent: moderateContentSchema,
  banUser: banUserSchema,
  
  // Analytics
  analyticsQuery: analyticsQuerySchema,
  
  // Webhook
  webhook: webhookSchema,
  
  // API Key
  createApiKey: createApiKeySchema,
} as const;