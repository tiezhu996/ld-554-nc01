import type { ShiftType } from '@/constants/enums';

export interface Shift {
  id: number;
  employeeId: number;
  employee?: { name: string; employeeNo: string };
  date: string;
  shiftType: keyof typeof ShiftType;
  startTime: string;
  endTime: string;
  storeId: number;
  status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN';
}
