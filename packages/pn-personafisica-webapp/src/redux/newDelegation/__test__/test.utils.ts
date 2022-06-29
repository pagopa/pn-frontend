export const initialState = {
  created: false,
  error: false,
  entities: [],
};

export const createDelegationPayload = {
  selectPersonaFisicaOrPersonaGiuridica: 'pf',
  codiceFiscale: 'fiscalCode',
  email: 'test@email.com',
  nome: 'nome',
  cognome: 'cognome',
  selectTuttiEntiOrSelezionati: 'tuttiGliEnti',
  expirationDate: new Date(),
  enteSelect: { name: '', uniqueIdentifier: '' },
  verificationCode: '00000',
};

export const createDelegationSelectedPayload = {
  selectPersonaFisicaOrPersonaGiuridica: 'pf',
  codiceFiscale: 'fiscalCode',
  email: 'test@email.com',
  nome: 'nome',
  cognome: 'cognome',
  selectTuttiEntiOrSelezionati: 'entiSelezionati',
  expirationDate: new Date(),
  enteSelect: { name: 'test', uniqueIdentifier: 'test' },
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
    status: 401
  }
};

export const createDelegationDuplicatedErrorResponse = {
  response: {
    status: 402,
    customMessage: {
      title: 'custom-title',
      message: 'custom-message'
    }
  }
};