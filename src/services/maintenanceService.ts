// ==========================================
// Maintenance Service — Mock Implementation
// ==========================================

import { MaintenanceBill, MaintenanceStatus } from '../types';
import { mockMaintenanceBills } from '../utils/mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let bills = [...mockMaintenanceBills];

export const maintenanceService = {
  getAll: async (): Promise<MaintenanceBill[]> => {
    await delay(800);
    return [...bills];
  },

  getByFlat: async (flatNumber: string, wing: string): Promise<MaintenanceBill[]> => {
    await delay(600);
    return bills.filter((b) => b.flatNumber === flatNumber && b.wing === wing);
  },

  getById: async (id: string): Promise<MaintenanceBill | undefined> => {
    await delay(500);
    return bills.find((b) => b.id === id);
  },

  create: async (bill: Omit<MaintenanceBill, 'id'>): Promise<MaintenanceBill> => {
    await delay(800);
    const newBill: MaintenanceBill = {
      ...bill,
      id: `bill_${Date.now()}`,
    };
    bills.push(newBill);
    return newBill;
  },

  updateStatus: async (id: string, status: MaintenanceStatus): Promise<MaintenanceBill> => {
    await delay(600);
    const index = bills.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('Bill not found');
    bills[index] = {
      ...bills[index],
      status,
      paidDate: status === 'paid' ? new Date().toISOString().split('T')[0] : undefined,
    };
    return bills[index];
  },

  getStats: async () => {
    await delay(400);
    const total = bills.length;
    const paid = bills.filter((b) => b.status === 'paid').length;
    const pending = bills.filter((b) => b.status === 'pending').length;
    const overdue = bills.filter((b) => b.status === 'overdue').length;
    const totalAmount = bills.reduce((sum, b) => sum + b.amount, 0);
    const collectedAmount = bills
      .filter((b) => b.status === 'paid')
      .reduce((sum, b) => sum + b.amount, 0);

    return { total, paid, pending, overdue, totalAmount, collectedAmount };
  },
};
