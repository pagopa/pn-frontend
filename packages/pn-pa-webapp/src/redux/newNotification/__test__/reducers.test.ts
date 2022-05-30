import { PhysicalCommunicationType } from '@pagopa-pn/pn-commons';

import { NotificationsApi } from '../../../api/notifications/Notifications.api';
import { PaymentModel } from '../../../models/newNotification';
import { mockAuthentication } from '../../auth/__test__/reducers.test';
import { store } from '../../store';
import {
  resetNewNotificationState,
  setCancelledIun,
  setPreliminaryInformations,
  uploadNotificationAttachment,
  uploadNotificationPaymentDocument,
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
    notificationFeePolicy: '',
  },
};

describe('New notification redux state tests', () => {
  mockAuthentication();

  it('Initial state', () => {
    const state = store.getState().newNotificationState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to set cancelled iun', () => {
    const action = store.dispatch(setCancelledIun('mocked-iun'));
    const payload = action.payload;
    expect(action.type).toBe('setCancelledIun');
    expect(payload).toEqual('mocked-iun');
  });

  it('Should be able to set preliminary informations', () => {
    const preliminaryInformations = {
      paProtocolNumber: 'mocked-notificationId',
      subject: 'mocked-subject',
      abstract: '',
      physicalCommunicationType: PhysicalCommunicationType.REGISTERED_LETTER_890,
      group: '',
      paymentMode: PaymentModel.PAGO_PA_NOTICE_F24,
    };
    const action = store.dispatch(setPreliminaryInformations(preliminaryInformations));
    const payload = action.payload;
    expect(action.type).toBe('setPreliminaryInformations');
    expect(payload).toEqual(preliminaryInformations);
  });

  it('Should be able to upload attachment', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'preloadNotificationDocument');
    apiSpy.mockResolvedValue([{ url: 'mocked-url', secret: 'mocked-secret', httpMethod: 'POST' }]);
    const nextApiSpy = jest.spyOn(NotificationsApi, 'uploadNotificationAttachment');
    nextApiSpy.mockResolvedValue('mocked-versionToken');
    const action = await store.dispatch(
      uploadNotificationAttachment([
        {
          key: 'mocked-key',
          contentType: 'text/plain',
          file: new Uint8Array(),
          sha256: 'mocked-sha256',
        },
      ])
    );
    const payload = action.payload;
    expect(action.type).toBe('uploadNotificationAttachment/fulfilled');
    expect(payload).toEqual([
      {
        digests: {
          sha256: 'mocked-sha256',
        },
        contentType: 'text/plain',
        ref: {
          key: 'mocked-key',
          versionToken: 'mocked-versionToken',
        },
      },
    ]);
  });

  it('Should be able to upload payment document', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'preloadNotificationDocument');
    apiSpy.mockResolvedValue([
      { url: 'mocked-url', secret: 'mocked-secret', httpMethod: 'POST' },
      { url: 'mocked-url', secret: 'mocked-secret', httpMethod: 'POST' },
    ]);
    const nextApiSpy = jest.spyOn(NotificationsApi, 'uploadNotificationAttachment');
    nextApiSpy.mockResolvedValue('mocked-versionToken');
    const action = await store.dispatch(
      uploadNotificationPaymentDocument({
        'mocked-taxId': {
          pagoPaForm: {
            key: 'mocked-key',
            contentType: 'text/plain',
            file: new Uint8Array(),
            sha256: 'mocked-pa-sha256',
          },
          f24flatRate: {
            key: 'mocked-key',
            contentType: 'text/plain',
            file: undefined,
            sha256: '',
          },
          f24standard: {
            key: 'mocked-key',
            contentType: 'text/plain',
            file: new Uint8Array(),
            sha256: 'mocked-f24-sha256',
          },
        },
      })
    );
    const payload = action.payload;
    expect(action.type).toBe('uploadNotificationPaymentDocument/fulfilled');
    expect(payload).toEqual({
      'mocked-taxId': {
        pagoPaForm: {
          digests: {
            sha256: 'mocked-pa-sha256',
          },
          contentType: 'text/plain',
          ref: {
            key: 'mocked-key',
            versionToken: 'mocked-versionToken',
          },
        },
        f24flatRate: undefined,
        f24standard: {
          digests: {
            sha256: 'mocked-f24-sha256',
          },
          contentType: 'text/plain',
          ref: {
            key: 'mocked-key',
            versionToken: 'mocked-versionToken',
          },
        },
      },
    });
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
