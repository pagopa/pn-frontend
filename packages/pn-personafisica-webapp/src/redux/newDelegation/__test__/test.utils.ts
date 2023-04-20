import { RecipientType } from '@pagopa-pn/pn-commons';

export const initialState = {
  created: false,
  error: false,
  entities: [],
};

export const createDelegationPayload = {
  selectPersonaFisicaOrPersonaGiuridica: RecipientType.PF,
  codiceFiscale: 'fiscalCode',
  email: 'test@email.com',
  nome: 'nome',
  cognome: 'cognome',
  selectTuttiEntiOrSelezionati: 'tuttiGliEnti',
  expirationDate: new Date(),
  enti: [{ name: '', id: '' }],
  verificationCode: '00000',
};

export const createDelegationSelectedPayload = {
  selectPersonaFisicaOrPersonaGiuridica: RecipientType.PF,
  codiceFiscale: 'fiscalCode',
  email: 'test@email.com',
  nome: 'nome',
  cognome: 'cognome',
  selectTuttiEntiOrSelezionati: 'entiSelezionati',
  expirationDate: new Date(),
  enti: [{ name: 'test', id: 'test' }],
  verificationCode: '00000',
};

export const createDelegationResponse = {
  datefrom: '2022-01-01',
  dateto: '2022-01-02',
  delegate: {
    firstName: 'nome',
    lastName: 'cognome',
    fiscalCode: 'fiscalCode',
    companyName: null,
    person: true,
    email: 'email@test.com',
  },
  delegator: null,
  mandateId: '1',
  status: 'pending',
  verificationCode: '00000',
  visibilityIds: [],
};

export const createDelegationGenericErrorResponse = {
  response: {
    data: {
      status: 401,
    },
  },
};

export const createDelegationDuplicatedErrorResponse = {
  response: {
    data: {
      detail: 'Non è possibile creare due deleghe per lo stesso delegato',
      errors: [],
      status: 400,
      title: 'Delega già presente',
      traceId:
        'Self=1-62cfe68e-42c58950706157804fcb5f44;Root=1-62cfe68e-6635717822bd2bb604a51bb2;Parent=618f0c8aa046eb8a;Sampled=1',
    },
  },
};
