import { People, /*  ShowChart */ SupervisedUserCircle } from '@mui/icons-material';
import { SideMenuItem } from '@pagopa-pn/pn-commons';

import * as routes from '../navigation/routes.const';
import { PNRole } from '../models/user';
import { getConfiguration } from '../services/configuration.service';

// const statisticsMenuItem = { label: 'menu.statistics', icon: ShowChart, route: routes.STATISTICHE };

function selfcareMenuItems(idOrganization: string): Array<SideMenuItem> {
  return [
    { label: 'menu.users', icon: People, route: routes.USERS(idOrganization) },
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
  if (getConfiguration().IS_DEVELOP) {
    return {
      menuItems: [...basicMenuItems],
      selfCareItems: selfcareMenuItems(idOrganization),
    };
  }
  switch (role) {
    case PNRole.ADMIN:
      return {
        menuItems: [...basicMenuItems],
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
