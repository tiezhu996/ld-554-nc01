import { request } from '@/utils/request';

export function fetchTransactions(params = {}) {
  return request.get('/transactions', { params });
}

export function createTransaction(data: Record<string, unknown>) {
  return request.post('/transactions', data);
}
