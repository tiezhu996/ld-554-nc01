import { computed } from 'vue';
import { UserRole, type UserRoleValue } from '@/constants/enums';
import { useAuthStore } from '@/stores/authStore';

export function usePermission() {
  const auth = useAuthStore();
  const role = computed(() => auth.user?.role);
  const can = (roles: UserRoleValue[]) => Boolean(role.value && roles.includes(role.value));
  return {
    role,
    can,
    isOwner: computed(() => role.value === UserRole.OWNER),
    isManager: computed(() => role.value === UserRole.MANAGER)
  };
}
