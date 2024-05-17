import { RecipientType } from '@pagopa-pn/pn-commons';

import { Party } from './party';

export type DelegationData = {
  name: string;
  startDate: string;
  endDate: string;
  visibilityIds: Array<string>;
  groups: Array<{ id: string; name: string }>;
  status: DelegationStatus;
  verificationCode: string;
};

export type DelegationColumnData = DelegationData & { menu: string };

export interface NewDelegationFormProps {
  selectPersonaFisicaOrPersonaGiuridica: RecipientType;
  codiceFiscale: string;
  nome: string;
  cognome: string;
  ragioneSociale: string;
  selectTuttiEntiOrSelezionati: string;
  expirationDate: Date;
  enti: Array<Party>;
  verificationCode: string;
}

export interface Person {
  firstName?: string;
  lastName?: string;
  displayName: string;
  companyName?: string;
  fiscalCode: string;
  person: boolean;
}

type DelegationParty = { name: string; uniqueIdentifier: string };

export interface NewMandateRequest {
  delegate: Person;
  visibilityIds: Array<DelegationParty>;
  verificationCode: string;
  dateto: string;
}

export enum DelegationStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  REJECTED = 'rejected',
}

interface IDelegation {
  mandateId: string;
  status: DelegationStatus;
  visibilityIds: Array<{
    name: string;
    uniqueIdentifier: string;
  }>;
  verificationCode: string;
  datefrom: string;
  dateto: string;
  groups?: Array<{ id: string; name: string }>;
}

export interface Delegator extends IDelegation {
  delegator: Person | null;
}

export interface Delegate extends IDelegation {
  delegate: Person | null;
}

interface GetDelegatorsParams {
  size: number;
  nextPageKey?: string;
}

interface GetDelegatorsRequest {
  taxId?: string;
  groups?: Array<string>;
  status?: Array<DelegationStatus>;
}

export interface GetDelegatorsResponse {
  resultsPage: Array<Delegator>;
  moreResult: boolean;
  nextPagesKey: Array<string>;
}

export type GetDelegatorsFilters = GetDelegatorsParams & GetDelegatorsRequest;

export type DelegatorsFormFilters = Omit<GetDelegatorsFilters, 'nextPageKey'> & { page: number };
