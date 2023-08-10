import {
  LegalFactId,
  LegalFactType,
  NotificationDetail,
  NotificationDetailOtherDocument,
} from '@pagopa-pn/pn-commons';
import MockAdapter from 'axios-mock-adapter';
import {
  notificationDTOMultiRecipient,
  notificationToFeMultiRecipient,
} from '../../../__mocks__/NotificationDetail.mock';
import { mockApi } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AppStatusApi } from '../../../api/appStatus/AppStatus.api';
import {
  NOTIFICATION_DETAIL,
  NOTIFICATION_DETAIL_DOCUMENTS,
  NOTIFICATION_DETAIL_LEGALFACT,
  NOTIFICATION_DETAIL_OTHER_DOCUMENTS,
} from '../../../api/notifications/notifications.routes';
import { simpleDowntimeLogPage } from '../../appStatus/__test__/test-utils';
import { mockAuthentication } from '../../auth/__test__/test-utils';
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
  paymentInfo: [],
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
    const iun = notificationDTOMultiRecipient.iun;
    mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATION_DETAIL(iun),
      200,
      undefined,
      notificationDTOMultiRecipient
    );
    const action = await store.dispatch(getSentNotification(notificationDTOMultiRecipient.iun));

    const payload = action.payload as NotificationDetail;
    expect(action.type).toBe('getSentNotification/fulfilled');
    expect(payload).toEqual(notificationToFeMultiRecipient);
  });

  it('Should be able to fetch the notification document', async () => {
    const iun = notificationDTOMultiRecipient.iun;
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
    const action = await store.dispatch(getSentNotificationDocument({ iun, documentIndex }));
    const payload = action.payload;
    expect(action.type).toBe('getSentNotificationDocument/fulfilled');
    expect(payload).toEqual({ url });
  });

  it('Should be able to fetch the notification legalfact', async () => {
    const iun = notificationDTOMultiRecipient.iun;
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
      getSentNotificationLegalfact({
        iun,
        legalFact,
      })
    );
    const payload = action.payload;
    expect(action.type).toBe('getSentNotificationLegalfact/fulfilled');
    expect(payload).toEqual({ url });
  });

  it('Should be able to fetch the notification AAR document', async () => {
    const iun = notificationDTOMultiRecipient.iun;
    const otherDocument: NotificationDetailOtherDocument = {
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
      getSentNotificationOtherDocument({
        iun,
        otherDocument,
      })
    );
    const payload = action.payload;
    expect(action.type).toBe('getSentNotificationOtherDocument/fulfilled');
    expect(payload).toEqual({ url });
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
