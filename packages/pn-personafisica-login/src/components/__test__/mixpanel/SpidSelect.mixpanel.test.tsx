import { MockInstance, vi } from 'vitest';

import { fireEvent, render } from '../../../__test__/test-utils';
import { PFLoginEventsType } from '../../../models/PFLoginEventsType';
import PFLoginEventStrategyFactory from '../../../utility/MixpanelUtils/PFLoginEventStrategyFactory';
import { getIDPS } from '../../../utility/IDPS';
import SpidSelect from '../../SpidSelect';

const { identityProviders } = getIDPS(false, false);
const firstIDP = identityProviders[0];

describe('SpidSelect component - Mixpanel events', () => {
  let triggerEventSpy: MockInstance<[PFLoginEventsType, unknown?], void>;

  beforeEach(() => {
    vi.stubGlobal('location', { assign: vi.fn() });
    triggerEventSpy = vi.spyOn(PFLoginEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    triggerEventSpy.mockRestore();
  });

  it('fires SEND_IDP_SELECTED when a SPID provider is clicked', () => {
    render(<SpidSelect onClose={vi.fn()} show={true} />);
    fireEvent.click(document.querySelector(`#spid-select-${firstIDP.entityId}`)!);
    expect(triggerEventSpy).toHaveBeenCalledWith(PFLoginEventsType.SEND_IDP_SELECTED, {
      SPID_IDP_NAME: firstIDP.name,
      SPID_IDP_ID: firstIDP.entityId,
    });
  });
});
