import { Delegation } from '../types';

export const mockCreateDelegation = {
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

export const arrayOfDelegates = [
  {
    mandateId: '1',
    delegate: {
      firstName: 'Marco',
      lastName: 'Verdi',
      companyName: 'eni',
      fiscalCode: 'MRCVRD83C12H501C',
      person: true,
      email: 'email@falsa.it',
    },
    status: 'pending' as const,
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
    delegate: {
      firstName: 'Davide',
      lastName: 'Legato',
      companyName: 'eni',
      fiscalCode: 'DVDLGT83C12H501C',
      person: true,
      email: 'email@falsa.it',
    },
    status: 'active' as const,
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

export const arrayOfDelegators = [
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
    status: 'pending' as const,
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
    status: 'active' as const,
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

export const mockDelegationsState = {
  delegatesError: false,
  delegatorsError: false,
  delegations: {
    delegators: arrayOfDelegators,
    delegates: arrayOfDelegates,
    isCompany: false,
  },
  modalState: {
    open: false,
    id: '',
    type: '',
  },
  acceptModalState: {
    open: false,
    id: '',
    name: '',
    error: false,
  },
  sortDelegators: {
    orderBy: '',
    order: 'asc',
  },
  sortDelegates: {
    orderBy: '',
    order: 'asc',
  },
};

export const initialState = {
  delegatesError: false,
  delegatorsError: false,
  delegations: {
    delegators: [] as Array<Delegation>,
    delegates: [] as Array<Delegation>,
    isCompany: false,
  },
  modalState: {
    open: false,
    id: '',
    type: '',
  },
  acceptModalState: {
    open: false,
    id: '',
    name: '',
    error: false,
  },
  sortDelegators: {
    orderBy: '',
    order: 'asc' as 'asc' | 'desc',
  },
  sortDelegates: {
    orderBy: '',
    order: 'asc' as 'asc' | 'desc',
  },
};
