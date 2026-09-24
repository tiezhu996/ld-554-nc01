import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';
import type { AuthUser } from '../types/request.js';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '未登录', data: {} });
  }
  try {
    req.user = jwt.verify(header.slice(7), jwtConfig.secret) as AuthUser;
    next();
  } catch {
    res.status(401).json({ code: 401, message: '登录已过期', data: {} });
  }
}
