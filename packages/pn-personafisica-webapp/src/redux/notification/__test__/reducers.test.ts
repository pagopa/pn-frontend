import {
  LegalFactId,
  LegalFactType,
  NotificationDetail,
  PaymentAttachmentSName,
  RecipientType,
  populatePaymentHistory,
} from '@pagopa-pn/pn-commons';
import MockAdapter from 'axios-mock-adapter';

import {
  notificationDTO,
  notificationToFe,
  recipient,
} from '../../../../__mocks__/NotificationDetail.mock';
import { paymentInfo } from '../../../../__mocks__/ExternalRegistry.mock';
import { AppStatusApi } from '../../../api/appStatus/AppStatus.api';
import {
  NOTIFICATION_DETAIL,
  NOTIFICATION_DETAIL_DOCUMENTS,
  NOTIFICATION_DETAIL_LEGALFACT,
  NOTIFICATION_DETAIL_OTHER_DOCUMENTS,
  NOTIFICATION_PAYMENT_ATTACHMENT,
  NOTIFICATION_PAYMENT_INFO,
  NOTIFICATION_PAYMENT_URL,
} from '../../../api/notifications/notifications.routes';
import { mockApi } from '../../../__test__/test-utils';
import { mockAuthentication } from '../../auth/__test__/test-utils';
import { simpleDowntimeLogPage } from '../../appStatus/__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
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
  getReceivedNotificationOtherDocument,
} from '../actions';
import { resetLegalFactState, resetState } from '../reducers';

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
  paymentInfo: [],
  downtimeLegalFactUrl: '',
  downtimeEvents: [],
};

