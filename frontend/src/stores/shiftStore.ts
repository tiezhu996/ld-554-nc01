import { defineStore } from 'pinia';
import { fetchShifts } from '@/api/shift';
import type { Shift } from '@/types/shift';

export const useShiftStore = defineStore('shifts', {
  state: () => ({ list: [] as Shift[], total: 0 }),
  actions: {
    async load(params = {}) {
      const response = await fetchShifts(params) as { data: { list: Shift[]; total: number } };
      this.list = response.data.list;
      this.total = response.data.total;
    }
  }
});
