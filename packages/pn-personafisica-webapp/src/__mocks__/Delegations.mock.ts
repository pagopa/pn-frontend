import { Delegation } from '../redux/delegation/types';

export const mockCreateDelegation = {
  delegate: {
    firstName: 'Davide',
    lastName: 'Legato',
    displayName: 'Davide Legato',
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
  datefrom: '2021-12-15',
  dateto: '2022-04-16',
};

export const arrayOfDelegates = [
  {
    mandateId: '1',
    delegate: {
      displayName: 'Marco Verdi',
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
    datefrom: '2021-12-15',
    dateto: '2022-04-16',
  },
];

export const arrayOfDelegators = [
  {
    mandateId: '3',
    delegator: {
      displayName: 'Marco Verdi',
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
    datefrom: '2021-12-15',
    dateto: '2022-04-16',
  },
];

export const mockDelegationsState = {
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


type statusType = 'pending' | 'active';

export const getMockedDelegators = (status: 'pending' | 'active' | 'mixed'): Array<Delegator> => {
  const returnStatus: [statusType, statusType] = ['pending', 'active'];
  switch (status) {
    case 'pending':
      returnStatus[1] = 'pending';
      break;
    case 'active':
      returnStatus[0] = 'active';
      break;
    default:
      break;
  }
  return [
    {
      mandateId: '1dc53e54-1368-4c2d-8583-2f1d672350d8',
      status: returnStatus[0],
      visibilityIds: [],
      verificationCode: '',
      datefrom: '2022-03-01',
      dateto: '2022-06-30',
      delegator: {
        displayName: 'Alessandro Manzoni',
        firstName: '',
        lastName: '',
        companyName: null,
        fiscalCode: '',
        person: true,
      },
    },
    {
      mandateId: '8ff0b635-b770-49ae-925f-3888495f3d13',
      status: returnStatus[1],
      visibilityIds: [],
      verificationCode: '',
      datefrom: '2022-03-01',
      dateto: '2022-06-30',
      delegator: {
        displayName: 'Lucia Mondella',
        firstName: '',
        lastName: '',
        companyName: null,
        fiscalCode: '',
        person: true,
      },
    },
  ];
};