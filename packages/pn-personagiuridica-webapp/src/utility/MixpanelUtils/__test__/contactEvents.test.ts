import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import type { PGEventPayloads } from '../../../models/PGEventPayloads';
import { PGEventsType } from '../../../models/PGEventsType';
import { ChannelType } from '../../../models/contacts';
import { contactTrackingConfigs } from '../contactEvents';

describe('contactTrackingConfigs', () => {
  it('should build SEND_PG_YOUR_CONTACT_DETAILS event', () => {
    const payload: PGEventPayloads[PGEventsType.SEND_PG_YOUR_CONTACT_DETAILS] = {
      digital_domicile_exists: true,
      digital_domicile_type: ChannelType.SERCQ_SEND,
      email_exists: true,
      telephone_exists: false,
    };

    const result = contactTrackingConfigs[PGEventsType.SEND_PG_YOUR_CONTACT_DETAILS](payload);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        ...payload,
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
      },
    });
  });

  it('should build SEND_PG_ADD_DIGITAL_DOMICILE_START event', () => {
    const result =
      contactTrackingConfigs[PGEventsType.SEND_PG_ADD_DIGITAL_DOMICILE_START](undefined);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
      },
    });
  });

  it('should build SEND_PG_ADD_DIGITAL_DOMICILE_UX_SUCCESS event', () => {
    const result = contactTrackingConfigs[PGEventsType.SEND_PG_ADD_DIGITAL_DOMICILE_UX_SUCCESS]({
      digital_domicile_type: ChannelType.SERCQ_SEND,
    });

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        digital_domicile_type: ChannelType.SERCQ_SEND,
        event_category: EventCategory.UX,
        event_type: EventAction.CONFIRM,
      },
    });
  });

  it('should build SEND_PG_REMOVE_DIGITAL_DOMICILE_START event', () => {
    const result =
      contactTrackingConfigs[PGEventsType.SEND_PG_REMOVE_DIGITAL_DOMICILE_START](undefined);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
      },
    });
  });

  it('should build SEND_PG_REMOVE_DIGITAL_DOMICILE_UX_SUCCESS event', () => {
    const result =
      contactTrackingConfigs[PGEventsType.SEND_PG_REMOVE_DIGITAL_DOMICILE_UX_SUCCESS](undefined);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.CONFIRM,
      },
    });
  });

  it('should build SEND_PG_ADD_EMAIL_START event', () => {
    const result = contactTrackingConfigs[PGEventsType.SEND_PG_ADD_EMAIL_START](undefined);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
      },
    });
  });

  it('should build SEND_PG_ADD_EMAIL_UX_SUCCESS event', () => {
    const result = contactTrackingConfigs[PGEventsType.SEND_PG_ADD_EMAIL_UX_SUCCESS](undefined);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.CONFIRM,
      },
    });
  });

  it('should build SEND_PG_REMOVE_EMAIL_START event', () => {
    const result = contactTrackingConfigs[PGEventsType.SEND_PG_REMOVE_EMAIL_START](undefined);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
      },
    });
  });

  it('should build SEND_PG_REMOVE_EMAIL_UX_SUCCESS event', () => {
    const result = contactTrackingConfigs[PGEventsType.SEND_PG_REMOVE_EMAIL_UX_SUCCESS](undefined);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.CONFIRM,
      },
    });
  });

  it('should build SEND_PG_ADD_SMS_START event', () => {
    const result = contactTrackingConfigs[PGEventsType.SEND_PG_ADD_SMS_START](undefined);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
      },
    });
  });

  it('should build SEND_PG_ADD_SMS_UX_SUCCESS event', () => {
    const result = contactTrackingConfigs[PGEventsType.SEND_PG_ADD_SMS_UX_SUCCESS](undefined);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.CONFIRM,
      },
    });
  });

  it('should build SEND_PG_REMOVE_SMS_START event', () => {
    const result = contactTrackingConfigs[PGEventsType.SEND_PG_REMOVE_SMS_START](undefined);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
      },
    });
  });

  it('should build SEND_PG_REMOVE_SMS_UX_SUCCESS event', () => {
    const result = contactTrackingConfigs[PGEventsType.SEND_PG_REMOVE_SMS_UX_SUCCESS](undefined);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.CONFIRM,
      },
    });
  });

  it('should build SEND_PG_ADD_DD_SERCQ_SEND_START event', () => {
    const result = contactTrackingConfigs[PGEventsType.SEND_PG_ADD_DD_SERCQ_SEND_START](undefined);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
      },
    });
  });

  it('should build SEND_PG_ADD_DD_PEC_START event', () => {
    const result = contactTrackingConfigs[PGEventsType.SEND_PG_ADD_DD_PEC_START](undefined);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
      },
    });
  });
});
