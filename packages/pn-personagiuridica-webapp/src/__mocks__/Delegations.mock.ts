import { Delegate, DelegationStatus, Delegator } from '../models/Deleghe';

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

export const mandatesByDelegator: Array<Delegate> = [
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
    verificationCode: '67890',
    datefrom: '2021-12-15',
    dateto: '2023-04-07',
  },
];

export const mandatesByDelegate: Array<Delegator> = [
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
        name: 'Comune di Cesara',
        uniqueIdentifier: '987654321',
      },
      {
        name: 'Agenzia delle Entrate',
        uniqueIdentifier: '123456789',
      },
    ],
    datefrom: '2023-01-05',
    dateto: '2029-05-06',
    verificationCode: '954765',
    groups: [],
  },
];
