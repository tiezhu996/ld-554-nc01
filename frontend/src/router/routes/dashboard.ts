export const dashboardRoutes = [
  { path: '/dashboard', name: 'dashboard', component: () => import('@/pages/Dashboard.vue'), meta: { roles: ['OWNER', 'MANAGER', 'EMPLOYEE'] } }
];
