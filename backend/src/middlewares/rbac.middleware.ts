import type { NextFunction, Request, Response } from 'express';
import type { UserRoleValue } from '../constants/enums.js';

export function requireRoles(roles: UserRoleValue[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ code: 403, message: '无权限访问', data: {} });
    }
    next();
  };
}
