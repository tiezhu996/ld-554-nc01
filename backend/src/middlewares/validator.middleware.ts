import type { NextFunction, Request, Response } from 'express';

export function requireFields(fields: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const missing = fields.filter((field) => req.body[field] === undefined || req.body[field] === '');
    if (missing.length) return res.status(400).json({ code: 400, message: `缺少字段：${missing.join(',')}`, data: {} });
    next();
  };
}
