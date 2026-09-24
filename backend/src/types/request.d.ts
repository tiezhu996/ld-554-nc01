import type { UserRoleValue } from '../constants/enums.js';

export interface AuthUser {
  id: number;
  username: string;
  role: UserRoleValue;
  employeeId: number | null;
  storeId: number | null;
}
