import {
  LegalFactId,
  LegalFactType,
  PaymentAttachmentNameType,
  PaymentAttachmentSName,
  formatToTimezoneString,
  getNextDay,
  tenYearsAgo,
  today,
} from '@pagopa-pn/pn-commons';
import { notificationsDTO, notificationsToFe } from '../../../../__mocks__/Notifications.mock';
import { notificationDTO, notificationToFe } from '../../../../__mocks__/NotificationDetail.mock';
import { paymentInfo } from '../../../../__mocks__/ExternalRegistry.mock';
import { mockApi } from '../../../__test__/test-utils';
import { mockAuthentication } from '../../../redux/auth/__test__/test-utils';
import { apiClient } from '../../apiClients';
import { NotificationsApi } from '../Notifications.api';
import {
  NOTIFICATIONS_LIST,
  NOTIFICATION_DETAIL,
  NOTIFICATION_DETAIL_DOCUMENTS,
  NOTIFICATION_DETAIL_LEGALFACT,
  NOTIFICATION_ID_FROM_QRCODE,
  NOTIFICATION_PAYMENT_ATTACHMENT,
  NOTIFICATION_PAYMENT_INFO,
  NOTIFICATION_PAYMENT_URL,
} from '../notifications.routes';

describe('Notifications api tests', () => {
  mockAuthentication();

  it('getReceivedNotifications', async () => {
    const mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATIONS_LIST({
        startDate: formatToTimezoneString(tenYearsAgo),
        endDate: formatToTimezoneString(getNextDay(today)),
      }),
      200,
      undefined,
      notificationsDTO
    );
    const res = await NotificationsApi.getReceivedNotifications({
      startDate: formatToTimezoneString(tenYearsAgo),
      endDate: formatToTimezoneString(getNextDay(today)),
      isDelegatedPage: false,
    });
    expect(res).toStrictEqual(notificationsToFe);
    mock.reset();
    mock.restore();
  });

  it('getReceivedNotification', async () => {
    const iun = notificationDTO.iun;
    const mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_DETAIL(iun),
      200,
      undefined,
      notificationDTO
    );
    const res = await NotificationsApi.getReceivedNotification(iun);
    expect(res).toStrictEqual(notificationToFe);
    mock.reset();
    mock.restore();
  });

  it('getReceivedNotificationDocument', async () => {
    const iun = notificationDTO.iun;
    const documentIndex = '0';
    const mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_DETAIL_DOCUMENTS(iun, documentIndex),
      200,
      undefined,
      { url: 'http://mocked-url.com' }
    );
    const res = await NotificationsApi.getReceivedNotificationDocument(iun, documentIndex);
    expect(res).toStrictEqual({ url: 'http://mocked-url.com' });
    mock.reset();
    mock.restore();
  });

  it('getReceivedNotificationLegalfact', async () => {
    const iun = notificationDTO.iun;
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
      undefined
    );
    const res = await NotificationsApi.getReceivedNotificationLegalfact(iun, legalFact);
    expect(res).toStrictEqual({ url: '' });
    mock.reset();
    mock.restore();
  });

  it('getPaymentAttachment', async () => {
    const iun = notificationDTO.iun;
    const attachmentName = PaymentAttachmentSName.PAGOPA;
    const mock = mockApi(
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
    mock.reset();
    mock.restore();
  });

  it('getNotificationPaymentInfo', async () => {
    const paymentInfoRequest = paymentInfo.map((payment) => ({
      creditorTaxId: payment.creditorTaxId,
      noticeCode: payment.noticeCode,
    }));
    const mock = mockApi(
      apiClient,
      'POST',
      NOTIFICATION_PAYMENT_INFO(),
      200,
      paymentInfoRequest,
      paymentInfo
    );
    const res = await NotificationsApi.getNotificationPaymentInfo(paymentInfoRequest);
    expect(res).toStrictEqual(paymentInfo);
    mock.reset();
    mock.restore();
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
    mock.reset();
    mock.restore();
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

    const res = await NotificationsApi.exchangeNotificationQrCode('qr1');
    expect(res).toStrictEqual({
      iun: 'mock-notification-1',
      mandateId: 'mock-mandate-1',
    });
    mock.reset();
    mock.restore();
  });
});
