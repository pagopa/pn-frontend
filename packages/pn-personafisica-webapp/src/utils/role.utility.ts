import { Email, People, TrendingUp } from '@mui/icons-material';
import * as routes from '../navigation/routes.const';
import { SideMenuItem } from '../component/SideMenu/SideMenuItem';
import { UserRole } from '../models/user';

const ReferenteTecnicoMenuItems: Array<SideMenuItem> = [
  { label: 'Notifiche', icon: Email, route: routes.NOTIFICHE },
  { label: 'Deleghe', icon: TrendingUp, route: routes.DELEGHE },
  { label: 'Profilo', icon: People, route: routes.PROFILO },
];

export function getMenuItems(role: UserRole) {
  switch (role) {
    case UserRole.REFERENTE_AMMINISTRATIVO:
      return null;
    case UserRole.REFERENTE_OPERATIVO:
      return ReferenteTecnicoMenuItems;
  }
}

export function getHomePage(role: UserRole) {
  switch (role) {
    case UserRole.REFERENTE_AMMINISTRATIVO:
    case UserRole.REFERENTE_OPERATIVO:
      return routes.NOTIFICHE;
  }
}
