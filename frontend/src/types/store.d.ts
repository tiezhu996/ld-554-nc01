export interface Store {
  id: number;
  name: string;
  address: string;
  managerId: number | null;
  status: 'OPEN' | 'RENOVATING' | 'CLOSED';
  phone: string;
  businessHours: string;
}
