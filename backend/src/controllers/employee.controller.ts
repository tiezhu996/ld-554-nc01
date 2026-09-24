import type { NextFunction, Request, Response } from 'express';
import * as employeeService from '../services/employee.service.js';
import { created, success } from '../utils/response.js';

export async function index(req: Request, res: Response, next: NextFunction) {
  try {
    success(res, await employeeService.listEmployees(req.query, req.user));
  } catch (error) {
    next(error);
  }
}

export async function show(req: Request, res: Response, next: NextFunction) {
  try {
    success(res, await employeeService.getEmployee(Number(req.params.id)));
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    created(res, await employeeService.createEmployee(req.body));
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    success(res, await employeeService.updateEmployee(Number(req.params.id), req.body));
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await employeeService.deleteEmployee(Number(req.params.id));
    success(res);
  } catch (error) {
    next(error);
  }
}
