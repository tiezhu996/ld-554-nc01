import { Router } from 'express';
import * as controller from '../controllers/handover.controller.js';
import { UserRole } from '../constants/enums.js';
import { auditMiddleware } from '../middlewares/audit.middleware.js';
import { requireRoles } from '../middlewares/rbac.middleware.js';
import { requireFields } from '../middlewares/validator.middleware.js';

export const handoverRoutes = Router();

handoverRoutes.get('/:id/resignation/preview', requireRoles([UserRole.OWNER, UserRole.MANAGER]), controller.preview);
handoverRoutes.post(
  '/:id/resignation',
  requireRoles([UserRole.OWNER, UserRole.MANAGER]),
  requireFields(['successorId']),
  auditMiddleware('RESIGN_EMPLOYEE', 'employees'),
  controller.resign
);
