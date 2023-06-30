import {
  LegalFactType,
  NotificationDetail,
  PaymentAttachmentSName,
  PaymentStatus,
  RecipientType,
} from '@pagopa-pn/pn-commons';
import { AppStatusApi } from '../../../api/appStatus/AppStatus.api';
import { NotificationsApi } from '../../../api/notifications/Notifications.api';
import { mockAuthentication } from '../../auth/__test__/test-utils';
import { simpleDowntimeLogPage } from '../../appStatus/__test__/test-utils';
import { store } from '../../store';
import {
  getDowntimeEvents,
  getDowntimeLegalFactDocumentDetails,
  getNotificationPaymentInfo,
  getNotificationPaymentUrl,
  getPaymentAttachment,
  getReceivedNotification,
  getReceivedNotificationDocument,
  getReceivedNotificationLegalfact,
} from '../actions';
import { resetLegalFactState, resetState } from '../reducers';
import { notificationToFe } from './test-utils';

const initialState = {
  loading: false,
  notification: {
    paProtocolNumber: '',
    subject: '',
    recipients: [],
    senderDenomination: '',
    paymentExpirationDate: '',
    documents: [],
    otherDocuments: [],
    notificationFeePolicy: '',
    physicalCommunicationType: '',
    senderPaId: '',
    iun: '',
    sentAt: '',
    notificationStatus: '',
    notificationStatusHistory: [],
    timeline: [],
    currentRecipient: {
      recipientType: RecipientType.PF,
      taxId: '',
      denomination: '',
    },
    currentRecipientIndex: 0,
  },
  documentDownloadUrl: '',
  otherDocumentDownloadUrl: '',
  legalFactDownloadUrl: '',
  legalFactDownloadRetryAfter: 0,
  pagopaAttachmentUrl: '',
  f24AttachmentUrl: '',
  paymentInfo: {},
  downtimeLegalFactUrl: '',
  downtimeEvents: [],
};

describe('Notification detail redux state tests', () => {
  mockAuthentication();

  it('Initial state', () => {
    const state = store.getState().notificationState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to fetch the notification detail', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'getReceivedNotification');
    apiSpy.mockResolvedValue(notificationToFe);
    const action = await store.dispatch(
      getReceivedNotification({
        iun: 'mocked-iun',
      })
    );
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

  it('Should be able to reset state', () => {
    const action = store.dispatch(resetState());
    const payload = action.payload;
    expect(action.type).toBe('notificationSlice/resetState');
    expect(payload).toEqual(undefined);
    const state = store.getState().notificationState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to reset legalfact state', () => {
    const action = store.dispatch(resetLegalFactState());
    const payload = action.payload;
    expect(action.type).toBe('notificationSlice/resetLegalFactState');
    expect(payload).toEqual(undefined);
    const state = store.getState().notificationState;
    expect(state.legalFactDownloadRetryAfter).toEqual(0);
    expect(state.legalFactDownloadUrl).toEqual('');
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
    apiSpy.mockResolvedValue({ status: PaymentStatus.REQUIRED, amount: 1200, url: 'mocked-url' });
    const action = await store.dispatch(
      getNotificationPaymentInfo({ noticeCode: 'mocked-notice-code', taxId: 'mocked-tax-id' })
    );
    const payload = action.payload;
    expect(action.type).toBe('getNotificationPaymentInfo/fulfilled');
    expect(payload).toEqual({ status: PaymentStatus.REQUIRED, amount: 1200, url: 'mocked-url' });

    const state = store.getState().notificationState;
    expect(state.paymentInfo).toEqual({
      status: PaymentStatus.REQUIRED,
      amount: 1200,
      url: 'mocked-url',
    });
  });

  it('Should be able to fetch payment url', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'getNotificationPaymentUrl');
    apiSpy.mockResolvedValue({ checkoutUrl: 'mocked-url' });
    const action = await store.dispatch(
      getNotificationPaymentUrl({
        paymentNotice: {
          noticeNumber: 'mocked-noticeCode',
          fiscalCode: 'mocked-taxId',
          amount: 0,
          companyName: 'Mocked Company',
          description: 'Mocked title',
        },
        returnUrl: 'mocked-return-url',
      })
    );
    const payload = action.payload;
    expect(action.type).toBe('getNotificationPaymentUrl/fulfilled');
    expect(payload).toEqual({ checkoutUrl: 'mocked-url' });
  });

  it('Should be able to fetch the downtimes events', async () => {
    const apiSpy = jest.spyOn(AppStatusApi, 'getDowntimeLogPage');
    apiSpy.mockResolvedValue(simpleDowntimeLogPage);
    const action = await store.dispatch(
      getDowntimeEvents({
        startDate: '2022-10-23T15:50:04Z',
      })
    );
    const payload = action.payload;
    expect(action.type).toBe('getDowntimeEvents/fulfilled');
    expect(payload).toEqual(simpleDowntimeLogPage);
  });

  it('Should be able to fetch the downtimes legal fact details', async () => {
    const apiSpy = jest.spyOn(AppStatusApi, 'getLegalFactDetails');
    apiSpy.mockResolvedValue({
      filename: 'mocked-filename',
      contentLength: 0,
      url: 'mocked-url',
    });
    const action = await store.dispatch(getDowntimeLegalFactDocumentDetails('mocked-iun'));
    const payload = action.payload;
    expect(action.type).toBe('getNotificationDowntimeLegalFactDocumentDetails/fulfilled');
    expect(payload).toEqual({
      filename: 'mocked-filename',
      contentLength: 0,
      url: 'mocked-url',
    });
  });
});
