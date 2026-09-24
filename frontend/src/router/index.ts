import { createRouter, createWebHistory } from 'vue-router';
import { dashboardRoutes } from './routes/dashboard';
import { employeeRoutes } from './routes/employees';
import { scheduleRoutes } from './routes/schedule';
import { financeRoutes } from './routes/finance';
import { storeRoutes } from './routes/stores';
import { setupGuards } from './guards';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/login', name: 'login', component: () => import('@/pages/Login.vue') },
    ...dashboardRoutes,
    ...employeeRoutes,
    ...scheduleRoutes,
    ...financeRoutes,
    ...storeRoutes
  ]
});

setupGuards(router);

export default router;
