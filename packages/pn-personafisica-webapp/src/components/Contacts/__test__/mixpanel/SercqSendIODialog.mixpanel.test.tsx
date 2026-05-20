import MockAdapter from 'axios-mock-adapter';
import { MockInstance, vi } from 'vitest';

import { fireEvent, render, screen, waitFor } from '../../../../__test__/test-utils';
import { apiClient } from '../../../../api/apiClients';
import { PFEventsType } from '../../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import SercqSendIODialog from '../../SercqSendIODialog';

describe('SercqSendIODialog - Mixpanel events', () => {
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
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('fires SEND_ACTIVE_IO_START and SEND_ACTIVE_IO_UX_CONVERSION when the activate button is clicked', () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/APPIO', {
        value: 'APPIO',
        verificationCode: '00000',
      })
      .reply(204);

    render(<SercqSendIODialog open onDiscard={vi.fn()} />);
    fireEvent.click(screen.getByText('button.attiva'));

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ACTIVE_IO_START);
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ACTIVE_IO_UX_CONVERSION);
  });

  it('fires SEND_ACTIVE_IO_UX_SUCCESS after successful API activation', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/APPIO', {
        value: 'APPIO',
        verificationCode: '00000',
      })
      .reply(204);

    render(<SercqSendIODialog open onDiscard={vi.fn()} />);
    fireEvent.click(screen.getByText('button.attiva'));

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ACTIVE_IO_UX_SUCCESS, true);
    });
  });
});
