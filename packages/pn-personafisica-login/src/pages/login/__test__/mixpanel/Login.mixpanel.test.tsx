import { vi } from 'vitest';

import { PFLoginTriggerEventSpy, fireEvent, render } from '../../../../__test__/test-utils';
import { PFLoginEventsType } from '../../../../models/PFLoginEventsType';
import PFLoginEventStrategyFactory from '../../../../utility/MixpanelUtils/PFLoginEventStrategyFactory';
import Login from '../../Login';

vi.mock('../../../../services/configuration.service', async () => ({
  ...(await vi.importActual<any>('../../../../services/configuration.service')),
  getConfiguration: () => ({
    SPID_CIE_ENTITY_ID: 'mock-cie-entity-id',
    IS_SMART_APP_BANNER_ENABLED: false,
  }),
}));

describe('Login page - Mixpanel events', () => {
  let triggerEventSpy: PFLoginTriggerEventSpy;

  beforeEach(() => {
    vi.stubGlobal('location', { assign: vi.fn() });
    triggerEventSpy = vi.spyOn(PFLoginEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    triggerEventSpy.mockRestore();
  });

  it('fires SEND_LOGIN on mount', () => {
    render(<Login />);
    expect(triggerEventSpy).toHaveBeenCalledWith(PFLoginEventsType.SEND_LOGIN);
  });

  it('fires SEND_IDP_SELECTED when CIE button is clicked', () => {
    const { container } = render(<Login />);
    triggerEventSpy.mockClear();
    fireEvent.click(container.querySelector('#cieButton')!);
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFLoginEventsType.SEND_IDP_SELECTED,
      {
        SPID_IDP_NAME: 'CIE',
        SPID_IDP_ID: 'mock-cie-entity-id',
      },
      { transport: 'sendBeacon' }
    );
  });
});
