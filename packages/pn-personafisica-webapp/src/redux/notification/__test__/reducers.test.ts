import MockAdapter from 'axios-mock-adapter';

import {
  DOWNTIME_HISTORY,
  DOWNTIME_LEGAL_FACT_DETAILS,
  KnownFunctionality,
  LegalFactType,
  PaidDetails,
  PaymentAttachmentSName,
  PaymentStatus,
  RecipientType,
  TimelineCategory,
  populatePaymentsPagoPaF24,
} from '@pagopa-pn/pn-commons';
import { PAYMENT_CACHE_KEY } from '@pagopa-pn/pn-commons/src/utility/paymentCaching.utility';

import { downtimesDTO, simpleDowntimeLogPage } from '../../../__mocks__/AppStatus.mock';
import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { paymentInfo } from '../../../__mocks__/ExternalRegistry.mock';
import {
  cancelledNotificationDTO,
  cancelledNotificationToFe,
  notificationDTO,
  notificationToFe,
  paymentsData,
  recipients,
} from '../../../__mocks__/NotificationDetail.mock';
import { createMockedStore } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import {
  NOTIFICATION_DETAIL,
  NOTIFICATION_DETAIL_DOCUMENTS,
  NOTIFICATION_DETAIL_LEGALFACT,
  NOTIFICATION_DETAIL_OTHER_DOCUMENTS,
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
  paymentsData: {
    pagoPaF24: [],
    f24Only: [],
  },
  downtimeLegalFactUrl: '',
  downtimeEvents: [],
};

const currentRecipient = notificationDTO.recipients.find((rec) => rec.taxId);

