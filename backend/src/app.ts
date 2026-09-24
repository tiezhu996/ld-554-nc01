import cors from 'cors';
import express from 'express';
import './models/index.js';
import { authRoutes } from './routes/auth.routes.js';
import { dashboardRoutes } from './routes/dashboard.routes.js';
import { employeeRoutes } from './routes/employee.routes.js';
import { shiftRoutes } from './routes/shift.routes.js';
import { storeRoutes } from './routes/store.routes.js';
import { transactionRoutes } from './routes/transaction.routes.js';
import { authMiddleware } from './middlewares/auth.middleware.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ code: 200, message: 'success', data: { status: 'ok' } }));
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/employees', authMiddleware, employeeRoutes);
app.use('/api/shifts', authMiddleware, shiftRoutes);
app.use('/api/transactions', authMiddleware, transactionRoutes);
app.use('/api/stores', authMiddleware, storeRoutes);
app.use(errorHandler);
