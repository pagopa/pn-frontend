import { EventPropertyType } from '@pagopa-pn/pn-commons';

import { PAEventsType } from '../../../models/PAEventsType';
import { superPropertyTrackingConfigs } from '../superPropertyEvents';

describe('superPropertyTrackingConfigs', () => {
  it('should build SEND_PA_HAS_NOTIFICATIONS super property event', () => {
    const result = superPropertyTrackingConfigs[PAEventsType.SEND_PA_HAS_NOTIFICATIONS]({
      value: true,
    });

    expect(result).toStrictEqual({
      [EventPropertyType.SUPER_PROPERTY]: {
        [PAEventsType.SEND_PA_HAS_NOTIFICATIONS]: 'yes',
      },
    });
  });
});
