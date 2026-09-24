import { useEmployeeStore } from '@/stores/employeeStore';

export function useEmployee() {
  const store = useEmployeeStore();
  return { employees: store, loadEmployees: store.load };
}
