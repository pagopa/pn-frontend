import { People, SupervisedUserCircle, VpnKey } from '@mui/icons-material';
import Email from '@mui/icons-material/Email';
import { SideMenuItem } from '@pagopa-pn/pn-commons';
import { PartyRole } from '../../models/user';
import * as routes from '../../navigation/routes.const';
import { getHomePage, getMenuItems } from '../role.utility';

const mockedIdOrganization = 'mocked-id';
const BasicMenuItems: Array<SideMenuItem> = [
  { label: 'Notifiche', icon: Email, route: routes.DASHBOARD },
  /**
  * Refers to PN-1741
  * Commented out because beyond MVP scope
  * 
  * LINKED TO:
  * - "<Route path={routes.API_KEYS}.../>" in packages/pn-pa-webapp/src/navigation/routes.tsx
  * - BasicMenuItems in packages/pn-pa-webapp/src/utils/role.utility.ts
  */
  // { label: 'Chiavi API', icon: VpnKey, route: routes.API_KEYS },
];

const SelfCareItems: Array<SideMenuItem> = [
  { label: 'Ruoli', icon: People, route: routes.ROLES(mockedIdOrganization) },
  { label: 'Gruppi', icon: SupervisedUserCircle, route: routes.GROUPS(mockedIdOrganization) },
];

test('return menu items for role REFERENTE_AMMINISTRATIVO', () => {
  const items = getMenuItems(PartyRole.MANAGER, mockedIdOrganization);
  expect(items).toEqual({ menuItems: BasicMenuItems, selfCareItems: SelfCareItems });
});

test('return menu items for role REFERENTE_OPERATIVO', () => {
  const items = getMenuItems(PartyRole.OPERATOR, mockedIdOrganization);
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
