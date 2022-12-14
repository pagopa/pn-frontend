import { People, SupervisedUserCircle } from '@mui/icons-material';
import { SideMenuItem } from '@pagopa-pn/pn-commons';

import * as routes from '../navigation/routes.const';
import { IS_DEVELOP } from './constants';

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
  idOrganization: string
): {
  menuItems: Array<SideMenuItem>;
  selfCareItems?: Array<SideMenuItem>;
} {
  if (IS_DEVELOP) {
    return {
      menuItems: [...basicMenuItems],
      selfCareItems: selfcareMenuItems(idOrganization),
    };
  }
  // TODO: gestire voci di menù in base al ruolo
  return {
    menuItems: [...basicMenuItems],
    selfCareItems: selfcareMenuItems(idOrganization),
  };
}

/** Get Home Page based on user role */
export function getHomePage() {
  return routes.NOTIFICHE;
}
