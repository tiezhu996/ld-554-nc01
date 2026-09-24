import { Store, Employee, Shift, Transaction } from '../models/index.js';
import { getPagination } from '../utils/pagination.js';
import { directStoreScope } from './scope.service.js';
import type { AuthUser } from '../types/request.js';

export async function listStores(query: Record<string, unknown>, user?: AuthUser) {
  const { page, pageSize, limit, offset } = getPagination(query);
  const { rows, count } = await Store.findAndCountAll({
    where: directStoreScope(user),
    limit,
    offset,
    include: [{ model: Employee, as: 'manager' }],
    order: [['id', 'DESC']]
  });
  return { list: rows, total: count, page, pageSize };
}

export async function getStore(id: number) {
  return Store.findByPk(id, { include: [Employee, Shift, Transaction, { model: Employee, as: 'manager' }] });
}

export async function createStore(payload: Record<string, unknown>) {
  return Store.create(payload as never);
}

export async function updateStore(id: number, payload: Record<string, unknown>) {
  const store = await Store.findByPk(id);
  if (!store) throw Object.assign(new Error('门店不存在'), { status: 404 });
  return store.update(payload);
}

export async function deleteStore(id: number) {
  const store = await Store.findByPk(id);
  if (!store) throw Object.assign(new Error('门店不存在'), { status: 404 });
  await store.destroy();
}
