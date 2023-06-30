import { Item } from '@pagopa-pn/pn-commons';
import { Delegation } from '../../redux/delegation/types';
export const delegationArray: Array<Delegation> = [
  {
    mandateId: '7014cdd1-0a78-4e16-a08b-79dec878dc4e',
    delegate: {
      displayName: 'Mario Enmnti',
      firstName: 'Mario',
      lastName: 'Enmnti',
      companyName: null,
      fiscalCode: 'BCONRS02R26Z129Y',
      person: true,
    },
    status: 'pending',
    visibilityIds: [{ name: 'string', uniqueIdentifier: '123' }],
    verificationCode: '28633',
    datefrom: '2021-12-07',
    dateto: '2022-04-06T12:36:06.927Z',
  },
  {
    mandateId: '036421d2-0978-4bab-a94a-d508d303cc62',
    delegate: {
      displayName: 'test delega',
      firstName: 'test',
      lastName: 'delega',
      companyName: null,
      fiscalCode: 'tsttst01a01a000a',
      person: true,
    },
    status: 'pending',
    visibilityIds: [],
    verificationCode: '31429',
    datefrom: '2021-12-05',
    dateto: '2022-04-04T15:47:51.149Z',
  },
];

export const testItem: Array<Item> = [
  {
    id: '7014cdd1-0a78-4e16-a08b-79dec878dc4e',
    name: 'Mario Enmnti',
    startDate: '07/12/2021',
    endDate: '06/04/2022',
    status: 'pending',
    visibilityIds: ['string'],
    verificationCode: '28633',
    groups: [],
  },
  {
    id: '036421d2-0978-4bab-a94a-d508d303cc62',
    name: 'test delega',
    startDate: '05/12/2021',
    endDate: '04/04/2022',
    status: 'pending',
    visibilityIds: [],
    verificationCode: '31429',
    groups: [],
  },
];

export const delegateTest: Delegation = {
  mandateId: '7014cdd1-0a78-4e16-a08b-79dec878dc4e',
  delegate: {
    displayName: 'Mario Enmnti',
    firstName: 'Mario',
    lastName: 'Enmnti',
    companyName: null,
    fiscalCode: 'BCONRS02R26Z129Y',
    person: true,
  },
  status: 'pending',
  visibilityIds: [],
  verificationCode: '28633',
  datefrom: '2021-12-07',
  dateto: '2022-04-06T12:36:06.927Z',
};

export const delegatorTest: Delegation = {
  mandateId: '7014cdd1-0a78-4e16-a08b-79dec878dc4e',
  delegator: {
    displayName: 'Mario Enmnti',
    firstName: 'Mario',
    lastName: 'Enmnti',
    companyName: null,
    fiscalCode: 'BCONRS02R26Z129Y',
    person: true,
  },
  status: 'pending',
  visibilityIds: [],
  verificationCode: '28633',
  datefrom: '2021-12-07',
  dateto: '2022-04-06T12:36:06.927Z',
};
