import { request } from '@/utils/request';

export function previewResign(employeeId: number, leaveDate?: string) {
  return request.post(`/employees/${employeeId}/resign-preview`, { leaveDate });
}

export function resignEmployee(employeeId: number, successorId: number, leaveDate?: string) {
  return request.post(`/employees/${employeeId}/resign`, { successorId, leaveDate });
}
