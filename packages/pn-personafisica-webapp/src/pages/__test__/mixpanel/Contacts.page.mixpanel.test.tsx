import MockAdapter from 'axios-mock-adapter';
import { MockInstance, vi } from 'vitest';

import { act, render, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { PFEventsType } from '../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../utility/MixpanelUtils/PFEventStrategyFactory';
import Contacts from '../../Contacts.page';

describe('Contacts.page - Mixpanel events', () => {
  let triggerEventSpy: MockInstance<[PFEventsType, unknown?], void>;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
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
  });

  it('fires SEND_YOUR_CONTACT_DETAILS on mount', async () => {
    mock.onGet('/bff/v1/addresses').reply(200, []);

    await act(async () => {
      render(<Contacts />, { preloadedState: { contactsState: { digitalAddresses: [] } } });
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_YOUR_CONTACT_DETAILS,
      expect.objectContaining({
        digitalAddresses: expect.any(Array),
      })
    );
  });

  it('fires SEND_YOUR_CONTACT_DETAILS again after addresses API resolves', async () => {
    mock.onGet('/bff/v1/addresses').reply(200, []);

    await act(async () => {
      render(<Contacts />, { preloadedState: { contactsState: { digitalAddresses: [] } } });
    });

    await waitFor(() => {
      expect(mock.history.get.length).toBeGreaterThanOrEqual(1);
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_YOUR_CONTACT_DETAILS,
      expect.objectContaining({
        digitalAddresses: expect.any(Array),
      })
    );
  });
});
