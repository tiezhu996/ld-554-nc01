import type { NextFunction, Request, Response } from 'express';
import * as offboardingService from '../services/offboarding.service.js';
import { success } from '../utils/response.js';

export async function preview(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await offboardingService.previewOffboarding(
      Number(req.params.id),
      req.body.leaveDate as string | undefined,
      req.user
    );
    success(res, data);
  } catch (error) {
    next(error);
  }
}

export async function resign(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await offboardingService.resignEmployee(
      Number(req.params.id),
      Number(req.body.successorId),
      req.body.leaveDate as string | undefined,
      req.user
    );
    success(res, data, '离职办理成功');
  } catch (error) {
    next(error);
  }
}
