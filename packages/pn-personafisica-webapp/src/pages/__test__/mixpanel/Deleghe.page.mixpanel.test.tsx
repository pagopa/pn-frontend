import MockAdapter from 'axios-mock-adapter';
import { MockInstance, vi } from 'vitest';

import { mandatesByDelegate, mandatesByDelegator } from '../../../__mocks__/Delegations.mock';
import { act, render, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { PFEventsType } from '../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../utility/MixpanelUtils/PFEventStrategyFactory';
import Deleghe from '../../Deleghe.page';

describe('Deleghe.page - Mixpanel events', () => {
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

  it('fires SEND_YOUR_MANDATES when the page data is loaded', async () => {
    mock.onGet('/bff/v1/mandate/delegate').reply(200, mandatesByDelegate);
    mock.onGet('/bff/v1/mandate/delegator').reply(200, mandatesByDelegator);

    await act(async () => {
      render(<Deleghe />);
    });

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_YOUR_MANDATES,
        expect.objectContaining({
          delegates: expect.any(Array),
          delegators: expect.any(Array),
        })
      );
    });
  });
});
