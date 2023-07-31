import { DelegationStatus } from '../models/Deleghe';

export function getDelegationStatusKeyAndColor(status: DelegationStatus): {
  color: 'warning' | 'success' | 'info' | undefined;
  key: string;
} {
  switch (status) {
    case DelegationStatus.ACTIVE:
      return {
        color: 'success',
        key: `deleghe.table.${DelegationStatus.ACTIVE}`,
      };
    case DelegationStatus.PENDING:
      return {
        color: 'warning',
        key: `deleghe.table.${DelegationStatus.PENDING}`,
      };
    default:
      return {
        color: 'info',
        key: '',
      };
  }
}

export const DelegationAllowedStatus = [
  { value: 'All', label: 'Tutti gli stati' },
  { value: DelegationStatus.ACTIVE, label: 'Active' },
  { value: DelegationStatus.PENDING, label: 'In attesa di conferma' },
];
