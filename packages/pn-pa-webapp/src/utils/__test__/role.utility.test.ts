import { People, SupervisedUserCircle, VpnKey, Email, ShowChart } from '@mui/icons-material';
import { SideMenuItem } from '@pagopa-pn/pn-commons';
import { PNRole } from '../../models/user';
import * as routes from '../../navigation/routes.const';
import { getHomePage, getMenuItems } from '../role.utility';

const mockedIdOrganization = 'mocked-id';
// The actual basicMenuItems includes an additional element, which would be cumbersome
// to reproduce in the test since it accesses the Redux store and the MUI theme.
// As the actual responsibility of getMenuItems is to decide whether to include the selfCareItems
// or not, any list of basicMenuItems is fit to the test.
// -------------------------------
// Carlos Lombardi, 2022.11.08
// -------------------------------
const basicMenuItems: Array<SideMenuItem> = [
  { label: 'menu.notifications', icon: Email, route: routes.DASHBOARD },
  { label: 'menu.api-key', icon: VpnKey, route: routes.API_KEYS },
];

test('return menu items for role REFERENTE_AMMINISTRATIVO', () => {
  // define SelfCareItems inside the test since it cannot be static code (as it accesses configuration)
  // and it is used in this test only
  const SelfCareItems: Array<SideMenuItem> = [
    { label: 'menu.users', icon: People, route: routes.USERS(mockedIdOrganization) },
    {
      label: 'menu.groups',
      icon: SupervisedUserCircle,
      route: routes.GROUPS(mockedIdOrganization),
    },
  ];
  const items = getMenuItems(basicMenuItems, mockedIdOrganization, PNRole.ADMIN);
  expect(items).toEqual({
    menuItems: [
      ...basicMenuItems,
      // { label: 'menu.statistics', icon: ShowChart, route: routes.STATISTICHE },
    ],
    selfCareItems: SelfCareItems,
  });
});

test('return menu items for role REFERENTE_OPERATIVO', () => {
  const items = getMenuItems(basicMenuItems, mockedIdOrganization, PNRole.OPERATOR);
  expect(items).toEqual({ menuItems: basicMenuItems });
});

test('return home page for role REFERENTE_AMMINISTRATIVO', () => {
  const home = getHomePage();
  expect(home).toBe(routes.DASHBOARD);
});

test('return home page for role REFERENTE_OPERATIVO', () => {
  const home = getHomePage();
  expect(home).toBe(routes.DASHBOARD);
});
