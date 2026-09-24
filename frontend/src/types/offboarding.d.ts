import type { Employee } from './employee';
import type { Shift } from './shift';

export interface OffboardingPreview {
  employeeId: number;
  employeeName: string;
  employeeNo: string;
  storeId: number | null;
  isManager: boolean;
  leaveDate: string;
  candidates: Employee[];
  transferableShifts: Shift[];
  checkedInShiftCount: number;
  managedStoreIds: number[];
}

export interface ResignResult {
  employeeId: number;
  successorId: number;
  leaveDate: string;
  transferredShiftCount: number;
  transferredStoreCount: number;
}
