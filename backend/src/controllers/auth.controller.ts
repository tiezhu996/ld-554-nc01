import type { Request, Response, NextFunction } from 'express';
import { login } from '../services/auth.service.js';
import { success } from '../utils/response.js';

export async function loginController(req: Request, res: Response, next: NextFunction) {
  try {
    success(res, await login(req.body.username, req.body.password));
  } catch (error) {
    next(error);
  }
}
