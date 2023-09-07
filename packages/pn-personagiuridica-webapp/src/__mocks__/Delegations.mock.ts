import { Delegate, Delegation, DelegationStatus, Delegator } from '../models/Deleghe';

export const mockCreateDelegation = {
  delegate: {
    firstName: 'Davide',
    lastName: 'Legato',
    displayName: 'Davide Legato',
    companyName: 'eni',
    fiscalCode: 'DVDLGT83C12H501C',
    person: true,
  },
  visibilityIds: [
    {
      name: 'Agenzia Entrate',
      uniqueIdentifier: '123456789',
    },
  ],
  verificationCode: '123456',
  dateto: '2022-04-16',
};

export const arrayOfDelegates: Array<Delegate> = [
  {
    mandateId: '1',
    delegate: {
      displayName: 'Marco Verdi',
      firstName: 'Marco',
      lastName: 'Verdi',
      companyName: 'eni',
      fiscalCode: 'MRCVRD83C12H501C',
      person: true,
    },
    status: 'pending' as DelegationStatus,
    visibilityIds: [
      {
        name: 'Agenzia Entrate',
        uniqueIdentifier: '123456789',
      },
    ],
    verificationCode: '123456',
    datefrom: '2021-12-15',
    dateto: '2022-04-17',
  },
  {
    mandateId: '2',
    delegate: {
      displayName: 'Davide Legato',
      firstName: 'Davide',
      lastName: 'Legato',
      companyName: 'eni',
      fiscalCode: 'DVDLGT83C12H501C',
      person: true,
    },
    status: 'active' as DelegationStatus,
    visibilityIds: [
      {
        name: 'Agenzia Entrate',
        uniqueIdentifier: '123456789',
      },
    ],
    verificationCode: '123456',
    datefrom: '2021-12-15',
    dateto: '2023-04-07',
  },
];

export const arrayOfDelegators: Array<Delegator> = [
  {
    mandateId: '3',
    delegator: {
      displayName: 'Marco Verdi',
      firstName: 'Marco',
      lastName: 'Verdi',
      companyName: 'eni',
      fiscalCode: 'MRCVRD83C12H501C',
      person: true,
    },
    status: 'pending' as DelegationStatus,
    visibilityIds: [
      {
        name: 'Agenzia Entrate',
        uniqueIdentifier: '123456789',
      },
    ],
    verificationCode: '123456',
    datefrom: '2021-12-15',
    dateto: '2022-04-16',
    groups: [],
  },
  {
    mandateId: '4',
    delegator: {
      displayName: 'Davide Legato',
      firstName: 'Davide',
      lastName: 'Legato',
      companyName: 'eni',
      fiscalCode: 'DVDLGT83C12H501C',
      person: true,
    },
    status: 'active' as DelegationStatus,
    visibilityIds: [
      {
        name: 'Agenzia Entrate',
        uniqueIdentifier: '123456789',
      },
    ],
    verificationCode: '123456',
    datefrom: '2021-12-15',
    dateto: '2022-04-16',
    groups: [],
  },
];

export const initialState = {
  delegations: {
    delegators: [] as Array<Delegation>,
    delegates: [] as Array<Delegation>,
  },
  pagination: {
    moreResult: false,
    nextPagesKey: [],
  },
  groups: [],
  filters: {
    size: 10,
    page: 0,
  },
};
