import { useStoreStore } from '@/stores/storeStore';

export function useStore() {
  const store = useStoreStore();
  return { stores: store, loadStores: store.load };
}
