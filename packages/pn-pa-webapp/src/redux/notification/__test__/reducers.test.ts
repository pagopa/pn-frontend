import MockAdapter from 'axios-mock-adapter';

import {
  NotificationDetail,
  NotificationDocumentType,
  PaymentAttachmentSName,
} from '@pagopa-pn/pn-commons';

import { downtimesDTO } from '../../../__mocks__/AppStatus.mock';
import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { notificationDTOMultiRecipient } from '../../../__mocks__/NotificationDetail.mock';
import { apiClient } from '../../../api/apiClients';
import { getDowntimeLegalFact } from '../../appStatus/actions';
import { store } from '../../store';
import {
  cancelNotification,
  getDowntimeHistory,
  getSentNotification,
  getSentNotificationDocument,
  getSentNotificationPayment,
} from '../actions';
import { resetState } from '../reducers';

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
      documentType: NotificationDocumentType.ATTACHMENT,
      documentIdx: 0,
    };
    const mockResponse = { url: 'http://mocked-url.com' };
    mock
      .onGet(
        `/bff/v1/notifications/sent/${mockRequest.iun}/documents/${mockRequest.documentType}?documentIdx=${mockRequest.documentIdx}`
      )
      .reply(200, mockResponse);
    const action = await store.dispatch(getSentNotificationDocument(mockRequest));
    const payload = action.payload;
    expect(action.type).toBe('getSentNotificationDocument/fulfilled');
    expect(payload).toEqual(mockResponse);
  });

  it('Should be able to fetch the notification legalfact', async () => {
    const mockRequest = {
      iun: notificationDTOMultiRecipient.iun,
      documentType: NotificationDocumentType.LEGAL_FACT,
      documentId: 'mocked-key',
    };
    const mockResponse = { url: 'http://mocked-url.com' };
    mock
      .onGet(
        `/bff/v1/notifications/sent/${mockRequest.iun}/documents/${mockRequest.documentType}?documentId=${mockRequest.documentId}`
      )
      .reply(200, mockResponse);
    const action = await store.dispatch(getSentNotificationDocument(mockRequest));
    const payload = action.payload;
    expect(action.type).toBe('getSentNotificationDocument/fulfilled');
    expect(payload).toEqual(mockResponse);
  });

  it('Should be able to fetch the notification AAR document', async () => {
    const mockRequest = {
      iun: notificationDTOMultiRecipient.iun,
      documentType: NotificationDocumentType.AAR,
      documentId: 'mocked-document-id',
    };
    const mockResponse = { url: 'http://mocked-url.com' };
    mock
      .onGet(
        `/bff/v1/notifications/sent/${mockRequest.iun}/documents/${mockRequest.documentType}?documentId=${mockRequest.documentId}`
      )
      .reply(200, mockResponse);
    const action = await store.dispatch(getSentNotificationDocument(mockRequest));
    const payload = action.payload;
    expect(action.type).toBe('getSentNotificationDocument/fulfilled');
    expect(payload).toEqual(mockResponse);
  });

  it('Should be able to fetch the pagopa document', async () => {
    const iun = notificationDTOMultiRecipient.iun;
    const attachmentName = PaymentAttachmentSName.PAGOPA;
    const recIndex = 1;
    const url = 'http://mocked-url.com';
    mock
      .onGet(`/bff/v1/notifications/sent/${iun}/payments/${recIndex}/${attachmentName}`)
      .reply(200, { url });
    const action = await store.dispatch(
      getSentNotificationPayment({ iun, attachmentName, recIndex })
    );
    const payload = action.payload;
    expect(action.type).toBe('getSentNotificationPayment/fulfilled');
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

  it('Should be able to cancel notification', async () => {
    mock.onPut('/bff/v1/notifications/sent/mocked-iun/cancel').reply(200);
    const action = await store.dispatch(cancelNotification('mocked-iun'));
    expect(action.type).toBe('cancelNotification/fulfilled');
    expect(action.payload).toEqual(undefined);
  });
});
