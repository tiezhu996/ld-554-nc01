import type { NextFunction, Request, Response } from 'express';
import * as storeService from '../services/store.service.js';
import { created, success } from '../utils/response.js';

export async function index(req: Request, res: Response, next: NextFunction) {
  try {
    success(res, await storeService.listStores(req.query, req.user));
  } catch (error) {
    next(error);
  }
}

export async function show(req: Request, res: Response, next: NextFunction) {
  try {
    success(res, await storeService.getStore(Number(req.params.id)));
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    created(res, await storeService.createStore(req.body));
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    success(res, await storeService.updateStore(Number(req.params.id), req.body));
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await storeService.deleteStore(Number(req.params.id));
    success(res);
  } catch (error) {
    next(error);
  }
}
