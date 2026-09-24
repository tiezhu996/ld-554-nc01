import type { NextFunction, Request, Response } from 'express';
import { appConfig } from '../config/app.js';
import { logger } from '../utils/logger.js';

export function errorHandler(err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status ?? 500;
  logger.error(err.message);
  res.status(status).json({
    code: status,
    message: status === 500 && appConfig.nodeEnv === 'production' ? '服务器错误' : err.message,
    data: appConfig.nodeEnv === 'production' ? {} : { stack: err.stack }
  });
}
