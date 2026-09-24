import { Router } from 'express';
import * as controller from '../controllers/shift.controller.js';
import { UserRole } from '../constants/enums.js';
import { auditMiddleware } from '../middlewares/audit.middleware.js';
import { requireRoles } from '../middlewares/rbac.middleware.js';
import { requireFields } from '../middlewares/validator.middleware.js';

export const shiftRoutes = Router();

shiftRoutes.get('/', controller.index);
shiftRoutes.post('/', requireRoles([UserRole.OWNER, UserRole.MANAGER]), requireFields(['employeeId', 'date', 'shiftType', 'startTime', 'endTime', 'storeId']), auditMiddleware('CREATE_SHIFT', 'shifts'), controller.create);
shiftRoutes.post('/auto-generate', requireRoles([UserRole.OWNER, UserRole.MANAGER]), requireFields(['storeId', 'date']), auditMiddleware('AUTO_GENERATE_SHIFT', 'shifts'), controller.autoGenerate);
shiftRoutes.put('/:id', requireRoles([UserRole.OWNER, UserRole.MANAGER]), auditMiddleware('UPDATE_SHIFT', 'shifts'), controller.update);