describe('Notification detail redux state tests', () => {
  let mock: MockAdapter;
  mockAuthentication();

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
    sessionStorage.removeItem(PAYMENT_CACHE_KEY);
  });

  afterAll(() => {
    mock.restore();
  });

  it('Initial state', () => {
    const state = store.getState().notificationState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to fetch the notification detail', async () => {
    const recipientIdx = recipients.findIndex(
      (recipient) => recipient.taxId === currentRecipient?.taxId
    );

    mock.onGet(NOTIFICATION_DETAIL(notificationDTO.iun)).reply(200, notificationDTO);
    const action = await store.dispatch(
      getReceivedNotification({
        iun: notificationDTO.iun,
        currentUserTaxId: currentRecipient!.taxId,
        delegatorsFromStore: [],
      })
    );
    expect(action.type).toBe('getReceivedNotification/fulfilled');
    expect(action.payload).toEqual(notificationToFe);

    const state = store.getState().notificationState;
    const payments = state.paymentsData.pagoPaF24;
    expect(payments).not.toHaveLength(0);

    payments.forEach((payment) => {
      const attachmentIdx = payments.findIndex(
        (paymentMock) =>
          payment.pagoPa?.noticeCode === paymentMock.pagoPa?.noticeCode &&
          payment.pagoPa?.creditorTaxId === paymentMock.pagoPa?.creditorTaxId
      );
      expect(payment.pagoPa?.attachmentIdx).toBe(attachmentIdx);
      expect(payment.pagoPa?.recIndex).toBe(recipientIdx);
    });
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

  it('Should be able to fetch the notification other document', async () => {
    const iun = notificationDTO.iun;
    const otherDocument = {
      documentId: 'mocked-id',
      documentType: 'mocked-type',
    };
    mock
      .onGet(NOTIFICATION_DETAIL_OTHER_DOCUMENTS(iun, otherDocument))
      .reply(200, { url: 'http://mocked-url.com' });
    const action = await store.dispatch(
      getReceivedNotificationOtherDocument({ iun, otherDocument })
    );
    expect(action.type).toBe('getReceivedNotificationOtherDocument/fulfilled');
    expect(action.payload).toEqual({ url: 'http://mocked-url.com' });
  });

  it('Should be able to fetch the notification legalfact', async () => {
    const iun = notificationDTO.iun;
    const legalFact = {
      key: 'mocked-key',
      category: LegalFactType.ANALOG_DELIVERY,
    };
    mock
      .onGet(NOTIFICATION_DETAIL_LEGALFACT(iun, legalFact))
      .reply(200, { url: 'http://mocked-url.com', retryAfter: true });
    const action = await store.dispatch(getReceivedNotificationLegalfact({ iun, legalFact }));
    expect(action.type).toBe('getReceivedNotificationLegalfact/fulfilled');
    expect(action.payload).toEqual({ url: 'http://mocked-url.com', retryAfter: true });
  });

  it('Should be able to reset state', () => {
    const action = store.dispatch(resetState());
    expect(action.type).toBe('notificationSlice/resetState');
    expect(action.payload).toEqual(undefined);
    const state = store.getState().notificationState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to reset legalfact state', () => {
    const action = store.dispatch(resetLegalFactState());
    expect(action.type).toBe('notificationSlice/resetLegalFactState');
    expect(action.payload).toEqual(undefined);
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
  });

  it('should save only payed payments (from timeline) if the notification is canceled', async () => {
    mock
      .onGet(NOTIFICATION_DETAIL(cancelledNotificationDTO.iun))
      .reply(200, cancelledNotificationDTO);
    const action = await store.dispatch(
      getReceivedNotification({
        iun: cancelledNotificationDTO.iun,
        currentUserTaxId: currentRecipient!.taxId,
        delegatorsFromStore: [],
      })
    );
    expect(action.type).toBe('getReceivedNotification/fulfilled');
    expect(action.payload).toEqual(cancelledNotificationToFe);

    const state = store.getState().notificationState;

    const payedTimelineEvents = cancelledNotificationToFe.timeline.filter(
      (item) => item.category === TimelineCategory.PAYMENT
    );

    const timelineRecipientPayments = currentRecipient?.payments?.filter((payment) =>
      payedTimelineEvents.some(
        (timelineEvent) =>
          (timelineEvent.details as PaidDetails).creditorTaxId === payment.pagoPa?.creditorTaxId &&
          (timelineEvent.details as PaidDetails).noticeCode === payment.pagoPa?.noticeCode
      )
    );

    if (!timelineRecipientPayments) {
      expect(state.paymentsData.pagoPaF24).toStrictEqual([]);
    } else {
      const payments = populatePaymentsPagoPaF24(
        cancelledNotificationToFe.timeline,
        timelineRecipientPayments,
        []
      );

      expect(state.paymentsData.pagoPaF24).toStrictEqual(payments);
    }
  });

  it('Should be able to fetch payment info', async () => {
    const mockedStore = createMockedStore({
      notificationState: {
        notification: notificationToFe,
        timeline: notificationToFe.timeline,
        paymentsData,
      },
    });
    const paymentInfoRequest = paymentInfo.map((payment) => ({
      creditorTaxId: payment.creditorTaxId,
      noticeCode: payment.noticeCode,
    }));

    mock.onPost(NOTIFICATION_PAYMENT_INFO(), paymentInfoRequest).reply(200, paymentInfo);

    const paymentHistory = populatePaymentsPagoPaF24(
      notificationDTO.timeline,
      paymentsData.pagoPaF24,
      paymentInfo
    );
    const action = await mockedStore.dispatch(
      getNotificationPaymentInfo({ taxId: recipients[2].taxId, paymentInfoRequest })
    );
    const payload = action.payload;
    expect(action.type).toBe('getNotificationPaymentInfo/fulfilled');
    expect(payload).toStrictEqual(paymentHistory);
    const state = mockedStore.getState().notificationState;
    expect(state.paymentsData.pagoPaF24).toStrictEqual(paymentHistory);
  });

  it('Should be able to fetch payment info and replace the modified payment', async () => {
    const mockedStore = createMockedStore({
      notificationState: {
        notification: notificationToFe,
        paymentsData: {
          pagoPaF24: populatePaymentsPagoPaF24(
            notificationToFe.timeline,
            paymentsData.pagoPaF24,
            paymentInfo
          ),
          f24Only: paymentsData.f24Only,
        },
      },
    });

    // Try to update redux state with an updated payment
    const failedPayment = paymentInfo.find((payment) => payment.status === PaymentStatus.FAILED);

    const paymentInfoRequest = [
      {
        creditorTaxId: failedPayment!.creditorTaxId,
        noticeCode: failedPayment!.noticeCode,
      },
    ];

    mock
      .onPost(NOTIFICATION_PAYMENT_INFO(), paymentInfoRequest)
      .reply(200, [{ ...failedPayment, status: PaymentStatus.SUCCEEDED }]);

    const paymentHistory = populatePaymentsPagoPaF24(
      notificationToFe.timeline,
      paymentsData.pagoPaF24,
      [{ ...failedPayment!, status: PaymentStatus.SUCCEEDED }]
    );

    const actualState = mockedStore.getState().notificationState.paymentsData.pagoPaF24;

    const action = await mockedStore.dispatch(
      getNotificationPaymentInfo({ taxId: recipients[2].taxId, paymentInfoRequest })
    );

    const newState = actualState.map((payment) => {
      if (
        payment.pagoPa?.creditorTaxId === failedPayment?.creditorTaxId &&
        payment.pagoPa?.noticeCode === failedPayment?.noticeCode
      ) {
        return { ...payment, pagoPa: { ...payment.pagoPa, status: PaymentStatus.SUCCEEDED } };
      }
      return payment;
    });

    const payload = action.payload;
    expect(action.type).toBe('getNotificationPaymentInfo/fulfilled');
    expect(payload).toStrictEqual(paymentHistory);
    const state = mockedStore.getState().notificationState.paymentsData.pagoPaF24;
    expect(state).toStrictEqual(newState);
  });

  it('Should be able to fetch payment info and not replace the payment if is equal', async () => {
    const mockedStore = createMockedStore({
      notificationState: {
        notification: notificationToFe,
        paymentsData: {
          pagoPaF24: populatePaymentsPagoPaF24(
            notificationToFe.timeline,
            paymentsData.pagoPaF24,
            paymentInfo
          ),
          f24Only: paymentsData.f24Only,
        },
      },
    });

    const failedPayment = paymentInfo.find((payment) => payment.status === PaymentStatus.FAILED);

    const paymentInfoRequest = [
      {
        creditorTaxId: failedPayment!.creditorTaxId,
        noticeCode: failedPayment!.noticeCode,
      },
    ];

    mock.onPost(NOTIFICATION_PAYMENT_INFO(), paymentInfoRequest).reply(200, [failedPayment]);

    const paymentHistory = populatePaymentsPagoPaF24(
      notificationToFe.timeline,
      paymentsData.pagoPaF24,
      [failedPayment!]
    );

    const actualState = mockedStore.getState().notificationState.paymentsData.pagoPaF24;

    const action = await mockedStore.dispatch(
      getNotificationPaymentInfo({ taxId: recipients[2].taxId, paymentInfoRequest })
    );

    const newState = mockedStore.getState().notificationState.paymentsData.pagoPaF24;

    const payload = action.payload;
    expect(action.type).toBe('getNotificationPaymentInfo/fulfilled');
    expect(payload).toStrictEqual(paymentHistory);
    expect(actualState).toStrictEqual(newState);
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

  it('Should NOT be able to fetch payment url', async () => {
    const initialState = store.getState().notificationState.paymentsData.pagoPaF24;
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
    expect(state.paymentsData.pagoPaF24).toStrictEqual(initialState);
  });

  it('Should be able to fetch the downtimes events', async () => {
    const mockRequest = {
      startDate: '2022-10-23T15:50:04Z',
    };
    mock
      .onGet(
        DOWNTIME_HISTORY({
          ...mockRequest,
          functionality: [
            KnownFunctionality.NotificationCreate,
            KnownFunctionality.NotificationVisualization,
            KnownFunctionality.NotificationWorkflow,
          ],
        })
      )
      .reply(200, downtimesDTO);
    const action = await store.dispatch(getDowntimeEvents(mockRequest));
    expect(action.type).toBe('getDowntimeEvents/fulfilled');
    expect(action.payload).toEqual(simpleDowntimeLogPage);
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
