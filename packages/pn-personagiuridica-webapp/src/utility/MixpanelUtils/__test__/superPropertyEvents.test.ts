import { EventPropertyType } from '@pagopa-pn/pn-commons';

import { PGEventsType } from '../../../models/PGEventsType';
import { superPropertyTrackingConfigs } from '../superPropertyEvents';

describe('superPropertyTrackingConfigs', () => {
  it('should build USER_ROLE super property event', () => {
    const payload = {
      [PGEventsType.USER_ROLE]: 'admin',
    } as const;

    const result = superPropertyTrackingConfigs[PGEventsType.USER_ROLE](payload);

    expect(result).toStrictEqual({
      [EventPropertyType.SUPER_PROPERTY]: payload,
    });
  });

  it('should build SEND_PG_HAS_EMAIL super property event', () => {
    const payload = {
      [PGEventsType.SEND_PG_HAS_EMAIL]: 'yes',
    } as const;

    const result = superPropertyTrackingConfigs[PGEventsType.SEND_PG_HAS_EMAIL](payload);

    expect(result).toStrictEqual({
      [EventPropertyType.SUPER_PROPERTY]: payload,
    });
  });

  it('should build SEND_PG_HAS_SMS super property event', () => {
    const payload = {
      [PGEventsType.SEND_PG_HAS_SMS]: 'yes',
    } as const;

    const result = superPropertyTrackingConfigs[PGEventsType.SEND_PG_HAS_SMS](payload);

    expect(result).toStrictEqual({
      [EventPropertyType.SUPER_PROPERTY]: payload,
    });
  });

  it('should build SEND_PG_HAS_SERCQ super property event', () => {
    const payload = {
      [PGEventsType.SEND_PG_HAS_SERCQ]: 'no',
    } as const;

    const result = superPropertyTrackingConfigs[PGEventsType.SEND_PG_HAS_SERCQ](payload);

    expect(result).toStrictEqual({
      [EventPropertyType.SUPER_PROPERTY]: payload,
    });
  });

  it('should build SEND_PG_HAS_MANDATE super property event', () => {
    const payload = {
      [PGEventsType.SEND_PG_HAS_MANDATE]: 'yes',
    } as const;

    const result = superPropertyTrackingConfigs[PGEventsType.SEND_PG_HAS_MANDATE](payload);

    expect(result).toStrictEqual({
      [EventPropertyType.SUPER_PROPERTY]: payload,
    });
  });

  it('should build SEND_PG_HAS_MANDATE_GIVEN super property event', () => {
    const payload = {
      [PGEventsType.SEND_PG_HAS_MANDATE_GIVEN]: 'no',
    } as const;

    const result = superPropertyTrackingConfigs[PGEventsType.SEND_PG_HAS_MANDATE_GIVEN](payload);

    expect(result).toStrictEqual({
      [EventPropertyType.SUPER_PROPERTY]: payload,
    });
  });

  it('should build SEND_PG_HAS_NOTIFICATIONS super property event', () => {
    const payload = {
      [PGEventsType.SEND_PG_HAS_NOTIFICATIONS]: 'no',
    } as const;

    const result = superPropertyTrackingConfigs[PGEventsType.SEND_PG_HAS_NOTIFICATIONS](payload);

    expect(result).toStrictEqual({
      [EventPropertyType.SUPER_PROPERTY]: payload,
    });
  });
});
