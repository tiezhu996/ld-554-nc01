import type { NextFunction, Request, Response } from 'express';
import * as transactionService from '../services/transaction.service.js';
import { created, success } from '../utils/response.js';

export async function index(req: Request, res: Response, next: NextFunction) {
  try {
    success(res, await transactionService.listTransactions(req.query, req.user));
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    created(res, await transactionService.createTransaction(req.body));
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    success(res, await transactionService.updateTransaction(Number(req.params.id), req.body));
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await transactionService.deleteTransaction(Number(req.params.id));
    success(res);
  } catch (error) {
    next(error);
  }
}
