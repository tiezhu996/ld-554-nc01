import type { NextFunction, Request, Response } from 'express';
import * as shiftService from '../services/shift.service.js';
import { created, success } from '../utils/response.js';

export async function index(req: Request, res: Response, next: NextFunction) {
  try {
    success(res, await shiftService.listShifts(req.query, req.user));
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    created(res, await shiftService.createShift(req.body));
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    success(res, await shiftService.updateShift(Number(req.params.id), req.body));
  } catch (error) {
    next(error);
  }
}

export async function autoGenerate(req: Request, res: Response, next: NextFunction) {
  try {
    success(res, await shiftService.autoGenerateShifts(Number(req.body.storeId), req.body.date));
  } catch (error) {
    next(error);
  }
}
