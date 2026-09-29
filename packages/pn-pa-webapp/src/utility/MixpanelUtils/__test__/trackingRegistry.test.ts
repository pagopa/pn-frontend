import { apiKeyTrackingConfigs } from '../apiKeyEvents';
import { campaignTrackingConfigs } from '../campaignEvents';
import { errorTrackingConfigs } from '../errorEvents';
import { newNotificationTrackingConfigs } from '../newNotificationEvents';
import { notificationTrackingConfigs } from '../notificationEvents';
import { serviceStatusTrackingConfigs } from '../serviceStatusEvents';
import { statisticsTrackingConfigs } from '../statisticsEvents';
import { superPropertyTrackingConfigs } from '../superPropertyEvents';
import { paTrackingConfigs } from '../trackingRegistry';

describe('trackingRegistry', () => {
  it('should compose PA tracking configs from domain configs', () => {
    expect(paTrackingConfigs).toStrictEqual({
      ...apiKeyTrackingConfigs,
      ...campaignTrackingConfigs,
      ...errorTrackingConfigs,
      ...newNotificationTrackingConfigs,
      ...notificationTrackingConfigs,
      ...serviceStatusTrackingConfigs,
      ...statisticsTrackingConfigs,
      ...superPropertyTrackingConfigs,
    });
  });
});
