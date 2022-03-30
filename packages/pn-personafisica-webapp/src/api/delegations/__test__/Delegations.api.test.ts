import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '../../axios';
import { mockAuthentication } from '../../../redux/auth/__test__/reducers.test';
import { DelegationsApi } from '../Delegations.api';
import { Delegation } from '../../../redux/delegation/types';

const mockDelegation = {
  delegate: {
    firstName: 'Davide',
    lastName: 'Legato',
    companyName: 'eni',
    fiscalCode: 'DVDLGT83C12H501C',
    person: true,
    email: 'email@falsa.it',
  },
  visibilityIds: [
    {
      name: 'Agenzia Entrate',
      uniqueIdentifier: '123456789',
    },
  ],
  verificationCode: '123456',
  dateto: '16-04-2022',
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
      email: 'email@falsa.it',
    },
    delegate: {
      firstName: 'Marco',
      lastName: 'Verdi',
      companyName: 'eni',
      fiscalCode: 'MRCVRD83C12H501C',
      person: true,
      email: 'email@falsa.it',
    },
    status: 'Pending' as const,
    visibilityIds: [
      {
        name: 'Agenzia Entrate',
        uniqueIdentifier: '123456789',
      },
    ],
    verificationCode: '123456',
    datefrom: '15-12-2021',
    dateto: '16-04-2022',
  },
  {
    mandateId: '1',
    delegator: {
      firstName: 'Mario',
      lastName: 'Rossi',
      companyName: 'eni',
      fiscalCode: 'MRIRSS68P24H501C',
      person: true,
      email: 'email@falsa.it',
    },
    delegate: {
      firstName: 'Davide',
      lastName: 'Legato',
      companyName: 'eni',
      fiscalCode: 'DVDLGT83C12H501C',
      person: true,
      email: 'email@falsa.it',
    },
    status: 'Active' as const,
    visibilityIds: [
      {
        name: 'Agenzia Entrate',
        uniqueIdentifier: '123456789',
      },
    ],
    verificationCode: '123456',
    datefrom: '15-12-2021',
    dateto: '16-04-2022',
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
      email: 'email@falsa.it',
    },
    delegate: {
      firstName: 'Mario',
      lastName: 'Rossi',
      companyName: 'eni',
      fiscalCode: 'MRIRSS68P24H501C',
      person: true,
      email: 'email@falsa.it',
    },
    status: 'Pending' as const,
    visibilityIds: [
      {
        name: 'Agenzia Entrate',
        uniqueIdentifier: '123456789',
      },
    ],
    verificationCode: '123456',
    datefrom: '15-12-2021',
    dateto: '16-04-2022',
  },
  {
    mandateId: '4',
    delegator: {
      firstName: 'Davide',
      lastName: 'Legato',
      companyName: 'eni',
      fiscalCode: 'DVDLGT83C12H501C',
      person: true,
      email: 'email@falsa.it',
    },
    delegate: {
      firstName: 'Mario',
      lastName: 'Rossi',
      companyName: 'eni',
      fiscalCode: 'MRIRSS68P24H501C',
      person: true,
      email: 'email@falsa.it',
    },
    status: 'Active' as const,
    visibilityIds: [
      {
        name: 'Agenzia Entrate',
        uniqueIdentifier: '123456789',
      },
    ],
    verificationCode: '123456',
    datefrom: '15-12-2021',
    dateto: '16-04-2022',
  },
];

export async function getDelegates(response: Array<Delegation>) {
  const axiosMock = new MockAdapter(apiClient);
  axiosMock.onGet(`/mandate/api/v1/mandates-by-delegate`).reply(200, response);
  const res = await DelegationsApi.getDelegates();
  axiosMock.reset();
  axiosMock.restore();
  return res;
}

export async function getDelegators(response: Array<Delegation>) {
  const axiosMock = new MockAdapter(apiClient);
  axiosMock.onGet(`/mandate/api/v1/mandates-by-delegator`).reply(200, response);
  const res = await DelegationsApi.getDelegators();
  axiosMock.reset();
  axiosMock.restore();
  return res;
}

async function createDelegation() {
  const axiosMock = new MockAdapter(apiClient);
  axiosMock.onPost(`/mandate/api/v1/mandate`).reply(200, mockDelegation);
  const res = await DelegationsApi.createDelegation(mockDelegation);
  axiosMock.reset();
  axiosMock.restore();
  return res;
}

describe('Delegations api tests', () => {
  mockAuthentication();

  it('gets non empty delegates', async () => {
    const res = await getDelegates(arrayOfDelegates);
    expect(res).toStrictEqual(arrayOfDelegates);
  });

  it('gets empty delegates', async () => {
    const res = await getDelegates([]);
    expect(res).toHaveLength(0);
  });

  it('gets non empty delegators', async () => {
    const res = await getDelegators(arrayOfDelegators);
    expect(res).toStrictEqual(arrayOfDelegators);
  });

  it('gets empty delegators', async () => {
    const res = await getDelegators([]);
    expect(res).toHaveLength(0);
  });

  it('revokes a delegation', async () => {
    const mock = new MockAdapter(apiClient);
    mock.onPatch('/mandate/api/v1/mandate/7/revoke').reply(204);
    const res = await DelegationsApi.revokeDelegation('7');
    expect(res).toStrictEqual({ id: '7' });
    mock.reset();
    mock.restore();
  });

  it('creates a new delegation', async () => {
    const mock = new MockAdapter(apiClient);
    mock.onPatch('/mandate/api/v1/mandate').reply(204);
    const res = await createDelegation();
    expect(res).toStrictEqual('success');
    mock.reset();
    mock.restore();
  });
});
