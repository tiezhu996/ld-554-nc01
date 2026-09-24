import type { UserRoleValue } from '@/constants/enums';

export interface LocalUser {
  id: number;
  username: string;
  role: UserRoleValue;
  employeeId: number | null;
  storeId: number | null;
}

export function getToken() {
  return localStorage.getItem('token');
}

export function setSession(token: string, user: LocalUser) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function getUser(): LocalUser | null {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
