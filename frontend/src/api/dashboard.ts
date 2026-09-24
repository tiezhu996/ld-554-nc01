import { request } from '@/utils/request';

export function fetchDashboardSummary() {
  return request.get('/dashboard/summary');
}
