// ==========================================
// Visitor Service — Mock Implementation
// ==========================================

import { Visitor, VisitorStatus } from '../types';
import { mockVisitors } from '../utils/mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let visitors = [...mockVisitors];

const generateOTP = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const visitorService = {
  getAll: async (): Promise<Visitor[]> => {
    await delay(800);
    return [...visitors].sort(
      (a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
    );
  },

  getByFlat: async (flatNumber: string, wing: string): Promise<Visitor[]> => {
    await delay(600);
    return visitors.filter((v) => v.flatNumber === flatNumber && v.wing === wing);
  },

  getToday: async (): Promise<Visitor[]> => {
    await delay(600);
    const today = new Date().toISOString().split('T')[0];
    return visitors.filter((v) => v.visitDate === today);
  },

  getById: async (id: string): Promise<Visitor | undefined> => {
    await delay(500);
    return visitors.find((v) => v.id === id);
  },

  schedule: async (
    visitor: Omit<Visitor, 'id' | 'otp' | 'status' | 'entryTime' | 'exitTime'>
  ): Promise<Visitor> => {
    await delay(800);
    const newVisitor: Visitor = {
      ...visitor,
      id: `vis_${Date.now()}`,
      otp: generateOTP(),
      status: 'scheduled',
    };
    visitors.push(newVisitor);
    return newVisitor;
  },

  verifyOTP: async (otp: string): Promise<Visitor | null> => {
    await delay(600);
    const visitor = visitors.find(
      (v) => v.otp === otp && (v.status === 'scheduled' || v.status === 'checked_in')
    );
    return visitor || null;
  },

  checkIn: async (id: string): Promise<Visitor> => {
    await delay(600);
    const index = visitors.findIndex((v) => v.id === id);
    if (index === -1) throw new Error('Visitor not found');
    visitors[index] = {
      ...visitors[index],
      status: 'checked_in',
      entryTime: new Date().toISOString(),
    };
    return visitors[index];
  },

  checkOut: async (id: string): Promise<Visitor> => {
    await delay(600);
    const index = visitors.findIndex((v) => v.id === id);
    if (index === -1) throw new Error('Visitor not found');
    visitors[index] = {
      ...visitors[index],
      status: 'checked_out',
      exitTime: new Date().toISOString(),
    };
    return visitors[index];
  },

  cancel: async (id: string): Promise<void> => {
    await delay(500);
    const index = visitors.findIndex((v) => v.id === id);
    if (index === -1) throw new Error('Visitor not found');
    visitors[index] = { ...visitors[index], status: 'cancelled' };
  },
};
