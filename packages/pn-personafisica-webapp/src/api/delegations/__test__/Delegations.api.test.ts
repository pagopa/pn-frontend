import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '../../axios';
import { mockAuthentication } from '../../../redux/auth/__test__/reducers.test';
import { DelegationsApi } from '../Delegations.api';

const mockDelegation = {
  mandateId: '1',
  delegator: {
    firstName: 'Mario',
    lastName: 'Rossi',
    companyName: 'eni',
    fiscalCode: 'MRIRSS68P24H501C',
    person: true,
  },
  delegate: {
    firstName: 'Davide',
    lastName: 'Legato',
    companyName: 'eni',
    fiscalCode: 'DVDLGT83C12H501C',
    person: true,
  },
  status: 'Active',
  visibilityIds: [
    {
      name: 'Agenzia Entrate',
      uniqueIdentifier: '123456789',
    },
  ],
  verificationCode: '123456',
  datefrom: '15-12-2021',
  dateto: '16-04-2022',
  email: 'email@falsa.it',
};

const arrayOfDelegates = [
  {
    mandateId: '1',
    delegator: {
      firstName: 'Mario',
      lastName: 'Rossi',
      companyName: 'eni',
      fiscalCode: 'MRIRSS68P24H501C',
      person: true,
    },
    delegate: {
      firstName: 'Marco',
      lastName: 'Verdi',
      companyName: 'eni',
      fiscalCode: 'MRCVRD83C12H501C',
      person: true,
    },
    status: 'Active',
    visibilityIds: [
      {
        name: 'Agenzia Entrate',
        uniqueIdentifier: '123456789',
      },
    ],
    verificationCode: '123456',
    datefrom: '15-12-2021',
    dateto: '16-04-2022',
    email: 'email@falsa.it',
  },
  {
    mandateId: '1',
    delegator: {
      firstName: 'Mario',
      lastName: 'Rossi',
      companyName: 'eni',
      fiscalCode: 'MRIRSS68P24H501C',
      person: true,
    },
    delegate: {
      firstName: 'Davide',
      lastName: 'Legato',
      companyName: 'eni',
      fiscalCode: 'DVDLGT83C12H501C',
      person: true,
    },
    status: 'Active',
    visibilityIds: [
      {
        name: 'Agenzia Entrate',
        uniqueIdentifier: '123456789',
      },
    ],
    verificationCode: '123456',
    datefrom: '15-12-2021',
    dateto: '16-04-2022',
    email: 'email@falsa.it',
  },
];

const arrayOfDelegators = [
  {
    mandateId: '3',
    delegator: {
      firstName: 'Marco',
      lastName: 'Verdi',
      companyName: 'eni',
      fiscalCode: 'MRCVRD83C12H501C',
      person: true,
    },
    delegate: {
      firstName: 'Mario',
      lastName: 'Rossi',
      companyName: 'eni',
      fiscalCode: 'MRIRSS68P24H501C',
      person: true,
    },
    status: 'Pending',
    visibilityIds: [
      {
        name: 'Agenzia Entrate',
        uniqueIdentifier: '123456789',
      },
    ],
    verificationCode: '123456',
    datefrom: '15-12-2021',
    dateto: '16-04-2022',
    email: 'email@falsa.it',
  },
  {
    mandateId: '4',
    delegator: {
      firstName: 'Davide',
      lastName: 'Legato',
      companyName: 'eni',
      fiscalCode: 'DVDLGT83C12H501C',
      person: true,
    },
    delegate: {
      firstName: 'Mario',
      lastName: 'Rossi',
      companyName: 'eni',
      fiscalCode: 'MRIRSS68P24H501C',
      person: true,
    },
    status: 'Active',
    visibilityIds: [
      {
        name: 'Agenzia Entrate',
        uniqueIdentifier: '123456789',
      },
    ],
    verificationCode: '123456',
    datefrom: '15-12-2021',
    dateto: '16-04-2022',
    email: 'email@falsa.it',
  },
];

export async function getDelegates() {
  const axiosMock = new MockAdapter(apiClient);
  axiosMock.onGet(`/mandates-by-delegate`).reply(200, arrayOfDelegates);
  const res = await DelegationsApi.getDelegates();
  axiosMock.reset();
  axiosMock.restore();
  return res;
}

export async function getDelegators() {
  const axiosMock = new MockAdapter(apiClient);
  axiosMock.onGet(`/mandates-by-delegators`).reply(200, arrayOfDelegators);
  const res = await DelegationsApi.getDelegators();
  axiosMock.reset();
  axiosMock.restore();
  return res;
}

async function createDelegation() {
  const axiosMock = new MockAdapter(apiClient);
  axiosMock.onPost(`/mandate`).reply(200, mockDelegation);
  const res = await DelegationsApi.createDelegation(mockDelegation);
  axiosMock.reset();
  axiosMock.restore();
  return res;
}

describe('Delegations api tests', () => {
  mockAuthentication();

  it('get delegates', async () => {
    const res = await getDelegates();
    expect(res.data).toStrictEqual(arrayOfDelegates);
  });

  it('get delegators', async () => {
    const res = await getDelegators();
    expect(res.data).toStrictEqual(arrayOfDelegators);
  });

  it('revokes a delegation', async () => {
    const mock = new MockAdapter(apiClient);
    mock.onPatch('/delegations/7/revoke').reply(204);
    const res = await DelegationsApi.revokeDelegation('7');
    expect(res).toStrictEqual({ id: '7' });
    mock.reset();
    mock.restore();
  });

  it('creates a new delegation', async () => {
    const mock = new MockAdapter(apiClient);
    mock.onPatch('/mandate').reply(204);
    const res = await createDelegation();
    expect(res).toStrictEqual(mockDelegation);
    mock.reset();
    mock.restore();
  });
});
