import { Router } from 'express';
import * as controller from '../controllers/transaction.controller.js';
import { UserRole } from '../constants/enums.js';
import { auditMiddleware } from '../middlewares/audit.middleware.js';
import { requireRoles } from '../middlewares/rbac.middleware.js';
import { requireFields } from '../middlewares/validator.middleware.js';

export const transactionRoutes = Router();

transactionRoutes.get('/', requireRoles([UserRole.OWNER, UserRole.MANAGER]), controller.index);
transactionRoutes.post('/', requireRoles([UserRole.OWNER, UserRole.MANAGER]), requireFields(['type', 'category', 'amount', 'description', 'storeId', 'date']), auditMiddleware('CREATE_TRANSACTION', 'transactions'), controller.create);
transactionRoutes.put('/:id', requireRoles([UserRole.OWNER]), auditMiddleware('UPDATE_TRANSACTION', 'transactions'), controller.update);
transactionRoutes.delete('/:id', requireRoles([UserRole.OWNER]), auditMiddleware('DELETE_TRANSACTION', 'transactions'), controller.remove);
