import {
  SupervisedUserCircleOutlined as GroupsIcon,
  PersonOutline as UsersIcon,
} from '@mui/icons-material';
import { SideMenuItem } from '@pagopa-pn/pn-commons';

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
