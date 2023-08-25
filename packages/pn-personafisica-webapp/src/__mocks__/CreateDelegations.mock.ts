import { RecipientType } from '@pagopa-pn/pn-commons';

import { CreateDelegationResponse, NewDelegationFormProps } from '../redux/delegation/types';

export const createDelegationPayload: NewDelegationFormProps = {
  selectPersonaFisicaOrPersonaGiuridica: RecipientType.PF,
  codiceFiscale: 'fiscalCode',
  nome: 'nome',
  cognome: 'cognome',
  ragioneSociale: 'Foo SAS di Anonimo',
  selectTuttiEntiOrSelezionati: 'tuttiGliEnti',
  expirationDate: new Date(),
  enti: [{ name: '', id: '' }],
  verificationCode: '00000',
};

export const createDelegationSelectedPayload: NewDelegationFormProps = {
  ...createDelegationPayload,
  selectTuttiEntiOrSelezionati: 'entiSelezionati',
  enti: [{ name: 'test', id: 'test' }],
};

export const createDelegationResponse: CreateDelegationResponse = {
  datefrom: '2022-01-01',
  dateto: '2022-01-02',
  delegate: {
    firstName: 'nome',
    lastName: 'cognome',
    displayName: 'nome cognome',
    fiscalCode: 'fiscalCode',
    companyName: 'companyName',
    person: true,
  },
  delegator: null,
  mandateId: '1',
  status: 'pending',
  verificationCode: '00000',
  visibilityIds: [],
};

export const createDelegationGenericErrorResponse = {
  status: 401,
};

export const createDelegationDuplicatedErrorResponse = {
  detail: 'Non è possibile creare due deleghe per lo stesso delegato',
  errors: [],
  status: 400,
  title: 'Delega già presente',
  traceId:
    'Self=1-62cfe68e-42c58950706157804fcb5f44;Root=1-62cfe68e-6635717822bd2bb604a51bb2;Parent=618f0c8aa046eb8a;Sampled=1',
};
