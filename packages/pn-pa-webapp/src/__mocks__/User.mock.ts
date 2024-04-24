import { PartyEntityWithUrl } from "@pagopa-pn/pn-commons";
import { ProductEntity } from "@pagopa/mui-italia";

export const productsDTO: Array<ProductEntity> = [
  {
    id: '0',
    title: 'Product 1',
    productUrl: 'https://www.product.com',
    linkType: 'external',
  },
  {
    id: '1',
    title: 'Product 2',
    productUrl: 'https://www.product.com',
    linkType: 'external',
  },
];

export const institutionsDTO: Array<PartyEntityWithUrl> = [
  {
    id: '0',
    name: 'Institution 1',
    productRole: 'Role 1',
    entityUrl: 'mock-selfcare.base/token-exchange?institutionId=0&productId=mock-prod-id',
  },
  {
    id: '1',
    name: 'Institution 2',
    productRole: 'Role 2',
    entityUrl: 'mock-selfcare.base/token-exchange?institutionId=1&productId=mock-prod-id',
    parentName: 'Parent 1'
  },
];

