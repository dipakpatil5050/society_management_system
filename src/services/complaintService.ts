// ==========================================
// Complaint Service — Mock Implementation
// ==========================================

import { Complaint, ComplaintStatus } from '../types';
import { mockComplaints } from '../utils/mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let complaints = [...mockComplaints];

export const complaintService = {
  getAll: async (): Promise<Complaint[]> => {
    await delay(800);
    return [...complaints].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getByUser: async (userId: string): Promise<Complaint[]> => {
    await delay(600);
    return complaints
      .filter((c) => c.raisedBy === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getById: async (id: string): Promise<Complaint | undefined> => {
    await delay(500);
    return complaints.find((c) => c.id === id);
  },

  create: async (complaint: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt'>): Promise<Complaint> => {
    await delay(800);
    const now = new Date().toISOString();
    const newComplaint: Complaint = {
      ...complaint,
      id: `comp_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    complaints.push(newComplaint);
    return newComplaint;
  },

  updateStatus: async (id: string, status: ComplaintStatus): Promise<Complaint> => {
    await delay(600);
    const index = complaints.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Complaint not found');
    complaints[index] = {
      ...complaints[index],
      status,
      updatedAt: new Date().toISOString(),
    };
    return complaints[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay(500);
    complaints = complaints.filter((c) => c.id !== id);
  },
};
