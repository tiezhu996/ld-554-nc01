import { type WhereOptions } from 'sequelize';
import { Transaction, Employee, Store } from '../models/index.js';
import { getPagination } from '../utils/pagination.js';
import { storeScope } from './scope.service.js';
import type { AuthUser } from '../types/request.js';

export async function listTransactions(query: Record<string, unknown>, user?: AuthUser) {
  const { page, pageSize, limit, offset } = getPagination(query);
  const where: WhereOptions = { ...storeScope(user) };
  if (query.type) Object.assign(where, { type: query.type });
  if (query.category) Object.assign(where, { category: query.category });
  if (query.storeId) Object.assign(where, { storeId: query.storeId });
  const { rows, count } = await Transaction.findAndCountAll({
    where,
    limit,
    offset,
    include: [{ model: Employee, as: 'relatedEmployee' }, Store],
    order: [['date', 'DESC']]
  });
  return { list: rows, total: count, page, pageSize };
}

export async function createTransaction(payload: Record<string, unknown>) {
  return Transaction.create(payload as never);
}

export async function updateTransaction(id: number, payload: Record<string, unknown>) {
  const transaction = await Transaction.findByPk(id);
  if (!transaction) throw Object.assign(new Error('财务记录不存在'), { status: 404 });
  return transaction.update(payload);
}

export async function deleteTransaction(id: number) {
  const transaction = await Transaction.findByPk(id);
  if (!transaction) throw Object.assign(new Error('财务记录不存在'), { status: 404 });
  await transaction.destroy();
}
