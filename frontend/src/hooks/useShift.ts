import { useShiftStore } from '@/stores/shiftStore';

export function useShift() {
  const store = useShiftStore();
  return { shifts: store, loadShifts: store.load };
}
