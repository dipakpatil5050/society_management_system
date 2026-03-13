// ==========================================
// SOCIETY MANAGEMENT SYSTEM - Type Definitions
// ==========================================

// --- User & Auth Types ---
export type UserRole = 'admin' | 'resident' | 'guard';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  flatNumber: string;
  wing: string;
  role: UserRole;
  avatar?: string;
  ownerOrTenant?: 'owner' | 'tenant';
  moveInDate?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

// --- Member Types ---
export interface Member {
  id: string;
  name: string;
  phone: string;
  email: string;
  flatNumber: string;
  wing: string;
  ownerOrTenant: 'owner' | 'tenant';
  moveInDate: string;
  agreementUrl?: string;
  avatar?: string;
}

// --- Maintenance Types ---
export type MaintenanceStatus = 'pending' | 'paid' | 'overdue';

export interface MaintenanceBill {
  id: string;
  flatNumber: string;
  wing: string;
  amount: number;
  month: string;
  dueDate: string;
  status: MaintenanceStatus;
  paidDate?: string;
  residentName: string;
}

// --- Complaint Types ---
export type ComplaintStatus = 'open' | 'in_progress' | 'resolved';
export type ComplaintCategory =
  | 'plumbing'
  | 'electrical'
  | 'cleanliness'
  | 'noise'
  | 'parking'
  | 'security'
  | 'other';

export interface Complaint {
  id: string;
  category: ComplaintCategory;
  description: string;
  imageUrl?: string;
  status: ComplaintStatus;
  raisedBy: string;
  raisedByName: string;
  flatNumber: string;
  wing: string;
  createdAt: string;
  updatedAt: string;
}

// --- Visitor Types ---
export type VisitorStatus = 'scheduled' | 'checked_in' | 'checked_out' | 'cancelled';

export interface Visitor {
  id: string;
  visitorName: string;
  visitorPhone?: string;
  visitDate: string;
  flatNumber: string;
  wing: string;
  residentName: string;
  otp: string;
  status: VisitorStatus;
  entryTime?: string;
  exitTime?: string;
  purpose?: string;
}

// --- Dashboard Types ---
export interface DashboardSummary {
  totalMembers: number;
  pendingMaintenance: number;
  openComplaints: number;
  visitorsToday: number;
}

// --- UI Types ---
export interface UIState {
  isDarkMode: boolean;
  isLoading: boolean;
}

// --- API Response Types ---
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

// --- Navigation Types ---
export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  RoleSelection: undefined;
};

export type AdminTabParamList = {
  Dashboard: undefined;
  Members: undefined;
  Maintenance: undefined;
  Complaints: undefined;
  Visitors: undefined;
  Profile: undefined;
};

export type ResidentTabParamList = {
  Dashboard: undefined;
  Payments: undefined;
  Complaints: undefined;
  Visitors: undefined;
  Profile: undefined;
};

export type GuardTabParamList = {
  VisitorEntry: undefined;
  VisitorHistory: undefined;
  Profile: undefined;
};

export type AppStackParamList = {
  MainTabs: undefined;
  AddMember: undefined;
  EditMember: { memberId: string };
  MemberDetail: { memberId: string };
  AddMaintenance: undefined;
  MaintenanceDetail: { billId: string };
  AddComplaint: undefined;
  ComplaintDetail: { complaintId: string };
  AddVisitor: undefined;
  VisitorDetail: { visitorId: string };
  VisitorVerify: undefined;
};
