import { Op, type WhereOptions } from 'sequelize';
import { Employee, Shift, Store, Transaction } from '../models/index.js';
import { getPagination } from '../utils/pagination.js';
import { storeScope } from './scope.service.js';
import type { AuthUser } from '../types/request.js';

function buildEmployeeNo() {
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  const suffix = String(Math.floor(Math.random() * 900) + 100);
  return `EMP-${date}-${suffix}`;
}

export async function listEmployees(query: Record<string, unknown>, user?: AuthUser) {
  const { page, pageSize, limit, offset } = getPagination(query);
  const where: WhereOptions = { ...storeScope(user) };
  if (query.department) Object.assign(where, { department: query.department });
  if (query.status) Object.assign(where, { status: query.status });
  if (query.storeId) Object.assign(where, { storeId: query.storeId });
  if (query.keyword) Object.assign(where, { name: { [Op.like]: `%${query.keyword}%` } });
  const { rows, count } = await Employee.findAndCountAll({ where, limit, offset, include: [Store], order: [['id', 'DESC']] });
  return { list: rows, total: count, page, pageSize };
}

export async function getEmployee(id: number) {
  return Employee.findByPk(id, { include: [Store, Shift, { model: Transaction, as: 'employeeTransactions' }] });
}

export async function createEmployee(payload: Record<string, unknown>) {
  return Employee.create({ ...payload, employeeNo: buildEmployeeNo() } as never);
}

export async function updateEmployee(id: number, payload: Record<string, unknown>) {
  const employee = await Employee.findByPk(id);
  if (!employee) throw Object.assign(new Error('员工不存在'), { status: 404 });
  return employee.update(payload);
}

export async function deleteEmployee(id: number) {
  const employee = await Employee.findByPk(id);
  if (!employee) throw Object.assign(new Error('员工不存在'), { status: 404 });
  await employee.destroy();
}
