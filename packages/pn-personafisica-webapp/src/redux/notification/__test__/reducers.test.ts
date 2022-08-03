import { LegalFactType, NotificationDetail, RecipientType } from '@pagopa-pn/pn-commons';
import { NotificationsApi } from '../../../api/notifications/Notifications.api';
import { mockAuthentication } from '../../auth/__test__/reducers.test';
import { store } from '../../store';
import {
  getReceivedNotification,
  getReceivedNotificationDocument,
  getReceivedNotificationLegalfact,
} from '../actions';
import { resetState } from '../reducers';
import { notificationToFe } from './test-utils';

const initialState = {
  loading: false,
  notification: {
    paProtocolNumber: '',
    subject: '',
    recipients: [],
    senderDenomination: '',
    paymentExpirationDate: '',
    documents: [],
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
  legalFactDownloadUrl: '',
  pagopaAttachmentUrl: '',
  f24AttachmentUrl: '',
  paymentInfo: {},
};

describe('Notification detail redux state tests', () => {
  mockAuthentication();

  it('Initial state', () => {
    const state = store.getState().notificationState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to fetch the notification detail', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'getReceivedNotification');
    apiSpy.mockResolvedValue(notificationToFe);
    const action = await store.dispatch(
      getReceivedNotification({
        iun: 'mocked-iun',
        currentUserTaxId: 'CGNNMO80A03H501U' ,
        delegatorsFromStore: []
      })
    );
    const payload = action.payload as NotificationDetail;
    expect(action.type).toBe('getReceivedNotification/fulfilled');
    expect(payload).toEqual(notificationToFe);
  });

  it('Should be able to fetch the notification document', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'getReceivedNotificationDocument');
    apiSpy.mockResolvedValue({ url: 'http://mocked-url.com' });
    const action = await store.dispatch(
      getReceivedNotificationDocument({ iun: 'mocked-iun', documentIndex: '0' })
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
        legalFact: { key: 'mocked-key', category: LegalFactType.ANALOG_DELIVERY },
      })
    );
    const payload = action.payload;
    expect(action.type).toBe('getReceivedNotificationLegalfact/fulfilled');
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
});
