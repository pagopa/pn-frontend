import MockAdapter from 'axios-mock-adapter';

import {
  PaymentAttachmentNameType,
  PaymentAttachmentSName,
  formatToTimezoneString,
  tenYearsAgo,
  today,
} from '@pagopa-pn/pn-commons';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { paymentInfo } from '../../../__mocks__/ExternalRegistry.mock';
import { notificationDTO } from '../../../__mocks__/NotificationDetail.mock';
import { notificationsDTO, notificationsToFe } from '../../../__mocks__/Notifications.mock';
import { apiClient } from '../../apiClients';
import { NotificationsApi } from '../Notifications.api';
import {
  NOTIFICATIONS_LIST,
  NOTIFICATION_ID_FROM_QRCODE,
  NOTIFICATION_PAYMENT_ATTACHMENT,
  NOTIFICATION_PAYMENT_INFO,
  NOTIFICATION_PAYMENT_URL,
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

  it('getPaymentAttachment', async () => {
    const iun = notificationDTO.iun;
    const attachmentName = PaymentAttachmentSName.PAGOPA;
    mock.onGet(NOTIFICATION_PAYMENT_ATTACHMENT(iun, attachmentName)).reply(200, {
      url: 'http://mocked-url.com',
    });
    const res = await NotificationsApi.getPaymentAttachment(
      iun,
      attachmentName as PaymentAttachmentNameType
    );
    expect(res).toStrictEqual({ url: 'http://mocked-url.com' });
  });

  it('getNotificationPaymentInfo', async () => {
    const paymentInfoRequest = paymentInfo.map((payment) => ({
      creditorTaxId: payment.creditorTaxId,
      noticeCode: payment.noticeCode,
    }));
    mock.onPost(NOTIFICATION_PAYMENT_INFO(), paymentInfoRequest).reply(200, paymentInfo);
    const res = await NotificationsApi.getNotificationPaymentInfo(paymentInfoRequest);
    expect(res).toStrictEqual(paymentInfo);
  });

  it('getNotificationPaymentUrl', async () => {
    const taxId = 'mocked-taxId';
    const noticeCode = 'mocked-noticeCode';
    mock
      .onPost(NOTIFICATION_PAYMENT_URL(), {
        paymentNotice: {
          noticeNumber: noticeCode,
          fiscalCode: taxId,
          amount: 0,
          companyName: 'Mocked Company',
          description: 'Mocked title',
        },
        returnUrl: 'mocked-return-url',
      })
      .reply(200, { checkoutUrl: 'mocked-url' });
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
