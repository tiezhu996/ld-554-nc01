import { Router } from 'express';
import * as controller from '../controllers/employee.controller.js';
import * as offboardingController from '../controllers/offboarding.controller.js';
import { UserRole } from '../constants/enums.js';
import { auditMiddleware } from '../middlewares/audit.middleware.js';
import { requireRoles } from '../middlewares/rbac.middleware.js';
import { requireFields } from '../middlewares/validator.middleware.js';

export const employeeRoutes = Router();

employeeRoutes.get('/', controller.index);
employeeRoutes.get('/:id', controller.show);
employeeRoutes.post('/', requireRoles([UserRole.OWNER, UserRole.MANAGER]), requireFields(['name', 'department', 'position', 'phone', 'email', 'joinDate', 'status', 'salary', 'role']), auditMiddleware('CREATE_EMPLOYEE', 'employees'), controller.create);
employeeRoutes.post('/:id/resign-preview', requireRoles([UserRole.OWNER, UserRole.MANAGER]), offboardingController.preview);
employeeRoutes.post('/:id/resign', requireRoles([UserRole.OWNER, UserRole.MANAGER]), requireFields(['successorId']), auditMiddleware('RESIGN_EMPLOYEE', 'employees'), offboardingController.resign);
employeeRoutes.put('/:id', requireRoles([UserRole.OWNER, UserRole.MANAGER]), auditMiddleware('UPDATE_EMPLOYEE', 'employees'), controller.update);
employeeRoutes.delete('/:id', requireRoles([UserRole.OWNER]), auditMiddleware('DELETE_EMPLOYEE', 'employees'), controller.remove);
