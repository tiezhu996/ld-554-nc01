import { AuditLog } from '../models/index.js';

export async function recordAudit(input: {
  operatorId: number | null;
  action: string;
  target: string;
  oldValue?: unknown;
  newValue?: unknown;
  ip: string;
}) {
  return AuditLog.create({
    operatorId: input.operatorId,
    action: input.action,
    target: input.target,
    oldValue: input.oldValue ? JSON.stringify(input.oldValue) : null,
    newValue: input.newValue ? JSON.stringify(input.newValue) : null,
    ip: input.ip
  });
}
