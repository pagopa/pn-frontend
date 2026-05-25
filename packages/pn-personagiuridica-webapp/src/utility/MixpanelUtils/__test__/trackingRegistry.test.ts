import { apiKeyTrackingConfigs } from '../apiKeyEvents';
import { contactTrackingConfigs } from '../contactEvents';
import { mandateTrackingConfigs } from '../mandateEvents';
import { navigationTrackingConfigs } from '../navigationEvents';
import { notificationTrackingConfigs } from '../notificationEvents';
import { serviceStatusTrackingConfigs } from '../serviceStatusEvents';
import { superPropertyTrackingConfigs } from '../superPropertyEvents';
import { pgTrackingConfigs } from '../trackingRegistry';

describe('trackingRegistry', () => {
  it('should compose PG tracking configs from domain configs', () => {
    expect(pgTrackingConfigs).toStrictEqual({
      ...apiKeyTrackingConfigs,
      ...contactTrackingConfigs,
      ...mandateTrackingConfigs,
      ...navigationTrackingConfigs,
      ...notificationTrackingConfigs,
      ...serviceStatusTrackingConfigs,
      ...superPropertyTrackingConfigs,
    });
  });
});
