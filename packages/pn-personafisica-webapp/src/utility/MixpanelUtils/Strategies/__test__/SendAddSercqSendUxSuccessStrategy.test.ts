import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { ChannelType } from '../../../../models/contacts';
import { SendAddSercqUxSuccessStrategy } from '../SendAddSercqUxSuccessStrategy';

describe('Mixpanel - Add Sercq UX confirm success strategy', () => {
  it('should return add contact action event for PEC activation', () => {
    const strategy = new SendAddSercqUxSuccessStrategy();

    const isPecActivating = strategy.performComputations({
      contacts: [],
      sercq_type: ChannelType.PEC,
    });

    expect(isPecActivating).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.CONFIRM,
        other_contact: 'no',
        contact_details: 'no_contact',
      },
      [EventPropertyType.PROFILE]: {
        SEND_HAS_PEC: 'yes',
        SEND_HAS_SERCQ_SEND: 'no',
      },
      [EventPropertyType.SUPER_PROPERTY]: {
        SEND_HAS_PEC: 'yes',
        SEND_HAS_SERCQ_SEND: 'no',
      },
    });
  });

  it('should return add contact action event for SERCQ activation', () => {
    const strategy = new SendAddSercqUxSuccessStrategy();

    const isPecActivating = strategy.performComputations({
      contacts: [],
      sercq_type: ChannelType.SERCQ_SEND,
    });

    expect(isPecActivating).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.CONFIRM,
        other_contact: 'no',
        contact_details: 'no_contact',
      },
      [EventPropertyType.PROFILE]: {
        SEND_HAS_PEC: 'no',
        SEND_HAS_SERCQ_SEND: 'yes',
      },
      [EventPropertyType.SUPER_PROPERTY]: {
        SEND_HAS_PEC: 'no',
        SEND_HAS_SERCQ_SEND: 'yes',
      },
    });
  });
});
