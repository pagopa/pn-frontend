export enum GroupStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

export interface Groups {
  id: string;
  name: string;
  status: GroupStatus;
}
