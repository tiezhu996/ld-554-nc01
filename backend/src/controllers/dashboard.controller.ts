import type { NextFunction, Request, Response } from 'express';
import { getDashboardSummary } from '../services/dashboard.service.js';
import { success } from '../utils/response.js';

export async function summary(_req: Request, res: Response, next: NextFunction) {
  try {
    success(res, await getDashboardSummary());
  } catch (error) {
    next(error);
  }
}
