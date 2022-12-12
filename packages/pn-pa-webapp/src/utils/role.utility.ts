import { People, ShowChart, SupervisedUserCircle } from '@mui/icons-material';
import { SideMenuItem } from '@pagopa-pn/pn-commons';

import * as routes from '../navigation/routes.const';
import { PNRole } from '../models/user';
import { IS_DEVELOP } from './constants';

const statisticsMenuItem = { label: 'menu.statistics', icon: ShowChart, route: routes.STATISTICHE };

function selfcareMenuItems(idOrganization: string): Array<SideMenuItem> {
  return [
    { label: 'menu.roles', icon: People, route: routes.ROLES(idOrganization) },
    { label: 'menu.groups', icon: SupervisedUserCircle, route: routes.GROUPS(idOrganization) },
  ];
}

/**
 * Get Menu Items based on user role
 * @param idOrganization
 * @param role
 * @returns Allowed list of menù items
 */
export function getMenuItems(
  basicMenuItems: Array<SideMenuItem>,
  idOrganization: string,
  role?: PNRole
): {
  menuItems: Array<SideMenuItem>;
  selfCareItems?: Array<SideMenuItem>;
} {
  if (IS_DEVELOP) {
    return {
      menuItems: [...basicMenuItems, statisticsMenuItem],
      selfCareItems: selfcareMenuItems(idOrganization),
    };
  }
  switch (role) {
    case PNRole.ADMIN:
      return {
        menuItems: [...basicMenuItems, statisticsMenuItem],
        selfCareItems: selfcareMenuItems(idOrganization),
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
