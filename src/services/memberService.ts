// ==========================================
// Member Service — Mock Implementation
// ==========================================

import { Member } from '../types';
import { mockMembers } from '../utils/mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let members = [...mockMembers];

export const memberService = {
  getAll: async (): Promise<Member[]> => {
    await delay(800);
    return [...members];
  },

  getById: async (id: string): Promise<Member | undefined> => {
    await delay(500);
    return members.find((m) => m.id === id);
  },

  create: async (member: Omit<Member, 'id'>): Promise<Member> => {
    await delay(800);
    const newMember: Member = {
      ...member,
      id: `mem_${Date.now()}`,
    };
    members.push(newMember);
    return newMember;
  },

  update: async (id: string, data: Partial<Member>): Promise<Member> => {
    await delay(600);
    const index = members.findIndex((m) => m.id === id);
    if (index === -1) throw new Error('Member not found');
    members[index] = { ...members[index], ...data };
    return members[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay(500);
    members = members.filter((m) => m.id !== id);
  },

  search: async (query: string): Promise<Member[]> => {
    await delay(400);
    const q = query.toLowerCase();
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.flatNumber.includes(q) ||
        m.wing.toLowerCase().includes(q)
    );
  },
};
