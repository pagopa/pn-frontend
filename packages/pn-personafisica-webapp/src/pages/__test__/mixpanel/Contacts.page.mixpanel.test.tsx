import MockAdapter from 'axios-mock-adapter';
import { MockInstance, vi } from 'vitest';

import { act, render } from '../../../__test__/test-utils';
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
});
