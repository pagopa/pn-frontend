import { vi } from 'vitest';

import { digitalAddressesSercq } from '../../../../__mocks__/Contacts.mock';
import { PFTriggerEventSpy, fireEvent, render, screen } from '../../../../__test__/test-utils';
import { PFEventsType } from '../../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import LegalContactManager from '../../LegalContactManager';

describe('LegalContactManager - Mixpanel events', () => {
  let triggerEventSpy: PFTriggerEventSpy;

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    triggerEventSpy.mockRestore();
  });

  it('fires SEND_ADD_CUSTOMIZED_CONTACT when the special contacts button is clicked', () => {
    render(<LegalContactManager setAction={vi.fn()} />, {
      preloadedState: { contactsState: { digitalAddresses: digitalAddressesSercq } },
    });
    fireEvent.click(
      screen.getByRole('button', {
        name: 'legal-contacts.digital-domicile-management.special_contacts.action',
      })
    );
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT,
      expect.objectContaining({ event_type: expect.any(String), addresses: expect.any(Array) })
    );
  });
});
