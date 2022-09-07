import {
  DigitalDomicileType,
  PhysicalCommunicationType,
  RecipientType,
} from '@pagopa-pn/pn-commons';

import { NotificationsApi } from '../../../api/notifications/Notifications.api';
import { PaymentModel } from '../../../models/NewNotification';
import { GroupStatus } from '../../../models/user';
import { mockAuthentication } from '../../auth/__test__/test-utils';
import { store } from '../../store';
import {
  createNewNotification,
  uploadNotificationAttachment,
  uploadNotificationPaymentDocument,
  getUserGroups,
} from '../actions';
import {
  setCancelledIun,
  setPreliminaryInformations,
  setSenderInfos,
  saveRecipients,
  setAttachments,
  resetState,
  setPaymentDocuments,
} from '../reducers';
import { newNotification, newNotificationDocument } from './test-utils';

const initialState = {
  loading: false,
  notification: {
    paProtocolNumber: '',
    subject: '',
    cancelledIun: '',
    recipients: [],
    documents: [],
    payment: {},
    physicalCommunicationType: '',
    paymentMode: '',
    group: '',
    notificationFeePolicy: '',
  },
  groups: [],
  isCompleted: false,
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
    expect(action.type).toBe('newNotificationSlice/setCancelledIun');
    expect(payload).toEqual('mocked-iun');
  });

  it('Should be able to set sender infos', () => {
    const action = store.dispatch(
      setSenderInfos({ senderDenomination: 'mocked-denomination', senderTaxId: 'mocked-taxId' })
    );
    const payload = action.payload;
    expect(action.type).toBe('newNotificationSlice/setSenderInfos');
    expect(payload).toEqual({
      senderDenomination: 'mocked-denomination',
      senderTaxId: 'mocked-taxId',
    });
  });

  it('Should be able to get user groups', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'getUserGroups');
    apiSpy.mockResolvedValue([
      { id: 'mocked-id', name: 'mocked-name', description: '', status: 'ACTIVE' as GroupStatus },
    ]);
    const action = await store.dispatch(getUserGroups());
    const payload = action.payload;
    expect(action.type).toBe('getUserGroups/fulfilled');
    expect(payload).toEqual([
      { id: 'mocked-id', name: 'mocked-name', description: '', status: 'ACTIVE' },
    ]);
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
    expect(action.type).toBe('newNotificationSlice/setPreliminaryInformations');
    expect(payload).toEqual(preliminaryInformations);
  });

  it('Should be able to save recipients', () => {
    const recipients = [
      {
        idx: 0,
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
        foreignState: 'mocked-foreignState',
      },
    ];
    const action = store.dispatch(saveRecipients({ recipients }));
    const payload = action.payload;
    expect(action.type).toBe('newNotificationSlice/saveRecipients');
    expect(payload).toEqual({ recipients });
  });

  it('Should be able to save attachemnts', () => {
    const documents = [
      {
        ...newNotificationDocument,
        file: {
          ...newNotificationDocument.file,
          uint8Array: new Uint8Array(),
          contentType: 'text/plain',
          sha256: {
            ...newNotificationDocument.file.sha256,
            hashBase64: 'mocked-sha256',
          },
        },
      },
    ];
    const action = store.dispatch(setAttachments({ documents }));
    const payload = action.payload;
    expect(action.type).toBe('newNotificationSlice/setAttachments');
    expect(payload).toEqual({ documents });
  });

  it('Should be able to upload attachment', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'preloadNotificationDocument');
    apiSpy.mockResolvedValue([
      { url: 'mocked-url', secret: 'mocked-secret', httpMethod: 'POST', key: 'mocked-preload-key' },
    ]);
    const nextApiSpy = jest.spyOn(NotificationsApi, 'uploadNotificationAttachment');
    nextApiSpy.mockResolvedValue('mocked-versionToken');
    const action = await store.dispatch(
      uploadNotificationAttachment([
        {
          ...newNotificationDocument,
          file: {
            ...newNotificationDocument.file,
            uint8Array: new Uint8Array(),
            contentType: 'text/plain',
            sha256: {
              ...newNotificationDocument.file.sha256,
              hashBase64: 'mocked-sha256',
            },
          },
        },
      ])
    );
    const payload = action.payload;
    expect(action.type).toBe('uploadNotificationAttachment/fulfilled');
    expect(payload).toEqual([
      {
        ...newNotificationDocument,
        file: {
          ...newNotificationDocument.file,
          uint8Array: new Uint8Array(),
          contentType: 'text/plain',
          sha256: {
            ...newNotificationDocument.file.sha256,
            hashBase64: 'mocked-sha256',
          },
        },
        ref: {
          key: 'mocked-preload-key',
          versionToken: 'mocked-versionToken',
        },
      },
    ]);
  });

  it('Should be able to save payment documents', () => {
    const paymentDocuments = {
      'mocked-taxId': {
        pagoPaForm: {
          ...newNotificationDocument,
          file: {
            ...newNotificationDocument.file,
            uint8Array: new Uint8Array(),
            contentType: 'text/plain',
            sha256: {
              ...newNotificationDocument.file.sha256,
              hashBase64: 'mocked-sha256',
            },
          },
        },
        f24flatRate: {...newNotificationDocument},
        f24standard: {...newNotificationDocument},
      },
    };
    const action = store.dispatch(setPaymentDocuments({ paymentDocuments }));
    const payload = action.payload;
    expect(action.type).toBe('newNotificationSlice/setPaymentDocuments');
    expect(payload).toEqual({ paymentDocuments });
  });

  it('Should be able to upload payment document', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'preloadNotificationDocument');
    apiSpy.mockResolvedValue([
      { url: 'mocked-url', secret: 'mocked-secret', httpMethod: 'POST', key: 'mocked-preload-key' },
      { url: 'mocked-url', secret: 'mocked-secret', httpMethod: 'POST', key: 'mocked-preload-key' },
    ]);
    const nextApiSpy = jest.spyOn(NotificationsApi, 'uploadNotificationAttachment');
    nextApiSpy.mockResolvedValue('mocked-versionToken');
    const action = await store.dispatch(
      uploadNotificationPaymentDocument({
        'mocked-taxId': {
          pagoPaForm: {
            ...newNotificationDocument,
            file: {
              ...newNotificationDocument.file,
              uint8Array: new Uint8Array(),
              contentType: 'text/plain',
              sha256: {
                ...newNotificationDocument.file.sha256,
                hashBase64: 'mocked-pa-sha256',
              },
            },
            ref: {
              versionToken: '',
              key: ''
            }
          },
          f24flatRate: {...newNotificationDocument},
          f24standard: {
            ...newNotificationDocument,
            file: {
              ...newNotificationDocument.file,
              uint8Array: new Uint8Array(),
              contentType: 'text/plain',
              sha256: {
                ...newNotificationDocument.file.sha256,
                hashBase64: 'mocked-f24-sha256',
              },
            },
            ref: {
              versionToken: '',
              key: ''
            }
          },
        },
      })
    );
    const payload = action.payload;
    expect(action.type).toBe('uploadNotificationPaymentDocument/fulfilled');
    expect(payload).toEqual(
      {
        'mocked-taxId': {
          pagoPaForm: {
            ...newNotificationDocument,
            file: {
              ...newNotificationDocument.file,
              uint8Array: new Uint8Array(),
              contentType: 'text/plain',
              sha256: {
                ...newNotificationDocument.file.sha256,
                hashBase64: 'mocked-pa-sha256',
              },
            },
            ref: {
              key: 'mocked-preload-key',
              versionToken: 'mocked-versionToken',
            },
          },
          f24flatRate: {...newNotificationDocument},
          f24standard: {
            ...newNotificationDocument,
            file: {
              ...newNotificationDocument.file,
              uint8Array: new Uint8Array(),
              contentType: 'text/plain',
              sha256: {
                ...newNotificationDocument.file.sha256,
                hashBase64: 'mocked-f24-sha256',
              },
            },
            ref: {
              key: 'mocked-preload-key',
              versionToken: 'mocked-versionToken',
            },
          },
        },
      }
    );
  });

  it('Should be able to create new notification', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'createNewNotification');
    apiSpy.mockResolvedValue({
      notificationRequestId: 'mocked-notificationRequestId',
      paProtocolNumber: 'mocked-paProtocolNumber',
      idempotenceToken: 'mocked-idempotenceToken',
    });
    const action = await store.dispatch(createNewNotification(newNotification));
    const payload = action.payload;
    expect(action.type).toBe('createNewNotification/fulfilled');
    expect(payload).toEqual({
      notificationRequestId: 'mocked-notificationRequestId',
      paProtocolNumber: 'mocked-paProtocolNumber',
      idempotenceToken: 'mocked-idempotenceToken',
    });
  });

  it('Should be able to reset state', () => {
    const action = store.dispatch(resetState());
    const payload = action.payload;
    expect(action.type).toBe('newNotificationSlice/resetState');
    expect(payload).toEqual(undefined);
    const state = store.getState().newNotificationState;
    expect(state).toEqual(initialState);
  });
});
