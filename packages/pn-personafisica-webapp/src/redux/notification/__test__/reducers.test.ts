import { LegalFactType, NotificationDetail } from '@pagopa-pn/pn-commons';
import { NotificationsApi } from '../../../api/notifications/Notifications.api';
import { mockAuthentication } from '../../auth/__test__/reducers.test';
import { store } from '../../store';
import {
  getReceivedNotification,
  getReceivedNotificationDocument,
  getReceivedNotificationLegalfact,
} from '../actions';
import { notificationToFe } from './test-utils';

describe('Notification detail redux state tests', () => {
  mockAuthentication();

  it('Initial state', () => {
    const state = store.getState().notificationState;
    expect(state).toEqual({
      loading: false,
      notification: {
        iun: '',
        paNotificationId: '',
        subject: '',
        sentAt: '',
        cancelledIun: '',
        cancelledByIun: '',
        recipients: [],
        documents: [],
        payment: {},
        notificationStatus: '',
        notificationStatusHistory: [],
        timeline: [],
        physicalCommunicationType: '',
      },
      documentDownloadUrl: '',
      legalFactDownloadUrl: '',
    });
  });

  it('Should be able to fetch the notification detail', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'getReceivedNotification');
    apiSpy.mockResolvedValue(notificationToFe);
    const action = await store.dispatch(getReceivedNotification('mocked-iun'));
    const payload = action.payload as NotificationDetail;
    expect(action.type).toBe('getReceivedNotification/fulfilled');
    expect(payload).toEqual(notificationToFe);
  });

  it('Should be able to fetch the notification document', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'getReceivedNotificationDocument');
    apiSpy.mockResolvedValue({ url: 'http://mocked-url.com' });
    const action = await store.dispatch(
      getReceivedNotificationDocument({ iun: 'mocked-iun', documentIndex: 0 })
    );
    const payload = action.payload;
    expect(action.type).toBe('getReceivedNotificationDocument/fulfilled');
    expect(payload).toEqual({ url: 'http://mocked-url.com' });
  });

  it('Should be able to fetch the notification legalfact', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'getReceivedNotificationLegalfact');
    apiSpy.mockResolvedValue({ url: 'http://mocked-url.com' });
    const action = await store.dispatch(
      getReceivedNotificationLegalfact({
        iun: 'mocked-iun',
        legalFact: { key: 'mocked-key', type: LegalFactType.ANALOG_DELIVERY },
      })
    );
    const payload = action.payload;
    expect(action.type).toBe('getReceivedNotificationLegalfact/fulfilled');
    expect(payload).toEqual({ url: 'http://mocked-url.com' });
  });
});
