import MockAdapter from 'axios-mock-adapter';
import {
  tenYearsAgo,
  today,
  LegalFactId,
  LegalFactType,
  PaymentAttachmentNameType,
  formatToTimezoneString,
  getNextDay,
} from '@pagopa-pn/pn-commons';
import { apiClient } from '../../apiClients';
import { NotificationsApi } from '../Notifications.api';
import {
  notificationsFromBe,
  notificationsToFe,
} from '../../../redux/dashboard/__test__/test-utils';
import {
  notificationFromBe,
  notificationToFe,
} from '../../../redux/notification/__test__/test-utils';
import { mockAuthentication } from '../../../redux/auth/__test__/test-utils';
import { cleanupMock, mockApi } from '../../../__test__/test-utils';
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
  mockAuthentication();

  it('getReceivedNotifications', async () => {
    const mock = mockApi(apiClient, 'GET', NOTIFICATIONS_LIST({
      startDate: formatToTimezoneString(tenYearsAgo),
      endDate: formatToTimezoneString(getNextDay(today)),
    }), 200, undefined, notificationsFromBe);
    const res = await NotificationsApi.getReceivedNotifications({
      startDate: formatToTimezoneString(tenYearsAgo),
      endDate: formatToTimezoneString(getNextDay(today)),
    });
    expect(res).toStrictEqual(notificationsToFe);
    cleanupMock(mock);
  });

  it('getReceivedNotifications with invalid date range', async () => {
    const startDate = formatToTimezoneString(today);
    const endDate = formatToTimezoneString(tenYearsAgo);
    const mock = mockApi(apiClient, 'GET', NOTIFICATIONS_LIST({
      startDate,
      endDate
    }), 400, undefined, { error: 'Invalid date range' });
    await expect(
      NotificationsApi.getReceivedNotifications({
        startDate,
        endDate,
      })
    ).rejects.toThrowError('Request failed with status code 400');
    cleanupMock(mock);
  });

  it('getReceivedNotifications with server error', async () => {
    const startDate = formatToTimezoneString(tenYearsAgo);
    const endDate = formatToTimezoneString(today);
    const mock = mockApi(apiClient, 'GET', NOTIFICATIONS_LIST({
      startDate,
      endDate
    }), 500);
    await expect(
      NotificationsApi.getReceivedNotifications({
        startDate,
        endDate,
      })
    ).rejects.toThrow(Error);
    cleanupMock(mock);
  });

  it('getReceivedNotification', async () => {
    const iun = 'mocked-iun';
    const mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_DETAIL(iun),
      200,
      undefined,
      notificationFromBe);
    const res = await NotificationsApi.getReceivedNotification(iun, 'CGNNMO80A03H501U', []);
    expect(res).toStrictEqual(notificationToFe);
    cleanupMock(mock);
  });

  it('getReceivedNotificationDocument', async () => {
    const iun = 'mocked-iun';
    const documentIndex = '0';
    const mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_DETAIL_DOCUMENTS(iun, documentIndex),
      200,
      undefined,
      { url: 'http://mocked-url.com' });
    const res = await NotificationsApi.getReceivedNotificationDocument(iun, documentIndex);
    expect(res).toStrictEqual({ url: 'http://mocked-url.com' });
    cleanupMock(mock);
  });

  it('getReceivedNotificationOtherDocument', async () => {
    const iun = 'mocked-iun';
    const otherDocument = {
      documentId: 'mocked-id',
      documentType: 'mocked-type',
    };
    const mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_DETAIL_OTHER_DOCUMENTS(iun, otherDocument),
      200,
      undefined,
      { url: 'http://mocked-url.com' });
    const res = await NotificationsApi.getReceivedNotificationOtherDocument(iun, otherDocument);
    expect(res).toStrictEqual({ url: 'http://mocked-url.com' });
    cleanupMock(mock);
  });

  it('getReceivedNotificationLegalfact', async () => {
    const iun = 'mocked-iun';
    const legalFact: LegalFactId = {
      key: 'mocked-key',
      category: LegalFactType.ANALOG_DELIVERY,
    };
    const mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_DETAIL_LEGALFACT(iun, legalFact),
      200,
      undefined,
      undefined);
    const res = await NotificationsApi.getReceivedNotificationLegalfact(iun, legalFact);
    expect(res).toStrictEqual({ url: '' });
    cleanupMock(mock);
  });

  it('getPaymentAttachment', async () => {
    const iun = 'mocked-iun';
    const attachmentName = 'mocked-attachmentName';
    const mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_PAYMENT_ATTACHMENT(iun, attachmentName),
      200,
      undefined,
      { url: 'http://mocked-url.com' });
    const res = await NotificationsApi.getPaymentAttachment(
      iun,
      attachmentName as PaymentAttachmentNameType
    );
    expect(res).toStrictEqual({ url: 'http://mocked-url.com' });
    cleanupMock(mock);
  });

  it('getNotificationPaymentInfo', async () => {
    const taxId = 'mocked-taxId';
    const noticeCode = 'mocked-noticeCode';
    const mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_PAYMENT_INFO(taxId, noticeCode),
      200,
      null,
      {
        status: 'SUCCEEDED',
        amount: 10,
      }
    );
    const res = await NotificationsApi.getNotificationPaymentInfo(noticeCode, taxId);
    expect(res).toStrictEqual({
      status: 'SUCCEEDED',
      amount: 10,
    });
    cleanupMock(mock);
  });

  it('getNotificationPaymentUrl', async () => {
    const taxId = 'mocked-taxId';
    const noticeCode = 'mocked-noticeCode';
    const mock = mockApi(
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
    cleanupMock(mock);
  });

  it('exchangeNotificationQrCode', async () => {
    const mock = mockApi(
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
    mock.onPost(NOTIFICATION_ID_FROM_QRCODE(), { aarQrCodeValue: 'qr2' }).reply(200, {
      iun: 'mock-notification-2',
    });
    const allRes = {
      res1: await NotificationsApi.exchangeNotificationQrCode('qr1'),
      res2: await NotificationsApi.exchangeNotificationQrCode('qr2')
    };
    expect(allRes).toStrictEqual({
      res1: {
        iun: 'mock-notification-1',
        mandateId: 'mock-mandate-1',
      },
      res2: {
        iun: 'mock-notification-2',
      }
    });
    cleanupMock(mock);
  });
});
