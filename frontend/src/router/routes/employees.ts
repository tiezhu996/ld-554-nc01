export const employeeRoutes = [
  { path: '/employees', name: 'employees', component: () => import('@/pages/employees/EmployeeList.vue'), meta: { roles: ['OWNER', 'MANAGER', 'EMPLOYEE'] } }
];
