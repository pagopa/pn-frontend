import MockAdapter from 'axios-mock-adapter';

import { KnownFunctionality, LegalFactType, NotificationDetail } from '@pagopa-pn/pn-commons';
import {
  DOWNTIME_HISTORY,
  DOWNTIME_LEGAL_FACT_DETAILS,
} from '@pagopa-pn/pn-commons/src/api/appStatus/appStatus.routes';

import { downtimesDTO, simpleDowntimeLogPage } from '../../../__mocks__/AppStatus.mock';
import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import {
  notificationDTOMultiRecipient,
  notificationToFeMultiRecipient,
} from '../../../__mocks__/NotificationDetail.mock';
import { apiClient } from '../../../api/apiClients';
import {
  NOTIFICATION_DETAIL,
  NOTIFICATION_DETAIL_DOCUMENTS,
  NOTIFICATION_DETAIL_LEGALFACT,
  NOTIFICATION_DETAIL_OTHER_DOCUMENTS,
} from '../../../api/notifications/notifications.routes';
import { store } from '../../store';
import {
  getDowntimeEvents,
  getDowntimeLegalFactDocumentDetails,
  getSentNotification,
  getSentNotificationDocument,
  getSentNotificationLegalfact,
  getSentNotificationOtherDocument,
} from '../actions';
import { resetLegalFactState, resetState } from '../reducers';

const initialState = {
  loading: false,
  notification: {
    paProtocolNumber: '',
    subject: '',
    recipients: [],
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
  },
  documentDownloadUrl: '',
  otherDocumentDownloadUrl: '',
  legalFactDownloadUrl: '',
  legalFactDownloadRetryAfter: 0,
  downtimeLegalFactUrl: '',
  downtimeEvents: [],
};

describe('Notification detail redux state tests', () => {
  // eslint-disable-next-line functional/no-let
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
      .onGet(NOTIFICATION_DETAIL(notificationToFeMultiRecipient.iun))
      .reply(200, notificationDTOMultiRecipient);
    const action = await store.dispatch(getSentNotification(notificationToFeMultiRecipient.iun));
    const payload = action.payload as NotificationDetail;
    expect(action.type).toBe('getSentNotification/fulfilled');
    expect(payload).toEqual(notificationToFeMultiRecipient);
    expect(store.getState().notificationState.notification).toStrictEqual(
      notificationToFeMultiRecipient
    );
  });

  it('Should be able to fetch the notification document', async () => {
    const mockRequest = {
      iun: notificationToFeMultiRecipient.iun,
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
      iun: notificationToFeMultiRecipient.iun,
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
      iun: notificationToFeMultiRecipient.iun,
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
    const payload = action.payload;
    expect(action.type).toBe('getDowntimeEvents/fulfilled');
    expect(payload).toEqual(simpleDowntimeLogPage);
    expect(store.getState().notificationState.downtimeEvents).toStrictEqual(
      simpleDowntimeLogPage.downtimes
    );
  });

  it('Should be able to fetch the downtimes legal fact details', async () => {
    const mockResponse = {
      filename: 'mocked-filename',
      contentLength: 0,
      url: 'mocked-url',
    };
    mock
      .onGet(DOWNTIME_LEGAL_FACT_DETAILS(notificationToFeMultiRecipient.iun))
      .reply(200, mockResponse);
    const action = await store.dispatch(
      getDowntimeLegalFactDocumentDetails(notificationToFeMultiRecipient.iun)
    );
    const payload = action.payload;
    expect(action.type).toBe('getNotificationDowntimeLegalFactDocumentDetails/fulfilled');
    expect(payload).toEqual(mockResponse);
    expect(store.getState().notificationState.downtimeLegalFactUrl).toStrictEqual(mockResponse.url);
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
});
