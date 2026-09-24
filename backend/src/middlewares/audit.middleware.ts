import type { NextFunction, Request, Response } from 'express';
import { recordAudit } from '../services/audit.service.js';

export function auditMiddleware(action: string, target: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);
    res.json = (body: unknown) => {
      if (res.statusCode < 400) {
        void recordAudit({
          operatorId: req.user?.id ?? null,
          action,
          target,
          newValue: req.body,
          ip: req.ip ?? 'unknown'
        });
      }
      return originalJson(body);
    };
    next();
  };
}
