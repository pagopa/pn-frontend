import { LegalFactType, NotificationDetail } from '@pagopa-pn/pn-commons';

import { store } from '../../store';
import { NotificationsApi } from '../../../api/notifications/Notifications.api';
import { mockAuthentication } from '../../auth/__test__/test-utils';
import {
  getSentNotification,
  getSentNotificationDocument,
  getSentNotificationLegalfact,
  getSentNotificationOtherDocument,
} from '../actions';
import { resetLegalFactState, resetState } from '../reducers';
import { notificationToFe } from './test-utils';

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
    timeline: []
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

  it('Initial state', () => {
    const state = store.getState().notificationState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to fetch the notification detail', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'getSentNotification');
    apiSpy.mockResolvedValue(notificationToFe);
    const action = await store.dispatch(getSentNotification('mocked-iun'));
    const payload = action.payload as NotificationDetail;
    expect(action.type).toBe('getSentNotification/fulfilled');
    expect(payload).toEqual(notificationToFe);
  });

  it('Should be able to fetch the notification document', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'getSentNotificationDocument');
    apiSpy.mockResolvedValue({ url: 'http://mocked-url.com' });
    const action = await store.dispatch(
      getSentNotificationDocument({ iun: 'mocked-iun', documentIndex: '0' })
    );
    const payload = action.payload;
    expect(action.type).toBe('getSentNotificationDocument/fulfilled');
    expect(payload).toEqual({ url: 'http://mocked-url.com' });
  });

  it('Should be able to fetch the notification legalfact', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'getSentNotificationLegalfact');
    apiSpy.mockResolvedValue({ url: 'http://mocked-url.com' });
    const action = await store.dispatch(
      getSentNotificationLegalfact({
        iun: 'mocked-iun',
        legalFact: { key: 'mocked-key', category: LegalFactType.ANALOG_DELIVERY },
      })
    );
    const payload = action.payload;
    expect(action.type).toBe('getSentNotificationLegalfact/fulfilled');
    expect(payload).toEqual({ url: 'http://mocked-url.com' });
  });

  it('Should be able to fetch the notification AAR document', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'getSentNotificationOtherDocument');
    apiSpy.mockResolvedValue({ url: 'http://mocked-url.com' });
    const action = await store.dispatch(
      getSentNotificationOtherDocument({
        iun: 'mocked-iun',
        otherDocument: {
          documentId: 'mocked-document-id',
          documentType: 'mocked-document-type',
        }
      })
    );
    const payload = action.payload;
    expect(action.type).toBe('getSentNotificationOtherDocument/fulfilled');
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
});
