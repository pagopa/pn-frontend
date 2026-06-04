import { EventAction, EventCategory, EventPropertyType } from '../../../models/MixpanelEvents';
import { koError, superProperty, uxAction, uxConfirm, uxScreenView } from '../CommonTrackingEvents';

describe('CommonTrackingEvents', () => {
  it('should build a KO error tracked event with custom properties', () => {
    const result = koError({
      error_code: 'GENERIC_ERROR',
    });

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        error_code: 'GENERIC_ERROR',
        event_category: EventCategory.KO,
        event_type: EventAction.ERROR,
      },
    });
  });

  it('should build a super property tracked event', () => {
    const result = superProperty({
      user_role: 'admin',
      organization_group: 'no',
    });

    expect(result).toStrictEqual({
      [EventPropertyType.SUPER_PROPERTY]: {
        user_role: 'admin',
        organization_group: 'no',
      },
    });
  });

  it('should build a UX action tracked event with custom properties', () => {
    const result = uxAction({
      source: 'notification-detail',
    });

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        source: 'notification-detail',
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
      },
    });
  });

  it('should build a UX confirm tracked event with custom properties', () => {
    const result = uxConfirm({
      confirm_type: 'delegation',
    });

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        confirm_type: 'delegation',
        event_category: EventCategory.UX,
        event_type: EventAction.CONFIRM,
      },
    });
  });

  it('should build a UX screen view tracked event with custom properties', () => {
    const result = uxScreenView({
      page_number: 1,
      total_count: 10,
    });

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        page_number: 1,
        total_count: 10,
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
      },
    });
  });

  it('should keep tracking defaults when reserved properties are provided', () => {
    const result = uxScreenView({
      event_category: 'CUSTOM_CATEGORY',
      event_type: 'custom_event_type',
      page_number: 1,
    });

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        page_number: 1,
      },
    });
  });
});
