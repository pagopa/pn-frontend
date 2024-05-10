import MockAdapter from 'axios-mock-adapter';

import {
  LegalFactId,
  LegalFactType,
  formatToTimezoneString,
  tenYearsAgo,
  today,
} from '@pagopa-pn/pn-commons';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { notificationDTO } from '../../../__mocks__/NotificationDetail.mock';
import { notificationsDTO, notificationsToFe } from '../../../__mocks__/Notifications.mock';
import { apiClient } from '../../apiClients';
import { NotificationsApi } from '../Notifications.api';
import {
  NOTIFICATIONS_LIST,
  NOTIFICATION_DETAIL_DOCUMENTS,
  NOTIFICATION_DETAIL_LEGALFACT,
  NOTIFICATION_ID_FROM_QRCODE,
} from '../notifications.routes';

describe('Notifications api tests', () => {
  let mock: MockAdapter;

  mockAuthentication();

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('getReceivedNotifications', async () => {
    mock
      .onGet(
        NOTIFICATIONS_LIST({
          startDate: formatToTimezoneString(tenYearsAgo),
          endDate: formatToTimezoneString(today),
        })
      )
      .reply(200, notificationsDTO);
    const res = await NotificationsApi.getReceivedNotifications({
      startDate: formatToTimezoneString(tenYearsAgo),
      endDate: formatToTimezoneString(today),
      isDelegatedPage: false,
    });
    expect(res).toStrictEqual(notificationsToFe);
  });

  it('getReceivedNotificationDocument', async () => {
    const iun = notificationDTO.iun;
    const documentIndex = '0';
    mock.onGet(NOTIFICATION_DETAIL_DOCUMENTS(iun, documentIndex)).reply(200, {
      url: 'http://mocked-url.com',
    });
    const res = await NotificationsApi.getReceivedNotificationDocument(iun, documentIndex);
    expect(res).toStrictEqual({ url: 'http://mocked-url.com' });
  });

  it('getReceivedNotificationLegalfact', async () => {
    const iun = notificationDTO.iun;
    const legalFact: LegalFactId = {
      key: 'mocked-key',
      category: LegalFactType.ANALOG_DELIVERY,
    };
    mock.onGet(NOTIFICATION_DETAIL_LEGALFACT(iun, legalFact)).reply(200);
    const res = await NotificationsApi.getReceivedNotificationLegalfact(iun, legalFact);
    expect(res).toStrictEqual({ url: '' });
  });

  it('exchangeNotificationQrCode', async () => {
    mock.onPost(NOTIFICATION_ID_FROM_QRCODE(), { aarQrCodeValue: 'qr1' }).reply(200, {
      iun: 'mock-notification-1',
      mandateId: 'mock-mandate-1',
    });
    const res = await NotificationsApi.exchangeNotificationQrCode('qr1');
    expect(res).toStrictEqual({
      iun: 'mock-notification-1',
      mandateId: 'mock-mandate-1',
    });
  });
});
