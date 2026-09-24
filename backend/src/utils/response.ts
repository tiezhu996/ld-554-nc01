import type { Response } from 'express';

export function success(res: Response, data: unknown = {}, message = 'success') {
  return res.json({ code: 200, message, data });
}

export function created(res: Response, data: unknown = {}) {
  return res.status(201).json({ code: 201, message: 'created', data });
}
