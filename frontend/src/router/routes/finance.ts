export const financeRoutes = [
  { path: '/finance', name: 'finance', component: () => import('@/pages/finance/FinanceList.vue'), meta: { roles: ['OWNER', 'MANAGER'] } }
];
