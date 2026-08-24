import { Delegate, Delegator, NewMandateRequest } from '../redux/delegation/types';

export const mockCreateDelegation: NewMandateRequest = {
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
    status: 'pending',
    visibilityIds: [
      {
        name: 'Agenzia Test',
        uniqueIdentifier: '123456789',
      },
    ],
    verificationCode: '12345',
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
    status: 'active',
    visibilityIds: [
      {
        name: 'Agenzia Test',
        uniqueIdentifier: '123456789',
      },
    ],
    verificationCode: '67890',
    datefrom: '2021-12-15',
    dateto: '2022-07-25',
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
    status: 'pending',
    visibilityIds: [
      {
        name: 'Agenzia Test',
        uniqueIdentifier: '123456789',
      },
    ],
    verificationCode: '12345',
    datefrom: '2021-12-15',
    dateto: '2022-04-16',
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
    status: 'active',
    visibilityIds: [
      {
        name: 'Agenzia Test',
        uniqueIdentifier: '123456789',
      },
    ],
    verificationCode: '67890',
    datefrom: '2021-12-15',
    dateto: '2022-12-01',
  },
  {
    mandateId: '5',
    delegator: {
      displayName: 'Utente Test Otto',
      firstName: 'Utente',
      lastName: 'Test Otto',
      companyName: 'eni',
      fiscalCode: 'TSTUTN00A07A001G',
      person: true,
    },
    status: 'active',
    visibilityIds: [
      {
        name: 'Comune di Test 3',
        uniqueIdentifier: '123456789',
      },
    ],
    verificationCode: '123456',
    datefrom: '2021-12-15',
    dateto: '2023-08-23',
  },
];
