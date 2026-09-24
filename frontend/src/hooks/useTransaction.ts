import { useTransactionStore } from '@/stores/transactionStore';

export function useTransaction() {
  const store = useTransactionStore();
  return { transactions: store, loadTransactions: store.load };
}
