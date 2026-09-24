import { Router } from 'express';
import { loginController } from '../controllers/auth.controller.js';
import { requireFields } from '../middlewares/validator.middleware.js';

export const authRoutes = Router();

authRoutes.post('/login', requireFields(['username', 'password']), loginController);
