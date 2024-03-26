import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { SendRemoveContactSuccessStrategy } from '../SendRemoveContactSuccess';

describe('Mixpanel - Remove contact success Strategy', () => {
  it('should return remove contact success event', () => {
    const strategy = new SendRemoveContactSuccessStrategy();

    const defaultSender = 'default';

    const removeDefaultSenderEvent = strategy.performComputations(defaultSender);
    expect(removeDefaultSenderEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        other_contact: 'no',
      },
    });

    const senderId = 'senderId';

    const removeSenderEvent = strategy.performComputations(senderId);
    expect(removeSenderEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        other_contact: 'yes',
      },
    });
  });
});
