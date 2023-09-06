import MockAdapter from 'axios-mock-adapter';

import {
  DOWNTIME_LEGAL_FACT_DETAILS,
  LegalFactType,
  PaymentAttachmentSName,
  PaymentInfoDetail,
  PaymentStatus,
  RecipientType,
} from '@pagopa-pn/pn-commons';

import { simpleDowntimeLogPage } from '../../../__mocks__/AppStatus.mock';
import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { notificationDTO, notificationToFe } from '../../../__mocks__/NotificationDetail.mock';
import { apiClient } from '../../../api/apiClients';
import { AppStatusApi } from '../../../api/appStatus/AppStatus.api';
import {
  NOTIFICATION_DETAIL,
  NOTIFICATION_DETAIL_DOCUMENTS,
  NOTIFICATION_DETAIL_LEGALFACT,
  NOTIFICATION_PAYMENT_ATTACHMENT,
  NOTIFICATION_PAYMENT_INFO,
  NOTIFICATION_PAYMENT_URL,
} from '../../../api/notifications/notifications.routes';
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
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  mockAuthentication();

  it('Initial state', () => {
    const state = store.getState().notificationState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to fetch the notification detail', async () => {
    mock.onGet(NOTIFICATION_DETAIL(notificationDTO.iun)).reply(200, notificationDTO);
    const action = await store.dispatch(
      getReceivedNotification({
        iun: notificationDTO.iun,
      })
    );
    expect(action.type).toBe('getReceivedNotification/fulfilled');
    expect(action.payload).toEqual(notificationToFe);
  });

  it('Should be able to fetch the notification document', async () => {
    const iun = notificationDTO.iun;
    const documentIndex = '0';
    mock
      .onGet(NOTIFICATION_DETAIL_DOCUMENTS(iun, documentIndex))
      .reply(200, { url: 'http://mocked-url.com' });
    const action = await store.dispatch(getReceivedNotificationDocument({ iun, documentIndex }));
    expect(action.type).toBe('getReceivedNotificationDocument/fulfilled');
    expect(action.payload).toEqual({ url: 'http://mocked-url.com' });
  });

  it('Should be able to fetch the notification legalfact', async () => {
    const iun = notificationDTO.iun;
    const legalFact = {
      key: 'mocked-key',
      category: LegalFactType.ANALOG_DELIVERY,
    };
    mock.onGet(NOTIFICATION_DETAIL_LEGALFACT(iun, legalFact)).reply(200, {
      url: 'http://mocked-url.com',
    });
    const action = await store.dispatch(getReceivedNotificationLegalfact({ iun, legalFact }));
    expect(action.type).toBe('getReceivedNotificationLegalfact/fulfilled');
    expect(action.payload).toEqual({ url: 'http://mocked-url.com' });
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
    mock
      .onGet(NOTIFICATION_PAYMENT_ATTACHMENT(iun, attachmentName))
      .reply(200, { url: 'http://pagopa-mocked-url.com' });
    const action = await store.dispatch(getPaymentAttachment({ iun, attachmentName }));
    expect(action.type).toBe('getPaymentAttachment/fulfilled');
    expect(action.payload).toEqual({ url: 'http://pagopa-mocked-url.com' });
    const state = store.getState().notificationState;
    expect(state.pagopaAttachmentUrl).toEqual('http://pagopa-mocked-url.com');
  });

  it('Should be able to fetch the f24 document', async () => {
    const iun = notificationDTO.iun;
    const attachmentName = PaymentAttachmentSName.F24;
    mock
      .onGet(NOTIFICATION_PAYMENT_ATTACHMENT(iun, attachmentName))
      .reply(200, { url: 'http://f24-mocked-url.com' });
    const action = await store.dispatch(getPaymentAttachment({ iun, attachmentName }));
    expect(action.type).toBe('getPaymentAttachment/fulfilled');
    expect(action.payload).toEqual({ url: 'http://f24-mocked-url.com' });
    const state = store.getState().notificationState;
    expect(state.f24AttachmentUrl).toEqual('http://f24-mocked-url.com');
  });

  it('Should be able to fetch payment info', async () => {
    const taxId = 'mocked-taxId';
    const noticeCode = 'mocked-noticeCode';
    mock.onGet(NOTIFICATION_PAYMENT_INFO(taxId, noticeCode)).reply(200, {
      status: PaymentStatus.REQUIRED,
      amount: 1200,
      url: 'mocked-url',
    });
    const action = await store.dispatch(getNotificationPaymentInfo({ noticeCode, taxId }));
    expect(action.payload).toEqual({
      status: PaymentStatus.REQUIRED,
      amount: 1200,
      url: 'mocked-url',
    });

    const state = store.getState().notificationState;
    expect(state.paymentInfo).toEqual({
      status: PaymentStatus.REQUIRED,
      amount: 1200,
      url: 'mocked-url',
    });
  });

  it('Should be able to fetch payment url', async () => {
    const request = {
      paymentNotice: {
        noticeNumber: 'mocked-noticeCode',
        fiscalCode: 'mocked-taxId',
        amount: 0,
        companyName: 'Mocked Company',
        description: 'Mocked title',
      },
      returnUrl: 'mocked-return-url',
    };
    mock.onPost(NOTIFICATION_PAYMENT_URL(), request).reply(200, {
      checkoutUrl: 'mocked-url',
    });
    const action = await store.dispatch(getNotificationPaymentUrl(request));
    expect(action.type).toBe('getNotificationPaymentUrl/fulfilled');
    expect(action.payload).toEqual({ checkoutUrl: 'mocked-url' });
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
  it('Should NOT be able to fetch payment url', async () => {
    const request = {
      paymentNotice: {
        noticeNumber: 'mocked-noticeCode',
        fiscalCode: 'mocked-taxId',
        amount: 0,
        companyName: 'Mocked Company',
        description: 'Mocked title',
      },
      returnUrl: 'mocked-return-url',
    };
    mock.onPost(NOTIFICATION_PAYMENT_URL(), request).reply(500);
    const action = await store.dispatch(getNotificationPaymentUrl(request));
    expect(action.type).toBe('getNotificationPaymentUrl/rejected');
    expect(action.payload).toEqual({
      response: {
        data: undefined,
        status: 500,
      },
    });
    const state = store.getState().notificationState;
    expect(state.paymentInfo).toStrictEqual({
      amount: 1200,
      status: PaymentStatus.FAILED,
      detail: PaymentInfoDetail.GENERIC_ERROR,
      url: 'mocked-url',
    });
  });

  it('Should be able to fetch the downtimes legal fact details', async () => {
    const response = {
      filename: 'mocked-filename',
      contentLength: 0,
      url: 'mocked-url',
    };
    mock.onGet(DOWNTIME_LEGAL_FACT_DETAILS('mocked-id')).reply(200, response);
    const action = await store.dispatch(getDowntimeLegalFactDocumentDetails('mocked-id'));
    expect(action.type).toBe('getNotificationDowntimeLegalFactDocumentDetails/fulfilled');
    expect(action.payload).toEqual(response);
  });
});
