import { FC, ReactNode } from 'react';
import { Provider } from 'react-redux';

import { SideMenuItem } from '@pagopa-pn/pn-commons';
import { renderHook } from '@pagopa-pn/pn-commons/src/test-utils';
import { EnhancedStore } from '@reduxjs/toolkit';

import { userResponse } from '../../__mocks__/Auth.mock';
import { createTestStore } from '../../__test__/test-utils';
import * as routes from '../../navigation/routes.const';
import { getConfiguration } from '../../services/configuration.service';
import { useMenuItems } from '../useMenuItems';

const TestStoreProvider = ({ children, store }: { children: ReactNode; store: EnhancedStore }) => {
  return <Provider store={store}>{children}</Provider>;
};

describe('useMenuItems', () => {
  let store: EnhancedStore;
  let wrapper: FC<{ children: ReactNode }>;
  let selfCareMenuItems: Array<SideMenuItem>;

  beforeAll(() => {
    store = createTestStore({
      userState: {
        user: userResponse,
      },
    });
    wrapper = ({ children }: { children: ReactNode }) => (
      <TestStoreProvider store={store}>{children}</TestStoreProvider>
    );
  });

  beforeEach(() => {
    selfCareMenuItems = [
      {
        label: 'menu.users',
        icon: expect.anything(),
        route: `${getConfiguration().SELFCARE_BASE_URL}/dashboard/mocked-id/users?lang=it`,
      },
      {
        label: 'menu.groups',
        icon: expect.anything(),
        route: `${getConfiguration().SELFCARE_BASE_URL}/dashboard/mocked-id/groups?lang=it`,
      },
    ];
  });

  it('should return menuItems with admin permissions', () => {
    const { result } = renderHook(() => useMenuItems(true), { wrapper });
    expect(result.current.selfCareMenuItems).toEqual(selfCareMenuItems);
    expect(result.current.menuItems).toEqual([
      {
        children: [
          { label: 'menu.notifiche-impresa', route: routes.NOTIFICHE },
          { label: 'menu.notifiche-delegato', route: routes.NOTIFICHE_DELEGATO },
        ],
        icon: expect.anything(),
        route: routes.NOTIFICHE,
        label: 'menu.notifiche',
        notSelectable: true,
      },
      {
        icon: expect.anything(),
        label: 'menu.deleghe',
        route: routes.DELEGHE,
      },
      {
        icon: expect.anything(),
        label: 'menu.contacts',
        route: routes.RECAPITI,
      },
      {
        icon: expect.anything(),
        label: 'menu.integrazione-api',
        route: routes.INTEGRAZIONE_API,
        rightBadgeNotification: undefined,
      },
      {
        icon: expect.anything(),
        label: 'menu.app-status',
        route: routes.APP_STATUS,
      },
    ]);
  });

  it('should return menuItems without admin permissions', () => {
    const { result } = renderHook(() => useMenuItems(false), { wrapper });
    expect(result.current.selfCareMenuItems).toEqual(selfCareMenuItems);
    expect(result.current.menuItems).toEqual([
      {
        children: [
          { label: 'menu.notifiche-impresa', route: routes.NOTIFICHE },
          { label: 'menu.notifiche-delegato', route: routes.NOTIFICHE_DELEGATO },
        ],
        icon: expect.anything(),
        route: routes.NOTIFICHE,
        label: 'menu.notifiche',
        notSelectable: true,
      },
      {
        icon: expect.anything(),
        label: 'menu.app-status',
        route: routes.APP_STATUS,
      },
      {
        icon: expect.anything(),
        label: 'menu.integrazione-api',
        route: routes.INTEGRAZIONE_API,
        rightBadgeNotification: undefined,
      },
    ]);
  });
});
