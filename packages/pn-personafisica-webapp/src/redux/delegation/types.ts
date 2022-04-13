import { User } from '../auth/types';

export type UserAndDelegations = User & DelegationsList;

export interface DelegationsList {
  delegators: Array<Delegation>;
  delegations: Array<Delegation>;
  isCompany: boolean;
}

export interface IDelegation {
  mandateId: string;
  status: 'active' | 'pending';
  visibilityIds: Array<{
    name: string;
    uniqueIdentifier: string;
  }>;
  verificationCode: string;
  datefrom: string;
  dateto: string;
}

export interface Delegator extends IDelegation {
  delegator: Person;
}

export interface Delegate extends IDelegation {
  delegate: Person;
}


export type Delegation = Delegator | Delegate;


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
  companyName?: string | null;
  fiscalCode: string;
  person: boolean;
  email: string;
}

export interface NewDelegationFormProps {
  selectPersonaFisicaOrPersonaGiuridica: string;
  codiceFiscale: string;
  email: string;
  nome: string;
  cognome: string;
  selectTuttiEntiOrSelezionati: string;
  expirationDate: number;
  enteSelect: { name: string; uniqueIdentifier: string };
  verificationCode: string;
}
export interface AcceptDelegationResponse {
  id: string;
}

export interface CreateDelegationProps {
  delegate: Person;
  visibilityIds: Array<{
    name: string;
    uniqueIdentifier: string;
  }>;
  verificationCode: string;
  dateto: string;
}

export interface CreateDelegationResponse {
  datefrom: string;
  dateto: string;
  delegate: Person;
  delegator: Person | null;
  mandateId: string;
  status: string;
  verificationCode: string;
  visibilityIds: Array<{
    name: string;
    uniqueIdentifier: string;
  }>;
}

