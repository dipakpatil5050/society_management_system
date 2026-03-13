// ==========================================
// Application Constants
// ==========================================

export const APP_NAME = 'Society Management System';
export const APP_SHORT_NAME = 'SocietyMS';

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@society_ms/auth_token',
  USER_DATA: '@society_ms/user_data',
  THEME_MODE: '@society_ms/theme_mode',
  ONBOARDING: '@society_ms/onboarding_complete',
} as const;

export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api/v1',
  TIMEOUT: 15000,
} as const;

export const COMPLAINT_CATEGORIES = [
  { label: 'Plumbing', value: 'plumbing', icon: 'water' },
  { label: 'Electrical', value: 'electrical', icon: 'flash' },
  { label: 'Cleanliness', value: 'cleanliness', icon: 'leaf' },
  { label: 'Noise', value: 'noise', icon: 'volume-high' },
  { label: 'Parking', value: 'parking', icon: 'car' },
  { label: 'Security', value: 'security', icon: 'shield-checkmark' },
  { label: 'Other', value: 'other', icon: 'help-circle' },
] as const;

export const WINGS = ['A', 'B', 'C', 'D', 'E'] as const;

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

export const ROLES = [
  {
    key: 'admin' as const,
    label: 'Society Admin',
    description: 'Manage society operations, members & finances',
    icon: 'shield-checkmark',
    gradient: ['#4F46E5', '#7C3AED'],
  },
  {
    key: 'resident' as const,
    label: 'Resident',
    description: 'View bills, raise complaints & manage visitors',
    icon: 'home',
    gradient: ['#059669', '#10B981'],
  },
  {
    key: 'guard' as const,
    label: 'Security Guard',
    description: 'Manage visitor entry & exit logs',
    icon: 'eye',
    gradient: ['#D97706', '#F59E0B'],
  },
] as const;
