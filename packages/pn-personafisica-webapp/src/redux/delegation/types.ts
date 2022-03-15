import { User } from '../auth/types';
import { DelegationStatus } from '../../utils/status.utility';

export type UserAndDelegations = User & DelegationsList;

export interface DelegationsList {
  delegators: Array<Delegation>;
  delegations: Array<Delegation>;
  isCompany: boolean;
}

export interface Delegation {
  id: string;
  user: Omit<User, 'uid' | 'exp'>;
  startDate: string;
  endDate: string;
  delegationRole: 'delegator' | 'delegated';
  delegationStatus: DelegationStatus.PENDING | DelegationStatus.ACTIVE;
  visibilityIds: OrganizationId;
  verificationCode: string;
}

export interface OrganizationId {
  id: string;
  role: 'referente operativo' | 'referente amministrativo';
}

export interface RevocationModalProps {
  open: boolean;
  id: string;
  type: string;
}
