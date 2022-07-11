import { ProductSwitchItem } from '@pagopa/mui-italia';

export const productsList: Array<ProductSwitchItem> = [
  {
    id: "0",
    title: `Product 1`,
    productUrl: "",
    linkType: 'internal'
  },
  {
    id: "1",
    title: `Product 2`,
    productUrl: "",
    linkType: 'internal'
  }
];

export const partyList = [
  {
    id: "0",
    name: `Party 1`,
    productRole: 'Role 1',
    logoUrl: ``
  },
  {
    id: "1",
    name: `Party 2`,
    productRole: 'Role 2',
    logoUrl: ``
  }
];

export const loggedUser = {
  id: 'mocked-id',
  name: 'Mario',
  surname: 'Rossi'
};