import { KnownFunctionality, LegalFactType, NotificationDetail } from '@pagopa-pn/pn-commons';

import { store } from '../../store';
import { mockAuthentication } from '../../auth/__test__/test-utils';
import { downtimesFromBe, simpleDowntimeLogPage } from '../../appStatus/__test__/test-utils';
import {
  getDowntimeEvents,
  getDowntimeLegalFactDocumentDetails,
  getSentNotification,
  getSentNotificationDocument,
  getSentNotificationLegalfact,
  getSentNotificationOtherDocument,
} from '../actions';
import { resetLegalFactState, resetState } from '../reducers';
import { notificationFromBe, notificationToFe } from './test-utils';
import { mockApi } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import {
  NOTIFICATION_DETAIL,
  NOTIFICATION_DETAIL_DOCUMENTS,
  NOTIFICATION_DETAIL_LEGALFACT,
  NOTIFICATION_DETAIL_OTHER_DOCUMENTS,
} from '../../../api/notifications/notifications.routes';
import {
  DOWNTIME_HISTORY,
  DOWNTIME_LEGAL_FACT_DETAILS,
} from '@pagopa-pn/pn-commons/src/api/appStatus/appStatus.routes';
import MockAdapter from 'axios-mock-adapter';

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
  mockAuthentication();

  let mock: MockAdapter;

  afterEach(() => {
    if (mock) {
      mock.reset();
      mock.restore();
    }
  });

  it('Initial state', () => {
    const state = store.getState().notificationState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to fetch the notification detail', async () => {
    mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_DETAIL(notificationFromBe.iun),
      200,
      undefined,
      notificationFromBe
    );
    const action = await store.dispatch(getSentNotification(notificationFromBe.iun));
    const payload = action.payload as NotificationDetail;
    expect(action.type).toBe('getSentNotification/fulfilled');
    expect(payload).toEqual(notificationToFe);
    expect(store.getState().notificationState.notification).toStrictEqual(notificationToFe);
  });

  it('Should be able to fetch the notification document', async () => {
    const mockRequest = {
      iun: 'mocked-iun',
      documentIndex: '0',
    };
    const mockResponse = { url: 'http://mocked-url.com' };
    mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_DETAIL_DOCUMENTS(mockRequest.iun, mockRequest.documentIndex),
      200,
      undefined,
      mockResponse
    );
    const action = await store.dispatch(getSentNotificationDocument(mockRequest));
    const payload = action.payload;
    expect(action.type).toBe('getSentNotificationDocument/fulfilled');
    expect(payload).toEqual(mockResponse);
  });

  it('Should be able to fetch the notification legalfact', async () => {
    const mockRequest = {
      iun: 'mocked-iun',
      legalFact: { key: 'mocked-key', category: LegalFactType.ANALOG_DELIVERY },
    };
    const mockResponse = { url: 'http://mocked-url.com' };
    mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_DETAIL_LEGALFACT(mockRequest.iun, mockRequest.legalFact),
      200,
      undefined,
      mockResponse
    );
    const action = await store.dispatch(getSentNotificationLegalfact(mockRequest));
    const payload = action.payload;
    expect(action.type).toBe('getSentNotificationLegalfact/fulfilled');
    expect(payload).toEqual(mockResponse);
  });

  it('Should be able to fetch the notification AAR document', async () => {
    const mockRequest = {
      iun: 'mocked-iun',
      otherDocument: {
        documentId: 'mocked-document-id',
        documentType: 'mocked-document-type',
      },
    };
    const mockResponse = { url: 'http://mocked-url.com' };
    mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_DETAIL_OTHER_DOCUMENTS(mockRequest.iun, mockRequest.otherDocument),
      200,
      undefined,
      mockResponse
    );
    const action = await store.dispatch(getSentNotificationOtherDocument(mockRequest));
    const payload = action.payload;
    expect(action.type).toBe('getSentNotificationOtherDocument/fulfilled');
    expect(payload).toEqual(mockResponse);
  });

  it('Should be able to fetch the downtimes events', async () => {
    const mockRequest = {
      startDate: '2022-10-23T15:50:04Z',
    };
    mock = mockApi(
      apiClient,
      'GET',
      DOWNTIME_HISTORY({
        ...mockRequest,
        functionality: [
          KnownFunctionality.NotificationCreate,
          KnownFunctionality.NotificationVisualization,
          KnownFunctionality.NotificationWorkflow,
        ],
      }),
      200,
      undefined,
      downtimesFromBe
    );
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
    mock = mockApi(
      apiClient,
      'GET',
      DOWNTIME_LEGAL_FACT_DETAILS('mocked-iun'),
      200,
      undefined,
      mockResponse
    );
    const action = await store.dispatch(getDowntimeLegalFactDocumentDetails('mocked-iun'));
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
