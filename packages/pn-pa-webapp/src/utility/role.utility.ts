import {
  People,
  /*  ShowChart */
  SupervisedUserCircle,
} from '@mui/icons-material';
import { IS_DEVELOP, SideMenuItem } from '@pagopa-pn/pn-commons';

import { PNRole } from '../models/user';
import * as routes from '../navigation/routes.const';

// const statisticsMenuItem = { label: 'menu.statistics', icon: ShowChart, route: routes.STATISTICHE };

export function selfcareMenuItems(idOrganization: string, lang: string): Array<SideMenuItem> {
  return [
    { label: 'menu.users', icon: People, route: routes.USERS(idOrganization, lang) },
    {
      label: 'menu.groups',
      icon: SupervisedUserCircle,
      route: routes.GROUPS(idOrganization, lang),
    },
  ];
}

/**
 * Get Menu Items based on user role
 * @param basicMenuItems
 * @param idOrganization
 * @param lang
 * @param role
 * @returns Allowed list of menù items
 */
export function getMenuItems(
  basicMenuItems: Array<SideMenuItem>,
  idOrganization: string,
  lang: string,
  role?: PNRole
): {
  menuItems: Array<SideMenuItem>;
  selfCareItems?: Array<SideMenuItem>;
} {
  if (IS_DEVELOP) {
    return {
      menuItems: [...basicMenuItems],
      selfCareItems: selfcareMenuItems(idOrganization, lang),
    };
  }
  switch (role) {
    case PNRole.ADMIN:
      return {
        menuItems: [...basicMenuItems],
        selfCareItems: selfcareMenuItems(idOrganization, lang),
      };
    case PNRole.OPERATOR:
      return { menuItems: basicMenuItems };
    default:
      return { menuItems: basicMenuItems };
  }
}

/** Get Home Page based on user role */
export function getHomePage() {
  return routes.DASHBOARD;
}
