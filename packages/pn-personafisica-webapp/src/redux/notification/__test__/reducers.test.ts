import { LegalFactType, NotificationDetail } from '@pagopa-pn/pn-commons/src/types/Notifications';
import { NotificationsApi } from '../../../api/notifications/Notifications.api';
import { mockAuthentication } from '../../auth/__test__/reducers.test';
import { store } from '../../store';
import {
  getSentNotification,
  getSentNotificationDocument,
  getSentNotificationLegalfact,
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
      getSentNotificationDocument({ iun: 'mocked-iun', documentIndex: 0 })
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
        legalFact: { key: 'mocked-key', type: LegalFactType.ANALOG_DELIVERY },
      })
    );
    const payload = action.payload;
    expect(action.type).toBe('getSentNotificationLegalfact/fulfilled');
    expect(payload).toEqual({ url: 'http://mocked-url.com' });
  });
});
