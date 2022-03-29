import { User } from '../auth/types';

export type UserAndDelegations = User & DelegationsList;

export interface DelegationsList {
  delegators: Array<Delegation>;
  delegations: Array<Delegation>;
  isCompany: boolean;
}

export interface Delegation {
  mandateId: string;
  delegator: Person;
  delegate: Person;
  status: 'Active' | 'Pending';
  visibilityIds: Array<{
    name: string;
    uniqueIdentifier: string;
  }>;
  verificationCode: string;
  datefrom: string;
  dateto: string;
  email: string;
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

export interface Person {
  firstName: string;
  lastName: string;
  companyName: string;
  fiscalCode: string;
  person: boolean;
  email: string;
}
