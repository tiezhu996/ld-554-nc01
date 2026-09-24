export const storeRoutes = [
  { path: '/stores', name: 'stores', component: () => import('@/pages/stores/StoreList.vue'), meta: { roles: ['OWNER', 'MANAGER'] } }
];
