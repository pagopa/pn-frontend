export enum GroupStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export interface Groups {
  id: string;
  name: string;
  description: string;
  status: GroupStatus;
}
