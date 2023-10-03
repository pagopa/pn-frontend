import MockAdapter from 'axios-mock-adapter';

import { PhysicalCommunicationType } from '@pagopa-pn/pn-commons';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { newNotification } from '../../../__mocks__/NewNotification.mock';
import { apiClient, externalClient } from '../../../api/apiClients';
import {
  CREATE_NOTIFICATION,
  GET_USER_GROUPS,
  NOTIFICATION_PRELOAD_DOCUMENT,
} from '../../../api/notifications/notifications.routes';
import { PaymentModel } from '../../../models/NewNotification';
import { GroupStatus } from '../../../models/user';
import { newNotificationMapper } from '../../../utility/notification.utility';
import { store } from '../../store';
import {
  createNewNotification,
  getUserGroups,
  uploadNotificationAttachment,
  uploadNotificationPaymentDocument,
} from '../actions';
import {
  resetState,
  saveRecipients,
  setAttachments,
  setCancelledIun,
  setIsCompleted,
  setPaymentDocuments,
  setPreliminaryInformations,
  setSenderInfos,
} from '../reducers';

const initialState = {
  loading: false,
  notification: {
    paProtocolNumber: '',
    subject: '',
    recipients: [],
    documents: [],
    payment: {},
    physicalCommunicationType: '',
    paymentMode: '',
    group: '',
    taxonomyCode: '',
    notificationFeePolicy: '',
  },
  groups: [],
  isCompleted: false,
};

