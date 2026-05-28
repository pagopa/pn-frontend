import MockAdapter from 'axios-mock-adapter';
import { MockInstance, vi } from 'vitest';

import { currentStatusDTO, downtimesDTO } from '../../../__mocks__/AppStatus.mock';
import { act, render } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { PFEventsType } from '../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../utility/MixpanelUtils/PFEventStrategyFactory';
import AppStatus from '../../AppStatus.page';

describe('AppStatus.page - Mixpanel events', () => {
  let triggerEventSpy: MockInstance<[PFEventsType, unknown?], void>;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    mock.onGet('/bff/v1/downtime/status').reply(200, currentStatusDTO);
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    mock.reset();
    triggerEventSpy.mockRestore();
  });

  afterAll(() => {
    mock.restore();
  });

  it('fires SEND_SERVICE_STATUS on mount', async () => {
    await act(async () => {
      render(<AppStatus />);
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_SERVICE_STATUS, undefined);
  });
});
