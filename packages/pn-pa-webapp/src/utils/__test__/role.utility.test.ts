import { People, SupervisedUserCircle, VpnKey, Email } from '@mui/icons-material';
import { SideMenuItem } from '@pagopa-pn/pn-commons';
import { PNRole } from '../../models/user';
import * as routes from '../../navigation/routes.const';
import { getHomePage, getMenuItems } from '../role.utility';


const mockedIdOrganization = 'mocked-id';
const BasicMenuItems: Array<SideMenuItem> = [
  { label: 'menu.notifications', icon: Email, route: routes.DASHBOARD },
  { label: 'Chiavi API', icon: VpnKey, route: routes.API_KEYS },
];

const SelfCareItems: Array<SideMenuItem> = [
  { label: 'menu.roles', icon: People, route: routes.ROLES(mockedIdOrganization) },
  { label: 'menu.groups', icon: SupervisedUserCircle, route: routes.GROUPS(mockedIdOrganization) },
];

test('return menu items for role REFERENTE_AMMINISTRATIVO', () => {
  const items = getMenuItems(mockedIdOrganization, PNRole.ADMIN);
  expect(items).toEqual({ menuItems: BasicMenuItems, selfCareItems: SelfCareItems });
});

test('return menu items for role REFERENTE_OPERATIVO', () => {
  const items = getMenuItems(mockedIdOrganization, PNRole.OPERATOR);
  expect(items).toEqual({ menuItems: BasicMenuItems });
});

test('return home page for role REFERENTE_AMMINISTRATIVO', () => {
  const home = getHomePage();
  expect(home).toBe(routes.DASHBOARD);
});

test('return home page for role REFERENTE_OPERATIVO', () => {
  const home = getHomePage();
  expect(home).toBe(routes.DASHBOARD);
});
