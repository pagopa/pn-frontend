import MockAdapter from 'axios-mock-adapter';
import { tenYearsAgo, today, LegalFactId, LegalFactType } from '@pagopa-pn/pn-commons';
import { apiClient } from '../../axios';
import { NotificationsApi } from '../Notifications.api';
import {
  notificationsFromBe,
  notificationsToFe,
} from '../../../redux/dashboard/__test__/test-utils';
import {
  notificationFromBe,
  notificationToFe,
} from '../../../redux/notification/__test__/test-utils';
import { mockAuthentication } from '../../../redux/auth/__test__/reducers.test';
import { NOTIFICATIONS_LIST, NOTIFICATION_DETAIL, NOTIFICATION_DETAIL_DOCUMENTS, NOTIFICATION_DETAIL_LEGALFACT } from '../notifications.routes';

describe('Notifications api tests', () => {
  mockAuthentication();

  it('getReceivedNotifications', async () => {
    const mock = new MockAdapter(apiClient);
    mock.onGet(NOTIFICATIONS_LIST({
      startDate: tenYearsAgo.toISOString(),
      endDate: today.toISOString(),
    })).reply(200, notificationsFromBe);
    const res = await NotificationsApi.getReceivedNotifications({
      startDate: tenYearsAgo.toISOString(),
      endDate: today.toISOString(),
    });
    expect(res).toStrictEqual(notificationsToFe);
    mock.reset();
    mock.restore();
  });

  it('getReceivedNotification', async () => {
    const iun = 'mocked-iun';
    const mock = new MockAdapter(apiClient);
    mock.onGet(NOTIFICATION_DETAIL(iun)).reply(200, notificationFromBe);
    const res = await NotificationsApi.getReceivedNotification(iun);
    expect(res).toStrictEqual(notificationToFe);
    mock.reset();
    mock.restore();
  });

  it('getReceivedNotificationDocument', async () => {
    const iun = 'mocked-iun';
    const documentIndex = 0;
    const mock = new MockAdapter(apiClient);
    mock
      .onGet(NOTIFICATION_DETAIL_DOCUMENTS(iun, documentIndex))
      .reply(200, { url: 'http://mocked-url.com' });
    const res = await NotificationsApi.getReceivedNotificationDocument(iun, documentIndex);
    expect(res).toStrictEqual({ url: 'http://mocked-url.com' });
    mock.reset();
    mock.restore();
  });

  it('getReceivedNotificationLegalfact', async () => {
    const iun = 'mocked-iun';
    const legalFact: LegalFactId = {
      key: 'mocked-key',
      type: LegalFactType.ANALOG_DELIVERY,
    };
    const mock = new MockAdapter(apiClient);
    mock
      .onGet(NOTIFICATION_DETAIL_LEGALFACT(iun, legalFact))
      .reply(200, undefined);
    const res = await NotificationsApi.getReceivedNotificationLegalfact(iun, legalFact);
    expect(res).toStrictEqual({ url: '' });
    mock.reset();
    mock.restore();
  });
});
