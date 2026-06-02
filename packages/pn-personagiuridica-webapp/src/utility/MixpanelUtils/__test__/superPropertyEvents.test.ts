import { EventPropertyType } from '@pagopa-pn/pn-commons';

import { digitalAddressesSercq } from '../../../__mocks__/Contacts.mock';
import { PGEventsType } from '../../../models/PGEventsType';
import { ChannelType } from '../../../models/contacts';
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
    const result = superPropertyTrackingConfigs[PGEventsType.SEND_PG_HAS_EMAIL]({ value: true });

    expect(result).toStrictEqual({
      [EventPropertyType.SUPER_PROPERTY]: {
        [PGEventsType.SEND_PG_HAS_EMAIL]: 'yes',
      },
    });
  });

  it('should build SEND_PG_HAS_SMS super property event', () => {
    const result = superPropertyTrackingConfigs[PGEventsType.SEND_PG_HAS_SMS]({ value: true });

    expect(result).toStrictEqual({
      [EventPropertyType.SUPER_PROPERTY]: {
        [PGEventsType.SEND_PG_HAS_SMS]: 'yes',
      },
    });
  });

  it('should build SEND_PG_HAS_DIGITAL_DOMICILE super property event', () => {
    const result = superPropertyTrackingConfigs[PGEventsType.SEND_PG_HAS_DIGITAL_DOMICILE]({
      addresses: digitalAddressesSercq,
    });

    expect(result).toStrictEqual({
      [EventPropertyType.SUPER_PROPERTY]: {
        [PGEventsType.SEND_PG_HAS_DIGITAL_DOMICILE]: ChannelType.SERCQ_SEND,
      },
    });
  });

  it('should build SEND_PG_HAS_MANDATE super property event', () => {
    const result = superPropertyTrackingConfigs[PGEventsType.SEND_PG_HAS_MANDATE]({ value: true });

    expect(result).toStrictEqual({
      [EventPropertyType.SUPER_PROPERTY]: {
        [PGEventsType.SEND_PG_HAS_MANDATE]: 'yes',
      },
    });
  });

  it('should build SEND_PG_HAS_MANDATE_GIVEN super property event', () => {
    const result = superPropertyTrackingConfigs[PGEventsType.SEND_PG_HAS_MANDATE_GIVEN]({
      value: false,
    });

    expect(result).toStrictEqual({
      [EventPropertyType.SUPER_PROPERTY]: {
        [PGEventsType.SEND_PG_HAS_MANDATE_GIVEN]: 'no',
      },
    });
  });

  it('should build SEND_PG_HAS_NOTIFICATIONS super property event', () => {
    const result = superPropertyTrackingConfigs[PGEventsType.SEND_PG_HAS_NOTIFICATIONS]({
      value: false,
    });

    expect(result).toStrictEqual({
      [EventPropertyType.SUPER_PROPERTY]: {
        [PGEventsType.SEND_PG_HAS_NOTIFICATIONS]: 'no',
      },
    });
  });
});
