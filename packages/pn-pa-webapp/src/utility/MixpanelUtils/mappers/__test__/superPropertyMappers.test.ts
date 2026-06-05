import { PAEventsType } from '../../../../models/PAEventsType';
import { mapBooleanSuperPropertyToPayload, mapBooleanToYesNo } from '../superPropertyMappers';

describe('superPropertyMappers', () => {
  it('should map boolean values to Mixpanel yes/no values', () => {
    expect(mapBooleanToYesNo(true)).toBe('yes');
    expect(mapBooleanToYesNo(false)).toBe('no');
  });

  it('should map has notifications event data to yes payload', () => {
    const payload = mapBooleanSuperPropertyToPayload(PAEventsType.SEND_PA_HAS_NOTIFICATIONS, {
      value: true,
    });

    expect(payload).toStrictEqual({
      [PAEventsType.SEND_PA_HAS_NOTIFICATIONS]: 'yes',
    });
  });

  it('should map has notifications event data to no payload', () => {
    const payload = mapBooleanSuperPropertyToPayload(PAEventsType.SEND_PA_HAS_NOTIFICATIONS, {
      value: false,
    });

    expect(payload).toStrictEqual({
      [PAEventsType.SEND_PA_HAS_NOTIFICATIONS]: 'no',
    });
  });
});
