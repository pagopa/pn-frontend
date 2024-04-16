import { EventPropertyType } from '@pagopa-pn/pn-commons';

import { SendRemoveLegalAddressStrategy } from '../SendRemoveLegalAddress';

describe('Mixpanel - Remove Legal Address Strategy', () => {
  it('should return remove legal address event', () => {
    const strategy = new SendRemoveLegalAddressStrategy();

    const event = strategy.performComputations();

    expect(event).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_HAS_PEC: 'no',
      },
    });
  });
});
