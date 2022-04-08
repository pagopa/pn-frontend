import { Email, People, GroupWork, TrendingUp } from '@mui/icons-material';
import { SideMenuItem } from '@pagopa-pn/pn-commons';

import * as routes from '../navigation/routes.const';
import { UserRole } from '../models/user';

const BasicMenuItems: Array<SideMenuItem> = [
  { label: 'Notifiche', icon: Email, route: routes.DASHBOARD },
  { label: 'Chiavi API', icon: TrendingUp, route: routes.API_KEYS },
];

const SelfcareMenuItems: Array<SideMenuItem> = [
  { label: 'Ruoli', icon: People, route: routes.ROLES },
  { label: 'Gruppi', icon: GroupWork, route: routes.GROUPS },
];

export function getMenuItems(role: UserRole): {
  menuItems: Array<SideMenuItem>;
  selfCareItems?: Array<SideMenuItem>;
} {
  switch (role) {
    case UserRole.REFERENTE_AMMINISTRATIVO:
      return { menuItems: BasicMenuItems, selfCareItems: SelfcareMenuItems };
    case UserRole.REFERENTE_OPERATIVO:
      return { menuItems: BasicMenuItems };
  }
}

export function getHomePage(role: UserRole) {
  switch (role) {
    case UserRole.REFERENTE_AMMINISTRATIVO:
    case UserRole.REFERENTE_OPERATIVO:
      return routes.DASHBOARD;
  }
}
