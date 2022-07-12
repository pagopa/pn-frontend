import { LegalFactType, NotificationDetail, PaymentAttachmentSName, PaymentStatus } from '@pagopa-pn/pn-commons';
import { NotificationsApi } from '../../../api/notifications/Notifications.api';
import { mockAuthentication } from '../../auth/__test__/reducers.test';
import { store } from '../../store';
import {
  getNotificationPaymentInfo,
  getPaymentAttachment,
  getReceivedNotification,
  getReceivedNotificationDocument,
  getReceivedNotificationLegalfact,
} from '../actions';
import { notificationToFe } from './test-utils';

describe('Notification detail redux state tests', () => {
  mockAuthentication();

  it('Initial state', () => {
    const state = store.getState().notificationState;
    expect(state).toEqual({
      loading: false,
      notification: {
        paProtocolNumber: '',
        subject: '',
        recipients: [],
        senderDenomination: '',
        paymentExpirationDate: '',
        documents: [],
        notificationFeePolicy: '',
        physicalCommunicationType: '',
        senderPaId: '',
        iun: '',
        sentAt: '',
        notificationStatus: '',
        notificationStatusHistory: [],
        timeline: []
      },
      documentDownloadUrl: '',
      legalFactDownloadUrl: '',
      pagopaAttachmentUrl: '',
      f24AttachmentUrl: '',
      paymentInfo: {},
    });
  });

  it('Should be able to fetch the notification detail', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'getReceivedNotification');
    apiSpy.mockResolvedValue(notificationToFe);
    const action = await store.dispatch(getReceivedNotification({iun: 'mocked-iun'}));
    const payload = action.payload as NotificationDetail;
    expect(action.type).toBe('getReceivedNotification/fulfilled');
    expect(payload).toEqual(notificationToFe);
  });

  it('Should be able to fetch the notification document', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'getReceivedNotificationDocument');
    apiSpy.mockResolvedValue({ url: 'http://mocked-url.com' });
    const action = await store.dispatch(
      getReceivedNotificationDocument({ iun: 'mocked-iun', documentIndex: '0' })
    );
    const payload = action.payload;
    expect(action.type).toBe('getReceivedNotificationDocument/fulfilled');
    expect(payload).toEqual({ url: 'http://mocked-url.com' });
  });

  it('Should be able to fetch the notification legalfact', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'getReceivedNotificationLegalfact');
    apiSpy.mockResolvedValue({ url: 'http://mocked-url.com' });
    const action = await store.dispatch(
      getReceivedNotificationLegalfact({
        iun: 'mocked-iun',
        legalFact: { key: 'mocked-key', category: LegalFactType.ANALOG_DELIVERY },
      })
    );
    const payload = action.payload;
    expect(action.type).toBe('getReceivedNotificationLegalfact/fulfilled');
    expect(payload).toEqual({ url: 'http://mocked-url.com' });
  });

  it('Should be able to fetch the pagopa document', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'getPaymentAttachment');
    apiSpy.mockResolvedValue({ url: 'http://pagopa-mocked-url.com' });
    const action = await store.dispatch(
      getPaymentAttachment({ iun: 'mocked-iun', attachmentName: PaymentAttachmentSName.PAGOPA })
    );
    const payload = action.payload;
    expect(action.type).toBe('getPaymentAttachment/fulfilled');
    expect(payload).toEqual({ url: 'http://pagopa-mocked-url.com' });

    const state = store.getState().notificationState;
    expect(state.pagopaAttachmentUrl).toEqual('http://pagopa-mocked-url.com');
  });

  it('Should be able to fetch the f24 document', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'getPaymentAttachment');
    apiSpy.mockResolvedValue({ url: 'http://f24-mocked-url.com' });
    const action = await store.dispatch(
      getPaymentAttachment({ iun: 'mocked-iun', attachmentName: PaymentAttachmentSName.F24 })
    );
    const payload = action.payload;
    expect(action.type).toBe('getPaymentAttachment/fulfilled');
    expect(payload).toEqual({ url: 'http://f24-mocked-url.com' });

    const state = store.getState().notificationState;
    expect(state.f24AttachmentUrl).toEqual('http://f24-mocked-url.com');
  });

  it('Should be able to fetch payment info', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'getNotificationPaymentInfo');
    apiSpy.mockResolvedValue({ status: PaymentStatus.REQUIRED, amount: 1200 });
    const action = await store.dispatch(
      getNotificationPaymentInfo({ noticeCode: 'mocked-notice-code', taxId: 'mocked-tax-id' })
    );
    const payload = action.payload;
    expect(action.type).toBe('getNotificationPaymentInfo/fulfilled');
    expect(payload).toEqual({ status: PaymentStatus.REQUIRED, amount: 1200 });

    const state = store.getState().notificationState;
    expect(state.paymentInfo).toEqual({ status: PaymentStatus.REQUIRED, amount: 1200 });
  });
});
