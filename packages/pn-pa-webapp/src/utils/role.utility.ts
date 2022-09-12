import { Email, People, SupervisedUserCircle, VpnKey } from '@mui/icons-material';
import { SideMenuItem } from '@pagopa-pn/pn-commons';

import * as routes from '../navigation/routes.const';
import { PNRole } from '../models/user';
import { IS_DEVELOP } from './constants';

const BasicMenuItems: Array<SideMenuItem> = [
  { label: 'menu.notifications', icon: Email, route: routes.DASHBOARD },
  { label: 'menu.api-key', icon: VpnKey, route: routes.API_KEYS },
];

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
export function getMenuItems(idOrganization: string, role?: PNRole): {
  menuItems: Array<SideMenuItem>;
  selfCareItems?: Array<SideMenuItem>;
} {
  if (IS_DEVELOP) {
    return { menuItems: BasicMenuItems, selfCareItems: selfcareMenuItems(idOrganization) };
  }
  switch (role) {
    case PNRole.ADMIN:
      return { menuItems: BasicMenuItems, selfCareItems: selfcareMenuItems(idOrganization) };
    case PNRole.OPERATOR:
      return { menuItems: BasicMenuItems };
    default:
      return { menuItems: BasicMenuItems };
  }
}

/** Get Home Page based on user role */
export function getHomePage() {
  return routes.DASHBOARD;
}
