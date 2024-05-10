import MockAdapter from 'axios-mock-adapter';

import { LegalFactType, NotificationDetail, PaymentAttachmentSName } from '@pagopa-pn/pn-commons';

import { downtimesDTO } from '../../../__mocks__/AppStatus.mock';
import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { notificationDTOMultiRecipient } from '../../../__mocks__/NotificationDetail.mock';
import { apiClient } from '../../../api/apiClients';
import {
  NOTIFICATION_DETAIL_DOCUMENTS,
  NOTIFICATION_DETAIL_LEGALFACT,
  NOTIFICATION_DETAIL_OTHER_DOCUMENTS,
  NOTIFICATION_PAYMENT_ATTACHMENT,
} from '../../../api/notifications/notifications.routes';
import { getDowntimeLegalFact } from '../../appStatus/actions';
import { store } from '../../store';
import {
  cancelNotification,
  getDowntimeHistory,
  getPaymentAttachment,
  getSentNotification,
  getSentNotificationDocument,
  getSentNotificationLegalfact,
  getSentNotificationOtherDocument,
} from '../actions';
import { resetLegalFactState, resetState } from '../reducers';

const initialState = {
  loading: false,
  notification: {
    subject: '',
    recipients: [],
    documents: [],
    otherDocuments: [],
    iun: '',
    sentAt: '',
    notificationStatus: '',
    notificationStatusHistory: [],
    timeline: [],
  },
  documentDownloadUrl: '',
  otherDocumentDownloadUrl: '',
  legalFactDownloadUrl: '',
  downtimeEvents: [],
};

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
    mock
      .onGet(`/bff/v1/notifications/sent/${notificationDTOMultiRecipient.iun}`)
      .reply(200, notificationDTOMultiRecipient);
    const action = await store.dispatch(getSentNotification(notificationDTOMultiRecipient.iun));
    const payload = action.payload as NotificationDetail;
    expect(action.type).toBe('getSentNotification/fulfilled');
    expect(payload).toEqual(notificationDTOMultiRecipient);
    expect(store.getState().notificationState.notification).toStrictEqual(
      notificationDTOMultiRecipient
    );
  });

  it('Should be able to fetch the notification document', async () => {
    const mockRequest = {
      iun: notificationDTOMultiRecipient.iun,
      documentIndex: '0',
    };
    const mockResponse = { url: 'http://mocked-url.com' };
    mock
      .onGet(NOTIFICATION_DETAIL_DOCUMENTS(mockRequest.iun, mockRequest.documentIndex))
      .reply(200, mockResponse);
    const action = await store.dispatch(getSentNotificationDocument(mockRequest));
    const payload = action.payload;
    expect(action.type).toBe('getSentNotificationDocument/fulfilled');
    expect(payload).toEqual(mockResponse);
  });

  it('Should be able to fetch the notification legalfact', async () => {
    const mockRequest = {
      iun: notificationDTOMultiRecipient.iun,
      legalFact: { key: 'mocked-key', category: LegalFactType.ANALOG_DELIVERY },
    };
    const mockResponse = { url: 'http://mocked-url.com' };
    mock
      .onGet(NOTIFICATION_DETAIL_LEGALFACT(mockRequest.iun, mockRequest.legalFact))
      .reply(200, mockResponse);
    const action = await store.dispatch(getSentNotificationLegalfact(mockRequest));
    const payload = action.payload;
    expect(action.type).toBe('getSentNotificationLegalfact/fulfilled');
    expect(payload).toEqual(mockResponse);
  });

  it('Should be able to fetch the notification AAR document', async () => {
    const mockRequest = {
      iun: notificationDTOMultiRecipient.iun,
      otherDocument: {
        documentId: 'mocked-document-id',
        documentType: 'mocked-document-type',
      },
    };
    const mockResponse = { url: 'http://mocked-url.com' };
    mock
      .onGet(NOTIFICATION_DETAIL_OTHER_DOCUMENTS(mockRequest.iun, mockRequest.otherDocument))
      .reply(200, mockResponse);
    const action = await store.dispatch(getSentNotificationOtherDocument(mockRequest));
    const payload = action.payload;
    expect(action.type).toBe('getSentNotificationOtherDocument/fulfilled');
    expect(payload).toEqual(mockResponse);
  });

  it('Should be able to fetch the pagopa document', async () => {
    const iun = notificationDTOMultiRecipient.iun;
    const attachmentName = PaymentAttachmentSName.PAGOPA;
    const recIndex = 1;
    const url = 'http://mocked-url.com';
    mock.onGet(NOTIFICATION_PAYMENT_ATTACHMENT(iun, attachmentName, recIndex)).reply(200, { url });
    const action = await store.dispatch(getPaymentAttachment({ iun, attachmentName, recIndex }));
    const payload = action.payload;
    expect(action.type).toBe('getPaymentAttachment/fulfilled');
    expect(payload).toEqual({ url });
  });

  it('Should be able to fetch the downtimes events', async () => {
    const mockRequest = {
      startDate: '2022-10-23T15:50:04Z',
    };
    mock
      .onGet(`/bff/v1/downtime/history?fromTime=${encodeURIComponent(mockRequest.startDate)}`)
      .reply(200, downtimesDTO);
    const action = await store.dispatch(getDowntimeHistory(mockRequest));
    const payload = action.payload;
    expect(action.type).toBe('getNotificationDowntimeHistory/fulfilled');
    expect(payload).toEqual(downtimesDTO);
    expect(store.getState().notificationState.downtimeEvents).toStrictEqual(downtimesDTO.result);
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
    const payload = action.payload;
    expect(action.type).toBe('getDowntimeLegalFact/fulfilled');
    expect(payload).toEqual(mockResponse);
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
    expect(state.legalFactDownloadUrl).toEqual('');
  });

  it('Should be able to cancel notification', async () => {
    mock.onPut('/bff/v1/notifications/sent/mocked-iun/cancel').reply(200);
    const action = await store.dispatch(cancelNotification('mocked-iun'));
    expect(action.type).toBe('cancelNotification/fulfilled');
    expect(action.payload).toEqual(undefined);
  });
});
