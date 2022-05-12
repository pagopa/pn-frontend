import { PhysicalCommunicationType } from '@pagopa-pn/pn-commons';

import { NotificationsApi } from '../../../api/notifications/Notifications.api';
import { PaymentModel } from '../../../models/newNotification';
import { mockAuthentication } from '../../auth/__test__/reducers.test';
import { store } from '../../store';
import {
  resetNewNotificationState,
  setPreliminaryInformations,
  uploadNotificationDocument,
} from '../actions';

const initialState = {
  loading: false,
  notification: {
    paProtocolNumber: '',
    subject: '',
    cancelledIun: '',
    recipients: [],
    documents: [],
    physicalCommunicationType: '',
    paymentMode: '',
    group: '',
  },
};

describe('New notification redux state tests', () => {
  mockAuthentication();

  it('Initial state', () => {
    const state = store.getState().newNotificationState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to set preliminary informations', () => {
    const preliminaryInformations = {
      paProtocolNumber: 'mocked-notificationId',
      subject: 'mocked-subject',
      abstract: '',
      physicalCommunicationType: PhysicalCommunicationType.REGISTERED_LETTER_890,
      group: '',
      paymentModel: PaymentModel.PAGO_PA_NOTICE_F24,
    };
    const action = store.dispatch(setPreliminaryInformations(preliminaryInformations));
    const payload = action.payload;
    expect(action.type).toBe('setPreliminaryInformations');
    expect(payload).toEqual(preliminaryInformations);
  });

  it('Should be able to upload document', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'preloadNotificationDocument');
    apiSpy.mockResolvedValue([{ url: 'mocked-url', secret: 'mocked-secret', httpMethod: 'POST' }]);
    const nextApiSpy = jest.spyOn(NotificationsApi, 'uploadNotificationDocument');
    nextApiSpy.mockResolvedValue(void 0);
    const action = await store.dispatch(
      uploadNotificationDocument([{
        key: 'mocked-key',
        contentType: 'text/plain',
        fileBase64: 'mocked-fileBase64',
        sha256: 'mocked-sha256'
      }])
    );
    const payload = action.payload;
    expect(action.type).toBe('uploadNotificationDocument/fulfilled');
    expect(payload).toEqual([{
      digests: {
        sha256: 'mocked-sha256'
      },
      contentType: 'text/plain',
      ref: {
        key: 'mocked-key',
        versionToken: 'mocked-secret'
      }
    }]);
  });

  it('Should be able to reset state', () => {
    const action = store.dispatch(resetNewNotificationState());
    const payload = action.payload;
    expect(action.type).toBe('resetNewNotificationState');
    expect(payload).toEqual(undefined);
    const state = store.getState().newNotificationState;
    expect(state).toEqual(initialState);
  });
});
