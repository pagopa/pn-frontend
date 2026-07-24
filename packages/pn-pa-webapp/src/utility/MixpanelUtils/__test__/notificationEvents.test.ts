import type { LegalFactId } from '@pagopa-pn/pn-commons';
import {
  EventAction,
  EventCategory,
  EventPropertyType,
  NotificationDocumentType,
} from '@pagopa-pn/pn-commons';

import { notificationsDTO } from '../../../__mocks__/Notifications.mock';
import { PAEventsType } from '../../../models/PAEventsType';
import { notificationTrackingConfigs } from '../notificationEvents';

describe('notificationTrackingConfigs', () => {
  it('should build SEND_PA_NOTIFICATIONS event', () => {
    const result = notificationTrackingConfigs[PAEventsType.SEND_PA_NOTIFICATIONS]({
      notifications: notificationsDTO.resultsPage,
      pageNumber: 0,
    });

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        page_number: 0,
        total_count: 4,
        delivered_count: 1,
        opened_count: 0,
        not_found_count: 0,
        cancelled_count: 0,
        effective_date_count: 2,
        filed_count: 1,
        sending_count: 0,
        back_to_sender_count: 0,
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
      },
    });
  });

  it('should build SEND_PA_NOTIFICATION_DETAIL event', () => {
    const result = notificationTrackingConfigs[PAEventsType.SEND_PA_NOTIFICATION_DETAIL](undefined);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
      },
    });
  });

  it('should build SEND_PA_TIMELINE_SHOW_HISTORY event', () => {
    const result =
      notificationTrackingConfigs[PAEventsType.SEND_PA_TIMELINE_SHOW_HISTORY](undefined);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
      },
    });
  });

  it('should build SEND_PA_TIMELINE_DOWNLOAD event', () => {
    const result = notificationTrackingConfigs[PAEventsType.SEND_PA_TIMELINE_DOWNLOAD]({
      legalFact: {
        category: 'DIGITAL_DELIVERY',
      } as LegalFactId,
    });

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        document_type: 'DIGITAL_DELIVERY',
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
      },
    });
  });

  it('should build SEND_PA_CANCEL_NOTIFICATION event', () => {
    const result = notificationTrackingConfigs[PAEventsType.SEND_PA_CANCEL_NOTIFICATION](undefined);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
      },
    });
  });

  it('should build SEND_PA_NOTIFICATION_DOWNLOAD_ATTACHMENT event', () => {
    const result = notificationTrackingConfigs[
      PAEventsType.SEND_PA_NOTIFICATION_DOWNLOAD_ATTACHMENT
    ]({
      document: '0',
    });

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        document_type: NotificationDocumentType.ATTACHMENT,
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
      },
    });
  });
});
