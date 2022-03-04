import MockAdapter from 'axios-mock-adapter';

import { tenYearsAgo, today } from '../../../utils/date.utility';
import { NotificationsApi } from '../Notifications.api';
import { notificationsFromBe, notificationsToFe } from '../../../redux/dashboard/__test__/test-utils';
import { notificationFromBe, notificationToFe } from '../../../redux/notification/__test__/test-utils';
import { mockAuthentication } from '../../../redux/auth/__test__/reducers.test';
import { apiClient } from '../../axios';

describe('Notifications api tests', () => {

  mockAuthentication();

  it('getSentNotifications', async() => {
    const mock = new MockAdapter(apiClient);
    mock.onGet(`/delivery/notifications/sent`).reply(200, notificationsFromBe);
    const res = await NotificationsApi.getSentNotifications({
      startDate: tenYearsAgo.toISOString(),
      endDate: today.toISOString()
    });
    expect(res).toStrictEqual(notificationsToFe);
    mock.reset();
    mock.restore();
  });

  it('getSentNotification', async() => {
    const iun = 'mocked-iun';
    const mock = new MockAdapter(apiClient);
    mock.onGet(`/delivery/notifications/sent/${iun}`).reply(200, notificationFromBe);
    const res = await NotificationsApi.getSentNotification(iun);
    expect(res).toStrictEqual(notificationToFe);
    mock.reset();
    mock.restore();
  });

  it('getSentNotificationDocument', async() => {
    const iun = 'mocked-iun';
    const documentIndex = 0;
    const mock = new MockAdapter(apiClient);
    mock.onGet(`/delivery/notifications/sent/${iun}/documents/${documentIndex}`).reply(200, {url: 'http://mocked-url.com'});
    const res = await NotificationsApi.getSentNotificationDocument(iun, documentIndex);
    expect(res).toStrictEqual({url: 'http://mocked-url.com'});
    mock.reset();
    mock.restore();
  });
});