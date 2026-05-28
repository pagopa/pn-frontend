import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { mandatesByDelegate } from '../../../__mocks__/Delegations.mock';
import { notificationsDTO } from '../../../__mocks__/Notifications.mock';
import { PFTriggerEventSpy, act, render, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { PFEventsType } from '../../../models/PFEventsType';
import * as routes from '../../../navigation/routes.const';
import PFEventStrategyFactory from '../../../utility/MixpanelUtils/PFEventStrategyFactory';
import Notifiche from '../../Notifiche.page';

describe('Notifiche.page - Mixpanel events', () => {
  let triggerEventSpy: PFTriggerEventSpy;
  let mock: MockAdapter;
  const originalResizeObserver = globalThis.ResizeObserver;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    mock.reset();
    triggerEventSpy.mockRestore();
  });

  afterAll(() => {
    mock.restore();
    globalThis.ResizeObserver = originalResizeObserver;
  });

  it('fires SEND_YOUR_NOTIFICATIONS after notifications API resolves', async () => {
    mock.onGet(/\/bff\/v1\/notifications\/received.*/).reply(200, notificationsDTO);

    await act(async () => {
      render(<Notifiche />);
    });

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_YOUR_NOTIFICATIONS,
        expect.objectContaining({
          notifications: expect.any(Array),
          delegators: expect.any(Array),
          pagination: expect.objectContaining({
            moreResult: expect.any(Boolean),
            nextPagesKey: expect.any(Array),
          }),
        })
      );
    });
  });

  it('fires SEND_NOTIFICATION_DELEGATED when viewing delegated notifications', async () => {
    const delegator = mandatesByDelegate[1]; // mandateId: '4', status: 'active'
    mock.onGet(/\/bff\/v1\/notifications\/received.*/).reply(200, notificationsDTO);

    await act(async () => {
      render(<Notifiche />, {
        route: routes.GET_NOTIFICHE_DELEGATO_PATH(delegator.mandateId),
        path: routes.NOTIFICHE_DELEGATO,
        preloadedState: {
          generalInfoState: {
            delegators: mandatesByDelegate,
            pendingDelegators: 0,
          },
        },
      });
    });

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_NOTIFICATION_DELEGATED,
        expect.objectContaining({
          notifications: expect.any(Array),
          delegators: expect.any(Array),
          pagination: expect.objectContaining({
            moreResult: expect.any(Boolean),
            nextPagesKey: expect.any(Array),
          }),
        })
      );
    });
  });
});
