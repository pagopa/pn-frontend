import { CREATE_NOTIFICATION, NOTIFICATION_PRELOAD_DOCUMENT } from '../notifications.routes';

describe('Notifications routes', () => {
  it('should compile NOTIFICATION_PRELOAD_DOCUMENT', () => {
    const route = NOTIFICATION_PRELOAD_DOCUMENT();
    expect(route).toEqual('/delivery/attachments/preload');
  });

  it('should compile CREATE_NOTIFICATION', () => {
    const route = CREATE_NOTIFICATION();
    expect(route).toEqual('/delivery/v2.3/requests');
  });
});
