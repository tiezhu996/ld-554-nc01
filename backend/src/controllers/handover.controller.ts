import type { NextFunction, Request, Response } from 'express';
import * as handoverService from '../services/handover.service.js';
import { success } from '../utils/response.js';

export async function preview(req: Request, res: Response, next: NextFunction) {
  try {
    const resignDate = typeof req.query.resignDate === 'string' ? req.query.resignDate : undefined;
    success(res, await handoverService.previewResignation(Number(req.params.id), resignDate));
  } catch (error) {
    next(error);
  }
}

export async function resign(req: Request, res: Response, next: NextFunction) {
  try {
    success(
      res,
      await handoverService.resignEmployee({
        employeeId: Number(req.params.id),
        successorId: Number(req.body.successorId),
        resignDate: req.body.resignDate
      }),
      '离职办理完成，班次与门店负责人已交接'
    );
  } catch (error) {
    next(error);
  }
}
