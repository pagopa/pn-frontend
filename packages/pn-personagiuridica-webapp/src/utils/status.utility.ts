export enum DelegationStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
}

export function getDelegationStatusLabelAndColor(status: 'active' | 'pending'): {
  color: 'warning' | 'success' | 'info' | undefined;
  label: string;
} {
  switch (status) {
    case DelegationStatus.ACTIVE:
      return {
        color: 'success',
        label: 'Attiva',
      };
    case DelegationStatus.PENDING:
      return {
        color: 'warning',
        label: 'In attesa di conferma',
      };
    default:
      return {
        color: 'info',
        label: 'Non definito',
      };
  }
}

export const DelegationAllowedStatus = [
  { value: 'All', label: 'Tutti gli stati' },
  { value: DelegationStatus.ACTIVE, label: 'Active' },
  { value: DelegationStatus.PENDING, label: 'In attesa di conferma' },
];
