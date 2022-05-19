import { DigitalDomicileType, PhysicalCommunicationType, RecipientType } from '@pagopa-pn/pn-commons';

import { NotificationsApi } from '../../../api/notifications/Notifications.api';
import { PaymentModel } from '../../../models/newNotification';
import { mockAuthentication } from '../../auth/__test__/reducers.test';
import { store } from '../../store';
import {
  resetNewNotificationState,
  setCancelledIun,
  setPreliminaryInformations,
  uploadNotificationDocument,
  createNewNotification,
  saveRecipients
} from '../actions';
import { newNotification } from './test-utils';

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
      paymentModel: PaymentModel.PAGO_PA_NOTICE_F24,
    };
    const action = store.dispatch(setPreliminaryInformations(preliminaryInformations));
    const payload = action.payload;
    expect(action.type).toBe('setPreliminaryInformations');
    expect(payload).toEqual(preliminaryInformations);
  });

  it('Should be able to save recipients', () => {
    const recipients = [{
      recipientType: RecipientType.PF,
      taxId: 'mocked-taxId',
      creditorTaxId: 'mocked-creditorTaxId',
      noticeCode: 'mocked-noticeCode',
      firstName: 'mocked-firstName',
      lastName: 'mocked-lastName',
      type: DigitalDomicileType.EMAIL,
      digitalDomicile: 'mocked@mail.com',
      address: 'mocked-address',
      houseNumber: 'mocked-houseNumber',
      zip: 'mocked-zip',
      municipality: 'mocked-municipality',
      province: 'mocked-province',
      foreignState: 'mocked-foreignState'
    }];
    const action = store.dispatch(saveRecipients({recipients}));
    const payload = action.payload;
    expect(action.type).toBe('saveRecipients');
    expect(payload).toEqual({recipients});
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

  it('Should be able to create new notification', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'createNewNotification');
    apiSpy.mockResolvedValue({
      notificationRequestId: 'mocked-notificationRequestId',
      paProtocolNumber: 'mocked-paProtocolNumber',
      idempotenceToken: 'mocked-idempotenceToken'
    });
    const action = await store.dispatch(createNewNotification(newNotification));
    const payload = action.payload;
    expect(action.type).toBe('createNewNotification/fulfilled');
    expect(payload).toEqual({
      notificationRequestId: 'mocked-notificationRequestId',
      paProtocolNumber: 'mocked-paProtocolNumber',
      idempotenceToken: 'mocked-idempotenceToken'
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
