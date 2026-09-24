import { UserRole } from './enums.js';

export const permissions = {
  employees: {
    read: [UserRole.OWNER, UserRole.MANAGER, UserRole.EMPLOYEE],
    create: [UserRole.OWNER, UserRole.MANAGER],
    update: [UserRole.OWNER, UserRole.MANAGER],
    delete: [UserRole.OWNER]
  },
  shifts: {
    read: [UserRole.OWNER, UserRole.MANAGER, UserRole.EMPLOYEE],
    create: [UserRole.OWNER, UserRole.MANAGER],
    update: [UserRole.OWNER, UserRole.MANAGER],
    delete: [UserRole.OWNER]
  },
  transactions: {
    read: [UserRole.OWNER, UserRole.MANAGER],
    create: [UserRole.OWNER, UserRole.MANAGER],
    update: [UserRole.OWNER],
    delete: [UserRole.OWNER]
  },
  stores: {
    read: [UserRole.OWNER, UserRole.MANAGER],
    create: [UserRole.OWNER],
    update: [UserRole.OWNER, UserRole.MANAGER],
    delete: [UserRole.OWNER]
  }
} as const;
