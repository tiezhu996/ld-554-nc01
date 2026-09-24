import { Router } from 'express';
import * as controller from '../controllers/store.controller.js';
import { UserRole } from '../constants/enums.js';
import { auditMiddleware } from '../middlewares/audit.middleware.js';
import { requireRoles } from '../middlewares/rbac.middleware.js';
import { requireFields } from '../middlewares/validator.middleware.js';

export const storeRoutes = Router();

storeRoutes.get('/', controller.index);
storeRoutes.get('/:id', controller.show);
storeRoutes.post('/', requireRoles([UserRole.OWNER]), requireFields(['name', 'address', 'phone', 'businessHours']), auditMiddleware('CREATE_STORE', 'stores'), controller.create);
storeRoutes.put('/:id', requireRoles([UserRole.OWNER, UserRole.MANAGER]), auditMiddleware('UPDATE_STORE', 'stores'), controller.update);
storeRoutes.delete('/:id', requireRoles([UserRole.OWNER]), auditMiddleware('DELETE_STORE', 'stores'), controller.remove);
