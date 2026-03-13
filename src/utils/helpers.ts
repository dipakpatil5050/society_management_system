// ==========================================
// Utility Helpers
// ==========================================

import { ComplaintStatus, MaintenanceStatus, VisitorStatus } from '../types';

// Format currency (INR)
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

// Format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// Format time
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// Format date-time
export const formatDateTime = (dateString: string): string => {
  return `${formatDate(dateString)}, ${formatTime(dateString)}`;
};

// Get relative time
export const getRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
};

// Status color mapping
export const getMaintenanceStatusColor = (status: MaintenanceStatus) => {
  const map = {
    pending: { bg: '#FEF3C7', text: '#D97706', label: 'Pending' },
    paid: { bg: '#D1FAE5', text: '#059669', label: 'Paid' },
    overdue: { bg: '#FEE2E2', text: '#DC2626', label: 'Overdue' },
  };
  return map[status];
};

export const getComplaintStatusColor = (status: ComplaintStatus) => {
  const map = {
    open: { bg: '#FEE2E2', text: '#DC2626', label: 'Open' },
    in_progress: { bg: '#FEF3C7', text: '#D97706', label: 'In Progress' },
    resolved: { bg: '#D1FAE5', text: '#059669', label: 'Resolved' },
  };
  return map[status];
};

export const getVisitorStatusColor = (status: VisitorStatus) => {
  const map = {
    scheduled: { bg: '#DBEAFE', text: '#2563EB', label: 'Scheduled' },
    checked_in: { bg: '#D1FAE5', text: '#059669', label: 'Checked In' },
    checked_out: { bg: '#F1F5F9', text: '#64748B', label: 'Checked Out' },
    cancelled: { bg: '#FEE2E2', text: '#DC2626', label: 'Cancelled' },
  };
  return map[status];
};

// Generate flat label
export const formatFlat = (wing: string, flatNumber: string): string => {
  return `${wing}-${flatNumber}`;
};

// Validate phone number (Indian)
export const isValidPhone = (phone: string): boolean => {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Get initials from name
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Truncate text
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
