import { defineStore } from 'pinia';
import { fetchStores } from '@/api/store';
import type { Store } from '@/types/store';

export const useStoreStore = defineStore('stores', {
  state: () => ({ list: [] as Store[], total: 0 }),
  actions: {
    async load(params = {}) {
      const response = await fetchStores(params) as { data: { list: Store[]; total: number } };
      this.list = response.data.list;
      this.total = response.data.total;
    }
  }
});
