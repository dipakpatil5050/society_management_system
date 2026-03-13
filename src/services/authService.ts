// ==========================================
// Auth Service — Mock Implementation
// ==========================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '../types';
import { STORAGE_KEYS } from '../constants';

// Simulated delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockUsers: Record<string, User> = {
  admin: {
    id: 'usr_admin_001',
    name: 'Dipak Patil',
    email: 'admin@societyms.com',
    phone: '+91 98765 43210',
    flatNumber: '101',
    wing: 'A',
    role: 'admin',
  },
  resident: {
    id: 'usr_resident_001',
    name: 'Rajesh Sharma',
    email: 'rajesh@email.com',
    phone: '+91 87654 32109',
    flatNumber: '202',
    wing: 'A',
    role: 'resident',
    ownerOrTenant: 'owner',
    moveInDate: '2022-01-15',
  },
  guard: {
    id: 'usr_guard_001',
    name: 'Manoj Kumar',
    email: 'guard@societyms.com',
    phone: '+91 76543 21098',
    flatNumber: 'N/A',
    wing: 'N/A',
    role: 'guard',
  },
};

export const authService = {
  login: async (email: string, _password: string, role: UserRole): Promise<{ user: User; token: string }> => {
    await delay(1200);
    const user = { ...mockUsers[role], email };
    const token = `mock_jwt_token_${Date.now()}`;

    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

    return { user, token };
  },

  logout: async (): Promise<void> => {
    await delay(300);
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },

  getCurrentUser: async (): Promise<User | null> => {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  },

  getToken: async (): Promise<string | null> => {
    return AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  isAuthenticated: async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return !!token;
  },
};
