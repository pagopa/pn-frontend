import { Email, People, VpnKey, SupervisedUserCircle } from '@mui/icons-material';
import { SideMenuItem } from '@pagopa-pn/pn-commons';

import * as routes from '../navigation/routes.const';
import { PartyRole } from '../models/user';

const BasicMenuItems: Array<SideMenuItem> = [
  { label: 'Notifiche', icon: Email, route: routes.DASHBOARD },
  { label: 'Chiavi API', icon: VpnKey, route: routes.API_KEYS },
];

function selfcareMenuItems(idOrganization: string): Array<SideMenuItem> {
  return [
    { label: 'Ruoli', icon: People, route: routes.ROLES(idOrganization) },
    { label: 'Gruppi', icon: SupervisedUserCircle, route: routes.GROUPS(idOrganization) },
  ];
}

/** Get Menu Items based on user role */
export function getMenuItems(role: PartyRole, idOrganization: string): {
  menuItems: Array<SideMenuItem>;
  selfCareItems?: Array<SideMenuItem>;
} {
  switch (role) {
    case PartyRole.MANAGER:
      return { menuItems: BasicMenuItems, selfCareItems: selfcareMenuItems(idOrganization) };
    case PartyRole.OPERATOR:
      return { menuItems: BasicMenuItems };
    default:
      return { menuItems: BasicMenuItems };
  }
}

/** Get Home Page based on user role */
export function getHomePage() {
  return routes.DASHBOARD;
}
