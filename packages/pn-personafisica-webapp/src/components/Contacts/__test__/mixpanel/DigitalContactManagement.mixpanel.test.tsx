import { MockInstance, vi } from 'vitest';

import { digitalAddressesSercq } from '../../../../__mocks__/Contacts.mock';
import { render } from '../../../../__test__/test-utils';
import { PFEventsType } from '../../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import DigitalContactManagement from '../../DigitalContactManagement';

describe('DigitalContactManagement - Mixpanel events', () => {
  let triggerEventSpy: MockInstance<[PFEventsType, unknown?], void>;

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    triggerEventSpy.mockRestore();
  });

  it('fires SEND_DIGITAL_DOMICILE_MANAGEMENT on mount', () => {
    render(<DigitalContactManagement />, {
      preloadedState: { contactsState: { digitalAddresses: digitalAddressesSercq } },
    });
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_DIGITAL_DOMICILE_MANAGEMENT,
      expect.objectContaining({ legal_addresses: expect.any(Array), event_type: expect.any(String) })
    );
  });

  // SEND_ADD_CUSTOMIZED_CONTACT_THANK_YOU_PAGE and SEND_ADD_CUSTOMIZED_CONTACT_THANK_YOU_PAGE_CLOSE
  // require completing the full AddSpecialContact flow and reaching the wizard feedback step.
  // Covered by integration tests.
});
