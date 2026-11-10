import {
  SupervisedUserCircleOutlined as GroupsIcon,
  PersonOutline as UsersIcon,
} from '@mui/icons-material';
import { SideMenuItem } from '@pagopa-pn/pn-commons';
import { ProductEntity } from '@pagopa/mui-italia';

import * as routes from '../navigation/routes.const';

/**
 * Side menu items that redirect to SelfCare
 * TODO: like PA, show these items only to admin users once the user role is available
 * @param idOrganization
 * @param lang
 * @returns the list of SelfCare menu items, with labels to translate
 */
export function selfcareMenuItems(idOrganization: string, lang: string): Array<SideMenuItem> {
  return [
    { label: 'menu.users', icon: UsersIcon, route: routes.USERS(idOrganization, lang) },
    { label: 'menu.groups', icon: GroupsIcon, route: routes.GROUPS(idOrganization, lang) },
  ];
}

/**
 * Products shown in the header product switch
 * @param t translation function
 * @param products products of the institution returned by the api
 * @param productId id of the current product
 * @param idOrganization id of the organization, used to build the SelfCare dashboard url
 * @param lang current language
 * @returns the list of products: SelfCare reserved area followed by the products of the institution
 * or, if they are not available, by the current product
 */
export const getProductsList = (
  t: (key: string) => string,
  products: Array<ProductEntity>,
  productId: string,
  idOrganization: string,
  lang: string
): Array<ProductEntity> => {
  const reservedArea: ProductEntity = {
    id: 'selfcare',
    title: t('header.reserved-area'),
    productUrl: routes.DASHBOARD(idOrganization, lang),
    linkType: 'external',
  };

  if (products.length > 0) {
    return [
      reservedArea,
      ...products.map((product) => ({
        ...product,
        productUrl: `${product.productUrl}&lang=${lang}`,
      })),
    ];
  }

  return [
    reservedArea,
    {
      id: productId,
      title: t('header.notification-platform'),
      productUrl: '',
      linkType: 'internal',
    },
  ];
};