describe('New notification redux state tests', () => {
  // eslint-disable-next-line functional/no-let
  let mock: MockAdapter;

  mockAuthentication();

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('Initial state', () => {
    const state = store.getState().newNotificationState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to set cancelled iun', () => {
    const action = store.dispatch(setCancelledIun('mocked-iun'));
    expect(action.type).toBe('newNotificationSlice/setCancelledIun');
    expect(action.payload).toEqual('mocked-iun');
  });

  it('Should be able to set sender infos', () => {
    const action = store.dispatch(
      setSenderInfos({ senderDenomination: 'mocked-denomination', senderTaxId: 'mocked-taxId' })
    );
    expect(action.type).toBe('newNotificationSlice/setSenderInfos');
    expect(action.payload).toEqual({
      senderDenomination: 'mocked-denomination',
      senderTaxId: 'mocked-taxId',
    });
  });

  it('Should be able to get user groups', async () => {
    const mockResponse = [
      { id: 'mocked-id', name: 'mocked-name', description: '', status: 'ACTIVE' as GroupStatus },
    ];
    mock.onGet(GET_USER_GROUPS()).reply(200, mockResponse);
    const action = await store.dispatch(getUserGroups());
    expect(action.type).toBe('getUserGroups/fulfilled');
    expect(action.payload).toEqual(mockResponse);
    expect(store.getState().newNotificationState.groups).toStrictEqual(mockResponse);
  });

  it('Should be able to set preliminary informations', () => {
    const preliminaryInformations = {
      paProtocolNumber: 'mocked-notificationId',
      subject: 'mocked-subject',
      abstract: '',
      physicalCommunicationType: PhysicalCommunicationType.REGISTERED_LETTER_890,
      group: '',
      taxonomyCode: '010801N',
      paymentMode: PaymentModel.PAGO_PA_NOTICE_F24,
    };
    const action = store.dispatch(setPreliminaryInformations(preliminaryInformations));
    expect(action.type).toBe('newNotificationSlice/setPreliminaryInformations');
    expect(action.payload).toEqual(preliminaryInformations);
  });

  it('Should be able to save recipients', () => {
    const action = store.dispatch(saveRecipients({ recipients: newNotification.recipients }));
    expect(action.type).toBe('newNotificationSlice/saveRecipients');
    expect(action.payload).toEqual({ recipients: newNotification.recipients });
  });

  it('Should be able to save attachemnts', () => {
    const action = store.dispatch(setAttachments({ documents: newNotification.documents }));
    expect(action.type).toBe('newNotificationSlice/setAttachments');
    expect(action.payload).toEqual({ documents: newNotification.documents });
  });

  it('Should be able to upload attachment', async () => {
    mock
      .onPost(
        NOTIFICATION_PRELOAD_DOCUMENT(),
        newNotification.documents.map((document) => ({
          key: document.name,
          contentType: document.file.data?.type,
          sha256: document.file.sha256.hashBase64,
        }))
      )
      .reply(
        200,
        newNotification.documents.map(() => ({
          url: 'https://mocked-url.com',
          secret: 'mocked-secret',
          httpMethod: 'POST',
          key: 'mocked-preload-key',
        }))
      );
    const extMock = new MockAdapter(externalClient);
    for (const document of newNotification.documents) {
      extMock.onPost(`https://mocked-url.com`).reply(200, document.file.data, {
        'x-amz-version-id': 'mocked-versionToken',
      });
    }
    const action = await store.dispatch(
      uploadNotificationAttachment(
        newNotification.documents.map((doc) => ({
          ...doc,
          ref: {
            versionToken: '',
            key: '',
          },
        }))
      )
    );
    expect(action.type).toBe('uploadNotificationAttachment/fulfilled');
    expect(action.payload).toEqual(
      newNotification.documents.map((document) => ({
        ...document,
        ref: {
          key: 'mocked-preload-key',
          versionToken: 'mocked-versionToken',
        },
      }))
    );
    extMock.restore();
  });

  it('Should be able to save payment documents', () => {
    const action = store.dispatch(
      setPaymentDocuments({ paymentDocuments: newNotification.payment! })
    );
    expect(action.type).toBe('newNotificationSlice/setPaymentDocuments');
    expect(action.payload).toEqual({ paymentDocuments: newNotification.payment! });
  });

  it('Should be able to upload payment document', async () => {
    mock
      .onPost(
        NOTIFICATION_PRELOAD_DOCUMENT(),
        Object.values(newNotification.payment!).reduce((arr, elem) => {
          if (elem.pagoPaForm) {
            arr.push({
              key: elem.pagoPaForm.name,
              contentType: elem.pagoPaForm.contentType,
              sha256: elem.pagoPaForm.file.sha256.hashBase64,
            });
          }
          if (elem.f24flatRate) {
            arr.push({
              key: elem.f24flatRate.name,
              contentType: elem.f24flatRate.contentType,
              sha256: elem.f24flatRate.file.sha256.hashBase64,
            });
          }
          if (elem.f24standard) {
            arr.push({
              key: elem.f24standard.name,
              contentType: elem.f24standard.contentType,
              sha256: elem.f24standard.file.sha256.hashBase64,
            });
          }
          return arr;
        }, [] as any)
      )
      .reply(200, [
        {
          url: 'https://mocked-url.com',
          secret: 'mocked-secret',
          httpMethod: 'POST',
          key: 'mocked-preload-key',
        },
        {
          url: 'https://mocked-url.com',
          secret: 'mocked-secret',
          httpMethod: 'POST',
          key: 'mocked-preload-key',
        },
        {
          url: 'https://mocked-url.com',
          secret: 'mocked-secret',
          httpMethod: 'POST',
          key: 'mocked-preload-key',
        },
      ]);
    const extMock = new MockAdapter(externalClient);
    for (const payment of Object.values(newNotification.payment!)) {
      if (payment.pagoPaForm) {
        extMock.onPost(`https://mocked-url.com`).reply(200, payment.pagoPaForm.file.data, {
          'x-amz-version-id': 'mocked-versionToken',
        });
      }
      if (payment.f24flatRate) {
        extMock.onPost(`https://mocked-url.com`).reply(200, payment.f24flatRate.file.data, {
          'x-amz-version-id': 'mocked-versionToken',
        });
      }
      if (payment.f24standard) {
        extMock.onPost(`https://mocked-url.com`).reply(200, payment.f24standard.file.data, {
          'x-amz-version-id': 'mocked-versionToken',
        });
      }
    }
    const action = await store.dispatch(
      uploadNotificationPaymentDocument(newNotification.payment!)
    );
    expect(action.type).toBe('uploadNotificationPaymentDocument/fulfilled');
    const response = {};
    for (const [key, value] of Object.entries(newNotification.payment!)) {
      response[key] = {};
      if (value.pagoPaForm) {
        response[key].pagoPaForm = {
          ...value.pagoPaForm,
          ref: {
            key: 'mocked-preload-key',
            versionToken: 'mocked-versionToken',
          },
        };
      }
      if (value.f24flatRate) {
        response[key].f24flatRate = {
          ...value.f24flatRate,
          ref: {
            key: 'mocked-preload-key',
            versionToken: 'mocked-versionToken',
          },
        };
      }
      if (value.f24standard) {
        response[key].f24standard = {
          ...value.f24standard,
          ref: {
            key: 'mocked-preload-key',
            versionToken: 'mocked-versionToken',
          },
        };
      }
    }
    expect(action.payload).toEqual(response);
    extMock.restore();
  });

  it('Should be able to set isCompleted status', () => {
    const action = store.dispatch(setIsCompleted());
    expect(action.type).toBe('newNotificationSlice/setIsCompleted');
    expect(action.payload).toEqual(void 0);
  });

  it('Should be able to create new notification', async () => {
    const mockResponse = {
      notificationRequestId: 'mocked-notificationRequestId',
      paProtocolNumber: 'mocked-paProtocolNumber',
      idempotenceToken: 'mocked-idempotenceToken',
    };
    const mappedNotification = newNotificationMapper(newNotification);
    mock.onPost(CREATE_NOTIFICATION(), mappedNotification).reply(200, mockResponse);
    const action = await store.dispatch(createNewNotification(newNotification));
    expect(action.type).toBe('createNewNotification/fulfilled');
    expect(action.payload).toEqual(mockResponse);
  });

  it('Should be able to reset state', () => {
    const action = store.dispatch(resetState());
    expect(action.type).toBe('newNotificationSlice/resetState');
    expect(action.payload).toEqual(undefined);
    const state = store.getState().newNotificationState;
    expect(state).toEqual(initialState);
  });
});
