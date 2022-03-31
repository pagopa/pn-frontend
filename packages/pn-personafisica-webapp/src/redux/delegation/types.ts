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
  status: 'active' | 'pending';
  visibilityIds: Array<{
    name: string;
    uniqueIdentifier: string;
  }>;
  verificationCode: string;
  datefrom: string;
  dateto: string;
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
  type?: string;
  status?: number;
  title?: string;
  detail?: string;
}