describe('Notification detail redux state tests', () => {
  let mock: MockAdapter;
  mockAuthentication();

  afterEach(() => {
    if (mock) {
      mock.restore();
      mock.reset();
    }
  });

  it('Initial state', () => {
    const state = store.getState().notificationState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to fetch the notification detail', async () => {
    const iun = notificationDTO.iun;
    mock = mockApi(apiClient, 'GET', NOTIFICATION_DETAIL(iun), 200, undefined, notificationDTO);
    const action = await store.dispatch(
      getReceivedNotification({
        iun: notificationDTO.iun,
        currentUserTaxId: recipient.taxId,
        delegatorsFromStore: [],
      })
    );
    const payload = action.payload as NotificationDetail;
    expect(action.type).toBe('getReceivedNotification/fulfilled');
    expect(payload).toEqual(notificationToFe);
  });

  it('Should be able to fetch the notification document', async () => {
    const iun = notificationDTO.iun;
    const documentIndex = '0';
    const url = 'http://mocked-url.com';
    mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_DETAIL_DOCUMENTS(iun, documentIndex),
      200,
      undefined,
      { url }
    );
    const action = await store.dispatch(getReceivedNotificationDocument({ iun, documentIndex }));
    const payload = action.payload;
    expect(action.type).toBe('getReceivedNotificationDocument/fulfilled');
    expect(payload).toEqual({ url });
  });

  it('Should be able to fetch the notification other document', async () => {
    const iun = notificationDTO.iun;
    const otherDocument = {
      documentId: 'mocked-id',
      documentType: 'mocked-type',
    };
    const url = 'http://mocked-url.com';
    mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_DETAIL_OTHER_DOCUMENTS(iun, otherDocument),
      200,
      undefined,
      { url }
    );
    const action = await store.dispatch(
      getReceivedNotificationOtherDocument({
        iun,
        otherDocument,
      })
    );
    const payload = action.payload;
    expect(action.type).toBe('getReceivedNotificationOtherDocument/fulfilled');
    expect(payload).toEqual({ url });
  });

  it('Should be able to fetch the notification legalfact', async () => {
    const iun = notificationDTO.iun;
    const legalFact: LegalFactId = {
      key: 'mocked-key',
      category: LegalFactType.ANALOG_DELIVERY,
    };
    const url = 'http://mocked-url.com';
    mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_DETAIL_LEGALFACT(iun, legalFact),
      200,
      undefined,
      { url }
    );
    const action = await store.dispatch(
      getReceivedNotificationLegalfact({
        iun,
        legalFact,
      })
    );
    const payload = action.payload;
    expect(action.type).toBe('getReceivedNotificationLegalfact/fulfilled');
    expect(payload).toEqual({ url });
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
    const iun = notificationDTO.iun;
    const attachmentName = PaymentAttachmentSName.PAGOPA;
    const url = 'http://mocked-url.com';
    mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_PAYMENT_ATTACHMENT(iun, attachmentName),
      200,
      undefined,
      { url }
    );
    const action = await store.dispatch(getPaymentAttachment({ iun, attachmentName }));
    const payload = action.payload;
    expect(action.type).toBe('getPaymentAttachment/fulfilled');
    expect(payload).toEqual({ url });
    const state = store.getState().notificationState;
    expect(state.pagopaAttachmentUrl).toEqual(url);
  });

  it('Should be able to fetch the f24 document', async () => {
    const iun = notificationDTO.iun;
    const attachmentName = PaymentAttachmentSName.F24;
    const url = 'http://mocked-url.com';
    mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_PAYMENT_ATTACHMENT(iun, attachmentName),
      200,
      undefined,
      { url }
    );
    const action = await store.dispatch(getPaymentAttachment({ iun, attachmentName }));
    const payload = action.payload;
    expect(action.type).toBe('getPaymentAttachment/fulfilled');
    expect(payload).toEqual({ url });
    const state = store.getState().notificationState;
    expect(state.f24AttachmentUrl).toEqual(url);
  });

  it('Should be able to fetch payment info', async () => {
    const paymentInfoRequest = paymentInfo.map((payment) => ({
      creditorTaxId: payment.creditorTaxId,
      noticeCode: payment.noticeCode,
    }));
    mock = mockApi(
      apiClient,
      'POST',
      NOTIFICATION_PAYMENT_INFO(),
      200,
      paymentInfoRequest,
      paymentInfo
    );
    mockApi(mock, 'GET', NOTIFICATION_DETAIL(notificationDTO.iun), 200, undefined, notificationDTO);
    // store notification
    await store.dispatch(
      getReceivedNotification({
        iun: notificationDTO.iun,
        currentUserTaxId: recipient.taxId,
        delegatorsFromStore: [],
      })
    );
    const notification = store.getState().notificationState.notification;
    const paymentHistory = populatePaymentHistory(
      recipient.taxId,
      notification.timeline,
      notification.recipients,
      paymentInfo
    );
    const action = await store.dispatch(
      getNotificationPaymentInfo({ taxId: recipient.taxId, paymentInfoRequest })
    );
    const payload = action.payload;
    expect(action.type).toBe('getNotificationPaymentInfo/fulfilled');
    expect(payload).toEqual(paymentHistory);
    const state = store.getState().notificationState;
    expect(state.paymentInfo).toEqual(paymentHistory);
  });

  it('Should be able to fetch payment url', async () => {
    const taxId = 'mocked-taxId';
    const noticeCode = 'mocked-noticeCode';
    const paymentUrlRequest = {
      paymentNotice: {
        noticeNumber: noticeCode,
        fiscalCode: taxId,
        amount: 0,
        companyName: 'Mocked Company',
        description: 'Mocked title',
      },
      returnUrl: 'mocked-return-url',
    };
    const paymentUrlResponse = {
      checkoutUrl: 'mocked-url',
    };
    mock = mockApi(
      apiClient,
      'POST',
      NOTIFICATION_PAYMENT_URL(),
      200,
      paymentUrlRequest,
      paymentUrlResponse
    );
    const action = await store.dispatch(getNotificationPaymentUrl(paymentUrlRequest));
    const payload = action.payload;
    expect(action.type).toBe('getNotificationPaymentUrl/fulfilled');
    expect(payload).toEqual(paymentUrlResponse);
  });

  // TODO: convert to new logic
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

  // TODO: convert to new logic
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
