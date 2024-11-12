import { Email, VpnKey } from '@mui/icons-material';
import { SideMenuItem } from '@pagopa-pn/pn-commons';

import { PNRole } from '../../models/user';
import * as routes from '../../navigation/routes.const';
import { getHomePage, getMenuItems, selfcareMenuItems } from '../role.utility';

const mockedIdOrganization = 'mocked-id';
const mockedLanguage = 'it';
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

describe('Test role utility', () => {
  it('return menu items for role REFERENTE_AMMINISTRATIVO', () => {
    const items = getMenuItems(basicMenuItems, mockedIdOrganization, mockedLanguage, PNRole.ADMIN);
    expect(items).toEqual({
      menuItems: [
        ...basicMenuItems,
        // { label: 'menu.statistics', icon: ShowChart, route: routes.STATISTICHE },
      ],
      selfCareItems: selfcareMenuItems(mockedIdOrganization, mockedLanguage),
    });
  });

  it('return menu items for role REFERENTE_OPERATIVO', () => {
    const items = getMenuItems(basicMenuItems, mockedIdOrganization, PNRole.OPERATOR);
    expect(items).toEqual({ menuItems: basicMenuItems });
  });

  it('return home page for role REFERENTE_AMMINISTRATIVO', () => {
    const home = getHomePage();
    expect(home).toBe(routes.DASHBOARD);
  });

  it('return home page for role REFERENTE_OPERATIVO', () => {
    const home = getHomePage();
    expect(home).toBe(routes.DASHBOARD);
  });
});
