import { defineStore } from 'pinia';
import { fetchEmployees } from '@/api/employee';
import type { Employee } from '@/types/employee';

export const useEmployeeStore = defineStore('employees', {
  state: () => ({ list: [] as Employee[], total: 0 }),
  actions: {
    async load(params = {}) {
      const response = await fetchEmployees(params) as { data: { list: Employee[]; total: number } };
      this.list = response.data.list;
      this.total = response.data.total;
    }
  }
});
