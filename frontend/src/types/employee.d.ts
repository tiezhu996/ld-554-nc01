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
