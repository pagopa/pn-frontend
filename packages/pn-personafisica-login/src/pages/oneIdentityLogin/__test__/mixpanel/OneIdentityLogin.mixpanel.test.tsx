import { MockInstance, vi } from 'vitest';

import { IDPS_MOCK } from '../../../../__mocks__/IDPS.mock';
import { act, fireEvent, render, waitFor } from '../../../../__test__/test-utils';
import { OneIdentityApi } from '../../../../api/OneIdentity/OneIdentity.api';
import { PFLoginEventsType } from '../../../../models/PFLoginEventsType';
import PFLoginEventStrategyFactory from '../../../../utility/MixpanelUtils/PFLoginEventStrategyFactory';
import OneIdentityLogin from '../../OneIdentityLogin';

vi.mock('../../../../api/OneIdentity/OneIdentity.api', () => ({
  OneIdentityApi: {
    getIdps: vi.fn().mockResolvedValue([]),
    authorize: vi.fn().mockResolvedValue({ location: 'https://example.com' }),
  },
}));

describe('One Identity Login page - Mixpanel events', () => {
  let triggerEventSpy: MockInstance<[PFLoginEventsType, unknown?], void>;

  beforeEach(() => {
    vi.stubGlobal('location', { assign: vi.fn() });
    triggerEventSpy = vi.spyOn(PFLoginEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    triggerEventSpy.mockRestore();
    triggerEventSpy.mockClear();
  });

  it('fires SEND_LOGIN on mount', async () => {
    await act(async () => render(<OneIdentityLogin />));
    expect(triggerEventSpy).toHaveBeenCalledWith(PFLoginEventsType.SEND_LOGIN);
  });

  it('fires SEND_IDP_SELECTED when CIE button is clicked', async () => {
    const { container } = await act(async () => render(<OneIdentityLogin />));

    await act(async () => fireEvent.click(container.querySelector('#cieButton')!));
    expect(triggerEventSpy).toHaveBeenCalledWith(PFLoginEventsType.SEND_IDP_SELECTED, {
      SPID_IDP_NAME: 'CIE',
      SPID_IDP_ID: 'https://mock-cie-entityID.it',
    });
  });

  it('fires SEND_IDP_SELECTED when a SPID IDP is selected', async () => {
    vi.mocked(OneIdentityApi.getIdps).mockResolvedValue(IDPS_MOCK);
    const { container } = await act(async () => render(<OneIdentityLogin />));

    fireEvent.click(container.querySelector('#spidButton')!);

    const idp = IDPS_MOCK[0];
    const idpButton = await waitFor(() => {
      const btn = document.getElementById(`spid-select-${idp.entityID}`);
      if (!btn) throw new Error('IDP button not found');
      return btn;
    });

    await act(async () => fireEvent.click(idpButton));

    expect(triggerEventSpy).toHaveBeenCalledWith(PFLoginEventsType.SEND_IDP_SELECTED, {
      SPID_IDP_NAME: idp.friendlyName,
      SPID_IDP_ID: idp.entityID,
    });
  });
});
