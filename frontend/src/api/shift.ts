import { request } from '@/utils/request';

export function fetchShifts(params = {}) {
  return request.get('/shifts', { params });
}

export function createShift(data: Record<string, unknown>) {
  return request.post('/shifts', data);
}

export function autoGenerateShifts(data: { storeId: number; date: string }) {
  return request.post('/shifts/auto-generate', data);
}
