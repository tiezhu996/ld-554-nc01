import { Router } from 'express';
import * as controller from '../controllers/employee.controller.js';
import { UserRole } from '../constants/enums.js';
import { auditMiddleware } from '../middlewares/audit.middleware.js';
import { requireRoles } from '../middlewares/rbac.middleware.js';
import { requireFields } from '../middlewares/validator.middleware.js';

export const employeeRoutes = Router();

employeeRoutes.get('/', controller.index);
employeeRoutes.get('/:id', controller.show);
employeeRoutes.post('/', requireRoles([UserRole.OWNER, UserRole.MANAGER]), requireFields(['name', 'department', 'position', 'phone', 'email', 'joinDate', 'status', 'salary', 'role']), auditMiddleware('CREATE_EMPLOYEE', 'employees'), controller.create);
employeeRoutes.put('/:id', requireRoles([UserRole.OWNER, UserRole.MANAGER]), auditMiddleware('UPDATE_EMPLOYEE', 'employees'), controller.update);
employeeRoutes.delete('/:id', requireRoles([UserRole.OWNER]), auditMiddleware('DELETE_EMPLOYEE', 'employees'), controller.remove);
