import MockAdapter from 'axios-mock-adapter';

import {
  LegalFactId,
  LegalFactType,
  PaymentAttachmentNameType,
  formatToTimezoneString,
  getNextDay,
  tenYearsAgo,
  today,
} from '@pagopa-pn/pn-commons';

import { mockApi } from '../../../__test__/test-utils';
import { mockAuthentication } from '../../../redux/auth/__test__/test-utils';
import {
  notificationsFromBe,
  notificationsToFe,
} from '../../../redux/dashboard/__test__/test-utils';
import {
  notificationFromBe,
  notificationToFe,
} from '../../../redux/notification/__test__/test-utils';
import { apiClient } from '../../apiClients';
import { NotificationsApi } from '../Notifications.api';
import {
  NOTIFICATIONS_LIST,
  NOTIFICATION_DETAIL,
  NOTIFICATION_DETAIL_DOCUMENTS,
  NOTIFICATION_DETAIL_LEGALFACT,
  NOTIFICATION_DETAIL_OTHER_DOCUMENTS,
  NOTIFICATION_ID_FROM_QRCODE,
  NOTIFICATION_PAYMENT_ATTACHMENT,
  NOTIFICATION_PAYMENT_INFO,
  NOTIFICATION_PAYMENT_URL,
} from '../notifications.routes';

describe('Notifications api tests', () => {
  let mock: MockAdapter;

  mockAuthentication();

  afterEach(() => {
    if (mock) {
      mock.restore();
      mock.reset();
    }
  });

  it('getReceivedNotifications', async () => {
    mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATIONS_LIST({
        startDate: formatToTimezoneString(tenYearsAgo),
        endDate: formatToTimezoneString(getNextDay(today)),
      }),
      200,
      undefined,
      notificationsFromBe
    );
    const res = await NotificationsApi.getReceivedNotifications({
      startDate: formatToTimezoneString(tenYearsAgo),
      endDate: formatToTimezoneString(getNextDay(today)),
    });
    expect(res).toStrictEqual(notificationsToFe);
  });

  it('getReceivedNotification', async () => {
    const iun = 'mocked-iun';
    mock = mockApi(apiClient, 'GET', NOTIFICATION_DETAIL(iun), 200, undefined, notificationFromBe);
    const res = await NotificationsApi.getReceivedNotification(iun, 'CGNNMO80A03H501U', []);
    expect(res).toStrictEqual(notificationToFe);
  });

  it('getReceivedNotificationDocument', async () => {
    const iun = 'mocked-iun';
    const documentIndex = '0';
    mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_DETAIL_DOCUMENTS(iun, documentIndex),
      200,
      undefined,
      { url: 'http://mocked-url.com' }
    );
    const res = await NotificationsApi.getReceivedNotificationDocument(iun, documentIndex);
    expect(res).toStrictEqual({ url: 'http://mocked-url.com' });
  });

  it('getReceivedNotificationOtherDocument', async () => {
    const iun = 'mocked-iun';
    const otherDocument = {
      documentId: 'mocked-id',
      documentType: 'mocked-type',
    };
    mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_DETAIL_OTHER_DOCUMENTS(iun, otherDocument),
      200,
      undefined,
      { url: 'http://mocked-url.com' }
    );
    const res = await NotificationsApi.getReceivedNotificationOtherDocument(iun, otherDocument);
    expect(res).toStrictEqual({ url: 'http://mocked-url.com' });
  });

  it('getReceivedNotificationLegalfact', async () => {
    const iun = 'mocked-iun';
    const legalFact: LegalFactId = {
      key: 'mocked-key',
      category: LegalFactType.ANALOG_DELIVERY,
    };
    mock = mockApi(apiClient, 'GET', NOTIFICATION_DETAIL_LEGALFACT(iun, legalFact), 200);
    const res = await NotificationsApi.getReceivedNotificationLegalfact(iun, legalFact);
    expect(res).toStrictEqual({ url: '' });
  });

  it('getPaymentAttachment', async () => {
    const iun = 'mocked-iun';
    const attachmentName = 'mocked-attachmentName';
    mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_PAYMENT_ATTACHMENT(iun, attachmentName),
      200,
      undefined,
      { url: 'http://mocked-url.com' }
    );
    const res = await NotificationsApi.getPaymentAttachment(
      iun,
      attachmentName as PaymentAttachmentNameType
    );
    expect(res).toStrictEqual({ url: 'http://mocked-url.com' });
  });

  it('getNotificationPaymentInfo', async () => {
    const taxId = 'mocked-taxId';
    const noticeCode = 'mocked-noticeCode';
    mock = mockApi(apiClient, 'GET', NOTIFICATION_PAYMENT_INFO(taxId, noticeCode), 200, null, {
      status: 'SUCCEEDED',
      amount: 10,
    });
    const res = await NotificationsApi.getNotificationPaymentInfo(noticeCode, taxId);
    expect(res).toStrictEqual({
      status: 'SUCCEEDED',
      amount: 10,
    });
  });

  it('getNotificationPaymentUrl', async () => {
    const taxId = 'mocked-taxId';
    const noticeCode = 'mocked-noticeCode';
    mock = mockApi(
      apiClient,
      'POST',
      NOTIFICATION_PAYMENT_URL(),
      200,
      {
        paymentNotice: {
          noticeNumber: noticeCode,
          fiscalCode: taxId,
          amount: 0,
          companyName: 'Mocked Company',
          description: 'Mocked title',
        },
        returnUrl: 'mocked-return-url',
      },
      {
        checkoutUrl: 'mocked-url',
      }
    );
    const res = await NotificationsApi.getNotificationPaymentUrl(
      {
        noticeNumber: noticeCode,
        fiscalCode: taxId,
        amount: 0,
        companyName: 'Mocked Company',
        description: 'Mocked title',
      },
      'mocked-return-url'
    );
    expect(res).toStrictEqual({
      checkoutUrl: 'mocked-url',
    });
  });

  it('exchangeNotificationQrCode', async () => {
    mock = mockApi(
      apiClient,
      'POST',
      NOTIFICATION_ID_FROM_QRCODE(),
      200,
      { aarQrCodeValue: 'qr1' },
      {
        iun: 'mock-notification-1',
        mandateId: 'mock-mandate-1',
      }
    );
    const res = await NotificationsApi.exchangeNotificationQrCode('qr1');
    expect(res).toStrictEqual({
      iun: 'mock-notification-1',
      mandateId: 'mock-mandate-1',
    });
  });
});
