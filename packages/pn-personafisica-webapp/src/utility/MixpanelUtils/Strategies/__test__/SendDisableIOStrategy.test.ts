import { EventPropertyType } from '@pagopa-pn/pn-commons';

import { SendDisableIOStrategy } from '../SendDisableIOStrategy';

describe('Mixpanel - Disable IO Strategy', () => {
  it('should return disable io event', () => {
    const strategy = new SendDisableIOStrategy();
    const event = strategy.performComputations();

    expect(event).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_APPIO_STATUS: 'deactivated',
      },
      [EventPropertyType.SUPER_PROPERTY]: {
        SEND_APPIO_STATUS: 'deactivated',
      },
    });
  });
});
