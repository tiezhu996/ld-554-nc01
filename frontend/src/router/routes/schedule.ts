export const scheduleRoutes = [
  { path: '/schedule', name: 'schedule', component: () => import('@/pages/schedule/ScheduleWeek.vue'), meta: { roles: ['OWNER', 'MANAGER', 'EMPLOYEE'] } }
];
