import MockAdapter from 'axios-mock-adapter';

import {
  NotificationDocumentType,
  PAYMENT_CACHE_KEY,
  PaidDetails,
  PaymentAttachmentSName,
  PaymentStatus,
  RecipientType,
  TimelineCategory,
  populatePaymentsPagoPaF24,
} from '@pagopa-pn/pn-commons';

import { downtimesDTO } from '../../../__mocks__/AppStatus.mock';
import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { errorMock } from '../../../__mocks__/Errors.mock';
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
import { getDowntimeLegalFact } from '../../appStatus/actions';
import { store } from '../../store';
import {
  getDowntimeHistory,
  getReceivedNotification,
  getReceivedNotificationDocument,
  getReceivedNotificationPayment,
  getReceivedNotificationPaymentInfo,
  getReceivedNotificationPaymentTppUrl,
  getReceivedNotificationPaymentUrl,
} from '../actions';
import { resetState } from '../reducers';

const initialState = {
  loading: false,
  notification: {
    subject: '',
    recipients: [],
    senderDenomination: '',
    paymentExpirationDate: '',
    documents: [],
    otherDocuments: [],
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
  paymentsData: {
    pagoPaF24: [],
    f24Only: [],
  },
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

    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);
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
    const mockRequest = {
      iun: notificationDTO.iun,
      documentType: NotificationDocumentType.ATTACHMENT,
      documentIdx: 0,
    };
    const mockResponse = { url: 'http://mocked-url.com' };
    mock
      .onGet(
        `/bff/v1/notifications/received/${mockRequest.iun}/documents/${mockRequest.documentType}?documentIdx=${mockRequest.documentIdx}`
      )
      .reply(200, mockResponse);
    const action = await store.dispatch(getReceivedNotificationDocument(mockRequest));
    expect(action.type).toBe('getReceivedNotificationDocument/fulfilled');
    expect(action.payload).toEqual(mockResponse);
  });

  it('Should be able to fetch the notification AAR document', async () => {
    const mockRequest = {
      iun: notificationDTO.iun,
      documentType: NotificationDocumentType.AAR,
      documentId: 'mocked-document-id',
    };
    const mockResponse = { url: 'http://mocked-url.com' };
    mock
      .onGet(
        `/bff/v1/notifications/received/${mockRequest.iun}/documents/${mockRequest.documentType}?documentId=${mockRequest.documentId}`
      )
      .reply(200, mockResponse);
    const action = await store.dispatch(getReceivedNotificationDocument(mockRequest));
    expect(action.type).toBe('getReceivedNotificationDocument/fulfilled');
    expect(action.payload).toEqual(mockResponse);
  });

  it('Should be able to fetch the notification legalfact', async () => {
    const mockRequest = {
      iun: notificationDTO.iun,
      documentType: NotificationDocumentType.LEGAL_FACT,
      documentId: 'mocked-key',
    };
    const mockResponse = { url: 'http://mocked-url.com' };
    mock
      .onGet(
        `/bff/v1/notifications/received/${mockRequest.iun}/documents/${mockRequest.documentType}?documentId=${mockRequest.documentId}`
      )
      .reply(200, mockResponse);
    const action = await store.dispatch(getReceivedNotificationDocument(mockRequest));
    expect(action.type).toBe('getReceivedNotificationDocument/fulfilled');
    expect(action.payload).toEqual(mockResponse);
  });

  it('Should be able to reset state', () => {
    const action = store.dispatch(resetState());
    expect(action.type).toBe('notificationSlice/resetState');
    expect(action.payload).toEqual(undefined);
    const state = store.getState().notificationState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to fetch the pagopa document', async () => {
    const iun = notificationDTO.iun;
    const attachmentName = PaymentAttachmentSName.PAGOPA;
    mock
      .onGet(`/bff/v1/notifications/received/${iun}/payments/${attachmentName}`)
      .reply(200, { url: 'http://pagopa-mocked-url.com' });
    const action = await store.dispatch(getReceivedNotificationPayment({ iun, attachmentName }));
    expect(action.type).toBe('getReceivedNotificationPayment/fulfilled');
    expect(action.payload).toEqual({ url: 'http://pagopa-mocked-url.com' });
  });

  it('Should be able to fetch the f24 document', async () => {
    const iun = notificationDTO.iun;
    const attachmentName = PaymentAttachmentSName.F24;
    mock
      .onGet(`/bff/v1/notifications/received/${iun}/payments/${attachmentName}`)
      .reply(200, { url: 'http://f24-mocked-url.com' });
    const action = await store.dispatch(getReceivedNotificationPayment({ iun, attachmentName }));
    expect(action.type).toBe('getReceivedNotificationPayment/fulfilled');
    expect(action.payload).toEqual({ url: 'http://f24-mocked-url.com' });
  });

  it('should save only payed payments (from timeline) if the notification is canceled', async () => {
    mock
      .onGet(`/bff/v1/notifications/received/${cancelledNotificationDTO.iun}`)
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

    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, paymentInfo);

    const paymentHistory = populatePaymentsPagoPaF24(
      notificationDTO.timeline,
      paymentsData.pagoPaF24,
      paymentInfo
    );
    const action = await mockedStore.dispatch(
      getReceivedNotificationPaymentInfo({ taxId: recipients[2].taxId, paymentInfoRequest })
    );
    const payload = action.payload;
    expect(action.type).toBe('getReceivedNotificationPaymentInfo/fulfilled');
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
      .onPost(`/bff/v1/payments/info`, paymentInfoRequest)
      .reply(200, [{ ...failedPayment, status: PaymentStatus.SUCCEEDED }]);

    const paymentHistory = populatePaymentsPagoPaF24(
      notificationToFe.timeline,
      paymentsData.pagoPaF24,
      [{ ...failedPayment!, status: PaymentStatus.SUCCEEDED }]
    );

    const actualState = mockedStore.getState().notificationState.paymentsData.pagoPaF24;

    const action = await mockedStore.dispatch(
      getReceivedNotificationPaymentInfo({ taxId: recipients[2].taxId, paymentInfoRequest })
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
    expect(action.type).toBe('getReceivedNotificationPaymentInfo/fulfilled');
    expect(payload).toStrictEqual(paymentHistory);
    const state = mockedStore.getState().notificationState.paymentsData.pagoPaF24;
    expect(state).toStrictEqual(newState);
  });

  it('Should be able to fetch payment info and not replace the payment if is equal', async () => {
    sessionStorage.removeItem(PAYMENT_CACHE_KEY);
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

    mock.onPost(`/bff/v1/payments/info`, paymentInfoRequest).reply(200, [failedPayment]);

    const paymentHistory = populatePaymentsPagoPaF24(
      notificationToFe.timeline,
      paymentsData.pagoPaF24,
      [failedPayment!]
    );

    const actualState = mockedStore.getState().notificationState.paymentsData.pagoPaF24;

    const action = await mockedStore.dispatch(
      getReceivedNotificationPaymentInfo({ taxId: recipients[2].taxId, paymentInfoRequest })
    );

    const newState = mockedStore.getState().notificationState.paymentsData.pagoPaF24;

    const payload = action.payload;
    expect(action.type).toBe('getReceivedNotificationPaymentInfo/fulfilled');
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
    mock.onPost(`/bff/v1/payments/cart`, request).reply(200, {
      checkoutUrl: 'mocked-url',
    });
    const action = await store.dispatch(getReceivedNotificationPaymentUrl(request));
    expect(action.type).toBe('getReceivedNotificationPaymentUrl/fulfilled');
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
    mock.onPost(`/bff/v1/payments/cart`, request).reply(errorMock.status, errorMock.data);
    const action = await store.dispatch(getReceivedNotificationPaymentUrl(request));
    expect(action.type).toBe('getReceivedNotificationPaymentUrl/rejected');
    expect(action.payload).toEqual({ response: errorMock });
    const state = store.getState().notificationState;
    expect(state.paymentsData.pagoPaF24).toStrictEqual(initialState);
  });

  it('Should be able to fetch the downtimes events', async () => {
    const mockRequest = {
      startDate: '2022-10-23T15:50:04Z',
    };
    mock
      .onGet(`/bff/v1/downtime/history?fromTime=${encodeURIComponent(mockRequest.startDate)}`)
      .reply(200, downtimesDTO);
    const action = await store.dispatch(getDowntimeHistory(mockRequest));
    expect(action.type).toBe('getNotificationDowntimeHistory/fulfilled');
    expect(action.payload).toEqual(downtimesDTO);
  });

  it('Should be able to fetch the downtimes legal fact details', async () => {
    const mockRequest = 'mocked-legalfact-id';
    const mockResponse = {
      filename: 'mocked-filename',
      contentLength: 0,
      url: 'mocked-url',
    };
    mock.onGet(`/bff/v1/downtime/legal-facts/${mockRequest}`).reply(200, mockResponse);
    const action = await store.dispatch(getDowntimeLegalFact(mockRequest));
    expect(action.type).toBe('getDowntimeLegalFact/fulfilled');
    expect(action.payload).toEqual(mockResponse);
  });

  it('Should be able to fetch the TPP payment URL', async () => {
    const mockRequest = {
      retrievalId: 'mocked-retrievalId',
      noticeCode: 'mocked-noticeCode',
      creditorTaxId: 'paTaxId',
      amount: 100,
    };
    const mockResponse = {
      paymentUrl: 'mocked-return-url',
    };
    mock
      .onGet(
        `/bff/v1/payments/tpp?retrievalId=${mockRequest.retrievalId}&noticeCode=${
          mockRequest.noticeCode
        }&paTaxId=${mockRequest.creditorTaxId}&amount=${mockRequest.amount.toString()}`
      )
      .reply(200, mockResponse);
    const action = await store.dispatch(getReceivedNotificationPaymentTppUrl(mockRequest));
    expect(action.type).toBe('getReceivedNotificationPaymentTppUrl/fulfilled');
    expect(action.payload).toEqual(mockResponse);
  });
});
