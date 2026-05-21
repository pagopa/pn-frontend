import { contactTrackingConfigs } from '../contactEvents';
import { mandateTrackingConfigs } from '../mandateEvents';
import { navigationTrackingConfigs } from '../navigationEvents';
import { notificationTrackingConfigs } from '../notificationEvents';
import { pgTrackingConfigs } from '../trackingRegistry';

describe('trackingRegistry', () => {
  it('should compose PG tracking configs from domain configs', () => {
    expect(pgTrackingConfigs).toStrictEqual({
      ...contactTrackingConfigs,
      ...mandateTrackingConfigs,
      ...navigationTrackingConfigs,
      ...notificationTrackingConfigs,
    });
  });
});
