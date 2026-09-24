import type { EmployeeStatus, UserRole } from '@/constants/enums';

export interface Employee {
  id: number;
  employeeNo: string;
  name: string;
  department: string;
  position: string;
  phone: string;
  email: string;
  joinDate: string;
  status: keyof typeof EmployeeStatus;
  salary: number;
  role: keyof typeof UserRole;
  storeId: number | null;
}

export interface ResignationSuccessor {
  id: number;
  name: string;
  employeeNo: string;
  position: string;
  status: keyof typeof EmployeeStatus;
}

export interface ResignationPreview {
  employee: Pick<Employee, 'id' | 'name' | 'employeeNo' | 'storeId'>;
  resignDate: string;
  isStoreManager: boolean;
  managedStore: { id: number; name: string } | null;
  pendingShiftCount: number;
  pendingShifts: Array<{
    id: number;
    date: string;
    shiftType: string;
    startTime: string;
    endTime: string;
    storeId: number;
    status: string;
  }>;
  successors: ResignationSuccessor[];
  hasEligibleSuccessor: boolean;
  hint: string | null;
}

export interface ResignationResult {
  employeeId: number;
  status: keyof typeof EmployeeStatus;
  successorId: number;
  transferredShiftCount: number;
  transferredStoreManager: boolean;
  managedStoreId: number | null;
  resignDate: string;
}
