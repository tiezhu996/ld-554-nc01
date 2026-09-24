import { defineStore } from 'pinia';
import { fetchTransactions } from '@/api/transaction';
import type { Transaction } from '@/types/transaction';

export const useTransactionStore = defineStore('transactions', {
  state: () => ({ list: [] as Transaction[], total: 0 }),
  actions: {
    async load(params = {}) {
      const response = await fetchTransactions(params) as { data: { list: Transaction[]; total: number } };
      this.list = response.data.list;
      this.total = response.data.total;
    }
  }
});
