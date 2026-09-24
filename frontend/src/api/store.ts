import { request } from '@/utils/request';

export function fetchStores(params = {}) {
  return request.get('/stores', { params });
}

export function createStore(data: Record<string, unknown>) {
  return request.post('/stores', data);
}
