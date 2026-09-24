import type { Router } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '@/stores/authStore';

export function setupGuards(router: Router) {
  router.beforeEach((to) => {
    const auth = useAuthStore();
    if (to.path === '/login') return true;
    if (!auth.token) return '/login';
    const roles = to.meta.roles as string[] | undefined;
    if (roles?.length && auth.user && !roles.includes(auth.user.role)) {
      ElMessage.error('无权限访问该页面');
      return '/dashboard';
    }
    return true;
  });
}
