import { EventPropertyType } from '@pagopa-pn/pn-commons';

import { SendEnableIOStrategy } from '../SendEnableIOStrategy';

describe('Mixpanel - Enable IO Strategy', () => {
  it('should return enable io event', () => {
    const strategy = new SendEnableIOStrategy();
    const event = strategy.performComputations();

    expect(event).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_APPIO_STATUS: 'activated',
      },
    });
  });
});
