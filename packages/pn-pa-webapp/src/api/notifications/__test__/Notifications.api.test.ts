import MockAdapter from 'axios-mock-adapter';

import { LegalFactId, LegalFactType } from '../../../redux/notification/types';
import { tenYearsAgo, today } from '../../../utils/date.utility';
import { notificationsFromBe, notificationsToFe } from '../../../redux/dashboard/__test__/test-utils';
import { notificationFromBe, notificationToFe } from '../../../redux/notification/__test__/test-utils';
import { mockAuthentication } from '../../../redux/auth/__test__/reducers.test';
import { apiClient } from '../../axios';
import { NotificationsApi } from '../Notifications.api';

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
  
  it('getSentNotificationLegalfact', async() => {
    const iun = 'mocked-iun';
    const legalFact: LegalFactId = {
      key: 'mocked-key',
      type: LegalFactType.ANALOG_DELIVERY
    };
    const mock = new MockAdapter(apiClient);
    mock.onGet(`/delivery-push/legalfacts/${iun}/${legalFact.type}/${legalFact.key}`).reply(200, undefined);
    const res = await NotificationsApi.getSentNotificationLegalfact(iun, legalFact);
    expect(res).toStrictEqual({url: ''});
    mock.reset();
    mock.restore();
  });
});