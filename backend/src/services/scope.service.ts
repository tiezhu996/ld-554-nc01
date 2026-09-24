import { Op, type WhereOptions } from 'sequelize';
import { UserRole } from '../constants/enums.js';
import type { AuthUser } from '../types/request.js';

export function storeScope(user?: AuthUser): WhereOptions {
  if (!user || user.role === UserRole.OWNER) return {};
  if (user.role === UserRole.MANAGER && user.storeId) return { storeId: user.storeId };
  if (user.role === UserRole.EMPLOYEE) return { [Op.or]: [{ storeId: user.storeId }, { id: user.employeeId }] };
  return {};
}

export function directStoreScope(user?: AuthUser): WhereOptions {
  if (!user || user.role === UserRole.OWNER) return {};
  if (user.storeId) return { id: user.storeId };
  return {};
}
