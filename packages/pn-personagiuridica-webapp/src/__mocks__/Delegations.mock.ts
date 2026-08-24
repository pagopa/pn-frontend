import { Delegate, DelegationStatus, Delegator } from '../models/Deleghe';

export const mockCreateDelegation = {
  delegate: {
    firstName: 'Utente',
    lastName: 'Test Quattro',
    displayName: 'Utente Test Quattro',
    companyName: 'eni',
    fiscalCode: 'TSTUTN00A06A001F',
    person: true,
  },
  visibilityIds: [
    {
      name: 'Agenzia Test',
      uniqueIdentifier: '123456789',
    },
  ],
  verificationCode: '123456',
  dateto: '2022-04-16',
};

export const mandatesByDelegator: Array<Delegate> = [
  {
    mandateId: '1',
    delegate: {
      displayName: 'Utente Test Tre',
      firstName: 'Utente',
      lastName: 'Test Tre',
      companyName: 'eni',
      fiscalCode: 'TSTUTN00A05A001E',
      person: true,
    },
    status: 'pending' as DelegationStatus,
    visibilityIds: [
      {
        name: 'Agenzia Test',
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
      displayName: 'Utente Test Quattro',
      firstName: 'Utente',
      lastName: 'Test Quattro',
      companyName: 'eni',
      fiscalCode: 'TSTUTN00A06A001F',
      person: true,
    },
    status: 'active' as DelegationStatus,
    visibilityIds: [
      {
        name: 'Agenzia Test',
        uniqueIdentifier: '123456789',
      },
    ],
    verificationCode: '67890',
    datefrom: '2021-12-15',
    dateto: '2023-04-07',
  },
];

export const mandatesByDelegate: Array<Delegator> = [
  {
    mandateId: '3',
    delegator: {
      displayName: 'Utente Test Tre',
      firstName: 'Utente',
      lastName: 'Test Tre',
      companyName: 'eni',
      fiscalCode: 'TSTUTN00A05A001E',
      person: true,
    },
    status: 'pending' as DelegationStatus,
    visibilityIds: [
      {
        name: 'Agenzia Test',
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
      displayName: 'Utente Test Quattro',
      firstName: 'Utente',
      lastName: 'Test Quattro',
      companyName: 'eni',
      fiscalCode: 'TSTUTN00A06A001F',
      person: true,
    },
    status: 'active' as DelegationStatus,
    visibilityIds: [
      {
        name: 'Agenzia Test',
        uniqueIdentifier: '123456789',
      },
    ],
    verificationCode: '123456',
    datefrom: '2021-12-15',
    dateto: '2022-04-16',
    groups: [],
  },
  {
    mandateId: '5',
    delegator: {
      displayName: 'DivinaCommedia Srl',
      fiscalCode: '70412331207',
      person: false,
    },
    status: 'active' as DelegationStatus,
    visibilityIds: [
      {
        name: 'Comune di Test 4',
        uniqueIdentifier: '987654321',
      },
      {
        name: 'Agenzia Test',
        uniqueIdentifier: '123456789',
      },
    ],
    datefrom: '2023-01-05',
    dateto: '2029-05-06',
    verificationCode: '954765',
    groups: [],
  },
];
