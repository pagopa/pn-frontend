export enum DelegationStatus {
  ACCEPTED = 'ACCEPTED',
  PENDING = 'PENDING',
}

export function getDelegationStatusLabelAndColor(status: DelegationStatus): {
  color: 'warning' | 'success' | 'info' | undefined;
  label: string;
} {
  switch (status) {
    case DelegationStatus.ACCEPTED:
      return {
        color: 'success',
        label: 'Attiva',
      };
    case DelegationStatus.PENDING:
      return {
        color: 'warning',
        label: 'Attesa conferma',
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
  { value: DelegationStatus.ACCEPTED, label: 'Non valida' },
  { value: DelegationStatus.PENDING, label: 'In Validazione' },
];
