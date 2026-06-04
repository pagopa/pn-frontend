import { mandateTrackingConfigs } from '../mandateEvents';
import { notificationTrackingConfigs } from '../notificationEvents';
import { pgTrackingConfigs } from '../trackingRegistry';

describe('trackingRegistry', () => {
  it('should compose PG tracking configs from domain configs', () => {
    expect(pgTrackingConfigs).toStrictEqual({
      ...notificationTrackingConfigs,
      ...mandateTrackingConfigs,
    });
  });
});
