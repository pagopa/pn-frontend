import { PartyEntityWithUrl } from '@pagopa-pn/pn-commons';
import { ProductEntity } from '@pagopa/mui-italia';

import { userResponse } from './Auth.mock';

export const productsDTO: Array<ProductEntity> = [
  {
    id: 'prod-pn-test',
    title: 'Product 1',
    productUrl: 'https://www.product.com',
    linkType: 'external',
  },
  {
    id: 'prod-pn-test-2',
    title: 'Product 2',
    productUrl: 'https://www.product.com',
    linkType: 'external',
  },
];

export const institutionsDTO: Array<PartyEntityWithUrl> = [
  {
    id: userResponse.organization.id,
    name: 'Institution 1',
    productRole: 'Role 1',
    entityUrl: `https://test.selfcare.pagopa.it/token-exchange?institutionId=${userResponse.organization.id}&productId=prod-pn-test`,
  },
  {
    id: '5b994d4a-0fa8-47ac-9c7b-354f1d44a1cd',
    name: 'Institution 2',
    productRole: 'Role 2',
    entityUrl:
      'https://test.selfcare.pagopa.it/token-exchange?institutionId=5b994d4a-0fa8-47ac-9c7b-354f1d44a1cd&productId=prod-pn-test',
    parentName: 'Parent 1',
  },
];
