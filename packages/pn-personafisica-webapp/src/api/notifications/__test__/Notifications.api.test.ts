import MockAdapter from 'axios-mock-adapter';

import {
  LegalFactId,
  LegalFactType,
  PaymentAttachmentNameType,
  PaymentAttachmentSName,
} from '@pagopa-pn/pn-commons';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { paymentInfo } from '../../../__mocks__/ExternalRegistry.mock';
import { notificationDTO } from '../../../__mocks__/NotificationDetail.mock';
import { apiClient } from '../../apiClients';
import { NotificationsApi } from '../Notifications.api';
import {
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

  const mockedUrl = 'http://mocked-url.com';

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

  it('getReceivedNotificationDocument', async () => {
    const iun = notificationDTO.iun;
    const documentIndex = '0';
    mock.onGet(NOTIFICATION_DETAIL_DOCUMENTS(iun, documentIndex)).reply(200, { url: mockedUrl });
    const res = await NotificationsApi.getReceivedNotificationDocument(iun, documentIndex);
    expect(res).toHaveProperty('url', mockedUrl);
  });

  it('getReceivedNotificationOtherDocument', async () => {
    const iun = notificationDTO.iun;
    const otherDocument = {
      documentId: 'mocked-id',
      documentType: 'mocked-type',
    };
    mock
      .onGet(NOTIFICATION_DETAIL_OTHER_DOCUMENTS(iun, otherDocument))
      .reply(200, { url: mockedUrl });
    const res = await NotificationsApi.getReceivedNotificationOtherDocument(iun, otherDocument);
    expect(res).toHaveProperty('url', mockedUrl);
  });

  it('getReceivedNotificationOtherDocument - retryAfter', async () => {
    const iun = notificationDTO.iun;
    const otherDocument = {
      documentId: 'mocked-id',
      documentType: 'mocked-type',
    };
    mock
      .onGet(NOTIFICATION_DETAIL_OTHER_DOCUMENTS(iun, otherDocument))
      .reply(200, { url: mockedUrl, retryAfter: 1000, docType: 'AAR' });
    const res = await NotificationsApi.getReceivedNotificationOtherDocument(iun, otherDocument);
    expect(res).toStrictEqual({ url: mockedUrl, retryAfter: 1000, docType: 'AAR' });
  });

  it('getReceivedNotificationLegalfact', async () => {
    const iun = notificationDTO.iun;
    const legalFact: LegalFactId = {
      key: 'mocked-key',
      category: LegalFactType.ANALOG_DELIVERY,
    };
    mock.onGet(NOTIFICATION_DETAIL_LEGALFACT(iun, legalFact)).reply(200, { url: mockedUrl });
    const res = await NotificationsApi.getReceivedNotificationLegalfact(iun, legalFact);
    expect(res).toHaveProperty('url', mockedUrl);
  });

  it('getReceivedNotificationLegalfact - retryAfter', async () => {
    const iun = notificationDTO.iun;
    const legalFact: LegalFactId = {
      key: 'mocked-key',
      category: LegalFactType.ANALOG_DELIVERY,
    };
    mock
      .onGet(NOTIFICATION_DETAIL_LEGALFACT(iun, legalFact))
      .reply(200, { url: '', retryAfter: 1000, docType: 'AO3' });
    const res = await NotificationsApi.getReceivedNotificationLegalfact(iun, legalFact);
    expect(res).toStrictEqual({ url: '', retryAfter: 1000, docType: 'AO3' });
  });

  it('getPaymentAttachment', async () => {
    const iun = notificationDTO.iun;
    const attachmentName = PaymentAttachmentSName.PAGOPA;
    mock.onGet(NOTIFICATION_PAYMENT_ATTACHMENT(iun, attachmentName)).reply(200, { url: mockedUrl });
    const res = await NotificationsApi.getPaymentAttachment(
      iun,
      attachmentName as PaymentAttachmentNameType
    );
    expect(res).toStrictEqual({ url: mockedUrl });
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
