import { Delegate, Delegator, NewMandateRequest } from '../redux/delegation/types';

export const mockCreateDelegation: NewMandateRequest = {
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
    status: 'pending',
    visibilityIds: [
      {
        name: 'Agenzia Entrate',
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
      displayName: 'Davide Legato',
      firstName: 'Davide',
      lastName: 'Legato',
      companyName: 'eni',
      fiscalCode: 'DVDLGT83C12H501C',
      person: true,
    },
    status: 'active',
    visibilityIds: [
      {
        name: 'Agenzia Entrate',
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
      displayName: 'Marco Verdi',
      firstName: 'Marco',
      lastName: 'Verdi',
      companyName: 'eni',
      fiscalCode: 'MRCVRD83C12H501C',
      person: true,
    },
    status: 'pending',
    visibilityIds: [
      {
        name: 'Agenzia Entrate',
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
      displayName: 'Davide Legato',
      firstName: 'Davide',
      lastName: 'Legato',
      companyName: 'eni',
      fiscalCode: 'DVDLGT83C12H501C',
      person: true,
    },
    status: 'active',
    visibilityIds: [
      {
        name: 'Agenzia Entrate',
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
      displayName: 'Ada Lovelace',
      firstName: 'Ada',
      lastName: 'Lovelace',
      companyName: 'eni',
      fiscalCode: 'LVLDAA85T50G702B',
      person: true,
    },
    status: 'active',
    visibilityIds: [
      {
        name: 'Comune di Salerno',
        uniqueIdentifier: '123456789',
      },
    ],
    verificationCode: '123456',
    datefrom: '2021-12-15',
    dateto: '2023-08-23',
  },
];
