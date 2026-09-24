import { request } from '@/utils/request';

export function fetchEmployees(params = {}) {
  return request.get('/employees', { params });
}

export function fetchEmployee(id: number) {
  return request.get(`/employees/${id}`);
}

export function createEmployee(data: Record<string, unknown>) {
  return request.post('/employees', data);
}

export function updateEmployee(id: number, data: Record<string, unknown>) {
  return request.put(`/employees/${id}`, data);
}
