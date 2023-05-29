import { RecipientType } from '@pagopa-pn/pn-commons';
import { DelegationParty } from '../../models/Deleghe';
import { Party } from '../../models/party';
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
  visibilityIds: Array<DelegationParty>;
  verificationCode: string;
  datefrom: string;
  dateto: string;
}

export interface Delegator extends IDelegation {
  delegator: Person | null;
}

export interface Delegate extends IDelegation {
  delegate: Person | null;
}

export type Delegation = Delegator | Delegate;

export interface RevocationModalProps {
  open: boolean;
  id: string;
  type: string;
}

export interface Person {
  firstName?: string;
  lastName?: string;
  displayName: string;
  companyName?: string;
  fiscalCode: string;
  person: boolean;
}

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
export interface AcceptDelegationResponse {
  id: string;
}

export interface CreateDelegationProps {
  delegate: Person;
  visibilityIds: Array<DelegationParty>;
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
  visibilityIds: Array<DelegationParty>;
}
