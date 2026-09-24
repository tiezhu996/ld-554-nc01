import { Router } from 'express';
import { summary } from '../controllers/dashboard.controller.js';

export const dashboardRoutes = Router();

dashboardRoutes.get('/summary', summary);
