import { defineStore } from 'pinia';
import { loginApi } from '@/api/auth';
import { clearSession, getToken, getUser, setSession, type LocalUser } from '@/utils/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: getToken(),
    user: getUser() as LocalUser | null
  }),
  actions: {
    async login(username: string, password: string) {
      const response = await loginApi({ username, password }) as { data: { token: string; user: LocalUser } };
      this.token = response.data.token;
      this.user = response.data.user;
      setSession(response.data.token, response.data.user);
    },
    logout() {
      this.token = null;
      this.user = null;
      clearSession();
    }
  }
});
