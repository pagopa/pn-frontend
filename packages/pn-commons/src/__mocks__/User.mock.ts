import { ProductSwitchItem } from '@pagopa/mui-italia';

export const noUserLoggedData = {
  sessionToken: '',
  name: '',
  family_name: '',
  fiscal_number: '',
  email: '',
  uid: '',
};

export const userLoggedData = {
  sessionToken: 'mocked-token',
  name: 'Mario',
  family_name: 'Rossi',
  fiscal_number: 'RSSGPP80B02G273H',
  email: 'mario.rossi@mail.it',
  uid: '00000000-0000-0000-0000-000000000000',
};

enum LinkType {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
}

export const productsList: Array<ProductSwitchItem> = [
  {
    id: '0',
    title: `Product 1`,
    productUrl: '',
    linkType: LinkType.INTERNAL,
  },
  {
    id: '1',
    title: `Product 2`,
    productUrl: '',
    linkType: LinkType.EXTERNAL,
  },
];

export const partyList = [
  {
    id: '0',
    name: `Party 1`,
    productRole: 'Role 1',
    logoUrl: ``,
  },
  {
    id: '1',
    name: `Party 2`,
    productRole: 'Role 2',
    logoUrl: ``,
  },
];

export const loggedUser = {
  id: 'mocked-id',
  name: 'Mario',
  surname: 'Rossi',
};
