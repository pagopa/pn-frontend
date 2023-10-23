import { PartyEntity, ProductEntity } from '@pagopa/mui-italia';

export const productsDTO = [
  {
    id: '0',
    title: `Product 1`,
    urlBO: '',
  },
  {
    id: '1',
    title: `Product 2`,
    urlBO: 'https://www.product.com',
  },
];

export const productsList: Array<ProductEntity> = productsDTO.map((product) => ({
  id: product.id,
  title: product.title,
  productUrl: product.urlBO,
  linkType: 'external',
}));

export const institutionsDTO = [
  {
    id: '0',
    description: `Party 1`,
    userProductRoles: ['Role 1'],
  },
  {
    id: '1',
    description: `Party 2`,
    userProductRoles: ['Role 2'],
    rootParent: {
      id: '2',
      description: 'Root Party 2',
    },
  },
];

export const institutionsList: Array<PartyEntity> = institutionsDTO.map((institution) => ({
  id: institution.id,
  name: institution.description,
  productRole: institution.userProductRoles[0],
  logoUrl: undefined,
  parentName: institution.rootParent?.description,
}));
